# Uttaradit map work [local], PR #87

Origin for every distance below: **อนุสาวรีย์พระยาพิชัยดาบหัก in front of the provincial hall**, `17.62966, 100.09742`
(OSM node 8500444881). It is the heart of today's town (Bang Pho Tha It) and the site of the January fair.

Files:
- `phichai_wall.geojson`: the **Phichai wall and moat**, traced from the Treasury Department's boundary survey (see §1), plus the
  older wall line that runs south-west to the Nan.
- `uttaradit_osm.geojson`: the Nan centreline from above Sirikit dam to below Phichai (OSM ways 400328476, 36848429, 76586910,
  40137447-9) and the northern railway in the province (66 OSM ways). Pulled from Overpass on 8 Nov 2026.
- `uttaradit_story_places.geojson`: 20 places, each with distance, bearing, octant, and a `pin` field saying how the pin was
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
- **Date the Treasury gives:** **the provincial seat moved from Phichai to Uttaradit in พ.ศ. 2457**, and Phichai became an
  amphoe (เมืองเก่าพิชัย, later อ.พิชัย). This is one of the years the brief marks as not found (the web often says 2458).
  Wait for gem's answer before captioning it.

## 2. Pins: what I checked against OSM

All pins below are OSM features; none come from gem yet (research is still running). Four need research to say what they
are:
- **ท่าอิฐ:** OSM has no landing, only ถ.ท่าอิฐล่าง (the pin) on the **east bank inside the Nan's loop**, 1.3 km E of the
  monument. The old port area may be on either bank; wait for research §4/§6.
- **ศาลพระยาพิชัยดาบหัก (ตะวันออก)** at 17.26919, 100.23816, 43 km SSE: a second shrine 16 km east of Phichai. It may be the
  hero's home village; unconfirmed.
- **บ่อเหล็กน้ำพี้:** OSM has the pit and its shrine (`17.5405, 100.29965`) and the village 2.6 km NW. The pits are
  **23.6 km ESE** of the monument, in the hills east of the Nan, not in town.
- **สถานีศิลาอาสน์:** 1.1 km NNE of the monument. It may have been a railhead for a while; wait for research.

### Town core (≤ 3 km from the monument)
ที่ว่าการอำเภอเมือง 0.43 SSW · ตลาดสดเทศบาล 0.99 S · สถานีอุตรดิตถ์ 1.03 S · สถานีศิลาอาสน์ 1.14 NNE ·
วัดท่าถนน 1.14 S · ท่าอิฐ (road) 1.31 E · ท่าเสา 2.83 NE.

### Out of town (bearing from the monument)
ค่ายพระยาพิชัยดาบหัก 5.1 NE · วัดพระบรมธาตุทุ่งยั้ง 5.5 SW · วัดพระแท่นศิลาอาสน์ 6.7 WSW · วัดพระฝาง 13.7 E ·
บ้านน้ำพี้ 20.7 ESE · **บ่อเหล็กน้ำพี้ 23.6 ESE** · **เมืองพิชัยเก่า 36.1 S** · วัดมหาธาตุ / ศาลเจ้าพ่อ / สถานีพิชัย 37.6-37.9 S ·
ศาลพระยาพิชัย (ตะวันออก) 42.8 SSE · **เขื่อนสิริกิติ์ 51.5 ENE**.

## 3. The river and the railway

- **The Nan** comes out of Sirikit dam heading west-south-west, swings in a big loop round the east side of today's town (Tha
  It, Tha Sao), then runs **south**. It passes **west** of Phichai's wall and on to Phitsanulok.
- **Today's town is on the west bank;** the monument, the hall, the market and both stations are 0.3-1 km west of the river.
- **The railway** runs N-S along the west side of the town (Uttaradit station 1 km S of the monument, Sila At 1.1 km NNE),
  then curves east to Tha Sao. At Phichai it passes **~0.4 km east of the wall**, outside the town and not through it.

## 4. Hand to cloud

- The **Phichai beat (2316)** needs the wall as a long NNW-SSE four-sided town, ~1.35 km × ~0.5 km, on the **east bank**, with
  the river to its south-west and an old Nan channel to its east. `city.outline` = `phichai_wall.geojson`.
- **Bang Pho Tha It** (today's town) is a **different tile 36 km north**: west bank, inside the Nan's loop, with the railway
  along its west side.
- The **Nam Phi pits** are 24 km ESE of town in hills. For the cover, the iron comes from there, not from Phichai.
- **Caption check:** the seat's move is **2457** in the Treasury survey. Do not caption it until research confirms.
