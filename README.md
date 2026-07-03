# Moje cesta — Psychoterapeutická webová appka

## O projektu

Webová psychoterapeutická appka nabízející terapeuticky přesný obsah k prozkoumání a uložení do oblíbených. Uživatel si vybere jádrový pocit, dostane přerámování, může procházet mikročlánky, cvičení, citáty, podnětné otázky a psychosomatickou encyklopedii.

**Autor:** Robert Řeřicha, psychoterapeut (psychodynamika, IFS, KBT), Praha
**Projekt:** Štěstí naproti (https://stestinaproti.cz)


---

## Architektura

### Základní princip
Čistě frontendové řešení — HTML + CSS + JavaScript + JSON databáze. Žádný backend, žádná serverová databáze. Veškerá data (texty, přerámování, cvičení) jsou v JSON souborech. Uživatelská data (oblíbené, přečtené) se ukládají do localStorage prohlížeče.

### Integrace do Mioweb
Na členskou stránku v Miowebu (WordPress) se vloží HTML element s krátkým kódem (2–3 řádky), který načte .js soubor s logikou appky. JS soubor načítá obsah z .json souborů.

### Hosting souborů
- **Primární:** GitHub Pages (repozitář: https://github.com/Haryzek/cesta)
- **GitHub Pages URL:** https://haryzek.github.io/cesta/
- Upload .json/.js do Médií Mioweb nefunguje (blokováno serverem)

### Dvě instance appky
- **FREE verze** — omezený obsah, bonus k placenému kurzu "Štěstí naproti", přístup přes členskou sekci kurzu. V json jako  "tier": "free".
- **PREMIUM verze** — kompletní a průběžně rozšiřovaný obsah, samostatná členská sekce, subscription 99 Kč/měsíc. V json jako  "tier": "premium".

Obě verze jsou technicky identická appka, liší se JSON obsahem. Tam, kde to dává smysl, mají položky pole `tier` ("free" / "premium").


---

## Kategorie obsahu (9 datových typů)


### 1. Klastry (clusters.json)

Seskupení významově blízkých pocitů, pro které platí stejná přerámování. 116 klastrů, 399 jednotlivých pocitů. 

Každému klastru odpovídají unikátní seznamy "Přerámování / Otázky / Úkoly". Uživatel navolí jeden nebo více pocitů > odeslání > identifikace klasterů > zobrazení odpovídajících "Přerámování / Otázky / Úkoly" (defaultně se viditelně zobrazí seznam Přerámování, v horizontálním submenu je možné překliknout na Otázky nebo na Úkoly). Ke každému klastru tedy patří triplet seznamů.

Každý klastr je také namapovaný na rozšířený model Youngových maladaptivních schémat (18 standardních + 3 nová: Unfairness, Lack of Meaningful World, Lack of Self-Coherence). Schemata budou sloužit k provázání s ostatními sekcemi aplikace, jejichž obsah bude také namapovaný na schemata > doporučení obsahu (uživatel nakliká jádrové pocity, se kterými se často setkává > zmapování pravděpodobných schemat > uložení > doporučování obsahu, např. cvičení). Ke každému clusteru je namapováno 5 schemat podle priority - k prvnímu přiřadit váhu 5, k poslednímu váhu 1.

```json příklad
{
    "id": "cl_0001",
    "name": "neviditelný",
    "schemas": [
      "EMODEP",
      "ABINST",
      "DEFSH",
      "ISOLAL",
      "UNFAIR"
    ],
    "sort_order": 1
},
```


### 2. Pocity (feelings.json)

Volbou pocitů uživatel říká, co pociťuje, když mu není psychicky dobře. Budou přístupné v sekci "Přerámování" a v sekci "Test" (v budoucnu, ne v mvp).

Každý pocit je zařazen do klastru. Většina klastrů obsahuje vícero pocitů a název klastru se shoduje s jedním z nich. Někdy je klastr tvořen jen jediným pocitem.

- "main": Když je "main" 0, pocit není názvem klastru. Když je "main" shodný s názvem klastru, kterého je součástí, pak jde o pocit, který je názvem klastru. Defaultně budou zobrazeny pocity, které jsou názvem klastru (hlavní základní pocity), po kliknutí na tlačítko "Další" se zobrazí zbytek pocitů (sekundární pocity). Hlavní základní pocity a další sekundární pocity jsou každý samostatně seřazeny dle sort_order.

- všechny sekundární pocity jsou  "tier": "premium". Ve free verzi appky tedy budou zobrazeny jen názvy klastrů bez tlačítka "Další".

```json příklad
{
    "id": "feel_0053",
    "name": "neviditelný",
    "cluster_id": "cl_0001",
    "main": "cl_001",
    "tier": "free",
    "sort_order": 1
  },
```


### 3. První pomoc v psychické krizi (crisis.json)

Návody první pomoci v rúzných situacích.

"name":
- První psychická pomoc
- Panická ataka
- Hyperventilace
- Silná úzkost
- Zahlcení myšlenkami
- Neobvyklé tělesné příznaky
- Depresivní propad
- Přetížení a vyčerpání
- Odpojení od reality
- Silný stud a sebekritika
- Sebevražedné myšlenky
- Zmatek a chaos


```json
{
  "id": "crisis_0001",
  "name": "Psychická první pomoc",
  "body": "## Markdown:",
  "tier": "free",
  "sort_order": 1,
}
```


### 4. Tělesné příznaky (body.json)

Uživatel klikne na tělesný příznak, dostane vysvětlení psychosomatické souvislosti, co jiného může příznak způsobovat, kdy konzultovat lékaře.

```json příklad
{
  "id": "body_0001",
  "name": "Bolest hlavy",
  "body": "## Markdown: popis, psychosomatika, spouštěče, kdy k lékaři",
  "tier": "free",
  "sort_order": 1
}
```


### 5. Mikročlánky (articles.json)

Miniaturizované verze blogových článků, 1 - 5 minut čtení. Markdown formátování.

Štítky: afirmace, autenticita, citáty, deprese, emoce, fobie
kbt, komunikace, meditace, mindfulness, motivace, negativní myšlenky, obrany, ocd, osobnost, panická ataka, pozitivní myšlení, překážky v růstu, produktivita, psychosomatika, psychoterapie, relaxace, rodina, rozhodování, sebeláska, sebevědomí, smysl života, spánek, štěstí, strach, stres, syndrom vyhoření, technika, transformace, úzkost, vztahy, zdravé návyky.

- "schemas": Ke každému mikročlánku je přiřazeno 3 schemat dle priority s váhami 3, 2, 1. Se schematy bude pracovat doporučování obsahu.

- "reading_time": Bude automaticky vypočítáváno v adminu na základě počtu znaků.

- "quality": kvalita/užitečnost článku na škále 1-5.

```json příklad
{
  "id": "art_0001",
  "title": "Proč se bojíme blízkosti",
  "slug": "proc-se-bojime-blizkosti",
  "perex": "Krátký úvodní text pro zobrazení v seznamu...",
  "body": "## Markdown tělo článku...",
  "tags": ["úzkost", "vztahy"],
  "schemas": [
    "EMODEP",
    "ABINST",
    "DEFSH"
  ],
  "tier": "free",
  "quality": 5,
  "reading_time": 3,
  "sort_order": 1,
  "published_at": "2026-04-02",
  "added_at": "2026-04-02"
}
```



### 6. Cvičení (exercises.json)

Hyperstručná cvičení napříč terapeutickými směry. Defaultně je zobrazen postup. Kliknutím na Info ikonu se zobrazí rozšířený kontext (k čemu je to dobré, mindset, na co si dát pozor atp.).

Štítky rozděléné v kategoriích (uživatel uvidí rozdělené nadpisy):

#### Typy potíží
stres
úzkost
panická ataka
fobie
deprese
syndrom vyhoření
ocd
adhd

#### Uvolnění a zklidnění
dýchání
svalová relaxace
uzemění
mindfulness
meditace
bioenergetika
spánek

#### Práce s myšlenkami
práce s myšlenkami
přerámování
pozitivní myšlení
afirmace

#### Behaviorální práce
změna chování
experiment
expozice strachu

#### Vnitřní prožívání
imaginace
emoce
sebepoznání
sebeláska
sebevědomí

#### Práce s tělem
tělesná cvičení
focusing
vnitřní části

#### Produktivita
produktivita
time-management
plánování
rozhodování

###### Vztahy a komunikace:
komunikace
vztahy
hranice

#### Životní styl
životní styl
režim
zdravé návyky
aktivity

#### Spokojenost a štěstí
potřeby
hodnoty
motivace
smysl života


```json
{
  "id": "ex_0001",
  "name": "Body scan",
  "perex": "Krátký popis cvičení.",
  "info": "## Markdown: k čemu, mindset, bariéry, deníček",
  "body": "## Markdown: postup, kroky, odrážky",
  "duration": 15,
  "tags": ["relaxace", "tělo"],
  "schemas": [
    "EMODEP",
    "ABINST",
    "DEFSH"
  ],
  "tier": "free",
  "quality": 5,
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```


### 7. Přerámování

V sekci přerámování budou tři podsekce, mezi kterými bude uživatel přepínat pomocí submenu. Jde o unikátní triplet seznamů "přerámování / otázky / úkoly" navázaný na jeden konkrétní klastr.

sort_order je lokální v rámci clusteru, restartuje na 1, hustě 1..N; ID je naopak globálně unikátní per typ a pořadí nenese.

#### 7a. Přerámování (reframings.json)

Terapeuticky přesné texty nabízející alternativní pohled na jádrový pocit. Patří k jednomu konkrétnímu klastru (ne k jednotlivému pocitu). Nejsou sdílené napříč klastery, každý klastr má svůj unikátní seznam přerámování.

```json příklad
{
  "id": "ref_0001",
  "cluster_id": "cl_0001",
  "text": "To, že se cítíš zbytečný, neznamená že jsi zbytečný...",
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

#### 7b. Otázky (reframing_questions.json)

Podnětné otázky k danému jádrovému pocitu. Také patří k jednomu konkrétnímu klastru (ne k jednotlivému pocitu). Nejsou sdílené napříč klastery, každý klastr má svůj unikátní seznam otázek.

```json příklad
{
  "id": "refq_0001",
  "cluster_id": "cl_0001",
  "text": "Když se cítíš přehlížený, zeptej se: opravdu mě minuli, nebo jsem se stáhl ještě dřív, než mě mohli potkat?",
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

#### 7c. Úkoly (reframing_actions.json)

Doporučené úkoly, akce/aktivity, výzvy či behaviorální experiemnty k danému jádrovému pocitu.

```json příklad
{
  "id": "refa_0001",
  "cluster_id": "cl_0001",
  "text": "Napiš si tři konkrétní situace z posledního měsíce, kdy tě někdo opravdu zaznamenal, i kdyby jen jemně.",
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```


### 8. Inspirace (inspirations.json)

Různé citáty, rady, moudra.

Štítky: autenticita, citáty, deprese, emoce, hněv, hodnoty, hranice, láska, lidská přirozenost, mindfulness, motivace, moudrost, naděje, nedokonalost, negativní myšlenky, odpovědnost, odpuštění, odvaha, odolnost, osamělost, osobnost, paradox, pozitivní myšlení, pravda, produktivita, přátelství, přerámování, přijetí, přítomnost, radost, rodina, rozhodování, samota, sebeláska, sebepoznání, sebepřijetí, seberegulace, sebeúcta, sebevědomí, smrt, smutek, smysl života, spánek, stárnutí, strach, stres, stud, svoboda, syndrom vyhoření, štěstí, trpělivost, utrpení, úzkost, vděčnost, vina, vnitřní části, vztahy, zdravé návyky, změna.


```json příklad
{
  "id": "inspir_0001",
  "text": "Kdo má proč žít, snese téměř jakékoli jak.",
  "author": "Viktor Frankl",
  "year": "1946",
  "tags": ["smysl", "utrpení"],
  "schemas": [
    "EMODEP",
    "ABINST",
    "DEFSH"
  ],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```

### 9. Podnětné otázky (questions.json)

Otázky k sebereflexi.

Štítky (shodné se štítky "Inspirace"): autenticita, citáty, deprese, emoce, hněv, hodnoty, hranice, láska, lidská přirozenost, mindfulness, motivace, moudrost, naděje, nedokonalost, negativní myšlenky, odpovědnost, odpuštění, odvaha, odolnost, osamělost, osobnost, paradox, pozitivní myšlení, pravda, produktivita, přátelství, přerámování, přijetí, přítomnost, radost, rodina, rozhodování, samota, sebeláska, sebepoznání, sebepřijetí, seberegulace, sebeúcta, sebevědomí, smrt, smutek, smysl života, spánek, stárnutí, strach, stres, stud, svoboda, syndrom vyhoření, štěstí, trpělivost, utrpení, úzkost, vděčnost, vina, vnitřní části, vztahy, zdravé návyky, změna.


```json
{
  "id": "quest_0001",
  "text": "Kolik času jsi dnes strávil přemýšlením o sobě?",
  "tags": ["sebepoznání", "reflexe"],
  "schemas": [
    "EMODEP",
    "ABINST",
    "DEFSH"
  ],
  "tier": "free",
  "sort_order": 1,
  "added_at": "2026-04-02"
}
```


---



Fungování v jednotlivých sekcích:



## SEKCE: První pomoc v krizi

Seznam krizových situací (kategorie) seřazený podle sort_order. 
Kliknutí na krizovou situaci > zobrazení strukturovaného textu o pomoci v dané situaci.
Ikonka pro uložení do oblíbených > přidá do odpovídajícího seznamu oblíbených.
Ikonka či tlačítko "Zpět".


## SEKCE: Tělesné příznaky

Seznam tělesných příznaků seřazený podle sort_order. 
Kliknutí na příznak > zobrazení strukturovaného textu o příznaku.
Ikonka pro uložení do oblíbených > přidá do odpovídajícího seznamu oblíbených.
Ikonka či tlačítko "Zpět".


## SEKCE: Mikročlánky

Submenu: Nejnovější / Redakce / Pro vás.

Štítky (dva řádky doporučených štítků): úzkost, panická ataka, deprese, syndrom vyhoření, fobie, ocd, emoce, osobnost, psychoterapie, technika, vztahy, pozitivní myšlení. Ikona k rozbalení všech štítků. 

- Nejnovější (default - v submenu aktivní položka "Nejnovější"): perexy seřazené od nejnovějších. Kliknutím na perex se zobrazí celý článek.

- Redakce: perexy mikročlánků s "quality" = 5, náhodné pořadí (při každém zobrazení znovu náhodné seřazení nejlepších článků).

- Pro vás: v submenu přítomno, jen pokud jsou data o vybraných pocitech uživatele (viz. popis doporučování obsahu níže). Perexy doporučených mikročlánků seřazené dle priority.  

Radiobutton "Nepřečtené": zobrazují se jen nepřečtené mikročlánky.
Ikonka pro uložení do oblíbených > přidá do odpovídajícího seznamu oblíbených.


## SEKCE: Cvičení


Submenu: Nejnovější / Redakce / Pro vás

- Nejnovější: Zobrazí perexy cvičení seřazené od nejnovějších.

- Redakce: perexy cvičení s "quality" = 5, náhodné pořadí (při každém zobrazení znovu náhodné seřazení nejlepších článků).

- Pro vás: v submenu přítomno, jen pokud jsou data o vybraných pocitech uživatele (viz. popis doporučování obsahu níže). Perexy doporučených cvičení seřazené dle priority.  

Ikonka pro uložení do oblíbených > přidá do odpovídajícího seznamu oblíbených.

Defaultně zobrazen seznam štítků pod sebou rozdělený nadpisy:

#### Typy potíží
stres
úzkost
panická ataka
fobie
deprese
syndrom vyhoření
ocd
adhd

#### Uvolnění a zklidnění
dýchání
svalová relaxace
uzemění
mindfulness
meditace
bioenergetika
spánek

#### Práce s myšlenkami
práce s myšlenkami
přerámování
pozitivní myšlení
afirmace

#### Behaviorální práce
změna chování
experiment
expozice strachu

#### Vnitřní prožívání
imaginace
emoce
sebepoznání
sebeláska
sebevědomí

#### Práce s tělem
tělesná cvičení
focusing
vnitřní části

#### Produktivita
produktivita
time-management
plánování
rozhodování

###### Vztahy a komunikace:
komunikace
vztahy
hranice

#### Životní styl
životní styl
režim
zdravé návyky
aktivity

#### Spokojenost a štěstí
potřeby
hodnoty
motivace
smysl života



## SEKCE: Přerámování

Tato sekce obsahuje triplet typů obsahu: Přerámování / Otázky / Úkoly. Mezi zobrazeními v rámci tripletu lze přepínat pomocí horizontálního submenu nahoře. 

Po vstupu do sekce je defaultně zobrazen seznam základních hlavních pocitů (shodný s názvy klastrů) ve dvou sloupcích vedle sebe, v každém sloupci cca 50 pocitů (celkem 116 klastrů). Pod tímto základním seznamem je tlačítko "Další", kterým se zobrazí zbytek z celkových 399 pocitů). Submenu není v defaultu zobrazeno, zobrazí se až po volbě pocitu nebo výběru několika pocitů a odeslání výběru.

Po volbě pocitu nebo odeslání několika vybraných pocitů se zobrazí submenu "Přerámování", "Otázky", "Úkoly" a "Zpět" (návrat na stránku s pocity) s aktivní první položkou submenu "Přerámování". Uživatel vidí seznam přerámovacích vět. Překlikáváním položek submenu se zobrazují specifické seznamy z tripletu. 

Tři způsoby volby pocitu a zobrazení seznamů "přerámování / otázky / úkoly" v aplikaci:

1.) Jeden pocit (single mód) — Uživatel v sekci "Přerámování" zvolí pouze jeden pocit (kliknutí přímo na název) > identifikace klastru > zobrazení seznamů "Přerámování / Otázky / Úkoly" daného klastru. Žádný interleaving, žádné vážení — přímá vazba.

2.) Dva a více pocitů (merged mód) — Uživatel v sekci "Přerámování" vybere více pocitů (checkboxy) a odešle > identifikace klastrů > zobrazení merged seznamů "Přerámování / Otázky / Úkoly". (Pozn.: jeden pocit = single mód, dva a více = merged mód.)

