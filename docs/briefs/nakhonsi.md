# City brief — Nakhon Si Thammarat / นครศรีธรรมราช

Status: research pass 2 (2026-10-16). Pass 1 was written in the cloud container,
which could not reach Google Maps, OSM or the ONEP hosts. This pass fills those gaps
from Google Maps, OpenStreetMap and whc.unesco.org on the owner's machine. Every
value carries its source. `nced.onep.go.th` is still unreachable -- it answers
**403 Forbidden** from here too, so it is not a container-only block.

## 1. Wall footprint

- **Source PDF:** still [unknown]. `nced.onep.go.th` returns **403 Forbidden** from a
  normal browser on a Thai connection, not only from the container, so the UTM outline
  could not be read. The ONEP *culturalenvi* record for the old town does load:
  culturalenvi.onep.go.th/site/detail/4307, and gives the old town's own centre point as
  **8.418837, 99.965804**.
- **Extent (secondary sources):** ~456 m east-west x ~2,238 m north-south (ratio ~1:4.9).
  ONEP culturalenvi page 4307 says ~450 x ~2,230 m.
- **Measured north-south extent (OSM):** the canal chain running down the **west** side of
  the old town (ways 1323449708 + 766416823 + 1323449707) runs from **8.40609, 99.96390**
  at the south to **8.42751, 99.96068** at the north, where it meets คลองหน้าเมือง.
  That is **2,367 m**, within 6% of the quoted 2,238 m, so this chain is almost certainly
  the old **west moat** and its two ends are the north-west and south-west corners.
  *(Inference from geometry -- OSM carries no name on these ways. Not a labelled source.)*
- **Corners (lat, lon).** NW and SW are measured; NE and SE are NW/SW carried 456 m east
  along the wall line (bearing ~93 deg), so they inherit the 456 m figure's uncertainty:

  | corner | lat, lon | how |
  |---|---|---|
  | NW | 8.42751, 99.96068 | OSM, moat/canal junction |
  | SW | 8.40609, 99.96390 | OSM, south end of the west canal |
  | NE | 8.42729, 99.96485 | NW + 456 m east |
  | SE | 8.40587, 99.96807 | SW + 456 m east |

- **Tilt off true north: about 6 degrees, the north end leaning WEST** (axis bearing ~354 deg;
  the north wall runs at ~84 deg, rising to the east). Corrected in review of PR #34; pass 2
  said "about 3 degrees east", which does not survive a check:
  - the road endpoints quoted for it (8.42246, 99.96215 -> 8.43000, 99.96309) span **840 m,
    not 1,942 m**, and their north end is *east* of the south end (+7.1 deg), the opposite
    sense to every other measure below. The south point lies near the west wall line, so
    these are probably not ถนนราชดำเนิน's in-town section;
  - the west moat (NW/SW corners above): **-8.5 deg** over 2,395 m;
  - north gate -> midpoint of หอพระอิศวร / หอพระนารายณ์ (which straddle ราชดำเนิน): **-6.8 deg**;
  - owner's Google Maps satellite view: ราชดำเนิน leans ~6 deg the same way, and the north
    moat meets it at a right angle, rising to the east (OSM gives its first segment past
    the gate a bearing of 81 deg, i.e. ~9 deg).
  The layout uses a 6 deg rectangle; the spread above (6-9 deg) is within what a still shows.
- **Is Wat Phra Mahathat inside the wall rectangle? YES -- inside, in the southern third,
  close to the east wall.** The chedi is at 8.41148, 99.96622 (UNESCO's own coordinate,
  N8 24 41.31 E99 57 58.38, which matches the Google Maps pin 8.4113, 99.9664). At that
  latitude the west wall line is at lon ~99.9631 and the east at ~99.9673, so the chedi
  sits about 115 m inside the east wall and ~820 m south of the north gate. **The hero
  belongs inside the walls, not south of them.**
