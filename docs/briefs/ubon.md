# City brief — Ubon Ratchathani / อุบลราชธานี

Status: **v1 built** (22 ต.ค. 2569): `src/cities/ubon`, contact sheet `ubon_v1_contact.jpg`; the hero is the naga on the candle (owner: "ลุยต่อได้เลย"). Research pass 2: Pass 1 was a cloud web search. Pass 2 folds in the owner's Gemini
research (`ubon_research_gemini.md`, verbatim) and re-checks the caption dates against it. Dates
marked **ตรวจแล้ว** have at least two independent sources. The ONEP polygon and the OSM pins still
need the workstation (ONEP refuses the cloud).

Why Ubon (owner, 22 ต.ค.): Isan is about a third of Thailand's population and 4 of our 16
clips; the North is 6. Isan also holds our two best engagement reads: Korat (skip 32.9%) and
Khon Kaen (share 1.4%).

## 0. Built on what worked: Korat and Chiang Mai

The owner asked for the plan to follow the two best clips. Neither was built to the storyline
standard, and the two clips that were (Phetchaburi 50.4%, Chiang Rai 58.3%) are our two worst
reads. So this plan starts from what Korat and Chiang Mai actually have in common, and keeps
only those parts of the standard that the reads support.

| | Chiang Mai | Korat | what Ubon takes |
|---|---|---|---|
| frame 0 | the whole tile + Doi Suthep | 3 big dinosaurs, **walking**, centred | a big living thing that moves (§3, hero) |
| one shape the eye knows | the moated square | the walled rectangle with its four gates | the town on the Mun's north bank around ทุ่งศรีเมือง, the river bend held in one framing |
| a founder with a name | พญามังราย | สมเด็จพระนารายณ์ | เจ้าคำผง (พระปทุมวรราชสุริยวงศ์) |
| a turn of fortune | earthquake, then 200 years under Burma, then revival | ศึกเจ้าอนุวงศ์, then ย่าโม wins | the flood that drives the founders off their first site; the frontier years after 2436 |
| a train arrives | 2464 | 2443, the first line in Siam | 1 เม.ย. 2473, Warin station |
| ends on something big | modern city on 46% of the tile, Doi Suthep behind | modern city on 44% | Ubon + Warin across both banks, the airfield, the candle procession |
| length, beats | 60 s, 11 captions | 60 s, 11 captions | **60 s, 9–10 beats** |
| sound | −16 LUFS, 6.5 LU range | −16 LUFS, 6.2 LU range | the new master gives −16; write quiet passages for the range |

Lessons kept from the later reads:
- People on screen from the first beat after the title. Korat lost most of its audience in 3–17 s,
  which was archaeology with no people in it.
- Every beat is an event big enough to read on a phone. Phetchaburi's porters and Chiang Rai's
  rising hands were too small to count as motion.
- Never a static landmark at frame 0. Five clips say so.
- The camera stays under the 700 jerk limit (`glide()`), and the clip is 60 s.

Dropped from the standard for this clip: the beat-verb variety rule stays in force, because
`check_story` enforces it, but we do not add beats to satisfy it. Korat's and Chiang Mai's
arcs are simple: before → founding → turn → rebirth → train → modern.

## 1. Footprint

- **ONEP:** check `oldtown_all.shp` for เมืองเก่าอุบลราชธานี. I could not confirm from the cloud
  that it is an announced old town; a TCI paper on the เขตเทศบาลนครอุบลราชธานี old quarter dates
  its periods 2322 / 2436 / 2497 / 2518–2535. If there is a polygon, pull it into
  `docs/briefs/ubon_onep/` as Lampang's and Chiang Rai's were. If not, trace the old quarter between
  the Mun and ทุ่งศรีเมือง from OSM, as Khon Kaen's was.
- **No wall, no moat** (to verify): use `noWall`, as Khon Kaen and Phuket do. The shape the eye
  holds onto is the Mun's bend with the town on the north bank and ทุ่งศรีเมือง, the town field,
  in the middle.

## 2. Water

- แม่น้ำมูล along the south edge of the old town, a path river traced from OSM at its real width.
  Pass 2 measures it in metres, then converts at 80 m/unit.
- The Mun reaches the Mekong at Khong Chiam, about 80 km east; that is a `far` point at most.
  The two-coloured confluence (แม่น้ำสองสี) is a possible finale shot.
- Warin Chamrap lies across the Mun to the south: one bridge in the modern beats (year to verify).

## 3. Story beats (60 s)