Merged seznam vzniká váženým kolovým interleavingem. Jde o jediné pravidlo, které pokrývá oba níže uvedené případy — symetrický je jen speciální případ váženého, kdy mají všechny klastry stejný počet vybraných pocitů:

a.) Každý vybraný pocit patří k jinému klastru (symetrický výsledek):

Merged seznam střídá klastry rovnoměrně. Když P1.1 = přerámování na pozici 1 v seznamu klastru CL1, pak interleaved seznam z CL5 + CL17 bude: P5.1, P17.1, P5.2, P17.2… Pořadí klastrů dle sort_order klastru.

b.) Některé vybrané pocity patří ke stejnému klastru (asymetrický výsledek):

Klastry s více vybranými pocity přispívají v každém kole více položkami. Příklad — uživatel vybere 3 pocity z CL26, 2 z CL34, 1 z CL5:
P26.1, P26.2, P26.3, P34.1, P34.2, P5.1, P26.4, P26.5, P26.6, P34.3, P34.4, P5.2, P26.7, P26.8, P26.9, P34.5, P34.6, P5.3.

Tím merged seznam obsahuje ve své horní části více položek z klastrů, se kterými se uživatel silněji identifikoval. (Neplatí stoprocentně — klastry s jediným pocitem nelze "zesílit", strop síly klastru je dán počtem pocitů, které obsahuje. Prioritizaci to ale pomáhá.)