- **What survives:** only ประตูชัยเหนือ (ประตูชัยศักดิ์) and ~100 m of the north wall at its
  east end, beside คลองหน้าเมือง (Fine Arts Dept. 12th office). Registered 1936.
  Google Maps pins both the gate and the wall stretch as one place, **"Old City Wall" at
  8.4276337, 99.9635791**; its "Ancient Wall" label sits about 90 m further east, near
  **8.4278, 99.9646** (read off the satellite view, +/- 30 m -- a label, not a pin).
- **History of the wall:** earlier earth rampart; re-engineered in brick under King
  Narai to a design by the French engineer de La Mare (1685-1688 window; exact year
  [unknown]). Caption must say ปรับปรุง, not สร้าง.
- **In units (80 m/unit):** 456 x 2,367 m -> ~5.7 x 29.6 units -> `hx ~ 2.85, hz ~ 14.8`.
  Long thin city: per CLAUDE.md, camera distance ~1.3-1.45x a square city's, a few degrees
  more elevation.
- **`city.outline`:** the four corners above give a usable quadrilateral today. It is not
  the ONEP outline -- when that PDF becomes reachable, replace it.

## 2. Water

Widths are measured off Google Maps satellite imagery at 0.295 m/pixel (z19, checked
against the 20 m scale bar), taking a vertical cut across the channel, so they are
upper bounds where the channel runs diagonally.

| water | real width (m) | notes |
|---|---|---|
| คลองหน้าเมือง | **11-18 m** (3 cuts: 18.6, 13.9, 11.2) | Google Maps labels this channel คลองหน้าเมือง / "Na Muang". OSM way 145173593. Runs along the **north** wall and then east to the Gulf. |
| คลองท่าซัก | **9-13 m** (4 cuts: 12.7, 11.8, 10.6, 9.2) | **Not คลองท่าวัง.** Google Maps labels the channel north of the old town คลองท่าซัก / "Tha Sak"; ท่าวัง is the neighbourhood, the market (หลาดท่ามอญ / Municipality Market Tha Sak, 8.4409, 99.9668) and a bridge (สะพานราเมศวร์ / สะพานท่าวังวรสลินธุ์). OSM ways 1323449704 + 498312908. |
| west moat (unnamed in OSM) | [unknown] | the canal chain down the west side -- see section 1. Probably the old คูเมือง. |
| คลองท่าดี | [unknown] | Google Maps puts "Tha Di" at 8.3971, 99.8763, which is 10 km west in the Khao Luang foothills, not beside the old town. |
| Gulf of Thailand | - | coast about **13 km** east of the old town. |

**Course of คลองหน้าเมือง** (OSM way 145173593, west to east):
8.42751, 99.96068 -> 8.42807, 99.96378 -> 8.42831, 99.96565 -> 8.42835, 99.96674 ->
8.43013, 99.97343 -> 8.43850, 100.00134 -> 8.43471, 100.01409 (into the Gulf).
First segment bearing 81 deg.

**Course of คลองท่าซัก** (OSM, south-west to north-east):
8.45689, 99.95577 -> 8.44875, 99.95687 -> 8.44397, 99.95878 -> 8.44838, 99.96840 ->
8.44893, 99.97607.

**Does a river pass through the walls? No.** คลองหน้าเมือง runs *along* the north wall
and turns east away from the town; the west moat runs *along* the west side. Neither
crosses the enclosure, so this city needs no water gate (unlike Phitsanulok).

**Open-water point in the Gulf: 8.4500, 100.1200.** Checked on satellite at two zooms:
nothing but shallow sea and rows of stake fish traps, no land, no road, no building.
It is 13.2 km east of the chedi, bearing 86 deg.

## 3. Story beats

Confidence: **confirmed** · **attributed** · **disputed**. Thai sources preferred.

