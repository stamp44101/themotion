# Surat Thani map work [local], PR #81

Origin for every distance: **ศาลหลักเมืองสุราษฎร์ธานี**, OSM way 167081575 (centre 9.13919, 99.32170); Google has it 6 m away.

Files: `suratthani_osm.geojson` (Tapi arms, Phum Duang, islands incl. Ko Lamphu, bay coastline, rail crossing, stations, pillar) · `suratthani_pins.geojson` (every pin below, with source, note, distance and bearing) · `suratthani_town.jpg` (town, Esri z16) · `suratthani_tapi.jpg` (Tha Kham → bay) · `suratthani_far.jpg` (Chaiya, Don Sak, Samui, airport, Na San).

## 1. ONEP
**None of Surat Thani (Ban Don), Chaiya or Tha Thong is an announced old town.** ONEP's file (36 towns) has none of them and a web search found no later announcement for Chaiya. No polygon; the pillar is the origin.

## 2. The Tapi
- **The river splits at Tha Kham**, 0.47 km below สะพานจุลจอมเกล้า (split at 9.11708, 99.22371). OSM names both arms แม่น้ำตาปี:
  - **town arm** (OSM 557048595): split → Ban Don (passes 0.15 km from the pillar) → mouth at **9.19189, 99.37922**; 22.8 km along the river.
  - **west arm** (OSM 462700819 + 462700820): split → north → bay at **9.24458, 99.32188**, 8 km NW of the pillar; 24.3 km. This is the "if it splits" channel; it does not pass the town.
- **แม่น้ำพุมดวง (Phum Duang)** joins the Tapi at **9.09894, 99.22962**, 2.1 km above the split and 1.7 km from the bridge (11.1 km SW of the pillar).
- **Width** (across OSM water polygons, every 500 m): town arm **114–448 m, median 194 m**, widening to 300–450 m in the last 3 km; west arm 79–455 m, median 123 m. OSM has no water polygon for the 3.5 km through the town, so there I read it from the imagery: **about 105–190 m beside the pillar** (the reach between Ko Lamphu and the town bank is the narrow part, ~105–135 m), 160–190 m at the night-ferry pier, 250–300 m from 3 km downstream.
- **Rail:** the Southern Line crosses the Tapi once, at สะพานจุลจอมเกล้า (9.11282, 99.22381, 11.1 km W of the pillar), **above** the split. It does not cross either arm or the Phum Duang. OSM tags the Chulachomklao structure as the road bridge on ถ.ราษฎร์บำรุง; the rail line is on the same spot.
- **Ko Lamphu:** OSM way 242787629, 11.4 ha, 650 × 350 m, 0.7 km W of the pillar, in the town arm. Two smaller unnamed islands sit in the town arm 1.2–1.4 km N (1.7 and 2.4 ha); two more in the mouth 9.4–9.8 km NE (2.1 and 13.4 ha).
- **Bay shoreline:** OSM natural=coastline, in the geojson as `bay_shoreline`.

## 3. Pins (distance and bearing from the pillar)
| group | place | km | dir | source / note |
|---|---|---|---|---|
| town | ศาลากลางจังหวัด (current, ถ.ดอนนก) | 1.35 | SE | Google; the old riverfront hall was **not found** (Google returns only the current hall) |
| town | ที่ว่าการอำเภอเมือง (riverfront) | 0.38 | SW | candidate for the old hall, **not confirmed** |
| town | ท่าเทียบเรือสุราษฎร์ธานี / ท่าเรือบ้านดอน (night ferry to Ko Tao) | 0.49 | N | OSM node 2502419676; Google 60 m |
| town | ศาลเจ้ากวนอู (Chinese shrine, old market) | 0.92 | NE | Google |
| town | ตลาดศาลเจ้า | 0.86 | NE | Google |
| town | ตลาดล่าง (area centre) | 2.17 | NE | Google; area, not a building |
| town | เกาะลำพู | 0.70 | W | OSM way 242787629 |
| town | Chak Phra / long-boat reach (riverfront by Ko Lamphu) | 0.43 | SW | approximate, Google "ริมน้ำแม่น้ำตาปี" |
| crossing | สถานีรถไฟสุราษฎร์ธานี (Phun Phin) | 10.74 | W | OSM way 937312515 |
| crossing | สะพานจุลจอมเกล้า (Tha Kham) | 11.16 | W | OSM way 1330203990 |
| crossing | สะพานศรีตาปี (road) | 0.16 | NW | Google |
| crossing | สะพานนริศ (road) | 0.74 | N | Google |
| far | วัดพระบรมธาตุไชยา | 31.0 | NW | Google; OSM 76 m |
| far | ท่าทอง (Kanchanadit) | 27.6 | E | area name only; **no pin for the old-town site** |
| far | ท่าเรือดอนสัก | 51.0 | NE | OSM node 4704126649 (Google's hit was offshore, not used) |
| far | ท่าเรือหน้าทอน, Ko Samui | 80.4 | NE | Google; OSM 0.4 km |
| far | ท่าอากาศยานสุราษฎร์ธานี | 19.6 | W | Google |
| far | โรงเรียนนาสาร (first school-rambutan tree) | 37.2 | S | the school; the tree itself not pinned |

Not found: the old riverfront provincial hall, the Tha Thong old-town site, the rambutan tree itself.
