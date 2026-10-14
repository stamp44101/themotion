# City brief — Ayutthaya / พระนครศรีอยุธยา

> **Research-only brief for Ayutthaya v2 (75 s).**
> Reconstructs the historical island capital from primary cartography, Fine Arts Department surveys, and UNESCO World Heritage documentation. Does not modify `src/engine/`, `src/Overlay.tsx`, or existing city files.

---

## 1. Footprint

Ayutthaya does not appear in ONEP's published "36 old towns" announcement set used for several other cities in this repository. In accordance with the handoff guidance, this brief uses the official Fine Arts Department archaeological survey (กรมศิลปากร) and UNESCO World Heritage property documentation (Property 576, inscribed 1991).

### Historical Perimeter and Dimensions
- **Surrounding Rivers:** Chao Phraya River (แม่น้ำเจ้าพระยา) to the west and south, Lopburi River / Khlong Mueang (แม่น้ำลพบุรีเดิม / คลองเมือง) to the north, and Pa Sak River / Khu Khue Na (แม่น้ำป่าสัก / คูขื่อหน้า) to the east.
- **Physical Wall Dimensions (Fine Arts Department):**
  - Perimeter length: approximately 12,500 m (12.5 km).
  - Wall thickness: 5 m (masonry brick rampart over earth core).
  - Wall height: 6 m.
  - Fortifications: 16 forts / bastions (ป้อมปืน), 18 city gates (ประตูเมือง), 16 postern gates (ประตูช่องกุด), and 20 water gates (ประตูน้ำ). *(Note: The Fine Arts Department summary notes a grand total of "99 ประตู" by incorporating all canal sluices, minor palace wickets, and embankment steps recorded in royal chronicles such as Khamhaikan Chao Krung Kao).*
- **Chronology of Construction:**
  - Initial foundation (1350 CE / BE 1893, King U Thong): Earthen rampart with timber palisade (เชิงเทินดินและค่ายคอยถม).
  - Brick reconstruction (c. 1549–1568 CE / c. BE 2092, King Maha Chakkraphat): Rebuilt as heavy masonry brick ramparts with stone-faced bastions and arched water gates to withstand Burmese cannon fire.

### Model Coordinate Space
- **Scale:** 1 world unit = 80 metres ($+x = \text{east}$, $+z = \text{south}$).
- **Model Centre (Centroid):** Latitude 14.3538193° N, Longitude 100.5624322° E (Datum WGS84).
- **Metric Conversion Factors at 14.35° N:**
  - Latitude: $110,642\text{ m/degree}$ ($1\text{ unit} \approx 0.000723°\text{ lat}$).
  - Longitude: $107,935\text{ m/degree}$ ($1\text{ unit} \approx 0.000741°\text{ lon}$).
- **Overall Bounding Dimensions:**
  - East-West width: 3,896 m (48.7 world units, from $x = -25.5$ to $x = 23.2$).
  - North-South height: 2,608 m (32.6 world units, from $z = -14.6$ to $z = 18.0$).
  - Perimeter: 11,951 m (~12.0 km, agreeing with the surveyed 12.5 km brick wall).
  - Walled island surface area: 6.71 km² (leaves outer riverbeds, sandbars, and foreign settlements properly outside the wall).

### Proposed `city.outline` (14 Defensible Vertices)
Traced from the surviving brick ramparts documented in Phraya Boran Ratchathanin’s survey map (แผนที่เกาะเมืองอยุธยา พ.ศ. 2449–2469), verified against the 1687 French diplomatic survey (*Plan de la Ville de Siam, Cour de Siam*) and Fine Arts Department Master Plan 2519/2536:

