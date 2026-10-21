# Phuket — the field check, on a Thai connection

Answers to issue #58, done on the workstation because the cloud container gets a 403 from ONEP and
from most Thai sites. Checked 21 ตุลาคม 2569.

Each answer is marked **ยืนยันแล้ว** / **สันนิษฐาน** / **ขัดแย้ง** / **ไม่พบ** with the source.

The ONEP polygon and the street analysis have their own file: `docs/briefs/phuket_onep/README.md`.
Two headlines from it, because they change §1 and §4 of the brief:

- ONEP announced **two** features — a **2.78 km² core** (`พื้นที่เมืองเก่า`) inside a **6.41 km²
  continuous zone** (`พื้นที่ต่อเนื่อง`), 9.19 km² in all, bounding box 4,011 × 4,661 m. At
  80 m/unit that whole area is 50 × 58 units and will **not** fit a ±48-unit tile; the core alone
  (2,408 × 3,780 m = 30 × 47 units) does. That is an argument for §1a's plan as written.
- **The boundary does not follow ถลาง, ดีบุก, กระบี่, เยาวราช or รัษฎา.** Those are the shophouse
  streets 200–350 m *inside* the core. The edge runs on ดำรง, รัตนโกสินทร์ 200 ปี, นริศร and ภูเก็ต.

---

## 1. Pins

Confirmed against OSM objects (not geocoder guesses). "Offset" is from the pin in brief §4.

### Correct as published — use them

| pin | offset | the OSM object it lands on |
|---|---|---|
| ศาลเจ้ากะทู้ | **0 m** | `way/570817600` ศาลเจ้ากะทู้, `amenity=place_of_worship` |
| อนุสาวรีย์ท้าวเทพกระษัตรี ท้าวศรีสุนทร | **3 m** | `node/2420388160`, `historic=monument` |
| บ้านชินประชา | **5 m** | `node/6253270085`, `tourism=museum` |
| แยกธนาคารชาร์เตอร์ด | **14 m** | `node/5060965586` ทางแยกธนาคารชาร์เตอร์ |
| ศาลเจ้าจุ้ยตุ่ย | **16 m** | `node/12270302073` Jui Tui Shrine |
| สะพานหิน | **20 m** | `node/11020595696` วงเวียนสะพานหิน, `historic=monument` |
| สะพานสารสิน | **47 m** | `way/965075211` สะพานสารสิน, `man_made=bridge` |
| พระใหญ่ | **45 m** | `node/11794956978` Phuket Big Buddha |
| สนามบินภูเก็ต | **17 m** from the runway | `way/23484036` `aeroway=runway`. The aerodrome relation's centre (`relation/20416548`, HKT) is 380 m away at 8.110006, 98.317747 — the brief's pin is the runway, which is the right thing to draw |
| หาดไม้ขาว | **24 m** | `node/4144223791` "จุดอันซีนภูเก็ต เครื่องบินแลนดิ้งติดหาดไม้ขาว" — the plane-spotting point at the beach's south end |

### Corrected

**วัดพระนางสร้าง — the brief's pin is 836 m west of the temple.**
`node/4575295522` วัดพระนางสร้าง, `amenity=place_of_worship`, sits at **8.026635, 98.332533**.
The brief's 8.027540, 98.325000 falls in open ground west of it.

### โคกพม่า — ไม่พบ, but there is a better anchor 800 m away

**โคกพม่า is not in OSM**, under that name or any other, anywhere in Thalang. The brief already
flags the location as disputed (ท่าเรือ), and nothing here settles it — I am not inventing a pin.

What *is* mapped, and is a real signed monument, is **อนุสาวรีย์ทุ่งถลางชนะศึก** at
**8.027727, 98.320698** (`node/7541339263`, `historic=monument`) — 808 m west-north-west of the
brief's โคกพม่า pin and 1.1 km west of วัดพระนางสร้าง. Two more nearby:
**เมืองถลางบ้านดอน** memorial at 8.020013, 98.319376 (`node/11355959396`), and the **บ้านเคียน**
locality, which shows up as ตลาดนัดโก้เบ๋งบ้านเคียน at 8.024036, 98.328263 — 331 m from the brief's
pin, so บ้านเคียน as a *place* is where the brief says it is.

