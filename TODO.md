# TODO — Moje cesta

Pracovní seznam. **README popisuje, jak věci jsou; tenhle soubor, co se má stát.**
Když se něco vyřídí, škrtá se odsud — a pokud to změnilo pravidlo, doplní se do README.

Dělení je podle toho, **kdo to musí utáhnout**, ne podle oblasti. Nahoře jsou věci,
kde je potřeba Bobova hlava nebo ruka a nikdo je za něj neudělá.

---

## 🫏 Pro vrchního osla

Věci, kde rozhoduje Bobův úsudek, jeho hlas nebo jeho přístupy. Claude umí připravit
podklad, seznam nebo návrh — ale poslední slovo je Bobovo.

### Před road tripem (září 2026)

- [ ] **Provizorní admin v appce — dělá se až na závěr, po všem ostatním.**
      Režim škrtání: u hlášek a položek tripletu křížek „škrtnout“, `source` k/n
      viditelný, škrtnuté v `localStorage`, tlačítko Export vysype JSON škrtů →
      skriptem propsat do zdrojů (Excel / `vyber_nase.json`), ne do `data/`.
      Zapnutí přes `?admin` v URL nebo dlouhé podržení názvu. Rozsah domluvit
      před stavbou.
- [ ] **Prstem projít appku na mobilu** — tři brány, Moje cesta, proud karet
      (výška `100vh − 230px`, snap, srdíčko u palce), pilulky u H1, oči v liště.
      Guláš připomínek pak Claude roztřídí.

### Obsah

- [ ] **Čistka tripletu (po USA).** ~10 klastrů má narváno z několika sessions
      (`cl_0001` 332 R), `cl_0096 Zodpovědný` je smíchaný s „náročný“ — vybrat
      dobré. Škrtá Bob v appce (provizorní admin), výsledek zpět do Excelu.
      **Pozn. (3. 9.):** s proudem karet a pamětí viděného přestává být velký
      počet na klastr dluh — je to zásoba. Škrtat jen za kvalitu, ne za objem.
- [ ] **Ověřit 44× `[ověřit]` v přerámováních situací** — čísla a tvrzení,
      seznam `local/data_wip/strachy_wip/overit.md`. Před ostrým nasazením.
- [ ] **Škrtání hlášek na 15/bolístku** — Bob v appce (provizorní admin), pak
      výsledek propsat do zdrojů. Sledovat, jestli náš hlas (`n`) přežívá.
- [ ] **Sjednotit `oblast` u bolístek** (89 hodnot, guláš) na ~15 kategorií —
      až po škrtání, a jen kdyby se zrcadlo 175 vět ukázalo jako moc dlouhé
      a kategorie byly potřeba (12. 9. rozhodnuto: zatím bez kategorií).
- [ ] **Obsahová kontrola cvičení, dávka po dávce.** 71 cvičení je strukturálně
      čistých, ale věcně a jazykově neprověřených. Kontroluje se samonosnost,
      věrnost Bobovým formulacím, úplnost postupů, kvalita deníkových otázek
      a tónová pestrost. Strojově to nejde. Doporučené pořadí: oddíl 04 jako
      etalon, pak 05–11. Práce na několik sezení. **Nově k posouzení při
      klikání:** Info/Teorie/Praxe jsou oddílové, takže u všech 18 cvičení
      Relaxace stejné — jestli to při používání působí jako „říká mi to pořád
      totéž“, je to signál k domluvě, ne bug.
- [ ] **Zadat, jestli projet perexy článků.** U cvičení se to udělalo (8 přepsaných
      z 71). U 112 článků se perexy zatím nikdo nedíval stejným metrem.
- [ ] **Tělesné příznaky — 26 nových prověřit** (napsané podle šablony 26. 8.,
      Bob je obsahově neviděl).
- [ ] **Zobrazovací vrstva nad slovníkem** — jen kdyby se lišta filtru po
      přetagování stala nepřehlednou (rozhodnuto 11. 9.: zatím ne).

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
- [ ] **Doporučování „Pro vás“ není v appce napsané.** Profil se ukládá, ale
      nikdo ho nečte. Algoritmus je v README; stavět, až bude jasné, že ho
      články/cvičení potřebují.

### Vizuál

- [ ] **Design pass proudu karet.** Funkční, ale nemazlený: písmo (velikost
      podle délky je hrubý odhad), plocha karty, možná barva podle tónu,
      předělová karta „Stačí pro dnes?“. Až po prstu na mobilu.
- [ ] **Barvy — „overhaul do veselejší atmosféry".** Design systém z 17. 7. 2026 je
      odladěný základ, ale paleta na tenhle posun pořád čeká. Bobovo rozhodnutí.
- [ ] **Ikony očí** (jen nové) jsou ruční obrysovky — schválit nebo vyměnit.

### Provoz

- [ ] **Ověřit embed `cesta.html` do Miowebu.** Jediné, co nikdo jiný
      neotestuje — je potřeba reálná WordPress stránka. Nově i **výška proudu
      karet** (`100vh` uvnitř WP = výška elementu, ne okna). Záložní
      `cesta_prototyp.html` už neexistuje, takže když embed nepůjde, řeší se to
      úpravou kompletní verze.
