# Yasothon map work [local], PR #89

Origin for every distance: **ศาลเจ้าพ่อหลักเมืองยโสธร**, `15.79152, 104.14332` (OSM way 1564102761), the heart of Ban Sing Tha.

Files:
- `yasothon_story_places.geojson`: 21 pins, each with distance, bearing, octant and a `pin` field that says how it was checked.
- `yasothon_osm.geojson`: OSM features pulled on 10 Nov 2026:
  - the Chi (ways 448436403 and 448436402);
  - streams, ponds and the Phaya Thaen water;
  - trunk, primary and secondary roads, including Chaeng Sanit (ทล.23) and route 202;
  - one `old_quarter_estimate` polygon (see §1).
- `yasothon_town_core.jpg`: the pins on Esri imagery, with a 0.005° grid, the Chi in blue, the roads in orange and the old quarter in pink.
- `yasothon_story_places.jpg`: the wide view out to Tat Thong, Dong Mueang Toei and Si Than.

## 1. No ONEP outline exists for Yasothon
- Yasothon is not on ONEP's list of old-town boundary documents (`onep.go.th/data/oldtown-boundary-doc.csv`, checked 10 Nov).
- The ONEP cultural-environment pages that gem cited have no coordinates. Site 6830 returns 404, and site 2888 is rendered by JavaScript with no geometry.
- The `old_quarter_estimate` polygon is my own trace from imagery and OSM. **It is not a legal boundary.** It holds the dense old blocks between the riverside park on the Chi and Chaeng Sanit road, about 1.1 × 0.6 km, running NW–SE.

## 2. Corrections to the brief and gem's part 6
- **The Chi runs N–S along the west side of the old town, not W–E to its south.**
  - It enters from the NW at about (15.82, 104.10), bends south at (15.800, 104.134), and passes about 400–600 m west of Wat Mahathat and Wat Sing Tha.
  - It then swings SW below 15.785.
  - The OSM centreline sits near the east bank in the imagery. The channel is about 150–200 m wide.
- **A long pond (บุ่ง) lies between the temples and the river.** It is OSM's สวนสาธารณะริมชี, about 600 × 120 m. The old town sits on the terrace east of it.
- **Old landing:** pinned on the Chi bank due west of Wat Sing Tha, at the south end of the riverside park (15.7898, 104.1385). This is an estimate. Gem's point (15.7885, 104.1475) is 1 km inland, among shophouses.
- **Bridge:** the road bridge nearest the old town crosses the Chi NW of the park (OSM way 561113262, 15.799, 104.1345). Gem's "bridge south of Sing Tha" (15.7825, 104.1458) is ponds and fields, with no bridge.
- **Phaya Thaen Park and the launch area are 1.3–1.7 km EAST of the old town,** around the large Phaya Thaen water:
  - the toad museum and Wiman Phaya Thaen stand on its west dike;
  - the park and stadium are at its south end, where Chaeng Sanit crosses the outflow.
  - Gem's launch-park point (15.8018, 104.1516) falls in the town's northern streets.
- **I could not identify the launch towers (ฮ้าน) in the imagery.** Treat the tower spot as the dike between the park (15.783, 104.153) and the museum (15.791, 104.155).
- **Provincial hall: unverified.**
  - Official address: ถ.แจ้งสนิท ต.ในเมือง.
  - The pin is the government compound on the east side of Chaeng Sanit at 15.802, 104.1395, which holds the PAO (OSM node 7857167720), with the police station across the road.
  - Wikipedia's coarse 15°47.6′ / 104°08.7′ lands 1 km SE, among shophouses, so I did not use it.
- **Monument to Phra Sunthon Ratchawongsa: unverified.** The round plaza at the south end of the riverside park (15.7894, 104.1405) is the likely spot. Gem's latitude matches it, but gem's longitude is 600 m east.

## 3. Pins
Each row gives the number, the place, distance and bearing from the city pillar, and how the pin was checked.

**Old town**
- **1** ศาลเจ้าพ่อหลักเมือง (origin): OSM
- **2** วัดสิงห์ท่า, 106 m SW: OSM
- **3** วัดมหาธาตุ (พระธาตุพระอานนท์), 309 m N: OSM
- **4** หอไตร, 321 m N: OSM
- **5** พิพิธภัณฑ์เมืองเก่าบ้านสิงห์ท่า, 29 m SE: OSM
- **6** ย่านตึกแถวการค้าเก่า, 95 m E: gem's point, which fits the museum block

**The river side**
- **7** ท่าน้ำเก่าบ้านสิงห์ท่า, 550 m W: estimated from imagery
- **8** สวนสาธารณะริมชี (บุ่ง), 441 m W: OSM
- **9** ลานวงกลม / อนุสาวรีย์ (?), 383 m SW: from imagery, unverified
- **10** สะพานข้ามชี, 1,259 m NW: OSM

**The new town**
- **11** ถนนแจ้งสนิท, 239 m NE: OSM
- **12** ศาลากลาง (candidate), 1,235 m N: unverified
- **13** ตลาดสด, 631 m NE: OSM

**The festival side**
- **14** สวนสาธารณะพญาแถน, 1,399 m SE: OSM
- **15** พิพิธภัณฑ์พญาคันคาก, 1,255 m E: OSM, 100 m from gem's point
- **16** วิมานพญาแถน, 1,295 m E: OSM
- **17** บึงพญาแถน, 1,701 m E: OSM water, unnamed in OSM
- **18** สะพานแจ้งสนิทข้ามทางน้ำออกบึง, 1,611 m SE: from imagery

**Far places, sub lines only**
- **19** บ้านตาดทอง / พระธาตุก่องข้าวน้อย, 8.0 km SE: gem's point. An OSM ruins node is 480 m away.
- **20** ดงเมืองเตย, 20.8 km SE: gem's point, unchecked
- **21** บ้านศรีฐาน, 21.0 km E: gem's point, unchecked

Every story place in town lies within about 1.7 km of the pillar. Seen from above, the layout runs west to east: river, pond, old town, Chaeng Sanit, festival water.
