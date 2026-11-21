# Loei map work [cloud], 20 Nov 2569

Origin for every distance: **วัดโพนชัย ด่านซ้าย**, `17.27452, 101.14908` (OSM node 4319746818), the temple of the Bun Luang /
Phi Ta Khon festival. `east_m` / `north_m` in the pins are metres from it. World units in the clip: 100 m/unit, +x east,
+z south.

## 0. Why the tile is Dan Sai, not Loei town
Three of the clip's four anchors stand in Dan Sai: the hero (the Phi Ta Khon mask), the close event (Phra That Si Song Rak,
2103-2106, the province's seal) and the payoff (the Bun Luang / Phi Ta Khon festival at Wat Phon Chai). Loei town's own
history starts in 2396 (Ban Hae raised to เมืองเลย) and has one event. So the tile is Dan Sai at true scale; Loei town
(66 km, bearing 69) and Phu Kradueng (78 km, bearing 123) are the two far places, drawn closer at the tile's NE and SE
edges. Chiang Khan (87 km, bearing 38) is left to a sub line at most.

Files:
- `loei_story_places.geojson`: 16 pins with distance, bearing, octant, east/north metres and a `pin` field (`osm`,
  `osm-near`).
- `loei_osm.geojson`: OSM pulled 20 Nov 2026 (Overpass mirror maps.mail.ru): ลำน้ำหมัน (way 310614163), Huai Nam Sak
  (ห้วยน้ำศอก, way 310614172) and the other streams and ponds round Dan Sai, the trunk/secondary/tertiary roads (ทล.21,
  2013, 2113, 2114, 2014), and แม่น้ำเลย at Loei town (way 40153224).
- `loei_town_core.jpg`: Dan Sai on Esri imagery, 0.01 degree grid; streams light blue, roads orange, pins red.
- `loei_story_places.jpg`: the wide view, 0.1 degree grid, Dan Sai (W) to Loei town (NE) and Phu Kradueng (SE).

## 1. No ONEP outline
No declared old-town boundary for Dan Sai was found. The old town used for layout is the valley floor where the Man and
the Sok meet, about 17.268-17.283 N, 101.140-101.158 E (~1.6 x 1.7 km), read from imagery. Not a legal boundary.

## 2. What the map says
- **Wat Phon Chai stands on the tongue of land between ลำน้ำหมัน and ห้วยน้ำศอก**: the Man swings W→E ~250 m north of the
  temple, the Sok curls round its south and east and joins the Man 200 m to the WNW. This is the "between the Man and the
  Sok" of the Phra Upakhut rite on the festival's first day (th.wikipedia ผีตาโขน).
- **Phra That Si Song Rak is on the Man's bank 1.0 km WSW (bearing 241)** of Wat Phon Chai, at the river's bend south-west
  of town. (A Silpa-Mag snippet puts it "3 km SW of the district office"; OSM puts the stupa itself at 1.0 km from Wat
  Phon Chai. The pin follows OSM.)
- **The Man flows south to north** through a narrow, flat valley; the town sits where the valley opens east along ทล.2013
  toward Phu Ruea and Loei. The rest of the ~8 km tile is hills: a long ridge NE of town running SW-NE, forested hills W
  and NW, rolling hills S and SE (Esri World_Hillshade). Hills are real everywhere except the valley floor.
- **The town**: the old part on both banks of the Man round Wat Phon Chai; the festival ground 0.7 km NNW; growth east along
  ทล.2013 (hospital 0.9 km E) and north along ทล.2114.
- **Far places**: Loei town 66 km ENE (the city pillar on แม่น้ำเลย; Huai Nam Man, the stream Ban Hae stood on, is not in
  OSM); Phu Kradueng's plateau 78 km SE (park centroid; Pha Nok Aen on its east rim 81 km).

## 3. Pins (distance / bearing from Wat Phon Chai)
1 วัดโพนชัย (origin) · 2 Phi Ta Khon museum 30 m SE · 3 พระธาตุศรีสองรัก 1.02 km / 241 · 4 the Man north of the temple 0.26
km N · 5 the Sok's mouth 0.21 km WNW · 6 Dan Sai town node 0.40 km NNW · 7 the festival ground 0.67 km NNW · 8 Dan Sai
hospital 0.86 km E · 9 the viewpoint hill 2.2 km S · 10 the 2113/2114 junction 1.3 km NW · 11-12 Loei city pillar and the
Loei river 66 km / 69 · 13-14 Phu Kradueng (centroid, Pha Nok Aen) 78-81 km / 121-123 · 15 Chiang Khan 87 km / 38 · 16 Phu
Ruea 34 km / 38 (not used).

At 100 m/unit a ~76-unit tile on Wat Phon Chai holds the valley, the town, the stupa and the hills round them. Loei town and
Phu Kradueng are drawn closer at the NE and SE edges (at most two far places, storyline §7), within ~5 degrees of their
real bearings.