### 3.0 Facts for the captions (pass 2)

| fact | status | caption use |
|---|---|---|
| ผาแต้ม: fish (some read as ปลาบึก, up to 4 m), an elephant, hands; X-ray fish at ผาขาม | real; **age disputed**: 3,000–4,000 years (กรมศิลปากร, the park), 5,000–6,000 (some articles) | "หลายพันปี", never one number |
| 2314: after หนองบัวลุ่มภู fell, พระวอ, ท้าวคำผง and the others led their people down the Mekong and the Mun to ดอนมดแดง | Gemini: ยืนยัน (พงศาวดารหัวเมืองมณฑลอีสาน, the province site) | sub line |
| the great flood at ดอนมดแดง; the move to ห้วยแจระแม (บ้านท่าบ่อ), then ดงอู่ผึ้ง on the Mun's north bank | **year disputed: 2319 / 2321 / 2329** | show the flood, **no year in the caption** |
| ดงอู่ผึ้ง: a forest of wild bee nests; the town sent ส่วยผึ้ง (beeswax) to Bangkok | Gemini, citing พงศาวดารหัวเมืองมณฑลอีสาน; to confirm | the bridge from bees to candles, sub line |
| raised to เมืองอุบลราชธานีศรีวนาไลยประเทศราช; ท้าวคำผง becomes พระประทุมวรราชสุริยวงศ์, the first ruler | **2335, ตรวจแล้ว** (province, ข่าวสด, ศิลปวัฒนธรรม, Gemini citing จดหมายเหตุ ร.1). The exact day, 16 ก.ค., rests on that one archive record. 2324–25 is when the settlement began (จารึกวัดมหาวนาราม 2350) | caption "พ.ศ. 2335"; give the founder's name, not พระวอ–พระตา (§ cautions) |
| วัดหลวง, the town's first temple, on the Mun bank | year disputed (2322 / 2334 / after 2335) | landmark, no year |
| หอไตรกลางน้ำ, วัดทุ่งศรีเมือง, in the reign of Rama III | Gemini: กรมศิลปากร, ~2384–85 | landmark |
| 2434: the มณฑลลาวกาว HQ at Ubon; ร.ศ. 112 (2436) makes Ubon a frontier town; กรมหลวงสรรพสิทธิประสงค์ arrives 10 ธ.ค. 2436 | Gemini: ยืนยัน; one cloud source agrees on 2434 | sub line or a short beat |
| **2444: the first candle procession**, under กรมหลวงสรรพสิทธิประสงค์, in place of the rocket festival | **year ตรวจแล้ว** (Amarin TV, Thai Post; the province counts **125 years in 2569**). That a rocket killed someone is from one source (UBRU) | caption "พ.ศ. 2444"; the rocket accident stays out |
| 1 เม.ย. 2473: the train reaches สถานีวารินทร์ on the south bank; people cross by boat and ferry | **ตรวจแล้ว** | beat |
| 2487–88: Allied POWs build an airfield; townspeople (ยายไหล ศิริโสตร์) feed them; the POWs leave อนุสาวรีย์แห่งความดี on ทุ่งศรีเมือง | Gemini + ศิลปวัฒนธรรม | strong local story, but it is wartime suffering: a sub line at most, owner's call |
| 2497: สะพานเสรีประชาธิปไตย, the first bridge over the Mun, 450 m | year ตรวจแล้ว (Wikipedia EN, gotoknow); the story of a public vote over its name is single-sourced and told differently | beat; no naming story |
| 2508–2517: the USAF base (8th TFW, F-4) | **ตรวจแล้ว** | aircraft on the runway only |
| 2569: the procession's 125th year in **2569, this year** | ตรวจแล้ว (Thai Post, Thansettakij) | the payoff caption |

Cautions from the research (§5), all kept:
- The founder of the town is ท้าวคำผง (พระประทุมวรราชสุริยวงศ์), not "พระวอ–พระตา". Those two
  were the ancestors who led the migration and died before the town was founded.
- Use "ขบวนการผู้มีบุญ", not "กบฏผีบุญ", if the 2444–45 rising is mentioned at all. It is out of
  the picture either way.
- Write แม่น้ำมูล, the official spelling.

### 3.1 Beats

