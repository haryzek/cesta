# CLAUDE.md

Pracovní brífink pro práci na projektu **Moje cesta** v Claude Code. Čti tohle první. Detailní specifikaci datového modelu, sekcí a algoritmů má `README.md` — sem se dává jen to, co potřebuješ vědět, abys mohl hned makat, plus pasti, na které se dá naletět.

---

## Co to je

Webová psychoterapeutická aplikace. Uživatel vybere jádrový pocit → dostane přerámování (a k tomu otázky a úkoly), může si je uložit do oblíbených. Vedle toho mikročlánky, cvičení, inspirace, podnětné otázky, psychosomatická encyklopedie tělesných příznaků a první pomoc v krizi.

Čistě frontend: HTML + CSS + JS + JSON. Žádný backend. Uživatelská data v `localStorage`. Běží uvnitř HTML elementu na Mioweb (WordPress) členské stránce. JSON data jsou na GitHub Pages.

- Repo: `https://github.com/haryzek/cesta` (username `haryzek`, repo `cesta`)
- Pages: `https://haryzek.github.io/cesta/`
- GitHub slouží jako záloha a remote pracovní prostředí, není to veřejně sdílený projekt.

Projekt se jmenuje **Moje cesta**. Nikam nedávej žádný jiný název značky ani kurzu — do repa, kódu ani dokumentů. Náhoda je blbec, drž se „Moje cesta".

---

## Fáze — kde jsme (důležité pro to, jak pracovat)

**Teď: prototyp.** Bob připravuje obsah jako seznamy lokálně (Excel → JSON, s pomocí AI). ID i `sort_order` se zatím řeší ručně / při konverzi. Admin se nepoužívá. Prototyp tahá data z GitHub Pages.

**Ostrá aplikace (později):** ID i řazení pojede přes admin. Bob bude přidávat a řadit obsah tam, ne ručně v souborech.

Praktický důsledek: dokud jsme v prototypu, ID v JSONech zůstávají. Až se postaví admin, přejde se na režim „zdrojáky bez ID, admin je doplní". Neřeš to teď.

---

## Stav

**Struktura všech 11 JSONů je finální.** Obsah ne — plní se. Když něco tvoříš nebo generuješ, drž se přesně stávající struktury.

- Klastry (116) + pocity (399): kompletní mapa s ID a schématy ✅
- Triplet přerámování: testovací fáze, zatím 4 klastry (`cl_0001` neviditelný, `cl_0008` zbytečný, `cl_0013` nedůvěřivý, `cl_0031` špatný)
- Krizovka (12), Tělesné příznaky (5): obsahově hotové a pročištěné, slouží jako etalon
- Cvičení (3), Články (6): pročištěné, etalon pro prompty
- Ostatní obsah: vzorek, plní se
- Vizuál: nový design systém nasazený (17. 7. 2026), základ odladěný. Karty Přerámování čekají na doladění s Bobem.

**Generování obsahu z promptů:** v `local/_prompty/` (nepushuje se) jsou prompty pro tvorbu JSONů — `telesne-priznaky.md`, `cviceni.md`, `clanky.md`. Popisují, jak přetavit libovolný zdroj do naší struktury a hlasu. Vzory jsou reálné pročištěné JSONy. Bob sbírá cvičení/články z různých zdrojů a přes tyhle prompty (v Coworku) je převádíme do struktury. Přerámování, Otázky a Inspirace půjdou z Bobových Excel seznamů, ne přes textové prompty.

### Dvě běžící verze appky

Obě v kořeni, obě na Pages, spuštěné vypadají skoro stejně. **Nepleť si je** — Bob si je taky spletl.

- **`cesta_kompletni.html` — hlavní pracovní soubor.** Všechny sekce naživo nad všemi 11 JSONy. `MC_BASE="./data/"`. Meta hlavičky pro mobil (viewport, PWA manifest, vypnutá cache) — Mioweb je ignoruje. Bobovy screeny v `local/_design/Support/` jsou odsud. **Veškerá práce jde sem.**
- **`cesta_prototyp.html`** — starší obal pro Mioweb (`MC_BASE` na absolutní Pages URL). Živé jen Přerámování + Oblíbené, zbytek `kind:"placeholder"`. **Mrtvá větev — design ani obsah se do něj nepromítají.** Drží se, dokud se neověří embed kompletní verze do Miowebu.
- **`cesta_admin.html`** — zastaralý, k přestavbě od základu (viz past č. 1).

