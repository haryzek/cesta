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

Nic není obsahově hotové, ale **struktura všech 11 JSONů je finální a doladěná**. Když něco tvoříš nebo generuješ, drž se přesně stávající struktury.

- Klastry (116) + pocity (399): kompletní mapa s ID a schématy. ✅
- Triplet přerámování: testovací fáze, zatím jen 4 klastry (`cl_0001` neviditelný, `cl_0008` zbytečný, `cl_0013` nedůvěřivý, `cl_0031` špatný).
- Ostatní obsah: jen vzorek pár položek, plní se.
- Prototyp (`cesta_prototyp.html`): funkční, sekce Přerámování + Oblíbené, coconut téma.
- Admin (`cesta_admin.html`): zastaralý, k přestavbě od základu (viz níže).

---

## Datový model — rychlá orientace

11 souborů. Plný rozpis polí v README. Co musíš mít v hlavě:

- **ID** = permanentní totožnost, formát `prefix_NNNN`, **čtyřmístný** zero-padding (`ref_0001`, ne `ref_001`). Nikdy se nemění, nenese pořadí.
- **`sort_order`** = pořadí. U tripletu **lokální per cluster** (restart na 1, hustě 1..N bez děr). U plochého obsahu globální v souboru.
- **`tier`** = `free` nebo `premium`, nikdy nic jiného.
- **Tagy** vždy lowercase.
- **`schemas`** = EMS kódy. **Cluster má 5, obsah má 3.** (README kdysi místy mluvil o 5 i u obsahu — to je opravené, reálná data mají u obsahu 3. Drž 3.)

Prefixy ID podle souborů: `cl_`, `feel_`, `crisis_`, `body_`, `art_`, `ex_`, `ref_`, `refq_`, `refa_`, `inspir_`, `quest_`.

Kdo má co:
- **`schemas`** mají: clusters (5), articles, exercises, inspirations, questions (3). **Nemají**: feelings, crisis, body, triplet.
- **datum** má většina (`added_at`); articles má navíc `published_at`. **Nemají**: crisis, body (jsou to malé stabilní sady, které se nebudou rozšiřovat — je to záměr, ne opomenutí).
- **`cluster_id`** mají: feelings, triplet (ref/refq/refa).

---

## Pasti (na tyhle si dej pozor)

1. **`cesta_admin.html` je zastaralý a rozešel se s realitou.** Nepoužívej ho jako zdroj pravdy o datovém modelu. Konkrétně: má špatné prefixy (`mic`/`quote`/`q`/`symptoms` místo `art`/`inspir`/`quest`/`body`), třímístný padding místo čtyřmístného, zná jen 9 sekcí a **vůbec nezná `reframing_questions` ani `reframing_actions`**. Vznikl jako rychlý test „projde to do Miowebu", design i data jsou mimo. Bude se přepisovat od nuly. Zdroj pravdy je README + reálné JSONy, ne admin.

2. **Dva různé GitHub účty v historii.** Aktivní a správné je `haryzek/cesta`. Kdekoli narazíš na `bobrerichacz/stesti_naproti_app` nebo podobné, je to starý/vedlejší pozůstatek — ignoruj, drž `haryzek/cesta`. (Prototyp má v `MC_BASE` správně `haryzek.github.io/cesta/`.)

3. **5 vs 3 schémata.** Cluster 5, obsah 3. Kdyby někde v textu bylo 5 u obsahu, je to stará informace.

---

## Design (coconut téma)

Vizuál prototypu, jen pro tuhle aplikaci, **není finální** — vzniklo, aby to mělo hlavu a patu a nebylo to rozsypané. Není to sdílený theme, nikde jinde se nepoužívá. Teplé skoro-černé pozadí, zlatý akcent, Georgia serif na obsah, sans na UI, mono na metadata/čísla. Aktuální hodnoty jsou v `<style>` bloku `cesta_prototyp.html` (proměnné `--bg`, `--surface`, `--accent` atd.). Admin má úplně jiný, nesouvisející vizuál (taky k přepsání).

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

## Testování prototypu (headless)

Ověřený vzorec: zkopíruj HTML do temp složky, přepni `MC_BASE` na `"./"` (např. přes `sed`), nakopíruj vedle potřebné JSONy, spusť `python3 -m http.server` a proti tomu Playwright — vše v jednom bash volání. Bar je: nula chyb v konzoli a správné vykreslení proti reálným datům.

---

## Jak se mnou pracovat (Bob)

- **Jeden krok po druhém.** Nejdřív probrat kontext a přístup, teprve pak výstup. Nepředbíhej, neřeš budoucí kroky dopředu.
- **Stručně a přímo.** Žádné vaření, žádné omluvy, žádné preventivní vsuvky typu „na rovinu ti řeknu". Prostě řekni věc.
- **Drž si vlastní názor.** Combative collaboration — když se Bob mýlí, řekni to; a čekej totéž zpátky. Sykofantské přitakávání je na obtíž. Bob úspěšně přebil dřívější Bresenham návrh vlastním řešením — tenhle typ výměny je žádoucí.
- **MVP disciplína.** Bob má completionistickou tendenci, kterou vědomě krotí. Minulý projekt spadl na overengineeringu (200stránkový spec). Prototyp první, ověřit, pak teprve rozšiřovat. Nepřiživuj nafukování rozsahu.
- **Tón:** čeština, nespisovně, kámoš. Oslovení „Bobe" (ne „kámo"). Kokosácký režim — občas hrubší láskyplná mluva je warmth, ne kritika. Nevztahuj psychoanalytické věci k Bobově osobě bez vyzvání.
- **Obsahová práce:** přerámování se generují z víc modelů (Claude, ChatGPT, Gemini, Grok) a pak se čistí dvouprůchodově (hrubé pročištění → finální leštění). Prompt pro generování je ve zdrojích projektu, drž se ho. Pozor na syntaktickou monotónnost — Bobovy přerámování mají tendenci sklouzávat do opakované struktury „To, že X, neznamená Y"; hlídej tonální a strukturní pestrost napříč ~20 položkami na cluster.
