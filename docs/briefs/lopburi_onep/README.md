# ONEP old-town boundary — เมืองเก่าลพบุรี

Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (all announced old towns in
one shapefile, WGS84 degrees — `oldtown_all.prj` is copied here unchanged). Record 48 of 62,
`OT_NAME = เมืองเก่าลพบุรี`, `PROV_CODE = 16`. Extracted 24 ตุลาคม 2569 for PR #67 on a Thai
connection (the cloud container gets a 403 from ONEP).

`lopburi_oldtown.geojson` holds the record unmodified. `lopburi_osm.geojson` holds the OSM features
used below (pins, river, rail, palace wall, forts, ditches), each with its OSM id.

## Attributes as published

| field | value |
|---|---|
| `OT_NAME` | เมืองเก่าลพบุรี |
| `ZONE_DETAI` | พื้นที่เมืองเก่า |
| `PROVINCE` | จ.ลพบุรี |
| `GROUP` | กลุ่มที่ 1 |
| `AGREE` | 20101109 — มติคณะรัฐมนตรี 9 พฤศจิกายน 2553 |
| `NOTICE` | 20101213 — ประกาศ 13 ธันวาคม 2553 |
| `subcommitt` | 20151030 |
| `AREA` | 1.7051 |

One feature, one ring of 95 points, no hole (unlike Chiang Rai).

## Geometry, measured from this file

| | |
|---|---|
| area (shoelace) | **1.7037 km²** (the `AREA` field says 1.7051) |
| centroid | **14.800683, 100.612775** |
| bounding box | 14.793768 – 14.807696 N, 100.604172 – 100.620053 E |
| bounding box in metres | **1,709 m E–W × 1,540 m N–S** |
| extreme N | 14.807696, 100.612179 |
| extreme S | 14.793768, 100.619499 |
| extreme E | 14.795630, 100.620053 |
| extreme W | 14.797714, 100.604172 |

**This is not Gemini's shape.** The draft brief guessed a strip along the river, 500–850 m E–W by
1,800–2,200 m N–S. The announced zone is roughly as wide as it is tall, and its west edge is on the
far (west) bank: the river runs through the zone, not along its edge.

