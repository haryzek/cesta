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

**Struktura všech 16 JSONů je finální** (11. 9. 2026 přibyly `fears`, `situations`, `pains`). Obsah ne — plní se. Když něco tvoříš nebo generuješ, drž se přesně stávající struktury.

- Klastry (116) + pocity (399): kompletní mapa s ID a schématy ✅
- **Triplet přerámování: KOMPLETNÍ 11. 9. 2026 — 116 klastrů, 5202 R / 3592 Q / 3611 A.** Zdroj = `local/data_wip/reframings_triplet_wip/reframings.xlsx` (sheet per klastr, řádky R/Q/A/E), build `build_triplet.py` + `tykani_opravy.json` (14 vykacích experimentů z cl0001 ručně na tykání). **E = experimenty jdou do úkolů**, žádný čtvrtý soubor. 22 duplikátů zahozeno. **Nepročištěno** — ~10 klastrů má narváno z několika sessions (cl_0001 má 332 R), `cl_0096 Zodpovědný` je smíchaný s „náročný“; čistka po USA v appce.
- **Strachy (brána 2): nasazeno 11. 9. 2026** — `fears.json` 235 kanonových strachů ve 35 skupinách, každý 5 `cluster_ids`; `situations.json` 137 situací v 10 skupinách, `mark` P/E/K (121/14/2), `aliases`, `fear_ids` 3–6. Zdroj `local/data_wip/strachy_wip/` (`kanon_strachu_pocity.json` = zdroj pravdy pro skupiny, `brany_reframings.md`), build `build_fears.py`. **44× `[ověřit]`** v přerámováních → `overit.md`, musí projít před ostrým nasazením. `kanon_strachu.md` je historie (aliasy zahozeny, měl je u 2 položek).
- **Bolístky (brána 3): nasazeno 11. 9. 2026** — `pains.json` 175 bolístek, **4199 hlášek** (Karolínka 3480 = základ, source `k`; náš výběr 719, source `n`, ~4/bolístku podle role — krátká rána, humor, provokace, tělo; kovboj nikdy). k_222 ponechána, jen našich 15. `smer` ani `oblast` (guláš, 89 hodnot) se v appce nezobrazují — bolístky jsou jedno zrcadlo vět (rozhodnuto 12. 9. 2026). Build `build_pains.py` z dávek + `hlasky_karolinka.md` + `vyber_nase.json`. **Škrtání na 15 přijde v appce** (provizorní admin na road trip).
- Krizovka (12): obsahově hotová a pročištěná, slouží jako etalon. Všechny položky `tier: free` (11. 9. 2026 přepnuto z premium — první pomoc v krizi nemá být za paywallem)
- Tělesné příznaky: **31** (26. 8. 2026) — původních 5 pročištěných (etalon) + 26 nových napsaných podle šablony (neuro/RS, štítná žláza, spánek, derealizace, hormony, váha, intimita…), obsahově zatím neprověřených Bobem. Zdroj výběru: sloupec „Tělesné příznaky" + somatizační index v Bobově monster tabulce (`C:\Users\bobre\Desktop\tab.xlsx`), vytěženo dočista
- Cvičení (71), Články (112), Oddíly (11), Řetězy (4): nasazené v `data/` (14. 8. 2026). Strukturálně čisté, obsahově neprověřené — viz `TODO.md`.
- Články: **přetagováno 11. 9. 2026** — logika se otáčí, **Stavy a potíže primární** (uživatel hledá stav jménem), 3–6 tagů podle priority, průměr 4,75. Do slovníku přibylo 9 tagů (`psychoterapie`, `léky`, `perfekcionismus`, `psychické obrany` + rezervy `tlak na výkon`, `prokrastinace`, `kontrola`, `sebelítost`, `sebepoškozování`) — slovník má **96 tagů**. Nepoužité tagy ve slovníku nevadí (filtr staví z dat); zobrazovací vrstva jen kdyby lišta začala být nepřehledná.
- Podnětné otázky: **nasazeno 11. 9. 2026 — 251 otázek**, univerzální seberozvojovky v ich-formě, **bez `schemas`** (stojí mimo doporučování). 193 ze sklizně + 58 přepsaných z původní schema-sady (zkráceno, kázání uříznuto, 5 dubletů vyhozeno), ID přečíslována od 1. `sklizen.json` v `local/data_wip/questions_wip/` je teď historie.

  **Tagování otázek (rozhodnuto 11. 9. 2026):** **3–6 tagů seřazenejch podle priority** (první = téma, 2.–3. nesou váhu, zbytek tie-break). Povolený: „Chci pracovat na" + „Vztahy" + Emoce jen když je emoce jádrem otázky + `tělo`/`přítomnost`/`mindfulness`/`dýchání`. **Stavy a potíže nikdy** (klinickej tag na univerzálce = nasranej uživatel v akutním módu). Strop je vědomej — u OR filtru dělá přesnost málo tagů na položce, ne hodně; 10 tagů by šlo naplnit jen natažením. **Appka pořadí čte** (12. 9. 2026): OR určuje, co projde, `TAG_VAHY` podle pozice tagu určuje pořadí. Jedinej singleton v datech je `ztráta` (legit, „Čí ztráta by mě zasáhla nejvíc?").
- Inspirace: **nasazeno 11. 9. 2026 — 202 citátů** = 21 původních (přetagovaných) + 181 ze sklizně (`local/data_wip/inspirations_wip/sklizen.json`, teď historie; prompt `local/_prompty/citaty.md`). **`schemas` shozeny všem** — inspirace jdou mimo doporučování stejně jako otázky. `author` i `year` smí být `null`. Tagy podle priority, typicky 2–3 (průměr 2,8), stejná pravidla jako u otázek (Chci pracovat na + Vztahy, Emoce jen jako jádro, z „Co se dělá" jen `přítomnost`/`mindfulness`/`tělo`, Stavy nikdy). Kvůli ~12 citátům o kamarádech **rozsloučen tag `přátelství`** (dřív → `vztahy`). Singletony `stud` (Adler) a `hněv` (Jung) jsou legit.
- Bolístky — historie výroby (1. 9. 2026): náš pool 18 dávek `hlasky_davka*.json` (15/bolístka, 2625; dávka 1 má členění vybrané/zásoba, dávka 18 = kalibrační trojice) + Karolínka `hlasky_karolinka.md` (20/bolístka, 3480, laskavě ironický „z knihovny do normálu“, vědomě nesjednocený hlas). Prompty v `local/_prompty/bolistky-*.md` jsou historie. `brana3_test_vyroky.json` (334) čeká na budoucí YSQ test. **Kurátorská zásada (Bob, 1. 9.):** většina hlášek je dobrá, rozdíly v prostředku jsou vkusový šum — vybírat, neseřazovat.
- Vizuál: nový design systém nasazený (17. 7. 2026), základ odladěný. Tóny přerozdělené 12. 9. 2026 (teal = běžné používání, accent jen Tělo + První pomoc). Karty proudu čekají na design pass s Bobem.

**Appka 12. 9. 2026 — jeden den, kdy dohnala data.** Všechno níž je nasazené v `cesta.html` a popsané v README („Design a chování UI“, „Sekce aplikace“):
- **Filtr tagů čte prioritu** — `TAG_VAHY=[6,5,4,3,2,1]`, OR určuje co, skóre pořadí.
- **Moje cesta** — sekce nad `sections`/`chains`; oddíl = Cvičení / Info / Teorie / Praxe (default Cvičení). **Detail cvičení k SPEC:** 4 taby dědící z oddílu, box náročnosti, box řetězu, warning, přílohy, deník z polí, most „Oddíl 04 · … ›“.
- **Tři brány Přerámování** — rozcestník; Strachy (search přes aliasy, Konkrétní/Jádrové, kategorie → položky, situace P/E/K + „Co je pod tím?“, kanon → triplet přes `FEAR_CLUSTERS=3` s titulkem strachu a třemi pocity pod ním); Bolístky bez kategorií (zrcadlo vět po 30, hlášky se srdíčky `pain_id:index`).
- **Oblíbené per sekce** — pilulka „♡ N“ u H1, přepínač; globální srdíčko plné jen v Oblíbených; `favGroups(stores)` sdílené.
- **Proud karet + paměť viděného** — swipe (scroll-snap) pro triplet, hlášky, Inspirace, Otázky; `USER.seen` se plní **jen ve swipe a srdíčkem**, seznam nikdy nepíše; oko = „jen nové“ (globální `USER.onlyNew`), karty/seznam globální `mc_view`; předěl „Stačí pro dnes?“ každých `SWIPE_BREAK=10`.
- **Pořadí sekcí** — jeden registr `SECTIONS` řídí dlaždice i menu (pole `sep` = linka v menu): Moje cesta, Cvičení | Přerámování, Otázky, Inspirace, Články | Tělo, První pomoc | Oblíbené, režim, O appce. O appce je `tile:false`.

**Přetagování obsahu — HOTOVO 11. 9. 2026 (Otázky, Inspirace, Články, Cvičení).** Zadání a logika per sekce v `local/_prompty/tagovani.md` (uživatel kliká na tag s jinou otázkou v hlavě). Cvičení: pořadí „k čemu → metoda (vždy aspoň jedna) → tie-break", průměr 4,8 tagu, nový tag `vnitřní dítě` (slovník **97**), `strach` konečně na expozicích, `přítomnost` na mindfulness, `smrt` na meditaci nad smrtí. Singletony `hranice`, `komunikace`, `návyky`, `svoboda`, `vděčnost`, `volný čas` jsou vědomé tie-breaky. **Obsahová díra:** žádné cvičení není na `deprese`, `vyhoření`, `ocd`. Přetagováním se zároveň srovnal drift dávek vs. `data/` (5 cvičení mělo v dávkách `přerámování`, v datech už `přerámování myšlenek`).

**Generování obsahu z promptů:** v `local/_prompty/` (nepushuje se) jsou prompty pro tvorbu JSONů — `telesne-priznaky.md`, `cviceni.md`, `clanky_kraceni_prompt.md` (přetavení zdroje do struktury a hlasu), `bolistky-hlasky.md` (dvoukolová fabrika hlášek, viz Stav) a sklizňové prompty `otazky.md`, `citaty.md` (internetová sklizeň → WIP JSON → Bobovo ruční čištění → tagy ex post z `tagy.json` → konverze do `data/`). Vzory jsou reálné pročištěné JSONy. Přerámování jdou z Bobových Excel seznamů, ne přes prompty.

### Zdrojáky obsahu a rebuild — čti dřív, než sáhneš do `data/`

Část obsahu v `data/` **není zdroj, ale výsledek buildu.** Kdo edituje `data/` přímo, tiše odpojí zdroják a při příštím rebuildu o svou opravu přijde.

| co | zdroj pravdy | jak se dostane do `data/` |
|---|---|---|
| **cvičení** | 17 dávek `local/data_wip/exercises_wip/cviceni_davky/davka_*.md` | build skriptem, viz níže |
| **oddíly** | `local/data_wip/sections_wip/sections.json` | kopií |
| **řetězy** | `local/data_wip/chains_wip/chains.json` | kopií |
| **články** | `data/articles.json` — **zdroj i výsledek**, žádný build | — |
| **triplet** (ref/refq/refa) | `local/data_wip/reframings_triplet_wip/reframings.xlsx` + `tykani_opravy.json` | `build_triplet.py` |
| **strachy** (fears/situations) | `local/data_wip/strachy_wip/kanon_strachu_pocity.json` + `brany_reframings.md` | `build_fears.py` |
| **bolístky** (pains) | `local/data_wip/bolistky_wip/` dávky + `hlasky_karolinka.md` + `vyber_nase.json` | `build_pains.py` |
| ostatní | `data/*.json` přímo | — |

`sections_wip/_podklad/sec_*.md` jsou **surovina, ze které oddíly kdysi vznikly, ne zdroj pravdy.** Build skript pro ně neexistuje a s JSONem se už rozešly.

**Rebuild cvičení** (z `local/data_wip/exercises_wip/`):

```bash
python 02_build_exercises.py cviceni_davky exercises.json && python 03_lint_exercises.py exercises.json && cp exercises.json ../../../data/
```

Lint musí projít na nulu. Kontroluje pole, ID, `sort_order` per oddíl, řetězy, počet schémat (3) a tagy — ty čte z `tagy.json` v kořeni, vlastní kopii seznamu vědomě nedrží. `01_fix_davky.py` je **jednorázová oprava z 14. 8. 2026, znovu ji nespouštěj** — je hotová a její tabulky by přepsaly dnešní stav.

Konzoli si přepni na UTF-8 (`PYTHONIOENCODING=utf-8`), jinak lint spadne na emoji ve výpisu.

### Sekce Přerámování = tři brány (nasazeno 12. 9. 2026)

Rozcestník tří karet s větou „kdy sem“: **Jádrové pocity** / **Strachy** / **Bolístky**. Plný popis toku v README „Sekce aplikace → Přerámování“. Co musíš mít v hlavě:

- **Strachy:** kanonový strach → **rovnou triplet** přes merged interleaving nad `cluster_ids.slice(0, FEAR_CLUSTERS)` (3, ne 5 — kolový interleaving by dal šumu stejné slovo jako jádru). Uživatel pocity nevybírá, ale **vidí je pod titulkem** (rozhodnuto 12. 9.). Situace → `mark` P/E/K → „Co je pod tím?“ → `fear_ids` → triplet. Skupina `Obranné` (`FEAR_HIDDEN_GROUP`) jen do hledání. `rf.origin` říká, kam vede Zpět.
- **Bolístky:** **bez kategorií** — `smer` i `oblast` se nezobrazují (rozhodnuto 12. 9.). Hlášky bez tripletu, vědomě; klíč `pain_id:index` pro oblíbené/viděné. `source` k/n zobrazit až při škrtání.
- **Provizorní admin na road trip (září 2026, dělá se až na závěr):** appka musí umět škrtat hlášky (cíl 15/bolístku) a mazat položky tripletu, výsledek propsat zpět do zdrojů (Excel / `vyber_nase.json`), ne do `data/`.
- **Datový objem:** triplet 4,2 MB + pains 1 MB, appka tahá všech 16 souborů najednou s `no-cache`. Přes Pages gzip ~1,3 MB — na hotelové wifi znát. Lazy load tripletu až po vstupu do sekce je legitimní krok, až to začne bolet.

### Jediná verze appky

- **`cesta.html` — jediný živý HTML soubor.** Všechny sekce naživo nad daty v `data/`. `MC_BASE="./data/"`. Meta hlavičky pro mobil (viewport, PWA manifest, vypnutá cache) — Mioweb je ignoruje. **Veškerá práce jde sem.**
- **`cesta_prototyp.html`** — **smazaný 14. 8. 2026.** Starší obal pro Mioweb, mrtvá větev. Zůstává v historii gitu.
- **`cesta_admin.html`** — zastaralý, k přestavbě od základu (viz past č. 1). **Odsunutý do `local/.old/`**, ať neleží vedle živých souborů a nemate.

Appka stojí na **registru sekcí** — jeden `SECTIONS = [...]` řídí dlaždice, menu (pořadí, linky přes `sep`) i router. Nová sekce = výměna rendereru, obal se nesahá.

Na mobilu: `https://haryzek.github.io/cesta/` → rozcestník → „Moje cesta" → Chrome „Přidat na plochu".

---

## Datový model — rychlá orientace

16 souborů. Plný rozpis polí v README. Co musíš mít v hlavě:

- **ID** = permanentní totožnost, formát `prefix_NNNN`, **čtyřmístný** zero-padding (`ref_0001`, ne `ref_001`). Nikdy se nemění, nenese pořadí.
- **`sort_order`** = pořadí. U tripletu **lokální per cluster** (restart na 1, hustě 1..N bez děr). U plochého obsahu globální v souboru.
- **`tier`** = `free` nebo `premium`, nikdy nic jiného.
- **Tagy** vždy lowercase a **výhradně z `tagy.json`** v kořeni repa. Nikdy nezakládej druhou kopii seznamu.
- **`schemas`** = EMS kódy. **Cluster má 5, obsah má 3.** (README kdysi místy mluvil o 5 i u obsahu — to je opravené, reálná data mají u obsahu 3. Drž 3.)

Prefixy ID podle souborů: `cl_`, `feel_`, `crisis_`, `body_`, `art_`, `ex_`, `sec_`, `chain_`, `ref_`, `refq_`, `refa_`, `inspir_`, `quest_`, `fear_`, `sit_`, `pain_`.

Všech 16 JSONů leží v **`data/`** a všechny jsou ploché listy (žádný obalový objekt; `pains` má vnořené pole `hlasky`, `situations` pole `reframings` — pořád je to plochý list položek). Ikony a statické assety v `assets/`.

**Markdown v tělech** appka renderuje vlastním mini-parserem. Umí: `##`/`###`/`####`, `*` i `-` odrážky, `1.` číslované, `**tučně**`, `*kurzíva*`, vnořené odrážky přes odsazení, víceřádkové položky seznamu. **Neumí: odkazy, obrázky, tabulky, kód, citace `>`, vodorovné čáry** — nepiš je do dat, nevykreslí se.

**Formát obsahu** (stav k 18. 7. 2026 — crisis, body, exercises pročištěné, slouží jako etalon pro prompty v `local/_prompty/`):

- **crisis** — bloky `##`, odrážky `*`, žádný duplicitní název. Telefonní čísla v `**bold**` (renderer je obarví tónem — viz past č. 7). Kontakty: číslo na samostatném řádku.
- **body** (Tělesné příznaky) — pevný skelet **7 bloků** (Jak se projevuje / Psychické příčiny / Fyziologické příčiny / Kdy se zhoršuje / Co přináší úlevu / **S čím se to často plete** / Kdy k lékaři). Vzor: text-bloky vs. odrážkové bloky s úvodní větou zakončenou dvojtečkou + `*kurzíva dovětek*`. Blok 6 se jmenuje „S čím se to často plete" (ne „Na co si to lidé pletou").
- **exercises** — `body` = `## Než začneme` (66/71) + `## Postup` (+ volitelně `## Upozornění`, `## Co mít na paměti`, `## Doplnění`). **Deník v `body` není** (dřívější `## Zápis do deníku` z kalibračních cvičení zmizel přechodem na dávky) — žije v polích: `section.diary_exercise` (společný pro oddíl) + `exercise.diary_exercise` (specifický, 41 cvičení; 16 nad rámec podkladu ponecháno, rozhodnuto 11. 9. 2026) se slepí do journal-card na konci cvičení; `section.diary_practice` jde do tabu Praxe. **Renderer to tak od 12. 9. 2026 dělá** — journal-card u cvičení kreslí z polí, `splitJournal` se u cvičení nevolá. **`info`, `theory`, `practice` jsou u cvičení vždy `null`** — dědí se z oddílu (fallback, SPEC §2). Oddílové `practice` = `## Úvodní motivace` + `## Uvedení do praxe` + volitelné bloky + závěrečný blok s **živým nadpisem** („Jak začlenit relaxaci do každodenního života" — SPEC měl jednotné „Začlenění…", rozhodnuto 11. 9. 2026 nechat živé); `diary_practice` renderer vkládá **za druhý blok**, ne podle jména nadpisu. Oddílové `info` = pevných **8 bloků** (K čemu to bude dobré → Kdy využít → Jak pracovat → Jak posílit efekt → Mindset → Na co si dát pozor → Přes co nejede vlak → Co nám může bránit), společných pro všechna cvičení v oddílu. `info_extra` (4 cvičení) / `theory_extra` (5 cvičení) = předřazený text nad oddílové Info / Teorii, jinak `null`. (Dřívější verze s 10 bloky per cvičení existovala jen u 3 kalibračních cvičení před nasazením 14. 8. 2026 — přechodem na dávky se sfoukla do oddílů.) Kroky postupu = číslovaný seznam, každý krok **tučný titulek + odrážky** (past č. 6).
- **articles** — souvislý text, **žádné `##` nadpisy**. Nejsou to mikročlánky: jsou to zkrácené verze blogových článků, strop 600 slov (u výčtových 750), průměrně ~3 400 znaků. Když se odřízlo víc než 20 % originálu, má článek `show_link: true` a appka pod ním nabídne odkaz na plné znění.

**Odrážky v datech drž jednoúrovňové a markerem `*`** (renderer umí i `-` a vnoření, ale prompty sjednocují na `*` a jednu úroveň).

**Hlas obsahu — tři formy, každá má důvod:**
- **Appka uživateli vyká** (UI: „Vyberte pocit", perex, placeholdery, O appce). Zdvořilý průvodce.
- **Obsah je „my"** (cvičení postup i info, tělo). Společná cesta, nepřikazujeme. **Výjimka (rozhodnuto 11. 9. 2026): oddílové `theory` a `practice` vykají** — Postup je „my", taby Info/Teorie/Praxe smí oslovovat čtenáře; není to chyba k opravě.
- **Deník je „já"/ich-forma** („Jak jsem se cítil/a?"). Osobní reflexe.
- **Články** stojí mimo — autorská řeč, kombinace vykání a „my" je tam **záměrná**.

Kdo má co:
- **`schemas`** mají: clusters (5), articles, exercises (3). **Nemají**: feelings, crisis, body, triplet, sections, chains, questions, inspirations (obojí shozeno 11. 9. 2026 — univerzálky mimo doporučování).
- **datum** má většina (`added_at`); articles má navíc `published_at`. **Nemají**: crisis, body (jsou to malé stabilní sady, které se nebudou rozšiřovat — je to záměr, ne opomenutí).
- **`cluster_id`** mají: feelings, triplet (ref/refq/refa). **`cluster_ids`** (5) má fears; situations se na klastry vážou přes `fear_ids`; pains vazbu vědomě nemají.

---

## Pasti (na tyhle si dej pozor)

1. **`cesta_admin.html` je zastaralý a rozešel se s realitou.** Leží v `local/.old/`, ne v kořeni. Nepoužívej ho jako zdroj pravdy o datovém modelu. Konkrétně: má špatné prefixy (`mic`/`quote`/`q`/`symptoms` místo `art`/`inspir`/`quest`/`body`), třímístný padding místo čtyřmístného, zná jen 9 sekcí a **vůbec nezná `reframing_questions` ani `reframing_actions`**. Vznikl jako rychlý test „projde to do Miowebu", design i data jsou mimo. Bude se přepisovat od nuly. Zdroj pravdy je README + reálné JSONy, ne admin.

2. **Dva různé GitHub účty v historii.** Aktivní a správné je `haryzek/cesta`. Kdekoli narazíš na `bobrerichacz/stesti_naproti_app` nebo podobné, je to starý/vedlejší pozůstatek — ignoruj, drž `haryzek/cesta`. (Prototyp má v `MC_BASE` správně `haryzek.github.io/cesta/`.)

3. **5 vs 3 schémata.** Cluster 5, obsah 3. Kdyby někde v textu bylo 5 u obsahu, je to stará informace.

4. **CSS specificita `#mc-root` — už dvakrát to kouslo.** Reset `#mc-root ul { padding:0 }` má specificitu (0,1,1) a tiše přebíjí každou třídu (0,1,0). Výsledek: `.mc-list`, `.mc-cards` i `.mc-md ul` přišly o odsazení a ležely na okraji obrazovky — a nevypadalo to jako chyba CSS, ale jako nedbalé odsazení. Totéž se stalo dřív s `margin`. **Všechny resety pod `#mc-root` piš přes `:where()`.** Když ti nesedí zarovnání a v CSS to vypadá správně, hledej tady.

5. **`stripDupHeading` je ponechaná pojistka.** Zahazuje první nadpis těla, když se shoduje s názvem položky. Data jsou teď čistá (nikde duplikát není), takže je nečinná — ale drží se pro fázi generování z promptů, kdyby prompt uklouzl. `pullDuration` (dřívější druhá berlička) je **smazaná** — banner „Trvání" bere přímo pole `duration`. Nepřidávej nové berličky bez domluvy s Bobem.

6. **Kroky cvičení stojí na vzoru v datech.** Číslovaný seznam, kde položka začíná `**Tučným titulkem.**` a pod ním odrážky. Renderer z toho dělá kolečko s číslem, titulek a linku — čistě CSS countery nad `<ol>`, datový model se nesahá. **Když se ten vzor v datech poruší, kroky se rozpadnou na obyčejný seznam.** Nejkřehčí místo designu.

7. **Renderer má tři cílené transformace obsahu** (ne berličky — vědomé komponenty): `mc-tel` obarví tónem `**bold**`, který je čistě telefonní číslo (Krizovka). `splitJournal` oddělí závěrečný `## Zápis do deníku` z těla — u cvičení se už nevolá (deník jde z polí), pro ostatní typy je nečinný → kandidát na Viktora. Markdown parser umí i **víceřádkové položky seznamu** (odsazený řádek pokračuje poslední odrážkou) — kvůli kontaktům s číslem na dalším řádku.


8. **Neupravuj `data/exercises.json` přímo** (a totéž triplet, fears, situations, pains — všechno jsou výstupy buildů, viz tabulka). Je to výstup buildu ze 17 dávek (viz „Zdrojáky obsahu a rebuild"). Oprava zapsaná do `data/` vypadá, že funguje — a zmizí při prvním rebuildu. Uprav dávku, přebuilduj, prožeň lintem, zkopíruj. Totéž platí pro `data/sections.json` a `data/chains.json`, jen tam je zdrojem JSON v `local/data_wip/`, ne dávky.

9. **Slovník tagů má jednu jedinou kopii — `tagy.json` v kořeni.** Dřív žil ve třech (`local/_tags/*.txt`, SPEC §12, natvrdo v lintu), kopie se rozešly a slovník se kvůli tomu **dvakrát rozjel** — nejdřív u cvičení, pak u článků; konsolidace 14. 8. 2026 srazila 93 tagů na 56 (k 11. 9. 2026 po přetagování otázek, inspirací, článků a cvičení 97). Když budeš potřebovat seznam tagů, načti ho ze souboru. **Nikdy ho nikam neopisuj**, ani do promptu, ani do skriptu.
10. **Paměť viděného píše jen swipe.** `markSeen` se volá z `bindSwipe` (karta na obrazovce) a z `toggleFav`. Nikdy ji nevolej ze seznamu — „proscrolloval“ není „přečetl“, a při „jen nové“ by uživateli mizel obsah, kterej neviděl. Proud si při „jen nové“ snímkuje seznam (`state.swipe.key/ids`), jinak by karty mizely pod rukama.

11. **Dlaždice jedou po párech (grid 2 sloupce).** Devátá sekce s `tile:true` by trčela sama. Když přibude sekce, buď ji dej do menu (`tile:false`, jako O appce), nebo přidej dvě.


---

## Design

Nasazený 17. 7. 2026, vznikl v konverzaci s Claude Chat. **Zdroj pravdy je `<style>` blok v `cesta.html`** — nic jiného. Původní handoff a mockup jsou překonané: handoff leží jako historie v `local/_design/.old/design-handoff.md`, screeny a mockup `exercise.html` už neexistují a nejsou potřeba, nasazený design je lepší než ony. **Není finální** — základ je odladěný, ale barvy čeká „overhaul do veselejší atmosféry" a karty Přerámování doladění.

**Dvě témata, light + dark.** Přepínač je dole v hamburger menu, volba v `localStorage` (`mc_theme`). Dokud si uživatel nevybere, jede se podle systému. `data-theme` se píše na `#mc-root`, **ne na `<html>`** — uvnitř Miowebu nad ním nemáme kontrolu.

**Tón sekce (`--tone`).** Od 12. 9. 2026: **teal** („modrá“ v Bobově řeči) pro běžné používání — Moje cesta, Cvičení, Přerámování, Otázky, Inspirace, Články, O appce; **červená (accent)** jen pro zásah, když je zle — Tělo, První pomoc. Řídí barvu nadpisů, odrážek, ikonek, výběru — celou sekci, ne jen dlaždici. Registr sekcí má pole `tone`, render píše `data-tone` na `#mc-root`.

**Fonty:** Fraunces (nadpisy, titulky, citáty) + Public Sans (UI a běžný text) + mono (metadata, čísla). Fraunces je variabilní font — **vždy nastav `font-variation-settings:'opsz'`** podle velikosti (72 pro H1, 36 pro H2, 24 pro titulky), jinak vypadá placatě. Váha nadpisů 600, ne 400 (to bylo pro Georgii).

**Osa `--gutter: 20px`.** Všechno boční odsazení jede přes ni. Nepřidávej vlastní hodnoty.

**Klíčové proměnné:** `--tone`/`--tone-soft` (barva sekce), `--on-accent` (text NA accent ploše — v light světlý, v dark tmavý), `--heart` (srdíčko, v light světlejší než accent). `--empty`/`--done`/`--missed` nemají v kódu jediné použití, jsou to zbytky.

**Detail cvičení** (k SPEC od 12. 9. 2026): tabbar Postup / Info / Teorie / Praxe, box náročnosti (`.mc-strip`, návrh `local/_design/box_náročnosti.jpg`), box řetězu a warning (`.mc-box`), číslované kroky (past č. 6), přílohy (`.mc-attach`) a **journal-card** z polí deníku — tealová karta (klidová barva proti postupu). Detail obsahu se sází přes `.mc-detail-head`; nadpis mimo tuhle hlavičku ztratí gutter a přilepí se k okraji (opakovaná chyba). **Proud karet** (`.mc-swipe`) je funkční, design pass čeká.

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

**`cesta.html`** má `MC_BASE="./data/"`, takže se nic nekopíruje ani nepřepisuje — spusť `python -m http.server 8777` v kořeni a jeď na `http://localhost:8777/cesta.html`.

Router se dá ovládat z konzole: `MC.open("exercises")`, `MC.home()`, `MC.detail(...)` — rychlejší než klikat.

Screenshot ani localhost v Browser pane v tomhle setupu nefungují. **Testuj headless v Node:** `_scratch/tests/` (mimo git, jsdom) — načte `cesta.html`, `fetch` nahradí čtením z `data/`, klikne přes `window.MC.*` a zkontroluje DOM. `node test.js`, `test_rf.js`, `test_fav.js`, `test_swipe.js`; jsdom potřebuje `url: "http://localhost/"`, jinak nemá `localStorage`. Bar je: nula ERR, `window errors: none`. Layout (scroll-snap, výšky) jsdom nemá — to ověří Bob na mobilu.

Než pushneš, zabij server (`taskkill //F //IM python.exe`) — drží složku a `rm -rf` pak spadne na „Device or resource busy".

---

## Jak se mnou pracovat (Bob)

- **Jeden krok po druhém.** Nejdřív probrat kontext a přístup, teprve pak výstup. Nepředbíhej, neřeš budoucí kroky dopředu.
- **Git: commituj rovnou na `main`.** Žádné větve, žádné PR, žádná review ceremonie — Bob je na projektu sám a nikdo nic nereviduje. **Hlavně ale `main` není jen záloha: Pages deployují právě odsud**, takže z něj běží appka na Bobově mobilu i data pro embed v Miowebu. Větev by se nenasadila a Bob by změnu neviděl. Push je tím pádem publikace — commituj klidně a často, ale vždycky ověř, co posíláš.
- **Stručně a přímo.** Žádné vaření, žádné omluvy, žádné preventivní vsuvky typu „na rovinu ti řeknu". Prostě řekni věc.
- **Drž si vlastní názor.** Combative collaboration — když se Bob mýlí, řekni to; a čekej totéž zpátky. Sykofantské přitakávání je na obtíž. Bob úspěšně přebil dřívější Bresenham návrh vlastním řešením — tenhle typ výměny je žádoucí.
- **MVP disciplína.** Bob má completionistickou tendenci, kterou vědomě krotí. Minulý projekt spadl na overengineeringu (200stránkový spec). Prototyp první, ověřit, pak teprve rozšiřovat. Nepřiživuj nafukování rozsahu.
- **Připomínkování designu:** Bob dělal 10 let v digitálních agenturách a připomínky umí. Píše je jako guláš včetně „minipíčovinek" a **vědomě nechává třídění na tobě** — roztřiď si je sám na systémové CSS / bugy / funkce / data a udělej plán. Nefiltruj je za něj: dneska (17. 7.) na dvou „minipíčovinkách" stály dva reálné bugy (nefunkční proklik v Oblíbených, ikony o 9px vedle) a jeden nález, co rozbíjel zarovnání v celé appce. Když se něco opakuje napříč sekcemi, je to systémová věc — pojmenuj ji a oprav jednou, ne desetkrát. Když si Bob řekne o volnou ruku („zvol další krok"), vezmi ji.
- **Tón:** čeština, nespisovně, kámoš. Oslovení „Bobe" (ne „kámo"). Kokosácký režim — občas hrubší láskyplná mluva je warmth, ne kritika. Nevztahuj psychoanalytické věci k Bobově osobě bez vyzvání.
- **Obsahová práce:** přerámování se generují z víc modelů (Claude, ChatGPT, Gemini, Grok) a pak se čistí dvouprůchodově (hrubé pročištění → finální leštění). Prompt pro generování je ve zdrojích projektu, drž se ho. Pozor na syntaktickou monotónnost — Bobovy přerámování mají tendenci sklouzávat do opakované struktury „To, že X, neznamená Y"; hlídej tonální a strukturní pestrost napříč ~20 položkami na cluster.
