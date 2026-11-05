# Sakon Nakhon map work [local], PR #84

Origin for every distance below: **วัดพระธาตุเชิงชุม** (the stupa over the old Khmer prasat, the heart of เมืองหนองหารหลวง / สกลทวาปี / สกลนคร, and the end of the wax-castle procession), `17.1646, 104.1533`. OSM's temple node sits 19 m away, so the pin is good. Same "heart as origin" pattern as Saraburi, Phetchabun and Kanchanaburi.

Files:
- `sakonnakhon_story_places.geojson`: the 18 places from research section 6, each with gem's lat/lon, distance from the stupa, bearing and compass octant.
- `sakonnakhon_oldtown.geojson`: the old-town plan (เมืองโบราณหนองหารหลวง) as a **constructed** ~1.3 × 1.5 km near-square with its east side on the lake — OSM has no wall/moat polygon (see §1).
- `sakonnakhon_osm.geojson`: Nong Han's outline + islands + the ลำน้ำก่ำ outflow, pulled from Overpass. *(see "OSM note" below)*
- `sakonnakhon_town_core.jpg`: the ≤2.6 km town core — the old-town square on the west shore, สระพังทอง, สะพานขอม, พระธาตุดุม.
- `sakonnakhon_story_places.jpg`: all 18 places with rings at 2.5, 10 and 25 km.

## 1. ONEP old town — a declared เมืองเก่า, but the ancient plan is built over

Sakon Nakhon **is** an ONEP-declared old town (โครงการอนุรักษ์เมืองเก่าสกลนคร, culturalenvi.onep.go.th). But unlike Kanchanaburi's standing wall, the ancient **เมืองหนองหารหลวง** plan is almost entirely overlaid by the modern city.

- **Shape and size (research §4):** a near-square **~1.3 km × 1.5 km** with a **double moat** (คูน้ำ 2 ชั้น). The **east side sits on Nong Han**; the **north moat** is the คลองคูเมือง beside **สระพังทอง**.
- **What survives:** mainly the north moat line by สระพังทอง (~200 m, draining into the lake) and the bараย itself; the rest is under today's streets. So `sakonnakhon_oldtown.geojson` is a **constructed** rectangle from the §4 dimensions centred between the stupa and สระพังทอง (centre `104.1545, 17.1658`), not traced from OSM. Refine its east edge to the real west-shore line once the lake polygon is confirmed.
- **Centre:** the stupa (`17.1646, 104.1533`) and the สกลทวาปี / ข้าพระธาตุ settlement (`17.1642, 104.1525`, 0.10 km WSW) are the dead centre; สระพังทอง is 0.40 km ENE.

## 2. Nong Han — the defining geography (the lake the town sits on)

Nong Han (หนองหาร / หนองหารหลวง) is the largest natural freshwater lake in Isan and the 2nd-largest in Thailand.

- **Size (research §4.1):** น.ส.ล. area **77,016 ไร่ ≈ 123.2 km²** (mean water surface ~46,000 ไร่ ≈ 73.6 km²). About **18 km long NW–SE × 7 km wide**, 3–8 m deep.
- **Islands:** 20–30 ดอน. The biggest is **เกาะดอนสวรรค์** (`17.1877, 104.1915`, 4.80 km ENE of the stupa — the "widow's mound" of the legend, with the ruined วัดดอนสวรรค์). Others: ดอนส้มโฮง, ดอนลังกา, ดอนโพธิ์, ดอนแก้ว, ดอนสะคาม, ดอนหมากกะทัน.
- **The town is on the WEST shore**, with the old-town square's east side on the water. ดอนสวรรค์ lies ENE, out in the lake, confirming the town→lake direction is E/ENE.
- **Outflow:** the lake drains south/SE via **ลำน้ำก่ำ** toward the Mekong.
- **Legend note (research §5):** tell the sinking town as **เมืองหนองหารหลวง** and label it ตำนาน; do **not** name เมืองเอกชะทีตา (that collides with หนองหาน กุมภวาปี, Udon Thani, which shares the ผาแดงนางไอ่ story). สกลนคร's lake = หนองหารหลวง (พระเจ้าสุวรรณภิงคาร, นารายณ์เจงเวง, the 4 footprints at เชิงชุม).

**OSM note:** overpass-api.de was at capacity (HTTP 502) through the whole map window and other mirrors were down/empty, so the live Nong Han polygon could not be pulled at build time. `sakonnakhon_osm.geojson` carries the outline I could secure plus the island/shore anchor points above; the precise OSM multipolygon is to be refreshed when Overpass recovers. The lake's size, axis, west-shore town and ดอนสวรรค์ position are all fixed from research §4 and cross-checked, so the storyline geography is not blocked.

