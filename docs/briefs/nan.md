# Nan (น่าน) — brief (draft)

Research: `nan_research_request.md` → `nan_research_gemini.md` (Gemini, 25 Oct 2026).
Look: shader (every recent city was posted in the shader look).

## The story in one line

**A town that moved four times with its river.** Nan's own chronicle has the town cross the
Nan and back: Phu Phiang Chae Haeng on the east bank (1902), across to the west bank behind the
white bull (1911), up to Wiang Nuea after the flood (2360), and back to the old site with a
brick wall once the river had swung east (2398–2400). On a diorama this is the river itself
moving and the town following it: action in every beat, not a list of dates.

## §4 Hero — decided (owner, 25 Oct 2026): **A, the naga race boat**

Style frames: `nan_styleframes.jpg` (0, 2, 4, 8 s; row 1 one boat, row 2 three boats racing)
and `nan_styleframe_A_close.jpg`. Model: `NanBoat` in `src/styleframes/nanBoat.tsx` (22 pairs of
paddlers in time, a stroke caller, a steersman, the naga head and tail). Drawn at 2.4x so it reads
on the whole tile; the opening river is drawn 14 units wide to float it.

The options as offered:

| | hero at frame 0 | callback in the payoff | for | against |
|---|---|---|---|---|
| **A (recommended)** | a naga-prowed longboat, 40+ paddlers in time, racing down the Nan across the whole tile | the ออกพรรษา boat race under สะพานพัฒนาภาคเหนือ, 2025, a field of naga boats | the province's motto opens with แข่งเรือลือเลื่อง; Nan has 230+ long boats, the most in Thailand; motion on frame 0 (paddles); the river is the story | racing is documented only from ~2343; in the 1902 beat the boat is the settlers' boat coming down from Pua, not a race |
| B | the white bull (โคอุศุภราช) of the provincial seal, giant, wading across the river | the bull on the seal / a bull-shaped float in the payoff | the founding legend of today's town (1911) | a legend, not a record; one animal on a big river reads small; the callback is weak |
| C | the naga pair of Wat Phumin carrying the cruciform ubosot, then diving into the river as a boat (Gemini §2 option 1) | the boat race | the two most famous images in one | an oversized naga is the Ubon hero again (posted 2 weeks ago) |

Style frames to make once the owner leans: A at 0/2/4/8 s (boat on the whole tile, then the
camera low along it), and B for comparison.

## Dates checked (web, 25 Oct 2026)

| BE | event | status |
|---|---|---|
| 1902 | พญาการเมือง moves the people from Pua (วรนคร) to Phu Phiang Chae Haeng, east bank | chronicle (พงศาวดารเมืองน่าน); Chula thesis gives the Pua period ending 1902 → `ตามพงศาวดาร` |
| 1911 | พญาผากอง crosses to the west bank, the white bull marks the town | chronicle and legend only; not found in an independent source → `ตำนานเล่าว่า` |
| 1915 | "เมืองน่าน" and พญาผากอง in Sukhothai inscription no. 8 | Gemini; not yet cross-checked |
| 1991–1993 | Tilokaraj takes Nan (the salt wells of Bo Kluea) | chronicle; Gemini |
| 2139 | Wat Phumin (วัดพรหมมินทร์) built | agrees (several sources) |
| 2410 (–2417) | Wat Phumin rebuilt under เจ้าอนันตวรฤทธิเดช; the murals (ปู่ม่านย่าม่าน) | agrees on 2410, 7 years; **disputed**: some research dates the murals 2443–2446 → do not caption a mural year |
| 2343–2355 | earliest mentions of the ออกพรรษา boat race (Wat Bun Yuen, Wiang Sa) | Gemini; traditional |
| 2360 | flood breaks the log wall; town moves north to Wiang Nuea | agrees (English source: flood of 1817) |
| 2398 | the river has swung east; the town returns south and the wall is rebuilt along the old line | agrees on 1855 (= 2398); Gemini's "2400 brick wall" not confirmed → caption 2398 |
| 2400 | first หอคำ (wooden); today's brick หอคำ is **2446** | Gemini §5.1; do not show today's building before 2446 |
| 2450 | ประตูอมร cut through the north wall | Gemini |
| 15 May 2469 | first aircraft lands on the airfield the people cleared at Wiang Nuea | Gemini only; not found online yet → needs a second source before a caption |
| 17 Aug 2474 | last ruler (เจ้ามหาพรหมสุรธาดา) dies; หอคำ becomes the provincial hall | Gemini §5.1 (not 2475) |
| 17–19 Mar 2481 | Phrae–Nan road opened (= March **1939**, old new-year) | Gemini; not found online yet |
| 2536–2537 | Fine Arts rebuilds the north wall (Mahawong Rd) | agrees (restored 1993, registered 25 Oct 1994) |

Leave out: the 2367 and 2549/2567 floods with loss of life; the Lao border and the 2447 cession
of the east-bank towns (border topic); the 2510s communist insurgency in Nan's hills.

Facts for sub lines (Gemini §3): the white bull on the seal; ปู่ม่านย่าม่าน means "a Burmese man
and woman", not grandparents; วัดน้อย, the smallest wat (1.98 × 2.34 m); the black ivory tusk (left
tusk, 18 kg); ส้มสีทอง is Bang Mot tangerine turned gold by the valley's cold nights; the Spad 7
"เจ้าผู้ครองนครน่านที่ 1" bought by the ruler before Nan had a road.

