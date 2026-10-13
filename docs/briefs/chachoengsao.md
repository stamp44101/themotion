# City brief — Chachoengsao / ฉะเชิงเทรา (แปดริ้ว)

Copy of `docs/city-brief.template.md` prepared for Chachoengsao.

---

## 1. Wall footprint

Traced from the Fine Arts Department historical registration (ราชกิจจานุเบกษา เล่มที่ 71 ตอนที่ 3, 5 มกราคม 2497) and ONEP Old Town Chachoengsao boundary:
- **Location:** Thanon Maruphong, Tambon Na Mueang, Mueang Chachoengsao, on the east bank of the Bang Pakong River.
- **Built:** 1834 CE (พ.ศ. 2377) under King Rama III by Krom Luang Rakronnaret to guard the eastern border and Bang Pakong water approach during the Siamese-Vietnamese War (สงครามอานามสยามยุทธ).
- **Fortress Dimensions:**
  - East-West width: ~280 m
  - North-South length: ~540 m
  - Height originally ~4.9 m with merlons and embrasures (currently preserved at ~3 m high with cannons mounted).
  - Bastions at the northwest and southwest river corners facing the Bang Pakong River.
- **Shape in words:** Rectangular brick citadel oriented north-south along the eastern bank of the Bang Pakong River.
- **`city.outline` in world units** (1 unit = 80 m, recentred on centroid):
  - Extents in metres: 280 m (x) × 540 m (z)
  - Extents in units: 3.50 units (x) × 6.75 units (z)
  - `hx = 1.75`, `hz = 3.38`
  ```ts
  // Rectangular fortress along the eastern bank of the river
  outline: [
    [-1.75, -3.38],
    [ 1.75, -3.38],
    [ 1.75,  3.38],
    [-1.75,  3.38],
  ]
  ```

---

## 2. Water

Dimensions in **metres first**, then converted:

| river / canal | real width (m) | units (80 m/u) | axis | position | notes |
|---|---|---|---|---|---|
| Bang Pakong River (แม่น้ำบางปะกง) | ~220 m | 2.75 | Z (curves slightly) | west of fortress (x ≈ -3.2) | Wide alluvial river flowing south to the Gulf of Thailand |
| Khlong Tha Khai (คลองท่าไข่) | ~25 m | 0.32 | X | north of fortress (z ≈ -3.8) | Historic canal connecting inland farming / Talat Ban Mai |

- **Does a river pass through the walls?** No. The Bang Pakong River flows immediately west of the fortress wall; the fortress was built deliberately on the river bank to interdict hostile naval flotillas.
- **Confluences & water features:**
  - Khlong Tha Khai enters the Bang Pakong just north of the fortress.
  - Mangrove and nipa palm (จาก) fringed banks.

---

## 3. Story beats

Every date carries a confidence level:

| CE year | BE year | event | confidence | source |
|---|---|---|---|---|
| 1548 | 2091 | Early Ayutthaya settlement & troop mobilization center under King Maha Chakkraphat | attributed (สันนิษฐานว่า) | พระราชพงศาวดารกรุงศรีอยุธยา / เอกสารประวัติศาสตร์เมือง |
| 1767 | 2310 | Phraya Tak (King Taksin) marches east through Paet Riu after the fall of Ayutthaya; clashes with Burmese troops at Pak Nam Jolo | confirmed | พระราชพงศาวดารกรุงธนบุรี |
| 1770 | 2313 | Enshrinement of Luang Pho Sothon at Wat Hong (later renamed Wat Sothon Wararam) after floating down Bang Pakong | attributed (ตำนานพระพุทธโสธร) | ประวัติวัดโสธรวรารามวรวิหาร |
| 1834 | 2377 | King Rama III orders Krom Luang Rakronnaret to construct the brick walled fortress & bastions against Vietnamese/Khmer threat | confirmed | จดหมายเหตุรัชกาลที่ 3 / กรมศิลปากร |
| 1848 | 2391 | The Ang-Yi (Secret Society) Rebellion: Chinese sugarcane/mill workers seize the town; imperial forces storm and retake the fortress | confirmed | พระราชพงศาวดารกรุงรัตนโกสินทร์ รัชกาลที่ 3 |
| 1897 | 2440 | King Rama V visits Chachoengsao; establishes Monthon Prachinburi center under Prince Marubongs Siripat | confirmed | ราชกิจจานุเบกษา / ประวัติศาสตร์มณฑล |
| 1908 | 2451 | Eastern Railway line opens from Bangkok to Chachoengsao with steel bridge across Bang Pakong; river trading boom at Talat Ban Mai | confirmed | ประวัติการรถไฟแห่งประเทศไทย |