```ts
// Ayutthaya historical city island brick wall perimeter (1 unit = 80 m, +x east, +z south)
// Centered at lat 14.3538193, lon 100.5624322
outline: [
  [-20.8, -13.8], // 1. NW corner bastion (Pom Satkop / Khlong Phu Khao Thong junction)
  [ -6.5,  -7.2], // 2. Behind Grand Palace / Tha Wasukri gate (river hugs palace north wall)
  [  7.0,  -9.5], // 3. North wall mid-section towards Front Palace
  [ 19.5, -12.5], // 4. Front Palace (Wang Na / Chankasem) north wall
  [ 21.8, -14.6], // 5. NE corner bastion (Hua Ro / Pom Maha Chai)
  [ 23.2,  -4.0], // 6. East wall along Pa Sak River facing modern railway station
  [ 22.0,   9.6], // 7. Pom Phet (SE corner bastion at Bang Kaja confluence)
  [ 12.0,   8.0], // 8. South wall east section (facing Dutch settlement across river)
  [ -2.0,  14.2], // 9. South wall center (facing Wat Phutthaisawan / Pratu Chai water gate)
  [-13.0,  14.0], // 10. South wall west section (facing St. Joseph church across river)
  [-22.0,  18.0], // 11. SW corner curve (facing Wat Chaiwatthanaram across Chao Phraya)
  [-25.5,  12.0], // 12. Far west curve (Wat Lokayasutha outer defense line)
  [-24.0,   0.0], // 13. West wall mid-section (facing Wat Kasattrathirat across river)
  [-21.5,  -6.5], // 14. WNW curve returning to northwest bastion
]
```
- **Bounding Half-Extents:** `hx = 26.0`, `hz = 18.5` (safely encloses vertex extremes at x = -25.5 and z = 18.0 with buffer so ring roads and modern houses do not clip into the city).
- **Comparison to Modern OSM Island:** Modern OSM boundary extends into open water at the southern sandbars and northeast river market embankments. The 14-vertex historical polygon keeps all defensive walls on solid ground, holds Pom Phet at the true water corner (`[21.8, 9.6]`), and keeps Wat Chaiwatthanaram (`[-27.8, 15.0]`) and the southern foreign settlements strictly outside the walled enclosure.

---

## 2. Water

Ayutthaya is the ultimate "water city" (Venice of the East). Its hydraulic system served three vital functions: natural moat defense, drainage during the 3–4 month monsoon inundation, and deep-water commercial navigation for ocean-going junks.

### Encircling River Channels

| river / water body | real width (m) | units (80 m/u) | axis / course | position in model | notes |
|---|---:|---:|---|---|---|
| **Lopburi River / Khlong Mueang** (แม่น้ำลพบุรีเดิม / คลองเมือง) | 70–90 m | 0.9–1.1 | Northern boundary (flowing east) | $z \approx -8.0 \to -15.5$ | Ancient Lopburi bed; skirts Grand Palace north gate. |
| **Pa Sak River / Khu Khue Na** (แม่น้ำป่าสัก / คูขื่อหน้า) | 130–160 m | 1.6–2.0 | Eastern boundary (flowing south) | $x \approx 22.5 \to 25.5$ | Dug in 1350 to sever the peninsula; widened in 1570 by King Maha Chakkraphat. |
| **Chao Phraya River (West Loop)** (แม่น้ำเจ้าพระยาเดิม - โค้งตะวันตก) | 140–180 m | 1.8–2.2 | Western boundary (flowing south) | $x \approx -22.0 \to -27.5$ | Sweeping oxbow curve; passes Wat Chaiwatthanaram. |
| **Chao Phraya River (South Channel)** (แม่น้ำเจ้าพระยา - ด้านใต้) | 160–200 m | 2.0–2.5 | Southern boundary (flowing east) | $z \approx 14.5 \to 18.0$ | Main deep-water channel; carries foreign sailing ships. |
| **Bang Kaja Confluence** (ปากน้ำบางกะจะ) | 220–260 m | 2.8–3.2 | Southeast junction | `[22.5, 11.0]` | Pa Sak joins Chao Phraya below Pom Phet; timber and junk anchorage. |

