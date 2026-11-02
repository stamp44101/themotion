# Saraburi map work [local], PR #80

Origin for every distance below: **ศาลหลักเมืองจังหวัดสระบุรี**, OSM node 5589680721 (14.52893, 100.90899). Google Maps has the shrine at the same spot.
A second OSM node, "ศาลเจ้าพ่อหลักเมือง" (node 7520563085), is 440 m east and does not match Google, so I did not use it.

Files:
- `saraburi_osm.geojson`: Pa Sak centreline (Sao Hai to Pak Phriao), the railway, Route 3022, the Route 1/2 fork, the city pillar, and the Bueng Nong Ngong outline (traced, see below).
- `saraburi_story_places.geojson`: the 31 places from research part 6, with gem's point, the Google pin, `off_m` and the distance from the pillar.
- `saraburi_overlay.jpg`: Sao Hai to Pak Phriao on Esri imagery. `saraburi_overlay_wide.jpg`: town to the Footprint.
- `saraburi_story_places.jpg`: the places plotted with rings at 2.5, 10 and 25 km.

## 1. ONEP old town

**Not an announced old town.** ONEP's old-town file (36 towns in 35 provinces) has no Saraburi and no Sao Hai, and a web search found no later announcement. There is no polygon to put here; the city pillar is the origin, as for Phetchabun.

## 2. Pins asked for in the brief

