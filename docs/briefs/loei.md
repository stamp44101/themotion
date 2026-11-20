# Loei (เลย, ด่านซ้าย ริมลำน้ำหมัน): brief

Research and map by cloud alone (no [gemini] / [local] pass), 20 Nov 2569: `loei_research.md` (6 parts) and `loei_onep/`
(16 pins, OSM, imagery maps; README there).

**The owner delegated every gate to cloud** ("ปกติเสนออะไรทึ่สุดผมก็เอาอันนัันแหละ ทำแทนผมทีนะ", "ให้ตอนจนเหลือแค่ส่งงานหา
local พร้อมให้เรนเดอร์ แล้วเรียกผมแล้วกัน", relayed by the lead session): the cover pick, storyline v1 and the v1 stills pass
below are cloud's own calls, taken without stopping.

## The tile: Dan Sai, not Loei town
The hero (the Phi Ta Khon mask), the close event (Phra That Si Song Rak, the province's seal) and the payoff (Bun Luang at
Wat Phon Chai) all stand in Dan Sai; Loei town's own history starts in 2396 with one event. So the tile is Dan Sai at true
scale (100 m/unit, origin Wat Phon Chai), and Loei town (66 km ENE) and Phu Kradueng (78 km SE) are the two far places, drawn
closer at the NE and SE edges. Chiang Khan is left out (a third far place).

## Cover: A1, cloud's pick (delegated)
`loei_styleframes.jpg` (0/1/2/3 s), code `src/styleframes/loei.tsx` (`LoeiStyleA1`, `A2`), the hero itself in
`src/cities/loei/hero.tsx` (shared with the city). Both on the whole land tile at legend scale, half made at frame 0.
- **A1 หน้ากากผีตาโขน (pick).** A giant Phi Ta Khon on the valley floor north-east of town: the coconut-frond face carved but
  bare, the rice-steamer basket half woven; the basket is woven up, the long nose grows out, the paint runs down behind a
  brush, the eyes open, and it starts to dance with its bells. BIG, IDENTITY, MOVING, SURPRISING; comes back at the payoff.
- **A2 พระธาตุศรีสองรัก.** The stupa at legend scale, half built; its tiers drop in to the gilded lantern. The province's
  seal, but a building rising (hero menu #4) and the same white block at thumbnail size until the spire is on.
- Why A1: everyone knows Loei by the Phi Ta Khon; the face changes shape (nose, basket) and colour in the first two seconds.

## Map in one paragraph
Dan Sai sits where the narrow valley of ลำน้ำหมัน (flowing south to north) opens east along ทล.2013 toward Phu Ruea and Loei.
Wat Phon Chai stands on the tongue of land between the Man and ห้วยน้ำศอก (the Phra Upakhut rite's "between the Man and the
Sok"); Phra That Si Song Rak is on the land inside the Man's bend 1.0 km WSW; the festival ground is 0.7 km NNW across the
Man. Hills all round (Esri hillshade): ridges NW and W, a long ridge NE, rolling hills S and SE. Loei town is drawn at the NE
(bearing ~60 drawn, 69 real) on แม่น้ำเลย with Ban Hae on a small stream; Phu Kradueng's plateau at the SE (~131 drawn, 123 real).

## Years for the screen
| fact | status | use |
|---|---|---|
| Ayutthaya and Lan Xang build Phra That Si Song Rak | **ยืนยัน 2103 → 2106** (จารึก จ.ศ. 922-925; en.wiki "c. 1560") | counter passes 2099 → 2109 (~0.6 s a year), no year held; end card starts 2103 |
| the pact itself | c. 1556 per en.wiki only | no year |
| "boundary marker" (the seal's wording) vs a pact of friendship | **ขัดแย้ง** | caption says friendship, not boundary |
| Ban Hae raised to เมืองเลย by Rama IV | **ยืนยัน 2396** (th.wiki twice, gotoknow) | **held 2396** |
| first governor Luang Si Songkhram (Thao Kham Saen) | one source | not on screen |
| Mouhot sees Loei's iron smelters | 2404 (16 May 1861) | the forges shown, no year |
| Rama IX climbs Phu Kradueng | ยืนยัน 6 พ.ย. 2498 | not on screen |
| Phu Kradueng national park, the 2nd in Thailand | **ยืนยัน 23 พ.ย. 2505** | **held 2505** |
| the wax-castle (ต้นผึ้ง) offering to the stupa, 15th waxing of month 6 | tradition (ไทยรัฐ, MGR snippets) | no year |
| Phi Ta Khon as a tourist festival | ราว late 2520s (one snippet) | no year |
| Bun Luang 2569, "ผีตาโขนเปิดเมือง" 21 มิ.ย. | news snippet | the counter lands on 2569 |

Do not show: the 2519 fighting at Ban Mak Kheng (§3.6a), the land dispute at the stupa, any accident on Phu Kradueng.
Tagline "เมืองแห่งทะเลภูเขา สุดหนาวในสยาม": the slogan as en.wiki translates it; the Thai wording is not read from an official
page (one snippet calls it Phu Ruea's). Approximate.

## Storyline v1 (cloud's call, delegated)
```
Hero (0-3 s): a giant Phi Ta Khon, half made: the basket woven up, the nose grows, the paint runs down, it dances (A1)
  BIG IDENTITY MOVING SURPRISING
Hero sound: the bamboo strip's tick and the bells, then the khaen
Open loop: "why is a ghost standing over Dan Sai?" -> the payoff: Bun Luang, the giant dancing over a town full of ghosts (44 s)
First event (3-9.5 s, people): Ayutthaya and Lan Xang people meet at the Man and raise Phra That Si Song Rak (procession)
Spectacle (by 12 s): the same, the two columns meeting from 3.4 s
Middle: trade (caravans through the frontier valley) / build (Loei town, far place 1) / procession (the wax castles to the
  stupa) / arrive (climbers up Phu Kradueng, far place 2)
Grow shot (34-44 s, 2506-2559): Dan Sai spreads east along ทล.2013 and north up the valley
Payoff (44-54 s): Bun Luang, the streets full of Phi Ta Khon, the giant back over Wat Phon Chai (callback)
Tagline: เมืองแห่งทะเลภูเขา สุดหนาวในสยาม
Facts with nothing to show: Rama IX's climb (2498), the 2478 registration, Mouhot (2404), the first governor's name
```
| id | kind | t (s) | counter | held | caption / sub | on screen |
|---|---|---|---|---|---|---|
| hero | legend | 0-3.0 | ~2098 (under the title) | - | title เลย / sub "ผีตาโขน ด่านซ้าย" | the giant on the valley floor NE of town, forest and hills |
| oath | procession | 3.0-9.5 | 2099 → 2109 (passing) | - | "อยุธยา–ล้านช้าง สาบานเป็นไมตรี" / "ร่วมสร้างพระธาตุศรีสองรัก ริมลำน้ำหมัน" | two columns (Ayutthaya from the W, Lan Xang from the N) meet at the Man's bend; the stupa rises tier by tier |
| frontier | trade | 9.5-15.5 | 2110 → 2383 | - | "ด่านซ้าย ด่านกลางหุบเขา" / "กองวัวต่างเดินทางผ่านลำน้ำหมัน" | ox caravans come down the valley from the north past the stupa; houses go up round Wat Phon Chai |
| loei | build | 15.5-21.5 | 2396 | **2396 ≥ 1 s** | "ร.4 ตั้งเมืองเลย" / "ยกบ้านแฮ่ริมห้วยน้ำหมานเป็นเมือง" | far place 1 (NE edge): Ban Hae's houses on both banks, the pillar raised, the smiths' furnaces glowing |
| wax | procession | 21.5-27.5 | 2397 → 2497 | - | "แห่ต้นผึ้งถวายพระธาตุ" / "ขึ้น 15 ค่ำ เดือน 6 ทุกปี" | people in white carry wax castles from Wat Phon Chai over the Man to the stupa |
| kradueng | arrive | 27.5-34.0 | 2505 | **2505 ≥ 1 s** | "ภูกระดึง อุทยานแห่งชาติแห่งที่ 2" / "ยอดภูราบกว้างราว 60 ตร.กม." | far place 2 (SE edge): climbers and porters up the west face to the pine-topped plateau |
| grow | grow | 34.0-44.0 | 2506 → 2559 | - | "ด่านซ้ายโตตามถนน" / "ออกจากหุบลำน้ำหมัน ไปทางเมืองเลย" | wide ≥ 160: the town spreads east along ทล.2013 and north up the valley |
| fest | celebrate | 44.2-54.2 | 2560 → 2568 | - | "บุญหลวง ผีตาโขนเต็มเมือง" / "ผีป่าออกมาส่งพระเวสกลับเมือง" | Phi Ta Khon fill the streets from Wat Phon Chai to the festival ground; the giant is back, dancing (callout ผีตาโขน) |
| today | today | 54.4-56.4 | 2569 ≥ 1 s | 2569 | finale + tagline | the whole tile at the cover's distance |

Kinds: legend / procession / trade / build / procession / arrive / grow / celebrate / today: no two alike in a row, one
`build`, the spectacle from 3 s. Far places: Loei town and Phu Kradueng only.
No year is named on screen that the counter does not hold for 1 s; 2498, 2404, 2478 and the pact's c. 1556 stay out.

## v1 build (cloud, 20 Nov)
`src/cities/loei/`, 100 m/unit, origin Wat Phon Chai; Loei town and Phu Kradueng drawn closer at the NE and SE edges
(places.ts, geo.ts). Score `scripts/soundtrack_loei.py` (khaen, phin, wooden bars, klong and ching; the basket's strip, the
ghost's bells, ox bells, the smiths' hammers, the parade), -16.0 LUFS, score +1.1 LU over the effects, ambience -10.9 LU under
the score. `npm run check`: 0 errors (one grandeur warning: the old town is 2.2% of the tile, Dan Sai's true size).
Stills: `loei_v1_contact.jpg`. **The v1 stills pass is cloud's own (delegated by the owner).**
- Captions shortened to one line: "อยุธยา–ล้านช้างผูกไมตรี", "ภูกระดึง อุทยานแห่งชาติ" (sub "แห่งที่ 2 ของไทย ..."),
  "ผีตาโขนเต็มเมือง" (sub "งานบุญหลวง ...").
- Roads nudged off the Man where OSM's simplified ways touch it; the town street from Wat Phon Chai crosses the Man's bend
  square to its arm; the hills by ทล.2113 and the viewpoint hill widened so no road climbs > 35 degrees.
- Wat Phon Chai's sim drawn 30 m east and at 0.85 scale, between the Sok and the street.
- The festival giant (the callback) is 8 units tall on the festival ground, west of where OSM puts the venue (the venue node is
  ~100 m from the Man's bend), so it stands on land; the camera looks from the NW so Phu Kradueng's plateau is behind it.
- Fixed on the stills before passing: the caravans were small and behind trees (closer, higher camera); Phu Kradueng's
  climbers were specks and the trail floated off the cliff (camera on the west face, climbers drawn larger, trail on the face).
- Left as it is: the engine's bridge decks read large on the close shots (engine size, not touched); the hills read softly
  under the forest from the cover's height.

## Lead review (20 Nov) and what changed
- 18.5 s, เมืองเลย: Ban Hae is Loei town, 66 km ENE of Dan Sai (OSM city pillar way 1427324009; Huai Nam Man is not in OSM).
  It is drawn on purpose as far place 1 at the tile's NE edge (bearing ~60 drawn, 69 real; geo.ts checks it), on its own
  stream and the Loei river, not as Dan Sai growing; the camera goes there and comes back. Kept as a beat.
- Names: ลำน้ำหมัน is Dan Sai's river; ห้วยน้ำหมาน (ห้วยหมาน) is Ban Hae's stream in Loei (th.wiki). Both are right where they
  are used; the grow sub wrongly said "หุบน้ำหมาน" and now says "หุบลำน้ำหมัน".
- 6 s: the counter no longer sits on 2103-2106; it passes 2099 -> 2109 at ~0.6 s a year. The end card keeps "พ.ศ. 2103 –".
- 25 s: 2455 is a passing year; the wax beat runs 2397 -> 2497 linearly (~17 years a second), no year held.
- 37/42 s are one beat (grow, 34-44 s) and 48/52 s one beat (fest, 44.2-54.2 s).
