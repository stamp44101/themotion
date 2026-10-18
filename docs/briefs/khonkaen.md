# City brief — Khon Kaen / ขอนแก่น

Status: research pass 1 (2026-10-18), cloud container: web search only, no Google Maps, OSM
or ONEP. Footprint, pins and heights are open (§1, §5a, §7). Every date carries its source
and a confidence level; nothing marked [unknown] is to be guessed.

## 0. What the last three clips say (docs/experiments.md)

- Korat (dinosaurs filling the tile at frame 0): skip 32.9%. Nakhon Si (whole tile, relic
  boat a speck): skip 43.1%. The **hero big enough to read on the whole-tile shot** did the work.
- Both clips lose about half their 3-s audience by 17 s, then hold: keep the early beats short
  and moving.
- 75 s loses people in the finale: **60 s** unless the extra time is action.

## 1. Footprint

**Khon Kaen is not one of ONEP's 36 announced old towns, so there is no official polygon.**
Checked against ONEP's own data, not inferred: neither `thai-oldtown.csv` nor the `oldtown_all`
shapefile inside https://www.onep.go.th/data/oldtown.rar contains ขอนแก่น. The 36 are
น่าน, เชียงใหม่, ลำพูน, ลำปาง, พิษณุโลก, กำแพงเพชร, ลพบุรี, พิมาย, นครศรีธรรมราช, สงขลา, แพร่,
เพชรบุรี, จันทบุรี, ปัตตานี, เชียงราย, สุพรรณบุรี, ระยอง, บุรีรัมย์, ตะกั่วป่า, พะเยา, ตาก,
นครราชสีมา, สกลนคร, สตูล, ราชบุรี, สุรินทร์, ภูเก็ต, ระนอง, แม่ฮ่องสอน, กาญจนบุรี, ยะลา,
นราธิวาส, ร้อยเอ็ด, อุทัยธานี, ตรัง, ฉะเชิงเทรา. Note พิมาย and นครราชสีมา are on that list,
so the absence is not "Isan was skipped" -- Khon Kaen simply has no announced old-town zone.

This fits the rest: Bueng Bon village was raised to a town in 1797 with no recorded wall or
moat. There is no circuit to trace because there was none. The engine still draws a wall for
every city, so `city.walls: false` is a real prerequisite for this build, not an optional
nicety -- flag it for the engine pass.

**The old core, from the satellite view:** the town grew on the **west and north-west shore of
บึงแก่นนคร**, where the oldest temples still sit -- วัดหนองแวง / พระมหาธาตุแก่นนคร at the
south-west corner of the lake, วัดกลาง and วัดธาตุ (พระอารามหลวง) on the west shore, the
municipal stadium and the old grid behind them. The modern city then runs north-west from
there to the station, Central, and on to KKU, with the lake left as its south-east edge.

## 2. Water

| water | real size | notes |
|---|---|---|
| บึงแก่นนคร | **about 1,420 m N-S x 550-730 m E-W, water surface ~0.60 km2** | measured, see below. Renamed from บึงบอน under Sarit (Chula thesis) |
| เขื่อนอุบลรัตน์ reservoir | [unknown] | dam wall at 16.77544, 102.61841 -- **46.3 km NNW** of the lake, bearing 330 deg (computed from the pins), so "~50 km NW" was close |

**Lake measurement.** Taken off Google Maps satellite at **2.291 m/pixel** (z16 at this
latitude, checked against the scale bar) by masking the water and measuring the blob:
**1,418 m north-south**, **553 m across at the median row** and **731 m at the widest**,
water area **0.60 km2**. Water centroid **16.41304, 102.83739**; Google's own label pin sits
at 16.41469, 102.83820, which is the north end, not the centre -- **use the centroid for the
layout**.

The ~603 rai (0.96 km2) figure that circulates covers the lake *and* its park ring; the open
water is the 0.60 km2 above. Say which one a caption means.

## 3. Story beats (proposal, 60 s)

