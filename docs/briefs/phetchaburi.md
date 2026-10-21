# City brief — Phetchaburi / เพชรบุรี

Status: research pass 2 (19 ตุลาคม 2569). Pass 1 was written in the cloud container with web
search only; everything it left `[unknown]` has now been measured or sourced from a Thai
connection (issue #51): the ONEP polygon, the wall, the three peaks and their heights, the
river width, the open-Gulf point and all four disputed dates. §7 lists what changed, and
what is still open. Every date carries its source and a confidence level.

## 0. What the last clips say (docs/experiments.md)

- A **hero big enough to read on the whole-tile shot at frame 0** cut the skip rate from about
  52% to 32.9% (Korat's dinosaurs). Nakhon Si's relic boat was a speck: 43.1%.
- Half the 3 s audience is gone by 17 s: keep the early beats short and moving.
- **60 s.** Only go to 75 s if the extra time is action.
- Lampang's standing carriage did not repeat Korat's hook (44.9%): the hero has to move or
  surprise as well as be big. All of this is now `docs/storyline.md`, and §3 is built to it.

## 1. Footprint

### 1a. The ONEP zone (extracted — `docs/briefs/phetchaburi_onep/`)

Record 32 of `oldtown_all.shp`, one polygon, 44 points. Full attribute table, extremes and
method in that folder's README.

| | |
|---|---|
| centroid | **13.103344, 99.950415** |
| bounding box | **1,533 m E–W × 1,775 m N–S** |
| area (measured on the ring) | **1.739 km²** — ONEP's own `AREA` field says 1.74989 |
| announced | มติ ครม. 10 ก.พ. 2558, ประกาศ 10 มี.ค. 2558, กลุ่มที่ 2 |

Do not use the 1.85 km² in `thai-oldtown.csv`; it does not match the polygon.

**The river runs straight through the zone, north to south.** OSM way 120451772
(แม่น้ำเพชรบุรี) has 20 points inside the ring: it enters at **13.11078, 99.94829** and
leaves at **13.09571, 99.94868**, 1.68 km apart, splitting the zone into a narrow west bank
and a wide east bank. This is a Phitsanulok-type city, not a Korat one — every rule in
CLAUDE.md about rivers through a built area applies (nothing on open water, wall gaps and a
water gate, the in-city house grid checked against the channel).

All three peaks of **พระนครคีรี are outside the zone**, 1.3–1.6 km WNW of the centroid, as
are พระรามราชนิเวศน์ (983 m SSW) and the station (1,747 m NW). The zone is the river town;
the hill stands beyond it.

### 1b. There *was* a wall, and it is not the ONEP zone

The pass-1 brief said "[unknown], treat as unwalled". **That was wrong — build it walled.**

วารสารเมืองโบราณ (MBJ 46-2, *กำแพงเมืองพริบพรี แผนที่เมืองโบราณ และการขุดค้น*) describes a
roughly rectangular circuit with **แม่น้ำเพชรบุรี itself as the west moat**, the wall standing
behind it along **ถนนพานิชเจริญ**, and the south side on **ถนนท่าหิน**. The north line is
still argued over among scholars. Named gates: **ประตูบางจาน** on the east (it is named in the
royal chronicle, below), a west gate at ศาลเจ้าต้นโพธิ์ by the river landing ท่าตรง, and a
southern bamboo gate near วัดพริบพรี. **สำนักศิลปากรที่ 1 ราชบุรี excavated the east line
15 มิถุนายน – 11 กรกฎาคม 2563** and found a foundation course about 1 m thick, of brick with
laterite (ศิลาแลง). The standing wall had largely gone by about 2492, when a market fire led
residents to carry the bricks away for rebuilding.

**The circuit traced on OSM** (my reading of the street grid, from the two sides the journal
names; the corners below are where those streets actually meet, not something the journal
states):

| side | runs along | from → to | length |
|---|---|---|---|
| west | **ถนนพานิชเจริญ**, on the east bank | lon ≈ 99.9490 | ~1,160 m |
| south | **ถนนท่าหิน** (OSM way 232569188) | 13.09837, 99.95062 → 13.09932, 99.95759 | 756 m (→ ~930 m extended west to the river) |
| east | **ถนนโพธิ์การ้อง** — dead straight, N–S, and its south end *is* ท่าหิน's east end | 13.09932, 99.95759 → 13.10955, 99.95581 | **1,130 m** |
| north | **ถนนพงษ์สุริยา** (the journal says this side is disputed) | 13.10886, 99.94986 → 13.10975, 99.95817 | ~900 m |

So the walled town is about **0.93 × 1.15 km ≈ 1.07 km²**, close to the journal's "แต่ละด้าน
กว่า 1 กิโลเมตร … ผังเมืองเป็นรูปสี่เหลี่ยมเกือบจัตุรัส". It sits **inside the ONEP zone on
the north and west and spills past it on the south-east** — the SE corner
(13.09932, 99.95759) falls just outside the ring. Use the wall rectangle for the walls and
gates, and the ONEP zone for the tile extent; they are two different outlines and the brief
should not pretend they are one.

Engine consequences: the river crosses the wall line nowhere (it runs *along* the west side
as the moat), so no water gate is needed — but the west wall must sit on the bank, not in
the channel, and the moat on that side is the river itself, not a dug ring.

## 2. Water

| water | real size | notes |
|---|---|---|
| แม่น้ำเพชรบุรี | **~30–40 m through the old town**, widening to **~45–50 m** just north of it | measured off Google satellite at z19 (0.291 m/px), cutting across the channel at the สุมณฑ์มุนี bridge and 500 m north. Readings range 14–50 m; the low ones are where a bridge deck or bank shadow breaks the water mask, so take 35 m as the working width. The channel also *is* the west moat (§1b) |
| เขื่อนแก่งกระจาน | crest 760 m, height 58 m, ~710 million m³ | 40.4 km WSW of the town. `far: true` |
| อ่าวไทย | — | **13.00756, 100.09549** is open water, GEBCO depth −6 m, 19.0 km ESE/SE (bearing 124°) of the centroid. หาดเจ้าสำราญ (13.0075561, 100.0415603) is the nearest beach, 14.5 km SE |

## 3. Story beats (built, 60 s, storyline standard v1)

Rebuilt on 19 ต.ค. 2569 to `docs/storyline.md`. v1's beats (open, khmer, siege, palace, railway,
banpuen, today) failed it:
- no hero actor;
- nothing came back in the payoff;
- 17 s with nothing moving before the finale card;
- no beat had a verb.

Ban Puen's palace is now part of the grow beat, and the UNESCO year is the feast beat. The
v1 proposal's sourcing is kept in the table's last column.

### 3a. Storyline worksheet

```
Hero (0-3 s): Khao Wang with a hill-sized tray of ขนมหม้อแกง at its foot, a piece being lifted out
              BIG yes (fills the lower frame)   IDENTITY yes (the slogan: เขาวังคู่บ้าน ... ขนมหวาน)
              MOVING yes (the piece is lifted out, ~60 px in 1.3 s)   SURPRISING yes (a dessert as big as the hill)
Hero sound: a server sliding under the custard, a tap on the tray, fried shallots crackling (0.2 s)
Open loop: why is there a giant dessert by the hill? -> the fair, 45.4-53.6 s: the tray back among
           the stalls, callout ขนมหม้อแกง at 47.6 s, the same serving sound
First event (3-9 s, people): porters haul laterite behind the carts, builders set วัดกำแพงแลง's towers
Spectacle (by 12 s): พระยาละแวก's fleet up the river and the two-sided attack, 9.0-18.2 s
Middle beats, one verb each: palace (build: the palace rises, Rama IV's procession climbs to it)
           / railway (arrive) / growth (grow)
Grow shot: 35.4-44.0 s, พ.ศ. 2451-2555, wide, swinging from the west round to the north
Payoff (45-54 s, people + hero back): the งานพระนครคีรี fair, crowds and stalls round the tray
Tagline: เขาวังคู่บ้าน เมืองขนมหวาน
Facts with nothing to show (sub lines only): ศรีชยวัชรปุระ (attributed), the name เขาวัง,
           Thonburi 150 km, Ban Puen finished under Rama VI, Kaeng Krachan World Heritage (note)
```

### 3b. Beats

| beat | kind | s | counter | on screen | confidence |
|---|---|---|---|---|---|
| **khmer** | build | 0–8.4 | holds พ.ศ. 1734 (~1191) | the cover (the hero), then porters and builders as the laterite towers of **วัดกำแพงแลง** rise | **attributed:** "คาดว่าสร้างสมัยพระเจ้าชัยวรมันที่ 7". **ศรีชยวัชรปุระ** is Cœdès' reading, repeated by กรมศิลปากร and ศานติ ภักดีคำ, so the sub says **สันนิษฐานว่า** (§7.6). Never caption พริบพรี as "ชื่อเดิม" |
| **siege** | fight | 9.0–18.2 | holds พ.ศ. 2124 (1581) | พระยาละแวก's fleet comes up the river from the Gulf; one force storms **คลองกระแชง** (west), the other **ประตูบางจาน** (east); the หอรบ burn | **documented:** พระราชพงศาวดารฯ ฉบับสมเด็จพระพนรัตน์, via ศานติ ภักดีคำ (ศิลปวัฒนธรรม, เม.ย. 2559). Chosen over the 2307 Burmese attack, which has no named ground to show |
| **palace** | build | 19.4–27.0 | พ.ศ. 2402 → 2405 | **พระนครคีรี** rises on the three peaks; Rama IV's procession climbs the path to it | **confirmed:** begun 2402 under Rama IV, with เจ้าพระยาศรีสุริยวงศ์ as แม่กอง; finished and named 2405 (กรมศิลปากร) |
| **railway** | arrive | 28.4–34.0 | holds พ.ศ. 2446 (1903) | the first southern train runs down from the north and parks at the terminus, where a crowd waits | **confirmed:** Thonburi–Phetchaburi, about 150 km. Services from 1 เม.ย. 2446; Rama V opened it on 19 มิ.ย. 2446 |
| **growth** | grow | 35.4–44.0 | พ.ศ. 2451 → 2555 | the wide shot: **วังบ้านปืน** rises by the river, then roads, blocks and cars spread over the palm plain | **confirmed:** Ban Puen begun 19 ส.ค. 2453 under Rama V, finished 2459 under Rama VI; architect Karl Döhring |
| **feast** | celebrate | 45.4–53.6 | holds พ.ศ. 2564 (2021) | the งานพระนครคีรี fair at the foot of the hill; the tray is back, a piece being served | **confirmed:** UNESCO City of Gastronomy, **8 พ.ย. 2564** (UNESCO; TAT's press date was 22 พ.ย.). The note line has กลุ่มป่าแก่งกระจาน, World Heritage on 26 ก.ค. 2564 (ONEP) |
| **today** | today | 54.2–56.0 | lands on พ.ศ. 2569 | the counter reaches today and holds before the finale card | — |

- **Finale card:** title `เพชรบุรี`, tagline **"เขาวังคู่บ้าน เมืองขนมหวาน"**, from the provincial
  slogan.
- **Era labels:** เขมร · อยุธยา · รัตนโกสินทร์ · ปัจจุบัน.
- **Spare sub lines:**
  - the Kaeng Krachan dam opened 22 พ.ค. 2509 (confirmed);
  - "เมือง 3 รส": salt, lime and palm sugar (TAT).

## 4. Landmarks

| name | real position | appears | notes |
|---|---|---|---|
| พระนครคีรี (เขาวัง) | 13.1092418, 99.9366030 (west peak) | hill: always. Palace: 2402 | three peaks west→east: **palace 84 m / พระธาตุจอมเพชร 87 m / วัดพระแก้วน้อย 76 m**, 320 m apart in longitude, summit 91 m, ~80 m over the town, 485 × 498 m above the 30 m contour (§5a). A long low east–west ridge, not a cone. **Model the silhouette first** (the Chonburi lesson) |
| วัดกำแพงแลง | 13.1055759, 99.9558739 | ~1191 | laterite: deep red-brown, not brick |
| วัดมหาธาตุวรวิหาร | 13.1054562, 99.9472230 | Ayutthaya era | white five-prang group, the town's tallest skyline. Sub-beat or set dressing |
| วัดใหญ่สุวรรณาราม | 13.1090569, 99.9533429 | late Ayutthaya | wooden ศาลาการเปรียญ. Set dressing |
| พระรามราชนิเวศน์ | 13.0949700, 99.9473744 | 2453–2459 | pale walls, steep roofs |
| สถานีรถไฟเพชรบุรี | 13.1162710, 99.9411520 | 2446 | |
| ตาลโตนด palms | plain around the town | always | the province's signature tree: a palm grove, not broadleaf canopy |

## 5. Terrain and palette

- **Hills:** Khao Wang — summit **91 m**, town floor **10 m**, so **~80 m of relief = 1.0
  world unit** at 80 m/unit, over a **485 × 498 m (≈6.1 × 6.2 unit)** footprint above the
  30 m contour. It is wide and low, not tall: its grandeur has to come from width and from
  the three crowns, not from height. The hill was called เขาสมณ and was renamed
  เขามหาสวรรค์. Kaeng Krachan's mountains far west only as a backdrop.
- **Relief check:** the whole town sits at ~10 m, so the tile is flat except for the ridge;
  `terrainH` must fade the peak to 0 well before the wall line, 1.3 km away (CLAUDE.md:
  nothing built stands on a slope).
- **Palette:** a dry, sandy plain with sugar palms rather than a closed green canopy. That
  also avoids the "dark and green" opening that Nakhon Si measured.

## 5a. Real coordinates (`geo.ts`)

All from Google Maps pins unless noted, keeping the pin's own name. Bearing and distance are
from the ONEP centroid (13.103344, 99.950415).

| name | lat | lon | from centroid | in the ONEP zone |
|---|---|---|---|---|
| พระนครคีรี — ยอดตะวันตก, พระราชวัง | 13.1092418 | 99.9366030 | 1,633 m WNW (294°) | no |
| พระธาตุจอมเพชร — ยอดกลาง | 13.1076347 | 99.9383112 | 1,395 m WNW (290°) | no |
| วัดพระแก้วน้อย — ยอดตะวันออก | 13.1078438 | 99.9394913 | 1,285 m WNW (293°) | no |
| วัดกำแพงแลง | 13.1055759 | 99.9558739 | 641 m ENE (67°) | yes |
| วัดมหาธาตุวรวิหาร | 13.1054562 | 99.9472230 | 418 m NW (304°) | yes |
| วัดใหญ่สุวรรณาราม | 13.1090569 | 99.9533429 | 707 m NNE (27°) | yes |
| พระรามราชนิเวศน์ (วังบ้านปืน) | 13.0949700 | 99.9473744 | 983 m SSW (200°) | no |
| สถานีรถไฟเพชรบุรี | 13.1162710 | 99.9411520 | 1,747 m NW (325°) | no |
| แม่น้ำเพชรบุรี — เข้าเขต (เหนือ) | 13.11078 | 99.94829 | 854 m NNW | yes |
| แม่น้ำเพชรบุรี — ออกเขต (ใต้) | 13.09571 | 99.94868 | 865 m SSW | yes |
| ถนนคลองกระแชง (the 2124 west assault) | 13.1071797 | 99.9476792 | 518 m NW | yes |
| มุมกำแพงด้านตะวันออกเฉียงใต้ | 13.09932 | 99.95759 | 896 m ESE | no (just outside) |
| อ่าวไทย — น้ำเปิด (`centre: true` water point) | 13.00756 | 100.09549 | 19.0 km SE (124°) | — |
| หาดเจ้าสำราญ | 13.0075561 | 100.0415603 | 14.5 km SE (137°) | — |
| เขื่อนแก่งกระจาน | 12.9169579 | 99.6299984 | 40.4 km WSW (239°) | `far: true` |
| ด่านสิงขร (the 2307 Burmese retreat) | 11.7860587 | 99.6459000 | 149 km SSW (193°) | `far: true`, sub line only |

**ประตูบางจาน** has no pin: OSM and Nominatim have neither the gate nor ตำบลบางจาน. Put it on
the east wall line (ถนนโพธิ์การ้อง) at the road running east; do not invent a coordinate.

### The three peaks, settled by longitude

They line up **west → east: palace (99.9366) → พระธาตุจอมเพชร (99.9383) → วัดพระแก้วน้อย
(99.9395)**, spanning 320 m. The three pins are only 180 m apart in latitude, so the ridge
reads as an east–west line from the town, which is why the three-peak silhouette works as
the hero shape.

| peak | what stands on it | summit (opentopodata mapzen) |
|---|---|---|
| west | พระที่นั่งเพชรภูมิไพโรจน์ and the palace group | 84 m |
| middle | พระธาตุจอมเพชร | 87 m |
| east | วัดพระแก้วน้อย | 76 m |

Highest sample anywhere on the hill: **91 m at 13.10895, 99.93665**, on the west peak's
crown just north of the palace pin. Town floor is **10 m**, so the hill stands **~75–80 m
over the town** — at 80 m per unit that is almost exactly **1 unit of relief**, which is
small; model it as a broad, long ridge rather than a tall cone, and let its *width* carry
the grandeur. **Footprint above the 30 m contour: 485 m E–W × 498 m N–S** (grid scan),
i.e. ~6.1 × 6.2 units.

## 5b. Grandeur

- **The big thing:** Khao Wang with the palace on its crest, over the town — but it is only
  1 unit tall, so it has to be *wide* (6+ units) and carry three lit crowns to read as big.
- **The framing held across centuries:** the three-peaked hill, the river, and the palm plain.
- **The last frame:** fireworks over the lit hill.

## 6. Sound (code only, `scripts/synth.py`)

- **Central-Thai palette:** ranat, khlui, pi, khong wong. The province series is synth only.
- **Events, keyed to the beat:**
  - **hero (0.2 s, before anything else):** a server slides under the custard, taps the tray,
    and fried shallots crackle;
  - khmer: stone dressed and set, the gang's "ฮึบ" and a thud per block, ox carts;
  - siege: paddles, the war drums and ปี่, a clash at the gate, the fire;
  - palace: knocks as it rises; for the procession, a conch, then กลองชนะ, a small gong and
    a ปี่ line; a big gong as it is finished;
  - railway: chuffs, rail joints, two whistles;
  - growth: hammers and clanks at uneven gaps, then traffic and a couple of car horns;
  - feast: the fair crowd, a kitchen, and **the cover's serving sound again** (the open loop);
  - finale: fireworks.
- **Levels:** about −14.5 dBFS RMS; the band above 5 kHz sits about 21 dB under the mix.

## 7. Open questions — answered (issue #51, 19 ต.ค. 2569)

1. ~~The ONEP polygon, and whether the river runs through it.~~ **Extracted** to
   `phetchaburi_onep/`; the river runs straight through, N→S (§1a).
2. ~~Khao Wang: height, the three peaks, which building on which.~~ **Measured**: 91 m peak,
   ~80 m over the town, 485 × 498 m above 30 m; west→east palace / พระธาตุจอมเพชร /
   วัดพระแก้วน้อย (§5a).
3. ~~The river's width at the town.~~ **~35 m** working figure (§2).
4. ~~Was there a wall?~~ **Yes** — rectangle, river as the west moat, excavated 2563. Build
   it walled; the wall rectangle is *not* the ONEP zone (§1b).
5. ~~The 2307 battle site.~~ No named site inside the province: the fight was for the town
   itself, and the named geography is the **retreat through ด่านสิงขร** (11.78606,
   99.64590). The 2124 attack *does* give named points — **ตำบลคลองกระแชง** on the west and
   **ประตูบางจาน** on the east of the wall line (§3, §5a).
6. ~~Is "ศรีชัยวัชรปุระ = เพชรบุรี" accepted?~~ **Accepted, but as an interpretation.** It is
   George Cœdès' reading of the 23 place names in จารึกปราสาทพระขรรค์ (พ.ศ. 1734), repeated by
   กรมศิลปากร and by ศานติ ภักดีคำ, who both write **สันนิษฐานว่า**. It is supported by
   ปราสาทกำแพงแลง being Bayon-style, and by a copy of พระชัยพุทธมหานาถ of ศรีชยวัชรปุรี at
   ปราสาทบายน. Not disputed — but not self-evident either, so it may go on screen **with
   "สันนิษฐานว่า"**, not as a flat statement. Separately: **พริบพรี is probably not the older
   name** but a later colloquial contraction of เพชรบุรี, so do not caption it as "ชื่อเดิม".
7. ~~The exact UCCN date.~~ **8 พฤศจิกายน 2564**, the date of the Director-General's
   designation of 49 new Creative Cities (UNESCO). The 22 พ.ย. 2564 seen in Thai coverage is
   the TAT press date. The date is usable on screen.

### Still open

- The wall's **north line** is disputed in the literature; ถนนพงษ์สุริยา is the best
  candidate but ถนนเดโช, 120 m further north, is also straight and continuous.
- **ประตูบางจาน** has no coordinate in any open dataset (§5a).

Sources (pass 2, added): วารสารเมืองโบราณ MBJ 46-2 (กำแพงเมืองพริบพรี, the 2563
excavation), ศิลปวัฒนธรรม 155972 (the 23 Preah Khan place names, Coedes) and 9290 / 113318
(ศานติ ภักดีคำ, the 2121 and 2124 Lawaek attacks), LINE Today WBX7yPR (พริบพรี is not the
older name), UNESCO en.unesco.org/news/new-cities-join-unescos-creative-cities-network
(49 cities, 08/11/2021), ONEP oldtown_all.shp, OSM (way 120451772 the river; ways 232569188
ถนนท่าหิน and the โพธิ์การ้อง / พงษ์สุริยา lines), opentopodata mapzen (peak heights) and
gebco2020 (the Gulf point), Google Maps satellite at z19 (river width) and its pins.

Sources (pass 1): silpa-mag (15971, 131619, 17644, 113318, 9290, 155972), KMUTT library
(King Taksin), en.wikipedia (Southern Line; Phetchaburi station; Phra Ram Ratchaniwet;
Kaeng Krachan Dam), EGAT, ONEP (Kaeng Krachan WH, 26 ก.ค. 2564), TAT (UCCN 2021),
so02.tci-thaijo (Wat Mahathat, Jayavarman VII), gotoknow 490071 (provincial slogan).
