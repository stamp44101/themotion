# City brief — Nakhon Sawan / นครสวรรค์ (ปากน้ำโพ / เมืองพระบาง)

Copy of `docs/city-brief.template.md` prepared for Nakhon Sawan.

---

## 1. Wall footprint & Old Town (เมืองพระบาง / นครสวรรค์)

Traced from Fine Arts Department archaeological surveys and Nakhon Sawan provincial historical records:
- **Ancient Name:** เมืองพระบาง (Phra Bang) — southern frontier fortress town of the Sukhothai Kingdom, mentioned in Sukhothai Stone Inscription No. 2 (Wat Si Chum Inscription, ~1350s CE).
- **Location & Boundary:**
  - The ancient core of Phra Bang / old Nakhon Sawan lay on the west bank of the Ping River / Upper Chao Phraya, between the foot of Khao Kob / Khao Khat and Wat Hua Mueang (now Wat Nakhon Sawan).
  - Later expanded eastward and southward towards the waterfront trading quarters of Pak Nam Pho during the Thonburi and early Rattanakosin periods.
  - In 1785 CE (พ.ศ. 2328, Nine Armies War), King Rama I's royal army fortified the ancient moat and earth ramparts (คูเมืองเชิงเทินดิน) around Ban San Khu (บ้านสันคู) / Thung San Khu west of the town to block Burmese forces marching south.
- **Citadel / Moated Town Dimensions:**
  - Ancient moated enclosure: ~640 m east-west × ~880 m north-south.
  - In world units (1 unit = 80 m): 8.0 units (x) × 11.0 units (z).
  - Centered at `[-7.0, -1.0]` (west of the river channel on dry alluvium below the eastern slope of Khao Kob).
- **`city.outline` in world units** (1 unit = 80 m):
  - `hx = 3.5`, `hz = 5.5`
  ```ts
  // Ancient Phra Bang moated town west of Ping / Chao Phraya
  outline: [
    [-11.5, -6.5],
    [ -4.5, -6.5],
    [ -4.5,  4.5],
    [-11.5,  4.5],
  ]
  ```

---

## 2. Water (ปากน้ำโพ — ต้นกำเนิดแม่น้ำเจ้าพระยา)

Dimensions in **metres first**, then converted (1 unit = 80 m):

| river / water body | real width (m) | units (80 m/u) | axis | position | notes |
|---|---|---|---|---|---|
| **Chao Phraya River** (แม่น้ำเจ้าพระยา) | ~280 m | 3.50 | Z | x = -2.0, span: [0, 50] | Flows south from confluence at Pak Nam Pho (z ≥ 0) towards Ayutthaya / Bangkok. Carries boats & timber rafts. |
| **Ping River** (แม่น้ำปิง) | ~200 m | 2.50 | Z | x = -2.0, span: [-50, 0] | Flows from north (Chiang Mai/Tak), clear greenish alluvial water, meeting Nan River at z = 0. |
| **Nan River** (แม่น้ำน่าน) | ~220 m | 2.75 | X | z = 0.0, span: [-0.25, 46] | Flows from east/northeast (Nan/Phitsanulok), reddish-brown silt, joining Ping at x = -2.0 to form Chao Phraya. |
| **Bueng Boraphet** (บึงบอระเพ็ด) | ~800 m+ lake edge | ~10.0 | - | x > 28, z in [-25, -5] | Thailand's largest freshwater wetland/lake situated east of Pak Nam Pho. |

- **Does a river pass through the walls?** No. The ancient city lies west of the Ping/Chao Phraya channel.
- **Confluences & Unique Features:**
  - **Pak Nam Pho Confluence (แม่น้ำสองสี):** Greenish-blue Ping meets reddish-brown Nan at `[-2.0, 0.0]`.
  - **Laem Koh Yom (แหลมเกาะยม):** Triangular promontory between Nan River and Chao Phraya River, site of **Pasan (อาคารพาสาน)** at `[-0.4, 1.4]`.
  - **Timber Rafts (แพซุง):** During 1850–1950, giant teak rafts floated down the Ping and Nan rivers, tethered along the Pak Nam Pho banks.