- [ ] **Datový objem.** 16 souborů najednou, gzip ~1,3 MB — na hotelové wifi znát.
      Lazy load tripletu/pains až po vstupu do sekce, až to začne bolet.

### Model dat

- [ ] **Celková doba a frekvence cvičení.** `duration` zůstává jedno číslo = jedno
      provedení. `frequency` / `training_period` se už zobrazují v boxu
      náročnosti; samostatná pole pro celkovou dobu praktikování zatím ne.

---

## 🤝 Spolu

Potřebuje domluvu, pak už to Claude dotáhne.

- [ ] **Srdíčka na přerámování situací (P/E).** Věty nemají ID; šlo by klíčem
      `sit_id:index` jako u hlášek. Rozhodnout, jestli je to potřeba.
- [ ] **Most bolístky → triplet.** Bolístky vědomě bez vazby na klastry (kanon
      má „Nebýt potřebný“, bolístky „Nikdo mě nepotřebuje“ — jednou si o něj
      řeknou). Situace by mohly nabízet i „rovnou k přerámování“ se součtem
      pocitů přes všechny své strachy.
- [ ] **Brána Test à la YSQ (rozhodnuto 27. 8. 2026, stavět po bolístkách).**
      Ne diagnostika — jasně popsat jako inspiraci, hrubé načrtnutí vnitřních
      citlivostí. UI: scrollování výroků, odpověď „Spíše ano / Spíše ne",
      ukazovat % zodpovězeného balíku, po určitém počtu odpovědí výsledky —
      Bob má hotové lidské popisy z praxe. Vyhodnocení čistě lokálně.
      Zdroj položek: `local/data_wip/bolistky_wip/brana3_test_vyroky.json`
      (334, 322 s cluster_id → skórování zadarmo přes klastr → schémata).
      Před stavbou zkontrolovat vyváženost položek napříč schématy.
- [ ] **Tip do návodu / O appce:** „Zapněte si Jen nové (oko) a karty — a choďte
      si pro pár vět denně.“ O appce zatím nezná ani brány, ani Moje cestu.
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
- [ ] **Viktor Čistič:** `stripDupHeading` (nečinná pojistka, drží se pro fázi
      generování z promptů — až budou prompty spolehlivé, pryč) a `splitJournal`
      (u cvičení se nevolá, u ostatních typů žádný deník není — mrtvá).
      `--empty`/`--done`/`--missed` v CSS bez použití.

---

## Nápadník

- **„Najdeš se?"** — nápad na slogan nebo jméno appky (Bob, 26. 8. 2026).
  Do foroty, netrvá se na něm. Sedí k bolístkám-zrcadlu i k výběru pocitů.

## Nedávno vyřízené

Držet krátké — jen věci, na které se bude někdo ptát „a tohle jsme řešili?".

- **12. 9. 2026 — appka dohnala data (jeden den, 9 commitů).** Filtr tagů čte
  prioritu (`TAG_VAHY`). Sekce **Moje cesta** + detail cvičení k SPEC (4 taby
  z oddílu, box náročnosti, box řetězu, warning, přílohy, deník z polí).
  **Tři brány Přerámování** (strachy s kategoriemi a „Co je pod tím?“, bolístky
  jako zrcadlo bez kategorií, hlášky se srdíčky). **Oblíbené per sekce** (pilulka
  u H1). **Proud karet** se scroll-snap + **paměť viděného** (píše jen swipe)
  + oko „jen nové“. **Pořadí sekcí** — Moje cesta první, První pomoc u palce,
  teal pro běžné používání, accent jen Tělo + První pomoc; O appce bez dlaždice.
  Headless testy v `_scratch/tests/` (jsdom).
- **12. 9. 2026 — rozhodnutí, která nevypadají samozřejmě:** default tab
  oddílu je Cvičení (ne Teorie); bolístky bez `smer`; u tripletu ze strachu se
  tři jádrové pocity ukazují pod titulkem; IntersectionObserver v seznamu
  zamítnut (paměť viděného jen ze swipe); přepínač „jen nové“ je oko v liště,
  ne položka menu; seznam je default, karty volba.
- **11. 9. 2026 — obsah:** triplet 116/116, strachy + situace, bolístky 175 × ~24,
  otázky 251, inspirace 202, přetagování všeho, slovník 97 tagů.
- **14. 8. 2026 — `cesta_prototyp.html` smazán.** Mrtvá větev, zůstává v historii
  gitu. Rozcestník `index.html` má jedinou kartu.
- **14. 8. 2026 — Oddíly a řetězy nasazené, motta zrušená, `source_url` /
  `show_link` zprovozněné, tagy sjednocené (93 → 56, jedna kopie v `tagy.json`),
  schémata u obsahu srovnána na 3, cvičení a články nasazené, oprava číslování
  kroků v rendereru.**