### Major Internal Canals
Based on the NAJUA (2026) architectural waterway reconstruction and the 1687 French engineer survey, five primary internal canals must be visible for the city to read as Ayutthaya:
1. **Khlong Pratu Chai (คลองประตูชัย):** Primary north-south arterial canal (width ~18–22 m, 0.25 units). Connects Khlong Mueang in the north to Pratu Chai water gate in the south.
2. **Khlong Chakrai Yai (คลองฉะไกรใหญ่):** Western north-south canal (width ~15–18 m, 0.2 units). Runs behind the Grand Palace past Wat Lokayasutha.
3. **Khlong Pa Than / Khlong Makham Riang (คลองป่าถ่าน / คลองมะขามเรียง):** Eastern north-south canal (width ~15–18 m, 0.2 units). Runs past Wat Mahathat and Wat Ratchaburana to Bang Kaja.
4. **Khlong Tho (คลองท่อ):** Northern east-west canal linking Chakrai Yai to Pratu Chai.
5. **Khlong Wat Racha / Khlong Klaeng (คลองวัดราช / คลองแกลบ):** Central east-west lateral canal connecting the central spine to the eastern Pa Sak river.

- **Does a river pass through the walls?** No river pierces the city; rather, the city is an island embraced by rivers. Canals enter and exit through 20 fortified masonry water gates (such as Pratu Chai) with arched openings.

---

## 3. Story Beats (75 s Timeline)

Designed for a runtime of **75 seconds** (2,250 frames at 30 fps).
- **Intro title window:** $0.0 \to 3.0$ s (`INTRO_END = 3.0`). No caption on screen before 3.5 s.
- **Finale title window:** $71.0 \to 75.0$ s (`FINALE_START = 71.0`). All captions clear by 70.6 s (before 71.0 s).
- **Kanit typography limit:** Every title is under 820 px at 74 px weight 600. Every subtitle is under 820 px at 40 px weight 400.
- **Exact-year hold rule:** Every exact-date beat holds its stated year steady across its camera shot.

