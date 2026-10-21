# Chiang Rai — the pass-3 check, on a Thai connection

Issue #54. Everything below was pulled or measured on 20 ตุลาคม 2569 from a Thai connection,
because the cloud container is blocked by ONEP (403) and could not reach OSM. The ONEP polygon
itself is written up separately in `chiangrai_onep/README.md`.

Each line says where the number came from. Where a source disagrees with the Gemini pass, the
disagreement is stated rather than smoothed over.

## 1. The Kok's width, measured

No riverbank polygon exists in OSM here — only a centreline — so the width was measured off Esri
World Imagery at z19 (0.281 m/pixel). The water was segmented by colour, then at every centreline
vertex a ray was cast **perpendicular to the local river bearing** and the water run counted.

| at | width |
|---|---|
| 19.923133, 99.818804 | 52 m |
| 19.923741, 99.820243 | 97 m |
| 19.923929, 99.821789 | 73 m |
| 19.923808, 99.823181 | 88 m |
| 19.923691, 99.823480 | 91 m |
| 19.923334, 99.824395 | 107 m |
| 19.921863, 99.825620 | 76 m |
| 19.920537, 99.826774 | 110 m |
| 19.919859, 99.826893 | 129 m |
| 19.919361, 99.826980 | 104 m |
| 19.918415, 99.827926 | 82 m |
| 19.917784, 99.829760 | 50 m |
| **19.918110, 99.832433** (under สะพานพญามังราย, due north of the centre) | **111 m** |
| 19.918613, 99.834392 | 111 m |
| 19.918789, 99.835487 | 116 m |
| 19.918919, 99.836300 | 118 m |
| 19.919478, 99.838370 | 145 m |
| 19.919372, 99.842342 | 139 m |
| 19.919543, 99.842847 | 104 m |
| 19.920425, 99.845455 | 89 m |

**Use ~110 m** along the stretch that fronts the old town (the median of the lot is 107 m),
widening to ~140 m at the east end. Range across the whole window 50–145 m.

This is **below** the Gemini figure of 120–160 m. At the engine's 80 m per unit that is **1.4
units**, not 1.5–2.0.

A cross-check independent of the pixel work: the two footbridges that cross the river beside the
old town are **153 m and 154 m** end to end (OSM ways 1127658810, 1127658815) — bank structure
included, so a little wider than the water, which is the right relationship.

## 2. Pins

Confirmed against OSM objects, not search-engine guesses. Distance and bearing are from the ONEP
outer centroid, 19.913421, 99.830424.

| name | pin | OSM | from centre | vs the Gemini pin |
|---|---|---|---|---|
| ดอยจอมทอง / พระธาตุดอยจอมทอง | **19.915725, 99.822768** | node 2622028410 | 0.84 km, 288° | 23 m |
| ดอยงำเมือง / กู่พญามังราย | **19.912669, 99.825093** | way 963882459 | 0.56 km, 262° | 19 m |
| วัดพระแก้ว | **19.911662, 99.827016** | way 487642776 | 0.41 km, 241° | **72 m — Gemini sits east of the grounds** |
| วัดกลางเวียง | **19.910743, 99.832357** | way 256549545 | 0.36 km, 146° | 28 m |
| หอนาฬิกาทอง (เฉลิมชัย) | **19.907163, 99.830989** | way 487637817 | 0.69 km, 175° | 5 m |
| **หอนาฬิกาเก่า** | **19.910257, 99.830604** | node 5384728145 | 0.35 km, 177° | — (new) |
| อนุสาวรีย์พญามังราย | **19.910446, 99.840104** | node 2622028552 | 1.07 km, 108° | 5 m |
| เกาะลอย | **19.915811, 99.836097** | node 9139381668 | 0.65 km, 66° | — |
| สวนสาธารณะเกาะลอย | **19.918371, 99.837660** | way 543872967 | — | — |
| กลางแม่น้ำกก เหนือเมือง | **19.918110, 99.832433** | centreline way 40191691 | — | — |
| **วัดร่องขุ่น** | **19.823983, 99.762866** | way 204897611 | **12.16 km, 216°** | the brief's `[unknown]`, now filled |
| **สนามบินเก่าเชียงราย** | **19.889691, 99.827621** | node 411928350 | 2.64 km, 186° | — (new) |
| ท่าอากาศยานแม่ฟ้าหลวง | **19.950647, 99.881760** | way 593126810 | 6.77 km, 53° | — |

Three things the pin work turned up that the brief does not have:

- **วัดร่องขุ่น is south-WEST, not south.** 12.2 km on a bearing of 216°. Placed due south of the
  tile it will read wrong against the mountains.
- **Both clock towers exist as separate objects, 350 m apart on the same street.** The brief lists
  "two clock towers" as a trap; here are their pins, so the trap can be designed around rather than
  avoided.
- **The 2466 airfield is a mapped place** — สนามบินเก่าเชียงราย, 2.6 km due south of the old town,
  and a different place from today's international airport 6.8 km to the north-east.

## 3. The years, opened at the source

### Confirmed, and now usable on screen

- **The provincial slogan, word for word**, from สำนักงานพาณิชย์จังหวัดเชียงราย:
  **"เหนือสุดในสยาม ชายแดนสามแผ่นดิน ถิ่นวัฒนธรรมล้านนา ล้ำค่าพระธาตุดอยตุง"**
  <https://chiangrai.moc.go.th/th/content/page/index/id/1055> — exactly as the Gemini pass had it.
- **The Mangrai monument: เปิด 31 มีนาคม 2507**, ห้าแยกพ่อขุน, bronze at one-and-a-half life size on
  a base about 3 m high, sculpted by **ปกรณ์ เล็กฮอน** — องค์การบริหารส่วนจังหวัดเชียงราย,
  <https://chiangraipao.go.th/travel/detail/303>.
