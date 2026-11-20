# Samut Prakan (สมุทรปราการ, เมืองปากน้ำ): brief

Research and map by cloud alone (no [gemini] / [local] pass), 20 Nov 2569: `samutprakan_research.md` (6 parts) and
`samutprakan_onep/` (13 pins, OSM, Esri imagery maps; README there).

**The owner delegated every gate to cloud** ("ปกติเสนออะไรทึ่สุดผมก็เอาอันนัันแหละ ทำแทนผมทีนะ"; "ให้ตอนจนเหลือแค่ส่งงานหา local
พร้อมให้เรนเดอร์ แล้วเรียกผมแล้วกัน"): the cover pick, storyline v1 and the v1 stills pass below are cloud's own calls.

## Cover: A, cloud's pick (delegated, 20 Nov)
`samutprakan_styleframes.jpg` (0/1/2/3 s), code `src/styleframes/samutprakan.tsx` (`SamutPrakanStyleA`, `B`), the hero itself
in `src/cities/samutprakan/Hero.tsx`. Both sit on the whole land tile (the real delta) at legend scale, half made by hand at
frame 0 and changing shape (experiments §17-§20).
- **A พระสมุทรเจดีย์ (picked).** A giant chedi on its island in the Chao Phraya; at frame 0 its lower half is laid in red
  brick inside a bamboo scaffold; the courses go up one at a time until 1.8 s, the whitewash sweeps up, the scaffold comes
  down and the spire shoots up (the shape change: Rama IV had it rebuilt taller). The province's seal, "the first thing a
  ship saw of Siam"; it comes back in the payoff (the red cloth wrapped round its bell).
- **B ช้างสามเศียร.** A giant copper three-headed elephant, its heads plated one by one, then the trunks lift and it turns
  green. Modern (the Erawan Museum, 2537): kept only as the alternative.
- Why A: the chedi is the town's own story (built for the town, at the river mouth, with the island that later joined the
  bank), it reads at thumbnail size as a white stupa, and it changes shape for real.

## Map in one paragraph
150 m/unit, origin the city pillar on the east bank at Pak Nam. The Chao Phraya (~0.8–1 km wide) comes in from the west at
the tile's north-west, bends south past Pak Nam and runs ~6 km to the mouth, where the coasts open WSW and ESE (one flat water
shape for river and Gulf, cut at the tile's edges). The chedi stands 1.4 km WNW of the pillar on the west bank: drawn on its
island with the old west channel open until the grow beat silts it up. Phi Suea Samut fort is 0.4 km south of it on the same
side; Phra Chulachomklao fort at the mouth's west side (drawn 0.6 km east of its pin, by today's shore: the mud has built the
coast out since 2436); Bang Pu 10 km SE on the coast at true scale. Drawn closer: Suvarnabhumi (19 km NE) at the tile's
north-east corner, the Bhumibol twin bridges (9–11 km NW) where the river enters the tile.

## Years for the screen
| fact | status | use |
|---|---|---|
| Rama II builds Mueang Samut Prakan at Pak Nam, 6 forts both banks, the chedi on the island | **ขัดแย้ง** 2362 (start) / 2365 (pillar) | build beat under "ราว", no held year |
| The chedi finished under Rama III | **ขัดแย้ง** 2370 / 2371 | no year |
| Rama IV rebuilds it over the old one, ~38 m | ยืนยันเหตุการณ์, ปีไม่แน่ | sub "สูงราว 38 เมตร", no year |
| Phra Chulachomklao fort begun | **ยืนยัน 2427** | fort beat, counter passes it, not named |
| Disappearing guns (7 at Phra Chula, 3 at Phi Suea Samut) | ยืนยัน 2436 | sub "ปืนเสือหมอบ 7 กระบอก" |
| Paknam incident (ร.ศ. 112) | **ยืนยัน 13 ก.ค. 2436** | **held 2436** |
| The chedi's island joins the west bank | ยืนยันเหตุการณ์, ไม่พบปี | grow sub, no year |
| Bang Pu seaside resort | 2480 (หลายแหล่งไทย, ข้อความย่อ) | resort beat, counter runs 2468→2484, no year named |
| Bhumibol bridges open to traffic | ยืนยัน 2549 (20 ก.ย.) | airport sub "ปีเดียวกับสะพานภูมิพล" |
| Suvarnabhumi opens | **ยืนยัน 28 ก.ย. 2549** (AOT) | **held 2549** |
| The red cloth for the chedi (แรม 5 ค่ำ เดือน 11, yearly) | ยืนยัน (ประเพณี) | payoff |

Not shown: the Japanese landing at Bang Pu (8 Dec 2484); casualty figures of 2436 (sources disagree); the Paknam railway
(2436–2503: true and nice, but its station never shares a shot with the beats of its years).