| # | time (s) | CE year | BE year | hold window | confidence | caption title | caption subtitle | source & rationale |
|---|---:|---:|---:|---|---|---|---|---|
| 1 | 3.8–8.8 | 1324 | 1867 | hold 1324 (4.0–7.5s) | **Confirmed** | วัดพนัญเชิง (พ.ศ. 1867) | ชุมชนการค้าโบราณก่อนสร้างพระนครศรีอยุธยา | *Royal Chronicles of Ayutthaya (Luang Prasoet)*: Phra Chao Phanan Choeng cast 26 years before U Thong. Proves established pre-1350 river settlement. |
| 2 | 10.0–15.8 | c. 1350 (1350–1351) | 1893 | hold 1350 (10.5–14.5s) | **Attributed** (traditional date / calendar conversion) | สถาปนากรุงศรีอยุธยา | สมเด็จพระรามาธิบดีที่ 1 ขุดคูขื่อหน้าสร้างเกาะเมือง | UNESCO lists "founded c. 1350". *Royal Chronicles of Ayutthaya (Luang Prasoet)* records Friday, 6th waxing moon, 5th month CS 712 = 4 March 1351 CE (Julian). In traditional Siamese reckoning before Songkran/solar new year, this fell in BE 1893 (conventionally c. 1350 CE). |
| 3 | 17.0–22.8 | 1374–1424 | 1917–1967 | hold 1424 (20.5–22.2s) | **Confirmed** | มหาธาตุและราชบูรณะ | ศูนย์กลางพุทธศาสนาและมหาปรางค์ใจกลางพระนคร | *Wat Mahathat inscription (1374 CE)* and *Royal Chronicles (1424 CE)*: King Borommarachathirat II founds Wat Ratchaburana at cremation site of brothers Chao Ai and Chao Yi. |
| 4 | 24.0–29.6 | 1448 | 1991 | hold 1448 (24.5–28.5s) | **Confirmed** | ย้ายพระราชวังหลวง | สมเด็จพระบรมไตรโลกนาถสถาปนาวัดพระศรีสรรเพชญ์ | *Royal Chronicles*: King Trailokanat dedicates former palace grounds as royal chapel Wat Phra Si Sanphet, moving royal residence north to Lopburi riverfront. |
| 5 | 30.8–36.6 | 1492–1550 | 2035–2093 | hold 1550 (34.0–36.0s) | **Confirmed** | สามเจดีย์และกำแพงอิฐ | เปลี่ยนกำแพงดินเป็นป้อมอิฐหนา 5 เมตรรับศึกปืนใหญ่ | *Fine Arts Dept / Chronicles*: King Ramathibodi II builds first two chedis (1492); King Maha Chakkraphat completes third chedi and encases city in 12.5 km brick fortress with Pom Phet. |
| 6 | 37.8–43.4 | 1569–1590 | 2112–2133 | hold 1590 (41.0–43.0s) | **Confirmed** | เสียกรุงครั้งที่ 1 | สมเด็จพระนเรศวรกอบกู้อิสรภาพและขยายคูพระนคร | *Chronicles*: Fall in 1569 after 9-month siege; King Naresuan expands river defenses, digs Khlong Maha Chai, builds outer forts. *(Elephant duel omitted from island story — see note below).* |
| 7 | 44.6–50.2 | 1630 | 2173 | hold 1630 (45.0–49.0s) | **Confirmed** | วัดไชยวัฒนาราม | พระเจ้าปราสาททองสร้างปรางค์ขอมริมโค้งเจ้าพระยา | *Royal Chronicles*: Built 1630 CE by King Prasat Thong on west riverbank as family memorial and river fortress temple. |
| 8 | 51.4–57.0 | 1687 | 2230 | hold 1687 (52.0–56.0s) | **Confirmed** | มหานครการค้านานาชาติ | ชุมชนโปรตุเกส ฮอลันดา ญี่ปุ่น และคณะทูตฝรั่งเศส | *French Diplomatic Archives (La Loubère, Tachard, Chaumont)*: Cosmopolitan metropolis of 300,000+ residents; VOC brick factory, Portuguese church, Japanese village thriving. |
| 9 | 58.0–63.4 | 1767 | 2310 | hold 1767 (58.5–62.5s) | **Confirmed** | การเสียกรุง พ.ศ. 2310 | 7 เมษายน 2310 กำแพงหัวรอแตก สิ้นสุดราชธานี 417 ปี | *Burmese Hmannan Yazawin / Siamese Chronicles*: Tuesday, 9th waxing moon, 5th month CS 1129 = exactly 7 April 1767. Burmese tunnel and burn Hua Ro wall; royal palaces burnt. |
| 10 | 64.2–67.2 | 1908–1976 | 2451–2519 | hold 1976 (65.5–67.0s) | **Confirmed** | พระยาโบราณราชธานินทร์ | สำรวจขุดแต่งและอนุรักษ์โบราณสถานเกาะเมืองอยุธยา | *Royal Gazette (27 July 1976)*: Rama V & Phraya Boran protect island; 1957 gold crypt discovery at Ratchaburana; 1,810 rai gazetted as Historical Park. Duration 3.0s (>= 2.5s). |
| 11 | 67.8–70.6 | 1991–2026 | 2534–2569 | hold 1991 (68.2–70.4s) | **Confirmed** | มรดกโลกอยุธยา | ยูเนสโกประกาศขึ้นทะเบียนนครประวัติศาสตร์อยุธยา | *UNESCO World Heritage Decision (13 Dec 1991, Carthage)*: Inscribed under criterion (iii). Living heritage city with illuminated ruins. Duration 2.8s (>= 2.5s); clears at 70.6s before 71.0s finale. |

### Evaluation of the Elephant-Duel Beat (ยุทธหัตถี)
- **Investigation:** The royal combat between King Naresuan and Crown Prince Mingyi Swa in January 1593 CE (BE 2135) took place at **Nong Sarai (หนองสาหร่าย), Don Chedi, Suphan Buri** (or alternative traditions at Phanom Thuan, Kanchanaburi), situated 60–80 km west of the capital.
- **Recommendation:** **Remove the elephant-duel from the city-island timeline.** Presenting combat inside the capital misleads the viewer into believing the battle occurred within the city walls. Instead, Beat 6 focuses accurately on the strategic defense of the island capital: strengthening the perimeter brick walls, digging Khlong Maha Chai, and equipping Pom Phet and the naval river fleet.