All x/z below are metres from the centroid, x east, z south (the engine's axes before scaling).

## Pins: Gemini (brief §5) vs OSM

| place | OSM | OSM position | Gemini off by | x, z (m) |
|---|---|---|---|---|
| พระปรางค์สามยอด | way 1011171287 | 14.802923, 100.614076 | 9 m | 140, -248 |
| ศาลพระกาฬ | way 1128114911 | 14.802278, 100.615034 | 9 m | 243, -176 |
| วัดพระศรีรัตนมหาธาตุ | way 196252384 (site outline) | 14.798644, 100.613946 | **92 m** | 126, 225 |
| ปรางค์แขก | node 2066042913 | 14.802289, 100.611711 | 2 m | -115, -178 |
| พระนารายณ์ราชนิเวศน์ | way 40634521 (the museum compound) | 14.799839, 100.610796 | 22 m | -213, 93 |
| บ้านวิชาเยนทร์ | way 40632293, tagged **บ้านหลวงรับราชทูต** | 14.803050, 100.610215 | 21 m | -276, -262 |
| วัดสันเปาโล | node 6773612485 | 14.795017, 100.619584 | 20 m | 733, 627 |
| สถานีลพบุรี | way 881081030 | 14.798571, 100.615253 | 30 m | 267, 234 |
| วงเวียนสระแก้ว | node 14188561438 (unnamed monument at the circle) | 14.799672, 100.634202 | 3 m | 2306, 112 |

Every pin is within 30 m except วัดพระศรีรัตนมหาธาตุ, whose Gemini point sits 92 m east of the
middle of the site, on the station side; use the OSM centre. วงเวียนสระแก้ว is **2.3 km east of the
centroid, 1.6 km outside the zone**: it is the new town, and will not fit on a tile scaled to the
old town.

บ้านวิชาเยนทร์ is mapped under its other name, บ้านหลวงรับราชทูต; they are the same compound.

### More on OSM that the build can use

| place | OSM | x, z (m) |
|---|---|---|
| palace wall (`historic=citywalls`, closed ring) | way 1539990196 | x -387..-76, z -11..232 (≈ 310 × 245 m) |
| พระที่นั่งดุสิตสวรรค์ธัญญมหาปราสาท | node 11696403770 | -296, 113 |
| พระที่นั่งสุทธาสวรรย์ | node 11696393578 | -292, 173 |
| ตึกพระเจ้าเหา | node 14184934767 | -146, 195 |
| สิบสองท้องพระคลัง / ตึกเลี้ยงรับรองแขกเมือง | nodes 14185007561 / 11696354568 | ≈ -150, 90 |
| ประตูชัย | way 1539990211 | 173, 604 |
| ป้อมท่าโพธิ์ (on the river, north) | way 877960809 | -34, -724 |
| ป้อมชัยชนะสงคราม (south-east) | way 1539990210 | 498, 633 |
| วัดนครโกษา | node 14021939655 | 294, -56 |
| ถนนคูเมือง (pedestrian) | way 140628484 | ≈ -232, -387 |
| ค่ายสมเด็จพระนารายณ์มหาราช (army, outside the zone) | way 1306721492 | 1029, -576 |

## แม่น้ำลพบุรี

The river comes in from the **west along the north edge** (OSM way 571946579, z ≈ -560 to -600),
turns at the north-west corner of the town (-512, -535) and runs **south-south-west past the palace**
(way 986386580). Centreline, metres:

`[-1361,-559] [-775,-602] [-655,-601] [-564,-582] [-512,-535] [-463,-461] [-446,-392] [-475,-279] [-532,-79] [-584,174] [-658,545] [-774,941]`

A second channel (way 196480893) comes down from the north and joins at (-446, -392).

Width, measured across the OSM riverbank polygon (way 196480898) on lines of constant z:

| z | -500 | -300 | -100 | 0 | 100 | 200 | 400 | 600 |
|---|---|---|---|---|---|---|---|---|
| width (m) | 80 | 52 | 55 | 52 | **62** | 61 | 72 | 72 |

At the palace (z ≈ 100) the river is **about 60 m wide**, its east bank at x ≈ -525: **≈ 140 m of
ground between the palace's west wall and the water.** Gemini's 55–80 m holds.

## The wall and moat line

OSM has **no city wall line** for the town, only the palace wall above. What survives on the map:

- **North:** a chain of ditches (`waterway=stream`, ways 957378673, 957378674, 957378671) leaves the
  river at (-445, -802) and runs east along z ≈ -770 to -1,040. The ONEP north edge is at z ≈ -775,
  so the ONEP boundary follows this ditch — probably the old north moat (not tagged as one).
  ป้อมท่าโพธิ์ stands on this corner.
- **East:** two long thin ponds, way 1233532258 (x 404–641, z -657 to -160, ~29 m wide) and way
  1233532259 (x 567–650, z -68 to 648, ~17 m wide), run north–south in a line inside the zone's east
  edge. They look like the east moat in pieces; they are tagged only `natural=water`.
- **South:** ประตูชัย (173, 604) and ป้อมชัยชนะสงคราม (498, 633) mark the south side.
- ถนนคูเมือง is a short pedestrian street near (-232, -387).

Treat the moat as **unconfirmed**: the shapes fit, but no OSM tag or source here calls them คูเมือง.

## The railway

The Northern Line runs **north–south through the town, east of the prang**, and the station is
inside the zone:

`[409,816] [401,753] [391,688] [376,614] [372,595] [338,430] [285,240] [241,-25] [213,-115] [197,-196] [93,-684] [52,-876] [44,-913] [-105,-1625]`

(ways 881080228, 172908237, 957378676, 957378675.) It passes about 130 m east of พระปรางค์สามยอด
(140, -248) and next to ศาลพระกาฬ (243, -176); the monkeys' corner is right on the line. It crosses
the north ditch at z ≈ -880.

**Opening date: 1 April 1901 (1 เม.ย. 2444), confirmed by two sources.**
- Wikipedia's segment table for the Northern Line gives Ban Phachi – Lopburi as opening 1 April 1901.
- The 1927 *Directory and Chronicle* (p. 1170) gives the same date for the first section, which
  reached Lopburi.

1 April was New Year's Day of ร.ศ. 120 at the time, so 1901-04-01 is 1 เม.ย. 2444 (not 2443).