| CE | พ.ศ. | on screen | confidence | source |
|---|---|---|---|---|
| ~130 Ma | -- | **hero at frame 0**: a herd of long-necked sauropods on the tile | Phu Wiang's beds are Early Cretaceous; the ~130 Ma figure is **[to verify]** | -- |
| 1976 | 2519 | (sub line on the opening beat) a geologist surveying for uranium finds Thailand's **first dinosaur bone** at ห้วยประตูตีหมา, ภูเวียง; later named *Phuwiangosaurus sirindhornae* | **confirmed** (several Thai sources; name of finder สุธรรม แย้มนิยม) | thaipbs 281667; gotoknow 590696 |
| legend | -- | monks carrying relics to Phanom rest by a dead tamarind stump; on their return it has sprouted; a chedi is built over it -- พระธาตุขามแก่น | **legend** ("ตามตำนาน"); the name ขอนแก่น ← ขามแก่น is **disputed** (The Isaan Record, Jan 2026, argues it is not) -- do not state it | thairath 1482308; theisaanrecord 2026-01-08 |
| 1797 | 2340 | **ท้าวเพียเมืองแพน** leads settlers from สุวรรณภูมิ to บึงบอน; Rama I raises the village to เมืองขอนแก่น | **confirmed** for the year and founder (several sources); the details of the later moves (บ้านดอนพันชาด 27 years ...) **disputed** -- leave them out | th.wikipedia ขอนแก่น / เพียเมืองแพน; kroobannok 12003 |
| 1933 | 2476 | **1 April 1933** the north-eastern line reaches Khon Kaen | **confirmed** (silpa-mag) | silpa-mag p=6780 |
| 1955-57 | 2498-2500 | Mittraphap Highway built by the US from Korat to Nong Khai; named 20 Feb 1957 | **confirmed** (en.wikipedia) | en.wikipedia Mittraphap_Road |
| 1964-66 | 2507-2509 | **Ubolratana dam** on the Phong: the reservoir fills; opened by Rama IX 14 Mar 1966; the first hydro dam of Isan | **confirmed** opening 2509; completion 2508 vs 2509 in sources | bangkokbiznews 1234323; tci-thaijo |
| 1964/66 | | Khon Kaen University (sub line): 1962 institute, 1964 upgrade, 25 Jan 1966 under its present name | **disputed** dates -- sub line without a year, or 2509 | kku guidebook PDF |
| 1996 | 2539 | **พระมหาธาตุแก่นนคร**, 9 tiers, 80 m, at วัดหนองแวง by บึงแก่นนคร, for the city's 200 years | **confirmed** 2539 (sources agree); the spire's model (Kham Kaen vs Phanom) disputed | ktc; thairath 1482308 |
| 2026 | 2569 | the modern city at night | -- | -- |

