# City brief — Lampang / ลำปาง

Status: research pass 1 (2026-10-17), written in the cloud container. It reaches web
search but not Google Maps, OSM or any ONEP host (`www.onep.go.th` and `nced.onep.go.th`
both refuse), so the footprint and the pins were open at the time. **Since then:** the ONEP zone
and the pins are done (§7.1, §7.3) and the city is built (`src/cities/lampang/`); the เขลางค์ wall
is still an approximate ellipse, not traced (§1). Every date
carries its source and a confidence level. Nothing marked [unknown] is to be guessed.

## 0. What the Korat numbers say about the story

Korat v2's retention curve (Instagram, one day in): ~67% still watching at 3 s (skip 32.9%),
then **down to ~35% by 17 s**, then nearly flat to ~21% at 59 s. The loss is in seconds
3-17. In Korat those are dinosaurs, Ban Prasat, Sema and Phimai: archaeology, no people, the
camera drifting over forest. Once the town and the armies arrive (18 s+) people stay.

So for Lampang: **the first beat after the title has to have people and motion in it**, and
the legend gets 4-5 s, not 8. The hero stands on the tile at frame 0 (experiment 1).

## 1. Wall footprint

**The ONEP boundary is in the repo.** `docs/briefs/lampang_onep/lampang_oldtown.geojson`
is the official เมืองเก่าลำปาง polygon, 99 points, already in WGS84 lat/lon -- it converts
straight to `city.outline` with no projection step. See that folder's README for provenance.

- **Source:** ONEP publishes one combined archive for all 36 towns, not one file per town:
  https://www.onep.go.th/data/oldtown.rar (`oldtown_all.shp/.dbf/.prj`) indexed from
  https://www.onep.go.th/open-data-oldtown/, plus https://www.onep.go.th/data/thai-oldtown.csv.
  Both hosts answer normally from a Thai connection; it is `nced.onep.go.th` that 403s.
- **Measured off the polygon:** centroid **18.297291, 99.501963**; bounding box
  **3,389 m east-west x 2,576 m north-south**; shoelace area **3.798 km2**, against
  ONEP's own `AREA` field of 3.824 and the CSV's 3.804 -- the same polygon within rounding.
  Extremes: N 18.30794, 99.50936 / S 18.28465, 99.49532 / E 18.30269, 99.51407 /
  W 18.28952, 99.48180.
- **Announced** ครม. 9 พ.ย. 2553, เขต 13 ธ.ค. 2553, group 1 (CSV).

**This polygon is the conservation zone, not the wall.** At 3.8 km2 it is four times the
~600 rai (0.96 km2) the wall circuit is credited with. The two still need separating:

- **Which wall:** [unknown]. The ONEP zone covers ground holding both the first-generation
  เขลางค์ town on the north bank and the later river-front quarter on the south, so it does
  not settle the question on its own. Tracing the เขลางค์ oval off satellite is still to do.
- **Which bank -- answered: both, and the river runs through the zone.** Testing the OSM
  course of the Wang (way 234994042) against the polygon, **26 of its points fall inside
  it**, entering at 18.30299, 99.51319 in the north-east and leaving at 18.29234, 99.49136
  in the west. Landmarks split cleanly either side:

  | on the **north** bank | on the **south** bank |
  |---|---|
  | วัดพระแก้วดอนเต้า (273 m from the river) | กาดกองต้า (112 m) |
  | ประตูม้า (410 m) | หอนาฬิกา (318 m) |
  | บ้านเสานัก (204 m) | |

  วัดศรีชุม, the station and Central Lampang are all south of the river **and outside** the
  old-town polygon.
- **Secondary figures kept for the wall itself:** ~600 rai (~0.96 km2), ~4,400 m round,
  earth with timber, gates ประตูม้า / ประตูท่านาง / ประตูป่อง, described as oval; เวียงละกอน
  south-west of the older เขลางค์ (tci-thaijo husocetc 63658). 600 rai on a 4,400 m perimeter
  fits an oval of roughly 1.6 x 0.75 km, about 20 x 9 units. **Sanity check only.**

## 2. Water

| river | real width (m) | units | notes |
|---|---|---|---|
| แม่น้ำวัง (Wang) | **35-60 m, about 50 m at the bridge** | ~0.6 | runs **north-east to south-west** through the old-town zone, not north to south |

Width measured off Google Maps satellite at **0.283 m/pixel** (z19, checked against the 20 m
scale bar) with each cut corrected for the river's **17 deg diagonal** near the bridge:
59 m and 48 m upstream of รัษฎาภิเศก, 39 m and 35 m at and below it. The wider readings are
the pool above the weir.

**Three points along the Wang through the city** (OSM way 234994042):
18.30299, 99.51319 -> 18.29594, 99.51300 -> 18.29047, 99.47726.

**Does the Wang pass through the walls?** It passes through the **ONEP old-town zone** --
see section 1. Whether it crosses the เขลางค์ **wall circuit** depends on tracing that
circuit, which is still open. What is known so far points to the wall sitting on the north
bank with the river as its southern edge, which would mean no water gate; do not build one
until the wall line is traced.

