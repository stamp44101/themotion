# Trang map work [cloud], 18 Nov 2569

Origin for every distance: **ศาลหลักเมืองตรัง at Khuan Thani**, `7.52393, 99.55701` (OSM way 1442965281, "Trang City Pillar
Shrine"), the old town on the Trang river, which kept its pillar when the town moved. `east_m` / `north_m` in the pins are metres
from it.

Files:
- `trang_story_places.geojson`: 17 pins, each with distance, bearing, octant, east/north metres and a `pin` field (`osm`,
  `osm-site`, `estimate`).
- `trang_osm.geojson`: OSM pulled 18 Nov 2026 (Overpass mirror maps.mail.ru): แม่น้ำตรัง's centreline (ways 478279282,
  791433088), the Kantang branch railway (สายทางแยกกันตัง), the coastline from Ko Libong to the Trang mouth, and the
  trunk/primary/secondary roads. The estuary's water polygons are OSM relations 2030831 (the Trang river) and 2030832 (the
  creek estuary to the east), used in `src/cities/trang/places.ts`.
- `trang_story_places.jpg`: the wide view, 0.05° grid, Trang town (NE) to the Trang mouth (S), Esri World_Imagery.
- `trang_town_core.jpg`: Thap Thiang (Trang town), 0.005° grid. `trang_kantang_core.jpg`: Kantang, 0.005° grid.

## 1. No ONEP outline
Not traced: neither Kantang nor Thap Thiang ever had a wall or a declared old-town boundary that the research found. Layout
uses the imagery: Kantang's old core is the strip on the estuary's east bank between the port and the station (~0.8 × 1.2 km);
Thap Thiang's core is round the station, the clock tower and the provincial hall (~1 × 1 km).

## 2. What the map says
- **Three towns on one river.** แม่น้ำตรัง winds south from the north edge; Khuan Thani (the first town, the pillar) is on its
  east bank; it opens into an estuary ~400 m wide at Kantang 13.4 km SSW of the pillar and reaches the Andaman 11 km further
  south (7.31 N). Thap Thiang (today's Trang) is 6.9 km NE of the pillar, **not on the river** but on the railway, 4–5 km east
  of the river's bends.
- **The railway** runs from Kantang station (by the port) NE across the paddies to Trang station: ~20.8 km by the kilometre
  posts (850.08 − 829.28). A 500 m spur once ran on to the wharf.
- **The first rubber tree** (OSM node "ยางพาราต้นแรกในไทย") is 1 km E of Kantang station on ถ.ตรังคภูมิ.
- **Trang town today**: the ring road 419 round it, the airport 2.8 km S of the station (open ground), Sra Kaphang Surin
  (a park with a lake) 2.4 km NE of the station, the Phraya Ratsada monument on Phetkasem road 1.6 km E.
- A second estuary (OSM relation 2030832) opens 6–12 km SE of Kantang; mangrove creeks on both.
- Far: Ko Libong (dugongs) 36 km SW of the pillar, 22 km SW of Kantang; Ko Muk (Emerald Cave) and Ko Kradan 35–41 km WSW.

## 3. Pins (distance / bearing from the pillar)
See `trang_story_places.geojson`; summary:
- Khuan Thani 0.2 km; Kantang station 13.4 km S (201°); the port 13.6 km SW (203°); first rubber tree 13.2 km S (197°);
  the Trang mouth 24.5 km S (195°)
- Trang station 6.2 km NE (57°); clock tower 6.9 km NE; provincial hall 7.1 km NE; Phraya Ratsada monument 8.6 km NE;
  Sra Kaphang Surin 9.4 km NE; airport 6.7 km E (105°)
- Ko Libong 35.7 km SW (210°); Ko Muk 34.7 km WSW; Ko Kradan 40.7 km WSW
- ★ ท่าจีน (the Penang Chinese landing, ~2367): not pinned; the river reach west of Trang town

## 4. Layout (as built, `src/cities/trang/places.ts`)
200 m/unit, origin the **clock tower** in Thap Thiang (the engine grows its town outward from the origin), +x east, +z south.
Within 4.4 km of the clock tower everything is at true scale. Beyond it everything slides toward Trang along Kantang's real
bearing (10 km in all by 18.4 km out), so Kantang, its estuary and the sea keep their own scale but sit ~9 km from Trang
instead of 19, with the river and the railway between compressed. From 20 km out the estuary and the sea slide a further
7.6 km toward Kantang along the river's line, so the mouth is ~4 km below Kantang instead of 11. Ko Libong is drawn closer
still, on the sea's south-west. Tile x −37..20, z −15..66. Why: at true scale today's Trang covers ~3% of a tile that
also holds Kantang and the sea, and the grandeur floor wants ≥20% (`docs/grandeur.md`). The engine's town is the real
municipality (เทศบาลนครตรัง, OSM relation 20043137, 14.7 km²), and the modern sprawl reaches the airport and Khuan Thani's road.
The pins above are real; the `geo.ts` direction check passes.
