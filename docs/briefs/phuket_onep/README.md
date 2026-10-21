# ONEP old-town boundary — เมืองเก่าภูเก็ต

Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (all announced old towns in one
shapefile, WGS84 degrees — `oldtown_all.prj` is copied here unchanged). Records **0 and 1** of 62,
`OT_NAME = เมืองเก่าภูเก็ต`. Extracted 21 ตุลาคม 2569 for issue #58.

The cloud container gets a 403 from ONEP; this was pulled on a Thai connection.

## Two features, and ONEP names them differently from Chiang Rai's

Phuket is a donut like Chiang Rai, but where Chiang Rai's two records both read
`ZONE_DETAI = พื้นที่เมืองเก่า`, Phuket's two are **named as different kinds of zone**:

| | `ZONE_DETAI` | ring | area (measured) | `AREA` field |
|---|---|---|---|---|
| **record 0** — the core | `พื้นที่เมืองเก่า` | 219 points | **2.778 km²** | 2.76438 |
| **record 1** — the ring round it | `พื้นที่ต่อเนื่อง` | 294 points outer, 219 inner | **6.410 km²** | 6.37846 |
| **everything inside the outer edge** | | | **9.188 km²** | |

So the protected thing is a **2.78 km² core with a 6.41 km² continuous zone wrapped round it** —
the core is only 30% of the announced area.

Record 1's inner ring is record 0's ring **exactly**: all 219 points match to the last decimal
(wound the other way). The hole is the core, not an approximation of it.

My spherical measurements sit **+0.49% above both `AREA` fields**, the same offset on both records.
A constant offset on both is a projection difference (ONEP almost certainly computed on a projected
CRS), not a geometry mismatch — the shapes agree.

`phuket_oldtown.geojson` holds both records unmodified: record 0 as a single-ring Polygon, record 1
as a Polygon with an outer ring and a hole.

## Attributes as published

| field | value |
|---|---|
| `OT_NAME` | เมืองเก่าภูเก็ต |
| `OT_CODE` | 26 |
| `PROVINCE` | จ.ภูเก็ต |
| `GROUP` | กลุ่มที่ 2 |
| `AGREE` | 20170410 — มติคณะรัฐมนตรี **10 เมษายน 2560** |
| `NOTICE` | 20170512 — ประกาศ **12 พฤษภาคม 2560** |
| `subcommitt` | 20170629 |
| `reg_name` | ภาคใต้ |

(Chiang Rai, for comparison, was announced two years earlier: มติ ครม. 12 พ.ค. 2558.)

## Geometry, measured from this file

### The outer edge — what the tile has to cover
- bounding box **4,011 × 4,661 m** (lon 98.370905–98.407317, lat 7.860522–7.902442)
- centre **7.881482, 98.389111**
- that centre is **301 m** from the brief's origin, the Charter bank corner (7.883662, 98.390734) —
  the origin is effectively the middle of the announced area, so §1a's choice of origin holds

At 80 m/unit the announced area is **50 × 58 units**, which does not fit the ±48-unit tile. The core
alone is **30 × 47 units** and does fit. This is a concrete argument for §1a's plan (tin town at true
scale, everything else `far`): the core is the tile, the continuous zone spills past its edges.

### The core
- bounding box **2,408 × 3,780 m** (lon 98.381578–98.403437, lat 7.861385–7.895376)
- centre **7.878381, 98.392508**
- perimeter **12,302 m** — a long, lobed outline, not a rectangle

## Which streets the boundary follows

Measured by walking the boundary segment by segment and asking which named OSM street is nearest to
each segment's midpoint. **85% of the core's 12.3 km perimeter runs within 30 m of a named street**:

| street | length of boundary on it | share | median offset |
|---|---|---|---|
| ถนนดำรง | 1,672 m | 13.6% | 2.9 m |
| ถนนรัตนโกสินทร์ 200 ปี | 1,391 m | 11.3% | 3.0 m |
| ถนนนริศร | 1,165 m | 9.5% | 4.3 m |
| ถนนภูเก็ต | 1,077 m | 8.8% | 1.6 m |
| ถนนปฏิพัทธิ์ | 980 m | 8.0% | 9.6 m |
| ถนนพูนผล | 720 m | 5.9% | 8.4 m |
| ถนนติลกอุทิศ 2 | 618 m | 5.0% | 6.2 m |
| ถนนปะเหลียน | 580 m | 4.7% | 9.2 m |
| ถนนแม่หลวน | 462 m | 3.8% | 1.1 m |
| ถนนมนตรี | 443 m | 3.6% | 3.6 m |
| ถนนทุ่งคา | 425 m | 3.5% | 0.6 m |
| ถนนบางกอก | 378 m | 3.1% | 1.8 m |
| ถนนพังงา | 275 m | 2.2% | 0.8 m |
| ถนนองค์สยามไผ่ | 240 m | 2.0% | 2.1 m |
| no named street within 30 m | 1,803 m | 14.6% | — |

### The streets issue #58 asked about are **not** the boundary

ถลาง, ดีบุก, กระบี่, เยาวราช and รัษฎา were the candidates in the issue. None of them carries the
boundary. Measured as the median distance from each street to the core's edge:

| street | median distance to the core edge | inside the core |
|---|---|---|
| ถนนถลาง | 211 m | 100% |
| ถนนดีบุก | 278 m | 100% |
| ถนนกระบี่ | 295 m | 90% |
| ถนนรัษฎา | 349 m | 100% |
| ถนนเยาวราช | 721 m | 26% (mostly outside) |
| ถนนเทพกระษัตรี | 1,149 m | 22% (outside) |

**ถลาง, ดีบุก, กระบี่ and รัษฎา are the shophouse streets in the middle of the zone** — 200–350 m
in from its edge. They are what the old town *is*, not where it *ends*. เยาวราช and เทพกระษัตรี run
outside the core entirely (เยาวราช does carry 6.2% of the *outer* zone's edge).

For the diorama this is the useful split: build the four shophouse streets as the heart of the tile,
and if the tile's edge needs to mean something, it is ดำรง / รัตนโกสินทร์ 200 ปี / นริศร / ภูเก็ต.

### The outer zone's edge
Much looser — only 55% of its 17.1 km perimeter is within 30 m of a named street, and 21% has no
street within 120 m (it runs through the bay shore, the hill slopes and the mangrove on the
south-east). Its main streets are เอกวานิช (9.1%), ตรัง (7.1%), ท่าแครง (7.0%), วิชิตสงคราม (6.9%)
and เยาวราช (6.2%).

## Method

Shapefile read with a plain `struct` parser (no GDAL); areas by the spherical-excess formula on
R = 6,371,007.181 m; distances in a local equirectangular projection about lat 7.8815, which is
accurate to better than 0.1% over a 5 km box. Streets from Overpass (`way[highway][name]` over
7.858–7.905 N, 98.368–98.410 E, 785 ways, 402 distinct names), queried 21 ตุลาคม 2569.