---

## 4. Landmarks

All coordinates preserve true geographic relationships relative to the model centre (`[0, 0]` at 14.3538193° N, 100.5624322° E):

| landmark | in-model (x, z) | footprint (m) | units | appears (CE) | architectural silhouette & key massing |
|---|---:|---:|---:|---:|---|
| **Wat Phanan Choeng** (วัดพนัญเชิง) | `[21.9, 14.2]` | $65 \times 45$ | $0.8 \times 0.6$ | 1324 | Massive gabled ordination hall housing 19 m seated golden Buddha; river pier at Bang Kaja confluence. |
| **Ancient Grand Palace** (พระราชวังโบราณ) | `[-5.5, -5.4]` | $400 \times 250$ | $5.0 \times 3.1$ | 1448 | Multi-hall royal compound on north river wall: Wihan Somdet (tri-peak spire), Sanphet Prasat (high raised stylobate), Suriyat Amarin (river watch hall). Ruined in 1767. |
| **Wat Phra Si Sanphet** (วัดพระศรีสรรเพชญ์) | `[-5.3, -2.9]` | $150 \times 60$ | $1.9 \times 0.75$ | 1448 / 1492 | Three iconic bell-shaped Ceylonese chedis aligned east-west on connected terrace with three square mondops between them. First 2 chedis appear 1492; 3rd chedi appears 1532. |
| **Wat Mahathat** (วัดมหาธาตุ) | `[6.9, -4.4]` | $120 \times 90$ | $1.5 \times 1.1$ | 1374 | Towering Khmer corbelled prang (originally ~44 m, rebuilt to 50 m in 1633) ringed by cloistered gallery and red-brick chedis. Prang trunk collapses to ruin in 1911. |
| **Wat Ratchaburana** (วัดราชบูรณะ) | `[6.6, -6.8]` | $110 \times 80$ | $1.4 \times 1.0$ | 1424 | Soaring, exceptionally preserved brick Khmer prang (38 m) with intact stucco garudas and royal double-crypt, flanked by front viharn and two bell towers. |
| **Pom Phet Bastion** (ป้อมเพชร) | `[21.8, 9.6]` | $50 \times 40$ | $0.6 \times 0.5$ | 1550 | Thick trapezoidal brick-and-laterite fortress with rounded gun embrasures and cannon revetments guarding the Pa Sak–Chao Phraya water junction. |
| **Wat Chaiwatthanaram** (วัดไชยวัฒนาราม) | `[-27.8, 15.0]` | $140 \times 140$ | $1.75 \times 1.75$ | 1630 | Monumental 35 m central prang on high square terrace, surrounded by 8 satellite meru towers and continuous roofed gallery with 120 seated Buddhas on the west riverbank. |
| **Baan Hollanda (VOC Lodge)** | `[20.0, 18.3]` | $40 \times 25$ | $0.5 \times 0.3$ | 1634 | Two-storey Dutch brick trading lodge with stepped gabled roof, walled brick compound, timber jetty, and VOC flagstaff on south bank of Chao Phraya. |
| **Portuguese Settlement & Church** | `[16.6, 27.8]` | $45 \times 30$ | $0.6 \times 0.4$ | 1540 | Masonry Dominican/Jesuit church of San Pedro with whitewashed bell tower and cemetery south of the city. |
| **Japanese Village (Baan Yipun)** | `[20.2, 29.2]` | $60 \times 50$ | $0.75 \times 0.6$ | 1600 | Timber trading village with Japanese hip-and-gable roofs, ceremonial torii gateway, and boat moorings. |
| **Ayutthaya Railway Station** | `[27.7, -4.0]` | $50 \times 20$ | $0.6 \times 0.25$ | 1897 | Classical colonial-period teak and masonry railway station east across the Pa Sak River. |

---

## 5. Terrain and Palette