Pravidla pořadí:

Pořadí klastrů: primárně sestupně podle počtu z nich vybraných pocitů; při remíze rozhoduje sort_order klastru.

Počet položek na klastr v jednom kole: roven počtu z něj vybraných pocitů.

Vyčerpaný seznam vypadne ze hry; zbylé klastry pokračují podle stejných pravidel, dokud se nezobrazí všechny položky ze všech navázaných seznamů.

Dedup (pojistka): pokud by se napříč klastry objevila položka se shodným ID, zobrazí se jen při prvním výskytu (first-wins); další výskyt se přeskočí a nahradí další položkou téhož klastru. (Seznamy jsou tvořeny jako unikátní, takže k tomu prakticky nedochází — dedup je jen pojistka proti náhodné shodě.)

Pro a.) i b.) platí, že dlouhé merged seznamy se zobrazují po 50 položkách. Tlačítkem "Dalších 50" lze zobrazit další část. (Pozn.: prioritizace se reálně projeví jen v prvních 1–2 stránkách; hlouběji už na přesném pořadí nezáleží, protože tam se uživatel zpravidla nedostane.)

Tentýž interleaving běží identicky pro všechny tři typy obsahu (Přerámování / Otázky / Úkoly) nad stejnou množinou identifikovaných klastrů — uživatel pocity volí jednou a mezi typy jen přepíná v horizontálním submenu.

