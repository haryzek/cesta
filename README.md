# Moje cesta

Webová psychoterapeutická aplikace. Uživatel si vybere jádrový pocit a dostane sadu terapeuticky přesných textů (přerámování, otázky, úkoly), které si může uložit do oblíbených. Vedle toho aplikace nabízí mikročlánky, cvičení, inspirace, podnětné otázky, psychosomatickou encyklopedii tělesných příznaků a první pomoc v psychické krizi.

Autor obsahu: Robert Řeřicha, psychoterapeut (psychodynamika, IFS, KBT), Praha.

---

## Architektura

Čistě frontendové řešení: HTML + CSS + JavaScript + JSON. Žádný backend, žádná serverová databáze. Veškerý obsah leží v JSON souborech. Uživatelská data (oblíbené, přečtené, profil pro doporučování) se ukládají do `localStorage` prohlížeče.

### Integrace do Mioweb

Aplikace běží uvnitř členské sekce webu postaveného na Mioweb (WordPress). Na členskou stránku se vloží HTML element, do kterého přijde kód aplikace. JavaScript v HTML elementu funguje bez omezení, pokud nezasahuje do funkcí Miowebu. Ověřeno v praxi na testovací stránce (duben 2026): JS, interakce, dynamické vykreslování, načítání externích JS knihoven z CDN, `localStorage` i načítání JSON z GitHub Pages fungují. Upload `.js`/`.json` přímo do Médií Miowebu je blokovaný serverem — proto hosting na GitHub Pages.

### Hosting dat

JSON soubory jsou hostované na GitHub Pages ve složce `data/`. Repozitář slouží zároveň jako záloha a jako prostředí pro práci na dálku; není to veřejně sdílený projekt.

- Repozitář: `https://github.com/haryzek/cesta`
- GitHub Pages URL: `https://haryzek.github.io/cesta/`
- Data: `https://haryzek.github.io/cesta/data/*.json`

Repozitář je veřejný (vyžaduje to Pages) — u prototypových dat je to přijatelné. Až půjde o ostrou verzi, řeší se to jinak.

### Free a Premium

Obě verze jsou technicky tatáž aplikace, liší se pouze rozsahem obsahu. Rozlišení řídí pole `tier` u jednotlivých položek.

- **Free** — omezený obsah, bonus k placenému kurzu, přístup přes členskou sekci kurzu. Položky s `"tier": "free"`.
- **Premium** — kompletní a průběžně rozšiřovaný obsah, samostatná členská sekce s předplatným 99 Kč/měsíc. Položky s `"tier": "premium"`.

---

## Datový model

Obsah je rozdělený do šestnácti JSON souborů (11. 9. 2026 přibyly `fears`, `situations`, `pains` — brány sekce Přerámování). **Struktura všech souborů je finální a doladěná.** Obsah zatím finální není — plní se postupně (viz Stav níže).

Napříč všemi soubory platí:

- **ID** je permanentní totožnost položky. Formát `prefix_NNNN` se čtyřmístným zero-paddingem (např. `ref_0001`). ID se nikdy nemění a nenese žádnou informaci o pořadí. V ostré verzi ho přiděluje admin při vytvoření položky.
- **`sort_order`** určuje pořadí. U tripletu přerámování je lokální v rámci clusteru (restartuje na 1, hustě 1..N bez děr). U plochých typů obsahu je globální v rámci souboru.
- **`tier`** je vždy `free` nebo `premium`.
- **Tagy** jsou vždy lowercase a berou se **výhradně** z `tagy.json` v kořeni repa — viz Tagy níže.
- **Tagy jsou v datech seřazené podle priority** (první = téma položky, 2.–3. nesou váhu, zbytek tie-break) a **appka to čte**: filtr (12. 9. 2026) skóruje položky vahou podle pozice zaškrtnutého tagu — viz Filtrování níže.
- **`schemas`** nese kódy Youngových schémat (viz EMS model níže), **seřazené podle priority**. U clusterů je jich pět, u obsahu tři — a není to nedůslednost, ale rozdíl rolí:
  - **Cluster je zdroj profilu.** Kliknutí na pocit nasype váhu do všech pěti schémat (5,4,3,2,1), takže se čte i pátá pozice. Pět je tam potřeba.
  - **Obsah je cíl, který se skóruje.** Doporučovadlo čte jen pozice 1–2, třetí je zdokumentovaná rezerva pro případné rozšíření na 1–3. Pozice 4–5 by nečetlo nic — ani dnes, ani po plánovaném rozšíření.

  Nenafukuj počet u obsahu. Měření nad reálnými daty (14. 8. 2026) ukázalo, že pozice 4–5 nenesou informaci, ale výplň: u cvičení seděl na páté pozici 18× USHYPER, u clusterů 23× DEFSH — generátor plnil prázdný slot generickým kódem. Nutit model k pěti tvrzením tam, kde jsou obhajitelná dvě, navíc ředí kvalitu prvních dvou pozic. Cvičení a články se proto 14. 8. 2026 ořezaly z 5 na 3; pozice 1–2 se nezměnily ani u jedné položky, takže výstup doporučovadla je identický.

### Tagy — `tagy.json`

Kanonický slovník tagů leží v **`tagy.json` v kořeni repa a je jediný zdroj pravdy**. Není to obsahový soubor, na Pages se nevozí — slouží autorské práci a lintům. Obsahuje plochý seznam platných tagů, jejich rozdělení do skupin (jen pro orientaci a barvy ve filtru, **nejsou to kategorie v JSONu**) a mapu `slouceno` se zaniklými názvy a jejich náhradami.

**Slovník je společný pro celou appku** — články, cvičení, inspirace i podnětné otázky sdílejí jednu sadu. Tag je pro uživatele téma, ne vlastnost obsahového typu; oddělené slovníky per typ vedly k tomu, že stejná věc měla různá jména (`expozice` u cvičení vs. `expozice strachu` u článků) a uživatel ji přes sekce nenašel.

Prázdné volby to nedělá, protože **filtr nabízí jen tagy, které jsou v dané sekci reálně použité** — staví se z dat (`allTags(dataKey)`), ne ze slovníku. Proto může slovník nést i tagy bez obsahu (od 11. 9. 2026 např. `sebepoškozování`) — stojí nic. Kdyby se lišta filtru v některé sekci stala nepřehlednou, řešením je zobrazovací vrstva nad slovníkem (omezená sada tagů k zobrazení), ne prořezávání slovníku.

Pravidla:

- Vždy lowercase.
- **Terapeutický směr do tagů nepatří** (KBT, IFS, focusing, behaviorální experiment, somatic experiencing). Tagujeme, k čemu obsah je a co se při něm dělá, ne jakou školou je inspirovaný. Až bude potřeba filtrovat podle směru, dostane vlastní pole.
- **Nový tag se nezavádí při psaní obsahu** — nejdřív se přidá do `tagy.json`, teprve pak se smí použít.
- Tag s jediným výskytem v datech je podezřelý — buď se sloučí, nebo se doplní obsah.
- **Nikde nezakládej druhou kopii seznamu.** Slovník existoval ve třech kopiích (`local/_tags/*.txt`, SPEC §12, natvrdo v lintu), kopie se rozešly a slovník se kvůli tomu dvakrát rozjel — u cvičení a pak u článků. Konsolidace 14. 8. 2026 srazila 93 rozjetých tagů na 56 a všechny kopie zrušila.

Trvání a náročnost **nejsou tagy** — filtr si je odvozuje z polí `duration` a `difficulty`.

### 1. Klastry — `clusters.json`

Seskupení významově blízkých pocitů, pro která platí stejná přerámování. Klastr je základní jednotka, na kterou se váže triplet obsahu (přerámování / otázky / úkoly) a mapování na schémata.

Každý klastr je namapovaný na pět Youngových schémat podle priority. První pozice má v doporučovacím algoritmu váhu 5, poslední váhu 1.

```json
{
  "id": "cl_0001",
  "name": "neviditelný",
  "schemas": ["EMODEP", "ABINST", "DEFSH", "ISOLAL", "UNFAIR"],
  "sort_order": 1
}
```

Klastry nemají `tier` — o dostupnosti rozhoduje `tier` jednotlivých pocitů a obsahu.

### 2. Pocity — `feelings.json`

Volbou pocitu uživatel říká, co prožívá, když mu není dobře. Každý pocit patří do jednoho klastru.

- **`main`** — když je hodnota `"0"`, pocit není názvem klastru (jde o sekundární pocit). Když se hodnota shoduje s `cluster_id`, jde o hlavní pocit, který je zároveň názvem klastru. Ve výchozím zobrazení se ukazují hlavní pocity; tlačítko „Další" dozobrazí sekundární. Obě skupiny se řadí samostatně podle `sort_order`.
- Všechny sekundární pocity jsou `"tier": "premium"`. Ve free verzi se tedy zobrazí jen názvy klastrů bez tlačítka „Další".

```json
{
  "id": "feel_0053",
  "name": "neviditelný",
  "cluster_id": "cl_0001",
  "main": "cl_0001",
  "tier": "free",
  "sort_order": 1
}
```

### 3. První pomoc v krizi — `crisis.json`

