# Ratchaburi: ONEP old town and OSM pull [local]

## ONEP
Source: `https://www.onep.go.th/data/oldtown.rar` → `oldtown_all.shp` (the same file as Lampang, Suphanburi and Nakhon Pathom; 62 records, WGS84 degrees, `oldtown_all.prj` copied here unchanged).

**Ratchaburi is an announced old town: เมืองเก่าราชบุรี, OT_CODE 24, group 2 (records 46 and 47).** `ratchaburi_oldtown_onep.geojson` holds both polygons with every attribute from the `.dbf`:

| role | zone | ONEP AREA | measured | extent |
|---|---|---|---|---|
| `onep_old_town` | 1 พื้นที่เมืองเก่า | 1.56 km² | 1.56 km² | ~1,770 × 1,450 m |
| `onep_continuation_zone` | 2 พื้นที่ต่อเนื่อง | 0.61 km² | outer ring 2.17 km² (a band around zone 1; 2.17 − 1.56 = 0.61) | ~1,990 × 1,660 m |

Dates in the record: AGREE 2017-04-10, NOTICE 2017-05-12, subcommittee 2017-06-29.

The zone 1 polygon takes in the bend of the Mae Klong: Wat Mahathat sits in its north-west part, the national museum in the part south of the bend, and the Southern Line crosses the river along its eastern edge.

## OSM (`ratchaburi_osm.geojson`, pulled 2026-10-30 via Overpass)
Each feature has a `role` property:

- `mae_klong_river`: centreline, ways 301356780, 1460457503, 1460457504 (clipped to 13.42–13.62 N, 99.70–99.92 E). `mae_klong_water`: the water-area polygons through town, ways 116376554 and 126583120.
- `wat_mahathat` node 2578808292 (Wat Mahathat Worawihan) and `wat_mahathat_prang` node 2578808283 (its prang, tagged as a tower).
- `national_museum_old_provincial_hall`: Ratchaburi National Museum, relation 12906115. OSM tags it only as the museum; the brief's "old provincial hall" is the cloud's to confirm.
- `provincial_hall_new`: ศาลากลางจังหวัดราชบุรี, way 951493985.
- `station_ratchaburi` node 259729391; `southern_line` and `southern_line_bridge` (named Southern Line ways, clipped). The **Mae Klong rail bridge** is ways 193610152 (156 m) and 979943338 (1,059 m, the newer long viaduct), crossing at 13.5414, 99.8242; `road_bridge` way 138205385 (ถนนรถไฟ) runs beside it at the same crossing.
- Road bridges over the Mae Klong: Phetkasem Road ways 40233494 / 73129928 (cross at 13.5509, 99.8194, ~300 m each) and the Ratchaburi bypass ways 83069580 / 232347487 (cross at 13.5401, 99.8418, ~910 m each). Other bridged road ways in town are included as `road_bridge` too.
- `kiln_tao_hong_tai`: Tao Hong Tai Ceramics Factory, node 4585665489. `kiln_museum_ratburi_old_jar`: Ratburi Old Jar Museum (รัตนโกสินทร์เซรามิก 4), node 11212240057.
- `chedi_hak_ruins`: Chedi Hak, node 13204637701 (historic=ruins).
- `khao_ngu_stone_park` node 5583404134 and `wat_tham_khao_ngu` node 6970739125.
- `khu_bua_ancient_town`: Ban Khu Bua Ancient City, node 5583402621 (archaeological site); `ban_khu_bua_village` node 5356201733; `station_ban_khu_bua` node 5274916039.