| s | beat (kind) | on screen | caption |
|---|---|---|---|
| 0–3 | **hero** (legend) | title over the whole tile; the hero moves, big and centred (§3a) | — |
| 3–8 | legend | the painted fish and hands of ผาแต้ม, people painting the cliff | ภาพเขียนสีผาแต้ม · หลายพันปีก่อน |
| 8–14 | arrive | boats, carts and elephants come down the Mun to ดอนมดแดง from the tile's north-west corner | ล่องลำน้ำมูล · พ.ศ. 2314 |
| 14–19 | disaster | the Mun rises over the island camp; the people move to the high bank among the bee trees (ดงอู่ผึ้ง) | น้ำท่วมใหญ่ (no year) |
| 19–26 | build | the town rises around ทุ่งศรีเมือง, วัดหลวง on the bank | เมืองอุบลราชธานี · พ.ศ. 2335 |
| 26–31 | trade | the frontier town: the grid of roads, offices, the telegraph | หัวเมืองชายแดน · ร.ศ. 112 / 2436 |
| 31–37 | celebrate | the first candle procession, bound candles on carts round ทุ่งศรีเมือง | แห่เทียนครั้งแรก · พ.ศ. 2444 |
| 37–42 | arrive | the train reaches Warin; boats and the ferry cross the Mun | รถไฟถึงวาริน · พ.ศ. 2473 |
| 42–48 | grow | the bridge (2497), the air base, the wide shot of both banks filling | — |
| 48–56 | celebrate (payoff) | today's procession of giant carved candles, the hero returns | 125 ปี แห่เทียนอุบล |
| 56–60 | today | the counter holds on 2569, the finale card | |

The candle is both the town's best-known symbol and the clip's heart, and it appears three times:
- the bee forest at 14 s;
- the first procession at 31 s;
- the payoff at 48 s.

That is the "same framing, centuries apart" that makes Chiang Mai work, applied to one tradition.

Out (`docs/storyline.md` §3.6a):
- the 2562 and 2565 floods;
- the rocket accident of 2444;
- the ผู้มีบุญ rising;
- base life beyond aircraft on a runway.

The POW story is the owner's call.

### 3a. Hero options

The owner, on reading the research: "ประเพณีแห่เทียนเป็นสิ่งที่เด่น". The reads still say a
static object loses. The options below are ranked by how close each is to Korat's hook:

1. **The naga on the giant candle comes alive (recommended).** A giant carved candle stands
   at the centre of the tile. Its naga uncoils, slides down into the Mun and swims. In the payoff
   it climbs back onto a candle in today's procession. The candle is Ubon's symbol; the naga is
   the living, moving thing; and nagas are among the commonest carvings on Ubon candles. It is a
   legend picture, so it carries no caption and no year.
2. **The painted fish of ผาแต้ม.** Built as a style frame; the research scores it 9.5/10. It is a
   true animal and the province's oldest picture, but it is not the candle.
3. **นกหัสดีลิงค์**, the research's own first pick: an elephant-headed bird flying down to
   ทุ่งศรีเมือง. It is uniquely Ubon and alive. But it is a cremation pyre, so it opens the clip on
   a funeral; I would not lead with it.
4. **The candle float itself, moving** (built as a style frame): the plainest, and the symbol
   class that has lost every time.

## 4. Pins (Gemini §4, converted with `scripts/geo.mjs`)

Origin: ทุ่งศรีเมือง, 15.230222, 104.857306. 80 m/unit, +x east, −z north. Every pin is to be checked
on OSM by the workstation.

| place | lat, lon | model |
|---|---|---|
| ทุ่งศรีเมือง (centre; ~340 × 220 m, i.e. 4.3 × 2.8 units) | 15.230222, 104.857306 | [0, 0] |
| ศาลหลักเมือง | 15.228581, 104.857683 | [0.5, 2.3] |
| วัดทุ่งศรีเมือง, หอไตรกลางน้ำ | 15.230000, 104.860833 | [4.7, 0.3] |
| วัดศรีอุบลรัตนาราม | 15.227569, 104.856192 | [−1.5, 3.7] |
| วัดหลวง (on the Mun bank) | 15.225346, 104.860424 | [4.2, 6.7] |
| สะพานเสรีประชาธิปไตย | 15.222700, 104.857300 | [0, 10.4] |
| สถานีอุบลราชธานี (วาริน) | 15.200500, 104.858700 | [1.9, 41.1] |
| สนามบิน / กองบิน 21 | 15.251278, 104.870231 | [17.4, −29.1] |
| บ้านท่าบ่อ / ห้วยแจระแม (first site after the flood) | 15.255142, 104.823857 | [−44.9, −34.4] |
| ผาแต้ม (`far`) | 15.383333, 105.525000 | real [896, −212]; bearing ~77° |
| ปากมูล, โขงเจียม (`far`) | 15.318161, 105.500944 | real [864, −122] |