## §3 Beats (draft, 75 s: the extra time goes to the river moving, the flood and the plane)

| # | beat | kind | year CE (BE) | on screen |
|---|---|---|---|---|
| 0 | hero | arrive | hold 1359 (1902) | the hero boat(s) come down the Nan from Pua; settlers land on the east bank |
| 1 | chaehaeng | build | 1359–1368 | moat dug round the Chae Haeng hill, the first chedi on top |
| 2 | bull | cross | hold 1368 (1911) | the white bull wades across; a log wall rises on the west bank along its track |
| 3 | changkham | build | 1406–1430 (1949–1973) | Wat Chang Kham's chedi with its elephants, the town fills in |
| 4 | phumin | build | hold 1596 (2139) | Wat Phumin's cruciform hall on its naga pair, the town's centre |
| 5 | race | race | 1800–1812 (2343–2355) | the first ออกพรรษา races, boats along the town front |
| 6 | flood | flood | hold 1817 (2360) | the river rises over the log wall; the people carry the town north to Wiang Nuea |
| 7 | return | move | 1855–1857 (2398–2400) | the river swings east leaving an old channel; the town comes back, brick wall and gates rise |
| 8 | plane | arrive | hold 1926 (2469) | the biplane lands on the cleared field at Wiang Nuea, a crowd round it |
| 9 | road | arrive? | hold 1939 (2481) | (a different kind from #8) the first cars come in from Phrae over the hills |
| 10 | growth | grow | 1939–2017 | wide shot: the town spreads both banks, bridges, the airport |
| 11 | payoff | celebrate | 2025 (2568) | the boat race under the Phatthana Phak Nuea bridge, a field of naga boats (callback) |
| 12 | today | today | 2026 (2569) | counter lands and holds |

The engine runs on CE; captions show พ.ศ. Beats 3 and 4 are both `build` in a row: make 3
`settle` or merge it into 2's sub line. Beats 8 and 9 cannot both be `arrive` in a row: make 9 `connect`, or fold the road into the
growth beat's sub line.

## §1 Footprint and geography (from Gemini §4; the polygon comes from the workstation)

- Scale: likely 40 m/unit (Lopburi/Surin). The walled town is ~700–800 × 1,000–1,200 m
  (3.6 km of wall) = ~19 × 28 units; Phu Phiang Chae Haeng is 3 km SE across the river, Khao Noi
  2.3 km W; with Wiang Nuea 2–3 km N and the airport 3 km N, the tile needs ~±60 units at 40
  m/unit, or 50 m/unit to keep ±48. Decide once the pins are in.
- The Nan river: 30–40 m channel upstream; width at the town not found → measure on OSM
  (workstation). The old channel west of today's river (ท้องหลง) ran ~8 m from the east wall;
  today's river is 800–1,000 m east of the wall.
- Hills: Doi Khao Noi ~240 m ASL (50 m above the plain), Phu Phiang Chae Haeng ~225 m (30 m),
  the basin rims 600–1,200 m at 8–15 km (background ridges only).
- Gates (8): ไชย, น้ำเข้ม (E, river); ริม, อมร (N, 2450); ปล่องน้ำ, หนองห้า (W); เชียงใหม่, ท่าลี่ (S).
- Pins (Gemini §4.4, to check on Google Maps): Wat Phumin 18.774500, 100.771694; หอคำ
  18.776238, 100.770766; Wat Chang Kham 18.776113, 100.772047; Wat Phra That Chae Haeng
  18.758222, 100.791694; Wat Phra That Khao Noi 18.769887, 100.750641; north wall remnant
  18.780537, 100.768422; Phatthana Phak Nuea bridge 18.795113, 100.790984; Nan airport
  18.807778, 100.783333.

## Workstation tasks (PR #70)

ONEP polygon for Nan's old town (`docs/briefs/nan_onep/`), OSM river centreline and width
through the town and past Chae Haeng, the pins above checked, and the rims' heights.

## v1 build (25 Oct 2026)

`src/cities/nan/` at 70 m/unit, origin = the ONEP temple-core centroid. Contact sheet:
`nan_v1_contact.jpg` (0, 1.5, 5, 10, 15, 21, 27, 33, 39, 46, 52, 58, 66, 72 s).

- **The river is drawn by Landmarks, not the engine**: the channel under the east wall (old
  reach, drawn to the research) until the 2398 swing, then a strip pond to 2500, and today's OSM
  course after it. Occupancy bands carry each with its years. High water (wider ribbon) for the
  cover, the 2343 races and the payoff, so the boats float at hero scale.
- **Approximate**: the wall line apart from the north stretch (no survey; drawn round the
  temple core and inside today's river bend), the old channel, Wiang Nuea's place (2-3 km N,
  sizes from the research), and the airfield (today's airport is 3.8 km out; drawn 2.7 km
  with its bearing kept).
- **Dates changed after checking**: the plane is captioned "เปิดใช้ราว พ.ศ. 2470" (Thai
  Wikipedia: the airport opened 2470; Gemini's 15 May 2469 has no second source). The road is
  in the growth sub without a year (Highway 101 built 2481 per Wikipedia; the March 2481 =
  1939 opening is Gemini's).
- Beats as §3 with these changes: the siege beat (fight, 1446.6-1452.2, so the town's houses go
  up as the army comes), the bull is `legend`, the hero beat is `procession`, the return runs
  1854.6-1860 (houses come back over 4 years). No separate road beat.
- `npm run check`: 0 errors (grandeur and 75-s warnings). Soundtrack -16.0 LUFS.
