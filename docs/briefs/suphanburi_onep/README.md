# ONEP, OSM and terrain — สุพรรณบุรี

Extracted 27 ตุลาคม 2569 for PR #73 on a Thai connection. Files in this folder:
- `suphanburi_oldtown.geojson`: the two ONEP records, WGS84.
- `suphanburi_osm.geojson`: every feature used below, each tagged with its OSM id. Pins that come from Google Maps are marked `source = Google Maps (not OSM)`.
- `suphanburi_overlay.jpg`: the features drawn on Esri World Imagery. Magenta is ONEP zone 1, yellow ONEP zone 2, cyan the OSM moats, blue the Tha Chin centreline, red the in-town bridges, orange the pins, and w1–w4 the width sections. The white bar is 1 km.

**Origin.** All x/z are metres from **ศาลเจ้าพ่อหลักเมืองสุพรรณบุรี**, OSM node 14109371999,
**14.4784865, 100.1110566** (x east, z south). Google's pin "ศาลหลักเมืองสุพรรณบุรี" is 41 m west of
it, inside the same OSM shrine compound (way 221308438), so either works. Ground heights come from
the AWS terrarium tiles (SRTM-based): ~19 m pixels at zoom 13 near the town, ~74 m at zoom 11 out to
30 km. Read them to ±5 m.

## Item 1: ONEP has two records

`oldtown_all.shp` (the same file as for Phetchabun, dated 10 May 2023) has **เมืองเก่าสุพรรณบุรี**,
OT_CODE 15, PROV_CODE 72. Its gazette dates are AGREE 2015-05-12, NOTICE 2015-05-26 and
subcommittee 2017-02-22.

| zone | ONEP AREA | measured | bbox lat | bbox lon | x | z |
|---|---|---|---|---|---|---|
| 1 พื้นที่เมืองเก่า (1 ring, 105 pts) | 3.81657 km² | 3.815 km² | 14.46092–14.49459 | 100.10455–100.11941 | -701..900 | -1780..1942 |
| 2 พื้นที่ต่อเนื่อง (outer ring with zone 1 as a hole, 428 pts) | 1.23808 km² | 5.053 − 3.815 = 1.238 km² | 14.46035–14.49523 | 100.10372–100.12102 | -791..1074 | -1851..2006 |

Zone 1 is the moated town: a tall rectangle about **1.4 km east–west by 3.7 km north–south**. It
follows the moats on the west, north and south, and the Tha Chin on the east (overlay). Zone 2 is a
band about 100–200 m wide around it. The pillar sits inside zone 1, a little west of centre: the mean
of zone 1's vertices is at (132, 57).

## Item 2: pins

