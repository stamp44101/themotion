# Nakhon Pathom (นครปฐม) — brief (v0, research stage)

Research: `nakhonpathom_research_request.md` → `nakhonpathom_research_gemini.md` ([gemini], pending).
Map: `nakhonpathom_onep/` ([local], pending: the ONEP old-town polygon if Nakhon Pathom is one of the
announced old towns, and OSM pins). Look: shader only. Length: 60 s. Standard: storyline v2 (0 to 100).

## Why this city (handoff, 29 Oct 2026)

- **Cover (proposed, owner to decide):** the old, small chedi alone in forest, then the giant Phra Pathom
  Chedi rising over it in tiers until it fills the middle of the frame (Rama IV's encasing). A big shape
  change in the first second, at real scale (120 m, the tallest stupa in Thailand), not an enlarged one.
- **0 to 100:** Nakhon Chai Si abandoned in forest → the chedi built → the Chedi Bucha canal → the
  southern railway → Sanam Chandra Palace (Rama VI) → Silpakorn University → the town joining the
  Bangkok suburbs.
- **Payoff:** the Phra Pathom Chedi fair (12th lunar month), crowds round the chedi.

## Dates — checked on the web (29 Oct 2026, first pass)

| fact | status | sources |
|---|---|---|
| Rama IV begins the new chedi encasing the old one, 2396 (1853) | ยืนยัน (start year) | mgronline 9540000142120; Thairath travel 2958306; en.wikipedia Phra Pathommachedi |
| works take ~17 years; finished 2413 (1870), under Rama V | ยืนยันบางส่วน (2413 in English sources; Thai sources give "17 ปี") | Thairath 2958306; en.wikipedia |
| height 120.45 m to the crown | ยืนยัน | Thairath 2958306; silpa-mag ?p=144387 |
| southern line Thonburi–Phetchaburi: service 1 Apr 2446, opened by Rama V 19 Jun 2446; Nakhon Pathom station (first named "Phra Pathom") opened with it | ยืนยัน (English sources; Thai/SRT source wanted) | en.wikipedia Southern Line; Nakhon Pathom railway station |
| Sanam Chandra Palace finished 2450 after ~4 years | ยืนยันบางส่วน | KTC / Wongnai travel pages; Gemini to confirm with a Fine Arts Dept source |
| Chedi Bucha canal dug | ไม่พบ yet (Gemini) | — |
| renamed นครปฐม under Rama VI | ไม่พบ yet (Gemini) | — |

## Open questions

- How far to tell the Phraya Kong / Phraya Phan legend (patricide): Gemini's view, then the owner's.
- Is Nakhon Pathom in ONEP's `oldtown_all.shp`? ([local])
- The hero (owner decides after 2–3 style frames).

## Map ([local], `nakhonpathom_onep/`, 30 Oct 2026) — what it means for the tile

No ONEP polygon (not an announced old town) and no Dvaravati moat in OSM; the town has no wall to trace,
so it is an open town round the chedi, like Udon. Measured from the chedi (13.819673, 100.060078):

| place | real | at 80 m/unit |
|---|---|---|
| Khlong Chedi Bucha | 233 m to the nearest bank, runs E–W just N of the chedi | ~3 units |
| Nakhon Pathom station / Southern Line | 553 m N, line runs E–W | ~7 units N |
| Sanam Chandra Palace (13 ha) | 1.6 km W | ~20 units W |
| Silpakorn (Sanam Chandra campus) | 2.2 km W | ~27 units W |
| Phra Prathon Chedi | 4.0 km E | ~50 units E |
| Tha Chin at Nakhon Chai Si | 13.6 km E | far (`far: true`) |

So the spine is an east–west strip: palace and university to the west, the chedi in the middle, the canal
and the railway parallel to each other just north, Phra Prathon to the east. A 96-unit tile centred
~1 km west of the chedi holds the palace and the university on one side and keeps Phra Prathon near
the east edge; the Tha Chin / old Nakhon Chai Si is a far place (one of the two allowed, v2 rule 3).
The canal and the rail run side by side: keep the rail out of the canal's bed (`check_story`).

To check before modelling: OSM's chedi polygon is ~129 m across and likely includes the round cloister;
the bell's own base diameter comes from Gemini's part 4.