Návody první pomoci v konkrétních situacích (První psychická pomoc, Panická ataka, Hyperventilace, Silná úzkost, Zahlcení myšlenkami, Neobvyklé tělesné příznaky, Depresivní propad, Přetížení a vyčerpání, Odpojení od reality, Silný stud a sebekritika, Sebevražedné myšlenky, Zmatek a chaos). Bez `schemas`, bez data přidání — jde o malou, stabilní sadu, která se nebude výrazně rozšiřovat.

```json
{
  "id": "crisis_0001",
  "name": "První psychická pomoc",
  "body": "## Markdown: popis stavu, kontrola bezpečí, postup",
  "tier": "free",
  "sort_order": 1
}
```

### 4. Tělesné příznaky — `body.json`

Psychosomatická encyklopedie. Uživatel klikne na příznak a dostane vysvětlení. Bez `schemas`, bez data přidání — také spíš stabilní sada.

Tělo markdownu má **pevný skelet 7 bloků** (`##`): Jak se projevuje / Psychické příčiny / Přirozené fyziologické příčiny / Kdy a při čem se zhoršuje / Co přináší úlevu / S čím se to často plete / Kdy konzultovat lékaře. Výkladové bloky jsou souvislý text, výčtové bloky mají úvodní větu s dvojtečkou + odrážky + `*kurzíva dovětek*`. Formátovací pravidla drží prompt `local/_prompty/telesne-priznaky.md`.

```json
{
  "id": "body_0001",
  "name": "Bolest hlavy",
  "body": "## Markdown: projevy, psychické příčiny, fyziologické příčiny, kdy k lékaři",
  "tier": "free",
  "sort_order": 1
}
```

### 5. Články — `articles.json`

Zkrácené verze blogových článků ze stestinaproti.cz, 1–5 minut čtení. Tělo v markdownu, souvislý text **bez `##` nadpisů** — čte se jako jedna plynulá úvaha, ne jako segmentovaný dokument.

Krácení řídí prompt `local/_prompty/clanky_kraceni_prompt.md`: originál do 600 slov se nekrátí vůbec, delší se krátí na 600 slov (u výčtových článků nad 1800 slov na 750). Dřívější označení „mikročlánky" už neodpovídá — reálná sada má 112 článků o průměrné délce ~3 400 znaků.

