# Nong Khai map (cloud, 18 Nov 2569)

Made in the cloud container without [local]: OSM through the Overpass mirror (maps.mail.ru), nominatim, and Esri World
Imagery exports. No ONEP polygon: the town is a strip on the Mekong's south bank, so the story is held by the river, not a
municipal outline.

- `nongkhai_story_places.geojson`: the story places (part 6 of `../nongkhai_research.md`), each with its distance and bearing
  from the origin (อนุสาวรีย์ปราบฮ่อ, 17.87962, 102.74057) and where the pin came from.
- `nongkhai_story_places.jpg`: Esri imagery (102.700-102.795 E, 17.845-17.915 N) with the pins.

**The Mekong.** OSM's riverbank multipolygon timed out on the mirror, so both banks were traced from the imagery: water
pixels down each column every ~500 m (`places.ts`, `MEKONG`), checked against a second export of the north-east. The river
runs SW to NE, 550-650 m wide; it enters the tile on the west edge and leaves on the north edge, so Laos (Tha Deua, the
edge of Vientiane) fills the tile's north-west corner. It is drawn as ONE flat shape cut at the tile edges, never a path
river.

**Pins**
1. อนุสาวรีย์ปราบฮ่อ (origin): OSM node 13017978186. The 2492 monument in front of the old provincial hall; the 2429 one
   stood behind the police station nearby (not pinned).
2. ตลาดท่าเสด็จ, 975 m NE: OSM. Stands for บ้านไผ่, the founding village (Ban Phai itself has no pin).
3. วัดโพธิ์ชัย, 1.9 km ENE: OSM.
4. พระธาตุหล้าหนอง, 3.6 km NE: the OSM pin sits on the bank (the shrine and replica); the fallen stupa is ~180-200 m out in
   the river (news snippets), drawn 2 units off the bank.
5. the old station by the river (2498-2545), 1.3 km W: the end of the abandoned track (OSM way 40271689); **assumed**, not a
   named pin.
6. Nong Khai station (2545), 2.0 km SW: OSM.
7, 8. the Friendship Bridge, 2.7-2.9 km W: OSM rail-bridge ways; 1,170 m.
9. ศาลาแก้วกู่, 4.5 km E: OSM.
10. the city pillar, 1.5 km S: OSM (not in the story).

Every story place is within ~4.5 km of the origin, so the whole story fits one tile at true scale (82 x 82 units at
100 m/unit): no far place is drawn closer.