3.) Test (V BUDOUCNU, NENÍ V MVP) — Uživatel volí několik pocitů, výstupem je odhad aktivních maladaptivních schemat s popisem.


Algoritmus techicky:

═══════════════════════════════════════════════════════
VYSVĚTLIVKY — čti, než do interleavingu sáhneš
═══════════════════════════════════════════════════════

A) K ČEMU TO JE
   User vybere 2+ jádrové pocity. Každý pocit patří do jednoho
   klastru. Každý klastr má UNIKÁTNÍ seznam položek daného typu
   (přerámování / otázky / úkoly). Tahle mašina poskládá seznamy
   trefených klastrů do jednoho merged seznamu tak, aby klastry,
   ze kterých user vybral víc pocitů, byly nahoře hustěji
   zastoupené. NEPRACUJE se schématy — ta jsou jen pro doporučování
   JINÉHO obsahu (samostatný algoritmus). Tady jde o přímou vazbu
   pocit → klastr → jeho seznam.

B) JEDEN POCIT ≠ MERGED
   Klik na jediný pocit = single mód = rovnou seznam jeho klastru,
   tahle mašina se vůbec nespustí. Spouští se až od 2 pocitů.

C) PROČ „KOLA" A NE ROZPROSTŘENÍ
   Bob VĚDOMĚ chce blokové rundy, ne plynulé rozprostření.
   V jednom kole vydá klastr tolik položek, kolik z něj bylo
   vybráno pocitů (3:2:1 → blok 3,2,1 a opakuj). NEPŘEDĚLÁVAT na
   „largest remainder / Bresenham" rozprostření — to byla zvažovaná
   a ZAMÍTNUTÁ alternativa. Bob chce, aby silný klastr přišel
   v dávce, ne rozetřený.