**Not in OSM** (searched by name in the box): any old city wall, moat or gate (`กำแพงเมือง`, `คูเมือง`, `ประตูเมือง`, `historic=citywalls`); Koi Ki old market (`โคยกี๊`, `ตลาดเก่า`); the older dragon-jar kilns beyond Tao Hong Tai (`โอ่ง`, `เตา`, `ceramic`, `kiln`); a Thai Yuan village or cultural centre (`ไทยวน`, `ยวน`, `วัฒนธรรม`). Ban Khu Bua is pinned, but nothing in OSM marks it as Thai Yuan. These need another source (Google pins or the gem's research).

## Measurements (from Wat Mahathat, 13.5475, 99.8143)
- Mae Klong: the centreline is 480 m E at its nearest; width through town about **143 m** (median of 15 cross-sections within 1.5 km; range 110–208 m).
- Prang: 110 m S (the node is on the temple grounds).
- Tao Hong Tai: 1.1 km W. Chedi Hak: 1.8 km W.
- National museum: 0.8 km SE. New provincial hall: 2.0 km S. Ratchaburi station: 2.2 km SE.
- Khao Ngu stone park: 4.8 km NW (Wat Tham Khao Ngu 5.0 km). Ratburi Old Jar Museum: 4.9 km N.
- Ban Khu Bua village 6.2 km S, Khu Bua ancient town 7.1 km S, both just off the Southern Line (Ban Khu Bua station 6.3 km S).

So the old town, the temple, Tao Hong Tai and the rail bridge all sit within about 2 km of the Mae Klong bend; Khao Ngu (NW) and Khu Bua (S) are each 5–7 km out, outside a single town tile.

`ratchaburi_overlay.jpg` is a plain plot (town core with the ONEP zones, and the wide view out to Khao Ngu and Khu Bua), not a satellite image.

## Story places (research section 6, commit 232cc75): pinned and checked [local]

Coordinates are gem's own; I checked each name against OSM search (Nominatim) and against the OSM pins above. `ratchaburi_story_places.geojson` has every pinned place with `status`, `era`, gem's lat,lon and the OSM match.

### Town core, within 2.5 km of Wat Mahathat (16)
- วัดมหาธาตุวรวิหารและกำแพงแก้วศิลาแลง · ยุคชยราชปุรี–อยุธยาตอนต้น (พ.ศ. 1734 – ร · 0.1 km S · OSM search ✓, 46 m off
- แนวกำแพงเมืองและคูเมืองโบราณราชบุรีฝั่งตะวันตก · ยุคชยราชปุรี–อยุธยา (พ.ศ. 1734–2360) · 0.2 km S · near a [local] OSM pin ✓, 119 m off
- กำแพงเมืองราชบุรีฝั่งตะวันออก 6 ป้อม 6 ประตู และศาลเจ้าพ่อหลักเมือง (ค่ายภาณุรังษี) · ยุครัชกาลที่ 2 (พ.ศ. 2360) · 1.3 km E · gem's point only (unverified)
- ชุมชนบ้านญวนริมแม่กลองและรองอาสนวิหารนักบุญยอห์น บอสโก (ถ.คทาธร) · ยุครัชกาลที่ 4 (พ.ศ. 2406) · 1.5 km S · gem's point only (unverified)
- ชุมชนจีนตลาดริมน้ำและศาลเจ้าพ่อกวนอู (โรงเจเหล่าซินเฮงตั๊ว ถ.วรเดช) · ยุครัชกาลที่ 4–5 – ปัจจุบัน · 0.7 km S · near a [local] OSM pin ✓, 107 m off
- ตลาดเก่าโคยกี๊ (ย่านการค้าริมน้ำถนนวรเดช–พานิชเจริญ) · ยุครัชกาลที่ 5 – ปัจจุบัน (รุ่งเรืองราว  · 1.1 km SE · near a [local] OSM pin ✓, 456 m off
- สะพานจุฬาลงกรณ์ (สะพานดำ) · ยุครัชกาลที่ 5 – สงครามโลกครั้งที่ 2 (เป · 1.3 km SE · OSM search ✓, 21 m off
- สถานีรถไฟราชบุรี · ยุครัชกาลที่ 5 (เปิดเดินรถ 1 เม.ย. 2446) · 2.1 km SE · OSM search ✓, 74 m off
- ศาลารัฐบาลมณฑลราชบุรีและศาลากลางจังหวัดหลังเก่า (พิพิธภัณฑสถานแห่งชาติ ราชบุรี) · ยุครัชกาลที่ 5–6 (ย้ายที่ว่าการกลับฝั่งต · 0.8 km SE · near a [local] OSM pin ✓, 10 m off
- ตลาดสนามหญ้าและหอนาฬิกาเมืองราชบุรี · ยุคจัดตั้งเทศบาลเมือง (พ.ศ. 2478 – พ.ศ.  · 1.1 km SE · near a [local] OSM pin ✓, 337 m off
- โรงโอ่งเถ้าฮงไถ่ (ถ.เจดีย์หัก) · ยุคขยายตัวโรงโอ่ง – ยุคเซรามิกร่วมสมัย ( · 1.1 km SW · near a [local] OSM pin ✓, 215 m off
- สะพานธนะรัชต์ · ยุคพัฒนาเมืองสมัยใหม่ (พ.ศ. 2503) · 1.2 km SE · OSM search ✓, 60 m off
- สะพานสิริลักขณ์ (ทางหลวงหมายเลข 4 ถนนเพชรเกษม) · ยุคขยายเมืองสู่ทางหลวงสายหลัก (พ.ศ. 2493 · 1.8 km NE · OSM found, but far from gem's point, 1179 m off
- ศาลากลางจังหวัดราชบุรีหลังใหม่ (ถ.สมบูรณ์กุล) · ยุคขยายศูนย์ราชการสมัยใหม่ (ย้ายเข้าเมื่ · 2.0 km S · near a [local] OSM pin ✓, 21 m off
- เขื่อนรัฐประชาพัฒนาและประติมากรรมโอ่งมังกรยักษ์พ่นน้ำ · ยุคปัจจุบันและฉากจบ Payoff (พ.ศ. 2565–ปั · 1.0 km SE · near a [local] OSM pin ✓, 321 m off
- สะพานรถไฟคานขึงคู่ขนานสะพานจุฬาลงกรณ์ · ยุครถไฟทางคู่ปัจจุบัน (เปิดเดินรถครบเส้น · 1.3 km SE · gem's point only (unverified)

### Far place 1: Khao Ngu, 4.8–5.4 km NW (5)
- ถ้ำฤๅษีเขางู · ยุคทวารวดี (ราว พ.ศ. 1100–1200) · 5.0 km NW · near a [local] OSM pin ✓, 153 m off
- ถ้ำฝาโถ เขางู · ยุคทวารวดี (ราว พ.ศ. 1100–1300) · 5.3 km NW · near a [local] OSM pin ✓, 271 m off
- ถ้ำจีนและถ้ำจาม เขางู · ยุคทวารวดี (ราว พ.ศ. 1100–1300) · 5.4 km NW · near a [local] OSM pin ✓, 396 m off
- สมรภูมิทุ่งเขางู · ยุคต้นรัตนโกสินทร์ (พ.ศ. 2328) · 4.8 km NW · near a [local] OSM pin ✓, 26 m off
- อุทยานหินเขางู (สะพานแขวนและหุบเขาเหมืองหินเก่า) · ยุคฟื้นฟูภูมิทัศน์ร่วมสมัย (ทศวรรษ 2550– · 4.8 km NW · OSM search ✓, 26 m off

### Far place 2: Khu Bua, 5.9–8 km S (4)
- เมืองโบราณคูบัวและวัดโขลงสุวรรณคีรี (โบราณสถานหมายเลข 18) · ยุคทวารวดี (ราว พ.ศ. 1100–1600) · 7.1 km S · near a [local] OSM pin ✓, 39 m off
- หมู่บ้านไทยวนคูบัวและจิปาถะภัณฑ์สถานบ้านคูบัว (กาดวิถีชุมชนคูบัว) · ยุครัชกาลที่ 1 – ปัจจุบัน (พ.ศ. 2347 – พ · 7.0 km S · near a [local] OSM pin ✓, 109 m off
- ศูนย์สืบทอดศิลปะผ้าจกราชบุรี (วัดแคทราย บ้านต้นแหน ต.คูบัว) · ยุครัชกาลที่ 1 – ปัจจุบัน (มรดกผ้าจกตั้ง · 8.0 km S · gem's point only (unverified)
- โรงโอ่งเรืองคงเกียรติและศูนย์เรียนรู้ "เรื่องของโอ่ง" (ต.ดอนตะโก) · ยุคสูงสุด 52 โรงโอ่ง – ยุคท่องเที่ยวเชิง · 5.9 km S · gem's point only (unverified)

### Other, 2.5–10 km (2)
- พระราชวังเขาสัตตนารถ (วัดเขาวัง ราชบุรี) · ยุครัชกาลที่ 5 (พ.ศ. 2414–2420) · 2.8 km SW · gem's point only (unverified)
- โรงโอ่งรัตนโกสินทร์ 1 (ย่านโรงโอ่งเก่าตำบลโคกหม้อ) · ยุครุ่งเรืองโรงโอ่งมังกร – ปัจจุบัน (ทศว · 2.7 km NE · gem's point only (unverified)

### Beyond 10 km (other districts) (11)
- สระโกสินารายณ์ (เมืองโบราณศัมพูกปัฏฏนะ อ.บ้านโป่ง) · ยุคชยราชปุรี–ลพบุรี (พ.ศ. 1734) · 34.4 km N · OSM search ✓, 394 m off
- สมรภูมิศึกบางแก้ว–เขาชะงุ้ม (อ.โพธาราม) · ยุคธนบุรี (พ.ศ. 2317) · 20.0 km N · gem's point only (unverified)
- ชุมชนไทยทรงดำบ้านหัวเขาจีน (ต.ห้วยยางโทน อ.ปากท่อ) · ยุคต้นรัตนโกสินทร์ (พ.ศ. 2321–2335) · 24.6 km S · gem's point only (unverified)
- ชุมชนลาวครั่งบ้านช่องลาภ (ต.หนองพันจันทร์ อ.บ้านคา) · ยุคต้นรัตนโกสินทร์ (ราว พ.ศ. 2321–2380) · 42.8 km W · gem's point only (unverified)
- ชุมชนไทพวนตำบลอ่างหิน (ย่านวัดอ่างหิน อ.ปากท่อ) · ยุคต้นรัตนโกสินทร์ (ราว พ.ศ. 2321–2380) · 18.7 km W · gem's point only (unverified)
- ชุมชนชาวมอญบ้านม่วงและพิพิธภัณฑ์พื้นบ้านวัดม่วง (อ.บ้านโป่ง) · ยุครัชกาลที่ 2 (พ.ศ. 2358) · 24.8 km N · gem's point only (unverified)
- ชุมชนคาทอลิกดอนมดตะนอย (วัดนักบุญอันตน อ.ดำเนินสะดวก) · ยุครัชกาลที่ 4–5 (หลัง พ.ศ. 2406) · 14.4 km E · gem's point only (unverified)
- คลองดำเนินสะดวกและตลาดน้ำดำเนินสะดวก · ยุครัชกาลที่ 4 – ยุคท่องเที่ยวสมัยใหม่ ( · 16.1 km E · OSM found, but far from gem's point, 1850 m off
- วัดขนอนและพิพิธภัณฑ์หนังใหญ่วัดขนอน (อ.โพธาราม) · ยุครัชกาลที่ 5 (ราว พ.ศ. 2430) · 19.8 km N · OSM found, but far from gem's point, 1016 m off
- อำเภอสวนผึ้ง (พื้นที่ชายแดนเทือกเขาตะนาวศรี) · ยุคเหมืองแร่สู่เมืองท่องเที่ยวธรรมชาติ ( · 51.3 km W · OSM found, but far from gem's point, 575 m off
- วัดเขาช่องพราน (ถ้ำค้างคาวร้อยล้าน อ.โพธาราม) · ยุคธรรมชาติและคำขวัญจังหวัด – ปัจจุบัน · 19.0 km N · OSM found, but far from gem's point, 1479 m off

### No coordinates (3)
- จวนหลวงยกกระบัตรเมืองราชบุรีเดิม (ย่านถนนวรเดช) · ยุคปลายอยุธยา (ราว พ.ศ. 2300–2310) · — · no coordinates
- ที่ตั้งเดิมโรงงานเครื่องปั้นดินเผาจีนแห่งแรก "เถ้าเซ่งหลี" · ยุคกำเนิดอุตสาหกรรมโอ่ง (พ.ศ. 2476) · — · no coordinates
- ท่าน้ำขนโอ่ง ("ท่าเรือโอ่ง–เรือมอญ") ริมแม่น้ำแม่กลองฝั่งตะวันตก · ยุคทองโอ่งมังกรช่วงสงครามโลกครั้งที่ 2 – · — · no coordinates

### Spread check
Not a single cluster: 16 places in the town core, and the story's two far places are clear, each with several places of its own, Khao Ngu (Dvaravati caves, the Thung Khao Ngu battlefield, the stone park) and Khu Bua (the Dvaravati town, the Thai Yuan village, the pha chok centre, Rueang Kong Kiat kiln at 5.9 km). 11 places are in other districts, 14–51 km out (Ban Pong, Photharam, Pak Tho, Ban Kha, Damnoen Saduak, Suan Phueng). Under the two-far-places rule they can only be captions or a passing mention, not places the camera visits.

**Needs Google pins / another source:** จวนหลวงยกกระบัตรเมืองราชบุรีเดิม (ย่านถนนวรเดช); ที่ตั้งเดิมโรงงานเครื่องปั้นดินเผาจีนแห่งแรก "เถ้าเซ่งหลี"; ท่าน้ำขนโอ่ง ("ท่าเรือโอ่ง–เรือมอญ") ริมแม่น้ำแม่กลองฝั่งตะวันตก. Gem-only points in town (east-bank wall and gates, the Vietnamese community and the St John Bosco church, Wat Khao Wang, Ratanakosin 1 kiln, the cable-stayed rail bridge) are plausible but not confirmed by OSM.
