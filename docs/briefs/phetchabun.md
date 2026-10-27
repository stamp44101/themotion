# Phetchabun (เพชรบูรณ์) — brief (draft)

Research: `phetchabun_research_request.md` → `phetchabun_research_gemini.md` (Gemini, 27 Oct 2026).
Look: shader only (owner's rule from 26 Oct). Length: 60 s.

The cover rule from `docs/experiments.md` §8–§9: **an event in the first 1–2 s** (a burst, a rise,
a leap), the hero filling the middle of the cover frame; a walk or a glide is not enough.

## §4 Hero — decided (owner, 27 Oct 2026): **A, the image rising from the whirlpool**

Style frames: `phetchabun_styleframes.jpg` (0, 0.5, 1, 2, 4, 8 s) and `phetchabun_styleframe_close.jpg`.
Model: `MahaThammaracha`, `Whirlpool`, `Burst`, `Ripples`, `Halo` in `src/styleframes/phetchabunBuddha.tsx`
(crowned Bayon-style Buddha in meditation, no pedestal, face toward the camera). Drawn 14 units tall at
legend scale; the burst is already rising at frame 0 so the cover frame shows the event; the image rises
upright over 0.25-2.25 s, never spinning; the halo opens at 1.6 s.

The options as offered:

| | the first second | callback in the payoff | for | against |
|---|---|---|---|---|
| **A (recommended)** | the Pa Sak spins into a whirlpool at วังมะขามแฟบ, golden water bursts up and the พระพุทธมหาธรรมราชา rises out of it, slow and upright, light spreading over the water | the อุ้มพระดำน้ำ rite at the same spot (แรม 15 ค่ำ เดือน 10): the governor and the four ministers in the river, the image held in their arms as they dip | the city's own legend, unique to Phetchabun; an event at frame 0; a loop the viewer sees close | a sacred image: it must rise with dignity, never spin, fly or hit the water (research §5.1); the image is a crowned Khmer (Bayon) Buddha in meditation, no base, not a generic Sukhothai Buddha |
| B | Si Thep: a stone ธรรมจักร rolls across the tile and the Dvaravati dwarfs (คนแคระ of เขาคลังใน) heave the great stupa up through the forest | Si Thep's World Heritage listing (19 Sep 2566) | the national story of 2023; a strong shape event | Si Thep is 120 km south of the town: either the tile is Si Thep (and Phetchabun town never appears) or it is a far beat |
| C | a giant sweet-tamarind pod drops and splits, seeds burst into the hills and the river | the tamarind fair (from 2516) | everyone knows มะขามหวานเพชรบูรณ์; no religious risk | a crop, not a legend: the research rates it fair; shares follow legends (§7) |

Gemini's other two (Pho Khun Pha Mueang's war elephant leaping out of the burning city of Rat; the
twin boxing champions' gloves punching the valley up) are left out: the first stages a city
burning and a queen's suicide, the second is not history.

## Story sketch for A (60 s, to verify and time)

The counter has to run forward from frame 0, so with A the clip opens in the legend's time
(~2100 BE, Ayutthaya) on a tile that already carries what came before: the Sukhothai-era oval
town and Wat Mahathat's chedi (1926). Earlier history (Si Thep, the 1564 inscription) goes in sub
lines, or in a closing far beat for Si Thep's World Heritage listing.

| beat | kind | year (BE) | on screen |
|---|---|---|---|
| hero | legend | ~2100 (hold) | the whirlpool, the image rises; fishermen's boats; taken to วัดไตรภูมิ |
| wall | build | ~2150–2200 | the square brick wall (500 x 500 m) rises **across the Pa Sak**, four arrow-head corner forts, water gates |
| army | procession | 2318 / 2370 | Chakri's army passing (Thonburi), or Rama III's army north to Lom Sak (2370) |
| pillar | build? | 2443 | the city pillar raised (the 1564 Si Thep inscription stone, found to be inscribed only in 2548) |
| capital | build / grow | 2486–2487 | นครบาลเพชรบูรณ์: roads cut through the valley, bamboo halls, the capital pillar at บุ่งน้ำเต้า (23 Apr 2487), then abandoned after the house vote (Jul 2487) |
| road | arrive | 2511 | Highway 21 opens, trucks in from Saraburi |
| tamarind | celebrate | 2516 | the first tamarind fair |
| growth | grow | 2516–2566 | the town spreads; the airport (2543); the big Buddha at พุทธอุทยานเพชบุระ (2554) |
| payoff | celebrate | 2568 | อุ้มพระดำน้ำ at วังมะขามแฟบ (callback) |

## Dates checked so far (web, 27 Oct 2026)

| BE | event | status |
|---|---|---|
| 1926 | Wat Mahathat chedi, gold-leaf inscriptions naming พระเจ้าเพชบุร | Gemini; the 2510 excavation of the gold-leaf inscriptions is confirmed (Matichon); the year 1926 not yet cross-checked |
| ~2100–2150 | the image found at วังมะขามแฟบ | legend ("ราว 400 ปี") → caption `ตำนานเล่าว่า` |
| Ayutthaya | the square brick wall | Gemini: mid-Ayutthaya; a local scholar (Matichon) attributes it to King Narai's reign, unconfirmed → no year in the caption |
| 2486–2487 | นครบาลเพชรบูรณ์ | agrees (Silpa-mag: base command 21 May 2486, director appointed 10 Oct 2486; Phibun resigned Jul 2487); the 48–36 vote not yet confirmed |
| 2528 | อุ้มพระดำน้ำ raised to a provincial festival | Gemini only |
| 19 Sep 2566 | Si Thep World Heritage | agrees (UNESCO 45th session, Riyadh) |

Leave out: the Khao Kho fighting (2511–2525), the 2544 Nam Ko flash flood, forced-labour deaths
at the capital project (show the roads and halls, not suffering).

## Geography (Gemini §4; the workstation checks it, PR #72)

- The Ayutthaya wall: a square, 500 x 500 m, astride the Pa Sak; four arrow-head forts
  (ป้อมสนามชัย is the best preserved, NE by the river); gates ประตูชุมพล (W) and ประตูดาว (E).
  The earlier Sukhothai town: an oval earthwork ~800 m.
- The Pa Sak through the town: 20–45 m wide, winding; the town floor ~114 m ASL.
- Hills: the Phetchabun range on both sides, 10–18 km out, 600–1,100 m; Khao Kho 30–46 km WNW.
  At a city scale they are off the tile: ridges at the tile edge only if the scale allows.
- Pins (Gemini): Wat Mahathat 16.420641, 101.155428; Wat Trai Phum 16.422762, 101.161141; Lak
  Mueang 16.420658, 101.159977; ป้อมสนามชัย 16.423414, 101.162003; วังมะขามแฟบ (Wat Bot Chanaman)
  16.428990, 101.163673; old hall 16.419124, 101.159743; new hall 16.439473, 101.154208; big
  Buddha 16.446460, 101.153491; นครบาล monument 16.417047, 101.153887; airport 16.676086,
  101.190252 (28 km N); Prang Si Thep 15.466246, 101.145558 (106 km S).