---

## 3. Story beats (60 s Timeline)

Every date carries a confidence level:

| CE year | BE year | event | confidence | source |
|---|---|---|---|---|
| ~1357 | 1900 | Founding of Mueang Phra Bang as Sukhothai southern border fortress; ancient earth rampart & Wat Hua Mueang (Wat Nakhon Sawan) | confirmed | ศิลาจารึกสุโขทัยหลักที่ 2 (จารึกวัดศรีชุม) |
| 1569 | 2112 | Renamed "Nakhon Sawan" under Ayutthaya; strategic navy gathering point and royal granary along river route | confirmed | พระราชพงศาวดารกรุงศรีอยุธยา |
| 1785 | 2328 | Nine Armies War (สงครามเก้าทัพ): King Rama I fortifies Thung San Khu moat and ramparts to halt northern Burmese army | confirmed | พระราชพงศาวดารกรุงรัตนโกสินทร์ รัชกาลที่ 1 |
| 1870 | 2413 | Pak Nam Pho river boom: Great teak log depot & floating market; Chinese 5-dialect merchant community thrives | confirmed | จดหมายเหตุเสด็จประพาสต้น / ประวัติเมืองนครสวรรค์ |
| 1901 | 2444 | Cholera epidemic overcome by sacred talisman; birth of Chao Pho Thepharak & Golden Dragon Parade (ประเพณีแห่มังกรทอง) | confirmed | ประวัติศาลเจ้าพ่อเทพารักษ์-เจ้าแม่ทับทิม / ประเพณีตรุษจีนปากน้ำโพ |
| 1905 | 2448 | Northern Railway line reaches Pak Nam Pho (Nakhon Sawan station); steam trains connect central plains to the north | confirmed | ประวัติการรถไฟแห่งประเทศไทย |
| 1950 | 2493 | Dechatiwong Bridge (สะพานเดชาติวงศ์) opens across Chao Phraya; becomes the "Gateway to the North" (ประตูสู่ภาคเหนือ) | confirmed | กรมทางหลวง / ราชกิจจานุเบกษา |
| 1981 | 2524 | Phra Chulamani Chedi erected atop Khao Khiriwong; golden landmark overlooking the four rivers | confirmed | ประวัติวัดคีรีวงศ์ นครสวรรค์ |
| 2019 | 2562 | Pasan (อาคารพาสาน) inaugurated at the tip of Koh Yom as the architectural symbol of the Chao Phraya river origin | confirmed | เทศบาลนครนครสวรรค์ |

- **Era labels:**
  - 1357–1568: สุโขทัย (เมืองพระบาง)
  - 1569–1784: อยุธยา (เมืองนครสวรรค์)
  - 1785–1900: เมืองท่าปากน้ำโพ & แพซุง
  - 1901–1949: มังกรทอง & ทางรถไฟสายเหนือ
  - 1950–2026: ประตูสู่ภาคเหนือ & พาสาน
- **Clip duration:** 60 s (1800 frames at 30 fps)

---

## 4. Landmarks