D) DEDUP A KVÓTA — rozhodni vědomě
   Seznamy jsou unikátní, takže dedup skoro nikdy nezakousne. Je to
   POJISTKA. Otázka, co řešit při implementaci: když přeskočím
   duplicitní položku, počítá se to do kvóty klastru v daném kole?
   Doporučení: NE — přeskočená duplicita se nepočítá, klastr zkusí
   vydat další položku, aby kolo dodrželo zamýšlený počet. Protože
   duplicita je tak vzácná, na výsledku to stejně nic nezmění;
   řeš to nejjednodušší cestou.

E) VYČERPÁNÍ SEZNAMU
   Když klastr dojde (kratší seznam než ostatní), v dalších kolech
   prostě nic nevydává a ostatní jedou dál beze změny pravidel.
   Merged seznam tak ke konci přirozeně „zhubne" na klastry
   s nejdelšími seznamy. To je OK a zamýšlené.

F) POŘADÍ KLASTRŮ
   Primárně počet vybraných pocitů sestupně, při remíze sort_order
   klastru (vzestupně). Sort_order je jinak interní řadicí pole.

G) SYMETRIE JE SPECIÁLNÍ PŘÍPAD
   Když má každý klastr po 1 pocitu, kvóty jsou 1:1:1 a kolová
   smyčka vyrobí prosté střídání P5.1, P17.1, P5.2… Není potřeba
   zvláštní větev pro „symetrický" případ — padne to z téhož kódu.

H) STRÁNKOVÁNÍ A KDE SE PRIORITIZACE PROJEVÍ
   Zobrazuje se po 50. Reálně se prioritizace projeví jen na prvních
   1–2 stránkách — dál už se user zpravidla nedostane. Neoptimalizuj
   pořadí hlouběji než pro prvních ~100 položek, je to zbytečné.

I) STROP SÍLY KLASTRU
   Klastr s jediným pocitem nelze „zesílit" víc výběrem — jeho kvóta
   je max počet pocitů, které obsahuje. Tzn. user nemůže prioritizovat
   klastr, který má v datech jen jeden pocit, nad rámec té jedničky.
   Akceptované omezení, ne bug.


═══════════════════════════════════════════════════════
MERGED INTERLEAVING — skládání seznamů při výběru více pocitů
═══════════════════════════════════════════════════════

VSTUP:
  vybrané_pocity[]        — pocity, které user zaškrtl
  typ_obsahu              — "reframings" | "questions" | "tasks"
                            (běží stejně pro všechny tři)

── PŘÍPRAVA ──
// spočítej, kolik pocitů padlo do každého klastru
počty = {}
pro každý pocit ve vybrané_pocity:
    cl = klastr_pocitu(pocit)
    počty[cl] += 1

// seřaď klastry: primárně počet pocitů sestupně, remíza → sort_order
klastry = klíče(počty) seřazené podle:
    1. počty[cl]        sestupně
    2. cl.sort_order    vzestupně

// ke každému klastru si vezmi jeho seznam daného typu obsahu
// a ukazatel, kde v něm jsme (start na 0)
seznam[cl]   = obsah_klastru(cl, typ_obsahu)   // unikátní seznam
pozice[cl]   = 0

viděná_ID = prázdná množina    // pro dedup
merged = []

── HLAVNÍ SMYČKA (kola) ──
dokud existuje aspoň jeden klastr s nevyčerpaným seznamem:
    pro každý klastr cl v klastry (v tom seřazeném pořadí):
        kvóta = počty[cl]          // tolik položek vydá v tomto kole
        vydáno = 0
        dokud vydáno < kvóta A seznam[cl] není vyčerpaný:
            položka = seznam[cl][ pozice[cl] ]
            pozice[cl] += 1
            // — DEDUP (pojistka) —
            pokud položka.id v viděná_ID:
                pokračuj (přeskoč, zkus další z téhož klastru)
                         // POZOR: přeskočení NEčerpá kvótu? viz vysvětlivka D
            viděná_ID.přidej(položka.id)
            merged.přidej(položka)
            vydáno += 1
    // klastry, které se vyčerpaly, v dalším kole prostě nic nevydají
    // (smyčka „dokud … není vyčerpaný" je přeskočí)

