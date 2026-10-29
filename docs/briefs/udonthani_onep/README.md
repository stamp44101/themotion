# Udon Thani: ONEP check and OSM pull [local]

## ONEP
`oldtown_all.shp` (the same file used for Lampang and Suphanburi) has 62 polygons in 35 provinces. **Udon Thani is not one of them**, so there is no ONEP polygon. Pins come from OSM only.

## OSM (`udonthani_osm.geojson`, pulled 2026-10-29 via Overpass)
Each feature has a `role` property:

- `lake`: Nong Prachak, relation 1609427 (natural=water, water=lake). Outer ring only (150 points).
- `park`: Nong Prajak Park, way 733906215.
- `provincial_hall`: Udon Thani Provincial Hall, relation 9300032.
- `city_pillar`: City Pillar Shrine Udon Thani, way 1344565721. Also `pillar_shrine_node`, node 13245284100.
- `prachak_monument`: Prince Prachak monument, node 757352767, at the five-way roundabout (way 668495245).
- `station`: Udon Thani station, node 675458495.
- `rail_main`: Northeastern Line (named ways). `rail_yard`: the unnamed station-yard tracks.

## Measurements
- Nong Prachak water: 36.1 ha, about 760 m E–W × 1,110 m N–S. Centroid 17.417630, 102.781892.
- Park polygon: 49.2 ha (it wraps the lake).
- Provincial hall: 640 m SE of the lake centre, about 300 m from the shore.
- City pillar: 200 m S of the hall, about 340 m from the shore.
- Station: 2.9 km SE of the lake centre, 2.3 km SE of the hall. The line runs N–S on the east edge of town.
- Prachak monument: 1.4 km SE of the hall, roughly halfway from the hall to the station.

So the lake, the hall and the pillar sit together on the west side, and the railway is a separate band about 2 km east. That gives a natural west-to-east growth axis from the camp beside the lake out to the railway.

`udonthani_overlay.jpg` is a plain plot of these features (not a satellite image).
