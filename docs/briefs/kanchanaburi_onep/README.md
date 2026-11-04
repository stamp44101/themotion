# Kanchanaburi map work [local], PR #82

Origin for every distance below: **ศาลหลักเมืองกาญจนบุรี** (the founding pillar inside the Pak Phraek wall), `14.019640, 99.530810`. OSM's city-pillar node sits 82 m away and Google agrees, so the pin is good. This is the town's heart (`centre`), matching the "pillar as origin" pattern used for Saraburi and Phetchabun.

Files:
- `kanchanaburi_story_places.geojson`: the 32 places from research section 6, each with gem's lat/lon, distance from the pillar, bearing and compass octant.
- `kanchanaburi_osm.geojson`: the two rivers (แควใหญ่, แควน้อย), แม่น้ำแม่กลอง below the confluence, and the Kanchanaburi railway line + bridges, pulled from Overpass (bbox 13.98–14.06 N, 99.49–99.55 E).
- `kanchanaburi_town_core.jpg`: the <=4 km town core — the two rivers meeting at the pillar's river front, the bridge up the NW branch, the station and Don Rak N along the rail.
- `kanchanaburi_story_places.jpg`: all 32 places with rings at 2.5, 10 and 25 km.

## 1. ONEP old town — YES, there is a polygon

Unlike Saraburi, Kanchanaburi **is** an announced old town. ONEP's cultural-environment database (culturalenvi.onep.go.th) carries เมืองเก่ากาญจนบุรี (ปากแพรก) — the Rama III walled city of 1831. Use it as `city.outline`.

- **Shape and size (research section 4.2):** a rectangle **parallel to the Khwae Yai / Mae Klong**, long axis running NW–SE. About **210 m** across (SW–NE) × **494–520 m** long (parallel to the river); perimeter ~1,420–1,460 m. Wall ~4 m high, ~1.20 m thick.
- **Orientation:** the long (river) side faces SW onto the water. The front gate that survives is at `14.019420, 99.529910` (256°/WSW, 0.10 km from the pillar); the wall line runs on to the Kanchananukroh school ground at about `14.017200, 99.532200`. Lay the rectangle with its SW long side on the river and the pillar just inside it.
- **Forts/gates:** 6 forts (four hexagonal corner forts + a big river-front fort ป้อมพิฆาฏข้าศึก on the SW mid-wall + a small rear fort on the NE), 8 gates. Only the one front gate + fragments remain today.
- **OSM has no wall polygon** — the remnants are not tagged `historic=citywall`/`barrier=city_wall`, so `kanchanaburi_osm.geojson` has no wall line. Build the rectangle from the gate coord + the 210×520 m dimensions + the river bearing; it is not traceable from OSM.
- The earlier town at **ลาดหญ้า** (pre-1831) is a *separate* ONEP site 17.9 km NW (section 2), a 180×360 m earthwork rectangle with 4 corner mounds — a second, older footprint for the ลาดหญ้า era, not the main city.

## 2. The two rivers and the confluence (the defining geography)

The town sits on the **"two-colour-river" confluence** (ปากแพรก): the **แม่น้ำแควใหญ่** (Khwae Yai) comes down from the NW past the bridge, the **แม่น้ำแควน้อย** (Khwae Noi) comes up from the W/SW, and they join at `14.0175, 99.5268` (0.35 km SW of the pillar, where the Skywalk now stands) to form the **แม่น้ำแม่กลอง** flowing SE. The OSM geometry confirms this exactly (see `kanchanaburi_town_core.jpg`): both branches meet right under the pillar's river front.