── VÝSTUP ──
vrať merged    // stránkovat po 50 (tlačítko „Dalších 50")


Seznamy sestává z položek vypsaných pod sebou již v kompletním znění (věty v rámečcích na scroll). 
Ikonka či tlačítko "Zpět".
Ikonka pro uložení do oblíbených u každé položky (v rohu rámečku s větou) > přidá položku do odpovídajícího seznamu oblíbených.



## SEKCE: Inspirace

Submenu: Nejnovější / Pro vás.

Štítky (dva řádky doporučených štítků): autenticita, citáty, hodnoty, láska, motivace, přítomnost, smrt, sebevědomí, swebepoznání, samota, smysl života, štěstí. Ikona k rozbalení všech štítků. 

- Nejnovější (default - v submenu aktivní položka "Nejnovější"): inspirace (celé věty) seřazené od nejnovějších. 

- Pro vás: v submenu přítomno, jen pokud jsou data o vybraných pocitech uživatele (viz. popis doporučování obsahu níže). Doporučené inspirace seřazené dle priority.

Ikonka pro uložení do oblíbených u každé položky (v rohu rámečku s obsahem) > přidá položku do odpovídajícího seznamu oblíbených.



## SEKCE: Podnětné otázky

Submenu: Nejnovější / Pro vás.

Štítky (dva řádky doporučených štítků): autenticita, citáty, hodnoty, láska, motivace, přítomnost, smrt, sebevědomí, swebepoznání, samota, smysl života, štěstí. Ikona k rozbalení všech štítků. 

- Nejnovější (default - v submenu aktivní položka "Nejnovější"): podnětné otázky (celé věty) seřazené od nejnovějších. 

- Pro vás: v submenu přítomno, jen pokud jsou data o vybraných pocitech uživatele (viz. popis doporučování obsahu níže). Doporučené podnětné otázky seřazené dle priority.

Ikonka pro uložení do oblíbených u každé položky (v rohu rámečku s obsahem) > přidá položku do odpovídajícího seznamu oblíbených.


---


## Propojení obsahu

### Schemas (EMS kódy)

Některé typy položek nesou pole `schemas` s kódy Youngových maladaptivních schémat. Umožňuje cross-linking. Appka např. na konci n ěkterých výstupů nabídne mikročlánky, cvičení, citáty atp.

### Rozšířený EMS model
18 standardních Youngových schémat + 3 nová:
- **Unfairness / Křivda** — pocit nespravedlnosti a křivdy
- **Lack of Meaningful World** — pocit, že svět postrádá smysl
- **Lack of Self-Coherence** — pocit vnitřní nesouvislosti, rozpadání identity


---


## Doporučování obsahu


═══════════════════════════════════════════════════════
DOPORUČOVÁNÍ OBSAHU — finální algoritmus
═══════════════════════════════════════════════════════

── PROFIL (běží průběžně přes celou historii) ──
profil = {}
pro každý klik na jádrový pocit:
    cluster = cluster_pocitu
    pro každé z 5 schémat clusteru (pozice 1..5):
        profil[schéma] += (6 − pozice)

── SKÓROVÁNÍ KANDIDÁTŮ (jen přes pozice 1–2!) ──
VAHY_POZIC = [5, 4]          // pozice 1 a 2; zbytek se ignoruje
                              // kdykoli přeladitelné, např. [8,5]

pro každého kandidáta daného typu obsahu:
    skóre = 0
    šířka = 0
    pro pozice p v {1, 2}:
        schéma = kandidát.schémata[p]
        u = profil[schéma] nebo 0
        skóre += u × VAHY_POZIC[p−1]
        pokud u > 0: šířka += 1

── PRÁH ──
zahoď kandidáty se skóre == 0
   (žádná shoda na hlavním tématu → radši nedoporučit nic)

── ŘAZENÍ (kaskáda) ──
seřaď sestupně podle:
   1. skóre
   2. šířka              (2 trefená > 1 trefené)
   3. added_at sestupně  (novější dřív)
   4. id                 (determinismus)

── STROP DIVERZITY (až bude obsahu dost, volitelné) ──
max 2–3 kandidáti se stejným schématem na pozici 1

vrať top-N


---


═══════════════════════════════════════════════════════
VYSVĚTLIVKY K ALGORITMU — čti, než do něj sáhneš
═══════════════════════════════════════════════════════

Tenhle algoritmus řeší: "který obsah doporučit na základě toho, co user dlouhodobě cítí.".

Platí pro mikročlánky, cvičení, inspirace a podnětné otázky. Položky těchto typů obsahu mají v json pole "schemas" s 3 schematy seřazenými podle priority. Prvnímu přiřaď váhu 3, poslednímu pátému váhu 1.

CO JE „KANDIDÁT“:

Jedna položka obsahu jednoho typu — jedno cvičení, jeden mikročlánek atp.
Vždy se skóruje seznam kandidátů JEDNOHO typu zvlášť (zvlášť cvičení, zvlášť články). Obsah se mezi typy nemíchá.

CO JE „PROFIL“:

Vážená mapa schémat uživatele, budovaná průběžně napříč CELOU historií jeho klikání na jádrové pocity (ne pouze v aktuální relaci). Každé kliknutí na pocit přidá váhy pěti schématům jeho clusteru (pozice 1 → 5 bodů, … pozice 5 → 1 bod). Čím více uživatel kliká, tím bohatší profil vzniká, klidně napříč všemi 21 schématy. Profil = „co tento člověk dlouhodobě řeší“.

