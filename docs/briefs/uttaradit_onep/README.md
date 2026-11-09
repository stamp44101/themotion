# Uttaradit map work [local], PR #87

Origin for every distance below: **อนุสาวรีย์พระยาพิชัยดาบหัก in front of the provincial hall**, `17.62966, 100.09742`
(OSM node 8500444881). It is the heart of today's town (Bang Pho Tha It) and the site of the January fair.

Files:
- `phichai_wall.geojson`: the **Phichai wall and moat**, traced from the Treasury Department's boundary survey (see §1), plus the
  older wall line that runs south-west to the Nan.
- `uttaradit_osm.geojson`: the Nan centreline from above Sirikit dam to below Phichai (OSM ways 400328476, 36848429, 76586910,
  40137447-9) and the northern railway in the province (66 OSM ways). Pulled from Overpass on 8 Nov 2026.
- `uttaradit_story_places.geojson`: 29 places (OSM plus research §6), each with distance, bearing, octant, and a `pin` field saying how the pin was
  checked.
- `phichai_oldtown.jpg`: the traced wall on Esri imagery, with the river and the railway.
- `uttaradit_town_core.jpg`: today's town: the hall, the stations, the market, Tha It and Tha Sao on the Nan.
- `uttaradit_story_places.jpg`: everything from Phichai to the dam, rings at 10, 20 and 40 km.

## 1. Phichai: a long walled town on the east bank of the Nan

Source: **การกำหนดขอบเขตที่ดินกำแพงเมืองคูเมือง เมืองพิชัย, ทะเบียน อต 69-2, บ้านหน้าพระธาตุ ต.ในเมือง อ.พิชัย**
(กรมธนารักษ์, scanned PDF at treasury.go.th), p.3 text and the p.10 survey map.

- **Shape and size (Treasury text):** a long four-sided town. North wall **645 m**, south wall **419 m**, and the long east
  side **1,345 m**, with a fort outside the middle of the east wall. The long axis runs **NNW-SSE (~155°)**. The traced
  polygon is ~0.54 km² (perimeter 3.3 km).
- **Two builds (Treasury text):** the first town stood on the river bank on the east side of the Nan. The river ate the bank
  and silted up, so only its north and south walls survive, joined to the east wall, with **2 forts outside the town**. Later
  the town was enlarged eastward with a new long rectangular wall joined to the old one. The orange dashed line in the plot is
  that older wall running south-west towards the river.
- **Water:** an old course of the Nan (คลองวัดไทร) runs ~1 km east of the town and drains to the Nan ~1 km south of the south
  wall. Today the Nan's main channel is ~0.4-0.6 km south-west of the wall.
- **The road through it:** the Phichai-Tron road cuts the old town in two (Silpakorn thesis); it does in the trace too.
- **Trace:** the p.10 map has a UTM grid (zone 47N, labels 614200 E / 1912200 N, 200 m scale bar). I read it as Indian 1975
  datum, then shifted it **+110 m east** so the east moat lies on the tree-lined moat visible in the imagery. With that shift
  the moat line and the road both line up. Treat the trace as **±100 m**.
- **It is not today's Phichai town.** The walls are **~1.5 km north-north-west** of อำเภอพิชัย, the station and Wat Mahathat.
  It is **36 km S** of the Uttaradit monument.
- **Dates disagree on the seat's move.** The Treasury survey says the seat moved from Phichai to Uttaradit in **พ.ศ. 2457**.
  Gem's research (§1, §5) says the seat moved in **2442** and the name changed from เมืองพิไชย to เมืองอุตรดิฐ on
  **16 Aug 2458** (Royal Gazette). Cloud decides; the Gazette date is the strongest source.
- **Gem's centre pin for old Phichai is off.** Research §4/§6 puts it at `17.2945, 100.0865`, which is inside today's อ.พิชัย,
  and gives it as 600 × 1,000 m against the river. The Treasury survey and the trace put the wall **~1.4 km north-west** of it,
  at บ้านหน้าพระธาตุ, where OSM also has a bridge named บ้านหน้าพระธาตุ. Gem's own วัดหน้าพระธาตุ pin
  (`17.3017, 100.0842`) falls on the traced east wall, which supports the trace. Use the trace.

## 2. Pins: what I checked

OSM pins are marked `osm` in the geojson; gem-only pins are marked `gem (unchecked)`.
- **ท่าเรือบางโพท่าอิฐ:** **use gem's pin, on the west bank in front of วัดท่าถนน** (`17.6195, 100.0986`; OSM has the wat
  2 m away). OSM's ถ.ท่าอิฐล่าง is across the river inside the loop; it carries the name but is not the old landing.
