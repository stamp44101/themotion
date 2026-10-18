# ONEP old-town boundary for Lampang

`lampang_oldtown.geojson` is the official **เมืองเก่าลำปาง** conservation boundary, taken
from ONEP's own open data and converted to GeoJSON without reprojection.

## Where it came from

ONEP publishes one combined archive for all 36 announced old towns, not one file per town:

- index: https://www.onep.go.th/open-data-oldtown/
- shapefiles: https://www.onep.go.th/data/oldtown.rar  (`oldtown_all.shp/.shx/.dbf/.prj/.cpg`)
- table: https://www.onep.go.th/data/thai-oldtown.csv

`oldtown_all.prj` is kept here as proof of the CRS: **GCS_WGS_1984**, degrees. The
coordinates are already lat/lon, so the ring can go straight into a `city.outline`
conversion with no projection step.

Lampang is record 50 of 62 (`OT_CODE 4`, `OT_NAME เมืองเก่าลำปาง`, `PROVINCE จ.ลำปาง`).
Its ring has 99 points. ONEP's own `AREA` field says 3.824 km²; the shoelace area of the
ring is 3.798 km², which is the same polygon within rounding.

The CSV row agrees: `4 | ลำปาง | ลำปาง | เหนือ | group 1 | 3.804 km² | ครม. 9 พ.ย. 2553 |
ประกาศเขต 13 ธ.ค. 2553`.

## What it is, and what it is not

This is the **conservation zone**, not the wall line: 3,389 m east–west by 2,576 m
north–south, and the Wang runs through it. The เขลางค์ wall circuit (~4,400 m round,
~600 rai) is a smaller shape inside it. Use this polygon for the city's extent and the
tile, and trace the wall separately.