- **2386, and who did it:** the town was restored under รัชกาลที่ 3 with **เจ้าหลวงธรรมลังกา as its
  first เจ้าเมือง** and about **1,000 families** moved in — <https://www.tourismchiangrai.com/721/>.
  The same page puts Burmese rule at about 200 years, and provincial status at **2453**.
- **The gold clock tower was finished 2551**, not 2548–51: five years' work, designed by
  **เฉลิมชัย โฆษิตพิพัฒน์**, and it stands **on ถนนบรรพปราการ** — which the ONEP work shows is the
  old south wall line. The brief's placement "on the old ประตูหวาย, south wall line" holds.

### Corrected

- **The airfield is พ.ศ. 2466, not 2469.** ณัฐกร วิทิตานนท์, *พัฒนาการของ "เมืองเชียงราย" ภายใต้การ
  วางผังเมืองสมัยใหม่*, วารสารรัฐศาสตร์และรัฐประศาสนศาสตร์ 12(2), 2564, น. 47–74, lists
  "การสร้างสนามบิน (พ.ศ. 2466)" alongside ศาลากลาง 2443, เรือนจำ 2451, โรงเรียนสามัคคีวิทยาคม 2451.
  <https://so05.tci-thaijo.org/index.php/polscicmujournal/article/download/216200/171539/907712>
- **The street grid is 2438, not 2460.** The same article: "ต่อมาในปี พ.ศ. 2438 เริ่มมีการตัดถนนสาย
  หลักเส้นใหม่ในเขตกำแพงเมืองเชียงราย ชื่อถนนกรุงธนลากบำรุงเมือง (ถนนธนาลัย) ผ่านกลางเมืองตามแนว
  ตะวันออก-ตะวันตก เป็นเส้นตรง กับอีกเส้นตามแนวเหนือ-ใต้ ชื่อถนนรัชชนะมงคล (ถนนรัตนาเขต)".
  So the first straight street through the walled town predates the wall coming down by a decade,
  and it is **ถนนธนาลัย** — which the ONEP test puts 218 m inside the boundary, through the middle,
  exactly as described.
- **The wall came down over 2450–2460, and the cholera year is 2460** — so "demolished in 2460" is
  a decade compressed into one date. ประตูหวาย went with it.
- **Briggs' dates are 2443–2461**, and what he is credited with is laying out the municipal street
  grid **on the model of Washington D.C.** The journal article names him in full, **Dr. William A.
  Briggs**, and credits him with the grid and with "ทำลายพื้นที่เมืองแบบจารีตลงบางส่วน". It does
  **not** say the walls came down on his medical advice after cholera; that link is still only
  Gemini's.

### Split in two

- **1977 and 1979 are two different events, and the brief merges them.**
  - **พ.ศ. 1977** — lightning struck the chedi at **วัดป่าเยี้ยะ**, the plaster broke and the image
    was found; the temple was renamed วัดพระแก้ว.
  - **พ.ศ. 1979** — the ruler of Chiang Mai sent the elephant procession; the elephant balked and
    went to Lampang instead.

  Two years apart. That is a storm beat and a procession beat, not one.

### Still disagreeing after the check

- **How long the town stood empty.** The journal and tourismchiangrai both support "deserted,
  restored 2386". But สำนักงานพาณิชย์จังหวัด writes **"เคยเป็นเมืองร้างผู้คนนานเกือบร้อยปี … ฟื้นฟู
  บ้านเมืองขึ้นมาใหม่เมื่อประมาณ ปี พ.ศ. 2384"** — nearly a hundred years, and 2384 rather than
  2386. That sentence carries a `[ต้องการอ้างอิง]` tag, which is why the stronger sources win, but
  the "39 years" figure is not safe to put on screen as a number.
- **The 1942 bombing** was not resolved; nothing new was found either way. It stays out.

## 4. What the ONEP map settles about the walled town

From ณัฐกร วิทิตานนท์, citing สุรพล ดำริห์กุล (2549, น. 105), on the town as rebuilt after 2386:

> "รูปลักษณ์ของเมืองเชียงรายที่ได้รับการบูรณะแล้วหลังปี พ.ศ. 2386 เป็นรูปทรงสี่เหลี่ยมคางหมู
> ประกอบด้วยกำแพงอิฐ ป้อมปราการ คูเมืองล้อมรอบ และมีประตู 12-13 แห่ง … ซึ่งกว้างขวางขึ้นมาก
> โดยขยายออกไปทางด้านทิศตะวันออกของเมือง"

A **trapezoid**, brick wall, bastions, a moat all round, **12–13 gates**, and bigger than the old
เวียง because it was extended eastward. The ONEP core ring is exactly that shape, and its east edge
is ถนนพหลโยธินสายใน — the extension. Build the wall from the ring, not from a rectangle.

Note the gate count: the brief says 12 **ยืนยันแล้ว**; this source says **12–13**. Safe on screen
as "สิบสองประตู" only if the caption does not claim the number is exact.

## 5. One more beat the sources handed over

The same article explains **where เกาะลอย came from**: "ผลของการเปลี่ยนทิศทางการไหลของแม่น้ำกก
ได้ทำให้เกิดพื้นที่งอกคือบริเวณเกาะลอย ซึ่งในเวลาต่อมาได้มีกลุ่มคนเข้ามาตั้งถิ่นฐานเพิ่มเติมทาง
ด้านเหนือของเมือง" — the river moved, left new ground, and people settled it. That is something the
diorama can actually show: the Kok shifts, land appears, houses follow.
