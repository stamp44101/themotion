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

Khon Kaen is **not a walled town**: Bueng Bon village was raised to a town in 1797 with no
recorded wall or moat. [check whether Khon Kaen is among ONEP's 36 old towns; if not, there is
no official polygon.] The old core is around **บึงแก่นนคร** (formerly บึงบอน). The engine
always draws a city wall today: a wall-less town needs an engine option (`city.walls: false`)
before the build -- flag for the engine pass.

## 2. Water

| water | real size | notes |
|---|---|---|
| บึงแก่นนคร | [unknown] -- measure on Google Maps | the lake the town grew round; renamed from บึงบอน under Sarit (Chula thesis) |
| แม่น้ำพอง / เขื่อนอุบลรัตน์ reservoir | [unknown] | ~50 km NW [check], far |

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

The Khorat plateau is flat round the city; ภูเวียง (a ring-shaped range, far west) and the hills
by the dam are the only relief. Heights [unknown].

## 5a. Real coordinates -- all [unknown]

city centre / บึงแก่นนคร, พระมหาธาตุแก่นนคร, the station, ศาลหลักเมือง, KKU, Central Khon Kaen,
two points on Mittraphap, เขื่อนอุบลรัตน์, ภูเวียง dinosaur museum / pit, พระธาตุขามแก่น.

## 6. Sound

Isan palette: แคน (khaen) and พิณ, โปงลาง; a steam whistle in 1933; trucks on Mittraphap; water
rising at the dam; a dinosaur roar at frame 0.

## 7. Open questions

1. Is there an ONEP old-town polygon for Khon Kaen? If not, the town extent off Google Maps.
2. Pins and the lake's size (§5a, §2).
3. A source for the age of the Phu Wiang beds (~130 Ma?).
4. Engine: a town with no wall (`city.walls: false`).
