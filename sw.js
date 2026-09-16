/* Moje cesta — service worker.
   Cíl: appka přidaná na plochu funguje bez signálu (hotel, letadlo, metro).

   Strategie:
   - PRECACHE při instalaci: obal (cesta.html, index.html, manifest, ikony)
     + všech 16 JSONů z data/. Jeden nákup, pak je všechno offline.
   - HTML a JSON: network-first s timeoutem → při výpadku sáhne do cache.
     Online se tím chová jako dřív (no-cache), Bobův push je hned vidět.
   - Assety a fonty (Google Fonts): cache-first, na pozadí se obnoví.
   VERSION bumpni, když měníš tenhle soubor nebo seznam PRECACHE. */

var VERSION  = "mc-v1";
var SHELL    = "mc-shell-" + VERSION;
var RUNTIME  = "mc-runtime-" + VERSION;
var NET_TIMEOUT = 4000;

var DATA_FILES = [
  "clusters.json","feelings.json","reframings.json","reframing_questions.json",
  "reframing_actions.json","crisis.json","body.json","exercises.json",
  "sections.json","chains.json","fears.json","situations.json","pains.json",
  "inspirations.json","questions.json","articles.json"
];

var PRECACHE = ["./","./index.html","./cesta.html","./manifest.json",
  "./assets/icon-192.png","./assets/icon-512.png"]
  .concat(DATA_FILES.map(function(f){ return "./data/" + f; }));

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(SHELL).then(function(c){
      // Po jednom: jeden 404 nesmí shodit celou instalaci.
      return Promise.all(PRECACHE.map(function(u){
        return c.add(new Request(u, {cache:"reload"})).catch(function(){});
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        return (k.indexOf("mc-") === 0 && k.indexOf(VERSION) < 0) ? caches.delete(k) : null;
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

function fromNetwork(req, cacheName, timeout){
  return new Promise(function(resolve, reject){
    var done = false;
    var t = timeout ? setTimeout(function(){ if(!done){ done = true; reject(new Error("timeout")); } }, timeout) : null;
    fetch(req).then(function(res){
      if(t) clearTimeout(t);
      if(res && (res.ok || res.type === "opaque")){
        var copy = res.clone();
        caches.open(cacheName).then(function(c){ c.put(req, copy); });
      }
      if(!done){ done = true; resolve(res); }
    }).catch(function(err){
      if(t) clearTimeout(t);
      if(!done){ done = true; reject(err); }
    });
  });
}

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;

  var url;
  try { url = new URL(req.url); } catch(err){ return; }
  if(url.protocol.indexOf("http") !== 0) return;

  var sameOrigin = url.origin === self.location.origin;
  var isFont = url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com";
  if(!sameOrigin && !isFont) return;

  // Fonty a obrázky: cache-first, obnova na pozadí.
  if(isFont || /\.(png|jpg|jpeg|svg|webp|woff2?|ttf)$/i.test(url.pathname)){
    e.respondWith(
      caches.match(req).then(function(hit){
        if(hit){ fromNetwork(req, RUNTIME).catch(function(){}); return hit; }
        return fromNetwork(req, RUNTIME).catch(function(){ return caches.match(req); });
      })
    );
    return;
  }

  // HTML a JSON: network-first, cache jako záchranná síť.
  e.respondWith(
    fromNetwork(req, SHELL, NET_TIMEOUT).catch(function(){
      return caches.match(req).then(function(hit){
        if(hit) return hit;
        // Navigace bez cache → aspoň obal appky.
        if(req.mode === "navigate") return caches.match("./cesta.html");
        return new Response("", {status:504, statusText:"offline"});
      });
    })
  );
});