Real dimensions in metres:
- the Mun at the bridge: ~190 m of water (2.4 units), and 250–350 m with its sandbars;
- the old core: ~1.6–1.8 km along the river by ~1 km inland (1935 municipality: 1.65 km²);
- the road grid: ถนนเขื่อนธานี follows the old moat line.

So the tile holds:
- the town on the north bank, around [0, 0];
- the Mun ~10 units south of it;
- Warin and the station near the south edge;
- the airfield to the north-east;
- the first site in the north-west corner, so the migration crosses the tile.

## 5. Grandeur

- **No hills.** The plain has no real mountains; the Phanom Dong Rak range is far south. So the
  big thing is the city.
- Grow Ubon and Warin to their real built-up extent on both banks, so the final wide shot holds
  thousands of roofs over the Mun bend.
- Put the airfield in `openGround`.
- Keep the same framing at 20 s (the first town), 39 s (the train) and 50 s (the modern city),
  so the viewer watches it grow in place, as Chiang Mai does.

## 6. Sound

- The instruments:
  - **pin**, the Isan lute (`khaen` exists in `synth.py`; a plucked pin is new);
  - **khaen** for the founding and the procession;
  - **pong lang** for the modern beats.
- Small sounds for everything that moves:
  - fish splashes;
  - oars and carts in the migration;
  - rain and rising water in the flood;
  - a soft pop per house;
  - the train;
  - distant jet engines, kept low, never a roar;
  - drums and crowd in the procession.
- The master gives −16 LUFS. Leave the flood and the moment before the payoff quiet, so the
  loudness range lands near Korat's 6 LU instead of the 2–4 LU of the last four clips.

## 7. Open questions

1. **Owner:** which hero? I recommend the naga coming off the candle (§3a) and will build it as a style frame.
   Also the owner's call: the POW story (อนุสาวรีย์แห่งความดี), as a sub line or not at all.
2. **Done in pass 2:**
   - the founding year: 2335;
   - the first procession: 2444;
   - the train: 2473;
   - the bridge: 2497.

   The flood year stays disputed, so its caption carries no year.
3. **Workstation:** the ONEP polygon if one exists, the OSM pins for §4 and the Mun's centreline.
4. **Phuket's read** (about 23 ต.ค.) tests a living, moving hero again. If it fails, revisit §3a
   before building.

Sources (pass 2, besides `ubon_research_gemini.md`):
- [Amarin TV, แห่เทียนพรรษา](https://www.amarintv.com/lifestyle/trendy/518787)
- [ไทยโพสต์, 125 ปี แห่เทียนพรรษาเมืองอุบลฯ](https://www.thaipost.net/news-update/1043062/)
- [Wikipedia, Seriprachathippatai 2497 Bridge](https://en.wikipedia.org/wiki/Seriprachathippatai_2497_Bridge)
- [ศิลปวัฒนธรรม, อนุสาวรีย์แห่งความดี](https://www.silpa-mag.com/?p=40184)

Sources (pass 1):
- [ข่าวสด, อุบลราชธานี (ตอนจบ)](https://www.khaosod.co.th/lifestyle/news_2913775)
- [ศิลปวัฒนธรรม, กว่าจะเป็นจังหวัดอุบลราชธานี](https://www.silpa-mag.com/?p=117040)
- [ศิลปวัฒนธรรม, อุบลราชธานีกับร่องรอยอิทธิพลของเมืองหลวง](https://www.silpa-mag.com/?p=38847)
- [TCI, จากเทียนเวียนหัว ถึงประเพณีแห่เทียนเข้าพรรษา](https://so06.tci-thaijo.org/index.php/mcjou/article/view/273429)
- [ไทยโพสต์, 118 ปีเทียนอุบล](https://www.thaipost.net/main/detail/40325)
- [Wikipedia, Ubon Ratchathani railway station](https://en.wikipedia.org/wiki/Ubon_Ratchathani_railway_station)
- [Wikipedia, Ubon Royal Thai Air Force Base](https://en.wikipedia.org/wiki/Ubon_Royal_Thai_Air_Force_Base)
- [ศิลปวัฒนธรรม, ผาแต้ม](https://www.silpa-mag.com/?p=32923)
- [TCI, ย่านเมืองเก่า เขตเทศบาลนครอุบลราชธานี](https://so01.tci-thaijo.org/index.php/humanjubru/article/view/276960)