- Teak logs floated down the Wang damaged the bridge repeatedly (tatnews 2019).

## 3. Story beats (proposal, 60 s)

| CE | พ.ศ. | event on screen | confidence | source |
|---|---|---|---|---|
| ~680 | ~1223 | hunter เขลางค์ leads the hermits; an oval earth wall rises on the Wang (legend: Chamadevi has the city built for her son เจ้าอนันตยศ) | **legend**: "ตามตำนาน", one provincial plan gives พ.ศ. 1223 | dusit.ac.th Lampang plan PDF; silpa-mag p=7691 |
| 1436-1468 | 1979-2011 | an elephant carries พระแก้วมรกต into Lampang; it stays 32 years at วัดพระแก้วดอนเต้า, then leaves for Chiang Mai under Tilokarat | dates **confirmed** (silpa-mag); the "elephant refused to go to Chiang Mai" story is **legend**, not found in a source yet | silpa-mag p=143479 |
| 1732 | 2275 | **the hero beat**: Thao Mahayot's army camps inside the walled วัดพระธาตุลำปางหลวง; หนานทิพย์ช้าง slips in and shoots him; the army breaks. Bullet holes still in the brass railing round the chedi | event **confirmed** in several Thai sources; year **attributed**: Thai Wikipedia gives his reign as พ.ศ. 2275-2302 (another source says he took the throne in 2279) | matichon region 4087052; silpa-mag 35036; th.wikipedia พระยาไชยสงคราม (ทิพย์ช้าง) |
| 1774 | 2317 | กาวิละ (Lampang) and พระยาจ่าบ้าน go over to Siam (5 Feb 1774); the Lampang army marches north with Taksin's to take Chiang Mai from the Burmese | **confirmed** (en.wikipedia Kawila / Phraya Wichianprakarn); Thai sources also give 2314 for the first plot | en.wikipedia Phraya_Wichianprakarn |
| 1890s-1900s | 2430s-2440s | teak: rafts of logs down the Wang, Burmese and Shan foresters, the Burmese-style วัดศรีชุม | Wat Si Chum **disputed**: 1890 (Thairath, lovethailand) vs ~1900 (silpa-mag); keep the date in the sub as "ราว" or drop it | thairath 2753800; silpa-mag 35351 |
| 1916 | 2459 | **1 April 1916** the first train reaches Lampang (then the northernmost station); horse carriages come with the railway | train **confirmed**; carriages-in-1916 **single source** (Bangkok Post) -> sub line, no date | en.wikipedia Nakhon Lampang station; bangkokpost 307841 |
| 1917 | 2460 | สะพานรัษฎาภิเศก rebuilt in its present form after logs wrecked earlier versions (first built 1894) | **confirmed** (two sources) | tatnews 2019 |
| 1955-57 | 2498-2500 | kaolin found at แจ้ห่ม; Chinese potters start the ชามตราไก่ kilns | **two years in the sources**: 2498 kaolin found, ~2500 first factory | trueid; amarintv 228185 |
| 1950s-1978 | | Mae Moh: the open-pit lignite mine and power plant, 25 km east | dates **[unknown]** -- need EGAT's own history page | greenpeace (location/scale only) |
| 2026 | 2569 | the modern city at night, horse carriages on the bridge | -- | -- |

