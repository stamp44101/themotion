# Phayao map work [cloud], 15 Nov 2569

Origin for every distance: **ศาลหลักเมืองพะเยา**, `19.16650, 99.90195` (OSM way 1468605644), inside Wiang Phayao on
ถนนดอนสนาม. `east_m` / `north_m` in the pins are metres from it. Scale in code: 100 m/unit, z = south.

Files:
- `phayao_story_places.geojson`: 19 pins, each with distance, bearing, octant, east/north metres and a `pin` field saying how
  it was checked (`osm`, `nominatim`, `imagery`, `estimate`).
- `phayao_osm.geojson`: OSM pulled 15 Nov 2026 (Overpass mirror maps.mail.ru): the Kwan's outline (relation 5657979, outer and
  island rings), the Ing in and out of it and the streams round it, the small water bodies in the wiang (the moat traces), and
  the trunk/primary/secondary roads.
- `phayao_town_core.jpg`: the wiang and the lake shore on Esri imagery, 0.005° grid; lake blue, Ing dark blue, water cyan,
  roads orange.
- `phayao_story_places.jpg`: the wide view, 0.02° grid, from Doi Bussarakham (W) to the university (S).

## 1. No ONEP outline
Not traced from ONEP. Wiang Phayao's footprint is read from imagery and OSM: the headland on the lake's east shore inside
ถนนรอบเวียงประตูคลอง, ~19.163–19.172 N, 99.893–99.907 E (~1.0 × 1.4 km), with moat traces on the north (a row of ponds
along 19.171 N, OSM 1456463977-83) and the east (a curved strip at 99.9087 E). West and south it is lake shore today. Drawn
in code as `WIANG` (8 points) in `src/styleframes/phayao.tsx`. It is not a legal boundary.

## 2. What the map says
- **The town is on a headland in the Kwan's south-east corner.** The lake (20.5 km²) lies NW of it, ~6.5 km N-S and ~6 km
  W-E, with the Phi Pan Nam range behind its west shore. Wat Si Khom Kham (พระเจ้าตนหลวง) is on the shore 1.7 km NW.
- **The Ing comes in at the lake's north end** (5.5 km NW) and **leaves at its south-east corner** 1.4 km ESE of the pillar,
  where ถนนพหลโยธิน crosses it at the town's entrance: that is where the 2482 gate is (en.wiki: "where Highway 1 crosses the
  river at the entrance to Phayao town"). OSM tags no gate there. Below it the Ing meanders east (then NE to Chiang Rai).
- **Wat Tilok Aram is the speck in the lake 0.9 km S of the pillar**, ~250 m off the headland's south shore, in the narrow
  south-east lobe. Before 2482 this was the plain the Ing crossed; its course across the lake bed is not traced (drawn as an
  estimate).
- **The town grew north and east** along ถนนพหลโยธิน (the bus station, the hospital 3.8 km NW, Ban Tom and the provincial hall
  further N) and east past the outlet (Wat Li). The lake shore west and south of the wiang is a park (the Ngam Mueang
  monument). No railway yet (Den Chai–Chiang Rai under construction).
- **Far places:** Wat Analayo on Doi Bussarakham 9.5 km W (slogan), the University of Phayao 15 km S.
- Small hill Doi Chom Thong 2.4 km NW (Wat Phra That Chom Thong, which Ngam Mueang endowed in the legend).

At 100 m/unit a 96-unit tile x −62..34, z −48..48 holds the whole Kwan, the wiang, Wat Si Khom Kham, the outlet and the
Ing's first meanders east, with the Phi Pan Nam range along the west edge.