| name | real location relative to river/walls | in-model (x, z) | appears (CE) | notes |
|---|---|---|---|---|
| **Wat Nakhon Sawan (วัดหัวเมือง)** | West bank near ancient town center | `[-6.5, -1.0]` | 1357 | Ancient Sukhothai-era temple with brick chedi and ordination hall |
| **San Khu Earth Moat (คูเมืองสันคู)** | West perimeter of ancient town | `[-11.0, -1.0]` | 1357 / 1785 | Ancient moat & earthen redoubt where Rama I camped |
| **Chao Pho Thepharak Shrine (ศาลเจ้าพ่อเทพารักษ์-เจ้าแม่ทับทิม)** | North bank facing Pak Nam Pho confluence | `[-4.6, -0.6]` | 1870 | Chinese riverside shrine with tiled pavilion & ceremonial lanterns |
| **Floating Houses & Teak Rafts (แพซุงปากน้ำโพ)** | Along east bank of Ping/Chao Phraya | `[-1.5, 3.5]` | 1850 | Floating raft houses and tied teak logs along the water |
| **Golden Dragon Parade (มังกรทองปากน้ำโพ)** | Waterfront promenade near Pak Nam Pho market | `[-4.8, 1.4]` | 1901 | Golden dragon body with ceremonial poles and red flags |
| **Pak Nam Pho Railway Station (สถานีรถไฟปากน้ำโพ)** | East bank inland along railway line | `[18.0, 8.0]` | 1905 | Classical wooden/brick railway station building |
| **Dechatiwong Bridge (สะพานเดชาติวงศ์)** | Crossing Chao Phraya River south of Pak Nam Pho | spans `x = [-4.0, 0.0]` at `z = 12.0` | 1950 | Classic green steel truss bridge crossing the Chao Phraya River |
| **Phra Chulamani Chedi (พระจุฬามณีเจดีย์ วัดคีรีวงศ์)** | Summit of Khao Khiriwong | `[-13.5, -4.5]` (elevation y ≈ 3.4) | 1981 | Multi-tiered golden pagoda atop the mountain |
| **Pasan Landmark (อาคารพาสาน)** | Tip of Laem Koh Yom promontory | `[0.8, 2.2]` | 2019 | Curving multi-span organic architectural bridge-building |

---

## 5. Terrain and palette

- **Hills (Peaks):**
  - **Khao Kob & Khao Khiriwong:** Real isolated limestone ridge rising directly west of downtown Nakhon Sawan.
  - Peak 1 (Khao Khiriwong / Dao-wa-dueng summit): `[-13.5, -4.5, 3.5, 6.0]`
  - Peak 2 (Khao Kob northern ridge): `[-15.0, -11.0, 2.4, 5.0]`
- **Water Appearance:**
  - River intersection highlights the "Two-Colored River" (แม่น้ำสองสี) aesthetic:
    - Northern Ping River: cleaner greenish blue.
    - Eastern Nan River: silty reddish/golden brown.
    - Combined Chao Phraya: rich alluvial flow carrying river barges.
- **Ground / vegetation:**
  - Wetland reeds around Bueng Boraphet to the east.
  - Mountain forest on Khao Khiriwong.
  - Urban settlement clustered on the west bank along the river bend.

---

## 6. Sound (ดนตรีที่เข้ากับนครสวรรค์อย่างลึกซึ้ง)

Nakhon Sawan is the quintessential **meeting point of rivers and cultures**:
- **Central Thai River Heritage:**
  - ขลุ่ย (Khlui) และระนาด (Ranat) บรรเลงทำนองอ่อนช้อยของลำน้ำเจ้าพระยา
  - เสียงน้ำไหลสองสายมาบรรจบกัน (Confluence water ambience)
- **Chinese-Pak Nam Pho Festivity (ตรุษจีนปากน้ำโพ):**
  - กลองเชิดสิงโต / กลองมังกร (Chinese festival drums: หนักแน่น มีชีวิตชีวา)
  - ฉาบใหญ่ / ฉาบจีน (Chinese brass cymbals: แช้งๆ ให้ความมงคล)
  - ฆ้องจีน (Chinese rising gong)
  - สายกู่เจิง / ขิม (Guzheng metal pluck) โซโล่ทำนองสำเนียงจีน-ไทยผสมผสาน
- **Industrial & Modern Transitions:**
  - หวูดรถไฟไอน้ำ (1905)
  - เสียงประทัดเฉลิมฉลองตรุษจีนปากน้ำโพ (1901 และ Finale)

---

## 7. Open questions

- **Ancient Phra Bang Wall Construction:** Sources describe earth ramparts (เชิงเทินดินและคูค่าย) rather than heavy brick crenellations like Ayutthaya; we model earth ramparts and wooden palisades for Phra Bang, transitioning to masonry in later periods.
- **Dechatiwong Bridge alignment:** Crosses Chao Phraya River at south of confluence; modeled at `z = 12.0` spanning across the full 3.5-unit river channel on sturdy concrete piers.