PROČ SKÓRUJEME POUZE PŘES POZICE 1–2 KANDIDÁTA (NEJDŮLEŽITĚJŠÍ):

Každý kus obsahu má přiřazenou pětici schémat podle priority. ALE: pozice 3–5 jsou nespolehlivý signál. Stavět doporučení na těchto pozicích znamená věštit z křišťálové koule. Navíc bez tohoto omezení dochází k tomu, že kandidát se silným uživatelovým profilovým schématem až na své PÁTÉ (nejslabší) pozici projde prahem a tváří se jako relevantní, přestože o uživateli téměř nic nevypovídá.

Proto: skóruj pouze přes pozice 1–2 (špička). Pokud zde uživatel nemá shodu, kandidát vypadává. NEROZŠIŘUJ zpět na pozice 1–5 — bylo to záměrně omezeno. Prvním krokem při příliš úzkém výběru je rozšíření na pozice 1–3, nikoli dále.

PROČ JE PRÁH NASTAVEN NA NULU:

Je lepší nezobrazit žádné doporučení než zobrazit nerelevantní. Bobova věta: „raději nic než článek o grandiozitě někomu ponořenému v DEPINC.“ Nerelevantní doporučení poškozuje důvěru více než prázdné místo.

PROČ JE ŠÍŘKA POUZE TIE-BREAK A NENÍ SOUČÁSTÍ SKÓRE:

Jde o vědomé rozhodnutí: hloubka jednoho tématu je důležitější než šířka vlažných shod. Silná shoda na pozici 1 má převážit dvě slabé shody. Šířka (kolik z pozic 1–2 se trefilo) slouží pouze k rozhodování v případě remízy. Pokud by Bob někdy chtěl šířku odměňovat výrazněji, jde o JEDNO konkrétní místo ke změně — ve výchozím stavu však nic neměň.

CO TU NENÍ A PROČ (HISTORIE):

Dříve existovala „kotva“ (dvě nejvyšší váhové hladiny profilu → clustery vedené kotevním schématem) a „žebřík tie-breaků“. Šlo o mechanismus pro hledání JEDNOHO vítězného clusteru v době, kdy jsme se mylně domnívali, že přerámování stojí na schématech. Nestojí — stojí na clusterech (viz úloha 1).

Pro řazený seznam doporučení je kotva zbytečná: nehledáš vítěze, pouze řadíš položky. Pokud budeš někdy řešit navázání balíku pocitů na jeden cluster, podívej se do historie na kotvu — ale pro doporučování ji NEOBNOVUJ.

VAHY_POZIC JAKO LADICÍ PRVEK:

[5,4] je výchozí nastavení. V budoucnu možno změnit dle potřeby.


---


## Uživatelská data (localStorage)

### Oblíbené a přečtené
```json
{
  "favorites": {
    "crisis": ["crisis_0001", "crisis_0004"],
    "body": ["body_0001", "body_0003"],
    "articles": ["art_0003", "art_0011"],
    "exercises": ["ex_0007"],
    "reframings": ["ref_0042", "ref_0118"],
    "reframing_questions": ["refq_0042", "refq_0118"],
    "reframing_actions": ["refa_0042", "refa_0118"],
    "inspirations": ["inspir_0012"],
    "questions": ["quest_0005"]
  },
  "read": ["art_0003", "art_0005", "art_0011"]
}
```

### Notifikace nového obsahu
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

Logika: počet položek kde `added_at > last_seen[kategorie]` = číslo na badge. Klik na kategorii = aktualizace timestampu.


---


Následující část readme je pozůstatek z minulého readme, které již není aktuální, je to zde jen pro inspiraci. Některé věci budeme řešit jinak, admin bude také řešený v některých ohledech jinak.


## Klíčové funkce appky (MVP)

### Hotové (v0.1 prototyp)
- [x] JavaScript v HTML elementu Mioweb — funguje
- [x] Interakce (klikání, tlačítka, dynamické vykreslování) — funguje
- [x] Načítání externích JS knihoven (CDN) — funguje
- [x] localStorage pro oblíbené — funguje
- [x] GitHub Pages hosting .json a .js — funguje
- [x] Načítání JSON z GitHub Pages do Mioweb — funguje
- [x] Testovací prototyp se 2 klastry (Zbytečnost, Špatnost), vyhledáváním, srdíčkováním

### Admin nástroj (v0.1)
- [x] CRUD pro všech 9 kategorií obsahu
- [x] Formuláře přesně dle datové struktury
- [x] Drag & drop řazení (sort_order)
- [x] Tagy přes Enter, reference na klastry
- [x] Automatický slug z názvu (mikročlánky)
- [x] Automatické ID a sort_order
- [x] Automatické added_at při vytvoření
- [x] Fulltext vyhledávání v každé kategorii
- [x] Import/Export JSON
- [x] localStorage persistence
- [x] Responzivní (mobilní sidebar)
- [x] Duplikování položek

