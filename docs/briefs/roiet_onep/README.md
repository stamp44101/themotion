# Roi Et map work [cloud], 15 Nov 2569

Origin for every distance: **ศาลหลักเมืองร้อยเอ็ด**, `16.05675, 103.65253` (OSM way 1444501158), on the island in บึงพลาญชัย.
`east_m` / `north_m` in the pins are metres from it.

Files:
- `roiet_story_places.geojson`: 23 pins, each with distance, bearing, octant, east/north metres and a `pin` field saying how
  it was checked (`osm`, `estimate`).
- `roiet_osm.geojson`: OSM pulled 15 Nov 2026 (Overpass mirror maps.mail.ru): คลองคูเมือง (relation 14556044), บึงพลาญชัย
  (relation 2222833), หนองหญ้าม้า (relation 18169840), แม่น้ำชี and the streams and canals of the wide map, both runways,
  and the trunk/primary/secondary/tertiary roads.
- `roiet_town_core.jpg`: the moat town on Esri imagery, 0.005° grid; water blue, roads orange, pins red.
- `roiet_story_places.jpg`: the wide view, 0.05° grid: the ring road, หนองหญ้าม้า, แม่น้ำชี and the airport.

## 1. The outline is the moat (no ONEP pass needed)
คลองคูเมือง is still water all the way round except the north half of the west side (filled; a drain channel leaves the NW
corner west). Its centreline, resampled every 7.5° from (-1.2, -1.4) units (100 m/unit), is a rounded square
**~1.76 × 1.75 km**: x -10.1…7.5, z -9.4…8.1 (+z south). Water ~25–60 m wide (mean 36 m). This is the Dvaravati moat and
earth wall the wiki names (east of Wat Burapha, south by Satri Suksa school); no ONEP boundary was looked for.

## 2. What the map says
- **บึงพลาญชัย is in the middle of the moat town**, an oval ~450 × 470 m (x -3.7…0.8, z -3.5…1.2) with an island in two
  lobes; the city pillar shrine (origin) is on the island's SE lobe, a footbridge from the SE bank. หอโหวด ๑๐๑ stands 230 m
  S of the pillar on the south bank, the provincial hall 470 m SE.
- **The town is radial.** ถนนแจ้งสนิท (ทล.23) crosses W–E just south of the bueng; roads leave the moat to every side; the
  ring road ทล.232 is an octagon ~8.5-9 km across (pin 18). Low flat land, paddy and tree lines; no hill, no river in town.
- **An old airstrip** (runway 17/35, ~950 m) lies 1.5 km NNW, just outside the moat: Roi Et's first airfield
  (ศิลปวัฒนธรรม "100 ปี สนามบินร้อยเอ็ด": since 2465, snippet only). The airport today (2542) is 15 km ENE (pin 19).
- **หนองหญ้าม้า**, a reservoir ~3 km long, lies 3–5 km S/SE.
- **แม่น้ำชี** is 13 km E (with an oxbow lake near Thawat Buri). No railway yet: the Ban Phai–Nakhon Phanom double track is
  being built across the NW of the wide map (~30%, opening ~2573: news snippet).
- **Far places**: บ้านสีแก้ว (khaen makers) 15 km NW; วัดป่ากุง 18 km SW; พระมหาเจดีย์ชัยมงคล 78 km ENE (bearing 67°) on the
  Phu Phan foothills.

## 3. Pins (distance / bearing from the pillar)
**The moat town**: 1 ศาลหลักเมือง (origin) · 2 บึงพลาญชัย 119 m N · 3 หอโหวด ๑๐๑ 232 m S · 4 วัดบึงพระลานชัย 362 m W ·
5 วัดกลางมิ่งเมือง 586 m N · 6 วัดบูรพาภิราม (พระสูงใหญ่) 938 m NE · 7 วัดสระทอง 798 m N · 8 วัดเหนือ 872 m NW ·
9 อนุสาวรีย์พระขัติยะวงษา (ทนต์) 725 m W · 10 ศาลากลาง 467 m SE · 11 พิพิธภัณฑสถานแห่งชาติ 588 m SE · 12 ตลาดหนองแคน 714 m SW ·
13, 14 the moat NE corner / south side (OSM) · 15 the earth wall east of Wat Burapha (**estimate**, not seen on imagery)
**Edges**: 16 old airstrip 1.5 km NNW · 17 หนองหญ้าม้า 3.7 km S · 18 ring road 4.7 km NW
**Far**: 19 airport 15.0 km ENE · 20 แม่น้ำชี 12.9 km E · 21 บ้านสีแก้ว 15.2 km NW · 22 วัดป่ากุง 18.2 km SW ·
23 พระมหาเจดีย์ชัยมงคล 77.7 km ENE

At 100 m/unit an 80-unit tile centred on the bueng holds the whole moat town, the old airstrip and the north edge of
หนองหญ้าม้า at true scale; the ring road runs just off it. The airport, the Chi, Si Kaeo and the Maha Chedi are off it: at most two may be drawn closer
(storyline §7).