- **Hero at frame 0** (style frames to choose): a sauropod herd (proven by Korat, and Phu Wiang
  is where Thailand's dinosaurs began) or the legend's tamarind tree, drawn huge, sprouting.
- **Era labels:** ยุคไดโนเสาร์ / ตำนาน / ล้านช้าง-สยาม / ปัจจุบัน (draft).

## 4. Landmarks (pins in §5a)

บึงแก่นนคร, พระมหาธาตุแก่นนคร (วัดหนองแวง), สถานีรถไฟขอนแก่น, ถนนมิตรภาพ, มหาวิทยาลัยขอนแก่น,
เขื่อนอุบลรัตน์ (far), ภูเวียง (far), พระธาตุขามแก่น (far, อ.น้ำพอง).

## 5. Terrain

The Khorat plateau is flat round the city; ภูเวียง (a ring-shaped range, far west) and the
hills by the dam are the only relief.

- **ภูเวียง** is a basin ringed by mountains -- the park's own page calls it
  "เมืองที่มีภูเขาเป็นกำแพงธรรมชาติ", a town walled by mountains, which is a gift for a
  diorama that has no city wall to draw. Park area ~325 km2.
- **Height: ผาชมตะวัน, ~687 m** above sea level (Phu Wiang NP). ⚠️ That is a **viewpoint**,
  not necessarily the range's summit; the highest point of ภูเวียง is **[unknown]**. Do not
  put 687 m on screen as "the summit".
- Hills by the dam: height and name **[unknown]**.

## 5a. Real coordinates

All from Google Maps unless noted, read off the place URL (`!3d<lat>!4d<lon>`), with the pin's
own name quoted so the match can be checked.

| place | lat | lon | pin |
|---|---|---|---|
| บึงแก่นนคร (water centroid) | 16.41304 | 102.83739 | computed from satellite, section 2 |
| บึงแก่นนคร (Google label) | 16.41469 | 102.83820 | "Bueng Kaen Nakhon Reservoir" -- north end, not the centre |
| พระมหาธาตุแก่นนคร / วัดหนองแวง | 16.40943 | 102.83422 | "Wat Nong Waeng Phra Aram Luang" |
| ศาลหลักเมืองขอนแก่น | 16.43108 | 102.82846 | "Khon Kaen City Pillar Shrine (San Lak Mueang)" |
| สถานีรถไฟขอนแก่น | 16.42675 | 102.82576 | "Khon Kaen" station |
| Central Khon Kaen | 16.43317 | 102.82617 | "Central Khon Kaen" |
| มหาวิทยาลัยขอนแก่น | 16.47441 | 102.82202 | "Khon Kaen University" -- 7.0 km N of the lake (bearing 346 deg) |
| บึงทุ่งสร้าง | 16.44923 | 102.85137 | "บึงทุ่งสร้าง" |
| ถนนมิตรภาพ, north of the city | 16.51860 | 102.83240 | OSM way 1550208013, `ถนนมิตรภาพ` ref 2 |
| ถนนมิตรภาพ, south of the city | 16.38960 | 102.81160 | OSM way 1552214095, same road |
| เขื่อนอุบลรัตน์ | 16.77544 | 102.61841 | "Ubol Ratana Dam" -- 42 km NNW, `far: true` |
| พิพิธภัณฑ์ไดโนเสาร์ภูเวียง | 16.67792 | 102.26706 | "Phu Wiang Dinosaur Museum" -- 67 km WNW (bearing 296 deg), `far: true` |
| หลุมขุดค้นที่ 1 ภูเวียง | 16.68312 | 102.22974 | "หลุมขุดที่ 1" -- 4 km west of the museum |
| อุทยานแห่งชาติภูเวียง | 16.69780 | 102.22317 | "Phu Wiang National Park" |
| พระธาตุขามแก่น | 16.56349 | 102.95187 | "Phra That Kham Kaen" -- 21 km NE (bearing 36 deg), `far: true` |

**Mitraphap runs north-south past the city on its west side**, at lon ~102.832 in the north
and ~102.811 in the south (OSM). It does not pass through the old core by the lake -- the same
trap Korat's Mittraphap hit, so route it by the road's own geometry, not to the nearest
landmark.

## 6. Sound

Isan palette: แคน (khaen) and พิณ, โปงลาง; a steam whistle in 1933; trucks on Mittraphap; water
rising at the dam; a dinosaur roar at frame 0.

## 7. Open questions

1. **ONEP polygon -- answered: there is none.** Khon Kaen is not among the 36; see section 1.
   The old core round the lake is described there from the satellite view, but nobody has
   traced corner points for it yet, because there is no wall line to trace. Decide whether
   the city even needs an outline, or whether the lake plus the road grid carries it.
2. **Pins and lake size -- done**, sections 5a and 2.
3. **The Phu Wiang beds -- confirmed, ~130 Ma is right.** The **Sao Khua Formation** is Early
   Cretaceous, **Valanginian to Hauterivian** (en.wikipedia, Sao Khua Formation; same stages
   given on Phuwiangosaurus, the sauropod named for these beds and for Princess Sirindhorn).
   Those stages run roughly **140-126 Ma**, so "about 130 million years" sits inside the
   range and is safe to say. Avoid a single exact number.
4. **Engine: a town with no wall (`city.walls: false`)** -- still open, and now certain to be
   needed: there was never a wall here, and there is no ONEP zone to stand in for one.
5. **KKU's founding date -- both numbers are real, and they count different things.** KKU's
   own site says the royal act establishing the university was promulgated **25 มกราคม
   พ.ศ. 2509** (kku.ac.th). The same site publishes anniversary pieces -- "62 ปี
   มหาวิทยาลัยขอนแก่น" -- whose arithmetic puts the start at **2507**, when teaching began.
   Safest caption: **พ.ศ. 2509** with the act, or say เริ่มเปิดสอน พ.ศ. 2507 if the beat is
   about the first students. Do not mix the two in one line.
6. Height and name of the hills by the dam, and the true summit height of ภูเวียง.