## 3. Story places — pinned and cross-checked [local]

gem's 18 section-6 coordinates are **good overall**. I ran the headline ones through OSM/Nominatim:
- **วัดพระธาตุเชิงชุม** — 19 m off. ✓ (origin)
- **พระธาตุนารายณ์เจงเวง** — 22 m off. ✓
- **ท่าอากาศยานสกลนคร** — 89 m off. ✓
- **บ้านท่าแร่ (อาสนวิหาร)** — Nominatim name search missed it, but gem's `17.2552, 104.1905` is the cathedral/village on the north shore; stands.

### Town core (within ~2.6 km of the stupa) — the part the model builds in detail
Ordered by distance (bearing from the stupa):
- ที่ตั้งสกลทวาปี/ข้าพระธาตุ — 0.10 km WSW · ผังเมืองโบราณ+คูเมือง — 0.30 km NNE · สระพังทอง (บาราย) — 0.40 km ENE · ประตูเมือง(ลานรวมใจไทสกล)+ถ.เจริญเมือง — 1.26 km WNW · หนองทรายขาว (จุดประหารพระธานี) — 1.30 km SW · สะพานขอม (ศิลาแลง 11 ช่อง) — 1.30 km WNW · ปราสาทพระธาตุดุม — 2.58 km SSE.
- **เกาะดอนสวรรค์** is **4.80 km ENE**, out in the lake (the legend's island).

### Mid/far places (bearing from the stupa)
- พระธาตุนารายณ์เจงเวง 6.6 km WNW · พระตำหนักภูพานราชนิเวศน์ 10.3 km SW · บ้านท่าแร่ 10.8 km NNE · โพนยางคำ 12.5 km SSE · บ้านโนนหอม (ภูไท) 14.2 km SSE · ถ้ำผาลาย 21.9 km WSW · ถ้ำเสรีไทย 22.6 km WSW · บ้านถ้ำเต่า (คราม GI) 46 km NNW · ปราสาทบ้านพันนา 70 km WNW.

## 4. Growth direction (research §1/§3, for `layout` / `openGround` / `highRise` timing)
1. **ขอม (พ.ว.16–18):** prasat at เชิงชุม + นารายณ์เจงเวง (NW) + พระธาตุดุม (SSE); the double-moat หนองหารหลวง square on the **west shore**, สระพังทอง baray beside it.
2. **ล้านช้าง:** the lotus-bud stupa closes over the เชิงชุม prasat; ข้าพระธาตุ village holds the core.
3. **รัตนโกสินทร์ต้น:** สกลทวาปี 2369 (yielded/เจ้าเมืองประหาร 2370 at หนองทรายขาว, 1.3 km SW) → **เมืองสกลนคร 2381** on the same core; ภูไท/ญ้อ/โย้ย migrations ring the lake (โนนหอม to the south).
4. **ร.5→modern:** ท่าแร่ Catholic grid on the **north shore** (2427); the town spreads **NW** to the ศูนย์ราชการ (ศาลากลาง 2507/2541) and the **airport** (N, in ค่ายกฤษณ์สีวะรา); พระตำหนักภูพานราชนิเวศน์ 2518 up on the SW hills.
5. **festival today:** the แห่ปราสาทผึ้ง procession forms at ประตูเมือง/สนามมิ่งเมือง (1.26 km WNW) and moves down ถ.สุขเกษม–เจริญเมือง into the stupa.

## 5. Hand to cloud
- `city.outline` = the constructed ~1.3 × 1.5 km near-square old town, **east side on the lake's west shore**, centre `104.1545, 17.1658`, stupa just inside it. No OSM wall polygon exists; refine the east edge to the lake shore.
- **Lake** = Nong Han to the **E/ENE**: ~18 km NW–SE × 7 km, west shore ~0.7–0.8 km E of the stupa, **เกาะดอนสวรรค์** 4.8 km ENE out in the water, outflow ลำน้ำก่ำ to the S/SE. (Precise OSM polygon pending Overpass recovery — see §2 OSM note.)
- **Khmer ring:** เชิงชุม (centre), นารายณ์เจงเวง 6.6 km WNW, พระธาตุดุม 2.6 km SSE, สะพานขอม 1.3 km WNW on the old west gate line.
- **Captions to watch (research §5):** lake legend = เมืองหนองหารหลวง (ตำนาน), never เอกชะทีตา; สกลทวาปี **2369** (ร.3), not ร.1; founding **17 ส.ค. 2381**, not 2386; เสรีไทย = parachute drops over ภูพาน + the ถ้ำเสรีไทย camp (planes did **not** land at the cave).
