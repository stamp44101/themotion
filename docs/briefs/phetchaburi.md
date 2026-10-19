# City brief — Phetchaburi / เพชรบุรี

Status: research pass 1 (2026-10-19), cloud container. Web search only: ONEP, Wikipedia,
silpa-mag and Google Maps cannot be reached from here. The footprint, pins, heights and
river width are open (§1, §2, §5a, §7) and go to the owner's agent as an issue. Every date
carries its source and a confidence level. Nothing marked [unknown] may be guessed.

## 0. What the last clips say (docs/experiments.md)

- A **hero big enough to read on the whole-tile shot at frame 0** cut the skip rate from about
  52% to 32.9% (Korat's dinosaurs). Nakhon Si's relic boat was a speck: 43.1%.
- Half the 3 s audience is gone by 17 s: keep the early beats short and moving.
- **60 s.** Only go to 75 s if the extra time is action.

## 1. Footprint

**Phetchaburi is one of ONEP's 36 announced old towns** (listed in `thai-oldtown.csv`; see
the Khon Kaen brief §1 for the full list), so there is a real polygon in
https://www.onep.go.th/data/oldtown.rar → `oldtown_all.shp`, WGS84 degrees, the same file
Lampang's came from. `www.onep.go.th` is refused from this container. The owner's agent
extracts it into `docs/briefs/phetchaburi_onep/` as Lampang's was.

- **Wall: [unknown].** No source found for a surviving wall, gate or moat circuit. Until one
  is found, treat the town as **unwalled**, like Khon Kaen (`noWall`), and use the ONEP zone
  for extent only. Do not draw a crenellated enclosure on a guess.
- **River vs zone: [unknown].** The old town lies on the แม่น้ำเพชรบุรี. Whether the river
  runs *through* the zone (as at Lampang) has to be tested against the polygon.

## 2. Water

| water | real size | notes |
|---|---|---|
| แม่น้ำเพชรบุรี | width at the town **[unknown]** | measure off satellite at the old-town bridges, in metres |
| เขื่อนแก่งกระจาน | crest 760 m, height 58 m, ~710 million m³ | far upstream (west); background only |
| Gulf of Thailand | — | east of the town; one point on open water needed for `geo.ts` |

## 3. Story beats (proposal, 60 s)

Every beat has something happening on screen. Facts with nothing to show go in sub lines.

| beat | s | year | on screen | confidence |
|---|---|---|---|---|
| **open** | 0–8 | — | **hero at frame 0:** Khao Wang's three-peaked hill standing over a plain of ตาลโตนด palms beside the river. The shape stays in every shot. | landscape; height [unknown] |
| **khmer** | 9–15 | ~1191 (พุทธศตวรรษที่ 18) | red laterite towers of **วัดกำแพงแลง** rise one by one, five prangs in the Bayon plan | **attributed:** "คาดว่าสร้างสมัยพระเจ้าชัยวรมันที่ 7"; the five-prang plan is in travel sources. The link to the Preah Khan inscription's place name (ศรีชัยวัชรปุระ) is **disputed/unverified**: keep it off screen |
| **siege** | 17–24 | พ.ศ. 2307 (1764) | a Burmese army comes over from the west and is **driven back**; Phraya Tak among the defenders | **confirmed** in outline (KMUTT King Taksin history after Thuan Boonyaniyom 1970; silpa-mag 17644): Phraya Tak served under Phraya Phiphatkosa and the Burmese were pushed back through the Singkhon pass. The battle site inside the province is [unknown]. Alternative: พระยาละแวก attacks in 2121 and 2124 (silpa-mag 113318), sub line only |
| **palace** | 26–33 | พ.ศ. 2402–2405 (1859–62) | **พระนครคีรี** goes up on the three peaks: palace, Wat Phra Kaeo Noi, and a chedi over the old one on the summit | **confirmed:** started 2402 under Rama IV with Chaophraya Si Suriyawong as แม่กอง. Completion **2405** is given by several sources but not all |
| **railway** | 35–41 | พ.ศ. 2446 (1903) | the first southern train runs in from the north and stops at Phetchaburi, the line's first terminus | **confirmed:** Thonburi–Phetchaburi, about 150 km. Ran with makeshift carriages from **1 เม.ย. 2446**; Rama V's official opening **19 มิ.ย. 2446** (en.wikipedia Southern Line / Phetchaburi station). Hold พ.ศ. 2446 |
| **banpuen** | 43–48 | พ.ศ. 2453–2459 (1910–16) | **พระรามราชนิเวศน์** (วังบ้านปืน) rises by the river, a German Jugendstil palace | **confirmed:** foundation 19 ส.ค. 2453 under Rama V, finished 2459 under Rama VI; architect Karl Döhring |
| **today** | 50–56 | → พ.ศ. 2569 | the modern town has spread around the hill; **fireworks over Khao Wang** (the งานพระนครคีรี fair) | both 2021 honours go in the sub line: กลุ่มป่าแก่งกระจาน a natural World Heritage site, **26 ก.ค. 2564** (ONEP), and Phetchaburi a **UNESCO City of Gastronomy, 2564** (TAT). The exact UCCN date is **disputed** (4 vs ~8 พ.ย. 2564): say the year only |

