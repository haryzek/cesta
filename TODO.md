# TODO — Moje cesta

Pracovní seznam. **README popisuje, jak věci jsou; tenhle soubor, co se má stát.**
Když se něco vyřídí, škrtá se odsud — a pokud to změnilo pravidlo, doplní se do README.

Dělení je podle toho, **kdo to musí utáhnout**, ne podle oblasti. Nahoře jsou věci,
kde je potřeba Bobova hlava nebo ruka a nikdo je za něj neudělá.

---

## 🫏 Pro vrchního osla

Věci, kde rozhoduje Bobův úsudek, jeho hlas nebo jeho přístupy. Claude umí připravit
podklad, seznam nebo návrh — ale poslední slovo je Bobovo.

### Obsah

- [ ] **Triplet přerámování — jádro appky.** Pokrytí je 4 clustery ze 116
      (`cl_0001`, `cl_0008`, `cl_0013`, `cl_0031`). Jde z Bobových Excel seznamů,
      ne z textových promptů. *Tohle je největší kus nehotové práce v projektu.*
- [ ] **Obsahová kontrola cvičení, dávka po dávce.** 71 cvičení je strukturálně
      čistých, ale věcně a jazykově neprověřených. Kontroluje se samonosnost,
      věrnost Bobovým formulacím, úplnost postupů, kvalita deníkových otázek
      a tónová pestrost. Strojově to nejde. Doporučené pořadí: oddíl 04 jako
      etalon, pak 05–11. Práce na několik sezení.
- [ ] **Rozhodnout o `diary_exercise`.** Vyplněný je u 41 cvičení, podklad má
      ale jen 25 značek. SPEC §17 říká „vlastní deník jen u cvičení s unikátním
      obsahem". Claude umí těch 16 navíc vypsat — posoudit, jestli nejde o vatu,
      musí Bob.
- [ ] **Zadat, jestli projet perexy článků.** U cvičení se to udělalo (8 přepsaných
      z 71). U 112 článků se perexy zatím nikdo nedíval stejným metrem.
- [ ] **Kurátorské škrtání hlášek k bolístkám — top 15 ze ~35.** Fabrika doběhla
      1. 9. 2026: náš pool 174 × 15 (`hlasky_davka01–18*.json`) + Karolínčin pool
      174 × 20 (`hlasky_karolinka.md`) = ~6100 kandidátů. Cíl: **vybrat 15 na
      bolístku, ne seřazovat** — většina je dobrá a rozdíly v prostředku jsou
      vkusový šum. Vybírat jako **portfolio rolí** (uznání · břitkost · praktický
      šťouch · otázka · humor · tělo · perspektiva času), ne patnáct variant
      nejsilnějšího úhlu. Claude umí seříznout ~35 → ~22 (spodek, duplikáty,
      prohřešky) a označit svých top 15; Bob pak vybírá z předvýběru.
      Kalibrace shody: `kuratorska_kalibrace_kolo1_p002.md` (kolo 1, 1. 9. 2026),
      další kola volitelně.
- [ ] **Rozhodnout o `k_222`.** `hlasky_davka03.json` má hlášky k bolístce
      „Celý můj kalendář jsou povinnosti pro ostatní — kde tam jsem já?", která
      ve zdrojáku `brana4_bolistky.json` není. Doplnit do zdrojáku (pak 175),
      nebo hlášky zahodit.
- [x] **Hloubavky nasazené (11. 9. 2026).** 251 otázek v `questions.json`
      bez `schemas`, tagy 3–6 podle priority, staré 63 přepsané do ich-formy.
- [x] **Inspirace nasazené (11. 9. 2026).** 202 citátů (21 přetagovaných + 181
      ze sklizně), `schemas` shozeny všem, tagy podle priority, nový tag `přátelství`.
- [x] **Články přetagované (11. 9. 2026).** 112 článků, Stavy a potíže primární,
      +9 tagů do slovníku (`psychoterapie`, `léky`, `perfekcionismus`, `psychické
      obrany`, `tlak na výkon`, `prokrastinace`, `kontrola`, `sebelítost`,
      `sebepoškozování`). Slovník má 96 tagů.
