# Chanthaburi map work [local], PR #86

Origin for every distance below: **ศาลหลักเมืองจันทบุรี** (Ban Lum old town, in front of ค่ายตากสิน), `12.61616, 102.11061` (OSM; gem's pin is 18 m off). It is the third town's centre and the place Taksin gathered his men in 2310, so it works as the "heart as origin" here too.

Files:
- `chanthaburi_oldtown.geojson`: the **ONEP old-town boundary**, traced from the ONEP boundary map (see §1). It is not a walled square.
- `chanthaburi_osm.geojson`: the Chanthaburi River centreline from above the town to the Laem Sing mouth (OSM ways 27163513 + 27163449), river water areas, and the named town roads (ท่าหลวง, ศรียานุสรณ์, เบญจมราชูทิศ, ตรีรัตน์, สุขาภิบาล, ศรีจันทร์). Pulled from Overpass 2026-11-06.
- `chanthaburi_story_places.geojson`: 22 places (research §6 + the ONEP temples + the mouth bridge), each with distance, bearing, octant, and a `pin` field saying whether the pin was checked against OSM.
- `chanthaburi_town_core.jpg`: the town core with the ONEP outline, the river and the core places.
- `chanthaburi_story_places.jpg`: everything from the town down the river to the mouth, rings at 2.5/10/20 km.
- `onep_boundary_map.jpg`: the ONEP boundary map page (north up) the outline was traced from.

## 1. ONEP old town: a river strip, not a walled square

Source: โครงการกำหนดขอบเขตพื้นที่เมืองเก่าจันทบุรี (ONEP, 2555), `nced.onep.go.th/opendata/2568/oldtown36_announce/chanthaburi.pdf`, §5.3 and the map on p.14.

- **Area:** **0.45 km² (278.60 ไร่)**. Core zone 0.14 km² (86.97 ไร่): วัดโบสถ์เมือง, วัดจันทนาราม, the cathedral and the Chanthabun waterfront. Buffer zone 0.31 km² (191.63 ไร่).
- **Shape:** a **~1.2 km × 0.57 km strip** running **NNW→SSE (long axis ~150°)** along the river bend. The west bank (the Chanthabun waterfront, ถ.สุขาภิบาล) is the body. A **100 m strip on the east bank** takes in วัดจันทนาราม at the north end and bulges round the cathedral grounds. bbox `102.1112–102.1192 E, 12.6053–12.6158 N`.
- **Edges (ONEP text):** north = ถ.ศรียานุสรณ์ + the roundabout on ทางหลวง 3150 (ถ.ท่าหลวง), across the river to วัดจันทนาราม; east = 100 m from the east bank, round the cathedral; south = ถ.ตรีรัตน์ (the gem market sits on this edge); west = ถ.ศรียานุสรณ์ → ถ.เบญจมราชูทิศ.
- **Trace:** I pulled the red dotted line out of the map by colour and georeferenced it on 5 OSM pins (ศาลากลางเก่า, วัดกลาง, วัดโบสถ์เมือง, วัดจันทนาราม, the cathedral), with residuals of 2–7 m. The traced polygon is 0.38 km², about 15% under ONEP's 0.45 because it follows the inside edge of the dashes. Read it as a slightly tight outline. Overlaid on OSM, the river runs down the middle of it, which checks out.
- **The Narai/Taksin wall is not in this boundary.** ONEP §5.2.1 and ผ.2.1 put the Ban Lum wall (**~1,000 × 2,000 m**, laterite, from King Narai's time) inside today's **ค่ายตากสิน**, with earth-wall traces also by the old ศาลากลาง and the post office. Only fragments survive (the west wall and moat line inside the camp). So the 2310 "smash" beat's walled town sits **west/north-west of the river strip**, round the camp and the city pillar, and it was much bigger than the 0.45 km² heritage zone.

## 2. Dates ONEP fixes (research §3 marked one as not found)

- **The town moves back from Noen Wong to Ban Lum in พ.ศ. 2419 (ร.5).** ONEP ผ.2 p.ผ3, quoting ประทีป ชุมพล 2538: people drifted back early because Noen Wong lacked fresh water, and in 2419 King Chulalongkorn moved the town back officially, with พระองค์เจ้ากาพยกนกรัตน์ laying out the new plan. Research §3 listed this year as "not found".
- **French occupation: 2436–2447, 12 years** (ONEP, quoting ตรี อมาตยกุล 2514). After it came มณฑลจันทบุรี in 2449.
- **ค่ายเนินวง:** "กว้าง 14 เส้น ยาว 15 เส้น" = **560 × 600 m**, ~622 ไร่ registered, laterite walls with gates on 4 sides, วัดโยธานิมิต inside. Research §4 has 500 × 600 m; ONEP's 14 เส้น is 560 m.

## 3. Pins: what I checked against OSM

Most of gem's §4/§6 pins are good, within ~100 m. Four are off:
- **อาสนวิหาร: gem's `12.6119, 102.1156` is 444 m NW of the real church** (OSM `12.60923, 102.11864`). gem's pin lands near วัดจันทนาราม. Use the OSM pin: the cathedral is at the **south-east** bulge of the old-town strip, across the river from the gem market, 1.16 km SE of the city pillar.
- **เขาพลอยแหวน:** gem's pin is 1.3 km NE of วัดเขาพลอยแหวน (OSM `12.60923, 102.04027`), 7.7 km W of the city pillar.
- **ค่ายเนินวง:** I used วัดโยธานิมิต inside the camp (`12.58657, 102.06974`). gem's pin is 270 m off.
- **คุกขี้ไก่** is **350 m due east** of ตึกแดง (OSM `12.48146, 102.06568`), not south-east.
- Unchecked (gem only): เมืองเก่าบ้านหัววัง, ตึกฝรั่งเศสในค่ายตากสิน, ลานพลอยบางกะจะ. The first วัดน้อย church site has no pin (research says none was found).

### Town core (≤1.2 km from the city pillar)
ตึกฝรั่งเศส 0.10 NNW · ศาลากลางเก่า 0.14 SSE · วัดโบสถ์เมือง 0.38 SE · วัดกลาง 0.38 SSE · ค่ายตากสิน 0.40 NNW · ชุมชนริมน้ำจันทบูร 0.51 SE · วัดจันทนาราม 0.62 ESE (east bank) · บ้านหัววัง 0.67 ENE (east bank) · ศาลากลางใหม่ 1.07 SW · ตลาดพลอย 1.15 SSE · อาสนวิหาร 1.16 SE (east bank).

### Out of town (bearing from the city pillar)
วัดทองทั่ว 4.70 SE · ลานพลอยบางกะจะ 4.84 SW · **เมืองเพนียด 5.00 SE** · **ค่ายเนินวง 5.52 SW** · เขาพลอยแหวน 7.67 W · **อู่ต่อเรือเสม็ดงาม 10.1 SSW** · สะพานตากสินมหาราช 15.7 SSW · คุกขี้ไก่ 15.8 SSW · ตึกแดง 15.9 SSW · **ป้อมไพรีพินาศ 16.5 SSW**.

## 4. The river (for `path` and the fleet beat)

- It flows **through town roughly N→S, curving SE round the old-town bend**, then runs **SSW to the sea**. The mouth at Laem Sing is **16.5 km SSW** of the city pillar in a straight line, and **~24 km along the OSM centreline** (research says ~30 km by water).
- **West bank:** city pillar, ค่ายตากสิน, the waterfront, the gem market. **East bank:** วัดจันทนาราม, บ้านหัววัง, the cathedral. Research §4 says the same and it matches OSM.
- **Width:** ~50–80 m through town; 800–1,000 m at the mouth, where สะพานตากสินมหาราช is 1,060 m long (research §4).
- **Fleet beat geography:** the shipyard at เสม็ดงาม is 10 km down the river on the lower reach. The fleet then sails ~6 km more past the forts (ป้อมไพรีพินาศ on the **west** headland, ตึกแดง/คุกขี้ไก่ on the **east** bank) into the Gulf.
- **Mueang Phaniat is off the river,** 5 km SE at the foot of เขาสระบาป, east of the main channel. The "move" beat goes from an inland site to the river bank.

## 5. Hand to cloud

- `city.outline` = `chanthaburi_oldtown.geojson`: a ~1.2 × 0.57 km NNW–SSE strip along the river bend, mostly west bank, plus a 100 m east-bank strip with วัดจันทนาราม (north) and the cathedral (south-east). It is not a rectangle; camera keys need re-framing for a long thin town.
- The **2310 walled town (~1 × 2 km)** belongs **west/north-west** of that strip, round ค่ายตากสิน and the city pillar. It is gone today except fragments in the camp.
- **The cathedral pin is the OSM one** (`12.60923, 102.11864`), not gem's.
- **Captions:** the Noen Wong → Ban Lum move back is **2419** (ONEP); the French held the town **2436–2447**; Noen Wong is **560 × 600 m** by ONEP.
