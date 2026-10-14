# City brief — Chonburi / ชลบุรี

## 1. Footprint

Chonburi is not one of the 36 cities in ONEP's published old-town boundary set,
and no evidence found describes a walled urban footprint at Bang Pla Soi. The
model therefore does **not** claim a historic wall. `city.outline` is only the
narrative footprint used to grow houses around the old Bang Pla Soi centre.

- **Boundary source:** Chonburi City Municipality community plan (2023), plus
  provincial descriptions of Bang Pla Soi as the modern city centre.
- **Model shape:** 1.28 km east-west x 1.44 km north-south narrative settlement.
- **`city.outline`** (1 unit = 80 m):
  ```ts
  [[-8, -14], [8, -14], [8, 4], [-8, 4]]
  ```
- **Bounding half-extents:** `hx = 8`, `hz = 14`.
- **Wall and moat:** none; their build years are set to 9999 so they never render.

The diorama compresses the real north-south distance between Bang Pla Soi,
Ang Sila, Khao Sam Muk and Bang Saen. Their order and coastal relationship are
preserved; the separation is not a survey-scale map.

## 2. Water

| water | real dimension | model | axis | position | notes |
|---|---:|---:|---|---:|---|
| Gulf of Thailand | province has about 160 km of coast | 34-unit edge band | z | x = 29 | band touches the east tile edge so it reads as sea, not a river |

- No river passes through the settlement.
- The coast stays east of Bang Pla Soi, Ang Sila, Khao Sam Muk and Bang Saen.
- Piers and boats may extend across the shoreline; houses, roads and crowds do not.

## 3. Story beats

| CE year | event | confidence | source |
|---:|---|---|---|
| before 1400 | Sri Phalo, Bang Sai and other agricultural/fishing settlements existed along the coast | attributed; no single founding year | Chonburi Provincial Tourism and Sports Office, provincial history |
| c. 1400 | Wat Yai Intharam represents Bang Pla Soi's Ayutthaya-era centre | attributed; official temple page calls it nearly 600 years old, another official listing says late Ayutthaya | National Office of Buddhism; Thailand Tourism Directory |
| 1767 | Chonburi people supported Taksin's eastern mobilisation and restoration of independence | confirmed by provincial history | Chonburi Provincial Tourism and Sports Office |
| early Rattanakosin | Thai and Chinese fishers established houses and long wooden piers at Ban Saphan Bang Pla Soi | confirmed period, no exact year | Chonburi City Municipality community plan (2023) |
| reign of Rama IV, 1851–1868 | Ang Sila's two masonry convalescent buildings were established | confirmed period; exact completion year not used on screen | ONEP cultural environment record; Royal chronicles, part 25 |
| more than 150 years | Chonburi buffalo racing tradition is held before the end of Buddhist Lent | confirmed duration; the 1872 curve key is an inference for visual timing, not a claimed founding date | Ministry of Culture calendar; Chonburi Provincial Administrative Organisation |
| 1943 | state development connected Bang Saen, Khao Sam Muk and government guesthouses, launching the modern resort era | confirmed by municipal history | Saensuk Municipality history |
| 1980s–2026 | the coast urbanised through tourism, education, services and Eastern Seaboard industry | broad period | provincial general information |

- **Era labels:** coastal settlements · Bang Pla Soi · independence · fishing
  pier · Ang Sila · buffalo race · Bang Saen · modern coast.
- **Clip duration:** 60 s.

## 4. Landmarks

| name | real relationship | in-model (x, z) | appears | notes |
|---|---|---:|---:|---|
| Sri Phalo port vignette | north of modern Bang Pla Soi | (8.5, -31) | before 1400–1700 | symbolic port, not a reconstruction |
| Wat Yai Intharam | inland from Bang Pla Soi waterfront | (0, -8) | c. 1400 | Ayutthaya-style hall and chedis |
| Taksin eastern fleet | offshore | (18, -19) | 1767 only | temporary story vignette |
| Ban Saphan Bang Pla Soi | east edge of town, pier into sea | (10, -12) | c. 1800 | timber houses and fishing boats |
| Maharaj and Rachini buildings | Ang Sila coast, south of town | (8, 5) | 1851–1868 | white/red paired buildings |
| buffalo race ground | inland near city centre | (-7, -1) | >150 years | symbolic annual race |
| Khao Sam Muk shrine | coastal hill between Ang Sila and Bang Saen | (8.5, 18) | by 19th c. | hill height kept modest; legend is not dated as fact |
| Bang Saen beach | south of Khao Sam Muk | (7, 28) | 1943 | umbrellas, sand and coast road |

## 5. Terrain and palette

- Coastal plain with one low real hill at Khao Sam Muk. The broader inland rise
  is background terrain, not a named mountain.
- Sea blues, mangrove green, warm sand, oxidised red and white masonry.
- 1767 briefly desaturates during the war and mobilisation beat.

## 5b. Grandeur

- **The big thing:** the coast itself and the continuous modern urban strip.
- **Recognisable shape:** a long shore linking Bang Pla Soi, Ang Sila, the
  triangular Khao Sam Muk promontory and Bang Saen.
- **Framing:** the sea remains on the east side while the camera travels south.
- **Last frame:** high aerial with the lit urban strip occupying more than 20%
  of the tile and fireworks over the bay.

## 6. Sound

- Thai central ensemble with khlui, ranat, ching and gong; Chinese plucked colour
  for Bang Pla Soi; surf, gull-like calls, fishing boats, buffalo-race drums and
  a brighter 1943 seaside section.
- Events are keyed to the exported year curve.

## 7. Sources and open questions

- Provincial history:
  https://www.chonburimots.go.th/th/เกี่ยวกับองค์กร/รู้จักชลบุรี/ประวัติจังหวัดชลบุรี.html
- Wat Yai Intharam, National Office of Buddhism:
  https://cbi.onab.go.th/th/content/category/detail/id/110/iid/7449
- Ban Saphan Bang Pla Soi community plan:
  https://chonburicity.go.th/public/list_upload/backend/list_6198/file_6198_1.pdf
- Ang Sila historic buildings, ONEP:
  https://culturalenvi.onep.go.th/site/detail/2810
- Buffalo race, Ministry of Culture:
  https://calendar.m-culture.go.th/events/101367
- Saensuk Municipality history:
  https://infocenter.oic.go.th/เทศบาลเมืองแสนสุข%20จังหวัดชลบุรี/history.php?conid=5961139
- Khao Sam Muk, Thailand Tourism Directory:
  https://www.thailandtourismdirectory.go.th/attraction/4867

Open question: a later map-focused revision should replace the compressed
regional spacing with surveyed coordinates if the engine gains multi-scale
coast support. The current version states the compression rather than implying
survey accuracy.
