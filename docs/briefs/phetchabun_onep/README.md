# ONEP, OSM and terrain — เพชรบูรณ์

Extracted 27 ตุลาคม 2569 for PR #72 on a Thai connection. `phetchabun_osm.geojson` holds every feature
used below, each tagged with its OSM id. Where OSM is missing a place, the pin comes from Google Maps
and is marked `source = Google Maps (not OSM)`. `phetchabun_overlay.jpg` draws them on Esri World
Imagery: blue = the Pa Sak centreline, cyan = an unnamed side channel, red = the in-town bridges,
orange = pins, white bar = 1 km.

**Origin.** ONEP has no polygon for Phetchabun, so there is no ONEP centroid to measure from. All x/z
below are metres from **ศาลหลักเมืองเพชรบูรณ์**, OSM node 2322827369, **16.4209739, 101.1600819**
(x east, z south). Ground heights come from the AWS terrarium terrain tiles (SRTM-based): ~18 m pixels
at zoom 13 near the town, ~73 m at zoom 11 for the ranges. Read them to ±5 m near town and ±20 m on
the ranges.

## Item 1: ONEP has no record for Phetchabun or Si Thep

`oldtown.rar` was downloaded again today (HTTP 200, 185,916 bytes; the files inside are dated
10 May 2023). `oldtown_all.shp` has **62 records covering 36 towns. None is Phetchabun or Si Thep.**
No record has `PROVINCE` เพชรบูรณ์ or `PROV_CODE` 67, and neither name appears anywhere in the
attributes or in `oldtown_all.shp.xml`.

So there is **no ONEP footprint, no polygon of the walled town, no bbox and no area** to give. This
folder has no `*_oldtown.geojson` for that reason. Si Thep's World Heritage boundary is in OSM
instead (relation 21473979, see item 2).

## Item 2: pins

| place | source | lat, lon | x, z | distance, direction | ground m |
|---|---|---|---|---|---|
| ศาลหลักเมืองเพชรบูรณ์ (origin) | OSM node 2322827369 | 16.420974, 101.160082 | 0, 0 | — | 119 |
| วัดมหาธาตุ (พระอารามหลวง) | OSM way 1456688280 | 16.420741, 101.155265 | -514, 26 | 0.52 km west | 123 |
| วัดไตรภูมิ (พระพุทธมหาธรรมราชา) | Google Maps | 16.422673, 101.161512 | 153, -188 | 0.24 km north-east | 121 |
| ↳ same temple: an unnamed OSM temple node, 15 m away | OSM node 12643408767 | 16.422802, 101.161542 | 156, -202 | | 121 |
| อนุสาวรีย์ "เพชรบูรณ์ เมืองมะขามหวาน" | OSM node 13359552141 | 16.420509, 101.159697 | -41, 51 | 70 m south-west | 119 |
| หอวัฒนธรรม นครเพชรบูรณ์ | OSM way 1456688285 | 16.420620, 101.159329 | -80, 39 | 90 m west-south-west | 117 |
| ประเพณีอุ้มพระดำน้ำ (ceremony site) | Google Maps | 16.429102, 101.163123 | 325, -899 | 0.96 km north-north-east | 117 |
| ศาลากลางจังหวัดเพชรบูรณ์ อาคาร 1 | Google Maps | 16.439473, 101.154208 | -627, -2046 | 2.14 km north-north-west | 124 |
| ↳ OSM building "Goverment Phetchabun", same compound | OSM way 570524189 | 16.439742, 101.154357 | -611, -2075 | | 126 |
| ท่าอากาศยานเพชรบูรณ์ | OSM node 997259131 | 16.675859, 101.190508 | 3249, -28184 | **28.4 km north** (in อ.หล่มสัก) | 116 |

**Wat Traiphum** is only 124 m from the river centreline. The ceremony pin is on the west bank, on
the bend just below the bridge at (320, -1018).

**อุ้มพระดำน้ำ.** OSM maps nothing for the ceremony. The Google Maps place "ประเพณีอุ้มพระดำน้ำ" is
the only pin, so check it against the research. A Google search for "วังมะขามแฟบ" returned a place
in อ.บึงสามพัน (15.8775, 100.8621), which is a different place, so that result was not used.

### City wall and gates

**OSM maps no city wall, gate or moat for Phetchabun** (no `barrier=city_wall`, nothing named
กำแพง, ประตูเมือง or คูเมือง). Google Maps has three related places, all as single points (no line):