- **Terrain:** The central plain of Ayutthaya is an alluvial floodplain with zero natural hills. `peaks` is explicitly left **empty** (`[]`), preserving geographical truth.
- **Water Palette:**
  - Chao Phraya & Pa Sak: Rich golden-brown alluvial silt carrying river reflections.
  - Internal canals: Calmer, deeper greenish-brown reflecting brick walls and overhanging palms.
- **Masonry & Foliage Palette:**
  - Classic Ayutthaya oxidized red terracotta brick, grey-brown laterite foundations, and weathered lime stucco.
  - Gilded copper-brass finials on royal prasats and main prangs.
  - Lush tropical riparian vegetation (samanea rain trees, areca palms, river reeds).
- **Gloom & Destruction Lighting:**
  - **1569 (First Fall):** Subtle desaturation and smoke pall across the east wall.
  - **1767 (Second Fall):** Dramatic fiery amber sky, smoke plumes billowing from Hua Ro and the Grand Palace, roofs collapsed into skeletal timber embers.
  - **1780–1850 (Abandonment):** Overgrown green ruin palette; jungle canopy swallowing red brick rubble.
  - **1991–2026 (Living World Heritage):** Warm dusk twilight with golden floodlights illuminating the three chedis and prangs against a sea of modern urban lights.

---

## 5b. Grandeur (see `docs/grandeur.md`)

1. **The Big Thing:** The **water-girt island itself (7.9 km² total, 6.7 km² within walls)** surrounded by three sweeping river channels, transitioning in the finale into the **vast modern provincial urban fabric filling >40% of the tile**.
2. **The Recognisable Shape:** The unmistakable pear-shaped island wrapped by rivers, bisected by the vertical spine of Khlong Pratu Chai, punctuated by the sharp spires of Wat Phra Si Sanphet, Mahathat, and Chaiwatthanaram.
3. **The Framing Held Across Centuries:** High aerial camera at elevation 32–36° looking south-southwest across the island from above the Grand Palace and Khlong Mueang, taking in the full sweep from Hua Ro to Pom Phet. The viewer witnesses the virgin river fork transform into the golden capital of Siam, burn in 1767, turn into green ruins, and resurrect into an illuminated UNESCO monument.
4. **The Last Frame:** High, wide panorama at dusk showing the illuminated ruins glowing gold inside the Historical Park, surrounded by hundreds of lit windows across modern Phra Nakhon Si Ayutthaya, traffic moving along U-Thong Road, and illuminated tourist dinner cruise boats gliding down the Chao Phraya.

---

## 6. Sound

Ayutthaya is the ancestral heart of the Siamese classical court and maritime commerce:
- **Piphat & Mahori Royal Court Ensemble (`scripts/synth.py`):**
  - **Ranat Ek (ระนาดเอก):** Virtuosic high wooden xylophone runs leading the festive themes.
  - **Pi Nai (ปี่ใน):** Nasal double-reed oboe carrying regal melodic lines.
  - **Khlui (ขลุ่ย):** Soft bamboo flute for introspective and sacred river scenes.
  - **Khong Wong & Gongs (ฆ้องวง / ฆ้องใหญ่):** Resonant bronze gongs marking formal royal proclamations and temple rites.
  - **Ching & Chap (ฉิ่ง / ฉาบ):** Rhythmic time-keeping driving classical meters.
  - **Klong Thad & Taphon (กลองทัด / ตะโพน):** Sacred two-headed temple drums providing bass gravity.
- **International Trading Hub Colors:**
  - European bronze church bells and brass fanfares for French embassies and foreign settlements.
  - Distant Chinese ship gongs and plucked lute flourishes along the river harbour.