| CE | พ.ศ. | event | confidence | caption wording |
|---|---|---|---|---|
| 311 | 854 | Legend: Thanakuman & Hemchala bring a tooth relic from Lanka, first chedi at Hat Sai Kaeo | attributed (legend only) | "ตามตำนาน …" — never a plain counter date |
| 775 | 1318 | Ligor stele (inscription no. 23) — Srivijayan-era Buddhist foundation | disputed (who/what it honours) | "จารึกหลักที่ 23 (พ.ศ. 1318) เชื่อมโยงกับศรีวิชัย" — not "ศรีวิชัยปกครองนคร" |
| 1001 | 1544 | Tambralinga embassy in Song Chinese records (also 1016, 1070) | confirmed | "แคว้นตามพรลิงค์ ปรากฏในบันทึกจีน (ราว พ.ศ. 1544)"; avoid the "ฝ่ามือแดง" etymology |
| c. 1200s | พุทธศตวรรษที่ 18 | Great chedi rebuilt as a Sri Lankan bell-shaped stupa over the older one | attributed (FAD: ราวพุทธศตวรรษที่ 18; temple says 1770, th.wiki ~1700) | "ราวพุทธศตวรรษที่ 18 สันนิษฐานว่าสร้างเจดีย์ทรงลังกาครอบองค์เดิม" |
| 1230 | 1773 | Chandrabhanu (พระเจ้าจันทรภาณุ) "Śrī Dharmarāja" begins his reign | confirmed | "พ.ศ. 1773 พระเจ้าจันทรภาณุ ศรีธรรมราช"; avoid "จารึกหลักที่ 24" |
| 1247 / 1262 | 1790 / 1805 | Chandrabhanu's expeditions to Sri Lanka | confirmed in English sources only | optional beat |
| c. 1350 | ราว 1893 | Major หัวเมือง of Ayutthaya | attributed (textbook sources) | "ราว พ.ศ. 1893 เป็นหัวเมืองสำคัญของอยุธยา" |
| 1685–1688 | 2228–2231 | de La Mare redesigns the brick walls and forts under King Narai | confirmed (window), exact year unknown | "สมัยพระนารายณ์ ช่างฝรั่งเศสออกแบบปรับปรุงกำแพงเมือง" |
| 1767–1769 | 2310–2312 | Chao Nakhon (หนู) rules an independent ชุมนุม; Taksin takes the city (Aug 2312) | confirmed | hold the year |
| 1914 | 2457 | Railway branch opens 1 October 1914 | confirmed | hold the year |
| 1962 | 2505 | Tropical Storm Harriet lands at Laem Talumphuk, Pak Phanang, 25 Oct | confirmed (toll "กว่า 900") | optional; gloom beat |
| 1988 | 2531 | 22 Nov mudslides at Kathun & Khiriwong; national logging ban Jan 1989 | confirmed date; toll disputed (~230 vs 373) | no toll, or "หลายร้อยคน" |
| 2012 → 2026 | 2555 → 2569 | Wat Phra Mahathat on the UNESCO tentative list 2012; **inscribed as World Heritage 2026** (Busan, 48th session; press reports give 25 July) | year confirmed on whc.unesco.org/en/list/1761 ("Date of Inscription: 2026"); the day is press-only | closing beat: "ขึ้นทะเบียน พ.ศ. 2569" -- no day |