- **Hero at frame 0 (owner's pick, 2026-10-17):** a Lampang horse carriage at hero scale on the
  usual forest tile, the way Korat's dinosaurs stood on theirs; it comes back at real size in
  the 1916 railway beat. No rewind, no modern city in the opening (style frames in
  `src/styleframes/lampang.tsx`: elephant, chedi, rewind and carriage were tried). The real
  build needs a better horse model (the style-frame one reads as a llama up close) and the
  opening camera no closer than ~100 to it.
- **Era labels:** หริภุญชัย / ล้านนา / พม่า / เจ้าเจ็ดตน / สยาม / ปัจจุบัน (draft).
- **Clip duration:** 60 s. 75 s only if the 1732 shooting and the 1774 march both need room.

## 4. Landmarks (placed: `src/cities/lampang/places.ts`)

วัดพระแก้วดอนเต้า (+ วัดพระธาตุดอนเต้า), วัดพระธาตุลำปางหลวง (~18 km SW of the city, walled
temple -> `far: true`), สะพานรัษฎาภิเศก, สถานีรถไฟนครลำปาง, วัดศรีชุม, บ้านเสานัก, ประตูม้า
(surviving wall section), กาดกองต้า (old riverside market street), แม่เมาะ (far, east).

## 5. Terrain

Lampang sits in a basin ringed by mountains. **Khun Tan range, west: ดอยขุนตาล, 1,304 m** --
the highest point of ทิวเขาขุนตาน, on the Lamphun/Lampang line, in อุทยานแห่งชาติดอยขุนตาล
(Thai Wikipedia / DNP). Its summit (ย.4, ม่อนส่องกล้อง) was a wartime lookout **specifically
because the town of Lampang is visible from it**, which is a gift for a backdrop shot. Park
pin: 18.49569, 99.27109 (Google Maps, "Doi Khun Tan National Park") -- that is the park, not
the summit; the summit pin is [unknown].

Hills to the east, around Mae Moh: name and height [unknown].

## 5a. Real coordinates

All from Google Maps unless noted, read off the place URL (`!3d<lat>!4d<lon>`), with the
pin's own name quoted so the match can be checked.

| place | lat | lon | pin |
|---|---|---|---|
| old-town centre (ONEP polygon centroid) | 18.29729 | 99.50196 | computed, section 1 |
| ประตูม้า | 18.30192 | 99.50694 | **"Thanon Pratoo Mah"** -- Maps pins the *street*, not the gate. Treat as +/- 100 m until someone pins the wall section |
| วัดพระแก้วดอนเต้าสุชาดาราม | 18.30096 | 99.50828 | "Wat Phra Kaew Don Tao Suchadaram" |
| วัดพระธาตุลำปางหลวง | 18.21731 | 99.38935 | "WAT PHRA THAT LAMPANGLUANG" -- 15.5 km SW of the centre, `far: true` |
| สะพานรัษฎาภิเศก | 18.29325 | 99.50076 | "Ratsada Phisek Bridge" |
| สถานีรถไฟนครลำปาง | 18.27979 | 99.47295 | "Nakhon Lampang" |
| วัดศรีชุม | 18.28440 | 99.49973 | "Wat Srichum" |
| บ้านเสานัก | 18.29410 | 99.50805 | "Baan Sao Nak" |
| กาดกองต้า | 18.29161 | 99.49941 | "Kad Kongta Night Market" |
| เหมืองแม่เมาะ | 18.30204 | 99.73989 | "อาคารที่ทำการเหมืองแม่เมาะ" (mine office, not the pit centre) -- 25 km E, `far: true` |
| โรงไฟฟ้าแม่เมาะ | 18.29634 | 99.73999 | "ป้ายโรงไฟฟ้าแม่เมาะ" (the sign) -- `far: true` |
| Central Lampang | 18.28185 | 99.49458 | "Central Lampang" |
| หอนาฬิกา | 18.28888 | 99.49090 | "Clock Tower Intersection" |
| ดอยขุนตาล (park) | 18.49569 | 99.27109 | "Doi Khun Tan National Park" -- park, not summit |
| a point on the Wang | 18.29594 | 99.51300 | OSM, inside the old-town zone |

## 6. Sound

Lanna palette: สะล้อ ซอ ซึง, กลองสะบัดชัย for the 1732 beat; elephant bells; a steam whistle
in 1916; horse hooves and carriage bells from 1916 on; kiln roar for the bowls.

## 7. Open questions

1. **ONEP outline -- done.** Shapefile found, converted, committed; see section 1. What is
   still missing is the **wall circuit** as distinct from the conservation zone.
2. **The Wang -- done.** ~50 m at the bridge, course through the zone, both banks occupied.
   Still open: whether the river crosses the เขลางค์ wall line itself.
3. **Pins -- done**, section 5a, with one weak one: ประตูม้า is a street pin, not the gate.
4. **The year of the shooting -- 2275 is the one that fits.** Thai Wikipedia's
   พระยาไชยสงคราม (ทิพย์ช้าง) gives his reign as **พ.ศ. 2275-2302**, with ท้าวมหายศ as his
   predecessor; he took the throne by killing him, so 2279 would fall four years *into* his
   own reign. This is reasoning from the regnal dates, not a source that states the date of
   the shot -- say ราว พ.ศ. 2275 in the caption.
5. **Mae Moh -- from EGAT's own history page** (egat.co.th/home/maemoh-pp-about-2):
   - surveying from **พ.ศ. 2460** finds lignite at Mae Moh
   - **2470** Rama VII reserves the country's coal for state use
   - **2497** the government creates องค์การพลังงานไฟฟ้าลิกไนท์ and **opens the Mae Moh mine**,
     selling lignite to tobacco-curing barns, the railway and cement works
   - 2511/2512 EGAT is formed and takes the mine over
   - **17 สิงหาคม 2515** construction starts on the first three 75 MW units
   - **7 กุมภาพันธ์ 2528** the King formally opens the power station
   The commissioning year of unit 1 is **[unknown]** -- EGAT's page gives the construction
   start and the royal opening, not the first sync. Use 2497 for the mine and 2515 for
   "the power station begins" unless someone finds the unit-1 date.
6. **วัดศรีชุม -- disputed, 2433 vs 2436.** The Ministry of Tourism and several listings say
   **พ.ศ. 2433**, built by the Burmese merchant จองตะก่าอูโย; Thai Wikipedia says **พ.ศ. 2436**.
   Caption should say ราว พ.ศ. 2433. **Also worth knowing for the model:** its viharn **burned
   down on 16 มกราคม พ.ศ. 2535** and what stands today is a reconstruction -- an 1890s wooden
   viharn should not be shown intact in a 2026 frame.
7. ~~Whether the elephant/Emerald Buddha story should be told as legend or left out.~~ **Built:**
   the white elephant carries the image in through ประตูม้า; the caption keeps to the dated facts.
8. Name and height of the hills east of the city, around Mae Moh.