Suggestion for the battle beat: anchor on **ทุ่งถลางชนะศึก**, a named and mapped monument to the
battle, rather than on a burial mound no open source can place.

### หาดไม้ขาว, the nesting stretch

No `natural=beach` polygon is mapped. The coastline there is one unbroken 43 km run of ways from
**8.0476 N to 8.2006 N** — about **17 km** of continuous west-facing sand from the airport north to
the Sarasin bridge, with no headland to break it. The brief's pin is at its **south end, beside the
runway**, which is also where the news reports put the documented leatherback nests
("จุดชมวิวเครื่องบิน"). For the diorama: the nesting stretch is the whole north-west shore; the
pin marks the south end of it.

### The two sea points

| | position | check |
|---|---|---|
| **Andaman (west)** | **8.1100, 98.2100** | no coastline, island or reef within **4 km** — open sea, ~10 km west of Mai Khao |
| **อ่าวภูเก็ต (east)** | **7.8600, 98.4600** | nearest land is เกาะสิเหร่'s coastline **2,439 m** away — open water inside the bay |

---

## 2. คลองบางใหญ่ — the canal, measured

**It runs straight through the old town, and through the ONEP core.**

- OSM has it as `waterway=canal`, named **คลองบางใหญ่**, five ways totalling **7.8 km**
- it enters the ONEP core at **7.890920, 98.391739** and leaves at **7.872326, 98.390302** —
  **65 of its 198 vertices are inside the core**, 102 inside the outer zone. It is not a canal
  *beside* the old town; the old town is built along it.
- north end of the mapped run **7.905514, 98.378434**, south end **7.872326, 98.390302** at the bay

**Width: about 11 m** (median), IQR 8–13 m.

Measured off ArcGIS World Imagery at z19 (0.296 m/px) with a dark-water mask, sampling a
perpendicular at every centreline vertex. Honest caveat: in a dense town the dark mask also catches
building shadows, so the upper tail is unreliable — the strictest threshold I tried (which can only
*under*-count) still gives a 10.6 m median, and loosening it only walks up to 13.6 m. So ~11 m is
sound and the real figure is very unlikely to be above ~15 m. OSM carries no `width` tag.

At 80 m/unit that is **0.14 units** — a path, not a river. Draw it as a line with banks, not as a
water body; it should read like the Phetchaburi moat, not like the Kok.

This matters more than its size suggests: the local histories say Phraya Wichitsongkhram expanded
the tin workings **"ไปตามลำน้ำคลองบางใหญ่จนถึงบ้านทุ่งคา"** — the canal is the thread along which the
town moved from Kathu to Thung Kha. See §3.3.

---

## 3. The facts the beats stand on

### 3.1 Bowrey's elephants (beat 2) — **ขัดแย้ง. The export is in the text, and the same sentence takes it back.**