- **Finale card:** kicker `<first year> – พ.ศ. 2569` (the first year depends on the khmer
  beat's wording), title `เพชรบุรี`, tagline from the provincial slogan *"เขาวังคู่บ้าน
  ขนมหวาน เมืองพระ ..."*: e.g. **"เขาวังคู่บ้าน เมืองขนมหวาน"**. Check that it fits one line.
- **Era labels:** เขมร · อยุธยา · รัตนโกสินทร์.
- **Candidates for sub lines:** Kaeng Krachan dam opened 22 พ.ค. 2509 (confirmed). Phetchaburi
  as "เมือง 3 รส": salt, lime and palm sugar (TAT).

## 4. Landmarks

| name | real position | appears | notes |
|---|---|---|---|
| พระนครคีรี (เขาวัง) | west of the old town [pin] | hill: always. Palace: 2402 | three peaks: palace / Wat Phra Kaeo Noi / Phra That Chom Phet. Which stands on which peak is [to verify]. **Model the silhouette first** (the Chonburi lesson) |
| วัดกำแพงแลง | east of the river, ต.ท่าราบ [pin] | ~1191 | laterite: deep red-brown, not brick |
| วัดมหาธาตุวรวิหาร | old town [pin] | Ayutthaya era | white five-prang group, the town's tallest skyline. Sub-beat or set dressing |
| วัดใหญ่สุวรรณาราม | old town [pin] | late Ayutthaya | wooden ศาลาการเปรียญ. Set dressing |
| พระรามราชนิเวศน์ | by the river, south of the town [pin] | 2453–2459 | pale walls, steep roofs |
| สถานีรถไฟเพชรบุรี | [pin] | 2446 | |
| ตาลโตนด palms | plain around the town | always | the province's signature tree: a palm grove, not broadleaf canopy |

## 5. Terrain and palette

- **Hills:** Khao Wang (height [unknown]; the hill was called เขาสมณ and renamed
  เขามหาสวรรค์). Others nearby (เขาบันไดอิฐ, เขาหลวง) are [to verify]. Kaeng Krachan's
  mountains far west only as a backdrop.
- **Palette:** a dry, sandy plain with sugar palms rather than a closed green canopy. That
  also avoids the "dark and green" opening that Nakhon Si measured.

## 5a. Real coordinates (`geo.ts`): for the owner's agent

Needed: พระนครคีรี (and each of its three peaks), วัดกำแพงแลง, วัดมหาธาตุวรวิหาร,
วัดใหญ่สุวรรณาราม, พระรามราชนิเวศน์, สถานีรถไฟเพชรบุรี, two points on the river through
the town, one point on the Gulf, and the dam (`far: true`).

## 5b. Grandeur

- **The big thing:** Khao Wang with the palace on its crest, over the town. The modern town's
  real extent is [unknown].
- **The framing held across centuries:** the three-peaked hill, the river, and the palm plain.
- **The last frame:** fireworks over the lit hill.

## 6. Sound (code only, `scripts/synth.py`)

- **Central-Thai palette:** ranat, khlui, pi, khong wong. The province series is synth only.
- **Events, keyed to the beat:**
  - khmer: stone being dressed and set
  - siege: drums and a clash, then the retreat
  - palace: a gong as it completes
  - railway: chuffs and a whistle
  - banpuen: a brass band hint
  - today: traffic, then fireworks

## 7. Open questions

1. The ONEP polygon, and whether the river runs through it.
2. Khao Wang: height, the three peaks' positions, and which building stands on each.
3. The river's width at the town.
4. Was there a wall? If so, where?
5. The 2307 battle site (or the 2121/2124 Lawaek approach), if a pin is possible.
6. Whether "ศรีชัยวัชรปุระ = Phetchaburi" is accepted in Thai scholarship. Until then, keep it
   off screen.
7. The exact UCCN date. Until then, use the year only.

Sources (pass 1): silpa-mag (15971, 131619, 17644, 113318, 9290, 155972), KMUTT library
(King Taksin), en.wikipedia (Southern Line; Phetchaburi station; Phra Ram Ratchaniwet;
Kaeng Krachan Dam), EGAT, ONEP (Kaeng Krachan WH, 26 ก.ค. 2564), TAT (UCCN 2021),
so02.tci-thaijo (Wat Mahathat, Jayavarman VII), gotoknow 490071 (provincial slogan).