Obě verze sdílí **registr sekcí** — jeden `SECTIONS = [...]` řídí dlaždice, menu i router. Nová sekce = výměna rendereru, obal se nesahá.

Na mobilu: `https://haryzek.github.io/cesta/` → rozcestník → „Appka — kompletní" → Chrome „Přidat na plochu".

---

## Datový model — rychlá orientace

11 souborů. Plný rozpis polí v README. Co musíš mít v hlavě:

- **ID** = permanentní totožnost, formát `prefix_NNNN`, **čtyřmístný** zero-padding (`ref_0001`, ne `ref_001`). Nikdy se nemění, nenese pořadí.
- **`sort_order`** = pořadí. U tripletu **lokální per cluster** (restart na 1, hustě 1..N bez děr). U plochého obsahu globální v souboru.
- **`tier`** = `free` nebo `premium`, nikdy nic jiného.
- **Tagy** vždy lowercase.
- **`schemas`** = EMS kódy. **Cluster má 5, obsah má 3.** (README kdysi místy mluvil o 5 i u obsahu — to je opravené, reálná data mají u obsahu 3. Drž 3.)

Prefixy ID podle souborů: `cl_`, `feel_`, `crisis_`, `body_`, `art_`, `ex_`, `ref_`, `refq_`, `refa_`, `inspir_`, `quest_`.

Všech 11 JSONů leží v **`data/`** a všechny jsou ploché listy (žádný obalový objekt). Ikony a statické assety v `assets/`.

**Markdown v tělech** appka renderuje vlastním mini-parserem. Umí: `##`/`###`/`####`, `*` i `-` odrážky, `1.` číslované, `**tučně**`, `*kurzíva*`, vnořené odrážky přes odsazení, víceřádkové položky seznamu. **Neumí: odkazy, obrázky, tabulky, kód, citace `>`, vodorovné čáry** — nepiš je do dat, nevykreslí se.

**Formát obsahu** (stav k 18. 7. 2026 — crisis, body, exercises pročištěné, slouží jako etalon pro prompty v `local/_prompty/`):

- **crisis** — bloky `##`, odrážky `*`, žádný duplicitní název. Telefonní čísla v `**bold**` (renderer je obarví tónem — viz past č. 7). Kontakty: číslo na samostatném řádku.
- **body** (Tělesné příznaky) — pevný skelet **7 bloků** (Jak se projevuje / Psychické příčiny / Fyziologické příčiny / Kdy se zhoršuje / Co přináší úlevu / **S čím se to často plete** / Kdy k lékaři). Vzor: text-bloky vs. odrážkové bloky s úvodní větou zakončenou dvojtečkou + `*kurzíva dovětek*`. Blok 6 se jmenuje „S čím se to často plete" (ne „Na co si to lidé pletou").
- **exercises** — `body` = `## Postup` (+ volitelně `## Příprava`) + `## Zápis do deníku`; `info` = pevných **10 bloků** (Úvod → K čemu → Kdy využít → Jak posílit → Mindset → Na co pozor → Co může bránit → Co mít na paměti → Uvedení do praxe → Co dál?). Kroky postupu = číslovaný seznam, každý krok **tučný titulek + odrážky** (past č. 6).
- **articles** — souvislý text, **žádné `##` nadpisy** (krátké mikročlánky).

**Odrážky v datech drž jednoúrovňové a markerem `*`** (renderer umí i `-` a vnoření, ale prompty sjednocují na `*` a jednu úroveň).

**Hlas obsahu — tři formy, každá má důvod:**
- **Appka uživateli vyká** (UI: „Vyberte pocit", perex, placeholdery, O appce). Zdvořilý průvodce.
- **Obsah je „my"** (cvičení postup i info, tělo). Společná cesta, nepřikazujeme.
- **Deník je „já"/ich-forma** („Jak jsem se cítil/a?"). Osobní reflexe.
- **Články** stojí mimo — autorská řeč, kombinace vykání a „my" je tam **záměrná**.