| place | source | lat, lon | x, z | distance, direction | ground m |
|---|---|---|---|---|---|
| ศาลเจ้าพ่อหลักเมืองสุพรรณบุรี (origin) | OSM node 14109371999 | 14.478487, 100.111057 | 0, 0 | — | 10 |
| ↳ Google pin "ศาลหลักเมืองสุพรรณบุรี" | Google Maps | 14.478568, 100.110685 | -40, -9 | 41 m west | 10 |
| วัดพระศรีรัตนมหาธาตุ (compound) | OSM way 896912004 | 14.480154, 100.113030 | 213, -184 | 0.28 km north-east | 11 |
| ↳ historic building in the compound (the prang area) | OSM way 905357563 | 14.480519, 100.113446 | 257, -225 | 0.34 km north-east | 12 |
| ↳ พระวิหาร วัดมหาธาตุ | OSM way 1551271259 | 14.480470, 100.113947 | 311, -219 | 0.38 km north-east | 12 |
| วัดป่าเลไลยก์วรวิหาร | OSM way 905444399 | 14.473958, 100.094777 | -1755, 501 | 1.82 km west-south-west, **outside the moat** | 10 |
| วัดแค (Khun Phaen's tamarind tree) | OSM way 896906752 | 14.487271, 100.117101 | 652, -971 | 1.17 km north-east, on the river bank | 11 |
| หอคอยบรรหาร-แจ่มใส | OSM way 905335902 | 14.470501, 100.118056 | 754, 883 | 1.16 km south-east, **east of the river** | 12 |
| พิพิธภัณฑ์ลูกหลานพันธุ์มังกร | OSM node 3938008182 | 14.478694, 100.111463 | 44, -23 | 50 m east-north-east | 13 |
| อุทยานมังกรสวรรค์ | OSM node 14109371998 | 14.478447, 100.111324 | 29, 4 | 30 m east | 12 |
| วัดพระรูป (old chedi, Mon ubosot) | OSM way 1328382461 | 14.469991, 100.112287 | 133, 939 | 0.95 km south | 12 |
| ศาลากลางจังหวัด (current) | Google Maps | 14.513794, 100.130265 | 2070, -3904 | 4.42 km north-north-east | 18 |
| พิพิธภัณฑสถานแห่งชาติ สุพรรณบุรี | OSM node 14109396212 | 14.516706, 100.132436 | 2304, -4226 | 4.81 km north-north-east | 19 |

The **dragon museum and park are right next to the pillar** (30–50 m): the 135 m dragon wraps
the shrine compound.

**ศาลากลาง (old).** ไม่พบ. Google returns only the current hall, 4.4 km north-north-east beside the
national museum, and OSM has no old provincial hall in town. The research or a Thai source would have
to name the old site.

### Wall, moat and forts

OSM maps **no wall line, but it does map the moat** as water (`water=moat`, traced from Bing):

| OSM | side | x | z |
|---|---|---|---|
| relation 21091899 | west | -672..-463 | 386..1290 |
| relation 21091898 | south | -687..300 | 1315..1931 |
| way 1328382505 | short south-east piece | 309..416 | 1330..1369 |
| relation 21091949 | north-west | -359..-230 | -1324..-572 |
| relation 21091950 | north | -257..702 | -1760..-1027 |

On the overlay the moat makes small loops at the corners and along the west side: those are the
bastions. Google has four related pins, all single points:

| place | lat, lon | x, z |
|---|---|---|
| กำแพงเมืองและประตูเมือง | 14.475480, 100.107004 | -437, 332 |
| คูเมืองและกำแพงเมือง | 14.474811, 100.106941 | -444, 406 |
| กำแพงเมืองโบราณ (south side) | 14.461918, 100.109327 | -186, 1832 |
| ป้อม คูเมือง ด้านทิศเหนือ | 14.493881, 100.113507 | 264, -1702 |

So the restored wall and gate are on the **west side, 0.55 km west-south-west of the pillar**, and a
fort stands at the middle of the north moat.

### Don Chedi and U Thong

| place | source | lat, lon | x, z | distance, direction |
|---|---|---|---|---|
| พระบรมราชานุสรณ์ดอนเจดีย์ (King Naresuan monument) | OSM node 14111613114 | 14.633412, 100.020642 | -9745, -17131 | **19.7 km north-north-west** |
| พระเจดีย์ยุทธหัตถี ดอนเจดีย์ (OSM "King Naresuan Memorial Chedi") | OSM way 98150448 | 14.633471, 100.021275 | -9677, -17137 | 19.7 km north-north-west, 70 m east of the monument |
| เจดีย์ยุทธหัตถี, ต.ตะพังตรุ อ.พนมทวน จ.กาญจนบุรี (the rival site) | Google Maps | 14.059003, 99.681634 | -46285, 46384 | 65.5 km south-west |
| พิพิธภัณฑสถานแห่งชาติ อู่ทอง | OSM node 5700717921 | 14.373068, 99.891710 | -23642, 11657 | **26.4 km west-south-west** |
| อู่ทอง town | OSM node 407835770 | 14.376367, 99.896276 | -23150, 11292 | 25.8 km west-south-west |
| เจดีย์โบราณหมายเลข 11, เมืองโบราณอู่ทอง | Google Maps | 14.374368, 99.870422 | -25937, 11513 | 28.4 km west-south-west |

A Google search for "เจดีย์ยุทธหัตถี ดอนเจดีย์" returned the **Kanchanaburi** chedi first, not the one
at Don Chedi: the dispute in the research shows up even in the search. Both sites are outside any
town tile: Don Chedi would need `far: true` at about 20 km.

## Item 3: แม่น้ำท่าจีน

**Centreline**: OSM ways 200087120 + 677682383 + 199998928 (named แม่น้ำท่าจีน), joined with 0 m
gaps. Within 4 km of the pillar it has 141 points over **10.46 km**. Simplified to 8 m, north to south:

```
[704,-3874] [640,-3827] [528,-3702] [476,-3612] [473,-3450] [512,-3396] [576,-3348] [975,-3115] [1027,-3074] [1102,-2983] [1144,-2819] [1143,-2547] [1156,-2467] [1198,-2382] [1249,-2334] [1290,-2318] [1401,-2315] [1653,-2271] [1884,-2182] [1929,-2157] [1978,-2104] [2038,-2008] [2043,-1968] [1929,-1672] [1859,-1581] [1635,-1416] [1446,-1243] [1285,-1130] [832,-963] [698,-931] [653,-902] [580,-811] [528,-675] [515,-509] [534,-412] [611,-305] [795,-173] [866,-54] [887,90] [775,203] [604,273] [440,406] [383,502] [365,687] [411,895] [439,1134] [429,1223] [452,1419] [476,1481] [497,1526] [537,1557] [657,1602] [820,1637] [896,1678] [930,1721] [985,1866] [1015,2081] [1073,2241] [1080,2329] [1058,2397] [1039,2435] [992,2476] [955,2558] [939,2638] [963,2746] [1079,2990] [1074,3140] [1033,3262] [957,3383] [949,3419] [904,3478] [872,3559] [881,3664] [999,3857]
```

The river comes in from the north-east, swings in to touch the town's north-east corner at Wat Khae
(61 m from the centreline), and runs south along the east side of the moated town. The pillar is
**599 m** from it, Wat Mahathat 390 m and Wat Phra Rup 282 m. Banharn-Jamsai Tower is 343 m away, on
the far (east) bank.

**Water width.** Unlike the Pa Sak, OSM has a river water polygon here (way 199998925,
`natural=water` + `water=river`, traced from Bing). These widths are cross-sections of it,
perpendicular to the centreline:

| section | x, z | width |
|---|---|---|
| w1 (north, above the bend) | 1144, -2728 | **70 m** |
| w2 (Wat Khae bend) | 1203, -1098 | **56 m** |
| w3 (east of the pillar) | 618, 268 | **38 m** |
| w4 (south, below the ring road) | 1039, 2435 | **49 m** |

So the Tha Chin is **about 40–70 m wide**, 2–3 times the Pa Sak, and narrowest right beside the
old town.

**Bridges in town** (OSM bridge ways crossing the centreline):

| road | OSM way | crosses at x, z | bridge way length |
|---|---|---|---|
| ถนนมาลัยแมน (two carriageways) | 40230219, 81623766 | 721, -229 / 740, -217 | 130 m, 141 m |
| ถนนพลายชุมพล | 200091043 | 410, 883 | 99 m |
| ถนนม้าสีหมอก | 200091046 | 432, 1252 | 397 m (includes its approaches) |
| ถนนนางแก่นแก้ว | 527926668 | 610, 1577 | 80 m |
| ถนนวงแหวนรอบเมือง (two carriageways) | 200089069, 200089081 | 880, 3538 / 885, 3526 | 630 m |

## Item 4: terrain

**Flat, as expected.** Within 3 km the ground is 3–15 m (median 8 m). On the four diagonals, and
north, south and east, it never reaches 50 m within 32 km.

The first high ground is to the **west**, at the edge of the U Thong hills:
- ground passes 50 m at 28.2 km due west and 100 m at 28.8 km;
- summits about 30 km out: **237 m** at (-29700, 2270), 29.8 km west; **227 m**, 30.0 km west;
  **205 m** at (-26887, 12492), 29.6 km west-south-west, above U Thong; 143 m, 29.3 km west;
- a little farther: 381 m at 36.9 km west, and 275 m at 32.1 km west-north-west.

OSM has no named peak in this area. From the town, then, the horizon is flat all round, with a low
line of hills about 30 km west, behind U Thong.