I read the Hakluyt 1905 edition itself, not a summary
([archive.org, `ageographicalac00bowrgoog`](https://archive.org/download/ageographicalac00bowrgoog/ageographicalac00bowrgoog_djvu.txt),
the JANSELONE chapter, pp. 235–258).

The editor's index does say "Junk-Ceylon … its produce tin and elephants". Bowrey's own page 240
opens the trade section with:

> "**Elephants and tinne** (that are fitt for transportation), and tinne they have in abundance,
> and, were they industrious might have tenne times see much."

But the next sentence is the one that matters:

> "**Very few Elephants are hence transported by reason the Duty laid Upon them is very great, neare
> soe much as the Elephant doth cost, soe that now adays none are Shipped off by any Merchant that
> hath not the Kinge of Syam's Phyrmane granted him**; if soe they are custome free."

So: elephants were *listed* as an exportable product, and in practice **almost none left the
island** — the duty came close to the animal's own price, and by Bowrey's day only a merchant
holding the King of Siam's firman shipped any. A beat showing elephants being loaded onto junks for
export would be contradicted by the source it rests on.

What Bowrey *does* describe, at length and first-hand, is **elephants as the island's working
animals**: when a ship arrived, the Raja sent "2 or 3 of the King's Elephants … with a Considerable
parcell of his lifeguard" down to carry the captain on "a Very tedious days Journey, through the
Woods and Swampy places" up to **Luppoone**, the chief town "in the very middle of the Island" —
over slopes so steep "the Elephant is constrained to hall himselfe Up … by layinge hold of roots and
bulks of trees with his trunke". He also records **wild elephants and tigers** in the woods (p. 248);
by Forrest's visit in 1785 the wild ones were gone and elephants were being brought in from Mergui.

**My recommendation:** keep the elephant, change what it is doing. The documented, visual, moving
image is *the Raja's elephants carrying a foreign captain up a forest track to Luppoone, while the
tin goes out by sea* — which is both true and a better beat than a loading scene.

Two more numbers from the same chapter, usable on screen:
tin yield **~80 tons/year in Bowrey's time**, ~500 in Forrest's (1780s), down to ~20 tons by 1886
when the island's population was ~6,000; and tin *was* the money — "One Small lumpe or Putta valueth
here 3d English", 8 cupines = 1 baharre = **420 English pounds** of tin.

### 3.2 The move to Thung Kha — **สันนิษฐาน, and the brief's framing is off**

The issue asks when the centre moved "from Thalang to today's town". The sources do not describe
that move. They describe a move **from บ้านเก็ตโฮ่ / กะทู้** — the tin village — **to บ้านทุ่งคา**:

> "พระยาวิชิตสงคราม (ทัต) ขยายกิจการทำเหมืองแร่ดีบุกไปตามลำน้ำคลองบางใหญ่จนถึงบ้านทุ่งคา และจัดตั้ง
> เมืองภูเก็ตเป็นเมืองใหญ่แทนเมืองเก่าที่บ้านกะทู้"
> — [PSU Southern Information](https://clib.psu.ac.th/southerninfo/content/1/af43080a),
> [phuket99](https://phuket99.blogspot.com/2013/05/blog-post_2770.html)

**Date: his governorship, พ.ศ. 2392–2412.** The figure 2392 that circulates as "the year he moved
the town" is the year he *became governor*; I found no source giving a single dated act of moving.
Gemini's 2380–2404 bracket starts too early and ends too early. Treat the move as **mid-19th
century, across 2392–2412**, and do not put a single year on screen.

One dated event inside that window is usable: he built the new ศาลาว่าราชการ in **พ.ศ. 2419**, after
the Chinese miners' riot (อั้งยี่) of the same year.

**For the beat:** the move follows คลองบางใหญ่ downstream from Kathu to the bay (§2) — the canal, the
tin, and the town's relocation are one movement, which the diorama can show literally.

### 3.3 The dredge — **ยืนยันแล้ว: 2452 is when it dredged. 2449 and 2450 are different events.**

The 2450-vs-2452 disagreement resolves once the three dates are separated:

| year | event | source |
|---|---|---|
| **2449** (1906) | Capt. Edward Thomas Miles arrives in Phuket Bay (11 ก.ย. 2449); Tongkah Harbour Tin Dredging Co. incorporated 23 Nov 1906 | [phuketindex](https://news.phuketindex.com/travel/saphan-hin-173396.html); eoas.info (in the brief) |
| **2450** (1907) | Miles **orders** the bucket dredge from **William Simons & Co.**, Scotland, on 20 พ.ย. 2450; parts assembled on the Malayan coast and towed over | [phuketindex](https://news.phuketindex.com/travel/saphan-hin-173396.html) |
| **2452** (1909) | the dredge **works** Tongkah Bay — the world's first offshore tin dredge | [th.wikipedia สะพานหิน](https://th.wikipedia.org/wiki/สะพานหิน), [seabridge](https://www.seabridge.space/content/saphan-hin-mining-monument) |

The arithmetic confirms it: **อนุสาวรีย์หลัก 60 ปี** (วงเวียนหอย) at สะพานหิน was raised in
**2511–2512** as a *sixtieth-anniversary* monument — 60 years back from 20 พ.ย. 2512 is 20 พ.ย. 2452.
Its design, chosen from six entries (นายชวลิต หัสพงษ์), is shaped like a **dredge bucket**.

**Use 2452 for the dredge beat.** 2450 is the order, not the work.

### 3.4 The green turtle and the Mai Khao release — **ยืนยันแล้ว, and it changes the payoff**

**The release is real, annual, and dated: 13 เมษายน, Songkran**, at หาดไม้ขาว, run by
**มูลนิธิเพื่อการอนุรักษ์เต่าทะเลหาดไม้ขาว** with **ศูนย์วิจัยและพัฒนาทรัพยากรทางทะเลและชายฝั่งทะเล
อันดามัน**. The 2561 release put **55 เต่าตนุ (green turtles)** into the sea
([NationTV](https://www.nationtv.tv/news/378617979)). The foundation itself is young — around
2017, set up with Minor Hotels ([The Momentum](https://themomentum.co/feature-maikhao-marineturtle-foundation/)).
**ไม่พบ** any earlier start date for the release as a tradition.

**But green turtles do not nest at Mai Khao now.** The same report is explicit that the beach was a
major nesting ground historically and that
"ปัจจุบันพบว่า จากการเติบโตของการท่องเที่ยว และการพัฒนา ทำให้เต่าทะเลไม่กลับมาวางไข่เหมือนในอดีต".
**ไม่พบ** a recorded green-turtle nest at Mai Khao in any recent source. The nests that *are*
documented there are **leatherback** ones (2562, 2563, 2567 seasons), at the plane-spotting point.

**So the payoff has to choose its verb.** A green turtle **released** at Mai Khao on Songkran is
true and filmable. A green turtle **nesting** at Mai Khao is not supported. The leatherback is the
one that nests; the green turtle is the one that is carried down to the water by a crowd on 13 April.
Both hero animals survive — they just do different things, and that is a *better* payoff: the wild
nest and the human hand, in the same place.

### 3.5 The "18 nests in Phuket" — **ขัดแย้ง. 18 is the whole country, not Phuket.**

From กรมทรัพยากรทางทะเลและชายฝั่ง's own database
([km.dmcr.go.th/c_258/d_19793](https://km.dmcr.go.th/c_258/d_19793)), **nationwide** sea-turtle nests:

| year | เต่ามะเฟือง (leatherback) | เต่าตนุ (green) | all species |
|---|---|---|---|
| 2563 | **16** | 240 | 491 |
| 2564 | **18** | 199 | 502 |
| 2565 | **0** | 348 | — |

So **18 is Thailand's total leatherback nests in 2564**, not Phuket's. For the Phuket/Phangnga
figure, the Andaman season of 2562/63 is the one that was reported in detail: **11 nests** across
four places — บ้านบ่อดาน and หาดท้ายเหมือง (พังงา), เกาะคอเขา (พังงา), and หาดทรายแก้ว / **หาดไม้ขาว** /
หาดในทอน (ถลาง, ภูเก็ต) — 60–120 eggs each, first nest **17 พ.ย. 2562**, last **10 ก.พ. 2563**, one
nest stolen ([Thai PBS](https://www.thaipbs.or.th/news/content/291192)).

**ไม่พบ** a published per-beach count that isolates Mai Khao for 2563–64. Do not put "18" on screen
next to Phuket. If the beat wants a number, **11 nests on the Andaman coast in the 2562/63 season**
is defensible and sourced; and DMCR notes leatherbacks may nest only once every 3–5 years, which is
why 2565 was a blank year — worth knowing before writing a caption that implies a trend.

---

## 4. What I did not settle

- **โคกพม่า's position** — not in any open dataset. The dispute in the brief stands.
- **A per-beach Mai Khao nest count** for 2563–64.
- **When the Songkran release began** as a tradition — the foundation dates to ~2017, but local
  conservation at Mai Khao is older and I found no first year for the event itself.

## Method

ONEP shapefile parsed with a plain `struct` reader; areas by spherical excess; distances in a local
equirectangular projection. Pins from Overpass (`node/way/relation` name-regex searches within
2.5 km of each brief pin, then the nearest matching object by haversine). Canal width from ArcGIS
World Imagery z19. Bowrey from the Hakluyt Society 1905 edition's own text. All queried
21 ตุลาคม 2569.