- **`schemas`** — tři schémata podle priority (váhy 3, 2, 1), slouží doporučování.
- **`reading_time`** — v ostré verzi ho počítá admin z délky textu.
- **`quality`** — kvalita/užitečnost na škále 1–5 (pětky se zobrazují v záložce „Redakce").
- **`slug`** — v ostré verzi ho admin generuje z titulku.

**Tagování (přetagováno 11. 9. 2026):** logika se oproti otázkám a inspiracím **otáčí** — uživatel v Článcích hledá stav jménem („mám úzkost / paniku / OCD, co si o tom přečíst"), takže **„Stavy a potíže" jsou primární**. Pořadí podle priority: 1. stav/potíž (nebo emoce, když je článek o ní), 2.–3. co článek učí (`přerámování myšlenek`, `expozice`, `tělo`…) nebo cíl z „Chci pracovat na", zbytek tie-break. 3–6 tagů, průměr 4,75. Tag jen když je článek **o tom**, ne když se toho dotýká; tagováno z těla, ne z titulku. Přidané tagy: `psychoterapie` a `léky` (klastr „jít si pro pomoc" — 10 resp. 5 článků, dřív bez klikacího cíle), `perfekcionismus` (8), `psychické obrany` (pětidílný seriál), `tlak na výkon`, `prokrastinace`, `kontrola`, `sebelítost` (rezervy pro budoucí obsah, dnes 1–4 výskyty), `sebepoškozování` (zatím bez obsahu, vědomě).
- **`published_at`** vs **`added_at`** — datum původního vydání článku vs. datum přidání do aplikace (dvě různá data).
- **`source_url`** — adresa původního článku na blogu. Vyplňuje se **vždy**, nezávisle na `show_link`.
- **`show_link`** — jestli se pod článkem nabídne odkaz na plné znění. **Neznamená „máme URL"** (tu má každý článek), ale **„tenhle text je podstatně osekaný"**. Pravidlo pochází z krátícího promptu (`local/_prompty/clanky_kraceni_prompt.md`): originál do 600 slov se nekrátí vůbec → `false`; delší se krátí na 600 slov (u výčtových článků nad 1800 slov na 750) a pokud se odřízlo víc než 20 % původního textu → `true`. Aktuálně 71 článků ze 112 má `true`.

  Renderer vykreslí pod tělem tichý řádek **„Celý článek na blogu"** s odkazem, otevře se v novém panelu. Odkaz staví renderer jako UI prvek, **ne markdown** — parser odkazy neumí a do těl se zásadně nepíšou. Podmínka na `https://` v `source_url` je pojistka proti čemukoli, co není webová adresa. Platí i v Oblíbených, protože detail sází stejná funkce.

```json
{
  "id": "art_0001",
  "title": "Proč se bojíme blízkosti",
  "slug": "proc-se-bojime-blizkosti",
  "perex": "Krátký úvodní text pro seznam...",
  "body": "Markdown tělo článku...",
  "source_url": "https://stestinaproti.cz/proc-se-bojime-blizkosti/",
  "show_link": true,
  "tags": ["úzkost", "vztahy"],
  "schemas": ["EMODEP", "ABINST", "DEFSH"],
  "tier": "free",
  "quality": 5,
  "reading_time": 3,
  "sort_order": 1,
  "published_at": "2026-04-02",
  "added_at": "2026-04-02"
}
```

### 6. Cvičení — `exercises.json`

Hyperstručná cvičení napříč terapeutickými směry. Ve výchozím zobrazení je vidět postup (`body`); po klepnutí na info ikonu se rozbalí rozšířený kontext (`info` — k čemu to je, mindset, na co si dát pozor). Oba jsou markdown.

- **`duration`** — délka v minutách.
- **`schemas`** — tři schémata podle priority.
- **`quality`** — 1–5.
- Tagy se berou z `tagy.json` (viz Tagy níže), skupiny pro barevné odlišení ve filtru jsou tam taky.

```json
{
  "id": "ex_0001",
  "section_id": "sec_0004",
  "chain_id": null,
  "chain_order": null,
  "name": "Jednoduché řízené dýchání",
  "perex": "Krátký popis cvičení.",
  "body": "## Markdown: Než začneme, Postup, Co mít na paměti",
  "info": "## Markdown: k čemu, mindset, bariéry",
  "info_extra": null,
  "theory": null,
  "theory_extra": null,
  "practice": null,
  "diary_exercise": "* Otázky do deníku…",
  "attachments": [],
  "duration": 5,
  "frequency": "podle potřeby",
  "training_period": null,
  "difficulty": "nízká",
  "warning": null,
  "tags": ["dýchání", "zklidnění"],
  "schemas": ["VULILL", "NEGPES", "EMOINH"],
  "tier": "free",
  "quality": 3,
  "sort_order": 1,
  "added_at": "2026-08-13"
}
```

#### Řazení cvičení

`sort_order` udává pořadí cvičení **v rámci jeho oddílu**, počítáno od 1. Není unikátní napříč souborem — v každém oddílu začíná znovu jedničkou.

Seznam cvičení uvnitř jednoho oddílu se proto řadí podle `sort_order`. Seznamy, které míchají cvičení z různých oddílů (filtr podle tagů, výsledky hledání, oblíbené), se podle `sort_order` řadit nedají — dostaly by se vedle sebe samé jedničky. Tam se řadí podle `id`, které odpovídá pořadí cvičení v cvičebnici a je unikátní.

Z toho plyne pravidlo pro nový obsah: **`id` nese globální pořadí, `sort_order` pořadí v oddílu.** Cvičení přidané mimo cvičebnici dostane nejbližší volné `id` (`ex_0072` a dál) a `sort_order` podle toho, kam v oddílu patří — ostatní cvičení v tom oddílu se přečíslují, cvičení v ostatních oddílech se nedotknou.

Globální `sort_order` byl zvážen a **zamítnut**: byl by duplicitou k `id` a rozbil by se na prvním novém cvičení vloženém doprostřed oddílu.

### 7. Oddíly — `sections.json`

Jedenáct oddílů, do kterých jsou cvičení rozdělená. Nesou sekci **„Moje cesta"** (nasazena 12. 9. 2026): uživatel vidí seznam oddílů a po rozkliknutí stránku se submenu **Cvičení / Info / Teorie / Praxe** (výchozí **Cvičení** — kdo otevře oddíl, chce cvičit, teorii si klikne; SPEC měl Teorii, změněno 12. 9. 2026). Tab se kreslí jen tehdy, když má obsah; když zbyde jediný, nekreslí se vůbec. Detail cvičení dědí `info`/`theory`/`practice` z oddílu — viz Cvičení níže.

- **`perex`** — jedna věta, co oddíl nabízí. Zobrazí se v seznamu oddílů.
- **`info`**, **`theory`**, **`practice`** — markdown pro jednotlivé taby submenu.
- **`diary_exercise`** — otázky do deníku společné **všem cvičením oddílu**. V rendereru se slepí s `exercise.diary_exercise` do jednoho bloku na konci cvičení, nejdřív oddílové, pak cvičební. Proto se do jednotlivých cvičení **nekopírují** — cvičení má `null`, když mu stačí oddílové.
- **`diary_practice`** — otázky do deníku pro tab Praxe. S ničím se neslepuje.

**Oddíly `sec_0001`–`sec_0003`** (Před cestou, Odborná pomoc, Životní styl) nemají žádná cvičení — jen souvislý text v `theory`, ostatní pole `null`. Zobrazují se jako samostatná textová stránka.

```json
{
  "id": "sec_0004",
  "title": "Relaxace a pocit bezpečí",
  "perex": "Jedna věta, co oddíl nabízí.",
  "info": "## Markdown pro tab Info",
  "theory": "## Markdown pro tab Teorie",
  "practice": "## Markdown pro tab Praxe",
  "diary_exercise": "* Otázky společné všem cvičením oddílu",
  "diary_practice": "* Otázky do deníku v tabu Praxe",
  "sort_order": 4
}
```

### 8. Řetězy — `chains.json`

Řetěz je sada cvičení s logickou návazností, kterou je doporučeno absolvovat popořadě. **V budoucnu z řetězů budou cesty ke zvládnutí.** Do řetězu patří jen část cvičení oddílu; každé má pevné místo dané polem `chain_order` na cvičení.

V appce nese řetěz jen box na stránce cvičení (nasazen 12. 9. 2026): pořadí („2/6 · Cvičení je součástí řetězu") s chevronem; po rozkliknutí název řetězu, doporučení začít od prvního a seznam všech jeho cvičení s proklikem, aktuální zvýrazněné. Box je **jediný nosič návaznosti** — žádné odkazy na první článek řetězu v textu, žádné pole `basics_ref` (zvažováno a zamítnuto). Řetězové cvičení smí v „Než začneme" jednou větou říct, na čem staví, ale bez prokliku.

| ID | title | section_id | cvičení |
|---|---|---|---|
| chain_0001 | Nácvik aplikované relaxace | sec_0004 | ex_0013–ex_0018 |
| chain_0002 | Přerámování myšlenek | sec_0006 | ex_0030–ex_0033 |
| chain_0003 | Expoziční terapie | sec_0008 | ex_0051–ex_0056 |
| chain_0004 | Spojení s tělem a vnitřními částmi | sec_0009 | ex_0059–ex_0063 |

`chain_0004` pokrývá celý oddíl 09 a jmenuje se stejně jako on. Je to v pořádku, jen se nesmí zaměnit oddíl a řetěz.

```json
{
  "id": "chain_0001",
  "section_id": "sec_0004",
  "title": "Nácvik aplikované relaxace",
  "sort_order": 1
}
```

### 9. Triplet přerámování — `reframings.json`, `reframing_questions.json`, `reframing_actions.json`

Tři seznamy navázané vždy na jeden konkrétní klastr (ne na jednotlivý pocit). Nejsou sdílené napříč klastry — každý klastr má svůj vlastní triplet. V aplikaci mezi nimi uživatel přepíná horizontálním submenu.

`sort_order` je lokální v rámci clusteru (restart na 1, hustě 1..N). ID je globálně unikátní per typ a pořadí nenese.

**7a. Přerámování** (`reframings.json`) — terapeuticky přesné texty nabízející jiný pohled na jádrový pocit.

```json
{
  "id": "ref_0001",
  "cluster_id": "cl_0001",
  "text": "To, že se cítíš zbytečný, neznamená, že jsi zbytečný...",
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

**7b. Otázky** (`reframing_questions.json`) — podnětné otázky k danému jádrovému pocitu. Prefix ID `refq_`.

**7c. Úkoly** (`reframing_actions.json`) — doporučené akce, výzvy a behaviorální experimenty. Prefix ID `refa_`.

7b i 7c mají stejnou strukturu jako 7a (`id`, `cluster_id`, `text`, `tier`, `sort_order`, `added_at`).

**Stav 11. 9. 2026 — kompletní pro všech 116 klastrů:** 5202 přerámování, 3592 otázek, 3611 úkolů. Zdroj pravdy je `local/data_wip/reframings_triplet_wip/reframings.xlsx` (sheet per klastr, řádky `R`/`Q`/`A`/`E`), `data/` je výsledek `build_triplet.py`. **Řádky `E` (behaviorální experimenty, 1183, začínají „Experiment …“) jdou do úkolů** — rozhodnuto 11. 9. 2026, žádný čtvrtý soubor. Obsah je nepročištěný (některé klastry mají narváno z několika sessions, `cl_0096` je smíchaný s „náročný“) — čistka proběhne přímo v appce v režimu provizorního adminu.

### 10. Inspirace — `inspirations.json`

Citáty, rady, moudra. `author` smí být `null` (lidová moudra, přísloví, vlastní výroky bez atribuce), `year` smí být `null`. **Bez pole `schemas`** — rozhodnuto 11. 9. 2026: citáty jsou lidsky univerzální, stejná logika jako u otázek; půl na půl (21 se schématy, 181 bez) by dělalo náhodný výběr tvářící se jako cílený. Inspirace tím stojí mimo doporučování.

Nasazeno 11. 9. 2026: **202 citátů** = 21 původních (přetagovaných) + 181 ze sklizně (`local/data_wip/inspirations_wip/sklizen.json`, prompt `local/_prompty/citaty.md`; pole `pole`/`zdroj`/`poznamka` ze sklizně se do dat nepřenáší). ID `inspir_0022`… navazují na původní.

**Tagování:** stejná pravidla jako u otázek — seřazeno podle priority, první tag = téma citátu. Citáty jsou krátké, typicky **2–3 tagy** (průměr 2,8), strop 6. Pouštějí se „Chci pracovat na" + „Vztahy", z „Emoce" jen když je emoce jádrem (strach, smutek, stud…), z „Co se při tom dělá" jen `přítomnost` / `mindfulness` / `tělo`. „Stavy a potíže" nikdy. Kvůli ~12 citátům čistě o kamarádech byl 11. 9. 2026 rozsloučen tag `přátelství` (dřív mapovaný na `vztahy`).

```json
{
  "id": "inspir_0001",
  "text": "Kdo má proč žít, snese téměř jakékoli jak.",
  "author": "Friedrich Nietzsche",
  "year": "1889",
  "tags": ["smysl života", "utrpení", "odolnost"],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

### 11. Podnětné otázky — `questions.json`

Univerzální seberozvojové otázky v samomluvě / ich-formě („Kdy se cítím nejvíc sám / sama sebou?"). **Bez pole `schemas`** — otázky vědomě stojí mimo doporučování, univerzálky nemají komu cílit. Nasazeno 11. 9. 2026: **251 otázek** = 193 ze sklizně (`local/data_wip/questions_wip/sklizen.json`, prompt `local/_prompty/otazky.md`) + 58 přepsaných z původní schema-sady (zkráceno, ich-forma, 5 dubletů sklizně vyhozeno). ID přečíslována od `quest_0001`.

**Tagování (rozhodnuto 11. 9. 2026):** 3–6 tagů, typicky 4, **seřazených podle priority** — první tag je téma, ve kterém otázka leží, další dva nesou váhu, zbytek je tie-break. Pouštějí se skupiny „Chci pracovat na" a „Vztahy", z „Emoce" jen když je emoce jádrem otázky (strach, vina, stud…), z „Co se při tom dělá" jen `tělo` / `přítomnost` / `mindfulness` / `dýchání`. „Stavy a potíže" se u otázek nepoužívají vůbec — člověk, který klikne „panická ataka", je v akutním módu a seberozvojovka mu nepomůže. Důvod stropu: u OR filtru dělá přesnost málo tagů na položce, ne hodně; a tag na pozici 7+ nemá v žádném skórování váhu, která by ho odlišila od nuly (stejná logika jako `VAHY_POZIC` u doporučování). Appka zatím pořadí nečte (filtr je čistě OR), řazení výsledků podle váhy shodných tagů je budoucí krok.

```json
{
  "id": "quest_0001",
  "text": "Kdy se cítím nejvíc sám / sama sebou?",
  "tags": ["identita", "autenticita", "sebepoznání"],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-09-11"
}
```

### 12. Strachy — `fears.json` + `situations.json`

Druhá brána sekce Přerámování (viz „Sekce aplikace“). Dvě vrstvy, obě vedou do tripletu.

**12a. Kanonové strachy** (`fears.json`, 235, prefix `fear_`) — schematické strachy („Zrada“, „Samota“, „Chyby“, „Být za sobce“) ve **35 skupinách**, které čtou jako schémata v první osobě („Zůstanu sám“, „Jsem vadný, divný, nenormální“, „Selžu“). Skupiny jsou kategorie k rozkliknutí (235 položek plochým seznamem nejde). Každý strach má **5 jádrových pocitů** (`cluster_ids`, seřazené od nejtypičtějšího) — přes ně se strach napojí na triplet. Skupina „Obranné“ (Blízkost, Láska, Sex, Důvěřovat…) je vědomě mimo hlavní nabídku, jen do vyhledávání. Bez aliasů (zdrojový `kanon_strachu.md` je měl u dvou položek — zahozeno).

```json
{
  "id": "fear_0001",
  "name": "Zneužití",
  "group": "Zneužije mě, využije mě, podvede mě",
  "cluster_ids": ["cl_0017", "cl_0013", "cl_0015", "cl_0012", "cl_0042"],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-09-11"
}
```

**12b. Situace** (`situations.json`, 137, prefix `sit_`) — konkrétní běžné strachy, fobie, místa a situace (zkouška, pohovor, žraloci, pohřeb) v **10 skupinách** (Výkon a hodnocení, Sociální situace, Fobie, Zdraví a psychika…). `aliases` jsou pro vyhledávání (zkouška → test, státnice, maturita), nezobrazují se. `mark` řídí, co se ukáže před otázkou „Co je pod tím?“:

- **`P`** (121) — `reframings` 3–5 vět: fakta, logika, selský rozum, praktický postup. Bez bagatelizace.
- **`E`** (14) — `reframings` 1–2 věty empatické normalizace, žádná fakta (pohřeb, šikana, obtěžování). Strach je oprávněný.
- **`K`** (2) — `reframings` prázdné, appka vede na Krizovku (poruchy příjmu potravy, sebedestruktivní myšlenky).

`fear_ids` = 3–6 kanonových strachů, od nejtypičtějšího. Pocity se u situací nikdy nepřiřazují ručně — odvozují se přes kanon.

```json
{
  "id": "sit_0001",
  "name": "zkouška",
  "group": "Výkon a hodnocení",
  "aliases": ["test", "zkouškové", "státnice", "maturita"],
  "mark": "P",
  "reframings": ["Zkouška měří, co umíš v jednu konkrétní hodinu jednoho dne — …", "…"],
  "fear_ids": ["fear_0060", "fear_0033", "fear_0049", "fear_0063", "fear_0100", "fear_0038"],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-09-11"
}
```

Zdroje: `local/data_wip/strachy_wip/kanon_strachu_pocity.json` (kanon, zdroj pravdy pro skupiny) + `brany_reframings.md` (situace, JSON objekty; zadání v `zadani_brany.md`), build `build_fears.py`. **44 vět v přerámováních nese `[ověřit]`** (čísla a tvrzení k ověření) — seznam v `overit.md` vedle zdrojů, před ostrým nasazením musí projít.

### 13. Bolístky — `pains.json`

Třetí brána sekce Přerámování. **Věta, kterou si člověk říká** („Nestíhám, nemám na nic čas!“, „Manžel(ka) mě štve čím dál víc.“, „Dnešní mládež za nic nestojí.“) → **hlášky** — krátká přerámování ušitá na tu jednu větu. **Bez napojení na triplet** (vědomě, MVP). Prefix `pain_`.

**175 bolístek, 4199 hlášek** (11. 9. 2026). `smer` = na sebe (103) / na blízké (43) / na svět (29) — **appka ho nezobrazuje** (rozhodnuto 12. 9. 2026: je to autorská kategorie z výroby, ne otázka, kterou si člověk klade; seznam vět je jedno zrcadlo se searchem). `oblast` je stopa z tvorby (89 hodnot, mix úrovní, 23 bolístek ji nemá) — v datech zůstává, appka ji nezobrazuje; sjednocení až po škrtání. Hlášky nemají vlastní ID — v oblíbených a paměti viděného se adresují klíčem `pain_id:index` (např. `pain_0001:3`), který appka staví při načtení. `src_id` = původní WIP ID (p_/h_/k_ = přestřelka / harvest / klastry) pro dohledání.

Hlášky mají `source`: **`k`** = Karolínka (3480, 20 na bolístku, základ — čeština čistší, tón konzistentní, laskavě ironický „z knihovny do normálu“) a **`n`** = náš pool (719, typicky 4 na bolístku, vybrané z 2625 jako doplněk portfolia — krátká rána, humor, provokace, tělo, obrat perspektivy; rodiny opakovaček max jedna na bolístku, kovboj nikdy). `k_222` („Celý můj kalendář jsou povinnosti pro ostatní“) je navíc proti schválenému seznamu, má jen 15 našich. **Cíl je top 15 na bolístku** — škrtá Bob v appce (režim provizorního adminu), `source` je tam proto, aby bylo vidět, který hlas přežil.

```json
{
  "id": "pain_0001",
  "src_id": "p_001",
  "text": "Nestíhám, nemám na nic čas!",
  "smer": "na sebe",
  "oblast": "mít čas",
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-09-11",
  "hlasky": [
    { "text": "Možná opravdu nestíháš. Ale než z toho uděláš rozsudek …", "source": "k" },
    { "text": "Nestíhat všechno není selhání, to je fyzika: …", "source": "n" }
  ]
}
```

Zdroje: `local/data_wip/bolistky_wip/` — `brana4_bolistky.json` (seznam), `hlasky_karolinka.md`, `hlasky_davka01–18*.json`, `vyber_nase.json` (indexy vybraných našich), build `build_pains.py`.

### Shrnutí polí

| Soubor | `schemas` | datum | vazba na cluster |
|--------|-----------|-------|------------------|
| clusters | 5 | — | — |
| feelings | — | — | `cluster_id` |
| crisis | — | — | — |
| body | — | — | — |
| articles | 3 | `published_at` + `added_at` | — |
| exercises | 3 | `added_at` | — |
| reframings / _questions / _actions | — | `added_at` | `cluster_id` |
| fears | — | `added_at` | `cluster_ids` (5) |
| situations | — | `added_at` | přes `fear_ids` |
| pains | — | `added_at` | — (vědomě bez vazby) |
| inspirations | — | `added_at` | — |
| questions | — | `added_at` | — |

---

## EMS model (Youngova schémata)

Rozšířený model: 18 standardních Youngových schémat + 3 vlastní. Kódy nesené v poli `schemas` slouží k doporučování obsahu (viz níže) a k budoucímu propojování sekcí.

Tři vlastní schémata:

- **UNFAIR** — Unfairness / Křivda: pocit nespravedlnosti a křivdy.
- **LACKMEAN** — Lack of Meaningful World: pocit, že svět postrádá smysl.
- **LACKCOH** — Lack of Self-Coherence: pocit vnitřní nesouvislosti, rozpadání identity.

Reálně používané kódy v datech (21): `ABINST`, `APPREC`, `DEFSH`, `DEPINC`, `EMODEP`, `EMOINH`, `ENMUND`, `ENTGRAND`, `FAIL`, `INDISC`, `ISOLAL`, `LACKCOH`, `LACKMEAN`, `MISAB`, `NEGPES`, `PUNIT`, `SELFSAC`, `SUBJUG`, `UNFAIR`, `USHYPER`, `VULILL`.

---

## Design a chování UI

Vizuální hodnoty (barvy, fonty) žijí v `<style>` bloku `cesta.html`; tady je struktura, chování a design systém.

### Design systém

Nasazený 17. 7. 2026. **Zdroj pravdy je `<style>` blok v `cesta.html`** — nic jiného. Původní handoff a mockup jsou překonané: handoff leží jako historie v `local/_design/.old/`, screeny a mockup už neexistují a nejsou potřeba. **Není finální** — barvy čeká „overhaul do veselejší atmosféry", karty Přerámování doladění.

**Dvě témata (light + dark).** Přepínač dole v hamburger menu, volba v `localStorage` (`mc_theme`); dokud si uživatel nevybere, jede se podle systému (`prefers-color-scheme`). `data-theme` se píše na `#mc-root`, ne na `<html>` — uvnitř Miowebu nad ním nemáme kontrolu.

**Tón sekce (přerozděleno 12. 9. 2026).** Běžné používání — Moje cesta, Cvičení, Přerámování, Otázky, Inspirace, Články, O appce — jede **teal** (Bob mu říká „modrá"); **červená (accent)** zůstala jen pro zásah, když je zle: Tělesné příznaky a První pomoc. Registr sekcí má pole `tone`, render píše `data-tone` na `#mc-root`. Řídí barvu nadpisů (včetně nadpisů uvnitř markdownu), odrážek, ikonek dlaždic a výběru — tón platí pro celou sekci včetně vnitřku, ne jen pro dlaždici.

**Typografie.** Fraunces (nadpisy, titulky karet, citáty) + Public Sans (UI a běžný text) + mono (metadata, čísla). Fraunces je variabilní font s osou `opsz` — nastavuje se explicitně podle velikosti (72 pro H1, 36 pro H2, 24 pro titulky), bez toho vypadá placatě. Váha nadpisů 600.

**Osa `--gutter: 20px`** — veškeré boční odsazení jede přes ni, aby vše sedělo na jednu linku.

**Barvy** (z handoffu; ověřené kontrasty: text 13,6:1+, tag pilulky 4,45:1, text na accentu 4,69:1):

| | light | dark |
|---|---|---|
| pozadí / karta | `#F6F1E7` / `#FFFFFF` | `#1C1914` / `#262119` |
| text / tlumený | `#2B241C` / `#6B6053` | `#F2EBDC` / `#B5AA96` |
| accent (červená) | `#B8562E` | `#E08252` |
| teal (zelená) | `#3E7266` | `#6FBBA6` |

Vlastní proměnné nad rámec handoffu: `--tone`/`--tone-soft` (barva sekce), `--on-accent` (text na accent ploše — v light světlý, v dark tmavý), `--heart` (srdíčko, v light světlejší než accent), `--muted`. `--empty`/`--done`/`--missed` jsou zbytky bez použití.

### Obal aplikace

- **Hlavička** je vždy nahoře: vlevo hamburger (otevře menu se seznamem sekcí), uprostřed název „Moje cesta", vpravo srdíčko (vstup do Oblíbených) — **obrysové, plné jen když jsem v Oblíbených** (dřív se plnilo, když bylo cokoli uloženo; ten signál nikomu nic neříkal). U hamburgeru se při novém obsahu zobrazí badge s počtem novinek; v menu je počet novinek i na řádku dotčené sekce. Klik na název i na název v menu vede na úvod.
- **Úvodní stránka** — nadpis „Dnešní inspirace" + náhodný citát, pod tím **8 dlaždic** po párech v pořadí registru: Moje cesta / Cvičení, Přerámování / Otázky, Inspirace / Články, Tělesné příznaky / První pomoc. **První pomoc je dole u palce** (pořadí 12. 9. 2026 — lidé appku nepoužívají primárně pro krizi, ale když ji potřebují, má být na dosah). **O appce dlaždici nemá** (`tile:false`), jen řádek v menu — devátá dlaždice by trčela sama. Dlaždice vyplní zbytek výšky okna; pod 700px se samy zúží, aby se vešly bez scrollování.
- **Menu** (z hamburgeru) — sekce v pořadí registru s oddělovacími linkami (`sep` na položce): Moje cesta, Cvičení | Přerámování, Otázky, Inspirace, Články | Tělesné příznaky, První pomoc | Oblíbené (s počtem), Tmavý/Světlý režim, O appce.

### Dnešní inspirace

Na úvodce je jeden náhodný citát ze sekce Inspirace, **jeden na den** — opakované otevření appky ho nemění. Uvádí se jen text (bez autora a roku, ty se zobrazují jen v sekci Inspirace).

Losuje se z těch, které uživatel ještě neviděl; po vyčerpání všech se kolo restartuje. Stav drží `USER.daily = { date, id, seen[] }` v `localStorage`. Datum je lokální, ne UTC — jinak by se citát měnil ve dvě ráno. Když položka zmizí z dat, přelosuje se.

### Vzory obrazovek

Napříč sekcemi se opakují tři tvary:

1. **Seznam** — nadpis sekce + položky pod sebou (buttony nebo boxy). **Vpravo od H1 pilulka „♡ N"** = přepínač „jen oblíbené" v téhle sekci (viz Oblíbené).
2. **Detail** — nadpis a na stejném řádku vpravo u okraje ikony: šipka „Zpět" a (kde dává smysl) srdíčko. Pod tím obsah (markdown nebo boxy). Srdíčko má dva stavy (uloženo / neuloženo).
3. **Filtrovaný seznam** (obsahové sekce s tagy) — viz níže.
4. **Proud karet** (věty: triplet, hlášky, Inspirace, Otázky) — swipe místo seznamu, viz „Proud karet a paměť viděného".

### Filtrování obsahových sekcí (Cvičení, Otázky, Inspirace, Články)

- **Obsah první, filtr druhý.** Po vstupu je rovnou vidět seznam od nejnovějších; v submenu je zvýrazněné „Nejnovější". Žádná tagová brána, žádné tlačítko „Zobrazit".
- **Submenu:** Nejnovější / (Redakce — jen Cvičení a Články) / Pro vás (jen když existuje profil) / tlačítko Filtr hned vedle; **u vět (Inspirace, Otázky) vpravo u okraje dvě ikonky**: oko (jen nové) a seznam/karty — viz „Proud karet".
- **Filtr** je jedno tlačítko → rozbalí panel: nahoře keyword pole, pod ním pilulky — nejdřív `duration` (jen Cvičení), pak tagy. Bez nadpisů „Štítky"/„Délka", délku odliší accentový tón a mono písmo. Filtruje se in-place, submenu zůstává, žádná druhá obrazovka. Enter v poli zavře klávesnici (blur) — filtruje se průběžně, není co odesílat.
- **Tagy i délky se sčítají (OR), keyword se s nimi násobí (AND).** Víc zaškrtnutých tagů = širší výběr, ne užší; položka projde, když sedí na kterýkoli z nich. Původně byly tagy AND, ale u pár tagů na položku to vracelo skoro vždycky prázdno. Keyword zůstává AND — ten zužuje záměrně. Délka je multiple-choice stejně jako tagy.
- **OR říká, co projde; priorita tagů v datech říká pořadí (12. 9. 2026).** Každý zaškrtnutý tag přičte položce váhu podle své pozice v jejím `tags`: `TAG_VAHY = [6, 5, 4, 3, 2, 1]` (první tag 6, šestý a další 1). Řadí se skóre ↓ → počet shod ↓ → `added_at` ↓ → `id`. Zaškrtnu `strach` + `tělo` → nahoře cvičení, kde jsou to témata, dole ta, co se strachu dotýkají na tie-breaku. Bez zaškrtnutého tagu se nic nemění (Nejnovější je Nejnovější); v Redakci s tagem přebije skóre náhodné pořadí. `TAG_VAHY` je jediná laditelná konstanta filtru — lineární je bezpečný start, strmější (`[8,5,3,2,1,1]`) by nechal dominovat první tag.
- Panel drží stav; zavření panelu filtr nemaže. Ikona filtru ukazuje počet aktivních filtrů (keyword se počítá jako jeden).
- **`quality` není ve filtru** — „ukaž mi to nejlepší" pokrývá submenu Redakce. Quality je kurátorský nástroj, ne uživatelský ovladač.
- Naznačený řádek doporučených tagů (viz sekce níže) je **budoucí rozšíření**, ne MVP — vyžaduje kurátorskou údržbu, kterou zatím nemáme.
- `duration` (cvičení) a `reading_time` (články) zůstávají v datech pod svými jmény; v UI se zobrazují jednotně jako čas (ikonka hodin + „X min").

### Proud karet a paměť viděného (12. 9. 2026)

Pro **věty** — triplet přerámování, hlášky bolístek, Inspirace, Podnětné otázky — má appka vedle seznamu **proud karet**: swipe doprava, jedna věta = jedna karta přes obrazovku, velkým Fraunces vycentrovaná (velikost písma podle délky věty), počítadlo „3 / 48" mono vlevo dole a srdíčko vpravo dole (u palce). Ideální použití: tramvajová zastávka — pár vět, srdíčko, pryč, zítra zas. Články, cvičení, krizovka a tělo proud nemají — tam se čte struktura, ne věta.

- **Mechanika:** CSS `scroll-snap` horizontálně, bez knihovny. Výška karty se váže na okno (`100vh − 230px`, 400–720 px) — **uvnitř Miowebu je to výška elementu, ne okna; ověřit v embedu.**
- **Měkký odchod:** každých `SWIPE_BREAK = 10` karet vložený předěl „Stačí pro dnes?" (*Zavřít / Ještě pár*), na konci „To je všechno nové. Zítra zas." + *Zobrazit i viděné*. Appka sama nabízí odchod — jinak lidé swipují do konce s pocitem nedokoukaného seriálu.
- **Přepínač seznam / karty** = ikonka vpravo v řádku submenu; volba je **globální** v `localStorage` (`mc_view`) — je to vkus, ne kontext. Seznam je default.
- **Paměť „viděl jsem"** (`USER.seen[store] = [id…]`) **se plní jen v proudu karet** (karta na obrazovce = přečtená) a srdíčkem. **Seznam ji nikdy nepíše** — proscrollovat 50 karet není vidět je; IntersectionObserver v seznamu byl zvážen a zamítnut (odhad, ne důkaz). Nové položky v datech jsou automaticky neviděné, žádná migrace.
- **Přepínač „jen nové"** = ikona oka vedle přepínače karet: otevřené oko = vidím všechno, škrtnuté = viděné schované (s mini badge počtu nových). Globální (`USER.onlyNew`), pořád na očích, klik přepíná. Když jsou nové vyčerpané: „Všechno z tohohle už jste viděli · Zobrazit i viděné". Proud si při „jen nové" **snímkuje** seznam při vstupu (`state.swipe`), jinak by karty mizely pod rukama, jak se označují za viděné.

### Navigace a stav

- **Šipka „Zpět" vede tam, odkud jsem přišel**, ne na fixní seznam. Do téhož detailu se dá dojít ze seznamu, z Oblíbených i z „Pro vás"; detail si pamatuje návratový bod. V Přerámování vede Zpět z tripletu na pocity / skupinu strachů / situaci podle toho, odkud se přišlo (`rf.origin`).
- **Výběr pocitů v Přerámování se drží v rámci relace** — přežije přepnutí sekce, ale neukládá se (refresh = čistý stůl). Že něco visí vybráno, je vidět na spodním tlačítku „Zobrazit přerámování (N)".
- **Tělesné příznaky** se řadí abecedně (ne podle `sort_order`).

### Odchylky u Přerámování

Přerámování se od ostatních sekcí liší: keyword hledá v **pocitech / strachách / větách** (vstup do výběru), ne ve výsledném obsahu — proto je search samostatně nahoře, ne v filtračním panelu. Sloučení keyword+tagy se Přerámování netýká. Popisek clusteru pod boxy se zobrazuje jen v merged režimu (víc pocitů, nebo triplet ze strachu); u jednoho pocitu je zbytečný (všechny boxy jsou z jednoho clusteru).

### Budoucí rozšíření (mimo MVP)

- **Připínání „rychlé pomoci"** zamítnuto: srdíčko už plní účel „mít po ruce", druhý mechanismus by jen dělil totéž. Oblíbené zůstávají jediná sbírka (globálně po typech, per sekce přepínačem u H1).
- Naznačený řádek doporučených tagů nad seznamem.
- Strop diverzity a další ladění doporučování (viz Doporučování obsahu).

---

## Sekce aplikace a jejich chování

### Přerámování — tři brány (rozhodnuto 11. 9. 2026, nasazeno 12. 9. 2026)

Sekce má po vstupu **tři karty** (rozcestník) — tři způsoby, jak člověk pojmenuje svůj stav. Každá nese jednu větu „kdy sem“, protože názvy samy o sobě uživatel v akutním módu nerozliší:

| brána | jazyk uživatele | data | kam vede |
|---|---|---|---|
| **Jádrové pocity** | *„Vím, co cítím“* | `feelings` → `clusters` | triplet (single / merged mód, viz níže) |
| **Strachy** | *„Bojím se něčeho konkrétního“* | `situations` → `fears` → `clusters` | triplet přes merged interleaving |
| **Bolístky** | *„Mám v hlavě větu, která bolí“* | `pains` | hlášky — vlastní přerámování, **bez tripletu** |

**Brána Strachy** — jedna obrazovka: search nahoře (hledá v názvech i `aliases` **napříč oběma vrstvami**, včetně skryté skupiny; „maturita“ najde zkoušku), pod ním submenu **Konkrétní strachy / Jádrové strachy** (situace první — to je jazyk uživatele) a **seznam kategorií s počtem** (`group`; 10 u situací, 34 u kanonu — skupina `Obranné` je mimo nabídku, jen do hledání) → klik → položky skupiny.

- **Kanonový strach** (klik na „Selžu“ ve skupině *Selžu*) → rovnou triplet. Appka vezme `cluster_ids` strachu a pustí merged interleaving, jako by uživatel vybral víc pocitů naráz — žádný mezikrok s výběrem. **Do tripletu jdou první 3 z 5** (`FEAR_CLUSTERS = 3`, laditelná konstanta); pozice 4–5 jsou v datech, ale v kolovém interleavingu by dostaly stejné slovo jako první a ředily by výsledek. Titulek tripletu = název strachu, pod ním **tři jádrové pocity, ze kterých to jde** — uživatel je nevybíral, ale vidí, odkud přerámování pocházejí („Co je pod tím“ dotažené do konce). Karty nesou jméno pocitu jako meta (merged režim).
- **Situace** (klik na „zkouška“ ve skupině *Výkon a hodnocení*) → podle `mark`: `P` ukáže přerámování jako karty, `E` věty empatie kurzívou, `K` box + tlačítko „Otevřít První pomoc“. Přerámování situací **nemají srdíčka** (nemají ID; šlo by klíčem `sit_id:index` jako u hlášek, zatím ne). Pod tím **„Co je pod tím?“** → chipsy jejích `fear_ids` (3–6 kanonových strachů) → klik → triplet jako výše. Tedy zkouška → Co je pod tím → Selžu → triplet, dva kliky. Zpět z tripletu vede na situaci, z ní na skupinu.

**Brána Bolístky** — **bez kategorií** (rozhodnuto 12. 9. 2026, `smer` se nezobrazuje): jedno zrcadlo 175 vět se searchem, po 30 („Dalších 30“), klik → věta jako titulek, hlášky jako karty se srdíčky (klíč `pain_id:index`). Hlášky umí proud karet i „jen nové“. Na road trip (září 2026) se appka tweakne na **provizorní admin** — Bob v ní škrtá hlášky z ~24 na 15 a maže evidentní chyby v tripletu; výsledek se pak propíše zpět do zdrojů.

**Oblíbené v sekci** (pilulka u H1 rozcestníku): uložená přerámování jsou napříč klastry, proto se ukazují jako jeden seznam po typech (přerámování / otázky / úkoly / bolístky), ne po pocitech.

Otevřené, vědomě odložené: bolístky nemají most k tripletu (kanon má „Nebýt potřebný“, bolístky „Nikdo mě nepotřebuje“ — jednou si o něj řeknou); situace by mohly nabízet i „rovnou k přerámování“ se součtem pocitů přes všechny své strachy.

#### Jádrové pocity (původní vstup)

Po vstupu je vidět seznam hlavních pocitů (názvy klastrů) ve dvou sloupcích; tlačítko „Další" dozobrazí sekundární pocity. Submenu (Přerámování / Otázky / Úkoly / Zpět) se objeví až po volbě pocitu.

Tři způsoby volby a tři režimy:

1. **Single mód** — uživatel klikne přímo na jeden pocit → identifikace klastru → přímé zobrazení jeho tripletu. Žádné vážení, žádný interleaving.
2. **Merged mód** — uživatel zaškrtne dva a více pocitů a odešle → identifikace klastrů → sloučené seznamy vzniklé váženým kolovým interleavingem (viz algoritmus níže).
3. **Test** — *budoucnost, není v MVP.* Volbou pocitů uživatel dostane odhad aktivních maladaptivních schémat.

Tentýž interleaving běží identicky pro všechny tři typy tripletu nad stejnou množinou klastrů. Uživatel volí pocity jednou a mezi typy jen přepíná submenu.

Dlouhé merged seznamy se stránkují po 50 („Dalších 50"). Prioritizace se reálně projeví jen na prvních 1–2 stránkách.

### Merged interleaving — algoritmus

Cíl: poskládat seznamy trefených klastrů do jednoho merged seznamu tak, aby klastry, ze kterých uživatel vybral víc pocitů, byly nahoře hustěji zastoupené. Nepracuje se schématy — jde o přímou vazbu pocit → klastr → jeho seznam.

Klíčová rozhodnutí (vědomá, neměnit bez důvodu):

- **Kola, ne rozprostření.** V jednom kole vydá klastr tolik položek, kolik z něj bylo vybráno pocitů (výběr 3:2:1 → blok 3, pak 2, pak 1, a opakuj). Alternativa „largest remainder / Bresenham" byla zvážená a zamítnutá — silný klastr má přijít v dávce, ne rozetřený.
- **Pořadí klastrů:** primárně sestupně podle počtu z nich vybraných pocitů, při remíze vzestupně podle `sort_order` klastru.
- **Počet položek na klastr v kole** = počet z něj vybraných pocitů.
- **Vyčerpaný seznam** vypadne ze hry, ostatní pokračují beze změny pravidel.
- **Strop síly klastru:** klastr s jediným pocitem nelze zesílit nad rámec té jedničky. Akceptované omezení.
- **Dedup** je jen pojistka (seznamy jsou unikátní): položka se shodným ID se zobrazí jen při prvním výskytu, přeskočení duplicity nečerpá kvótu.

```
── PŘÍPRAVA ──
počty = {}
pro každý vybraný pocit:
    počty[klastr_pocitu] += 1

klastry = klíče(počty) seřazené podle:
    1. počty[cl]        sestupně
    2. cl.sort_order    vzestupně

seznam[cl] = obsah_klastru(cl, typ)   // unikátní seznam daného typu
pozice[cl] = 0
viděná_ID  = {}
merged     = []

── HLAVNÍ SMYČKA (kola) ──
dokud existuje klastr s nevyčerpaným seznamem:
    pro každý klastr cl (v seřazeném pořadí):
        kvóta  = počty[cl]
        vydáno = 0
        dokud vydáno < kvóta A seznam[cl] není vyčerpaný:
            položka = seznam[cl][pozice[cl]]; pozice[cl] += 1
            pokud položka.id v viděná_ID: pokračuj   // dedup, nečerpá kvótu
            viděná_ID.přidej(položka.id)
            merged.přidej(položka); vydáno += 1

── VÝSTUP ──  merged  (stránkovat po 50)
```

### Články

Submenu: Nejnovější / Redakce / Filtr (Pro vás až s profilem; řádek doporučených tagů je budoucnost).

- **Nejnovější** (výchozí): perexy od nejnovějších.
- **Redakce:** perexy článků s `quality` = 5, při každém zobrazení náhodné pořadí.
- **Pro vás:** jen pokud existuje profil uživatele; doporučené články podle priority (viz doporučování).

Radiobutton „Nepřečtené" filtruje jen nepřečtené články. Přečtené se drží v `localStorage`.

### Cvičení

Submenu: Nejnovější / Redakce / Pro vás (stejná logika jako mikročlánky). Ve výchozím zobrazení seznam tagů rozdělený do kategorií (viz výše).

**Detail cvičení** (dotažen k SPEC 12. 9. 2026, společný pro sekci Cvičení i Moje cesta): tag pilulky nad názvem → název → perex → řádek **„Oddíl 04 · Relaxace a pocit bezpečí ›“** (most do Moje cesta) → tabbar **Postup / Info / Teorie / Praxe** (Postup výchozí, aktivní tab tmavý, ostatní nesou tečku; tab jen když má obsah) → pod Postupem **box náročnosti** (Trvání `duration` · Praxe `frequency / training_period` · Náročnost jako barevná pilulka nízká/střední/vysoká; návrh `local/_design/box_náročnosti.jpg`) → **box řetězu** (když `chain_id`) → **box upozornění** (když `warning`) → kroky → **přílohy** (`attachments`, 16 cvičení — karta s titulkem a markdown tělem) → journal-card.

Info / Teorie / Praxe se u cvičení **dědí z oddílu** (`exercise.info` atd. jsou v datech vždy `null`); `info_extra` / `theory_extra` cvičení se předřadí nad oddílový text. Praxe vkládá `section.diary_practice` jako journal-card pozičně za druhý blok. **Journal-card v Postupu se kreslí z polí** `section.diary_exercise` + `exercise.diary_exercise` (slepené, nejdřív oddílové) — v `body` cvičení žádný deník není, `splitJournal` se u cvičení nevolá.

**Kroky** se skládají z číslovaného seznamu v markdownu — CSS countery nad `<ol>` dělají kolečko s číslem, vertikální linku a titulek kroku (tučný text na začátku položky). Datový model se nesahá, ale **vzor v datech je závazný**:

```
1. **Zaujmeme stabilní postoj.**
   * uvolníme ramena
   * vnímáme chodidla
```

Když se vzor poruší, kroky se rozpadnou na obyčejný seznam.

**Box náročnosti** nahradil duration strip a je jen u cvičení (články nesou čas pilulkou, jinak by ho měly dvakrát). Trvání bere přímo pole `duration` = jedna performance cvičení.

**Praxe (oddílová)** — `## Úvodní motivace` → `## Uvedení do praxe` → *(sem renderer vloží `section.diary_practice`)* → volitelné bloky → závěrečný blok s živým nadpisem („Jak začlenit relaxaci do každodenního života“; SPEC §5 měl jednotné „Začlenění do každodenního života“, 11. 9. 2026 rozhodnuto nechat živé nadpisy a vkládat deník pozičně za druhý blok). Oddílové `theory`/`practice` vykají, Postup je „my“ — záměr, ne chyba.

**Journal-card** — tealová karta s ikonou deníku, oddělená od postupu. Otázky v ich-formě. U cvičení se staví z polí (viz výše); `splitJournal` (oddělení bloku `## Zápis do deníku` z těla) zůstává jen pro ostatní typy, kde dnes žádný deník není — kandidát na Viktora.

CTA „Dokončit cvičení" z mockupu **není implementované** — appka nemá koncept dokončení cvičení, byla by to nová funkce i s daty.

### Moje cesta (nasazeno 12. 9. 2026)

Cvičebnice po oddílech — první dlaždice appky. Seznam 11 oddílů jako karty (číslo mono, název, perex, počet cvičení; oddíly 01–03 „text“). Klik → oddíl:

- **01–03** (bez cvičení): jen `theory` jako text.
- **04–11**: submenu **Cvičení / Info / Teorie / Praxe**, výchozí Cvičení. Seznam cvičení podle `sort_order` s řádkem metadat (čas · náročnost · řetěz „⛓ 2/6“ · ⚠ když má warning), klik → detail cvičení (stejný jako v sekci Cvičení). Praxe s `diary_practice` jako journal-card za druhým blokem.
- Zpět z detailu cvičení vede zpět do oddílu; pilulka ♡ u H1 ukáže uložená cvičení s oddílem jako meta.

### Inspirace a Podnětné otázky

Submenu: Nejnovější / Filtr, vpravo oko („jen nové") a přepínač seznam/karty. „Nejnovější" řadí od nejnovějších; s tagy ve filtru řadí priorita tagů. Umí proud karet a paměť viděného. („Pro vás" a řádek doporučených tagů jsou budoucnost — obě sady jsou bez `schemas`, doporučování se jich netýká.)

### První pomoc v krizi, Tělesné příznaky

Prostý seznam → klik → strukturovaný text → možnost uložit do oblíbených, tlačítko Zpět. První pomoc se řadí podle `sort_order`, tělesné příznaky abecedně. Tělesné příznaky mají navíc keyword search.

### Oblíbené

Napříč sekcemi: klepnutí na srdíčko u položky ji uloží (a označí za viděnou). Dvě cesty k uloženému (12. 9. 2026):

- **Globální feed** (srdíčko v hlavičce) — všechno po typech, včetně skupiny „Bolístky“ (hlášky, s větou bolístky jako meta).
- **Per sekce** — pilulka **„♡ N“ vpravo od H1** v každé sekci kromě O appce: přepínač „jen oblíbené“, zapnutý = plný; seznam ukáže jen uložené, filtr / keyword / Redakce se s tím násobí (AND), perex sekce se schová. Stav drží relace (`secState.favOnly`). Prázdný stav: „V téhle sekci zatím nic uloženého.“ Pilulka je menší a obrysová, ať se nečte jako „uložit celou sekci“ — počet ji vysvětlí. Přerámování → skupiny po typech (viz brány), Moje cesta → uložená cvičení s oddílem.

Položky, které mají vlastní detail (První pomoc, Tělesné příznaky, Články, Cvičení), jsou odsud **prokliknutelné** — `FAV_VIEW` má u nich `detail:true`. Přerámování, hlášky, Inspirace a Podnětné otázky detail nemají ani ve svých sekcích, takže odkaz nemají ani tady.

Karta v oblíbených vypadá stejně jako ve své sekci (`kind` v `FAV_VIEW` musí odpovídat rendereru sekce — Podnětné otázky jsou `quote`, ne `text`). Skupiny kreslí jedna funkce `favGroups(stores)` pro globální feed i sekční přepínač.

---

## Doporučování obsahu

Odpovídá na otázku „který obsah nabídnout na základě toho, co uživatel dlouhodobě prožívá". Platí **jen pro články a cvičení** — jediné typy s polem `schemas`. Každý typ se skóruje zvlášť, obsah se mezi typy nemíchá. Podnětné otázky (11. 9. 2026) i inspirace (11. 9. 2026) o `schemas` přišly a z doporučování vypadly: jsou lidsky univerzální a nemají komu cílit.

### Profil

Vážená mapa schémat uživatele, budovaná průběžně napříč celou historií klikání na pocity (ne jen v aktuální relaci). Každé kliknutí přidá váhy pěti schématům jeho klastru.

```
profil = {}
pro každý klik na jádrový pocit:
    cluster = cluster_pocitu
    pro každé z 5 schémat clusteru (pozice 1..5):
        profil[schéma] += (6 − pozice)
```

Profil se drží hotový v `localStorage` a aktualizuje inkrementálně při každém kliknutí.

### Skórování a řazení

```
VAHY_POZIC = [5, 4]          // jen pozice 1 a 2; zbytek se ignoruje

pro každého kandidáta daného typu:
    skóre = 0; šířka = 0
    pro pozice p v {1, 2}:
        u = profil[kandidát.schémata[p]] nebo 0
        skóre += u × VAHY_POZIC[p−1]
        pokud u > 0: šířka += 1

── PRÁH ──  zahoď kandidáty se skóre == 0
── ŘAZENÍ ──  sestupně: 1. skóre  2. šířka  3. added_at  4. id
vrať top-N
```

Klíčová rozhodnutí (vědomá, neměnit bez důvodu):

- **Skóruje se jen přes pozice 1–2 kandidáta.** Pozice 3–5 jsou nespolehlivý signál; kandidát s profilovým schématem až na páté pozici by se tvářil relevantně, přestože o uživateli skoro nic neříká. Při příliš úzkém výběru je první krok rozšíření na pozice 1–3, ne dál.
- **Práh je na nule.** Lepší nezobrazit nic než zobrazit nerelevantní — nerelevantní doporučení poškozuje důvěru víc než prázdné místo.
- **Šířka je jen tie-break, není součástí skóre.** Hloubka jednoho tématu je důležitější než šířka vlažných shod. Pokud by se šířka měla odměňovat výrazněji, je to jediné konkrétní místo ke změně.
- **`VAHY_POZIC = [5, 4]`** je výchozí, jediný laditelný prvek. V budoucnu lze změnit (např. `[8, 5]`).
- **Strop diverzity** (max 2–3 kandidáti se stejným schématem na pozici 1) je volitelný, až bude obsahu dost.

Historická poznámka: dřív existovala „kotva" a „žebřík tie-breaků" pro hledání jednoho vítězného klastru — pozůstatek doby, kdy se mylně předpokládalo, že přerámování stojí na schématech. Nestojí, stojí na klastrech. Pro řazený seznam doporučení je kotva zbytečná a neobnovuje se.

---

## Uživatelská data (`localStorage`)

Oblíbené a přečtené:

```json
{
  "favorites": {
    "crisis": ["crisis_0001"],
    "body": ["body_0001"],
    "articles": ["art_0003"],
    "exercises": ["ex_0007"],
    "reframings": ["ref_0042"],
    "reframing_questions": ["refq_0042"],
    "reframing_actions": ["refa_0042"],
    "pains": ["pain_0001:3"],
    "inspirations": ["inspir_0012"],
    "questions": ["quest_0005"]
  },
  "read": ["art_0003", "art_0005"],
  "seen": { "reframings": ["ref_0001", "ref_0002"], "pains": ["pain_0001:0"] },
  "onlyNew": false
}
```

`seen` = paměť viděného per store (plní jen proud karet a srdíčko), `onlyNew` = přepínač „jen nové“. Vedle toho v `localStorage` samostatně `mc_theme` (světlý/tmavý) a `mc_view` (seznam/karty). Paměť je per doména — Pages a Mioweb si ji nesdílí, stejně jako oblíbené.

Notifikace nového obsahu — počet položek, kde `added_at > last_seen[kategorie]`, je číslo na badge; klik na kategorii aktualizuje timestamp:

```json
{
  "last_seen": {
    "articles": "2026-04-12T08:00:00",
    "exercises": "2026-04-10T14:00:00",
    "reframings": "2026-04-15T10:30:00",
    "reframing_questions": "2026-04-15T10:30:00",
    "reframing_actions": "2026-04-15T10:30:00",
    "inspirations": "2026-04-10T14:00:00",
    "questions": "2026-04-10T14:00:00"
  }
}
```

Profil (vážená schémata) se drží tamtéž. Celkově jde o pár kB, strop kapacity nehrozí.

---

## Výpočetní náročnost

Veškeré výpočty (interleaving, skórování, agregace profilu) jsou nad daty tohoto rozsahu (116 klastrů, 399 pocitů, řádově tisíce položek) výkonnostně zanedbatelné — běží ve zlomku milisekundy i na mobilu. Jediné reálné místo k pozdější optimalizaci je velikost staženého JSON obsahu z GitHub Pages; až obsahu výrazně přibude, zvážit rozsekání na menší soubory s lazy-loadingem nebo cachování. Není to problém MVP.

---

## Stav projektu

**Struktura dat je finální. Obsah se plní postupně — nic není obsahově hotové, ale strukturálně to sedí.**

| Oblast | Stav |
|--------|------|
| Datový model všech 16 souborů | ✅ finální struktura |
| Klastry (116) + pocity (399) | ✅ kompletní mapa s ID a schématy |
| Technické ověření v Miowebu | ✅ hotovo (duben 2026) |
| Frontend — obal + registr sekcí | ✅ funkční, 8 dlaždic + menu z jednoho registru |
| Frontend — všechny sekce | ✅ živé v `cesta.html` nad všemi 16 JSONy (12. 9. 2026): Moje cesta, Cvičení s detailem k SPEC, Přerámování se třemi branami, oblíbené per sekce, proud karet s pamětí viděného |
| Spuštění na mobilu | ✅ PWA přes GitHub Pages (červenec 2026) |
| Design systém (light/dark, Fraunces, tóny sekcí) | ✅ nasazený 17. 7. 2026, základ odladěný; tóny přerozdělené 12. 9. 2026 |
| Vizuál — barvy | 🔄 z handoffu, čeká „overhaul do veselejší atmosféry" |
| Vizuál — karty proudu | 🔄 funkční, čekají na design pass (písmo, plocha, tón) |
| Triplet přerámování | ✅ kompletní 116/116 klastrů (5202 R / 3592 Q / 3611 A), nepročištěný |
| Strachy, situace, bolístky | ✅ nasazené v datech i appce; 44× `[ověřit]`, škrtání hlášek na 15 čeká |
| Ostatní obsah (články 112, cvičení 71, inspirace 202, otázky 251, krizovka 12, tělo 31) | ✅ nasazený, obsahově neprověřený (viz TODO) |
| Embed kompletní verze do Miowebu | 🔲 neověřeno (nově i výška proudu karet) |
| Provizorní admin (škrtání v appce) | 🔲 na závěr před road tripem |
| Admin nástroj | 🔲 k přestavbě od základu (stávající je zastaralý) |

---

## Poznámky k obsahu

Nevyřízené úkoly a otevřená rozhodnutí **nejsou tady — jsou v `TODO.md`** v kořeni repa.
Tenhle dokument popisuje, jak věci jsou; `TODO.md`, co se má stát.

### Stav pročištění obsahu (18. 7. 2026)

crisis, body (původních 5), exercises i articles jsou **pročištěné a naformátované** — slouží jako etalon pro prompty v `local/_prompty/`. Duplicitní názvy pryč, cvičení má bloky `##`, tělo pevný skelet 7 bloků, telefonní čísla v krizovce v `**bold**` (renderer je obarví tónem). Formátovací pravidla jednotlivých sekcí drží ty prompty, ne tento dokument.

### Odrážkové pravidlo (Bobovo, odvozené z krizovky)

Popis a vysvětlení = souvislý text. Akce, výčty a příznaky = odrážky. Úvodní věta bloku = bez odrážky (končí dvojtečkou, ať za ní fragmenty gramaticky sednou). Dovětek na konci = bez odrážky, kurzívou. Kontakty = bez odrážek, číslo na samostatném řádku. Odrážky jednoúrovňové, marker `*`, bez koncových teček.

### Hlas obsahu

Appka uživateli **vyká** (UI, perexy, placeholdery). Obsah cvičení a těla je v **„my"** — společná cesta, nepřikazujeme. Deník je v **ich-formě** („Jak jsem se cítil/a?"). Články stojí mimo: autorská řeč, kombinace vykání a „my" je tam **záměrná**.

---

## Soubory

```
cesta/
├── index.html               rozcestník na GitHub Pages
├── cesta.html     ★ aplikace — jediný živý HTML soubor
├── manifest.json            PWA (spuštění z plochy mobilu)
├── tagy.json                kanonický slovník tagů — jediný zdroj pravdy
├── data/                    16 datových JSONů (obsah aplikace)
├── assets/                  ikony
├── README.md                tento dokument — jak věci JSOU
├── TODO.md                  co se má stát (dělené podle toho, kdo to utáhne)
├── CLAUDE.md                pracovní brífink pro Claude Code
├── _scratch/                hrací písek (mimo git) — v tests/ headless testy appky (jsdom)
└── local/                   osobní podklady a rozpracovaná data (mimo git)
    ├── data_wip/            zdrojáky obsahu před nasazením do data/
    ├── _prompty/            prompty pro generování obsahu
    ├── _design/             podklady k designu
    ├── .backups/            ruční snapshoty
    └── .old/                překonané soubory včetně cesta_admin.html
```

Dělení jde podle toho, kdo soubor mění: do `data/` se sahá při plnění obsahu, do `assets/` skoro nikdy. `manifest.json` je konfigurace aplikace, ne obsah — proto zůstává v kořeni, kde ho čekají prohlížeče. `tagy.json` v kořeni je autorský nástroj, ne obsah — na Pages se nevozí.

**`cesta_admin.html` je v `local/.old/`**, ne v kořeni. Je zastaralý a rozešel se s datovým modelem, takže by vedle živých souborů jen mátl; k přestavbě od nuly (viz `TODO.md`).

### Jediný HTML soubor aplikace

Veškerá práce jde do **`cesta.html`** — je to jediná živá verze.

Dřív existoval ještě `cesta_prototyp.html`, samostatně vzniklý starší obal pro Mioweb (živé jen Přerámování + Oblíbené, `MC_BASE` na absolutní Pages URL). Byl to fakticky mrtvá větev, design ani obsah se do něj nepromítaly. **Smazán 14. 8. 2026** — zůstává v historii gitu, kdyby bylo potřeba se k němu vrátit.

Aplikace stojí na **registru sekcí** — jeden `SECTIONS = [...]` řídí úvodní dlaždice, hamburger menu i router. Nová sekce znamená doplnit renderer, obalem se nehýbe.

### Spuštění

**Lokálně:** `python -m http.server 8777` v kořeni → `http://localhost:8777/cesta.html`. Otevření souboru z disku nefunguje (fetch potřebuje HTTP).

**Headless testy:** `_scratch/tests/` (mimo git) — jsdom načte `cesta.html`, `fetch` čte z `data/`, testy klikají přes `window.MC.*` a kontrolují DOM. `node test.js` atd., viz README tam. Nemá layout — swipe a výšky ověří jen mobil.

**Na mobilu:** `https://haryzek.github.io/cesta/` → „Moje cesta" → v Chrome „Přidat na plochu". Cache je na HTML i JSONech vypnutá, takže po pushi stačí appku zavřít a znovu otevřít.

Aplikace je **HTML fragment** (bez `<html>`/`<head>`) kvůli vkládání do Miowebu. Meta tagy pro mobil jsou nahoře v souboru — WordPress je ignoruje. Barva pozadí visí na `#mc-root`; při samostatném běhu se `body` obarvuje přes `body:has(> #mc-root)`, což se uvnitř Miowebu (kde je `#mc-root` zanořený ve WP divech) nechytí a pozadí stránky zůstane WordPressu.


## Poznámky frontend

### Řazení cvičení

`sort_order` udává pořadí cvičení **v rámci jeho oddílu**, počítáno od 1.
Není unikátní napříč souborem — v každém oddílu začíná znovu jedničkou.

Seznam cvičení uvnitř jednoho oddílu se proto řadí podle `sort_order`.

Seznamy, které míchají cvičení z různých oddílů (filtr podle tagů, výsledky
hledání, oblíbené), se podle `sort_order` řadit nedají — dostaly by se vedle
sebe samé jedničky. Tam se řadí podle `id`, které odpovídá pořadí cvičení
v cvičebnici a je unikátní.

Z toho plyne pravidlo pro nový obsah: **`id` nese globální pořadí, `sort_order`
pořadí v oddílu.** Cvičení přidané mimo cvičebnici dostane nejbližší volné `id`
(ex_0072 a dál) a `sort_order` podle toho, kam v oddílu patří — ostatní cvičení
v tom oddílu se přečíslují, cvičení v ostatních oddílech se nedotknou.