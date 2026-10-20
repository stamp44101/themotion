# City brief — Chiang Rai / เชียงราย

Status: research pass 2 (20 ตุลาคม 2569; pass 1 the same day), written in the cloud container with web search only.
Everything marked `[unknown]` needs the ONEP map or a pin from a Thai connection (the issue
that goes with this brief). Built to the storyline standard (`docs/storyline.md`).

## 0. What the last clips say (docs/experiments.md)

- **A hero that is static fails, whatever it is.** Nakhon Si's boat, Lampang's carriage and Khon
  Kaen's stupa all landed at 43–45% skip. Only Korat's big walking dinosaurs won (32.9%).
- **Khon Kaen shared best (1.4%)** with a symbol locals are proud of and pass on.
- Retention at 17 s was best (~34–35%) where the first beats had animals or people moving.
- **60 s.**

## 1. Footprint

Settled, pass 3 (issue #54, on a Thai connection). Full write-up in `chiangrai_onep/README.md`;
the polygon itself is `chiangrai_onep/chiangrai_oldtown.geojson`.

ONEP published Chiang Rai as **two** features, not one — a core with a surrounding zone around it:

| | area | bounding box |
|---|---|---|
| **core** (the walled town) | **1.2526 km²** | 1,964 m E–W × 1,146 m N–S, centroid 19.910348, 99.830185 |
| **surrounding zone** | 2.9347 km² | — |
| **everything inside the outer edge** (the tile) | **4.1873 km²** | **2,990 m E–W × 2,132 m N–S**, centroid **19.913421, 99.830424** |

`AGREE` 12 พ.ค. 2558 · `NOTICE` 26 พ.ค. 2558.

**The core is a trapezoid with one arm reaching north-west up ดอยจอมทอง** — the arm's tip is the
core's northernmost point, which is the hill, not a wall corner. Build from the ring, not from the
bounding box.

**The wall line survives in the street grid, and ONEP drew its boundary on it** (median distance
from every point of the OSM way to the core ring): ถนนสิงหไคล **5 m**, ถนนบรรพปราการ **11 m**,
ถนนพหลโยธินสายใน on the east edge at lon ≈ 99.8405. ถนนอุตรกิจ (183 m), ถนนธนาลัย (218 m) and
ถนนไตรรัตน์ (148 m) are inside the town, not the wall.

**The moat survives as water.** OSM way 991206435, named **คูเมืองเชียงราย**, sits a median 9 m from
the core ring along the south-west corner, with สะพานประตูเชียงใหม่ still crossing it.

## 2. Water

| river | real width (m) | units | notes |
|---|---|---|---|
| แม่น้ำกก | **~110** (measured) | **1.4** | flows west → east along the **north** side of the old town, then on to the Mekong at Chiang Saen. The town was founded on its south bank |

- Measured off Esri World Imagery at z19, perpendicular to the local river bearing, at every
  centreline vertex across the old town: median **107 m**, range 50–145, widening to ~140 m at the
  east end. **Below Gemini's 120–160.** Table in `chiangrai_field.md` §1.
- **It does not pass through the walls.** The centreline has 8 points inside the ONEP outer
  boundary and **none inside the core** — it grazes the north edge and leaves.
- เกาะลอย is new ground the river itself made when it changed course (ณัฐกร วิทิตานนท์ 2564) — a
  beat the diorama can show.

## 3. Story (pass 2, after the Gemini research, 60 s, storyline standard)

The deep-research pass is kept verbatim in `chiangrai_research_gemini.md`. Its links are Google
search wrappers, not the pages themselves, so every claim below carries **my** check status:
- **ยืนยันแล้ว:** I found it independently;
- **Gemini เท่านั้น:** cited by Gemini, not yet found by me; the issue asks the owner's agent to open
  the cited page;
- **ขัดแย้ง:** sources disagree.

### 3a. Hero options (the owner picks)

| | hero at frame 0 | moves | identity | callback at the payoff |
|---|---|---|---|---|
| **B** | พญามังราย's runaway ช้างมงคล, giant, crossing the tile to ดอยจอมทอง | walks, trumpets | the founding legend; the elephant is on the Mangrai monument's base (Gemini) | the monument (2507) at today's ห้าแยกพ่อขุน, its elephant |
| **N** | a golden พญานาค rising from the Kok and digging the town's north moat, stopping as the sun comes up | coils, digs, dives | local legend เจี้ยผีนาค; the street กองนาค (Gemini only) | the Kok at the payoff; the นาค at Wat Phra Kaeo / the 2567 flood is not a callback to use |
| **A** | วัดร่องขุ่น at hero scale, the hands rising | hands rise, glints | national icon | the temple, 2540 → today |
| **G** | two giant กว่าง fighting on a bamboo perch, then pull out to the tile | lock horns | the province's beetle-fighting sport, the football club's nickname | the club or the festival — `[weak]` |

My order: **B** (closest to Korat, the only hook that worked, with an honest callback),
then **N** (the most surprising), then **A**.

### 3b. Beats (proposal)

| s | beat (kind) | on screen | check |
|---|---|---|---|
| 0–3 | cover | the hero | |
| 3–8.5 | พ.ศ. 1805 (arrive) | Mangrai's men follow the elephant; a ring of earth walls goes up round ดอยจอมทอง | year: traditional, widely repeated; elephant: **legend** (caption ตำนานเล่าว่า) |
| 9–18 | พ.ศ. 1977 (procession) | a storm, lightning splits the chedi at วัดป่าเยียะ, the green image shows through the plaster; the elephant procession turns away from Chiang Mai three times, toward Lampang | **attributed** (รัตนพิมพวงศ์, ชินกาลมาลีปกรณ์); the misprint พ.ศ. 1897 is common — use 1977 |
| 19–27 | พ.ศ. 2347 → 2386 (disaster → arrive) | the town emptied, forest closes over walls and temples; then a caravan of about 1,000 families, elephants, carts, clears it and raises a square wall with 12 gates | 12 gates **ยืนยันแล้ว** (ThaiJO); 2386 **ยืนยันแล้ว**; abandoned 2347, "39 years", 1,000 families **Gemini เท่านั้น** |
| 28–34 | พ.ศ. 2460 → 2469 (build / arrive) | the walls come down and a street grid is cut (after cholera, on Dr Briggs' advice), then the first aeroplane lands | Briggs in Chiang Rai 2446–2461 **ยืนยันแล้ว**; the wall demolition and "first provincial airfield 2469" **Gemini เท่านั้น** |
| 35–44 | (grow) | wide shot: the town spreads south and east, the Mangrai monument (2507), the bridges over the Kok | monument 31 มี.ค. 2507 **Gemini เท่านั้น** |
| 45–54 | พ.ศ. 2566 (celebrate) | City of Design: the gold clock tower lit, crowds, art installations; the hero back | 31 ต.ค. 2566 **ยืนยันแล้ว** |
| 54–56 | → 2569 (today) | counter lands | |

- **Out, or the owner's call:**
  - **The 1942 bombing: ขัดแย้ง.** Gemini says 22 ก.พ. 2485, 3 aircraft, 20+ dead.
    [ww2norththailand](https://www.ww2norththailand.com/chiang-rai/chiang-rai-area-air-facilities-review/)
    says 10 ก.พ. 2485, 6 RAF Lysanders, 14 dead. A tragedy with civilian dead either way.
  - **Disasters:** the 2557 earthquake and the 2567 flood (14 dead).
- **Sub lines (no beat):** เวียงเชียงรอย before Mangrai (legend); the move to Fang and to Chiang Mai;
  ถ้ำพระ and its prehistoric site (excavated 2474, **Gemini only**); บ้านดำ 2519; ดอยตุง 2531;
  วัดร่องเสือเต้น; Thailand Biennale 2566.
- **Tagline (provincial slogan, Gemini, to confirm):** "เหนือสุดในสยาม ชายแดนสามแผ่นดิน ถิ่นวัฒนธรรม
  ล้านนา ล้ำค่าพระธาตุดอยตุง" → finale sub e.g. **"เหนือสุดในสยาม"**.
- **Traps (Gemini, sensible):**
  - Two different men called ธรรมลังกา: the เจ้าหลวงเชียงใหม่ of 2347 and Chiang Rai's first เจ้าหลวง of 2386.
  - พญามังราย, not พ่อขุนเม็งราย, in captions.
  - Mangrai's death is 1854 or 1860: avoid putting it on screen.
  - There are two clock towers (2510 and 2548–51).
  - Credit the ไทเขิน, ไทลื้อ and ไทใหญ่ who re-founded the town.

## 4. Landmarks

Pins confirmed against OSM objects, pass 3 (issue #54). Full table, with the offset from each
Gemini pin, in `chiangrai_field.md` §2.

| name | where | pin | appears |
|---|---|---|---|
| ดอยจอมทอง (พระธาตุ, เสาสะดือเมือง) | hill on the Kok's south bank, west of the centre; Mangrai's เวียง | 19.915725, 99.822768 | before 1262; สะดือเมือง 2530–31 |
| ดอยงำเมือง (กู่พญามังราย) | next hill, south-east of Chom Thong | 19.912669, 99.825093 | after ~1311 |
| วัดพระแก้ว | south-east foot of ดอยจอมทอง | 19.911662, 99.827016 | chedi 1977; ก่อนหน้านั้นชื่อ วัดป่าเยี้ยะ |
| วัดกลางเวียง | centre of the 2386 town | 19.910743, 99.832357 | 2386 |
| หอนาฬิกาทอง (เฉลิมชัย) | on the old ประตูหวาย, i.e. on ถนนบรรพปราการ = the south wall line | 19.907163, 99.830989 | finished **2551** |
| หอนาฬิกาเก่า | 350 m north of the gold one, same street | 19.910257, 99.830604 | — |
| อนุสาวรีย์พญามังราย | ห้าแยกพ่อขุน, east of the old town | 19.910446, 99.840104 | **เปิด 31 มี.ค. 2507** |
| เกาะลอย | north-east of the town, in the Kok | 19.915811, 99.836097 | ground the river made |
| กลางแม่น้ำกก เหนือเมือง | under สะพานพญามังราย | 19.918110, 99.832433 | — |
| **วัดร่องขุ่น** | **12.16 km, bearing 216° — south-WEST, not south**, `far` | **19.823983, 99.762866** | 2540 |
| สนามบินเก่าเชียงราย | 2.64 km due south of the old town | 19.889691, 99.827621 | **2466** |
| ท่าอากาศยานแม่ฟ้าหลวง | 6.77 km north-east | 19.950647, 99.881760 | 2535 |

- **The 2386 wall: confirmed against the ONEP map** — north-east along ถนนสิงหไคล (5 m),
  east along ถนนพหลโยธินสายใน, south along ถนนบรรพปราการ (11 m), and the surviving คูเมือง
  on the south-west corner (9 m). All three streets Gemini named are real boundary edges.
- **Gates: 12–13, not a firm 12.** สุรพล ดำริห์กุล 2549 via ณัฐกร วิทิตานนท์ 2564 describes the
  rebuilt town as **รูปทรงสี่เหลี่ยมคางหมู** with กำแพงอิฐ, ป้อมปราการ, a moat all round and
  ประตู 12–13 แห่ง, extended eastward. "สิบสองประตู" on screen only if the caption does not claim
  the number is exact.

## 5. Terrain and palette

- ดอยจอมทอง is a low hill inside the town. Mountains (ดอยตุง, the Thai–Myanmar range) only as a
  backdrop at the tile's north and west edges.
- Lanna green, the Kok's brown water; whites and silver for the payoff.

## 6. Sound (code only)

Lanna palette: สะล้อ, ซึง, ปี่จุม, กลองสะบัดชัย, ฆ้อง (the khlui / pi / gong / drum voices in
`synth.py`), plus elephant footfalls, a storm and lightning for the 1434 beat.

## 7. Open questions

1. ~~The hero.~~ **A, วัดร่องขุ่น** (owner, 20 ต.ค. 2569). It opens the clip at hero scale and returns in the payoff, which becomes "เชียงรายเมืองศิลปะ": the temple (2540) at the tile's south edge, the gold clock tower, the City of Design (2566).
   **Cover camera: the three-quarter view from the south-west** (`CHIANGRAI_QUARTER` in
   `src/styleframes/chiangrai.tsx`, owner): the whole tile at frame 0, the golden building and the Kok
   beyond. The hero shrinks into the ground at ~2–3.5 s, before the first caption.
2. ~~Disaster beats.~~ **Out** (owner; `docs/storyline.md` §3.6a): the 2485 bombing, the 2557 earthquake and the 2567 flood.
3. ~~The ONEP old-town polygon; the Kok's width; pins for every landmark in §4.~~ **Done, pass 3**
   (issue #54) — `chiangrai_onep/README.md` and `chiangrai_field.md`.
4. ~~The years of abandonment under Burma, and the Lampang procession year.~~ **The procession is
   settled: พ.ศ. 1977 the lightning and the find, พ.ศ. 1979 the elephant to Lampang — two events,
   two years, and §3b merges them.** The length of the abandonment is **still disputed**: 2347–2386
   (39 years) against สำนักงานพาณิชย์จังหวัด's "เกือบร้อยปี … ฟื้นฟู 2384". **2386 and
   เจ้าหลวงธรรมลังกา and ~1,000 families are confirmed**; do not put a number of years on screen.
5. ~~The provincial slogan's exact wording.~~ **Confirmed at สำนักงานพาณิชย์จังหวัดเชียงราย**,
   word for word as Gemini had it.
6. **New, from pass 3 — §3b needs editing:** the airfield is **2466, not 2469**; the street grid is
   **2438 (ถนนธนาลัย)**, a decade before the wall came down over **2450–2460**; the cholera year is
   2460 but the "walls demolished on Briggs' advice" link is still Gemini's alone. Details in
   `chiangrai_field.md` §3.
