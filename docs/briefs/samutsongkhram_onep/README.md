# Samut Songkhram map work [cloud], 12 Nov 2569

Origin for every distance: **ศาลหลักเมืองสมุทรสงคราม**, `13.41204, 100.00271` (OSM way 829998820).
The story's heart is ~550–700 m SW of it: the station, the railway market and Wat Phet Samut on the river.
`east_m` / `north_m` in the pins make it easy to move the layout origin there.

Files:
- `samutsongkhram_story_places.geojson`: 21 pins, each with distance, bearing, octant, east/north metres and a
  `pin` field saying how it was checked (`osm`, `osm-site`, `imagery`, `estimate`).
- `samutsongkhram_osm.geojson`: OSM pulled 12 Nov 2026 (Overpass mirror maps.mail.ru): the Mae Klong centreline and
  water polygons, canals, the coastline, the Mae Klong railway, trunk/primary/secondary roads with their bridges.
- `samutsongkhram_town_core.jpg`: town pins on Esri imagery, 0.002° grid; river blue, rail red, roads orange.
- `samutsongkhram_story_places.jpg`: the wide view, 0.01° grid, out to Amphawa, Wat Bang Kung and Don Hoi Lot.

## 1. No ONEP outline
Not found: the research pass got 404 from ONEP and Samut Songkhram is not a declared old town as far as found.
The town core used for layout is the dense block between the river and the Phet Samut road, about
13.404–13.411 N, 99.997–100.003 E (~0.7 × 0.6 km), read from imagery. It is not a legal boundary.

## 2. What the map says
- **The Mae Klong runs N→S along the WEST edge of the town**, 170–250 m wide, ~550–700 m west of the pillar.
  Upstream it makes a big loop west of town (13.40–13.425 N); Amphawa sits on it ~5.3 km W.
  It meets the gulf ~4.9 km S of the pillar; Don Hoi Lot is the mud flat east of the mouth (~5.9 km S/SSE).
- **The railway ends at the river.** The Mae Klong line comes in from the NE (Ban Laem) through orchards and
  ends at the station ~100 m from the bank. The last ~300 m of track is the railway market (ตลาดร่มหุบ).
- **Wat Phet Samut** (red-roofed compound, OSM has only its car park) sits on the bank just N of the station;
  the landing in front of it is the town's meeting of boat and train.
- **The fort ป้อมพิฆาตข้าศึก** stood where Somdet Phra Phutthaloetla hospital is now (OSM way 377405321),
  on the bank ~150 m S of the station.
- **Bridges:** the bridge over the main river nearest town is the bypass (ทล.3643, OSM way 189446498), 1.3 km NW.
  The Chusak road (ทล.325) "bridge" near the stadium is a 470 m viaduct mostly over land, crossing a side channel.
  The Rama II road crosses on สะพานสมเด็จพระพุทธเลิศหล้านภาลัย, 3.8 km SW (opened with the road, 1 Apr 2516).
- **The land is orchard ditches (ร่องสวน) everywhere**, coconut and fruit; salt pans and shrimp ponds to the SE
  by the sea. OSM holds ~800 of the ditch ponds as `natural=water` (not exported; pull them again if wanted).

## 3. Pins (distance / bearing from the pillar)
**Town on the river**
- 1 ศาลหลักเมือง (origin): OSM
- 2 สถานีรถไฟแม่กลอง, 684 m SW: OSM
- 3 ตลาดร่มหุบ (rail in the market), 554 m SW: OSM
- 4 วัดเพชรสมุทรวรวิหาร, 536 m SW: wiki coords, matches imagery
- 5 ท่าน้ำหน้าวัดเพชร, 662 m SW: estimate from imagery
- 6 ป้อมพิฆาตข้าศึก site (hospital), 835 m SW: OSM hospital, fort site per the municipality (snippet)
- 7 ตลาดสดเทศบาล, 640 m SW: OSM
- 8 riverside shophouse quarter, 764 m SW: estimate
- 9 วัดป้อมแก้ว, 590 m S: OSM
- 10 ศาลากลาง, 160 m NW: OSM
- 11 equestrian statue in front of the hall, 109 m W: OSM (which king: not verified)

**Crossings and approaches**
- 12 Chusak road viaduct (side channel only): OSM
- 13 bypass bridge over the Mae Klong, 1.3 km NW: OSM
- 14 Rama II bridge, 3.8 km SW: OSM
- 15 the railway leaving for Ban Laem, 4.5 km NE: OSM

**Sea and upstream (edges of the tile or sub lines)**
- 16 river mouth, 4.9 km S: estimate from imagery
- 17 ดอนหอยหลอด, 5.9 km SSE: OSM village node (en.wiki ~13.367, 100.033)
- 18 ตลาดน้ำอัมพวา, 19 อุทยาน ร.2, 20 วัดอัมพวันเจติยาราม: ~5.3–5.6 km W, OSM
- 21 วัดบางกุ้ง, 7.7 km NW: OSM (off a ~9.6 km tile; sub line)

At 100 m/unit a 96-unit tile centred a little SW of the pillar holds the town, the river loop, the mouth and
Don Hoi Lot, with Amphawa on its west edge.
