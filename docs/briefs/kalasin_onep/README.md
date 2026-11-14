# Kalasin map work [cloud], 14 Nov 2569

Origin for every distance: **ศาลเจ้าพ่อหลักเมืองกาฬสินธุ์**, `16.43519, 103.50069` (OSM way 1534234341), in the old core
on ถนนแก่งสำโรง. `east_m` / `north_m` in the pins are metres from it.

Files:
- `kalasin_story_places.geojson`: 24 pins, each with distance, bearing, octant, east/north metres and a `pin` field saying
  how it was checked (`osm`, `osm-site`, `imagery`, `estimate`).
- `kalasin_osm.geojson`: OSM pulled 14 Nov 2026 (Overpass mirror maps.mail.ru): the ลำน้ำปาว centreline from the dam to
  below Fa Daet (way 186117443), คลองปาว and the larger streams and canals, the larger water bodies, and the
  trunk/primary/secondary roads with their bridges.
- `kalasin_town_core.jpg`: the old core on Esri imagery, 0.005° grid; streams light blue, water blue, roads orange.
- `kalasin_story_places.jpg`: the wide view, 0.05° grid, from the Lam Pao dam and reservoir (N) to Fa Daet Song Yang (S).

## 1. No ONEP outline
Not traced: the research pass found no declared old-town boundary for Kalasin. The old core used for layout is the
strip between คลองปาว and ถนนกาฬสินธุ์, about 16.428–16.440 N, 103.497–103.505 E (~0.9 × 1.3 km), read from imagery.
It is not a legal boundary. The municipality grew from 4.04 to 16.96 km² on 27 Sep 2525 (research part 4).

## 2. What the map says
- **The old town is on คลองปาว, not on the main Pao.** คลองปาว (OSM way 242809647, a stream, ~20–40 m wide on the
  imagery) meanders down the WEST edge of the old core, ~180 m west of the pillar. The main ลำน้ำปาว runs N→S ~5 km
  further west, then swings SE to Fa Daet; คลองปาว runs on SE, east of it. Every founder site sits on คลองปาว: the pillar,
  ศาลเจ้าพ่อโสมพะมิตร, the three temples in a row (วัดเหนือ, วัดกลาง, วัดใต้โพธิ์ค้ำ).
- **Kut Nam Kin (กุดน้ำกิน), 0.8 km S, is an oxbow of คลองปาว**: the first pillar site (2335), moved in 2370 after the bank
  collapsed (research). The oxbow on the imagery fits the story.
- **A large pond ~1 km across lies 2 km NE** (สวนสาธารณะแก่งดอนกลาง, OSM pond 242763546). OSM's name for the park is
  misspelt "สาธรณะ".
- **The town grew east**, along ถนนกาฬสินธุ์ to the trunk roads, to the new provincial hall (3.8 km E) and Kalasin
  University (3.7 km NE). Roads: ทล.12 (the W–E road south of the old core) and ทล.214, 227 and 299 radiating NE, E and SE (refs as OSM has them).
- **No railway** in the province. A straight ~1.5 km strip NE of town (16.469, 103.535) shows on the imagery beside a
  dark lake; OSM has no aeroway there. Not identified; not used.
- **Far places** (off a ~10 km tile): the Lam Pao dam crest 19 km N (the reservoir fills the NW of the wide map);
  Phu Kum Khao / the Sirindhorn Museum 29 km N; the Thepsuda bridge across the reservoir 31 km N; Fa Daet Song Yang
  13 km S (on the Pao's south reach); Ban Phon (Phrae Wa) 48 km N, off the wide map.
- The land is rice paddy with tree lines and ponds; no hills near town. Phu Kum Khao is a low hill by the reservoir.

## 3. Pins (distance / bearing from the pillar)
**The old core on คลองปาว**
- 1 ศาลเจ้าพ่อหลักเมือง (origin): OSM
- 2 ศาลเจ้าพ่อโสมพะมิตร, 133 m W: OSM
- 3 วัดกลาง พระอารามหลวง, 183 m E: OSM
- 4 วัดเหนือ, 282 m NE: nominatim
- 5 วัดใต้โพธิ์ค้ำ, 290 m S: OSM
- 6 กุดน้ำกิน (first pillar site, 2335), 813 m S: OSM park on the oxbow
- 7 ถนนแก่งสำโรง (the village name before the town): estimate; the rapids themselves not found
- 8 คลองปาว opposite the old core, 180 m W: OSM

**The town centre and its growth**
- 9 Phraya Chai Sunthon monument roundabout, 321 m E: OSM
- 10 the pong lang roundabout, 845 m E: OSM
- 11 fresh market, 1.0 km E: OSM
- 12 hospital, 674 m E: OSM
- 13 Kaeng Don Klang park pond, 2.2 km NE: OSM
- 14 new provincial hall, 3.8 km E: OSM
- 15 Kalasin University, 3.7 km NE: nominatim

**Edges and far places**
- 16 the main Lam Pao, 5.0 km W: OSM
- 17 the unidentified strip, 5.2 km NE: imagery only
- 18 Lam Pao dam crest, 19.1 km N: OSM
- 19 Thepsuda bridge, 31.0 km N: nominatim
- 20, 21 Phu Kum Khao / Sirindhorn Museum / Wat Sakkawan, 28.6 km N: OSM
- 22, 23 Fa Daet Song Yang / Phra That Yaku, 13.0 km S: OSM
- 24 Ban Phon, Kham Muang (Phrae Wa), 48 km N: OSM (off the wide map)

At 100 m/unit a 96-unit tile centred ~1 km E of the pillar holds the old core on คลองปาว, the pond, the eastern growth
to the provincial hall, and the main Pao on its west edge. The dam, Phu Kum Khao and Fa Daet must be drawn closer
(at most two far places, storyline §7).