- [ ] **Přetagovat Cvičení** podle `local/_prompty/tagovani.md` — v dávkách,
      ne v `data/exercises.json`; před startem zkontrolovat, jestli lint
      nekontroluje počet tagů natvrdo.
- [ ] **Zobrazovací vrstva nad slovníkem** — jen kdyby se lišta filtru po
      přetagování cvičení stala nepřehlednou (rozhodnuto 11. 9.: zatím ne).
- [ ] **Řazení výsledků filtru podle váhy shodných tagů.** Otázky i Inspirace
      mají tagy seřazené podle priority, appka zatím čte jen OR shodu.

### Schémata

- [ ] **Závěrečná revize schémat u clusterů s čerstvým modelem.** Bob je přiřazoval
      ručně přes čtyři modely v pěti kolech, ale je to pár měsíců a mezitím
      přibyl silnější model. Plán: nechat přehodnotit, pak osobně zkontrolovat.
      Clusterů se do té doby nikdo nedotýká.

      **Vstup z měření (14. 8. 2026)** — porovnání „jak silně schéma vstupuje do
      profilu" vs. „kolik obsahu je pro něj dosažitelné přes pozice 1–2":

      | schéma | clusterů | dosažitelný obsah |
      |---|---|---|
      | ENTGRAND | 14 | **4 — a všechno jen otázky** (0 článků, 0 cvičení, 0 inspirací) |
      | UNFAIR | 5 | 4 |
      | PUNIT | 17 | 11 |

      Může to být díra v obsahu, může to být přeřazení v clusterech. Revize to rozsoudí.

### Vizuál

- [ ] **Barvy — „overhaul do veselejší atmosféry".** Design systém z 17. 7. 2026 je
      odladěný základ, ale paleta na tenhle posun pořád čeká. Bobovo rozhodnutí.
- [ ] **Karty Přerámování.** Čekají na doladění — větší karty, výraznější věty.

### Provoz

- [ ] **Ověřit embed `cesta.html` do Miowebu.** Jediné, co nikdo jiný
      neotestuje — je potřeba reálná WordPress stránka. Záložní `cesta_prototyp.html`
      už neexistuje (smazán 14. 8. 2026), takže když embed nepůjde, řeší se to
      úpravou kompletní verze, ne návratem ke staré.

### Model dat

