# Phrae map work [cloud], 18 Nov 2569

Origin for every distance: **ศาลหลักเมืองแพร่**, `18.14318, 100.1385` (OSM node 3961429157), in the middle of the old town.
`east_m` / `north_m` in the pins are metres from it.

Files:
- `phrae_story_places.geojson`: 20 pins, each with distance, bearing, octant, east/north metres and a `pin` field saying how it
  was checked (`osm`, `estimate`).
- `phrae_osm.geojson`: OSM pulled 18 Nov 2026 (Overpass mirror maps.mail.ru): the Yom (way 1304426787), the water bodies and
  streams round the old town, the OSM city-wall segments, the trunk/primary/secondary roads, the rail by Den Chai, the runway.
- `phrae_town_core.jpg`: the old town on Esri imagery, 0.005° grid; magenta = the traced shell outline, red = OSM wall segments,
  blue = water, orange = roads, white circles = pins (numbers as in the list below).
- `phrae_story_places.jpg`: the wide view, 0.05° grid, from Den Chai (SW) to Phae Mueang Phi (NE).

## 1. The old town (เวียงแพร่)
No ONEP layer was available to cloud. The shell ("หอยสังข์") was traced on Esri imagery along what OSM has: the wall segments on
the west and south (ways 1458671338/9, 1381559160/1), the east moat pond (way 108157773), the stream along the north-west, and the
two north gates (ประตูใหม่, ประตูยั้งม้า). About 1.2 × 1.2 km and ~4 km round, which matches the ~4,000 m in the sources.
ประตูชัย has no OSM node; it is drawn where ถนนเจริญเมือง leaves the south-east wall (an estimate).

## 2. What the map says
- **The Yom bends round the old town's north and west**, 0.3–1.4 km out, then runs south and swings west below the town.
- **The town grew east and south-east**: ถนนยันตรกิจโกศล east of the old town, the airport 3 km SE, the bypass (ทล.101) round the
  east and south, ถนนช่อแฮ to Phra That Cho Hae.
- **No railway in the town.** The line passes Den Chai, 20.4 km SSW.
- **Hills:** the plain is walled by a high ridge ~6 km west and by hills east and south-east (Cho Hae sits at their foot).
- **Far places:** Phra That Cho Hae 9.4 km SE (bearing 132), Den Chai station 20.4 km SSW (208), Phae Mueang Phi 8.7 km NE (59;
  not used).

## 3. Pins (distance / bearing from the pillar)
1 ศาลหลักเมือง (origin) · 2 วัดหลวง 0.27 km NW · 3 คุ้มเจ้าหลวง 0.12 km N · 4 คุ้มวงศ์บุรี 0.24 km W · 5 วัดพระนอน 0.40 km W ·
6 วัดพระบาทมิ่งเมือง 0.21 km E · 7 วัดศรีชุม 0.32 km N · 8 ประตูยั้งม้า 0.85 km NE · 9 ประตูใหม่ 0.84 km NE ·
10 ประตูชัย (estimate) 0.38 km ESE · 11 โรงเรียนป่าไม้ (เก่า) 0.45 km SW · 12 วัดสระบ่อแก้ว 0.89 km NE · 13 วัดจอมสวรรค์ 1.53 km NE ·
14 แม่น้ำยม north bend 0.78 km N · 15 ท่าอากาศยาน 3.03 km SE · 16 ทุ่งโฮ้ง 4.54 km NE · 17 พระธาตุช่อแฮ 9.39 km SE ·
18 สถานีเด่นชัย 20.44 km SSW · 19 แพะเมืองผี 8.72 km NE · 20 แยกช่อแฮ 3.66 km SE. All OSM except 10.

At 100 m/unit an 82-unit tile holds the old town, the Yom's bend, the growth east to the airport and Ban Thung Hong; Cho Hae and
Den Chai are drawn closer at the south corners, the west ridge at the north-west edge (`src/cities/phrae/places.ts`).
