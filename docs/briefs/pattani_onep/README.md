# Pattani map work [cloud], 20 Nov 2569

Origin for every distance: **ศาลหลักเมืองปัตตานี**, `6.86878, 101.25252` (OSM way 1337146202), on the west bank of the
Pattani river by the Dechanuchit bridge. `east_m` / `north_m` in the pins are metres from it; `unit_x` / `unit_z` are the
engine's units at **125 m/unit** (+x east, +z south).

Files:
- `pattani_story_places.geojson`: 15 pins, each with distance, bearing, octant, east/north metres, units and a `pin` field
  saying how it was checked (`osm`, `nominatim`, `imagery`, `estimate`).
- `pattani_osm.geojson`: OSM pulled 20 Nov 2026 (Overpass mirror maps.mail.ru): the coastline (bay and spit), แม่น้ำปัตตานี
  (way 37273146) and the other rivers, and the trunk/primary/secondary roads.
- `pattani_story_places.jpg`: the wide view on Esri imagery, 0.01° grid: the bay, Laem Tachi, the town and Kru Se.
- `pattani_town_core.jpg`: the town on the river, 0.005° grid.

## 1. No ONEP outline
Not traced: no declared old-town boundary was found. The old town used for layout is the two banks of the river between
the city pillar and the Chabang Tiga palace, about 6.855–6.875 N, 101.245–101.262 E (~2 × 2.5 km), read from imagery.

## 2. What the map says
- **The town is on the Pattani river, 3–4 km above its mouth.** The river (way 37273146) meanders north through Chabang
  Tiga and the town and reaches the bay at 6.904 N, 101.244 E. The pillar, the provincial hall and the Dechanuchit bridge
  are by the west bank; the Chinese quarter (Anoru, the Lim Ko Niao shrine) and the Central Mosque are on the east bank.
- **Pattani bay** (~12 × 6 km) lies north of the town, closed by the Laem Tachi spit (its tip 7 km N); the mouth of the bay
  opens west to the gulf. Drawn as ONE flat sea shape cut at the tile edges (plus the open sea's north-east corner beyond the
  spit as a second shape).
- **Kru Se, the old capital, is 5.6 km E** on the bay's south shore: the mosque (node 14231572759), Lim Ko Niao's tomb
  beside it (node 8231022818), Ban Kru Se. Highway 42 runs right past the mosque's south side; in the clip it is drawn
  ~150 m further south so it does not touch the mosque.
- The land is flat: paddies, coconut, shrimp ponds and mangrove at the bay's edge. No hills.
- **Not in OSM** (estimates, flagged in the pins): the casting pits (placed on open ground south of the mosque), the old
  anchorage off Kru Se, the old palace/fort at Kru Se.
- No railway in the tile.

## 3. Pins
**The town:** 1 pillar (origin) · 2 Dechanuchit bridge 0.3 km S · 3 Lim Ko Niao shrine 0.7 km NE · 4 Central Mosque
0.8 km S · 5 Chabang Tiga palace 1.5 km S (nominatim) · 6 provincial hall 0.3 km SW · 7 Wat Lak Mueang 1.3 km NW ·
8 PSU Pattani 2.3 km NW · 9 river mouth 4.0 km N.
**Kru Se:** 10 Krue Se mosque 5.6 km E · 11 Lim Ko Niao's tomb 5.5 km E · 12 Ban Kru Se 4.9 km E · 13 the old anchorage
(estimate) 5.6 km ENE.
**The bay:** 14 Laem Tachi tip 7.2 km N · 15 mid-bay 5.5 km NNE.

At 125 m/unit a tile x −30…62, z −72…30 (11.5 × 12.75 km) holds the town, Kru Se, the whole bay and the spit at true scale:
no far places.
