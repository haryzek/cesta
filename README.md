# Moje cesta

Webová psychoterapeutická aplikace. Uživatel si vybere jádrový pocit a dostane sadu terapeuticky přesných textů (přerámování, otázky, úkoly), které si může uložit do oblíbených. Vedle toho aplikace nabízí mikročlánky, cvičení, inspirace, podnětné otázky, psychosomatickou encyklopedii tělesných příznaků a první pomoc v psychické krizi.

Autor obsahu: Robert Řeřicha, psychoterapeut (psychodynamika, IFS, KBT), Praha.

---

## Architektura

Čistě frontendové řešení: HTML + CSS + JavaScript + JSON. Žádný backend, žádná serverová databáze. Veškerý obsah leží v JSON souborech. Uživatelská data (oblíbené, přečtené, profil pro doporučování) se ukládají do `localStorage` prohlížeče.

### Integrace do Mioweb

Aplikace běží uvnitř členské sekce webu postaveného na Mioweb (WordPress). Na členskou stránku se vloží HTML element, do kterého přijde kód aplikace. JavaScript v HTML elementu funguje bez omezení, pokud nezasahuje do funkcí Miowebu. Ověřeno v praxi na testovací stránce (duben 2026): JS, interakce, dynamické vykreslování, načítání externích JS knihoven z CDN, `localStorage` i načítání JSON z GitHub Pages fungují. Upload `.js`/`.json` přímo do Médií Miowebu je blokovaný serverem — proto hosting na GitHub Pages.

### Hosting dat

JSON soubory jsou hostované na GitHub Pages. Repozitář slouží zároveň jako záloha a jako prostředí pro práci na dálku; není to veřejně sdílený projekt.

- Repozitář: `https://github.com/haryzek/cesta`
- GitHub Pages URL: `https://haryzek.github.io/cesta/`

### Dvě verze aplikace

Obě verze jsou technicky tatáž aplikace, liší se pouze rozsahem obsahu. Rozlišení řídí pole `tier` u jednotlivých položek.

- **Free** — omezený obsah, bonus k placenému kurzu, přístup přes členskou sekci kurzu. Položky s `"tier": "free"`.
- **Premium** — kompletní a průběžně rozšiřovaný obsah, samostatná členská sekce s předplatným 99 Kč/měsíc. Položky s `"tier": "premium"`.

---

## Datový model

Obsah je rozdělený do jedenácti JSON souborů. **Struktura všech souborů je finální a doladěná.** Obsah zatím finální není — plní se postupně (viz Stav níže).

Napříč všemi soubory platí:

- **ID** je permanentní totožnost položky. Formát `prefix_NNNN` se čtyřmístným zero-paddingem (např. `ref_0001`). ID se nikdy nemění a nenese žádnou informaci o pořadí. V ostré verzi ho přiděluje admin při vytvoření položky.
- **`sort_order`** určuje pořadí. U tripletu přerámování je lokální v rámci clusteru (restartuje na 1, hustě 1..N bez děr). U plochých typů obsahu je globální v rámci souboru.
- **`tier`** je vždy `free` nebo `premium`.
- **Tagy** jsou vždy lowercase.
- **`schemas`** nese kódy Youngových schémat (viz EMS model níže). U clusterů je jich pět, u obsahu tři.

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

Psychosomatická encyklopedie. Uživatel klikne na příznak a dostane vysvětlení. Struktura markdownu: jak se příznak projevuje, psychické příčiny, přirozené fyziologické příčiny, kdy vyhledat lékaře. Bez `schemas`, bez data přidání — také spíš stabilní sada.

```json
{
  "id": "body_0001",
  "name": "Bolest hlavy",
  "body": "## Markdown: projevy, psychické příčiny, fyziologické příčiny, kdy k lékaři",
  "tier": "free",
  "sort_order": 1
}
```

### 5. Mikročlánky — `articles.json`

Miniaturizované verze blogových článků, 1–5 minut čtení. Tělo v markdownu.