**Storyline v2 (owner: "the list of dates is boring").** Text-only beats were cut or merged
(stele no. 23, Ayutthaya province c. 1350, Chandrabhanu as his own beat) and every remaining
beat has something happening on screen: the legend's relic boat coming ashore, Song-era
junks in the Gulf (Tambralinga's 1001 embassy), the Lanka bell, Narai's walls, Chao Nakhon
holding the town and Taksin's army at the north gate (2312, confirmed: silpa-mag.com/?p=36619),
the 1914 train, the 1988 mudslide, and **แห่ผ้าขึ้นธาตุ** before the World Heritage close:
on Makha Bucha people carry the long ผ้าพระบฏ round the chedi and wrap it (Thai PBS, Thai Post;
the legend dates it to the Sri Dharmasoka kings, "over 800 years", attributed). The ceremony
is cited in the inscription's criterion (vi).

- **Era labels:** ตามพรลิงค์ · ศรีวิชัย · ศรีธรรมราช · อยุธยา · เจ้านคร · ปัจจุบัน
- **Duration:** 75 s as shipped (`src/cities/nakhonsi/timeline.ts`); the brief was written for 60 s.

## 4. Landmarks

| name | real location | appears (CE) | notes |
|---|---|---|---|
| พระบรมธาตุเจดีย์ (great chedi) | **8.41148, 99.96622** (UNESCO property page 1761) | older stupa ~?; Lanka-style 13th c. | **The hero.** Height disputed: 55.78 m (Thai) vs ~77–78 m (English). Caption "สูงราว 55 เมตร" or no number. **Inside the wall rectangle**, southern third, ~115 m from the east wall — see section 1. |
| ประตูชัยเหนือ + north wall | **8.42763, 99.96358** (Google pin "Old City Wall"); wall label ~8.4278, 99.9646 | wall: earlier rampart; brick 1685–88 | only surviving gate; beside คลองหน้าเมือง |
| หอพระอิศวร | **8.42418, 99.96370** (Google pin "Hor Phra Isuan") | [unknown] | the 8.4243, 99.9643 figure quoted elsewhere is **หอพระนารายณ์**, not this |
| หอพระนารายณ์ | **8.42430, 99.96427** (Google pin + OSM node 1586071772, agree to 5 m) | [unknown] | ~65 m east of หอพระอิศวร, across ถนนราชดำเนิน |
| หอพระพุทธสิหิงค์ | **8.41910, 99.96363** (Google pin) | [unknown] | สนามหน้าเมือง is separate: **8.42922, 99.96244** |
| สถานีรถไฟ | **8.43954, 99.95986** (Google pin; Wikidata 8.4397, 99.9597 agrees to 25 m) | 1914 | Tha Wang |
| สนามบินนครศรีธรรมราช | **8.53848, 99.93991** (Google pin) — the Thai AIP figure 8.5396, 99.9447 is 550 m off | [unknown] | 14.5 km N — `far` or omit |
| เขาหลวง | 8.4942, 99.7300 (gunungbagging; agrees with en.wiki 8°30′N 99°44′E) | — | 26–27 km WNW — `far: true` backdrop. Height disputed 1,780 vs 1,835 m → "ราว 1,800 เมตร, ยอดเขาสูงที่สุดในภาคใต้" |
| คีรีวง | **8.43241, 99.78255** (Google pin "Kiriwong Village") | — | foot of Khao Luang; confirms en.wiki's longitude is wrong |

## 5. Terrain and palette

- **Hills:** Khao Luang range to the west only, as a backdrop at the tile edge
  (`far`); the town sits on the coastal plain.
- **Gloom:** 1767–69 (Taksin's campaign), 1962 storm, 1988 mudslides.

## 5a. Real coordinates (`geo.ts`)

All from Google Maps unless noted. Google Maps pins read off the place URL
(`!3d<lat>!4d<lon>`), with the pin's own name quoted so the match can be checked.

| place | lat | lon | source / pin |
|---|---|---|---|
| พระบรมธาตุเจดีย์ (hero, `centre: true`) | 8.41148 | 99.96622 | **UNESCO** N8 24 41.31 E99 57 58.38, whc.unesco.org/en/list/1761. Google pin "Wat Phra Mahathat Woramahawihan" 8.4113, 99.96643 agrees to 25 m |
| ประตูชัยเหนือ / กำแพงเมืองที่เหลือ | 8.42763 | 99.96358 | Google pin "Old City Wall, Nakhon Si Thammarat" |
| east end of the surviving north wall | 8.4278 | 99.9646 | Google "Ancient Wall" **label** on satellite, +/- 30 m. Not a pin -- treat as approximate |
| หอพระอิศวร | 8.42418 | 99.96370 | Google pin "Hor Phra Isuan" |
| หอพระนารายณ์ | 8.42430 | 99.96427 | Google pin "Hor Phra Narai"; OSM node 1586071772 gives 8.424336, 99.9643086 -- the two agree to 5 m |
| หอพระพุทธสิหิงค์ | 8.41910 | 99.96363 | Google pin "Ho Phra Phutthasihing" |
| สนามหน้าเมือง | 8.42922 | 99.96244 | Google pin "Sanam Na Muang Public Park" |
| คลองหน้าเมือง (water, by the north wall) | 8.42807 | 99.96378 | OSM way 145173593; see section 2 for more points |
| Gulf of Thailand (open water) | 8.45000 | 100.12000 | satellite-verified, section 2 |
| modern centre -- ท่าวัง market | 8.44090 | 99.96684 | Google pin "Municipality Market Tha Sak" |
| modern centre -- Central Nakhon Si | 8.38234 | 99.96960 | Google pin "Central Nakhon Si". 3.2 km **south** of the chedi -- the mall is not the old centre |
| สถานีรถไฟ | 8.43954 | 99.95986 | Google pin "Nakhon Si Thammarat" station |
| คีรีวง (`far: true`) | 8.43241 | 99.78255 | Google pin "Kiriwong Village". Confirms en.wikipedia's longitude is wrong; use this |
| เขาหลวง summit (`far: true`) | 8.49417 | 99.73000 | Google pin "Khao Luang" -- matches pass 1 exactly |
| สนามบิน (`far: true`) | 8.53848 | 99.93991 | Google pin "Nakhon Si Thammarat International Airport". Pass 1 had 8.5396, 99.9447, which is 550 m away; use the pin |

**Correction to the issue text:** the listing quoted as หอพระอิศวร, *8.4243, 99.9643*, is
**หอพระนารายณ์**, not หอพระอิศวร. Two sources agree on that (the Google pin and the OSM
node). หอพระอิศวร is about 65 m west of it, across ถนนราชดำเนิน, at 8.42418, 99.96370.

## 5b. Grandeur

- **The big thing:** Khao Luang (real, highest in the South) behind; the white
  chedi with its gold spire as the focal object that grows over time.
- **The shape the viewer recognises:** the white Lanka bell stupa with the gilded top.
- **Opening (experiment 1 carry-over):** the tile with Khao Luang on its edge and a
  bright object on it from frame 0.
- **The last frame:** the chedi lit at night over the modern city, World Heritage caption.

## 6. Sound

- Southern palette: nora/manohra drum & pi (synth: drum, pi reed, ching), surf for the
  Gulf beats, temple bells for the chedi.
- Events by year: 775 stele, 1230, 1688 walls, 1769 Taksin, 1914 train, 1962 storm
  wind, 1988 rain, 2026 inscription.

## 7. Open questions

1. **ONEP old-town PDF -- still blocked.** `nced.onep.go.th` answers **403 Forbidden**
   from a normal browser, so this is not the container's network. Until someone finds
   another copy, the footprint in section 1 is measured off OSM and Google Maps, not
   off the ONEP UTM grid.
2. **Is the great chedi inside the wall rectangle? Answered: yes**, southern third,
   ~115 m inside the east wall. See section 1.
3. **Pins: done.** See section 5a, with one correction to the issue's own figures.
4. **UNESCO inscription: confirmed.** whc.unesco.org lists *Wat Phra Mahathat
   Woramahawihan, Nakhon Si Thammarat*, Thailand, as a new inscribed property of the
   **48th session (2026)**, criteria **(ii)(vi)**, property 5.356 ha, dossier/ref
   **1761** -- https://whc.unesco.org/en/list/1761/ and
   https://whc.unesco.org/en/newproperties/. The property page gives the year only:
   **"Date of Inscription: 2026"**. It does **not** print the day, so *25 July 2026*
   still rests on the press reports alone. Safe caption: ขึ้นทะเบียน พ.ศ. 2569. Only say
   25 กรกฎาคม if someone turns up the 48COM decision document.
5. Which inscription number names Chandrabhanu (24?) -- still unchecked; leave it out.
6. **New, for whoever builds the layout:** the west moat is unnamed in OSM. If a caption
   is going to name it, find a Thai source first; do not call it คูเมือง on screen on the
   strength of this brief's geometry inference alone.