- **Phichai, gem-only pins (no OSM):** **บ้านห้วยคา**, the hero's birthplace, is 0.5 km NW of the wall's NW corner. **ทุ่งวัดเอกา**,
  the 2316 field where the sword broke (local history), is 1.6 km SW of the wall **across the Nan on the west bank**. If the
  fight was there, the beat crosses the river.
- **จวนผู้ว่าราชการหลังเก่า** (gem only, `17.6269, 100.0990`) is 0.35 km SSE of the monument, on the river. It is where the seat
  sat from 2442.
- **ศาลพระยาพิชัยดาบหัก (ตะวันออก)** at 17.26919, 100.23816, 43 km SSE, is in OSM but not in the research. Leave it out.
- **บ่อเหล็กน้ำพี้:** OSM and gem agree (`17.5405, 100.2997`, 50 m apart). It is **23.6 km ESE** of the monument, in the hills
  east of the Nan, not in town. Gem gives บ่อพระแสง as ~20 m across and ~10 m deep, and บ่อพระขรรค์ as ~12 m and ~7 m.
- **Within ~200 m of OSM:** gem's pins for บ้านดารา (120 m), เวียงเจ้าเงาะ (165 m), the ลับแล gate (120 m), ต้นสักใหญ่ (80 m)
  and วัดพระฝาง (190 m). I used the OSM pins.

### Town core (≤ 3 km from the monument)
ที่ว่าการอำเภอเมือง 0.43 SSW · ตลาดสดเทศบาล 0.99 S · สถานีอุตรดิตถ์ 1.03 S · สถานีศิลาอาสน์ 1.14 NNE ·
จวนผู้ว่าเก่า 0.35 SSE · ท่าเรือบางโพท่าอิฐ / วัดท่าถนน 1.14 S · แหล่งกลองมโหระทึก 1.45 SSW · ท่าเสา 2.83 NE.

### Out of town (bearing from the monument)
ค่ายพระยาพิชัยดาบหัก 5.1 NE · วัดพระบรมธาตุทุ่งยั้ง 5.5 SW · เวียงเจ้าเงาะ 5.9 WSW · ประตูเมืองลับแล 6.1 WNW ·
วัดพระแท่นศิลาอาสน์ 6.7 WSW · วัดพระฝาง (สวางคบุรี) 13.7 E · บ้านน้ำพี้ 20.7 ESE · **บ่อเหล็กน้ำพี้ 23.6 ESE** ·
สะพานปรมินทร์ / บ้านดารา 27.5 S · บ้านห้วยคา 35.7 S · **เมืองพิชัยเก่า 36.1 S** · วัดหน้าพระธาตุ 36.5 S · **ทุ่งวัดเอกา 37.3 S** ·
วัดมหาธาตุ / ศาลเจ้าพ่อ / สถานีพิชัย 37.6-37.9 S · ต้นสักใหญ่ 50.1 E · **เขื่อนสิริกิติ์ 51.5 ENE**.

## 3. The river and the railway

- **The Nan** comes out of Sirikit dam heading west-south-west, swings in a big loop round the east side of today's town (Tha
  It, Tha Sao), then runs **south**. It passes **west** of Phichai's wall and on to Phitsanulok.
- **Today's town is on the west bank;** the monument, the hall, the market and both stations are 0.3-1 km west of the river.
- **The railway** runs N-S along the west side of the town (Uttaradit station 1 km S of the monument, Sila At 1.1 km NNE),
  then curves east to Tha Sao. At Phichai it passes **~0.4 km east of the wall**, outside the town and not through it.

## 4. Hand to cloud

- The **Phichai beat (2316)** needs the wall as a long NNW-SSE four-sided town, ~1.35 km × ~0.5 km, on the **east bank**, with
  the river to its south-west and an old Nan channel to its east. `city.outline` = `phichai_wall.geojson`.
- **Bang Pho Tha It** (today's town) is a **different tile 36 km north**: the town is on the west bank with its landing at
  วัดท่าถนน, the Nan loops round its east side, and the railway runs along its west side (Uttaradit station 2452, Sila At 2501,
  which pulled the town north).
- The **Nam Phi pits** are 24 km ESE of town in hills. For the cover, the iron comes from there, not from Phichai.
- **Caption check:** the seat moved in **2442** (gem) or **2457** (Treasury); the name changed on **16 Aug 2458** (Gazette, via
  gem). Caption the 2458 renaming; caption the move only once its year is settled.
- **The 2316 fight:** gem places the sword breaking at ทุ่งวัดเอกา on the **west bank**, opposite the walled town. That is local
  history, not chronicle.
