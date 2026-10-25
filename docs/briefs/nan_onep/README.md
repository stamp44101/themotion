# ONEP old-town boundary, OSM and terrain — เมืองเก่าน่าน

Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (all announced old towns in
one shapefile, WGS84 degrees — `oldtown_all.prj` is copied here unchanged). Nan is **announced**, in
the first group: records 22 and 23 of 62, `OT_NAME = เมืองเก่าน่าน`, `OT_CODE = 1`, `PROV_CODE = 55`.
Extracted 25 ตุลาคม 2569 for PR #70 on a Thai connection (the cloud container gets a 403 from ONEP).

`nan_oldtown.geojson` holds both records unmodified. `nan_osm.geojson` holds the OSM features used
below, each with its OSM id. `nan_overlay.jpg` draws them on Esri World Imagery: yellow = ONEP
polygons, white = surviving city wall, blue = river centreline, cyan = riverbank, red = the three
town bridges, orange = pins, pink triangles = hilltops from the terrain model.

## Item 1: what ONEP actually publishes for Nan

**There is no continuous zone (พื้นที่ต่อเนื่อง) record for Nan, and no polygon for the walled city.**
Both records are `ZONE_DETAI = พื้นที่เมืองเก่า`, and both are small pockets around temples:

| field | record 22 | record 23 |
|---|---|---|
| what it covers | วัดพระธาตุแช่แห้ง on its hill, east of the river | the temple core: ภูมินทร์, ช้างค้ำ, หอคำ, ข่วงเมือง, มิ่งเมือง |
| `AREA` | 0.118374 | 0.18929 |
| `GROUP` | กลุ่มที่ 1 | กลุ่มที่ 1 |
| `AGREE` | 2005-09-20 — มติคณะรัฐมนตรี 20 กันยายน 2548 | same |
| `NOTICE` | 2006-03-24 — ประกาศ 24 มีนาคม 2549 | same |
| `subcommitt` | 2015-02-03 | same |
| `Master_pla` | 1899-12-30 (empty date) | same |
| `reg_name` | ภาคเหนือ | same |

`AREA` is km² here (it matches the shoelace area). So the published "old town" is two islands of
0.12 and 0.19 km², about 2.9 km apart, not the 1.5–2 km walled town. Build the town from the wall
and the OSM pins below; use these two polygons only as the "heritage core" highlights.

## Geometry, measured from this file

| | record 23 (temple core) | record 22 (แช่แห้ง) |
|---|---|---|
| area (shoelace) | **0.189 km²** | 0.118 km² |
| centroid | **18.775818, 100.771412** | 18.758667, 100.791204 |
| bbox, degrees | 18.773624 – 18.778475 N, 100.768237 – 100.774983 E | 18.756640 – 18.760725 N, 100.789478 – 100.792874 E |
| bbox, metres | 711 E–W × 536 N–S | 358 × 452 |
| perimeter | 2,273 m | 1,264 m |
| vertices | 31 | 32 |

All x/z below are metres from the **record 23 centroid** (18.775818, 100.771412), x east, z south.
Ground heights come from the AWS terrarium terrain tiles (SRTM-based, ~18 m pixels at zoom 13), so
read them to ±5 m.

Record 23, simplified to 4 m: `[-330,-97] [-57,-115] [-53,-179] [19,-186] [26,-294] [130,-242] [129,-150] [205,-105] [355,-64] [376,49] [215,25] [203,54] [182,172] [54,216] [54,243] [17,239] [-17,153] [-51,145] [-111,181] [-134,180] [-207,154] [-271,158] [-279,52] [-335,53]`

Record 22, simplified to 4 m (a near-circle round the stupa hill): `[1904,1852] [1920,1821] [2001,1733] [2047,1694] [2101,1669] [2122,1669] [2198,1706] [2226,1732] [2227,1767] [2249,1816] [2259,1864] [2262,1923] [2255,1957] [2239,1994] [2153,2074] [2103,2110] [2070,2121] [2040,2115] [1954,2070] [1932,2049] [1923,2024] [1925,1921]`

## Item 2: pins from OSM

