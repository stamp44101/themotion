# ONEP old-town boundary — เมืองเก่าสุรินทร์

Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (all announced old towns in
one shapefile, WGS84 degrees — `oldtown_all.prj` is copied here unchanged). Surin is **announced**:
records 57 and 58 of 62, `OT_NAME = เมืองเก่าสุรินทร์`, `OT_CODE = 25`, `PROV_CODE = 32`. Extracted
25 ตุลาคม 2569 for PR #69 on a Thai connection (the cloud container gets a 403 from ONEP).

`surin_oldtown.geojson` holds both records unmodified. `surin_osm.geojson` holds the OSM features
used below (pins, ponds, drains, rail), each with its OSM id. `surin_overlay.jpg` draws them on Esri
World Imagery: yellow = ONEP lines, blue = OSM water, white = rail, orange = pins (OSM ids).

## Attributes as published

| field | record 57 | record 58 |
|---|---|---|
| `ZONE_DETAI` | พื้นที่เมืองเก่า | พื้นที่ต่อเนื่อง |
| `AREA` | 3.51014 | 1.06524 |
| `GROUP` | กลุ่มที่ 2 | กลุ่มที่ 2 |
| `AGREE` | 2017-04-10 — มติคณะรัฐมนตรี 10 เมษายน 2560 | same |
| `NOTICE` | 2017-06-12 — ประกาศ 12 มิถุนายน 2560 | same |
| `subcommitt` | 2017-06-29 | same |

Record 58 is a band around record 57: one outer ring of 119 points with record 57 as its hole.
Record 57 is **coarse, 11 points**, a straight-sided polygon, not a traced moat.

## Geometry, measured from this file

| | old-town zone (57) | continuous zone outer edge (58) |
|---|---|---|
| area (shoelace) | **3.490 km²** (`AREA` says 3.510) | 4.549 km² inside the outer ring |
| centroid | **14.885436, 103.486928** | 14.885703, 103.487505 |
| bbox, degrees | 14.874674 – 14.894694 N, 103.474214 – 103.499676 E | 14.873726 – 14.895554 N, 103.473285 – 103.501406 E |
| bbox, metres | 2,739 E–W × 2,214 N–S | 3,025 × 2,414 |
| smallest enclosing rectangle | **2,496 × 1,882 m**, tilted ~32° | 2,696 × 2,204 m |
| perimeter | 7,711 m | |

All x/z below are metres from the **ONEP centroid** (14.885436, 103.486928), x east, z south.

Old-town zone vertices: `[1372,152] [433,1190] [-1368,58] [-1015,-740] [-904,-861] [-809,-974] [-747,-1024] [-399,-875] [1057,-641] [879,-241]`

The zone is the **outer (Khmer-era) rectangle**, not the inner moat: its west and south-west edges
follow the outer ditches (below), and the inner oval sits well inside it, off to the east.

## Item 3: inner-moat size: 1,000 × 1,300 m is right

OSM has **no way tagged moat or city wall** in Surin. What survives is a ring of six ponds inside the
zone, plainly the inner moat in pieces on the imagery (a curved road follows the gaps):

| OSM | x | z | long × wide (m) | side |
|---|---|---|---|---|
| relation 7753001 (reservoir) | -349..-157 | -379..1 | 403 × 66 | west-north-west |
| way 474059412 (reservoir) | -365..-171 | 48..299 | 297 × 56 | west |
| way 474059410 (reservoir) | -163..57 | 323..614 | 322 × 68 | south-west |
| way 293500774 (lake, สวนรัก) | 311..684 | 517..892 | 471 × 113 | south |
| way 542319528 | 816..889 | 34..190 | 155 × 52 | east |
| way 542319529 | 337..435 | -637..-581 | 98 × 48 | north |

Together they span **1,055 × 1,381 m** (smallest enclosing rectangle) and enclose 1.19 km²
(746 ไร่) as a convex hull. That matches the Fine Arts Unit 6 figure Gemini quoted, **≈1,000 × 1,300 m**.

**1,540 × 2,280 m is not the inner moat.** 1,540 × 2,280 = 3.511 km², the ONEP `AREA` of the whole
old-town zone (3.51014) to three digits, so that figure describes the outer town/zone. The "411 ไร่"
quoted with it (0.66 km²) fits neither and should not be used.

