# City brief — Ubon Ratchathani / อุบลราชธานี

Status: plan, pass 1 (22 ต.ค. 2569), cloud container, web search only. Dates marked
**ตรวจแล้ว** have at least two sources; the rest are to be verified in pass 2 before any caption
is written. The ONEP polygon and the OSM pins need the workstation (ONEP refuses the cloud).

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

Draft only. Every date is checked in pass 2.

| s | beat (kind) | on screen | date status |
|---|---|---|---|
| 0–3 | **hero** (legend) | title over the whole tile; the painted fish of ผาแต้ม swim up the Mun, big and centred | Pha Taem: fish (4 large, X-ray style, at ผาขาม) and an elephant are real. Age is disputed: 2,500 / 3,000 / 4,000 / 5,000–6,000 years. Say "หลายพันปี" |
| 3–8 | legend | the fish become the river; people on the cliff painting hands and fish | as above |
| 8–15 | arrive | เจ้าคำผง's people come down the Mun with carts and boats and build at ห้วยแจระแม | the move from Champasak and the camp at ดอนมดแดง, around 2313 |
| 15–20 | disaster | a great flood drives them to higher ground at ดงอู่ผึ้ง, on the Mun's north bank | flood around 2319, by one source; to verify |
| 20–27 | build | the town rises around ทุ่งศรีเมือง; Rama I names it อุบลราชธานี | **disputed: 2325 (ศิลปวัฒนธรรม) or 16 ก.ค. 2335 (ข่าวสด)**. Do not caption it until checked |
| 27–33 | trade or fight | the headquarters of the Lao-Kao circle moves to Ubon (2434); the French frontier after 2436 | 2434 (one source) |
| 33–39 | celebrate | the first candle processions replace the rocket festivals, under กรมหลวงสรรพสิทธิประสงค์ | around 2444, my arithmetic from "118 ปีเทียนอุบล" in 2562; to verify |
| 39–44 | arrive | the train reaches Warin on the south bank, the bridge, the town crosses the river | **1 เม.ย. 2473, ตรวจแล้ว** (Wikipedia, station page) |
| 44–50 | grow | the wide shot: the air base and the city spread over both banks | USAF 2508–2517, **ตรวจแล้ว** (8th TFW from 8 ธ.ค. 2508; squadrons left in 2517). Show only aircraft and the runway |
| 50–56 | celebrate (payoff) | the candle procession through today's city; the fish **return** in the Mun as the callback | today |
| 56–60 | today | the counter holds on 2569, finale card | |

Out (`docs/storyline.md` §3.6a):
- the 2562 and 2565 floods;
- anything about the base within living memory beyond aircraft on a runway.

The ผีบุญ rising (2444) is people killed, about 125 years ago. At most it is a sub line ("after the
unrest of 2444"), and only if the candle date is tied to it in the sources.

### 3a. Hero options (to show as style frames before building)

The hero must be big, centred, moving and Ubon's own:
1. **The painted fish of Pha Taem, alive (recommended).** Three or four giant red X-ray fish
   swim up the Mun across the tile at frame 0. They are living things like Korat's dinosaurs, they
   surprise, and they are the province's oldest picture. They come back in the payoff, swimming
   past the candle procession.
2. **The candle procession at hero scale.** A giant carved candle float rolls through the tile at
   frame 0. It is the province's best-known symbol and it moves, but it is an object. Our
   symbol-heroes (the carriage, the dessert tray) did not beat 45%.
3. **Elephants from the Pha Taem painting** walking down to the Mun. They are alive and move,
   but the elephant on the cliff is small and less known than the fish.

## 4. Landmarks (for the pins)

- ทุ่งศรีเมือง (the town field), ศาลหลักเมือง
- วัดทุ่งศรีเมือง with its หอไตรกลางน้ำ (date to verify: a Rama III-era claim is unconfirmed)
- วัดศรีอุบลรัตนาราม
- วัดหลวง, said to be founded by เจ้าคำผง (to verify)
- อนุสาวรีย์เทียนพรรษา on ทุ่งศรีเมือง
- the Mun bridge to Warin, Warin station, the airport/air base
- `far`: ผาแต้ม and โขงเจียม (the Mun meets the Mekong)

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

1. **Owner:** which hero, after the style frames?
2. **Pass 2 (cloud):** verify the founding year (2325 or 2335), the flood, the first candle
   procession, the bridge year and วัดทุ่งศรีเมือง.
3. **Workstation:** the ONEP polygon if one exists, the OSM pins for §4 and the Mun's centreline.
4. **Phuket's read** (about 23 ต.ค.) tests a living, moving hero again. If it fails, revisit §3a
   before building.

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