- **Era labels:**
  - 1548–1766: กรุงศรีอยุธยา (Eastern Outpost / ลุ่มน้ำบางปะกง)
  - 1767–1833: กอบกู้เอกราช & ตำนานหลวงพ่อโสธร
  - 1834–1847: ป้อมปราการรัชกาลที่ 3 (อานามสยามยุทธ)
  - 1848–1896: ศึกปราบกบฏอั้งยี่ & ชุมชนค้าขายริมน้ำ
  - 1897–1920: ยุคปฏิรูปมณฑล & ทางรถไฟสายตะวันออก
- **Clip duration:** 60 s (1800 frames at 30 fps)

---

## 4. Landmarks

| name | real location relative to river/walls | in-model (x, z) | appears (CE) | notes |
|---|---|---|---|---|
| **Pom Mueang Chachoengsao (ป้อมและกำแพงเมือง)** | East bank of Bang Pakong | Centered at x=0, z=0 | 1834 | Brick parapets, merlons, bastions on corners with cannons |
| **City Pillar Shrine (ศาลหลักเมือง)** | Inside/adjacent to northern fort wall | x=0.5, z=-2.2 | 1834 | Thai-style pavilion shrine |
| **Wat Sothon (วัดโสธรวรารามวรวิหาร)** | South down river (~3.5 km real; compressed for diorama) | x=-1.5, z=4.5 | 1770 | Early wooden/brick viharn with Luang Pho Sothon image |
| **Talat Ban Mai (ตลาดบ้านใหม่ 100 ปี)** | North at mouth of Khlong Tha Khai | x=-1.8, z=-4.2 | 1880 | Stilted wooden riverside shophouses on water's edge |
| **Eastern Railway Bridge (สะพานรถไฟบางปะกง)** | Crossing Bang Pakong River north of fortress | spans x=-4.5 to -1.5 at z=-5.0 | 1908 | Steel truss railway bridge |

---

## 5. Terrain and palette

- **Hills:** **None.** Chachoengsao is flat alluvial floodplain along the lower Bang Pakong delta. `peaks` array left empty.
- **Ground / vegetation:** Deep alluvial soils, nipa palms (ป่าจาก), banana/coconut groves, and rice paddies.
- **Sky / ground colour keys:**
  - Lush green delta ground (`#4a6741`), murky brown-green river (`#3e5c54`).
- **Gloom / smoke periods:**
  - 1848 CE (frame ~850–1000): Smoke and fire during the Ang-Yi rebellion clash at the fort.

---

## 6. Sound

- **Regional instrument palette:**
  - Pi reed (ปี่), Ching (ฉิ่ง), Khong Wong (ฆ้องวง), Ranat Ek (ระนาดเอก), deep battle drum (กลองทัด).
  - River ambient sounds (water lapping, paddle strokes, temple bell for Wat Sothon, cannon shots for 1848).
- **Events to hit, keyed to year:**
  - 1770 CE: Temple bell chime (Luang Pho Sothon enshrinement).
  - 1834 CE: Stone/masonry building percussion (Fortress completion).
  - 1848 CE: Cannon blasts & war drums (Ang-Yi rebellion).
  - 1908 CE: Steam train whistle (Eastern Railway opening).

---

## 7. Open questions

1. *Exact coordinate of King Rama III's Governor Palace:* Historically located inside the fort enclosure (now provincial administration grounds); represented as the traditional wooden Thai-colonial compound within the walls.
2. *Wat Sothon distance scaling:* In reality ~3.5 km south of the fort; in a diorama frame of 80m/unit, we position it at the southern river bend edge of the diorama tile so it can be visited during camera moves.