Kdo má co:
- **`schemas`** mají: clusters (5), articles, exercises, inspirations, questions (3). **Nemají**: feelings, crisis, body, triplet.
- **datum** má většina (`added_at`); articles má navíc `published_at`. **Nemají**: crisis, body (jsou to malé stabilní sady, které se nebudou rozšiřovat — je to záměr, ne opomenutí).
- **`cluster_id`** mají: feelings, triplet (ref/refq/refa).

---

## Pasti (na tyhle si dej pozor)

1. **`cesta_admin.html` je zastaralý a rozešel se s realitou.** Nepoužívej ho jako zdroj pravdy o datovém modelu. Konkrétně: má špatné prefixy (`mic`/`quote`/`q`/`symptoms` místo `art`/`inspir`/`quest`/`body`), třímístný padding místo čtyřmístného, zná jen 9 sekcí a **vůbec nezná `reframing_questions` ani `reframing_actions`**. Vznikl jako rychlý test „projde to do Miowebu", design i data jsou mimo. Bude se přepisovat od nuly. Zdroj pravdy je README + reálné JSONy, ne admin.

2. **Dva různé GitHub účty v historii.** Aktivní a správné je `haryzek/cesta`. Kdekoli narazíš na `bobrerichacz/stesti_naproti_app` nebo podobné, je to starý/vedlejší pozůstatek — ignoruj, drž `haryzek/cesta`. (Prototyp má v `MC_BASE` správně `haryzek.github.io/cesta/`.)

3. **5 vs 3 schémata.** Cluster 5, obsah 3. Kdyby někde v textu bylo 5 u obsahu, je to stará informace.

4. **CSS specificita `#mc-root` — už dvakrát to kouslo.** Reset `#mc-root ul { padding:0 }` má specificitu (0,1,1) a tiše přebíjí každou třídu (0,1,0). Výsledek: `.mc-list`, `.mc-cards` i `.mc-md ul` přišly o odsazení a ležely na okraji obrazovky — a nevypadalo to jako chyba CSS, ale jako nedbalé odsazení. Totéž se stalo dřív s `margin`. **Všechny resety pod `#mc-root` piš přes `:where()`.** Když ti nesedí zarovnání a v CSS to vypadá správně, hledej tady.

5. **`stripDupHeading` je ponechaná pojistka.** Zahazuje první nadpis těla, když se shoduje s názvem položky. Data jsou teď čistá (nikde duplikát není), takže je nečinná — ale drží se pro fázi generování z promptů, kdyby prompt uklouzl. `pullDuration` (dřívější druhá berlička) je **smazaná** — banner „Trvání" bere přímo pole `duration`. Nepřidávej nové berličky bez domluvy s Bobem.

6. **Kroky cvičení stojí na vzoru v datech.** Číslovaný seznam, kde položka začíná `**Tučným titulkem.**` a pod ním odrážky. Renderer z toho dělá kolečko s číslem, titulek a linku — čistě CSS countery nad `<ol>`, datový model se nesahá. **Když se ten vzor v datech poruší, kroky se rozpadnou na obyčejný seznam.** Nejkřehčí místo designu.

7. **Renderer má tři cílené transformace obsahu** (ne berličky — vědomé komponenty): `mc-tel` obarví tónem `**bold**`, který je čistě telefonní číslo (Krizovka). `splitJournal` oddělí závěrečný `## Zápis do deníku` z těla cvičení a vyrenderuje ho jako tealovou journal-card. Markdown parser umí i **víceřádkové položky seznamu** (odsazený řádek pokračuje poslední odrážkou) — kvůli kontaktům s číslem na dalším řádku.

---

## Design

