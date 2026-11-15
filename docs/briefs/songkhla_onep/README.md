# Songkhla map work [cloud], 15 Nov 2569

Origin for every distance: **ศาลเจ้าพ่อหลักเมืองสงขลา**, `7.19658, 100.59100` (OSM node 4695685892), in the old town of
Bo Yang between ถนนนางงาม and ถนนนครใน. `east_m` / `north_m` / `x` / `z` in the pins are from it (x east, z south, 100 m/unit).

Files:
- `songkhla_story_places.geojson`: 35 pins, each with distance, bearing, octant, east/north metres, world x/z and a `pin`
  field (`osm`, or `estimate` where OSM has nothing).
- `songkhla_osm.geojson`: OSM pulled 15 Nov 2026 (Overpass mirror maps.mail.ru): the Gulf coastline (natural=coastline),
  the shore of ทะเลสาบสงขลา (relation 1116319, its ways inside 7.10-7.27 N, 100.50-100.66 E) and Ko Yo (way 26974005),
  the trunk/primary/secondary roads, and the abandoned Songkhla railway (way 996676183, "สายสงขลา").
- `songkhla_story_places.jpg`: the wide view on Esri World Imagery, 0.01° grid, from the deep-sea port and the Singora
  hill (NW) to Ko Yo and the Tinsulanonda bridge (SW) and the airfield (SE).
- `songkhla_town_core.jpg`: the old town of Bo Yang and Khao Tang Kuan, 0.005° grid.

## 1. No ONEP outline
Not traced. The old walled town of Bo Yang (2379-2385) has no surviving outline in OSM: only two stretches of wall
(ถนนจะนะ by the museum, 7.2019 N; ถนนนครใน, 7.1989 N) and a rebuilt gate (7.1930 N). Read from those and the street grid,
the walled town was a strip ~0.3 × 0.9 km on the lake shore between the museum (N) and the gate (S), ถนนนครนอก on the
water and ถนนนครใน inside. Not a legal boundary; to be checked before the wall is drawn.

## 2. What the map says
- **Two waters.** The town stands on a sand spit ~1.5-2 km wide running NNW-SSE: the **Gulf of Thailand** on its east
  (Samila beach), **ทะเลสาบสงขลา** on its west. The lake meets the sea through one channel ~0.7 km wide at the spit's
  north tip (7.231, 100.581). On the tile each water is one flat shape cut at the tile edges (the engine draws path
  rivers as unclipped boxes): the Gulf a band along the NE-E side, the lake the W-SW quarter with Ko Yo in it.
- **The three towns are across the channel from each other.** Singora (Hua Khao Daeng, ~2150-2223) is on the WEST side,
  on and under เขาแดง (7.214, 100.569, ~3 km WNW), with its forts (OSM has nos. 7, 8, 9 and five unnumbered), its wall
  and moat, Sultan Sulaiman's tomb and the Dutch graves at the hill's north foot (5.3-5.5 km NW). Laem Son (2223-2385)
  was also on the west side (not in OSM; pinned as an estimate on the channel shore below Khao Daeng). Bo Yang
  (2379/2385-today) is on the EAST side, the spit, on the lake shore.
- **The old town faces the lake, not the sea.** ถนนนครนอก runs along the lake shore, ถนนนครใน one block in; the city
  pillar, the wall stretches, Hub Ho Hin and the museum are all within 0.7 km of the pillar on that shore. The beach
  (Samila, the mermaid 2.2 km NNE) was open sand-and-pine until the 20th century.
- **Khao Tang Kuan** (1.6 km N) is the one hill on the spit, between the old town and the beach. Across the channel the
  Singora hills (เขาแดง, เขาน้อย, เขาเมือง) and on the lake Ko Yo's hills (to 151 m).
- **The old railway** (abandoned, OSM way 996676183) comes up the spit from the south and ends at the old station, 0.6 km
  NNE of the pillar. Hat Yai Junction is 25.3 km SW (bearing 213), off any tile.
- **Tinsulanonda bridge**: the north span from Ko Yo's north tip to Khao Khiao (Singhanakhon side, 4.8 km W), the south
  span from Ko Yo to Nam Krachao (5.8 km SW). Road 408 runs on it.
- **The deep-sea port** is on the west side north of the channel (~7.230, 100.568, 4.2 km NW) with its breakwaters;
  the navy airfield is in the south-east of town (2.1 km SE).
- **Not in OSM**: Laem Son / Ban Bo Toei, the provincial hall (Nominatim found nothing), Kao Seng / Hua Nai Raeng.

## 3. Pins (distance / bearing from the pillar)
**Bo Yang, the old town on the lake**
- 1 ศาลเจ้าพ่อหลักเมือง (origin): OSM
- 2, 3 the wall stretches (ถนนจะนะ 0.62 km 344°, ถนนนครใน 0.37 km 314°): OSM
- 4 the rebuilt gate, 0.40 km 193°: OSM
- 5 the national museum (the deputy governor's mansion, 2421), 0.68 km 341°: OSM
- 6 Hub Ho Hin, 0.33 km 303°: OSM; 7 Ai Lian house, 0.21 km W: OSM; 8 ถนนนครนอก, 0.71 km S: OSM
- 9 the old railway station, 0.58 km 30°: OSM; 10 the clock tower, 0.66 km N: OSM
- 11 Khao Tang Kuan, 1.59 km 353°: OSM; 12 Wat Laem Sai, 1.39 km 336°: OSM
**The beach and the sea**
- 13, 14 the mermaid / Samila beach, 2.16 km 14°: OSM; 15 Ko Nu (Rat Island), 4.44 km 8°: OSM
- 16 the spit's tip at the channel, 3.97 km 343°: OSM coastline; 17 the airfield, 2.08 km 123°: OSM
- 18 the fishing port, 1.12 km S: OSM
**Singora, across the channel**
- 19-23 forts 8, 7, 9, the wall-and-moat fort, the archaeology centre, 3.4-4.6 km 305-326°: OSM
- 24 เขาแดง 3.09 km 310°, 25 เขาน้อย 4.23 km 302° (the stupa), 26 เขาเมือง 2.89 km 294°: OSM
- 27 Sultan Sulaiman's tomb 5.53 km 318°, 28 the Dutch graves 5.28 km 321°: OSM
- 29 Laem Son (the second town), ~1.8 km 299°: **estimate**
**The lake**
- 30, 31 Tinsulanonda bridge north span 4.83 km 262°, south span 5.82 km 217°: OSM
- 32 Ko Yo 6.49 km 238°, 33 the Thaksin folklore institute on Ko Yo 5.64 km 251°: OSM
**Far**
- 34 Hat Yai Junction, 25.3 km 213°: OSM
- 35 Ban Khu Khut, Sathing Phra (the home of the puppet Ai Teng), ~35 km 330°: estimate

At 100 m/unit a 96-unit tile `x -56..40, z -50..46` holds the town on its spit, the Gulf in the NE-E, the channel and
the whole Singora hill with its forts and the tomb, the lake in the W-SW with Ko Yo's north half and the bridge's north
span, and the airfield. Hat Yai must be drawn closer (at most two far places, storyline §7).
