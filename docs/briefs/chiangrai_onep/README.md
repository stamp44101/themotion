# ONEP old-town boundary — เมืองเก่าเชียงราย

Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (all announced old towns in
one shapefile, WGS84 degrees — `oldtown_all.prj` is copied here unchanged). Records 7 and 8 of 62,
`OT_NAME = เมืองเก่าเชียงราย`. Extracted 20 ตุลาคม 2569 for issue #54.

The cloud container gets a 403 from ONEP; this was pulled on a Thai connection.

## Chiang Rai is a donut, not a single polygon

This is the first city in the series where ONEP published **two** features. Record 7 is a polygon
with a hole in it; record 8 is that hole, published again as its own polygon. Both carry the same
`ZONE_DETAI = พื้นที่เมืองเก่า`.

| | ring | area |
|---|---|---|
| **core** (record 8, and the hole in record 7) | 66 points | **1.2526 km²** |
| **surrounding zone** (record 7, outer ring minus the core) | 96 points | **2.9347 km²** |
| **everything inside the outer edge** | | **4.1873 km²** |

The shoelace areas agree with the shapefile's own `AREA` fields (2.93733 and 1.25381) to within
0.1%.

`chiangrai_oldtown.geojson` holds both records unmodified: record 7 as a Polygon with an outer
ring and a hole, record 8 as a single-ring Polygon.

## Attributes as published

| field | value |
|---|---|
| `OT_NAME` | เมืองเก่าเชียงราย |
| `PROVINCE` | จ.เชียงราย |
| `GROUP` | กลุ่มที่ 2 |
| `AGREE` | 20150512 — มติคณะรัฐมนตรี 12 พฤษภาคม 2558 |
| `NOTICE` | 20150526 — ประกาศ 26 พฤษภาคม 2558 |
| `subcommitt` | 20170222 |

## Geometry, measured from this file

### The outer edge (what the tile should cover)

| | |
|---|---|
| centroid | **19.913421, 99.830424** |
| bounding box | 19.904624 – 19.923908 N, 99.816269 – 99.844837 E |
| bounding box in metres | **2,990 m E–W × 2,132 m N–S** |
| extreme N | 19.923908, 99.822202 |
| extreme S | 19.904624, 99.839570 |
| extreme E | 19.920262, 99.844837 |
| extreme W | 19.917625, 99.816269 |

### The core (the walled town)

| | |
|---|---|
| centroid | **19.910348, 99.830185** |
| bounding box | 19.906423 – 19.916791 N, 99.821607 – 99.840376 E |
| bounding box in metres | **1,964 m E–W × 1,146 m N–S** |

The core is not a rectangle. It is a **trapezoid with one arm reaching north-west up ดอยจอมทอง** —
the arm's tip is the core's northernmost point (19.916791, 99.822608), which is the hill, not a
wall corner. Read the ring in `chiangrai_oldtown.geojson` rather than the bounding box.

## The wall line survives, and the ONEP boundary is drawn on it

Each of the three streets named in the pass-2 brief was tested against the core ring: every point
of the OSM way, nearest distance to the ring, in metres.

| street | points | median distance to the core edge | verdict |
|---|---|---|---|
| **ถนนสิงหไคล** | 67 | **5 m** (p10 1, p90 13) | on the boundary — the north-east side |
| **ถนนบรรพปราการ** | 132 | **11 m** (p10 3, p90 30) | on the boundary — the south side |
| **ถนนพหลโยธิน (สายใน)** | 17 of 122 within 25 m | the stretch 19.9068–19.9107 N, lon ≈ 99.8405 | on the boundary — the east side |
| ถนนอุตรกิจ | 76 | 183 m | inside the town, not the wall |
| ถนนธนาลัย | 72 | 218 m | inside the town, not the wall |
| ถนนไตรรัตน์ | 29 | 148 m | inside the town, not the wall |

**The moat is still there.** OSM way 991206435 is tagged `natural=water`, named **คูเมืองเชียงราย**,
and its 26 points sit a **median 9 m** from the ONEP core edge — the south-west corner, from
about 19.908913, 99.823794 down to the corner at 19.9068, 99.8245 and east along the south line to
99.8276. The ONEP boundary and the surviving water are the same line.

Also on that corner: **ถนนประตูเชียงใหม่** and **สะพานประตูเชียงใหม่**, the bridge that still
crosses the moat at the Chiang Mai gate, plus three nodes named ประตู 1, ประตู 2, ประตู 3.

## The Kok

The river's OSM centreline (way 40191691) has **8 points inside the outer boundary and none inside
the core**. It enters the zone at 19.917662, 99.816479 and leaves at 19.919543, 99.842847 — so it
grazes the zone's north edge and never crosses the walls. The town sits beside the river, as the
brief assumed.
