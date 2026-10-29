# Nakhon Pathom: ONEP check and OSM pull [local]

## ONEP
`oldtown_all.shp` (same file as Lampang, Suphanburi and Udon Thani) has 62 polygons in 35 provinces. **Nakhon Pathom is not one of them**, so there is no ONEP old-town polygon. Pins come from OSM only.

## OSM (`nakhonpathom_osm.geojson`, pulled 2026-10-30 via Overpass)
Each feature has a `role` property:

- `phra_pathom_chedi`: the chedi building, way 260617833.
- `chedi_temple_grounds`: Wat Phra Pathom Chedi Ratchaworamahawihan, relation 19449669.
- `khlong_chedi_bucha`: Khlong Chedi Bucha, ways 97086356, 618139638, 618139639 (clipped to the town box).
- `tha_chin_river`: Tha Chin, ways 40194985, 576675808, 677682376 (clipped to the box; the stretch past Nakhon Chai Si).
- `southern_line`: Southern Line rail ways (named), clipped to the box.
- `station_nakhon_pathom` node 259729390, `halt_sanam_chandra` node 8106124445 (Sanam Chandra Palace halt), `station_nakhon_chai_si` node 3144976438, plus other stations on the line (`station`).
- `sanam_chandra_palace`: way 96936815.
- `silpakorn_campus`: Silpakorn University, Sanam Chandra Palace campus, way 220825148.
- `phra_prathon_ruins` way 1227287978 (tagged ruins) and `phra_prathon_temple` way 103933620.
- `chedi_museum`: Phra Pathom Chedi National Museum, node 1121030565.

**Not in OSM:** no ancient moat / old city wall (searched `คูเมือง`, `เมืองโบราณ` in the box). If the Dvaravati town outline is needed it has to come from another source (Fine Arts Dept. survey maps).

## Measurements (from the chedi building's centroid, 13.819673, 100.060078)
- Chedi polygon: 12,958 m², ~129 m across. **Check before modelling:** this OSM outline probably includes the round gallery/cloister around the bell, not just the bell's base.
- Temple grounds: 5.1 ha, about 322 × 210 m.
- Khlong Chedi Bucha: nearest point 233 m from the chedi.
- Nakhon Pathom station: 553 m N.
- Sanam Chandra Palace: 1.6 km W (grounds 13.0 ha); Sanam Chandra halt 2.1 km W; Silpakorn campus 2.2 km W.
- Phra Prathon Chedi: 4.0 km E.
- Nakhon Chai Si station: 12.6 km E; the Tha Chin's nearest point is 13.6 km E.

So the town core is compact around the chedi with the railway just north of it, the palace and university are a western cluster about 2 km out, and the Tha Chin (the old water route the brief may want) is far to the east at Nakhon Chai Si, outside a single town tile.

`nakhonpathom_overlay.jpg` is a plain plot (two panels: town core, and the wide view out to the Tha Chin), not a satellite image.