## Storyline v1 (cloud's pick, delegated)
```
Hero (0-3 s): a giant Phra Samut Chedi on its island, half laid in brick, scaffold up; courses, whitewash, the spire shoots up
  BIG IDENTITY MOVING (made by hand, the shape changes)
Hero sound: a hod of bricks and a trowel's tick per course, the whitewash's swish, a rising tone and a bell as the spire goes up
Open loop: "whose chedi is this?" -> the payoff: the yearly red cloth comes by barge and is wrapped round its bell
```
| id | kind | t (s) | counter | held | caption / sub | on screen |
|---|---|---|---|---|---|---|
| hero | legend | 0-3.0 | (hidden under the title) | - | title สมุทรปราการ / sub "เมืองปากน้ำ ประตูสู่สยาม" | the giant chedi on the delta tile, river and mouth below |
| build | build | 3.0-9.4 | ราว 2362 → 2370 | - | "ร.2 สร้างเมืองป้อมปากน้ำ" / "เกณฑ์คนก่อป้อมสองฝั่ง และเจดีย์กลางน้ำ" | conscripts carry bricks from a kiln to forts on both banks, brick boats cross to the island, the first chedi rises half way, the pillar shrine |
| raise | procession | 9.4-15.6 | 2371 → 2410 | - | "ร.4 เสริมพระเจดีย์ให้สูงขึ้น" / "ก่อครอบองค์เดิม สูงราว 38 เมตร" | royal barges come down to the island's landing, the relic is carried up, the chedi grows taller in its scaffold |
| fort | build | 15.6-20.8 | 2411 → 2435 | - | "ร.5 สร้างป้อมพระจุลฯ" / "ป้อมพระจุลจอมเกล้า ปืนเสือหมอบ 7 กระบอก" | ramparts rise at the mouth, workers, the seven guns set in their pits |
| fight | fight | 20.8-27.4 | 2436 | **2436** | "ร.ศ. 112 ฝรั่งเศสบุกปากน้ำ" / "เรือรบสองลำฝ่าป้อม 13 ก.ค. 2436" | two French ships steam up the channel past the fort; the disappearing guns rise and fire, the gunboats answer |
| resort | celebrate | 27.4-33.6 | 2468 → 2484 | - | "สถานตากอากาศบางปู" / "สะพานยื่นลงทะเล ที่เที่ยวชายทะเลของคนกรุง" | the resort's houses and the pier go out to sea; strollers, gulls, Sukhumvit's first cars |
| grow | grow | 33.6-41.6 | 2485 → 2548 | - | "ปากน้ำโตจนชนกรุงเทพฯ" / "ตะกอนทับถม เกาะพระเจดีย์ติดฝั่งไปแล้ว" | wide ≥ 175: the town spreads over the delta, the old channel silts up, the swamp is filled for the airport |
| airport | arrive | 41.6-48.4 | 2549 | **2549** | "สุวรรณภูมิบนหนองงูเห่า" / "เปิด 28 ก.ย. 2549 ปีเดียวกับสะพานภูมิพล" | far place: jets land on the two runways, one takes off; terminal and the 132 m tower (`tall`) |
| fair | celebrate | 48.4-54.6 | 2550 → 2569 | - | "ห่มผ้าแดงพระสมุทรเจดีย์" / "แห่ผ้าแดงทางเรือ ขึ้นห่มคอระฆังทุกปี" | the red cloth comes across by barge, is carried up and wound round the bell; the crowd walks round the chedi (callback) |
| today | today | 54.6-56.4 | 2569 ≥ 1 s | 2569 | finale + tagline | the whole tile at the cover's distance: a city from the bridges to the airport and Bang Pu |

Kinds: legend / build / procession / build / fight / celebrate / grow / arrive / celebrate / today: no two alike in a row,
two `build` (the limit), the spectacle by 12 s (the procession from 9.4 s). Far places: Suvarnabhumi only (the bridges sit at
the tile's edge and are named in a sub).
Tagline: "พระสมุทรเจดีย์ ป้อมพระจุลฯ ปากน้ำเจ้าพระยา" (cloud's pick). Finale kicker "สมัย ร.2 – พ.ศ. 2569" (no disputed
founding year).

## v1 build (cloud, 20 Nov)
`src/cities/samutprakan/`, 150 m/unit, origin the city pillar. Score `scripts/soundtrack_samutprakan.py` (ranat ek, khlui, pi,
klong and ching; bricks, oars, barges, guns, surf, gulls, jets), -16.0 LUFS, score +0.7 LU over the effects, ambience -9.9 LU
under the score. `npm run check`: 0 errors. Stills: `samutprakan_v1_contact.jpg` (cloud passed it: delegated).
- Fixed on the stills before passing: the cover camera pulled back to 340 so the whole delta tile is in frame; the royal
  barges moved to mid-channel (they ran along the island's edge); the airport's parked jets removed (they crossed the
  terminal), the runways set 4.4 apart with the tower beside the terminal; four caption titles cut to one line; Sukhumvit
  drawn 150 m east through Pak Nam so it clears Narai Prap Suek fort, Bang Pu's resort drawn off the road, the road to the
  temple stopped at its gate; Phi Suea Samut fort drawn smaller so it stays on its island.
- Positions not surveyed: Prakhon Chai and Narai Prap Suek forts (both gone) are placed from the street names; Phra Chula is
  drawn 0.6 km east of its pin, by today's shore.
- Left as it is: the grandeur warning (Pak Nam's Rama II town is 0.4% of the tile) is the town's true size; the landing is the
  whole delta as a city.