- **`schemas`** — tři schémata podle priority (váhy 3, 2, 1), slouží doporučování.
- **`reading_time`** — v ostré verzi ho počítá admin z délky textu.
- **`quality`** — kvalita/užitečnost na škále 1–5 (pětky se zobrazují v záložce „Redakce").
- **`slug`** — v ostré verzi ho admin generuje z titulku.
- **`published_at`** vs **`added_at`** — datum původního vydání článku vs. datum přidání do aplikace (dvě různá data).

```json
{
  "id": "art_0001",
  "title": "Proč se bojíme blízkosti",
  "slug": "proc-se-bojime-blizkosti",
  "perex": "Krátký úvodní text pro seznam...",
  "body": "Markdown tělo článku...",
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
- Tagy jsou v aplikaci rozdělené do kategorií (Typy potíží, Uvolnění a zklidnění, Práce s myšlenkami, Behaviorální práce, Vnitřní prožívání, Práce s tělem, Produktivita, Vztahy a komunikace, Životní styl, Spokojenost a štěstí).

```json
{
  "id": "ex_0001",
  "name": "Body scan",
  "perex": "Krátký popis cvičení.",
  "info": "## Markdown: k čemu, mindset, bariéry",
  "body": "## Markdown: postup, kroky",
  "duration": 15,
  "tags": ["mindfulness", "tělesná cvičení"],
  "schemas": ["EMODEP", "ABINST", "DEFSH"],
  "tier": "free",
  "quality": 5,
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

### 7. Triplet přerámování — `reframings.json`, `reframing_questions.json`, `reframing_actions.json`

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

### 8. Inspirace — `inspirations.json`

Citáty, rady, moudra.

```json
{
  "id": "inspir_0001",
  "text": "Kdo má proč žít, snese téměř jakékoli jak.",
  "author": "Viktor Frankl",
  "year": "1946",
  "tags": ["smysl života", "utrpení"],
  "schemas": ["EMODEP", "ABINST", "DEFSH"],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

### 9. Podnětné otázky — `questions.json`

Otázky k sebereflexi. Sdílí sadu tagů s inspiracemi.

```json
{
  "id": "quest_0001",
  "text": "Kolik času jsi dnes strávil přemýšlením o sobě?",
  "tags": ["sebepoznání"],
  "schemas": ["EMODEP", "ABINST", "DEFSH"],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

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
| inspirations | 3 | `added_at` | — |
| questions | 3 | `added_at` | — |

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

Rozhodnutá vize rozvržení a interakcí. Vizuální hodnoty (barvy, fonty) žijí v prototypu; tady je struktura a chování.

### Obal aplikace

- **Hlavička** je vždy nahoře: vlevo hamburger (otevře menu se seznamem sekcí), uprostřed název „Moje cesta", vpravo srdíčko (vstup do Oblíbených). U hamburgeru se při novém obsahu zobrazí badge s počtem novinek; v menu je počet novinek i na řádku dotčené sekce.
- **Úvodní stránka** — dlaždice po párech vedle sebe (První pomoc / Tělesné příznaky, Přerámování / Cvičení, Otázky / Inspirace, Články / O appce). Responzivní, vyplní plochu pod hlavičkou.
- **Menu** (z hamburgeru) — tytéž sekce jako svislý seznam řádků, vpravo případně badge novinek.

### Vzory obrazovek

Napříč sekcemi se opakují tři tvary:

1. **Seznam** — nadpis sekce + položky pod sebou (buttony nebo boxy).
2. **Detail** — nadpis a na stejném řádku vpravo u okraje ikony: šipka „Zpět" a (kde dává smysl) srdíčko. Pod tím obsah (markdown nebo boxy). Srdíčko má dva stavy (uloženo / neuloženo).
3. **Filtrovaný seznam** (obsahové sekce s tagy) — viz níže.

### Filtrování obsahových sekcí (Cvičení, Otázky, Inspirace, Články)

- **Obsah první, filtr druhý.** Po vstupu je rovnou vidět seznam od nejnovějších; v submenu je zvýrazněné „Nejnovější". Žádná tagová brána, žádné tlačítko „Zobrazit".
- **Submenu:** Nejnovější / (Redakce — jen Cvičení a Články) / Pro vás (jen když existuje profil) / ikona filtru.
- **Filtr** je jedna ikona → rozbalí panel: nahoře keyword pole, pod ním tagy (multiple-choice) a `duration` jako samostatný ovladač. Filtruje se in-place, submenu zůstává, žádná druhá obrazovka.
- **Keyword a tagy se skládají (AND).** Panel drží stav; zavření panelu filtr nemaže. Ikona filtru ukazuje počet aktivních filtrů (keyword se počítá jako jeden).
- **`quality` není ve filtru** — „ukaž mi to nejlepší" pokrývá submenu Redakce. Quality je kurátorský nástroj, ne uživatelský ovladač.
- Naznačený řádek doporučených tagů (viz sekce níže) je **budoucí rozšíření**, ne MVP — vyžaduje kurátorskou údržbu, kterou zatím nemáme.
- `duration` (cvičení) a `reading_time` (články) zůstávají v datech pod svými jmény; v UI se zobrazují jednotně jako čas (ikonka hodin + „X min").

### Navigace a stav

- **Šipka „Zpět" vede tam, odkud jsem přišel**, ne na fixní seznam. Do téhož detailu se dá dojít ze seznamu, z Oblíbených i z „Pro vás"; detail si pamatuje návratový bod.
- **Výběr pocitů v Přerámování se drží v rámci relace** — přežije přepnutí sekce, ale neukládá se (refresh = čistý stůl). Že něco visí vybráno, je vidět na spodním tlačítku „Zobrazit přerámování (N)".
- **Tělesné příznaky** se řadí abecedně (ne podle `sort_order`).

### Odchylky u Přerámování

Přerámování se od ostatních sekcí liší: keyword hledá v **pocitech** (vstup do výběru), ne ve výsledném obsahu — proto je search samostatně nahoře, ne v filtračním panelu. Sloučení keyword+tagy se Přerámování netýká. Popisek clusteru pod boxy se zobrazuje jen v merged režimu (víc pocitů); u jednoho pocitu je zbytečný (všechny boxy jsou z jednoho clusteru).

### Budoucí rozšíření (mimo MVP)

- **Připínání „rychlé pomoci"** zamítnuto: srdíčko už plní účel „mít po ruce", druhý mechanismus by jen dělil totéž. Oblíbené zůstávají jediná sbírka, členěná po typech.
- Naznačený řádek doporučených tagů nad seznamem.
- Strop diverzity a další ladění doporučování (viz Doporučování obsahu).

---

## Sekce aplikace a jejich chování

### Přerámování

Vstupní sekce s triplety. Po vstupu je vidět seznam hlavních pocitů (názvy klastrů) ve dvou sloupcích; tlačítko „Další" dozobrazí sekundární pocity. Submenu (Přerámování / Otázky / Úkoly / Zpět) se objeví až po volbě pocitu.

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

### Mikročlánky

Submenu: Nejnovější / Redakce / Pro vás. Nad seznamem dva řádky doporučených tagů s ikonou pro rozbalení všech.

- **Nejnovější** (výchozí): perexy od nejnovějších.
- **Redakce:** perexy článků s `quality` = 5, při každém zobrazení náhodné pořadí.
- **Pro vás:** jen pokud existuje profil uživatele; doporučené články podle priority (viz doporučování).

Radiobutton „Nepřečtené" filtruje jen nepřečtené články. Přečtené se drží v `localStorage`.

### Cvičení

Submenu: Nejnovější / Redakce / Pro vás (stejná logika jako mikročlánky). Ve výchozím zobrazení seznam tagů rozdělený do kategorií (viz výše).

### Inspirace a Podnětné otázky

Submenu: Nejnovější / Pro vás. Dva řádky doporučených tagů s rozbalením. „Nejnovější" řadí od nejnovějších, „Pro vás" doporučuje podle profilu.

### První pomoc v krizi, Tělesné příznaky

Prostý seznam → klik → strukturovaný text → možnost uložit do oblíbených, tlačítko Zpět. První pomoc se řadí podle `sort_order`, tělesné příznaky abecedně. Tělesné příznaky mají navíc keyword search.

### Oblíbené

Napříč sekcemi: klepnutí na srdíčko u položky ji uloží. Sekce oblíbených je rozdělená do kategorií obsahu.

---

## Doporučování obsahu

Odpovídá na otázku „který obsah nabídnout na základě toho, co uživatel dlouhodobě prožívá". Platí pro mikročlánky, cvičení, inspirace a podnětné otázky (typy s polem `schemas`). Každý typ se skóruje zvlášť, obsah se mezi typy nemíchá.

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
    "inspirations": ["inspir_0012"],
    "questions": ["quest_0005"]
  },
  "read": ["art_0003", "art_0005"]
}
```

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
| Datový model všech 11 typů | ✅ finální struktura |
| Klastry (116) + pocity (399) | ✅ kompletní mapa s ID a schématy |
| Technické ověření v Miowebu | ✅ hotovo (duben 2026) |
| Prototyp aplikace (sekce Přerámování + Oblíbené) | ✅ funkční, načítá z GitHub Pages |
| Přerámování — triplet obsahu | 🔄 testovací fáze, zatím 4 klastry |
| Ostatní obsah (články, cvičení, inspirace, otázky, krizovka, tělo) | 🔄 vzorek, plní se |
| Admin nástroj | 🔲 k přestavbě od základu (stávající je zastaralý) |
| Frontend — ostatní sekce mimo Přerámování | 🔲 čeká |

Reálná čísla obsahu (testovací fáze): triplet pokrývá 4 klastry — `cl_0001` neviditelný, `cl_0008` zbytečný, `cl_0013` nedůvěřivý, `cl_0031` špatný.

---

## Soubory

| Soubor | Účel |
|--------|------|
| `index.html` | Rozcestník (prototyp / admin) |
| `cesta_prototyp.html` | Prototyp aplikace — standalone HTML, coconut téma, sekce Přerámování + Oblíbené |
| `cesta_admin.html` | Admin nástroj — zastaralý první výplod, k přestavbě |
| `*.json` | 11 datových souborů |
| `README.md` | Tento dokument |
| `CLAUDE.md` | Pracovní brífink pro práci v Claude Code |