### K implementaci — Frontend appka
- [ ] Přestavba prototypu na načítání z externího JSON
- [ ] Hlavní stránka se seznamem kategorií obsahu
- [ ] Fuzzy fulltext vyhledávání pocitů přes všechna synonyma
- [ ] Zobrazení přerámování ke klastru (seřazená dle sort_order)
- [ ] Srdíčkování → localStorage (všechny kategorie)
- [ ] Sekce oblíbených rozdělená do kategorií
- [ ] Označení přečtených mikročlánků
- [ ] Filtr "jen nepřečtené" u mikročlánků
- [ ] Badge s počtem nového obsahu u kategorií
- [ ] Krizové tlačítko — dostupné odkudkoli
- [ ] Denní impuls — náhodný kousek obsahu při otevření
- [ ] Cross-linking obsahu přes schemas
- [ ] Markdown rendering v těle článků, cvičení, příznaků
- [ ] Minimalistický design, seznamy pod sebou, žádné swipeování
- [ ] Responzivní (mobil + desktop)

### K implementaci — Admin
- [ ] Hromadný import pocitů/klastrů z xlsx
- [ ] Markdown preview v editoru
- [ ] Validace schemas (napovídání existujících kódů)
- [ ] Statistiky obsahu (počet free vs premium, pokrytí schémat)

### Budoucí rozšíření
- [ ] Free/premium rozlišení v jednom JSON vs separátní JSONy
- [ ] Offline podpora (Service Worker + cache)
- [ ] Sdílení oblíbených přerámování (copy to clipboard, share link)
- [ ] Denní streak / gamifikace návštěv
- [ ] Push notifikace o novém obsahu (pokud bude PWA)
- [ ] Analytika použití (anonymní, bez trackeru)


---

## Technické ověření (duben 2026)

| Test | Výsledek |
|------|----------|
| JavaScript v HTML elementu Mioweb | ✅ Funguje |
| Interakce (klik, tlačítka, dynamické vykreslování) | ✅ Funguje |
| Načítání externích JS knihoven (CDN) | ✅ Funguje |
| localStorage pro oblíbené | ✅ Funguje |
| GitHub Pages hosting .json/.js | ✅ Funguje |
| Načítání JSON z GitHub Pages do Mioweb | ✅ Funguje |
| Upload .json/.js do Médií Mioweb | ❌ Blokováno serverem |


---

## Fáze projektu

| Fáze | Popis | Stav |
|------|-------|------|
| 0 | Klastry pocitů — kompletní mapa s ID, schémata, xlsx | ✅ HOTOVO |
| 0.5 | Technické ověření — prototyp v Mioweb HTML elementu | ✅ HOTOVO |
| 1 | Admin nástroj — CRUD pro všech 9 kategorií, JSON export | ✅ v0.1 HOTOVO |
| 2 | Datová struktura — definice všech 9 typů obsahu | ✅ HOTOVO |
| 3 | Testovací obsah — pár položek v každé kategorii | 🔲 ČEKÁ |
| 4 | Frontend — přestavba na načítání z externího JSON | 🔲 ČEKÁ |
| 5 | Přerámování — generování, čištění, finální leštění | 🔄 PROBÍHÁ |
| 6 | Kompletní obsah pro free verzi | 🔲 ČEKÁ |
| 7 | Spuštění free verze | 🔲 ČEKÁ |
| 8 | Průběžné rozšiřování premium verze | 🔲 ČEKÁ |


---

## Soubory projektu

| Soubor | Účel |
|--------|------|
| `cesta_admin.html` | Admin nástroj — standalone HTML, otevřít v prohlížeči |
| `cesta_prototyp.html` | Prototyp appky — standalone HTML, testovací verze |
| `README.md` | Tento dokument |

### GitHub Pages repozitář
```
https://github.com/Haryzek/cesta/
├── (budoucí) app.js          — logika frontend appky
├── (budoucí) data.json        — obsah pro free/premium verzi
└── (budoucí) style.css        — styly frontend appky
```


---

## Principy tvorby obsahu

### Klastry pocitů
- Klastry musí projít testem "stejné přerámování" — sémantická podobnost nestačí
- Přesnost nad pohodlnost: neslučovat klastry jen pro snížení komplexity
- Transversální klastry pro univerzální emoce bez vazby na konkrétní schéma

### Přerámování
- Generování z Claude, ChatGPT, Gemini, Grok
- Dvouprůchodový proces čištění: hrubé pročištění → finální leštění
- Řazení dle priority (subjektivní expertní posouzení)

### Mikročlánky
- Miniaturizované verze blogových článků
- Cca 3 minuty čtení
- Markdown formátování (## nadpisy, **tučně**, *kurzíva*)

### Cvičení
- Hyperstručná, napříč terapeutickými směry
- Jednotná struktura: název, délka, info (k čemu, mindset, bariéry), postup
- Info ikona pro rozšířený kontext


## Výpočetní náročnost

Veškeré výpočty (interleaving, skórování doporučení, agregace profilu) jsou nad daty tohoto rozsahu (~116 klastrů, ~399 pocitů, řádově tisíce položek obsahu) výkonnostně zanedbatelné — běží ve zlomku milisekundy i na mobilu. Není potřeba je optimalizovat.

Profil uživatele (vážená schémata) se drží hotový v localStorage a aktualizuje inkrementálně při kliknutí na nový pocit — ne kvůli rychlosti, ale kvůli čistotě. localStorage ukládá jen ID oblíbených a profil (pár kB), strop kapacity nehrozí.
Jediné reálné místo k pozdější optimalizaci je velikost staženého JSON obsahu z GitHub Pages. Až obsahu výrazně přibude, zvážit rozsekání na menší soubory s lazy-loadingem nebo cachování po prvním načtení. Není to problém MVP.



---


*Poslední aktualizace: 12. června 2026*
