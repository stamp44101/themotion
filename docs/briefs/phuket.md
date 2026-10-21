# City brief — Phuket / ภูเก็ต

Status: research pass 2 (21 ตุลาคม 2569). Pass 2, on a Thai connection (issue #58, PR #59), pulled the
ONEP polygon (`phuket_onep/`), checked every pin against OSM and opened the sources
(`phuket_field.md`); **its findings override pass 1 below** and are folded into §1, §3 and §4.
Pass 1 was written in the cloud container. The owner's
deep-research run (Gemini) is kept verbatim in `phuket_research_gemini.md`; its links are Google
search wrappers, so every claim below carries **my** check status:
- **ยืนยันแล้ว:** I found it independently (sources in §8);
- **Gemini เท่านั้น:** cited by Gemini, not yet found by me;
- **ขัดแย้ง:** sources disagree.

Hero: **two turtles, a leatherback and a green turtle, mothers and hatchlings** (owner, 21 ต.ค.
2569: "ใช้แบบผสมนี้แหละ"). Style frames in `src/styleframes/phuket.tsx`: `PhuketStyleMixed` (cover,
both mothers hauling out) and `PhuketStyleMixedCallback` (payoff, each mother back to the sea with
her own hatchlings in a lane beside her). The leatherback is drawn ~1.3x the green turtle (2 m vs
1 m in life). The single-species frames stay registered for reference.

## 0. What the last clips say (docs/experiments.md)

- Only a big animal moving at frame 0 has worked (Korat 32.9% skip). Every static hero landed
  at 43–50% (Lampang, Khon Kaen, Phetchaburi 50.4%).
- Every clip loses half its 3-s audience by 17 s; the beats from 3 to 17 s need people and
  movement, not monuments.
- **60 s.** There are enough action beats to fill it; 75 s is not justified.

## 1. Footprint

Settled, pass 2: `phuket_onep/README.md`. Two ONEP records (announced 10 เม.ย. 2560): a **2.78 km²
core** (`พื้นที่เมืองเก่า`, 30 × 47 units) inside a 6.41 km² continuous zone (the whole is 50 × 58
units). **The tile is the core at true scale**; the continuous zone runs off the tile's edges.
The core's edge follows ดำรง, รัตนโกสินทร์ 200 ปี, นริศร and ภูเก็ต; ถลาง, ดีบุก, กระบี่ and รัษฎา are
shophouse streets 200–350 m *inside* it. **คลองบางใหญ่ runs through the core** (~11 m wide, 0.14
units: a line with banks, not a water body), and the town moved down it from Kathu (§3a).

**No wall, no moat.** Phuket town was never walled (Thalang was a stockaded town in the north).
`noWall` / `noMoat`, as Khon Kaen.

### 1a. The tile (my call, see §7.2)

The story spans the whole island: the turtle beach (ไม้ขาว) in the north-west, Thalang and its
battle in the north, the tin town in the south-east, the Big Buddha on the hills to the south-west.
At 80 m/unit (`scripts/geo.mjs`, origin = the Charter bank corner 7.883662, 98.390734):

| place | real offset (units) | distance | bearing |
|---|---|---|---|
| หาดไม้ขาว | [-121.7, -317.8] | 27 km | 339° |
| สะพานสารสิน | [-127.7, -439.3] | 37 km | 344° |
| อนุสาวรีย์วีรสตรี | [-36.9, -134.5] | 11 km | 345° |
| อนุสาวรีย์ทุ่งถลางชนะศึก (battle) | [-96.6, -199.1] | 18 km | 334° |
| ศาลเจ้ากะทู้ | [-62.9, -45.3] | 6.2 km | 306° |
| พระใหญ่ | [-106.3, 77.6] | 10.5 km | 234° |
| สะพานหิน (dredge) | [7.4, 21.2] | 1.8 km | 161° |

The tile holds about ±48 units. **Proposal:** the tile is the tin town at true scale (80 m/unit),
and every place beyond ~4 km is a `far: true` point pulled in along its real bearing, as Chiang Rai's
วัดร่องขุ่น and Korat's Phimai. The north-north-west cone (Thalang, the battle, Mai Khao, Sarasin)
then lies along the tile's north-west edge, in that order outward; Kathu west-north-west; the
Big Buddha's hill south-west; Phuket Bay and สะพานหิน south-east.

The sea: the Andaman along the west edge and round the north (Pak Phra strait, under Sarasin),
Phuket Bay on the east/south-east. The island's real width at the town is ~11 km, so the west
coast cannot be at true scale either; draw it where it reads (x ≈ -38, as the style frame).

## 2. Water

| water | real size | units | notes |
|---|---|---|---|
| Andaman (west) | open sea | band at x ≈ -38, 28 wide | the turtle beach on its shore |
| ช่องปากพระ (north) | ~600 m (Sarasin bridge is 660 m long) | ~8 | Sarasin crosses it, 2510 |
| อ่าวภูเก็ต / อ่าวทุ่งคา (east, south-east) | bay | band | the 2450 dredge; สะพานหิน reclaimed from dredge tailings |
| คลองบางใหญ่ | small | path, ~0.4 | runs past the old town to the bay; also past โคกพม่า in Thalang (Gemini) |
| mine pits | ponds | closed paths | the 2516–2535 pits, later Laguna's lagoons |

No river crosses a wall (there is none).

## 3. Story (60 s, storyline standard)

### 3a. Facts and check status

| พ.ศ. | event | status |
|---|---|---|
| 2061–2082 | Portuguese tin trade; the name Junk Ceylon | Gemini เท่านั้น (well known; not on screen as a date) |
| 2169–2218 | Dutch VOC tin post; the Dutch fleet trapped and destroyed 2216–18 | Gemini เท่านั้น |
| ~2213–2222 | Thomas Bowrey (*Geographical Account*, 1669–79): the Raja's elephants carry a ship's captain a day's march through forest and swamp up to **Luppoone**, the town in the island's middle; tin, ~80 tons a year, goes out by sea | **ยืนยันแล้ว** (pass 2 read the Hakluyt 1905 text). Elephants are *listed* as an export but "very few … are hence transported": the duty was near the animal's price. **No elephant-loading scene** |
| 2225–2228 | René Charbonneau, a French lay missionary, governor (ออกพระถลาง) | Gemini เท่านั้น (well attested in the Narai-era French records) |
| ก.พ.–13 มี.ค. 2328 | **Battle of Thalang**: Burma's army besieges Thalang ~5 weeks, Lady Chan and Lady Mook lead the defence, the Burmese withdraw 13 March; Rama I titles them ท้าวเทพกระษัตรี / ท้าวศรีสุนทร | **ยืนยันแล้ว** (year, leaders, titles, withdrawal). Western calendar 1785 vs **1786** (the old Thai year turned in April); on screen **พ.ศ. 2328** only |
| | the 500 women dressed as soldiers with coconut-frond swords | **legend** (later accounts, not the Rama I chronicle or Lady Chan's letters) → caption ตามตำนาน |
| | the battlefield: บ้านเคียน / โคกพม่า (local) vs ท่าเรือ (a 2565 ThaiJO study from foreign maps) | **ขัดแย้ง** → no callout naming the camp; callout the heroines' monument instead |
| | Burmese strength 3,000 vs 16,000 | **ขัดแย้ง** → no number on screen |
| 13 ม.ค. 2353 | Thalang falls in the second war; the town is abandoned | Gemini เท่านั้น; war with loss → sub line only |
| 2368 | the Vegetarian Festival starts at Kathu (อ๊ามกะทู้) | **attributed** (Gemini; local tradition) |
| 2392–2412 | พระยาวิชิตสงคราม (ทัต), governor 2392–2412, spreads the tin workings **down คลองบางใหญ่ from กะทู้ to บ้านทุ่งคา** and makes it the new town "แทนเมืองเก่าที่บ้านกะทู้" | **สันนิษฐาน** (PSU Southern Info). The move is from **Kathu**, not from Thalang, and has no single dated act: **no one year on screen** |
| 2419 | อั้งยี่ riots, หลวงพ่อแช่ม | Gemini เท่านั้น; riot → sub line only |
| 2444–2456 | Khaw Sim Bee (พระยารัษฎานุประดิษฐ์) era; Sino-European shophouses, ถนนถลาง; บ้านชินประชา **2446** (not 2466); Chartered Bank **2450** | Gemini เท่านั้น |
| 2449 / 2450 / **2452** | Miles arrives and the company is formed (2449); he orders the bucket dredge from William Simons & Co. (20 พ.ย. 2450); **the dredge works Tongkah Bay from 2452**, the world's first offshore tin dredge | **ยืนยันแล้ว**, pass 2: three events, not a dispute. The 60-year monument (20 พ.ย. 2512, shaped as a dredge bucket) counts from 2452. **Caption 2452** |
| 2479 / 2490 | airfield at Mai Khao | Gemini เท่านั้น; not a beat |
| 2509–2510 | the heroines' monument at ท่าเรือ crossroads | **ยืนยันแล้ว**: finished 2509, unveiled by King Rama IX **2510** (phuket101) |
| **7 ก.ค. 2510** | **สะพานสารสิน** opens: the island's first road link | **ยืนยันแล้ว** (Wikipedia, Phuket News); named for Pote Sarasin, minister; the 2516 love story is later and is **not** the name's origin |
| 2516–2535 | Patong becomes the tourist beach; tin mining ends; mine pits become Laguna's lagoons | Gemini เท่านั้น |
| 2545 | พระใหญ่ begun on เขานาคเกิด | Gemini เท่านั้น |
| 1 ส.ค. 2554 | สะพานท้าวเทพกระษัตรี opens beside Sarasin | Gemini เท่านั้น (Sarasin becomes a walkway) |
| **11 ธ.ค. 2558** | UNESCO City of Gastronomy (Baba cuisine) | **ยืนยันแล้ว** (The Nation; TAT) |
| ธ.ค. 2561 | **leatherbacks nest again** after 5–6 years with none (Khuk Khak, Phang Nga; last Mai Khao nest 2556) | **ยืนยันแล้ว** (Trash Hero, Bangkok Post) |
| พ.ย. 2562 – ก.พ. 2563 | 11 nests, 351 hatchlings (the Andaman coast) | **ยืนยันแล้ว** (Trash Hero) |
| 17 พ.ย. 2562 – 10 ก.พ. 2563 | **11 leatherback nests on the Andaman coast**, Mai Khao among them | **ยืนยันแล้ว** (Thai PBS) |
| 2563 / 2564 / 2565 | Thailand's leatherback nests, **nationwide**: 16 / 18 / 0 (they nest every 3–5 years) | **ยืนยันแล้ว** (DMCR). Pass 1's "18 in Phuket" was the national count: **not on screen next to Phuket** |
| every 13 เม.ย. | **green turtles released at Mai Khao** on Songkran by the Mai Khao turtle foundation and the Andaman marine centre (55 in 2561) | **ยืนยันแล้ว** (NationTV); the foundation ~2560; first year of the release ไม่พบ |
| today | green turtles **no longer nest** at Mai Khao ("ไม่กลับมาวางไข่เหมือนในอดีต"); leatherbacks still do | **ยืนยันแล้ว** (NationTV); no recent green nest found |
| 2567 | nests at Mai Khao (14 ก.พ., 24 ก.พ., 137 eggs) | **ยืนยันแล้ว** (Phuket News) |

### 3b. The turtles: a leatherback (เต่ามะเฟือง) and a green turtle (เต่าตนุ)

Phuket's turtle is the leatherback: Mai Khao's own symbol ("ขอหาดไม้ขาวให้เต่ามะเฟือง"), the one
whose return made the news, and the world's largest turtle (2–2.5 m, 500–900 kg): a car-sized
animal, which is exactly the "big, surprising" hero the numbers ask for. Its shell is not plated:
dark, leathery, seven ridges running nose to tail, white-speckled, long front flippers. **The style
frame's turtle (a green turtle's scutes) is restyled to a leatherback** (`src/styleframes/SeaTurtle.tsx`).

The owner then asked for both species on screen together ("ใช้แบบผสมนี้แหละ"). The green turtle (`GreenTurtle.tsx`)
is modelled on the owner's photos: dark-brown plates with amber rays, cream-outlined scales on
head and flippers. **Pass 2 decides what each one does.** Today the leatherback is the one that
*nests* at Mai Khao; green turtles no longer do, they are *released* there by people every
13 April. So:
- **cover** (the island before the town, no caption claim): both mothers haul out. Mai Khao was a
  nesting beach for sea turtles in the past, green turtles among them;
- **payoff** (today): the leatherback mother and her hatchlings to the sea, the wild nest; beside
  them a crowd at the waterline releasing young green turtles, the human hand. People on screen in
  the payoff, as the standard asks. Style frame `PhuketStyleMixedCallback` is rebuilt to this.

### 3c. Storyline worksheet

```
Hero (0-3 s): a giant leatherback and a green turtle haul out of the Andaman at Mai Khao and
  crawl up the beach over the whole tile   BIG ✓  IDENTITY ✓  MOVING ✓  SURPRISING ✓ (the leatherback is car-sized)
Hero sound: surf, a heavy drag of sand on each flipper stroke, a low breath
Open loop: two turtles came ashore -> 47-53 s: one still nests, the other is carried back by people
First event (3-9 s, people): the Raja's elephants carry a ship's captain up the forest track to
  Luppoone; tin goes out by boat
Spectacle (by 12 s): the Burmese siege of Thalang, the heroines' defence, the withdrawal
Middle beats, one verb each: dig (Kathu mines down the canal to Thung Kha) / build (the old town) /
  work (the dredge) / cross (Sarasin)
Grow shot: 41-47 s, 2516 -> 2558: Patong, the airport, mine pits turned lagoons, the Big Buddha
Payoff (47-54 s, people + hero back): the leatherback mother and her hatchlings to the sea; a crowd
  at the waterline releasing young green turtles on Songkran
Tagline: "ไข่มุกอันดามัน"
Facts with nothing to show (sub lines only): Junk Ceylon, the Dutch, the French governor,
  Thalang's fall 2353, the 2419 riots, monthon Phuket, ภูเก็จ spelling, UNESCO 2558
```

### 3d. Beats (proposal)

| s | beat (`kind`) | on screen | caption (title / sub) | year |
|---|---|---|---|---|
| 0–3 | cover | the leatherback hauling out, whole tile | (title card) | — |
| 3.2–8.6 | `arrive` | a ship anchors; the Raja's elephants carry its captain up a forest track to Luppoone (tracking shot), tin lumps loaded into boats on the shore | **ขี่ช้างขึ้นเมืองกลางเกาะ** / ราว พ.ศ. 2218 พ่อค้าอังกฤษบันทึกว่าเจ้าเมืองส่งช้างมารับ ดีบุกส่งออกทางเรือ | hold 2218 |
| 8.8–17.6 | `siege` | the Burmese camp in the north, the stockade at Thalang; the women's column marches with glinting "swords" (legend), cannon smoke; the army withdraws north | **ศึกถลาง พ.ศ. 2328** / ท้าวเทพกระษัตรี ท้าวศรีสุนทร นำชาวเมืองรับทัพพม่า (ขบวนหญิงแต่งชายตามตำนาน) | hold 2328 |
| 18.4–24 | `dig` | Hokkien miners at Kathu; the pits spread down คลองบางใหญ่ to the bay and the town at Thung Kha rises along the canal | **เหมืองไหลตามคลองลงทุ่งคา** / สมัยพระยาวิชิตสงคราม (2392–2412) ย้ายเมืองจากกะทู้มาทุ่งคา | 2392 → 2412 |
| 24.6–29.8 | `build` | the Sino-European shophouse streets rise (ถลาง ดีบุก กระบี่), บ้านชินประชา, the Chartered Bank | **ตึกแถวชิโน-ยูโรเปียน** / ยุคพระยารัษฎาฯ (คอซิมบี้) บ้านชินประชา พ.ศ. 2446 | 2444 → 2449 |
| 30.2–35.4 | `work` | the dredge on Tongkah Bay: bucket chain turning, stack smoking, tailings spilling | **เรือขุดแร่ในทะเลลำแรกของโลก** / พ.ศ. 2452 กัปตันเอ็ดเวิร์ด ไมลส์ อ่าวทุ่งคา | hold 2452 |
| 36–40.6 | `cross` | tracking shot: the first cars cross สะพานสารสิน from the mainland; the heroines' monument at its crossroads | **สะพานสารสิน** / 7 ก.ค. 2510 ถนนเส้นแรกที่ข้ามสู่เกาะ | hold 2510 |
| 41.2–46.8 | `grow` | wide: Patong and the west beaches fill, planes land at Mai Khao, mine pits turn into lagoons, พระใหญ่ on its hill | **จากเมืองแร่สู่เมืองท่องเที่ยว** / เหมืองปิด หาดป่าตองกลายเป็นเมือง พระใหญ่ พ.ศ. 2545 ยูเนสโกยกย่องด้านอาหาร พ.ศ. 2558 | 2516 → 2558 |
| 47.2–53.6 | `return` (callback) | the leatherback mother back to the sea, her hatchlings after her; beside them people at the waterline releasing young green turtles | **หาดไม้ขาว บ้านของเต่าทะเล** / เต่ามะเฟืองยังขึ้นวางไข่ เต่าตนุถูกปล่อยคืนทะเลทุกวันสงกรานต์ | hold 2567 |
| 54–56 | `today` | counter lands | | 2569 |

Every kind differs from the one before. The siege (8.8 s) is the spectacle, the 3–17 s window has
ships, elephants and two armies moving. `grow` is wide; `cross` is the tracking shot.

- **Out:** the 2547 tsunami (owner's rule, no loss-of-life events); the 2419 riots and Thalang's
  fall are sub lines, not scenes.
- **Callback caption year:** 2567, a documented Mai Khao leatherback nest (14 and 24 ก.พ. 2567) and
  a Songkran release in the same year. No nest count on screen (pass 2, §3a).

## 4. Landmarks (pins confirmed against OSM, pass 2: `phuket_field.md` §1)

| name | pin | appears | notes |
|---|---|---|---|
| หาดไม้ขาว (nesting beach) | 8.113600, 98.302421 | always | `far`, the hero's beach: the pin is the south end (by the runway, where the nests were); the sand runs 17 km north to Sarasin |
| Andaman / อ่าวภูเก็ต (water) | 8.1100, 98.2100 / 7.8600, 98.4600 | — | `geo.ts` water points |
| อนุสาวรีย์ท้าวเทพกระษัตรี ท้าวศรีสุนทร | 7.980988, 98.363953 | 2510 | `far`; the callout for the siege's place |
| อนุสาวรีย์ทุ่งถลางชนะศึก | 8.027727, 98.320698 | 2328 (the place) | `far`; the mapped monument to the battle. โคกพม่า is in no open dataset and the site is disputed (ท่าเรือ): callout this, never "ค่ายพม่า" |
| วัดพระนางสร้าง | **8.026635, 98.332533** (pass 1's pin was 836 m west) | — | `far` |
| ศาลเจ้ากะทู้ | 7.916420, 98.345080 | 2368 | `far` (6 km) |
| แยกธนาคารชาร์เตอร์ด (origin) | 7.883662, 98.390734 | 2450 | the town |
| บ้านชินประชา | 7.885800, 98.383900 | 2446 | in the town |
| ศาลเจ้าจุ้ยตุ่ย | 7.883250, 98.383510 | — | in the town |
| สะพานหิน / dredge site | 7.868334, 98.396108 | 2452 | Tongkah Bay; สะพานหิน is reclaimed land (later) |
| สะพานสารสิน | 8.201518, 98.298032 | 2510 | `far`; the north edge |
| พระใหญ่ | 7.827500, 98.313610 | 2545 | `far`; on its hill |
| สนามบิน | 8.113330, 98.316940 | 2519 (intl.) | `far`, next to the beach |

## 5. Terrain and palette

- Hills are real: Phuket's spine of granite hills, ~300–500 m (เขานาคเกิด under the Big Buddha,
  the Kathu valley's ridges, เขารัง above the town). Real heights at real scale, `peaks` in the
  west and south-west; the town and Mai Khao are flat.
- Andaman turquoise, white sand, dark rainforest green; Sino-European pastels for the town.

## 6. Sound (code only)

Andaman palette from `synth.py`: surf (irregular, quiet bed), flipper drags, pi/khlui for the
Thalang era, war drums for the siege, Chinese gongs/cymbals for the miners and the old town
(ฉิ่ง/ฉาบ), the dredge's clank and steam, a car horn and tyres on the bridge, a distant jet for
the grow shot, the hatchlings' patter in the payoff. Bridges between beats.

## 7. Open questions

1. ~~ONEP polygon, pins, Bowrey, Thung Kha, the dredge year, the turtles.~~ **Done, pass 2**
   (issue #58, PR #59): `phuket_onep/`, `phuket_field.md`. Still open there: โคกพม่า's position, a
   per-beach Mai Khao nest count, the first year of the Songkran release (none goes on screen).
2. ~~The tile.~~ **The ONEP core at true scale, far places on their bearings** (pass 2: the core fits
   the tile, the whole announced area does not).
4. ~~The green turtle's fact for the payoff.~~ **Released every 13 เม.ย., no longer nesting** (pass 2).
3. ~~Beat 2 stands on Bowrey.~~ **It does, but as the captain's elephant ride to Luppoone**, not an
   export (pass 2 read the text).

## 8. Sources I opened

- Tongkah Harbour Tin Dredging Co., incorporated 23 Nov 1906: [eoas.info](https://www.eoas.info/GABR/biogs/ABE1961b.htm); Miles: [ADB](https://adb.anu.edu.au/biography/miles-edward-thomas-teddy-7574); "according to some reports" 1907: [MarineLink](https://www.marinelink.com/news/subsea-mining-tin332228)
- Battle of Thalang: [Wikipedia](https://en.wikipedia.org/wiki/Thao_Thep_Krasattri_and_Thao_Si_Sunthon), [Phuket News](https://mail.thephuketnews.com/the-tale-of-lady-chan-91697.php); battlefield at ท่าเรือ: [ThaiJO 2565](https://so01.tci-thaijo.org/index.php/CRMA_HUSO/article/view/266643)
- Heroines' monument 2509/2510: [phuket101](https://www.phuket101.net/phuket-heroines-monument/)
- Sarasin Bridge 7 Jul 1967: [Wikipedia](https://en.wikipedia.org/wiki/Sarasin_Bridge)
- UNESCO 11 Dec 2015: [The Nation](https://www.nationthailand.com/international/30275512), [TAT](https://www.tatnews.org/2015/12/phuket-gastronomic-delights-recognised-in-unesco-creative-city-listing)
- Leatherbacks: [Trash Hero](https://trashhero.org/leatherback-turtles-reappear-in-trash-hero-community/), [Bangkok Post](https://www.bangkokpost.com/news/environment/1632414/locals-eye-beaches-as-turtle-breeding-sites), [Phuket News 2020](https://mail.thephuketnews.com/mai-khao-turtle-nest-fails-to-produce-hatchlings-75727.php), [Phuket News 2024](https://mail.thephuketnews.com/more-turtle-eggs-laid-at-mai-khao-beach-91394.php)