Nasazený 17. 7. 2026 podle `local/_design/design-handoff.md` a mockupu `local/_design/Support/exercise.html`. Vznikl v konverzaci s Claude Chat, Bob k němu má screeny v `local/_design/Support/`. **Není finální** — základ je odladěný, ale barvy čeká „overhaul do veselejší atmosféry" a karty Přerámování doladění. Hodnoty žijí v `<style>` bloku `cesta_kompletni.html`, prototyp má pořád staré coconut téma a nesahá se do něj.

**Dvě témata, light + dark.** Přepínač je dole v hamburger menu, volba v `localStorage` (`mc_theme`). Dokud si uživatel nevybere, jede se podle systému. `data-theme` se píše na `#mc-root`, **ne na `<html>`** — uvnitř Miowebu nad ním nemáme kontrolu.

**Tón sekce (`--tone`).** Akční sekce (První pomoc, Tělo, Přerámování, Cvičení) jedou červeně, čtecí (Otázky, Inspirace, Články, O appce) zeleně. Řídí barvu nadpisů, odrážek, ikonek, výběru. Registr sekcí má pole `tone`, render píše `data-tone` na `#mc-root`. Bobova logika: „akční zásahový vs. volný čtení".

**Fonty:** Fraunces (nadpisy, titulky, citáty) + Public Sans (UI a běžný text) + mono (metadata, čísla). Fraunces je variabilní font — **vždy nastav `font-variation-settings:'opsz'`** podle velikosti (72 pro H1, 36 pro H2, 24 pro titulky), jinak vypadá placatě. Váha nadpisů 600, ne 400 (to bylo pro Georgii).

**Osa `--gutter: 20px`.** Všechno boční odsazení jede přes ni. Nepřidávej vlastní hodnoty.

**Klíčové proměnné:** `--tone`/`--tone-soft` (barva sekce), `--on-accent` (text NA accent ploše — v light světlý, v dark tmavý), `--heart` (srdíčko, v light světlejší než accent). `--empty`/`--done`/`--missed` nemají v kódu jediné použití, jsou to zbytky.

**Detail cvičení** má prvky z mockupu: tabbar Postup/Info, duration strip (bere `duration`), číslované kroky (past č. 6), a **journal-card** — `## Zápis do deníku` se renderuje jako samostatná tealová karta (klidová barva proti červenému postupu). Detail obsahu se sází přes `.mc-detail-head`; nadpis mimo tuhle hlavičku ztratí gutter a přilepí se k okraji (opakovaná chyba).

---

## Jak bude fungovat admin (rámcově, k přestavbě)

Admin zrcadlí strukturu aplikace. Má **dva světy**:

**A) Sekce „Přerámování" — cluster-scoped.** Vstup přes jednu sekci → vybereš cluster → uvnitř přepínáš mezi tripletem (Přerámování / Otázky / Úkoly) přes submenu, přesně jako to dělá frontend. Vidíš a řadíš vždy jen položky jednoho clusteru. `sort_order` žije per cluster.

- Řazení: napíšeš cílovou pozici (např. 7), admin položku vloží a hustě přečísluje zbytek (co bylo ≥7 popojede o jedna dolů). Stejně funguje drag&drop. Pořadí zůstává čisté 1..N bez děr.
- Import nových položek: spadnou na **konec svého clusteru** (`sort_order` pokračuje za aktuální max daného clusteru). Příchozí `sort_order` se **zahodí**, dobré položky se pak ručně vytáhnou nahoru.

**B) Ostatní obsahové sekce — ploché.** Články, cvičení, inspirace, podnětné otázky, krizovka, tělo nejsou vázané na cluster. Jeden plochý seznam per typ, globální `sort_order`. Ten se z cluster-logiky vyjímá.

Stávající admin bere přerámování jako jeden plochý globální seznam — to je hlavní věc, co je špatně a musí se předělat na cluster-scoped. Zbytek (plochý obsah) může koncepčně zůstat plochý.

Admin je taky autorita nad ID: v ostré verzi je přiděluje při vytvoření, `reading_time` počítá z délky textu, `slug` generuje z titulku, `added_at` doplní při vzniku.

---

## Klíčové algoritmy (plné znění v README)