| place | OSM | lat, lon | x, z | ground m |
|---|---|---|---|---|
| วัดภูมินทร์ | way 246657153 | 18.774602, 100.771631 | 23, 134 | 205 |
| หอคำ (พิพิธภัณฑสถานแห่งชาติน่าน) | way 246667329 | 18.776202, 100.770714 | -74, -42 | 207 |
| วัดพระธาตุช้างค้ำวรวิหาร (temple ground) | way 246814232 | 18.776454, 100.772052 | 67, -70 | 207 |
| องค์พระธาตุช้างค้ำ (the chedi itself) | way 1489166430 | 18.776419, 100.772033 | 65, -66 | 207 |
| วัดมิ่งเมือง (the city pillar, เสาหลักเมือง, stands here) | way 246657160 | 18.774941, 100.769120 | -242, 97 | 203 |
| ข่วงเมืองน่าน | way 246657148 | 18.775220, 100.771589 | 19, 66 | 207 |
| ศาลากลางจังหวัดหลังเดิม | way 246668574 | 18.776198, 100.774016 | 274, -42 | 205 |
| คุ้มเจ้าราชบุตร | way 1035604648 | 18.777625, 100.772032 | 65, -200 | 204 |
| วัดน้อย (ruins) | node 13650010082 | 18.776007, 100.771377 | -4, -21 | 204 |
| วัดศรีพันต้น | way 247183242 | 18.776168, 100.765758 | -596, -39 | 202 |
| วัดสวนตาล | way 247050757 | 18.784308, 100.773989 | 272, -939 | 205 |
| วัดพระธาตุแช่แห้ง (temple ground) | way 545986811 | 18.758699, 100.791179 | 2083, 1893 | 220 |
| องค์พระธาตุแช่แห้ง | node 3205822866 | 18.758252, 100.791709 | 2139, 1942 | 216 |
| วัดพระธาตุเขาน้อย | way 1089031375 | 18.769549, 100.750679 | -2185, 693 | 295 |
| ท่าอากาศยานน่านนคร (centre of the aerodrome area) | way 247767587 | 18.808407, 100.783986 | 1325, -3603 | 211 |
| อนุสาวรีย์เรือแข่ง ("Nan Racing Boat", by the river) | node 6341405386 | 18.775840, 100.779949 | 900, -2 | 202 |

**City pillar.** OSM has no separate node for ศาลหลักเมือง. Nan's เสาหลักเมือง is inside วัดมิ่งเมือง,
so use the วัดมิ่งเมือง pin.

**Khao Noi.** The temple sits at ~295 m; the highest terrain pixel within 400 m is **299 m**. The town
floor is 200–207 m, so Khao Noi stands **~95 m above the town**, 2.3 km west-south-west.

**แช่แห้ง** sits on a low rise at 216–220 m, ~15 m above the paddy around it, 2.9 km south-east,
across the river.

## City wall and gates

What survives in OSM is **one stretch on the north side only**:

- relation 14535423 `กำแพงเมืองเก่าน่าน` (wall = brick, wikidata Q113685991): two thin closed outlines,
  `[-304,-517] [-312,-565] [-213,-580] [-173,-565] [-54,-486]` (≈300 m) and `[-40,-482] [30,-439]` (≈85 m).
  As one line, the wall runs **from about (-312,-565) to (30,-439), ~390 m, heading east-north-east
  then east-south-east**, ~500 m north of ข่วงเมือง.
- way 247186583 is the park (historic = yes) wrapped round that stretch.
- Nodes 6342597387 and 6342597388 ("Old City Wall", historic = monument) sit on it.

No wall on the west, south or east sides is mapped, and no gate is mapped as a gate. Two traffic
lights keep the gate names: **แยกประตูปล่องน้ำ** (node 483033834, x,z -294, -502, at the west end of
the surviving wall) and **แยกประตูน้ำเข้ม** (node 483033260, x,z 378, -156, towards the river).
The rest of the circuit will have to come from the research.

## Item 3: แม่น้ำน่าน

The river runs **north to south along the east side of the town**, then bends west round the south.
It is closest to the temple core at the bridge, ~0.9 km east of ข่วงเมือง.

Centreline, way 310184178 (`Nan River`), clipped to 4.2 km from the origin, simplified to 8 m,
north to south:

`[2588,-3278] [2589,-3142] [2504,-2926] [2367,-2713] [2178,-2527] [2126,-2431] [2070,-2266] [2066,-1925] [2085,-1424] [2066,-1378] [1864,-1080] [1497,-706] [1248,-376] [1155,-132] [969,32] [660,199] [421,431] [360,558] [272,817] [186,922] [55,982] [-482,1122] [-552,1210] [-569,1274] [-550,1520] [-528,1616] [-497,1709] [-413,1770] [-370,1870] [-379,2035] [-92,2677] [-89,2798] [-120,2915] [-205,2970] [-401,2997] [-460,3035] [-538,3159] [-615,3433] [-592,3562] [-612,3692] [-799,3915] [-942,3971] [-1036,3976] [-1120,3941] [-1264,3849] [-1336,3835] [-1447,3838] [-1542,3874] [-1550,3886]`

Width, measured across the riverbank multipolygon (relation 1154567) perpendicular to the centreline:

| at x, z | width | water level (terrain) |
|---|---|---|
| 2088, -1492 (north, by the airport) | 36 m | ~202 m |
| 969, 32 (at the สะพานพัฒนาภาคเหนือ crossing) | **70 m** | ~200 m |
| -550, 1520 (south bend) | 59 m | ~198 m |
| -401, 2997 (far south) | 117 m | ~196 m |

Bridges in town:

| bridge | OSM | x, z of middle | length | ends |
|---|---|---|---|---|
| สะพานพัฒนาภาคเหนือ (main bridge, by the racing-boat monument) | way 40134381 | 873, 107 | 284 m incl. approaches | (963,217) – (783,-3) |
| สะพานศรีบุญเรือง | way 103919338 | 125, 964 | 154 m | (123,1040) – (127,887) |
| สะพานนครน่านพัฒนา (north) | way 95763062 | 2079, -2125 | 162 m | (2002,-2150) – (2155,-2099) |

**Boat races.** OSM maps no race course. Its only race item is the racing-boat monument (node
6341405386) on the west bank by สะพานพัฒนาภาคเหนือ, so where the course runs is left to the research.

## Item 4: hills around the town

**OSM maps no peak or hill node within 10 km of Nan.** The table below comes from the terrain tiles:
local maxima over a 600 m window, within 6 km, higher than 230 m. They are unnamed in OSM.

| height | x, z | lat, lon | direction |
|---|---|---|---|
| **386 m** | -3112, 3575 | 18.74348, 100.74188 | 4.7 km south-west |
| 312 m | -4216, -3343 | 18.80606, 100.73141 | 5.4 km north-west |
| **299 m (Khao Noi)** | -2226, 682 | 18.76965, 100.75029 | 2.3 km west-south-west |
| 295 m | -1882, -5212 | 18.82295, 100.75356 | 5.5 km north-north-west |
| 295 m | -4270, 4025 | 18.73942, 100.73090 | 5.9 km south-west |
| 283 m | -2986, -4206 | 18.81386, 100.74308 | 5.2 km north-west |
| 282 m | -4071, -2607 | 18.79939, 100.73278 | 4.8 km west-north-west |
| 280 m | -1140, -5500 | 18.82555, 100.76059 | 5.6 km north |
| 276 m | -3058, 1329 | 18.76380, 100.74240 | 3.3 km west-south-west |
| 274 m | -2931, 1760 | 18.75990, 100.74360 | 3.4 km south-west |

Everything higher than 230 m is **west** of the town. The valley floor is 196–208 m, so these are
low hills, 70–180 m above the town. The east is flat paddy to 5 km: the terrain only reaches 232 m at
5 km east and 242 m at 6 km. The big ranges that frame Nan in photos lie beyond 6 km.

Profiles (x or z in km : ground m):
- west–east through the origin: `-6:208 -5:217 -4:218 -3:228 -2:218 -1:200 0:204 1:198 2:204 3:213 4:219 5:232 6:242`
- north–south through the origin: `-6:219 -5:224 -4:220 -3:206 -2:208 -1:200 0:204 1:201 2:204 3:204 4:202 5:198 6:204`