Pond widths are 48–68 m (the south lake is wider, 113 m, because it is a park lake). Gemini's
**≈55 m** moat width holds.

Inner moat outline (convex hull of the six ponds, simplified to 20 m): use it as the line of the oval.
The north-east quarter has no surviving water, so the hull is straight there and the real line was
probably rounder:

`[-365,48] [-305,-178] [-183,-379] [357,-637] [432,-617] [879,41] [881,144] [606,674] [400,892] [19,614] [-304,177]`

**Centre of the inner moat: 14.884570, 103.489456 (x 272, z 96).** This is ~280 m east of the ONEP
centroid. For a tile scaled to the inner city, centre `geo.ts` here, not on the ONEP centroid.

## Outer moat: partly confirmed

- **West / south-west:** OSM drains 1128337120 and 1128337122 run ~1 km along the ONEP south-west
  edge (x -1325..-445, z -32..607), with 1128337121 and 1128337123 along the west edge
  (x ≈ -1290..-1110). On the imagery these are a wide, straight ditch: the outer moat. They are
  tagged only `waterway=drain`.
- **East / south-east:** ponds 542319530 (31 m wide) and 542319531 (49 m) sit on the ONEP east edge.
- **North-east:** pond 302121749 (198 × 114 m) is in the continuous zone just outside the corner.
- **North:** the railway runs along the north edge; no ditch survives there on OSM.

Gemini's outer moat width (≈89 m) is **not confirmed**: the surviving pieces are 31–49 m. Treat the
ONEP polygon as the outer line.

## Item 2: pins, Gemini (brief §4) vs OSM

| place | OSM | OSM position | Gemini off by | x, z (m) |
|---|---|---|---|---|
| ศาลากลางจังหวัด (old building, in town) | way 483171858 | 14.882233, 103.492161 | 60 m | 563, 354 |
| อนุสาวรีย์พระยาสุรินทรภักดีฯ (ปุม) | node 6410547185 | 14.878370, 103.489605 | 12 m | 288, 781 |
| ศาลหลักเมือง | way 1415663836 | 14.884593, 103.489222 | 3 m | 247, 93 |
| สถานีรถไฟสุรินทร์ | node 3107829713 | 14.891592, 103.493997 | 10 m | 760, -681 |
| สนามกีฬาศรีณรงค์ (elephant show ground) | relation 18650315 | 14.874945, 103.497130 | 36 m | 1098, 1160 |
| วัดบูรพาราม | node 4759247929 | 14.884386, 103.493151 | 5 m | 670, 116 |
| วัดกลางสุรินทร์ | way 1413605082 | 14.884542, 103.491197 | 12 m | 459, 99 |
| วัดศาลาลอย | node 4759247928 | 14.882077, 103.496141 | **215 m** | 991, 371 |

Every pin is within 60 m except **วัดศาลาลอย**: Gemini's point is 215 m east of the OSM node, outside
the inner moat. Use the OSM point.

The old ศาลากลาง is not the centre of the moat: it sits 300 m east and 260 m south of it,
inside the oval's south-east part. ศาลหลักเมือง (247, 93) is within 30 m of the inner-moat centre.

**The monument is on the inner moat, not the outer one:** (288, 781) is just west of the south lake
(311..684, 517..892). Gemini's "south edge of the inner moat" is right.

**The station is on the zone's north edge:** the ONEP edge passes about 8 m north of the station
node. The railway is the zone's north boundary.

### More on OSM that the build can use

| place | OSM | x, z (m) |
|---|---|---|
| วัดจุมพลสุทธาวาส (south, by the monument) | node 4759247932 | 286, 901 |
| วัดหนองบัว (north-east, inner side) | node 4759247930 | 1012, -138 |
| elephant memorial in front of the station | node 12560576454 | 749, -616 |

## The railway

The North-Eastern Line runs **east–west along the north edge of the zone**, slightly rising to the
east (x, z):

`[-1961,-1100] [-1275,-990] [-601,-893] [1195,-608] [1408,-591]`

(ways 818570392, 818570385, 958248756; station sidings 957814631–3 lie at z ≈ -640.)
The opening date (1 พฤษภาคม 2469 per the Silpa-Mag article Gemini cites) is not checked here.
