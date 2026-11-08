# Uttaradit (อุตรดิตถ์) — brief (v0, research stage)

Research: `uttaradit_research_request.md` → `uttaradit_research_gemini.md` ([gemini], pending).
Map: `uttaradit_onep/` ([local], pending: the old town of Phichai (เมืองพิชัย) on the Nan, Bang Pho Tha It (บางโพท่าอิฐ,
today's Uttaradit town), the Nam Phi iron pits at Thong Saen Khan, the Sirikit dam, and the story places from research
part 6). Look: shader only. Length: 60 s. Standard: storyline v2 (0 to 100).
Style frames: `uttaradit_styleframes.jpg` (A1, A2, B; `src/styleframes/uttaradit.tsx`).

## Why Uttaradit (owner, 8 Nov 2026: cloud proposed Uttaradit / Yasothon / Samut Songkhram, owner: "อุตร")

- **A symbol the province owns, not a national monument:** the Nam Phi iron (เหล็กน้ำพี้), dug at Ban Nam Phi, Thong Saen
  Khan, said to have made royal swords (the Phra Saeng and Phra Khan pits). It is in the provincial motto, and the village still forges
  swords and knives. Chanthaburi's read (§19) says the hook works but the shares need a symbol residents name as theirs.
- **A cover half-made by hand at frame 0 that changes shape** (§18-§19): a glowing bar on the anvil, half already beaten flat
  into a blade; the hammer walks down the rest, sparks at every blow, until it is a whole blade by ~2.3 s; it cools to steel,
  the hilt goes on, and it lifts.
- **A big, close event at 3-9 s, the same object:** the sword from the cover is Phraya Phichai's. The fight before Phichai's
  wall in 2316, the sword broken in the fight, the town held. The cover and the first event are one story, so the clip does
  not have to wait for a wall to rise before something happens (Chanthaburi's sag at 5-10 s).
- **A hero residents pass on:** พระยาพิชัยดาบหัก, honoured every January at the province's own fair (the 59th in 2569) and at
  the monument at Phichai and before the provincial hall.
- **A 0-to-100 spine:** the iron pits and the town of Phichai → the 2316 fight → Bang Pho Tha It, the river port where the
  Nan boats unloaded → the northern railway → the province moves its seat to Uttaradit and takes the name → the Sirikit dam →
  today's town; the payoff is the January fair with the giant sword back over the town.

## Workflow (same as Sakon Nakhon and Chanthaburi: the hybrid loop)

Research, map, build, render and QA run as a loop, but **the owner decides two things**: the cover (from the style frames),
and the 0-11 s stills before any render. Post 19:00-21:00 and **write down the post time** (Chanthaburi went up at midday).
If the owner can, an Uttaradit resident names the symbol (the iron, the sword, or the broken sword).

## First dates checked on the web (8 Nov 2026)

| fact | status | caption use | source |
|---|---|---|---|
| The Burmese attack Phichai a second time in **2316** and fail; Phraya Phichai fights until his sword breaks (ดาบหัก) | ยืนยัน for the year in Thai sources; the broken sword is **the chronicle's story** | **held 2316** | silpa-mag.com/?p=6141; trueplookpanya.com/learning/detail/31247 |
| The province marks the fight on **7 Jan 2316** | the province's date; **check** how it maps to the old Thai year (the new year then began in April, so January 2316 may be 1774 CE, not 1773) | day only if research confirms | dailynews.co.th/news/5480813 |
| Who Phraya Phichai Dap Hak was: Nidhi Eoseewong argues the title in the documents (พิชัยอาสา / พิชัยราชา) may not be the broken-sword hero | **ขัดแย้ง** | no caption; keep the hero as the legend names him | silpa-mag.com/?p=6141 |
| A 2317 royal letter grants Phraya Phichai dress and regalia as a commander against Chiang Mai | ยืนยัน (one academic source) | sub line at most | so02.tci-thaijo.org jdecho article 283849 |
| Phraya Phichai Dap Hak monument at Ban Huai Kha, Phichai, built 10 Jul 2545 | ยืนยัน (one source) | not needed | dailynews.co.th/news/5420261 |
| Nam Phi iron: villagers smelted it for weapons "since old times"; the Phra Saeng and Phra Khan pits; the village still forges swords; in the provincial motto | ยืนยัน for the craft today; **no start year found** | cover (no year) | khaosod.co.th travel news_2977715; thaipost.net/main/detail/22442; ThaiJO journal-peace 102552 |
| Phichai, an excavated ancient town | ยืนยัน (an excavation report exists); dates for research | the first beat | so01.tci-thaijo.org damrong 21537 |
| The seat moves from Phichai to Bang Pho Tha It and the province takes the name Uttaradit | **not found** on the web yet (often given as 2458, Rama VI) | none until research confirms | — |
| The northern railway reaches Uttaradit | **not found** yet | none until research confirms | — |

Still to find (research request parts 1-6): Phichai's age and wall, the route of the 2316 attack and the place of the fight,
the Nam Phi pits' history and how the iron is smelted, Bang Pho Tha It's port (teak rafts, boats up the Nan), the railway's
year and the Sila At station, the move of the seat and the name, the Sirikit dam's years, the fair's date and look today.

## Covers (style frames, 8 Nov; `uttaradit_styleframes.jpg`)

**v2 (owner, 8 Nov: "เลอะเทอะ"; the cover must show the whole square land tile, like Korat, Chiang Mai, Udon and
Ratchaburi).** The first frames put a close camera on the anvil and showed no land, the mistake CLAUDE.md already names
("The cover shows the land, with a giant on it"). v2 puts the hero at legend scale on a forest tile with the Nan down its
west side, the soil edge in frame, camera 290-335 out at 36 degrees (B 28), as Udon's jar (~26 units) does.

Each measured against §17-§19 at frame 0: the symbol moves, is half-made (no blank canvas) and changes shape.
- **A1 (cloud's recommendation): the Nam Phi iron forged into a giant sword on the land.** An anvil ~17 units high on its
  log in a clearing, a low pit of glowing coals beside it; the sword is ~40 units long. At frame 0 the tip half is already a
  flat blade and the hammer is on the next segment; each blow flattens a segment and throws sparks; by ~2.3 s it is all
  blade; it cools from orange to steel, the hilt goes on, and it lifts. The change is of **shape** (bar → blade) and heat,
  and the sound writes itself (hammer, hiss, ring).
- **A2: the twin swords (ดาบสองมือ),** two bars forged side by side, two hammers out of step. Closer to Phraya Phichai, but
  from this distance two blades read as one wider slab.
- **B: a giant Phraya Phichai (~26 units) beside the small walled Phichai,** a sword in each hand raised in a V; one blade
  snaps at ~2.2 s and its half spins away. Nothing is half-made at frame 0, and the figure reads as a toy; better as the
  first event (3-9 s).

What is placeholder in the frames: the anvil and coals are simple solids; there is no smith (the hammer swings alone, as the
lap had no hand in Chanthaburi's frames); the blade is a straight dap drawn in 12 segments; the Nan's course is drawn by
eye until [local]'s map; the year counter shows 2243 because the frames borrow Korat's story; the B figure is a Nan walker
scaled up.

**Owner picked A1 (8 Nov): the Nam Phi iron forged into a giant sword on the land.** B's broken sword goes to the first
event after the cover (3-9 s). Research to confirm: what raw Nam Phi iron and a Nam Phi forge look like, and the shape of
Phraya Phichai's sword (straight or curved dap).

## Storyline worksheet (`docs/storyline.md` §5) — first guess, before research

```
Hero (0-3 s): a glowing bar of Nam Phi iron beaten into a sword on the anvil   BIG IDENTITY MOVING SURPRISING (the sparks)
Hero sound: hammer blows on the beat, the hiss of the cooling blade, a ring when it lifts
Open loop: "whose sword?" -> answered at 3-9 s (Phraya Phichai) and again at the payoff (the fair)
First event (3-9 s, close): Phichai, 2316: the Burmese at the wall, the hero with two swords, one breaks, the town holds
Spectacle (by 12 s): the attackers fall back from the wall; the gate opens; the hero's sword raised
Middle beats, one verb each: forge (cover) / fight (2316) / trade (the Nan port at Bang Pho Tha It) / arrive (the train) /
  move (the seat to Uttaradit, the new name) / dam (Sirikit) / grow
Grow shot: the town spreads along the Nan and the railway
Payoff (45-54 s): the January fair, the crowd at the monument, the giant sword back over the town
Tagline: ............
Facts with nothing to show: 2317 regalia letter; the monument's year
```

Risk to watch: the first event is a fight. As with Suphanburi and Chanthaburi: no suffering shown, the attackers fall back,
the broken blade is the story's image, not a wound.

## Open questions

- 7 Jan 2316: which Western year, and what source gives the day?
- When did the seat move from Phichai to Bang Pho Tha It, and when did Uttaradit take its name?
- When did the railway reach Uttaradit, and when was the Sirikit dam closed?
- How old is Nam Phi smelting, and what does the forge there look like (bellows, hearth, the anvil)?
- Does Phraya Phichai's sword in the story have a shape (a straight dap or a curved one)?

## Research checked, storyline proposed (cloud, 8 Nov)

[gemini] answered (`uttaradit_research_gemini.md`, a105b3c); [local] traced Phichai's wall from the Treasury survey and pinned
20 places (`uttaradit_onep/`, 3c5fb14). Cloud re-checked the years that disagree on the web the same day.

### Years for the screen

| fact | status after checking | caption use |
|---|---|---|
| Phichai's wall first built, จ.ศ. 852 = **2033** (Luang Prasert chronicle; some later texts 2037); a long four-sided town on the **east** bank of the Nan, 1,345 m × 419-645 m, NNW-SSE ([local], Treasury survey) | ตามพงศาวดาร; shape ยืนยัน | sub line "ราว 2033"; the wall rises on the beat, no held year |
| The second Burmese attack on Phichai (Po Suphla), ปีมะเส็ง จ.ศ. 1135 = **2316**; the town holds | ยืนยัน (all Thonburi chronicles) | **held 2316** |
| Phraya Phichai fights with two swords until one breaks | **ตามพงศาวดาร** (the Phanarat / royal-autograph recensions, not Phan Chanthanumat); the right sword, Wat Ekka and 7 Jan come from Phraya Si Satchanalai's 2462 life | caption says "ตามพงศาวดาร"; no day on screen |
| 7 Jan 2316 = **January 1774 CE** (the Thai year then began in April) | ยืนยัน (gemini §5.1; matches cloud's 8 Nov note) | the counter shows 2316 (and ค.ศ. 1774 if the ค.ศ. line is shown) |
| The sword was Nam Phi iron | **ไม่พบ** in any contemporary source; a local belief | never captioned as fact; the cover makes no claim (the iron is the province's, the sword is the story's) |
| Bang Pho Tha It, the head of navigation on the Nan (boats stop at the rapids above; teak and forest goods trans-shipped), Rama III-V | ยืนยัน for the role; **no start year** | sub line, no held year |
| Bang Pho Tha It made "เมืองอุตรดิตถ์" under Phichai, 2430 | ขัดแย้ง (province site; other years mixed in) | none |
| The seat moves from Phichai to Bang Pho Tha It | **ขัดแย้ง**: 2442 (gemini, province), **2457** (Treasury survey, [local]), 2458 (ONEP doc) | no own year; folded into the 2458 beat as "ศาลากลางย้ายขึ้นมาท่าอิฐ" |
| The northern railway: Phitsanulok-Ban Dara 11 Nov 2451; **Ban Dara-Uttaradit-Pang Ton Phueng 15 Aug 2452**; the Paramin bridge over the Nan at Ban Dara opened Dec 2452 (some pages say 2453: the April new year) | ยืนยัน (th.wikipedia northern line table; pandinthaipost) | **held 2452** |
| Mueang Phichai renamed **เมืองอุตรดิฐ**, gazette vol. 32, 22 Aug **2458** (the province marked 111 years in 2569); "จังหวัด" from 2459 | ยืนยัน | **held 2458** |
| Sila At station, 1 Nov 2501 | ยืนยัน (gemini; one source) | grow shot, no held year |
| Monument before the provincial hall, 2512 (Sanan Silakorn); the fair from 2510 | 2512 ยืนยัน (ThaiJO jdecho); 2510 **not confirmed** | payoff; no held year |
| Sirikit dam: works 2511, foundation stone 27 Feb 2514, dam done ~2515, opened **4 Mar 2520**; old Tha Pla drowned | ยืนยัน (several news sources) | **held 2520** |
| Highway 11 east of town, 2521-2524 | ยืนยัน (one source) | grow shot |
| The 59th Phraya Phichai fair, 7-16 Jan **2569** | ยืนยัน | payoff, the counter lands on 2569 |
| Not shown (storyline §3.6a): the WWII bombing of the bridge and yards, the 2508/2515 market fires, Rom Klao 2530-31, the 2549 landslides | — | none |

### The tile (compressed, directions from [local]'s bearings)

One tile of the Nan valley, north up the tile: **today's town (Bang Pho Tha It) in the north half on the west bank**, the Nan
looping round its east side; **Phichai's long wall at the south edge on the east bank**, the river to its south-west; the
**Nam Phi hills on the east** (real bearing ESE, 24 km); the **Sirikit dam in the north-east corner** (ENE, 51 km). The 36 km
from Phichai to the town is pulled in to about a third of the tile's height, as Chanthaburi pulled in its river mouth. The
railway runs N-S down the west of the valley and crosses the Nan at Ban Dara (the Paramin bridge) between the two towns. New
camera keys follow the footprint (CLAUDE.md).

### Storyline (60 s, v2 standard)

| s | beat (one verb) | on screen | year |
|---|---|---|---|
| 0-3.0 | **forge** (cover, A1) | the giant anvil in a clearing in the Nam Phi hills; the glowing bar beaten into a sword; it cools, lifts | no counter |
| 3.0-4.4 | **raise** (hand-off) | the sword rises and the camera swings south-west down the valley; Phichai's long wall rises on the east bank of the Nan | counter runs ~2033 → 2316; sub line "กำแพงเมืองพิชัย ราว 2033" |
| 4.4-11.0 | **fight** (the close event, inside 3-9 s) | a legend-scale Phraya Phichai (Suphanburi's 8x rule) before the wall, the cover's sword in his right hand and a second in his left; a Burmese column (scaled up) comes down the river from the north; the right sword snaps at ~7 s (flash, the half spins off); the column breaks and falls back north; the gate holds | **held 2316** (≥ 1 s), caption "ศึกเมืองพิชัย" / "ตามพงศาวดาร พระยาพิชัยรบจนดาบหัก" |
| 11.0-17.5 | **trade** | the camera travels up the Nan to Bang Pho Tha It: big boats stop below the rapids, teak rafts float down, a market row grows on the west bank | counter runs (ราว รัชกาลที่ 3-5), sub line "ท่าเหนือ: เรือใหญ่ขึ้นได้สุดที่นี่" |
| 17.5-24.5 | **arrive** | the train crosses the Paramin bridge at Ban Dara and runs north up the west of the valley into Uttaradit station; shophouses spread from the river to the station | **held 2452** |
| 24.5-30.5 | **rename** | the provincial hall rises in town, the flag goes up; down at Phichai the wall settles to fields (ruinStrength); the name changes on screen | **held 2458**, sub line "ศาลากลางย้ายจากพิชัยขึ้นมาท่าอิฐ" |
| 30.5-37.0 | **dam** | in the north-east corner the dam closes the Nan's gorge and the lake fills behind it; the river below runs steady | **held 2520** |
| 37.0-45.0 | **grow** (the grow shot, wide) | the town spreads north to Sila At and east to Highway 11; the railway yards; orchards up the Laplae hills to the west | counter runs to 2560s |
| 45.0-56.0 | **gather** (payoff + callback) | the January fair before the hall: crowds round the monument, lights; the giant sword from the cover returns over the town, whole, and turns | lands on **2569**, caption "งานพระยาพิชัยดาบหัก ครั้งที่ 59" |
| 56-60 | — | hold the wide shot; nothing new on screen (last 4 s) | 2569 |

Where the fight is drawn: the chronicle says outside the town; local history (Phraya Si Satchanalai, 2462) names the field
of Wat Ekka, 1.6 km SW across the Nan on the **west bank** ([local], 87b116c). v1 draws the hero on the west-bank field
facing the wall across the river, so the clash reads against the wall and the place follows the local story; the Burmese
column comes down the west bank from the north.

What is drawn for the screen, to list in the v1 notes: the hero and the column at legend scale; the sword from the cover
in the hero's hand (the story's link, not a claim about the iron); the 36 km pulled in; the dam drawn on the tile.

Open for the owner (cloud decides if no answer, as in the hybrid loop): keep the dam (big and real, but 51 km off), or spend
those 6 s on the 2501 Sila At yards and the Laplae orchards.
- Owner (8 Nov): "เอาที่คิดว่าดี" on the dam question; cloud keeps the dam (2520).

## v1 build (cloud, 8 Nov)

`src/cities/uttaradit/` (places, geo, timeline, actors, Landmarks, index), `scripts/soundtrack_uttaradit.py`, composition
`Uttaradit` (`npm run render:uttaradit`, `npm run audio:uttaradit`). `npm run check`: 0 errors for the city (1 warning:
old Phichai covers 0.8% of the tile on wide shots). Soundtrack -16.0 LUFS, true peak -1.9 dBTP, score +2.5 LU over the
effects, ambience 10.7 dB under the score. Stills: `uttaradit_v1_gate.jpg` (0-10 s) and `uttaradit_v1_contact.jpg`
(13-56 s). No render yet.

Beats as built (s): hero 0-3.0 · raise 3.0-4.6 (counter 2033-2042, callout "กำแพงเมืองพิชัย ราว 2033") · fight 4.8-9.4
(hold 2316, snap 7.0 s) · trade 10.0-16.6 · arrive 17.0-23.2 (hold 2452, bridge ~19.6 s) · rename 23.6-29.0 (hold 2458) ·
dam 30.2-33.4 (counter runs 2460-2519) · fill 33.6-37.6 (hold 2520) · grow 38.4-45.6 · gather 46.2-54.0 · today 54.4-55.6
(lands on 2569). Verbs: legend, build, fight, trade, arrive, celebrate, build, disaster (old Tha Pla drowned), grow,
celebrate, today.

What is drawn for the screen (approximate, say so if asked):
- **The tile is two true-scale patches:** the town round the monument (OSM, 100 m/unit) and old Phichai's traced wall moved
  north from 36 km to ~4 km, drawn ~12 degrees west of due south (true ~3). The Ban Dara reach of the Nan, where the line
  crosses it, is drawn by hand at z ~21 (true 27.5 km S). The Nam Phi hills, the dam and its gorge are pulled in.
- **The railway is one straight N-S line** (the engine's rail) 160 m W of the river's west-bank reach: Uttaradit station is
  drawn 370 m W of its OSM pin, Sila At 220 m W (east of the track). The Paramin bridge is the engine's rail bridge.
- **The cover's anvil stands on the east bank below the Nam Phi hills**, at legend scale (sword 30 units = 3 km), the whole
  tile round it; it sinks away as the sword flies. The sword is the story's link, not a claim that the hero's sword was
  Nam Phi iron (research §5.3: not found in any contemporary source).
- **The fight:** the giant (~13 units) stands on the west-bank field of Wat Ekka (local history) facing the column; the
  column (18 spearmen, 2.4x) comes down the west bank from the north and falls back; the right sword snaps at 7.0 s; he
  rises out of the field and sinks back into it. Nobody is hurt on screen.
- **The market row, station, shophouses, hall, Sila At yards, orchards, dam and the fair** are hand-placed and grow on
  their beats; the monument (2512) rises at the start of the grow shot, not on its own year.
- **Not pinned in geo.ts:** Ban Huai Kha, Wat Ekka and the Nam Phi pits (none is named on screen; the squeeze bends their
  bearings from Ban Dara and the dam beyond 30 degrees).
- **Known soft spots for the owner's stills pass:** the giant reads as a simple figure (white body, red sash) and, seen from
  behind, the broken stub is hard to see after 8 s; the rafts arriving at the landing (16 s) bunch into a strip; the
  fill caption's sub wraps one word ("อ่าง") onto a second line; the returning sword shows its dark edge while it comes
  down (49-50 s) before it levels over the plaza.

### v1b (cloud, 8 Nov; owner via the coordinator: "จัดการให้เรียบร้อยจนพร้อม render แล้วส่งให้เครื่อง render เลย")

- **Cover:** the sword is the style frame A1's size (40 units, was 30) and the camera sits a little closer (288-294,
  elevation 34, target on the anvil's side of the tile): the sword spans about a third of the frame at 0 s and the tile
  and its soil edge stay in frame. The coal pit is smaller and on the camera side, clear of the Nan's loop.
- **The 2316 hero:** a proper figure at the same legend scale (thick legs, an indigo jongkraben, a dark jacket with a red
  sash, sleeved arms and fists, dark hair with a topknot), turned three-quarter to the camera (yaw -0.85), both swords
  raised; the right blade now breaks three-quarters of the way up, so only a short stub stays in his hand after 7 s and
  the rest spins away.
- **Rafts:** strung along the river loop 4.2 apart, the last ones still on the water upstream of the landing.
- **Dam caption:** sub shortened to "พ.ศ. 2520 กั้นแม่น้ำน่าน ท่าปลาเก่าจมใต้อ่าง" (one line); every title is one line.
- **The returning sword:** light steel (its own material with a cool sheen), point down with its flat turned to the
  camera, smaller (7 units) and lower, beside the monument so it stays out of the caption band and off the callout.
- **ค.ศ. under 2316:** the overlay prints `ค.ศ. Math.round(Y)` (src/Overlay.tsx, engine-wide) and has no per-beat
  override, so it shows 1773 while the January 2316 fight is January 1774 CE. Left as is (an engine change is outside
  this city); the caption itself names only พ.ศ. 2316.
- **Physical checklist on the new frames:** nothing on open water but boats and rafts; no wall across the river (Phichai
  sits on the east bank, the river SW of it); the cover's log and coals on land; the giant and the column on the
  west-bank field; the station beside the track; the dam across the gorge with the lake behind it; every callout points at
  something visible. `npm run check` 0 errors (1 warning: old Phichai is 0.8% of the tile on wide shots). Timing is
  unchanged, so the soundtrack stands (-16.0 LUFS, score +2.5 LU, ambience -10.7 dB).
- **Render-ready:** waiting on [local] (`npm run render:uttaradit`, then `npm run encode -- uttaradit`, `check_render`).