| place | lat, lon | x, z |
|---|---|---|
| แนวกำแพงเมืองเก่าเพชรบูรณ์ | 16.425356, 101.159086 | -106, -485 |
| หอนิทรรศน์กำแพงเมืองเพชรบูรณ์ (exhibition hall) | 16.423494, 101.161996 | 204, -279 |
| วัดประตูดาว (the name keeps a gate) | 16.423576, 101.164772 | 501, -288 |
| ซุ้มประตูนครบาลเพชรบูรณ์ (a modern arch on the main road, not an old gate) | 16.418148, 101.152137 | -848, 312 |

So the wall's remains are about 0.5 km north of the pillar, inside the river bend. The circuit and the
gates will have to come from the research.

### Si Thep

| place | OSM | lat, lon | from the city pillar |
|---|---|---|---|
| อุทยานประวัติศาสตร์ศรีเทพ (park area) | way 396662119 | 15.467273, 101.146918 | **105.5 km south** |
| ปรางค์ศรีเทพ | node 13361358227 | 15.466209, 101.145534 | 105.6 km south |
| โบราณสถานเขาคลังใน | way 1116101631 | 15.465605, 101.144658 | 105.6 km south |
| เขาคลังนอก | way 1214453689 | 15.487017, 101.144223 | 103.3 km south |
| เมืองโบราณศรีเทพ และโบราณสถานสมัยทวารวดีที่เกี่ยวข้อง (World Heritage boundary) | relation 21473979 | — | — |

Si Thep is **~105 km due south** of the town, not next to it, so it can't be in the same diorama as
the town. Google returned the wrong place for "เขาคลังใน" (15.4104, 101.1249), so the OSM way above is
used instead.

## Item 3: แม่น้ำป่าสัก

The Pa Sak runs **north to south along the east side of the old town**. It swings west into a tight
bend round the wall area and Wat Traiphum, then runs south-south-east past the town. It passes 283 m
east of the city pillar at its nearest point.

Centreline from OSM ways 126616194 + 126616156 (`แม่น้ำป่าสัก`), clipped to 4.2 km from the origin,
simplified to 8 m, north to south (11.8 km of river):

`[1485,-3917] [1475,-3882] [1343,-3669] [1188,-3277] [1183,-3224] [1141,-3169] [1083,-3012] [1069,-2929] [1074,-2865] [1126,-2679] [1109,-2517] [1098,-2488] [1038,-2457] [1016,-2414] [1013,-2339] [942,-2066] [926,-1871] [857,-1654] [832,-1636] [749,-1622] [689,-1587] [601,-1581] [567,-1566] [512,-1514] [510,-1443] [548,-1410] [546,-1294] [526,-1282] [450,-1294] [416,-1274] [324,-1162] [311,-1124] [330,-924] [310,-871] [282,-864] [249,-874] [197,-914] [160,-907] [147,-889] [179,-473] [161,-433] [60,-427] [32,-408] [26,-388] [38,-297] [66,-276] [275,-220] [418,-140] [499,-194] [562,-190] [732,-91] [746,122] [739,159] [683,236] [682,292] [711,293] [848,226] [928,255] [970,294] [960,395] [1031,526] [1062,653] [1055,833] [1049,868] [961,972] [937,1028] [926,1137] [987,1231] [1045,1403] [1087,1428] [1157,1442] [1192,1444] [1237,1426] [1259,1438] [1313,1508] [1320,1536] [1315,1561] [1278,1588] [1261,1618] [1246,1706] [1193,1745] [1153,1903] [1088,1990] [962,2003] [938,2023] [932,2061] [951,2104] [994,2141] [1001,2172] [995,2212] [952,2299] [1027,2579] [978,2679] [981,2732] [1023,2757] [1093,2751] [1135,2784] [1156,2912] [1234,3023] [1228,3056] [1180,3071] [1107,3054] [1062,3074] [1037,3341] [1008,3408] [986,3421] [943,3410] [901,3342] [874,3322] [840,3314] [785,3342] [755,3441] [764,3595] [709,3656] [694,3753] [673,3780] [399,3836] [287,3780] [215,3790] [183,3841] [188,3926] [179,3956] [120,4006] [100,4078] [85,4093] [13,4115] [9,4135]`

The OSM line is drawn loosely in places. At (311, -1124) it sits ~20 m off the water, so treat it as
±20 m.

**Width.** OSM has **no riverbank polygon** here, so the widths below were measured by eye on Esri
imagery at zoom 18 (~0.6 m pixels, with a 25 m tick grid), water edge to water edge, ±5 m:

| at x, z | water width | water level (terrain) |
|---|---|---|
| 311, -1124 (north, by the bridge at z ≈ -1020) | ~15–20 m (banks overgrown) | ~117 m |
| 60, -427 (the bend round the wall area) | **~26 m** | ~115 m |
| 746, 122 (east of the pillar) | ~26 m | ~115–124 m |
| 1037, 3341 (south) | ~22 m | ~114 m |

