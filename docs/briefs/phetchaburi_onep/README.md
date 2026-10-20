# ONEP old-town boundary — เมืองเก่าเพชรบุรี

Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (all 36 announced old
towns in one shapefile, WGS84 degrees — `oldtown_all.prj` is copied here unchanged). Record
index 32 of 36, `OT_NAME = เมืองเก่าเพชรบุรี`. Extracted 19 ตุลาคม 2569 for issue #51.

`phetchaburi_oldtown.geojson` is that one record, unmodified: a single polygon, one ring,
44 points, lon/lat in degrees.

## Attributes as published

| field | value |
|---|---|
| `OT_NAME` | เมืองเก่าเพชรบุรี |
| `PROVINCE` | จ.เพชรบุรี |
| `GROUP` | กลุ่มที่ 2 |
| `AREA` | 1.74989 (km², ONEP's own figure) |
| `AGREE` | 20150210 — มติคณะรัฐมนตรี 10 กุมภาพันธ์ 2558 |
| `NOTICE` | 20150310 — ประกาศ 10 มีนาคม 2558 |

## Geometry, measured from this file

| | |
|---|---|
| centroid | **13.103344, 99.950415** |
| bounding box | 13.09566 – 13.11171 N, 99.94384 – 99.95807 E |
| bounding box in metres | **1,533 m E–W × 1,775 m N–S** |
| area (shoelace, on the ring itself) | **1.739 km²** |
| extreme N | 13.11171, 99.94759 |
| extreme S | 13.09566, 99.95060 |
| extreme E | 13.10654, 99.95807 |
| extreme W | 13.10795, 99.94384 |

The shoelace area (1.739 km²) agrees with the shapefile's own `AREA` field (1.74989) to
within 0.6%. `thai-oldtown.csv` lists 1.85 km² for Phetchaburi — that figure does not match
the polygon and should not be used.

## What the zone does and does not contain

- **แม่น้ำเพชรบุรี runs straight through it, north to south.** 20 points of OSM way
  120451772 fall inside the ring; it enters at **13.11078, 99.94829** and leaves at
  **13.09571, 99.94868**, cutting the zone into a narrow west bank and a wide east bank.
- Inside: วัดมหาธาตุวรวิหาร, วัดกำแพงแลง, วัดใหญ่สุวรรณาราม, ถนนคลองกระแชง.
- **Outside: all three peaks of พระนครคีรี (เขาวัง)** — 1.3–1.6 km WNW of the centroid —
  and พระรามราชนิเวศน์ (983 m SSW) and สถานีรถไฟเพชรบุรี (1,747 m NW). The ONEP zone is the
  historic town on the river, not the hill. Khao Wang is a backdrop that stands outside it.
- The zone is **not** the same thing as the walled town; see §1 of `../phetchaburi.md`. It is
  larger on the west and north and stops short of the walled town's south-east corner.