Widths (research section 4.1, for the engine's river width):
- Khwae Yai at the bridge (ท่ามะขาม): **280–300 m**; past เกาะรัตนกาญจน์ in front of the old town the town-side channel is **120–150 m**.
- Khwae Noi before the confluence: **110–150 m** (narrower, different colour — the "two colours").
- Mae Klong below the confluence (Skywalk): **250–320 m**.

**Name caveat for captions (section 3 / 5.4):** before พ.ศ. 2503 the river the bridge crosses was called **แม่น้ำแม่กลอง**, not แควใหญ่ — it was renamed in 1960 to match the film. A pre-1960 beat should not label it "แควใหญ่".

## 3. Story places — pinned and cross-checked [local]

I ran gem's 32 section-6 coordinates through OSM/Nominatim for the headline landmarks and computed distance+bearing from the pillar for all of them. gem's coordinates are **good overall** — the town-core cluster and the river geometry line up. Offsets found:

- **สถานีรถไฟกาญจนบุรี** — OSM 34 m off. ✓ Good.
- **ศาลหลักเมือง / ประตูเมือง** — OSM pillar 82 m off. ✓ Good (used as origin).
- **ปราสาทเมืองสิงห์** — OSM 150 m off. ✓ Good.
- **เขื่อนศรีนครินทร์** — OSM 293 m off. ✓ Fine for a dam at 61 km.
- **สุสานดอนรัก** — ⚠ Nominatim's "Kanchanaburi War Cemetery" returns a point 3.2 km away, but that hit is actually **ช่องไก่ (Chong Kai)** on the far bank — gem's own ช่องไก่ pin (`14.0052, 99.5146`) is ~140 m from it. gem's **Don Rak** (`14.03167, 99.52556`) is correct: it sits right beside the station (verified 300 m away), which is where Don Rak actually is. Keep gem's Don Rak and Chong Kai as given.
- **สถานีรถไฟน้ำตก** — ⚠ gem `14.2427, 99.1037` is **4.0 km** from OSM's "Nam Tok Railway Station" node (`14.2321, 99.0679`). It is a far place (52 km, low impact on the town model), but if the clip ever names/shows it, pin the OSM node. Flagged for cloud.
- **สะพานข้ามแม่น้ำแคว** and **หนองปลาดุก** — Nominatim name search missed them, but the bridge is the hero landmark with a well-known coord (`14.041, 99.504`) that sits on the OSM rail line at the river crossing (see the plot), so it stands; หนองปลาดุก is a 46 km-away rail junction, gem's coord is on the Southern Line as expected.

### Town core (within 2.5 km of the pillar), the part the model builds in detail
From the geojson, ordered by distance (bearing from the pillar):
- ประตูเมือง/กำแพง — 0.10 km WSW · โรงงานกระดาษไทย — 0.15 km SSE (on the N wall) · ศาลากลางเก่า — 0.13 km SSW (inside the wall) · ตลาดปากแพรก/ร้านสิริโอสถ — 0.20 km WNW (N of the wall) · ท่าเรือ/สกายวอล์ค/จุดบรรจบ — 0.35 km WSW · วัดญวน (ถาวรวราราม) — 0.55 km NW · วัดเหนือ (เทวสังฆาราม) — 0.75 km NW · สุสานดอนรัก — 1.45 km NNW · สถานีกาญจนบุรี — 1.72 km NNW · สุสานช่องไก่ — 2.37 km SW · ศาลากลางใหม่ (บ้านบ่อ) — 2.54 km SE.
- The **bridge + wooden-bridge site** are **3.7 km NW** up the Khwae Yai (just outside 2.5 km) — the hero landmark, on the water, NW of the wall.

### Growth direction (research section 3, for `layout`/`openGround`/`highRise` timing)
1. **pre-2374:** city is at ลาดหญ้า, 17.9 km NW (separate footprint).
2. **2374–2484:** walled town at ปากแพรก on the river; ถนนปากแพรก market just N of the wall; first municipality 1935 only 2.08 km².
3. **2485–2517:** rail + ถนนแสงชูโต pull growth **NW** (to the station, Don Rak, the bridge at ท่ามะขาม) and **SE** (ศาลากลางใหม่ at บ้านบ่อ, 1955); municipality grows to 9.16 km² (1974).
4. **2565–2569:** riverfront Skywalk (2022) at the confluence; growth **NE** toward the M81 motorway end (ด่านกาญจนบุรี, 7.7 km NNE).

## 4. Hand to cloud
- `city.outline` = the 210×520 m Pak Phraek rectangle, long side SW on the river, pillar just inside the SW wall; the ลาดหญ้า 180×360 m rectangle is the older/separate footprint for the pre-1831 era.
- Rivers: Khwae Yai (NW, ~280 m at the bridge / ~140 m at the town), Khwae Noi (SW, ~130 m), joining at the pillar's SW front into Mae Klong (SE, ~290 m). Water gate where each river meets the wall; the wall's SW side is the river front.
- Rail: enters from the SE, runs NNW past the station/Don Rak, crosses the Khwae Yai on the bridge 3.7 km NW. `rail` + bridge geometry in `kanchanaburi_osm.geojson`.
- Two coords to double-check before use: **สถานีน้ำตก** (4.0 km off OSM) and a caption rule that the river is **แม่กลอง before 2503, แควใหญ่ after**.