- **Merged interleaving** (výběr 2+ pocitů) — kolové, ne rozprostřené; v kole vydá cluster tolik položek, kolik z něj bylo vybráno pocitů; pořadí clusterů podle počtu vybraných pocitů, remíza podle `sort_order`. Bresenham/largest-remainder byl zvážený a **zamítnutý** — neobnovovat.
- **Doporučování obsahu** — skóruje jen přes pozice 1–2 schémat kandidáta (pozice 3–5 jsou šum), práh na nule (raději nic než nerelevantní), šířka je jen tie-break. `VAHY_POZIC = [5, 4]` je jediný laditelný prvek.

Když sáhneš do těchhle algoritmů, přečti si v README i „proč" — jsou tam vědomá rozhodnutí, která nevypadají samozřejmě.

---

## Testování (headless)

**`cesta_kompletni.html`** má `MC_BASE="./data/"`, takže se nic nekopíruje ani nepřepisuje — spusť `python -m http.server 8777` v kořeni a jeď na `http://localhost:8777/cesta_kompletni.html`.

**`cesta_prototyp.html`** má `MC_BASE` na absolutní Pages URL (kvůli Miowebu), takže pro lokální test buď nech tahat data z Pages, nebo si `MC_BASE` dočasně přepni na `"./data/"`.

Router se dá ovládat z konzole: `MC.open("exercises")`, `MC.home()`, `MC.detail(...)` — rychlejší než klikat.

Ověřuj přes **JS eval** (`javascript_tool` / Playwright `evaluate`), ne přes screenshot — ten v tomhle setupu nefunguje. Bar je: nula chyb v konzoli a správné vykreslení proti reálným datům.

Než pushneš, zabij server (`taskkill //F //IM python.exe`) — drží složku a `rm -rf` pak spadne na „Device or resource busy".

---

## Jak se mnou pracovat (Bob)

- **Jeden krok po druhém.** Nejdřív probrat kontext a přístup, teprve pak výstup. Nepředbíhej, neřeš budoucí kroky dopředu.
- **Stručně a přímo.** Žádné vaření, žádné omluvy, žádné preventivní vsuvky typu „na rovinu ti řeknu". Prostě řekni věc.
- **Drž si vlastní názor.** Combative collaboration — když se Bob mýlí, řekni to; a čekej totéž zpátky. Sykofantské přitakávání je na obtíž. Bob úspěšně přebil dřívější Bresenham návrh vlastním řešením — tenhle typ výměny je žádoucí.
- **MVP disciplína.** Bob má completionistickou tendenci, kterou vědomě krotí. Minulý projekt spadl na overengineeringu (200stránkový spec). Prototyp první, ověřit, pak teprve rozšiřovat. Nepřiživuj nafukování rozsahu.
- **Připomínkování designu:** Bob dělal 10 let v digitálních agenturách a připomínky umí. Píše je jako guláš včetně „minipíčovinek" a **vědomě nechává třídění na tobě** — roztřiď si je sám na systémové CSS / bugy / funkce / data a udělej plán. Nefiltruj je za něj: dneska (17. 7.) na dvou „minipíčovinkách" stály dva reálné bugy (nefunkční proklik v Oblíbených, ikony o 9px vedle) a jeden nález, co rozbíjel zarovnání v celé appce. Když se něco opakuje napříč sekcemi, je to systémová věc — pojmenuj ji a oprav jednou, ne desetkrát. Když si Bob řekne o volnou ruku („zvol další krok"), vezmi ji.
- **Tón:** čeština, nespisovně, kámoš. Oslovení „Bobe" (ne „kámo"). Kokosácký režim — občas hrubší láskyplná mluva je warmth, ne kritika. Nevztahuj psychoanalytické věci k Bobově osobě bez vyzvání.
- **Obsahová práce:** přerámování se generují z víc modelů (Claude, ChatGPT, Gemini, Grok) a pak se čistí dvouprůchodově (hrubé pročištění → finální leštění). Prompt pro generování je ve zdrojích projektu, drž se ho. Pozor na syntaktickou monotónnost — Bobovy přerámování mají tendenci sklouzávat do opakované struktury „To, že X, neznamená Y"; hlídej tonální a strukturní pestrost napříč ~20 položkami na cluster.