- [ ] **Celková doba a frekvence cvičení.** `duration` zůstává jedno číslo = jedno
      provedení (banner). Celková doba praktikování („průběžně 1–2 týdny") čeká na
      rozšíření datového modelu o samostatná volitelná pole. Zatím to žije v textu
      Info, blok „Uvedení do praxe“.

---

## 🤝 Spolu

Potřebuje domluvu, pak už to Claude dotáhne.

- [ ] **Bolístky — situační vstupní vrstva (nápad 26. 8. 2026, čeká na domluvu
      o finálním tvaru).** Vstup do přerámování přes konkrétní běžné trápení
      („výčitky, že nemám děti / školu / necestuju / nestíhám") místo
      sebediagnózy pocitu. **Rýsující se tvar (26. 8. 2026 večer, není final):**
      dvoupatrový model — TOP 100–200 bolístek dostane **3–5 krátkých úderných
      přerámování („hlášky")** + `feeling_ids`; zbytek přeživších (~300+) žije
      jako vstupní zrcadlo jen s mostem na jádrové pocity (u klastrové sady
      mapování už existuje) a slouží zároveň jako **zásobník pro budoucí
      obsah**. Vyhazuje se jen balast a překryvy (odhad 50–70 z 530).
      *Otevřená otázka hlasu:* hlášky budou úderné a hovorovější než zdvořilý
      triplet (bolístka je nespisovná — odpověď v bílých rukavičkách by vedle
      ní zněla úředně). Byl by to čtvrtý hlas appky — rozhodnout vědomě,
      kalibrovat na vzorku.
      **Žánry hlášek (z přestřelky 27. 8. 2026)** — u každé bolístky míchat
      dva hlasy (břitký kámoš + laskavý dospělý) a čerpat z žánrů: rozbití
      věštby · zmenšení otázky · převrácení metru/porovnání · konkretizace
      („kdo přesně? co přesně?") · normalizace faktem · dovolení („nemusíš…")
      · hodnotový reframe („není povinnost") · mindfulness kotva („zastav se
      a všimni si") · černý humor · podnětná otázka · praktický krok.
      Tvrdé pravidlo: žádné vymyšlené statistiky a čísla.
      **Deduplikační pas po fabrice (rozhodnuto 27. 8. 2026):** poměr
      soucitných vs. břitkých je zdravý (~60:30, neměnit prompt), ale napříč
      bolístkami se opakují šablony — hlavně „Starý kovboj by řekl…" (+ koňské
      metafory: otěže, napajedlo, sedlo) skoro v každé bolístce, a vzorec
      „X je jediný sport, kde…". Až fabrika doběhne, projet všechny dávky,
      identifikovat opakovačky a provést náhrady (mořský vlk apod.) anebo
      atribuci úplně vypustit. Kovbojské hlášky samotné zůstávají — jsou dobré,
      řeší se jen hustota stejné figury.
      **Stav 1. 9. 2026: fabrika doběhla (174/174, 2625 hlášek), dedup je teď
      na řadě.** Kromě kovboje se opakují i „X je jediný sport, kde…" (2× jen
      mezi p_002 a p_004), „kdyby X umělo mluvit", „perspektiva delšího času"
      a „lhostejnost by mlčela". Dává smysl dělat dedup **až při kurátorském
      škrtání** — část opakovaček odpadne sama tím, že se vybírá 15 z ~35.
      **UI vize (odsouhlaseno jako směr):** žádná nová dlaždice — vstup do
      sekce Přerámování se přestaví na rozcestník tří dveří („Co právě cítím"
      / „Co mě žere" / „Čeho se bojím"), s krátkým návodem „párkrát se zeptej
      proč". Bolístky: kategorie (6–8 lidských šuplíků) → scrollovací seznam
      syrových vět (seznam sám je zrcadlo — bez ikon a ilustrací) → detail
      s hláškami + „Pod tímhle často bývá…" chips pocitů → klastrový triplet.
      Scroll po dávkách s hláškou typu „Chceš další, nebo už toho máš plný
      zuby?"; řazení od nejčastějších v každé kategorii. Patro 2 se pozná jen
      tím, že detail začíná rovnou mostem.
      Materiál: `local/data_wip/bolistky_wip/` — prestrelka.json (51),
      sklizen.json (115), sklizen_klastry.json (364, s cluster_id).
      **Definice rozšířena na tři směry stesku** (26. 8. 2026): na sebe ·
      na blízké a vztahy („Manželka mě sere.") · na svět a dobu („Ten dnešní
      svět stojí za hovno." — mantinel: politické kauzy ne). Zaměření na
      dnešní svět (feed, kult produktivity, mobily, nájmy); formulace syrově,
      řečí od kafe. Prompt sklizně: `local/_prompty/bolistky.md` (obsahuje
      i 51 už nalezených uhlíků z Bobovy a oslí přestřelky 26. 8. 2026).
      **Druhá, samostatná sada:** vygenerovat 1–5 konkrétních živých bolístek
      z každého ze 116 klastrů (opačný směr — zdola z psychiky; dvě sítě,
      průnik = nejžhavější uhlíky). Pozor na klinický jazyk, platí test
      „u kafe". Pak obě sady sloučit, pročistit, rozhodnout další postup.
      Žádné otázky/úkoly k bolístkám — tenká slupka, hloubku dodá klastr.
      Skica dat: `bolistky.json` + `bolistky_reframings.json` (scoped per
      bolístka, lokální `sort_order`), model by narostl ze 13 na 15 souborů.
      Bobův cíl: ~50 bolístek, seřazených podle četnosti v reálném životě
      (první várka podle toho, co se vyprodukuje). Nestavět, dokud Bob nedá gou
      na finální tvar.
      **Rozlišovací pravidlo bolístka vs. strach:** bolístka je hodnotící a bolí
      teď („Nemám X / Nejsem dost Y / Nestíhám / Měl bych" — deficit poměřovaný
      s očekáváním a druhými, kulturní superego); strach míří do budoucnosti
      („bojím se, že…") a patří do strachové brány níže. Zdroj kandidátů:
      Bobova monster tabulka `C:\Users\bobre\Desktop\tab.xlsx` (rodina „Bez X"
      ve sloupci Strachy, sebehodnotící kusy z Běžných strachů) + kontrolní
      síto přes sloupec Existenciální potřeby (25) na díry v pokrytí.
      Nástřel ~30 kandidátů padl v konverzaci 26. 8. 2026 (rodina a vztahy /
      výkon a kariéra / životní bilance / já a tělo / život teď).
- [ ] **ČTYŘI VSTUPNÍ BRÁNY do Přerámování (rozhodnuto 27. 8. 2026).**
      1. Jádrové pocity (s krátkým návodem) · 2. Strachy · 3. Test — osobní
      sebehodnotící výroky à la YSQ · 4. Bolístky (stížnosti a konstatování).
      Dělící čára 3 vs. 4: výrok průhledně mluvící jedno vnitřní nastavení
      = brána 3; konstatování reality „naslepo", kde schéma pod tím může být
      různé (i výrok o sobě typu „Pořád sedím u počítače.") = brána 4.
      Materiál rozdělen 27. 8. 2026: `bolistky_wip/brana4_bolistky.json` (177:
      103 na sebe / 44 na blízké / 30 na svět) + `brana3_test_vyroky.json`
      (334, z toho 322 s cluster_id — skórování testu zadarmo přes klastr →
      schémata) + `kos.json` (19, s důvody). Jazyk sjednocen na spisovně-lidový
      (cílovka: převážně zralé ženy).
- [ ] **Brána 3 — test à la YSQ (rozhodnuto 27. 8. 2026, stavět po bolístkách).**
      Ne diagnostika — jasně popsat jako inspiraci, hrubé načrtnutí vnitřních
      citlivostí. UI: scrollování výroků, odpověď „Spíše ano / Spíše ne",
      ukazovat % zodpovězeného balíku („čím víc odpovíš, tím lépe sedí
      přerámování"), po určitém počtu odpovědí zobrazit výsledky — Bob má
      hotové lidské popisy výsledků z praxe (posílá klientům po YSQ).
      Vyhodnocení čistě lokálně (localStorage), což v appce i řekneme.
      Před stavbou zkontrolovat vyváženost položek napříč schématy.
      Zdroj položek: `brana3_test_vyroky.json`.
- [ ] **Strachy — vstupní brána: dvoukrokové uvědomění (nápad 26. 8. 2026,
      potvrzeno 27. 8.).** Bob má připravený vlastní seznam nejčastějších
      lidských obav. Sociální/vztahové strachy: přímé mapování. Fobické:
      mezikrok „čeho se v tom bojím doopravdy" (nabídka hlubších strachů /
      významů). Koncept „strach → Čeho se v tom doopravdy bojím? →
      jádrové pocity → klastr". Místo statického mapování (u fobií selhává —
      každý má jiný důvod) si uživatel vybere VÝZNAM svého strachu, a tím
      udělá terapeutický mini-krok: uvědomění před prvním přerámováním.
      Mechanika = zhmotněný návod „párkrát se zeptej proč".
      - **Globální paleta ~12–15 významů** v 1. osobě („umřu a nikdo mi
        nepomůže", „ztrapním se", „ztratím kontrolu", „budu na obtíž",
        „budou ke mně lhostejní"…), každý význam nese `feeling_ids`
        namapované jednou. Každý strach si vybírá podmnožinu 4–6 z palety —
        žádný obsah per strach. Předloha taxonomie: sloupec „Předmět obav"
        v tab.xlsx (11 kategorií), přeložit do lidské řeči.
      - Fobické strachy navíc proklik na existující obsah: expoziční cvičení,
        článek o falešném poplachu, krizovka, tělesné příznaky. Případně
        2–3 věty psychoedukace + situační kotva („můžeš kdykoli vystoupit")
        jako perex — pár vět, žádný triplet.
      - **Mantinel proti rozkročení:** strachům se NEPÍŠOU vlastní přerámování.
        Když je strach tak specifický, že klastrová přerámování nestačí,
        je to ve skutečnosti bolístka a přesouvá se tam.
      - Zdroje seznamu strachů: sloupce „Fobie lidsky" (38) a výběr
        z „Běžných strachů" (193) v tab.xlsx. Cíl ~40–60 strachů.
      - Výsledná architektura vstupů: Pocity (přímo) · Bolístky (obsahová
        vrstva) · Strachy (dvoukrokové uvědomění) — tři dveře, jeden dům
        (116 klastrů).
- [ ] **Přerámování jako swipe proud s pamětí (rozhodnutý směr 3. 9. 2026).**
      Karty přerámování vedle sebe na swipe (CSS `scroll-snap`, bez knihovny)
      a `localStorage` seznam ID, která uživatel už viděl („viděl" = karta byla
      celá na obrazovce). Mění to logiku sekce: ze **seznamu k přečtení** na
      **proud, do kterého se člověk vrací** — pár karet, srdíčko, pryč, zítra
      zas. Důsledky: (1) škrtat přerámování jen za kvalitu, ne za objem —
      velký počet na klastr přestává být dluh, je to zásoba; (2) řazení
      „neviděné první, viděné za nimi", `sort_order` zůstává, paměť ho jen
      předběhne, kolové míchání u více pocitů beze změny; (3) appka musí
      **sama nabídnout odchod** — po pár kartách měkký předěl „Stačí pro
      dnes?" (zavřít / ještě), jinak lidé swipují do konce a odcházejí
      s pocitem nedokoukaného seriálu. Stejný vzor jako scroll po dávkách
      u bolístek — jedna komponenta pro obě sekce. Paměť je per doména
      (Pages vs. Mioweb si ji nesdílí, stejně jako oblíbené). Stavět po
      domluvě o detailech, gou zatím není.
- [ ] **Dočasný admin — editační režim přímo v `cesta.html` (nápad 26. 8. 2026).**
      Bob bude v příštích týdnech kontrolovat nový obsah (22 body příznaků,
      sklizně otázek a citátů) a chce to dělat přímo v prostředí, které pak
      uvidí uživatelé. Plán: decentně upravit appku pro editaci — tenká vrstva
      nad existujícím renderem, ne přestavba admina. Rozsah a mechanismus
      (úprava textu, export zpět do JSONu) domluvit, až se do toho půjde.
- [ ] **Admin nástroj — přestavba od nuly.** `cesta_admin.html` je zastaralý
      a rozešel se s realitou (špatné prefixy, třímístný padding, nezná triplet).
      Hlavní věc k předělání: přerámování musí být **cluster-scoped**, ne plochý
      globální seznam. Rámcový návrh je v `CLAUDE.md`.

---

## 🔧 Na Claudovi

Mechanika, nepotřebuje Bobovo rozhodnutí — jen se to musí udělat.

- [ ] **Telefonní čísla v krizovce udělat klikací.** Markdown parser neumí odkazy,
      ale renderer už čísla detekuje (`mc-tel`) — stačí je zabalit do `tel:`.
      V krizi to má reálnou hodnotu.
- [ ] **Zrušit berličku `stripDupHeading`.** Data jsou teď čistá a funkce je nečinná.
      Drží se jen pro fázi generování z promptů; až budou prompty spolehlivé, pryč.
      *(`pullDuration`, dřívější druhá berlička, je už smazaná.)*
- [ ] **Commit a push.** V pracovním stromu visí nasazená data, oprava rendereru,
      `tagy.json` a dokumentace.

---

## Nápadník

- **„Najdeš se?"** — nápad na slogan nebo jméno appky (Bob, 26. 8. 2026).
  Do foroty, netrvá se na něm. Sedí k bolístkám-zrcadlu i k výběru pocitů.

## Nedávno vyřízené

Držet krátké — jen věci, na které se bude někdo ptát „a tohle jsme řešili?".

- **14. 8. 2026 — `cesta_prototyp.html` smazán.** Mrtvá větev, Bob ho odstranil
  z lokálu. Zůstává v historii gitu. Rozcestník `index.html` má nově jedinou
  kartu — druhý odkaz vedl na smazaný prototyp a třetí na admin přesunutý do
  `local/.old/`, obojí by po nasazení bylo 404.

- **14. 8. 2026 — Oddíly a řetězy nasazené, model z 11 na 13 souborů.**
  `sections.json` (11 oddílů) a `chains.json` (4 řetězy) jsou v `data/`,
  referenční integrita s cvičeními ověřená. README je popisuje včetně pravidla
  o slepování deníků a chování badge řetězu. **Renderer je zatím ignoruje** —
  sekce „Moje cesta" a badge řetězu se budou stavět samostatně.
- **14. 8. 2026 — Úklid složek.** `cesta_admin.html` do `local/.old/`, zdrojové
  `sec_*.md` do `sections_wip/_podklad/` (zdroj pravdy je `sections.json`),
  smazán duplikát `articles.json` v `articles_wip/` a zámek po PowerPointu.
  Opravené odkazy na neexistující soubory v CLAUDE.md, README i SPEC —
  ověřeno strojově, že žádný dokument neukazuje do prázdna.

- **14. 8. 2026 — Motta u oddílů zrušená.** `sections.json` mělo 10 blokových
  citací (`>`) — po jedné nad každou Praxí a dvě v Teorii. Vyhozeny celé, ne
  přerenderovány: byla to výbava tiskové cvičebnice a v appce by z nich při
  rozšiřování o nové oddíly zůstal dluh (dvě kategorie oddílů, s mottem a bez).
  Citát má v appce vlastní místo — sekci Inspirace. Odpadla tím i potřeba
  komponenty v rendereru pro `>`, který markdown parser neumí.

- **14. 8. 2026 — `source_url` / `show_link` zprovozněné.** `show_link` znamená
  „text je zkrácený o víc než 20 %", ne „máme URL". U 71 článků ze 112 se pod
  tělem vykreslí tichý řádek „Celý článek na blogu", odkaz jde do nového panelu.
  Pravidlo i chování popsané v README u `articles.json`.

- **14. 8. 2026 — Tagy sjednocené.** 93 rozjetých tagů → 56, slovník je nově
  společný pro celou appku a leží v `tagy.json` v kořeni. Zrušeny všechny tři
  staré kopie seznamu (`local/_tags/*.txt`, SPEC §12, natvrdo v lintu) — právě
  rozejití kopií způsobilo, že se slovník rozjel dvakrát.
- **14. 8. 2026 — Schémata u obsahu srovnána na 3.** Clustery mají dál 5 (čtou se
  všechny při stavbě profilu), obsah 3 (skóruje se z pozic 1–2, třetí je rezerva).
  Pozice 1–2 se ořezem nezměnily ani u jedné položky, výstup doporučovadla je
  identický.
- **14. 8. 2026 — Cvičení a články nasazené do `data/`.** 71 cvičení, 112 článků.
- **14. 8. 2026 — Oprava číslování kroků v rendereru.** Číslovaný seznam přerušený
  podnadpisem začínal znovu od 1 (`ex_0049` i `ex_0021`). Parser teď respektuje
  číslo prvního zdrojového kroku.