So the Pa Sak here is a **narrow river, 15–26 m of water**, much narrower than the Nan at Nan (70 m).
The in-town bridges agree: their decks run 46–55 m, including the approaches.

**Bridges over the Pa Sak** (OSM bridge ways that cross the centreline; none is named in OSM):

| OSM | road | crosses at x, z | deck way length |
|---|---|---|---|
| way 111973489 | residential | 1079, -2986 | 75 m |
| way 578196749 | residential | 875, -1706 | 17 m |
| ways 930986759 + 930986761 | secondary (pair) | 320, -1018 / 318, -1032 | 55 + 53 m |
| way 126615383 | ถนนหลักเมือง | 177, -577 | 52 m |
| way 126615380 | unclassified | 211, -237 | 46 m |
| ways 570964307 + 570964309 | secondary (pair) | 544, -193 / 554, -191 | 49 + 49 m |
| way 126615379 | tertiary | 924, 1113 | 47 m |
| way 126615388 | ถนนเพชรเจริญ | 1151, 2873 | 106 m |

**Side channel.** Unnamed OSM `waterway=river` way 570963896 runs from (190, 133) to (604, -170),
just south-east of the pillar, and meets the Pa Sak at the bend. It may be an old moat or an old
course of the river. Check it against the research before drawing it as a moat.

## Item 4: hills and the Phetchabun ranges

**There is no hill within 6 km of the town.** The basin floor within 3 km is 110–135 m (median 118 m).
The highest ground within 6 km is a few low rises 145–151 m high, 5.6–6 km north-west and
west-south-west, only ~30 m above the floor. OSM maps no peak within 12 km.

The town sits in the middle of a **flat north–south basin**, with real mountains on both sides:

| bearing | ground first > 250 m | first > 500 m | highest within 40 km |
|---|---|---|---|
| west | 11.6 km | 14.4 km | 1,137 m at 16 km |
| north-west | 11.8 km | 16.2 km | 997 m at 26.6 km |
| east | 14.6 km | 19.0 km | 1,241 m at 30.4 km |
| south-east | 16.6 km | 18.8 km | 718 m at 29.6 km |
| south-west | 16.0 km | — | 495 m at 26 km |
| north-east | 27.2 km | 29.8 km | 950 m at 39 km |
| north | — | — | 214 m (the basin stays open toward หล่มสัก) |
| south | 16.4 km (one low ridge, 299 m) | — | 299 m |

The **western range** (the Khao Kho side) is the closer and steeper wall: it climbs from the basin to
over 1,000 m between 12 and 16 km west. The **eastern range** (ทิวเขาเพชรบูรณ์) starts at ~15 km and
reaches ~1,200–1,300 m at 26–31 km east.

Highest summits (local maxima over a 4 km window, zoom-11 terrain):

| height | x, z | lat, lon | distance, direction |
|---|---|---|---|
| 1,355 m | -16720, -5603 | 16.4716, 101.0035 | 17.6 km west-north-west |
| 1,347 m | -20093, -13756 | 16.5454, 100.9719 | 24.4 km north-west (OSM peak node 7010403312, ele 1305) |
| 1,321 m | 30497, -1234 | 16.4321, 101.4457 | 30.5 km east |
| 1,318 m | 26465, 4083 | 16.3840, 101.4079 | 26.8 km east |
| 1,314 m | 31304, 805 | 16.4137, 101.4532 | 31.3 km east |
| 1,287 m | -16867, -2836 | 16.4466, 101.0021 | 17.1 km west |
| 1,281 m | 37389, -6404 | 16.4789, 101.5102 | 37.9 km east |
| 1,202 m | 28298, -17613 | 16.5803, 101.4251 | 33.3 km east-north-east |
| 1,117 m | -18040, 6705 | 16.3603, 100.9911 | 19.2 km west-south-west |
| 1,103 m | 23899, 9255 | 16.3373, 101.3839 | 25.6 km east-south-east |

Named peaks in OSM: เขาผ้าขาว (node 3970808986), 19.8 km west, ~1,160 m on the terrain;
เขากวาง (node 3970808984), 18.7 km north-west, ~870 m; เขาย่า (node 3970808987), 25.5 km north-west,
~1,265 m.

Profiles through the pillar (km : m):
- west–east: `-20:971 -18:1005 -16:1137 -14:428 -12:283 -10:200 -8:167 -6:131 -4:123 -2:123 0:119 2:115 4:119 6:124 8:137 10:148 12:164 14:201 16:404 18:357 20:539 22:521 24:918 26:910 28:1181 30:1185 32:1169`
- north–south: `-20:140 -16:139 -12:145 -8:128 -4:121 0:119 4:115 8:112 12:109 16:192 18:263 20:124 24:123`