- **Bueng Nong Ngong:** not in OSM as water. Esri z17 shows a horseshoe channel open to the north, west arm top 14.55766, 100.82040, east arm top 14.55528, 100.82458, bottom of the bend 14.55300, 100.82222. The arms are 50–80 m wide; a causeway road crosses the east arm. I traced the centreline (1.0 km) and buffered it 30 m: about 37 rai. Gem says 90 rai; the north ends of both arms are under trees and cloud on the imagery, so the real lake is probably longer than the trace. Google's pin "บึงโง้ง" is on the east arm. It is 9.6 km W of the pillar, about 1 km S of the Pa Sak.
- **Ban Phai Lom Noi (hall 2433):** not found. Neither OSM nor Google has it; Google's nearest hit is Wat Phai Lom (14.54848, 100.87707), a different place, so I left it unpinned.
- **Phahonyothin / Friendship Highway fork:** Route 1 and Route 2 share an OSM node at **14.52110, 100.91445**, 0.9 km SSE of the pillar. Adisorn camp: OSM way 614585109 (centre 14.51641, 100.92148); Google puts ศูนย์การทหารม้า at 14.51965, 100.92558.
- **Tha Chao Sanuk and Route 3022:** Google has วัดตำหนักพระเจ้าทรงธรรม at 14.55774, 100.71993 (gem's point is 1.4 km off). OSM's Route 3022 runs 19.3 km from 14.57086, 100.72629 to 14.71681, 100.78534, near the Footprint; straight-line 17.3 km on a bearing of 22°. It is in `saraburi_osm.geojson` as `route_3022`.

## 3. The Pa Sak, Sao Hai to Pak Phriao, and the railway

- **Centreline:** OSM ways 40268412 + 40268414, cut from Sao Hai town to Pak Phriao: 12.6 km along the river, 8.7 km in a straight line. It meanders; the biggest loops are just west of the town (see the overlay).
- **Width:** measured across OSM's riverbank polygon every 500 m (26 samples): **64–95 m, median 76 m**. Widest (85–95 m) about 7–8 km along from Sao Hai, where it bends past the Route 1 bridge.
- **Railway: confirmed, it does not cross the Pa Sak in town.** No OSM rail way crosses the river anywhere between Sao Hai and 100.96 E. The line runs on the south side all the way: 3–4 km south of the river at Sao Hai, about 450 m south of it at the pillar and at the station (Saraburi station, OSM node 5394772572, 480 m from the centreline). East of town, by the new provincial hall, it comes within 180 m of the river, then it crosses at Kaeng Khoi (gem's bridge point 14.5942, 101.0028), about 12 km NE of the pillar.
- In town, Phahonyothin crosses the Pa Sak on Saphan Amnuai Songkhram (Google 14.53074, 100.91218).

## Story places (research section 6, commit 3226139): pinned and checked [local]

I looked up each of the 31 places on Google Maps and compared it with gem's own lat,lon. Where Google found the place, its pin is used. Distances are from the city pillar. `saraburi_story_places.geojson` has every place with `status`, `era`, gem's point, the Google pin and `off_m`.

### Town core (Pak Phriao), within 2.5 km of the city pillar (5)
- ศาลากลางจังหวัดสระบุรีหลังเก่า (ริมน้ำปากเพรียว) · ยุครัชกาลที่ 5 – พ.ศ. 2562 (ย้ายมาตั้งช่ · 0.1 km SE · Google ✓, gem 88 m off
- สะพานอำนวยสงคราม (ถนนพหลโยธินข้ามแม่น้ำป่าสัก) · ยุคสร้างชาติ (24 มิถุนายน พ.ศ. 2483) · 0.4 km NE · Google ✓, gem 177 m off
- วัดศรีบุรีรตนาราม (วัดปากเพรียว) · ยุคธนบุรี – ปัจจุบัน (พ.ศ. 2321) · 0.7 km E · Google ✓, gem 127 m off
- สถานีรถไฟสระบุรี และย่านตลาดปากเพรียว · ยุครัชกาลที่ 5 – ปัจจุบัน (เปิดเดินรถ 1  · 0.8 km E · Google pin used, gem's point was off, gem 623 m off
- ศูนย์การทหารม้า ค่ายอดิศร และจุดเริ่มต้นถนนมิตรภาพ · ยุคสงครามเย็น (ตั้งค่าย พ.ศ. 2496–2497;  · 2.1 km SE · Google pin used, gem's point was off, gem 499 m off

### Toward Sao Hai and the old town, 3.9–9.6 km W/NW (upriver on the Pa Sak) (7)
- หอวัฒนธรรมพื้นบ้านไทยวนสระบุรี (ต.ดาวเรือง) · ยุคร่วมสมัย (สืบสานมรดก พ.ศ. 2347) · 3.9 km NW · Google pin used, gem's point was off, gem 3148 m off
- หมู่บ้านไทยวนบ้านต้นตาลและตลาดต้าน้ำโบราณวัดต้นตาล อ.เสาไห้ · ยุครัชกาลที่ 1 – ปัจจุบัน (พ.ศ. 2347 – ป · 4.1 km NW · Google ✓, gem 187 m off
- วัดสมุหประดิษฐาราม และชุมชนไทยวนสวนดอกไม้–สร่างโศก อ.เสาไห้ · ยุครัชกาลที่ 1–3 (พ.ศ. 2347 – ราว พ.ศ. 2 · 6.2 km NW · Google pin used, gem's point was off, gem 3911 m off
- คุ้งน้ำเสาร้องไห้และวัดสูง อ.เสาไห้ · ยุคต้นรัตนโกสินทร์ และ พ.ศ. 2501 · 6.9 km W · Google ✓, gem 56 m off
- ตลาดโบราณ 100 ปี นครเสาไห้ (ย่านท่าค้าข้าวเจ๊กเชยริมป่าสัก) · ยุครัชกาลที่ 3–5 – ปัจจุบัน (ราว พ.ศ. 23 · 7.3 km W · Google pin used, gem's point was off, gem 1356 m off
- วัดจันทบุรี ต.เมืองเก่า อ.เสาไห้ · ยุคเมืองเก่าเสาไห้ – รัชกาลที่ 3 (พ.ศ. 2 · 9.2 km W · Google pin used, gem's point was off, gem 1429 m off
- บึงหนองโง้ง (บึงหนองงูเหลือม) และบ้านหัวจวน ต.เมืองเก่า อ.เสาไห้ · ยุคอยุธยาตั้งเมือง – รัชกาลที่ 5 (ราว พ. · 9.6 km W · Google ✓, gem 122 m off

### Phra Phutthabat, 24–25 km NW (4)
- บ่อพรานล้างเนื้อ (ไหล่เขาวัดพระพุทธบาทฯ) · ยุคสมเด็จพระเจ้าทรงธรรม (ราว พ.ศ. 2149 ห · 24.1 km NW · Google ✓, gem 259 m off
- แนวทางรถไฟสายพระพุทธบาทเดิม (ท่าเรือ–บ้านหมอ–พระพุทธบาท) · ยุครัชกาลที่ 5 – สงครามโลกครั้งที่ 2 (พ. · 24.5 km NW · gem's point only (unverified)
- รอยพระพุทธบาทและพระมณฑป วัดพระพุทธบาทราชวรมหาวิหาร · ยุคสมเด็จพระเจ้าทรงธรรม – ปัจจุบัน (ขัดแ · 24.6 km NW · Google ✓, gem 46 m off
- ไหล่เขาสุวรรณบรรพต–เขาโพธิลังกา และเขาหินปูน ต.พุกร่าง (แหล่งขึ้นดอกเข้าพรรษาธรรมชาติ) · ยุคโบราณ – ปัจจุบัน (ออกดอกทุกฤดูฝน เดือ · 24.7 km NW · gem's point only (unverified)

### Other districts (13)
- ศูนย์ราชการและศาลากลางจังหวัดสระบุรีแห่งใหม่ (ต.ตะกุด) · ยุคปัจจุบัน (เปิดใช้งาน พ.ศ. 2562) · 2.8 km E · Google ✓, gem 6 m off
- เพิงผาภาพเขียนสีก่อนประวัติศาสตร์ เขาพระพุทธฉาย · ยุคก่อนประวัติศาสตร์ (ราว 3,000–4,000 ปี · 8.7 km SE · Google pin used, gem's point was off, gem 463 m off
- วัดพระพุทธฉาย (เขาฆาฏกะ) · ยุคสมเด็จพระเจ้าทรงธรรม – ปัจจุบัน (ราว  · 8.7 km SE · Google pin used, gem's point was off, gem 463 m off
- สถานีรถไฟชุมทางแก่งคอย และสะพานรถไฟข้ามแม่น้ำป่าสัก · ยุคขยายโครงข่ายอีสาน (สถานีเปิด 1 พ.ค. 2 · 12.2 km NE · Google pin used, gem's point was off, gem 758 m off
- แหล่งดินมาร์ลบ้านหมอ (ต.บ้านครัว) และโรงงานปูนซิเมนต์ท่าหลวง · ยุครัชกาลที่ 6 – หลังสงครามโลกครั้งที่ 2 · 16.2 km W · Google pin used, gem's point was off, gem 6588 m off
- กลุ่มเหมืองหินปูนและโรงงานปูนซีเมนต์แก่งคอย–ทับกวาง (SCG แก่งคอย / ปูนอินทรี / TPI) · ยุคอุตสาหกรรมหนัก (พ.ศ. 2512–2535 – ปัจจ · 18.4 km NE · Google ✓, gem 41 m off
- แนวถนนฝรั่งส่องกล้อง (ทางช้างเสด็จพระพุทธบาท / ทางหลวง 3022) · ยุคสมเด็จพระเจ้าทรงธรรม (ราว พ.ศ. 2167–2 · 20.4 km NW · gem's point only (unverified)
- พระตำหนักท่าเจ้าสนุก (วัดตำหนักพระเจ้าทรงธรรม อ.ท่าเรือ จ.อยุธยา รอยต่อสระบุรี) · ยุคอยุธยา (ราว พ.ศ. 2167–2310) · 20.6 km W · Google pin used, gem's point was off, gem 1383 m off
- เมืองโบราณขีดขิน (บ้านคูเมือง อ.บ้านหมอ) · ยุคทวารวดี (ราว พ.ศ. 1100–1500) · 21.2 km NW · Google ✓, gem 67 m off
- ผาเสด็จ (อ.แก่งคอย) · ยุครัชกาลที่ 5 (22 ธันวาคม พ.ศ. 2439) · 23.9 km NE · Google ✓, gem 31 m off
- ถ้ำพระโพธิสัตว์ (ถ้ำเขาน้ำพุ อ.แก่งคอย) · ยุคทวารวดี (ราว พ.ศ. 1100–1400) · 26.0 km E · Google ✓, gem 63 m off
- ฟาร์มโคนมไทย-เดนมาร์ค (อ.ส.ค. มวกเหล็ก) · ยุคพัฒนา (16 มกราคม พ.ศ. 2505) · 32.4 km E · Google pin used, gem's point was off, gem 1052 m off
- เขื่อนป่าสักชลสิทธิ์ (ฝั่งซ้าย ต.คำพราน อ.วังม่วง จ.สระบุรี) · ยุคปัจจุบัน (เปิด 25 พฤศจิกายน พ.ศ. 2542 · 40.5 km NE · Google pin used, gem's point was off, gem 3730 m off

### No coordinates (2)
- บ้านหมากสองต้น แขวงเมืองสระบุรี · ยุคอยุธยา (พ.ศ. 2112) · — · no coordinates
- บ้านไผ่ล้อมน้อย อ.เสาไห้ (ที่ตั้งศาลากลางชั่วคราว พ.ศ. 2433) · ยุครัชกาลที่ 5 (พ.ศ. 2433 – ราว พ.ศ. 243 · — · no coordinates

### Gem's points that were more than 1 km off
Use the Google pin, not gem's lat,lon, for these:

- แหล่งดินมาร์ลบ้านหมอ (ต.บ้านครัว) และโรงงานปูนซิเมนต์ท่าหลวง: 6.6 km off; Google `14.56779, 100.76448` (บริษัท ปูนซิเมนต์ไทย (ท่าหลวง) จำกัด (โรงงานท่าหลวง))
- วัดสมุหประดิษฐาราม และชุมชนไทยวนสวนดอกไม้–สร่างโศก อ.เสาไห้: 3.9 km off; Google `14.55448, 100.85808` (วัดสมุหประดิษฐาราม)
- เขื่อนป่าสักชลสิทธิ์ (ฝั่งซ้าย ต.คำพราน อ.วังม่วง จ.สระบุรี): 3.7 km off; Google `14.86163, 101.06599` (เขื่อนป่าสักชลสิทธิ์)
- หอวัฒนธรรมพื้นบ้านไทยวนสระบุรี (ต.ดาวเรือง): 3.1 km off; Google `14.55542, 100.88486` (หอวัฒนธรรมพื้นบ้านไทยวน)
- วัดจันทบุรี ต.เมืองเก่า อ.เสาไห้: 1.4 km off; Google `14.55875, 100.82966` (วัดจันทบุรี)
- พระตำหนักท่าเจ้าสนุก (วัดตำหนักพระเจ้าทรงธรรม อ.ท่าเรือ จ.อยุธยา รอยต่อสระบุรี): 1.4 km off; Google `14.55774, 100.71993` (วัดตำหนักพระเจ้าทรงธรรม)
- ตลาดโบราณ 100 ปี นครเสาไห้ (ย่านท่าค้าข้าวเจ๊กเชยริมป่าสัก): 1.4 km off; Google `14.55111, 100.84494` (ตลาดร้อยปีเสาไห้)
- ฟาร์มโคนมไทย-เดนมาร์ค (อ.ส.ค. มวกเหล็ก): 1.1 km off; Google `14.63327, 101.19015` (ฝ่ายท่องเที่ยว ฟาร์มโคนมไทย-เดนมาร์ค)

### Notes
- The rail line does not cross the Pa Sak in town, as gem says. Its Pa Sak bridge is at Kaeng Khoi, about 12 km NE. In town, Phahonyothin crosses on Saphan Amnuai Songkhram.
- The old provincial hall (now the Mueang Saraburi district office) is next to the city pillar, about 100 m away. The new provincial hall at Takut is 2.7 km NE.
- **No coordinates:** บ้านหมากสองต้น แขวงเมืองสระบุรี; บ้านไผ่ล้อมน้อย อ.เสาไห้ (ที่ตั้งศาลากลางชั่วคราว พ.ศ. 2433). Google's hit for Ban Phai Lom Noi was Wat Phai Lom, a different place, so I did not use it.
- Pa Sak Chonlasit Dam: gem pinned the left-bank works in Saraburi; Google's pin is the dam itself, 3.7 km away. Either is fine at this distance (40 km out).
- Phra Phutthabat (the Footprint, Bo Phran Lang Nuea, Khao Pho Lanka) is one cluster 24–25 km NW of the pillar, and the old line and Farang Song Klong road run toward it from Tha Ruea/Ban Mo.