- **Chronological Year-Keyed Events:**
  - **1324:** Low sacred chanting and deep temple gong at Wat Phanan Choeng.
  - **1350:** Conch trumpet fanfare (เสียงหอยสังข์) and ceremonial gongs for city founding.
  - **1448:** Palace dedication royal drum fanfare.
  - **1569:** Distant cannon thuds and somber minor tones.
  - **1630:** Serene temple wind chimes at Wat Chaiwatthanaram.
  - **1687:** Grand cosmopolitan court fanfare with European bells and river harbour bustling.
  - **1767:** Violent explosive collapses (Burmese wall mining at Hua Ro), crackling fires, sudden drop to eerie silence.
  - **1897 / 1908:** Steam whistle of the Northern Railway echoing across the Pa Sak.
  - **1991:** Resounding ceremonial chime and triumphal full Piphat crescendo celebrating UNESCO World Heritage inscription.

---

## 7. Sources and Open Questions

### Primary & Official Sources
1. **Fine Arts Department (กรมศิลปากร):**
   - Historical Park overview and city wall dimensions: `http://virtualhistoricalpark.finearts.go.th/ayutthaya/index.php/th/about-us.html`
   - Collection of Historical Maps of Ayutthaya: `http://virtualhistoricalpark.finearts.go.th/ayutthaya/images/ebook/ebook_map.pdf`
   - Royal Gazette (27 July 1976 / 21 January 1997): Historical Park boundary declarations.
2. **UNESCO World Heritage Centre:**
   - Inscription Document 576 (1991): `https://whc.unesco.org/en/list/576/`
   - ICOMOS Technical Evaluation: `https://whc.unesco.org/archive/advisory_body_evaluation/576.pdf`
   - State Party Periodic Report & Master Plan (2018): `https://whc.unesco.org/document/171025`
3. **Cartography:**
   - Phraya Boran Ratchathanin (พระยาโบราณราชธานินทร์), *Map of the City Island of Ayutthaya* (1906–1926 CE).
   - *Plan de la Ville de Siam* (French Diplomatic Embassy Survey / Cour de Siam, 1687 CE / Bellin 1750).
   - Johannes Vingboons, *Afbeeldinge der Stadt Iudiad Hooft des Chooninckrick Siam* (1665 CE).
   - Anonymous Dutch School, *Iudea* (c. 1650 CE, Rijksmuseum Amsterdam).
4. **Historiography & Chronicles:**
   - *Royal Chronicles of Ayutthaya (Luang Prasoet Aksoranit version / พระราชพงศาวดารกรุงศรีอยุธยา ฉบับหลวงประเสริฐ)*.
   - Poomipat Norapoompipat & Kreangkrai Kirdsiri, "Reconstructing the Ayutthaya Kingdom Waterway Network," *NAJUA: History of Architecture and Thai Architecture*, Vol. 23, No. 1 (2026).
   - Chris Baker & Pasuk Phongpaichit, *A History of Ayutthaya: Siam in the Early Modern World*, Cambridge University Press.

### Open Questions & Remaining Uncertainties
1. **Engine River Rendering Limitation:**
   - *Issue:* The existing diorama engine (`Diorama.tsx`) only supports straight, axis-aligned river channels (`axis: 'x' | 'z'`). Ayutthaya is an organic, winding island enveloped by curved rivers.
   - *Resolution:* Engine modification is out of scope for this research pass and forbidden on city branches. An engine branch supporting curved/polyline waterways or polygon river cutouts must land first before this brief is translated into code.
2. **Discrepancy in Gate Counts in Official Texts:**
   - *Issue:* The Fine Arts Department website lists "18 city gates + 16 postern gates + 20 water gates" (which sums to 54), yet concludes "รวมทั้งสิ้น 99 ประตู".
   - *Resolution:* The 99 total reflects *Khamhaikan Chao Krung Kao*, which includes minor wicket doors and palace sub-gates. On-screen captions should mention the major defensive count (54 fortified gates and 16 bastions) to maintain strict physical plausibility.
3. **Secondary Breach Points During 1767 Siege:**
   - *Issue:* While the catastrophic breach was dug and fired at Hua Ro on the northeast wall, secondary assaults crossed the southern and western river loops.
   - *Resolution:* Visually, the primary masonry breach and collapse should be staged at Hua Ro (`[21.8, -14.6]`), with general smoke plumes rising across the palace and temple precincts.
