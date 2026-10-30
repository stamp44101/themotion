# Ratchaburi: ONEP old town and OSM pull [local]

## ONEP
Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (the same file as Lampang, Suphanburi and Nakhon Pathom; 62 records, WGS84 degrees, `oldtown_all.prj` copied here unchanged).

**Ratchaburi is an announced old town: เมืองเก่าราชบุรี, OT_CODE 24, group 2 (records 46 and 47).** `ratchaburi_oldtown_onep.geojson` holds both polygons with every attribute from the `.dbf`:

| role | zone | ONEP AREA | measured | extent |
|---|---|---|---|---|
| `onep_old_town` | 1 พื้นที่เมืองเก่า | 1.56 km² | 1.56 km² | ~1,770 × 1,450 m |
| `onep_continuation_zone` | 2 พื้นที่ต่อเนื่อง | 0.61 km² | outer ring 2.17 km² (a band around zone 1; 2.17 − 1.56 = 0.61) | ~1,990 × 1,660 m |

Dates in the record: AGREE 2017-04-10, NOTICE 2017-05-12, subcommittee 2017-06-29.

The zone 1 polygon takes in the bend of the Mae Klong: Wat Mahathat sits in its north-west part, the national museum in the part south of the bend, and the Southern Line crosses the river along its eastern edge.

## OSM (`ratchaburi_osm.geojson`, pulled 2026-10-30 via Overpass)
Each feature has a `role` property:

- `mae_klong_river`: centreline, ways 301356780, 1460457503, 1460457504 (clipped to 13.42–13.62 N, 99.70–99.92 E). `mae_klong_water`: the water-area polygons through town, ways 116376554 and 126583120.
- `wat_mahathat` node 2578808292 (Wat Mahathat Worawihan) and `wat_mahathat_prang` node 2578808283 (its prang, tagged as a tower).
- `national_museum_old_provincial_hall`: Ratchaburi National Museum, relation 12906115. OSM tags it only as the museum; the brief's "old provincial hall" is the cloud's to confirm.
- `provincial_hall_new`: ศาลากลางจังหวัดราชบุรี, way 951493985.
- `station_ratchaburi` node 259729391; `southern_line` and `southern_line_bridge` (named Southern Line ways, clipped). The **Mae Klong rail bridge** is ways 193610152 (156 m) and 979943338 (1,059 m, the newer long viaduct), crossing at 13.5414, 99.8242; `road_bridge` way 138205385 (ถนนรถไฟ) runs beside it at the same crossing.
- Road bridges over the Mae Klong: Phetkasem Road ways 40233494 / 73129928 (cross at 13.5509, 99.8194, ~300 m each) and the Ratchaburi bypass ways 83069580 / 232347487 (cross at 13.5401, 99.8418, ~910 m each). Other bridged road ways in town are included as `road_bridge` too.
- `kiln_tao_hong_tai`: Tao Hong Tai Ceramics Factory, node 4585665489. `kiln_museum_ratburi_old_jar`: Ratburi Old Jar Museum (รัตนโกสินทร์เซรามิก 4), node 11212240057.
- `chedi_hak_ruins`: Chedi Hak, node 13204637701 (historic=ruins).
- `khao_ngu_stone_park` node 5583404134 and `wat_tham_khao_ngu` node 6970739125.
- `khu_bua_ancient_town`: Ban Khu Bua Ancient City, node 5583402621 (archaeological site); `ban_khu_bua_village` node 5356201733; `station_ban_khu_bua` node 5274916039.

**Not in OSM** (searched by name in the box): any old city wall, moat or gate (`กำแพงเมือง`, `คูเมือง`, `ประตูเมือง`, `historic=citywalls`); Koi Ki old market (`โคยกี๊`, `ตลาดเก่า`); the older dragon-jar kilns beyond Tao Hong Tai (`โอ่ง`, `เตา`, `ceramic`, `kiln`); a Thai Yuan village or cultural centre (`ไทยวน`, `ยวน`, `วัฒนธรรม`). Ban Khu Bua is pinned, but nothing in OSM marks it as Thai Yuan. These need another source (Google pins or the gem's research).

## Measurements (from Wat Mahathat, 13.5475, 99.8143)
- Mae Klong: the centreline is 480 m E at its nearest; width through town about **143 m** (median of 15 cross-sections within 1.5 km; range 110–208 m).
- Prang: 110 m S (the node is on the temple grounds).
- Tao Hong Tai: 1.1 km W. Chedi Hak: 1.8 km W.
- National museum: 0.8 km SE. New provincial hall: 2.0 km S. Ratchaburi station: 2.2 km SE.
- Khao Ngu stone park: 4.8 km NW (Wat Tham Khao Ngu 5.0 km). Ratburi Old Jar Museum: 4.9 km N.
- Ban Khu Bua village 6.2 km S, Khu Bua ancient town 7.1 km S, both just off the Southern Line (Ban Khu Bua station 6.3 km S).

So the old town, the temple, Tao Hong Tai and the rail bridge all sit within about 2 km of the Mae Klong bend; Khao Ngu (NW) and Khu Bua (S) are each 5–7 km out, outside a single town tile.

`ratchaburi_overlay.jpg` is a plain plot (town core with the ONEP zones, and the wide view out to Khao Ngu and Khu Bua), not a satellite image.
