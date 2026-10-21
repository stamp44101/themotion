# Chiang Mai Timelapse — เชียงใหม่ จากผืนป่า สู่นครแห่งล้านนา

A 60-second, 9:16 motion-graphics "hybrid timelapse" of Chiang Mai's history, built with [Remotion](https://www.remotion.dev/).
A fixed camera looks west across the Ping River toward Doi Suthep while the city is founded, flourishes, falls, is rebuilt and modernises.

Rendered video: [`chiangmai-timelapse.mp4`](https://github.com/stamp44101/themotion/releases/download/renders/chiangmai-timelapse.mp4) (1080×1920, 30 fps, Thai text, stereo ambience + score)

Look: parallax camera moves (push-ins on the founding, the chedi collapse and the railway), drifting mist, sun rays, rain in the Burmese era, birds, film grain, vignette and light leaks on era changes.

Sound (all synthesized, synced to the picture): D-major pentatonic Lanna-flavoured score — pads, plucked phin-style melody, khong wong, klong drum, gongs on key moments; river, wind, birds by day / crickets by night following the day–night cycle; construction, temple bells, earthquake and collapse, steam and modern trains, plane, city traffic and songthaew horns, lantern chimes.

| Time | Era | Key moment |
|---|---|---|
| 0–3 s | Title | เชียงใหม่ |
| 3–9 s | Before the city | Lawa settlements, Ping valley, Doi Suthep |
| 9–14 s | Hariphunchai | Mon kingdom at Lamphun, rice fields spread |
| 14–24 s | Founding, 1296 | King Mangrai digs the moat, raises walls and gates |
| 24–29 s | Lanna golden age | Wat Phra That Doi Suthep, Wat Chedi Luang, Wat Chet Yot |
| 29–37 s | Earthquake 1545, Burmese rule 1558–1774 | Chedi top collapses, city decays |
| 37–43 s | King Kawila | City retaken and resettled (1796) |
| 43–50 s | Joining Siam | Railway 1921, Doi Suthep road 1935 |
| 50–56 s | Modern city | Sprawl, Nimman, airport, traffic |
| 56–60 s | Today | Yi Peng lanterns — 730 years |

## 3D isometric diorama version

[`chiangmai-iso.mp4`](https://github.com/stamp44101/themotion/releases/download/renders/chiangmai-iso.mp4) — the same story and soundtrack as a Three.js diorama: Chiang Mai on a floating tile of land with a soil cross-section, low-poly trees, real shadows, a scripted drone camera and tilt-shift blur. Source in `src/iso/` (composition `ChiangMaiIso`, render with `npm run render:iso`).

## Nakhon Ratchasima (Korat)

[`korat.mp4`](https://github.com/stamp44101/themotion/releases/download/renders/korat.mp4) — built with the reusable diorama engine (`src/engine/`) from `src/cities/korat/`: dinosaurs, Ban Prasat, Sema and Phimai, King Narai's walled city, the 1826 Thao Suranari story, the first railway (1900), the monument (1934), Mittraphap Highway (1958), fireworks finale. Isan-flavoured score from `scripts/soundtrack_korat.py`.

## Ayutthaya

[`ayutthaya.mp4`](https://github.com/stamp44101/themotion/releases/download/renders/ayutthaya.mp4) — 75 s, island city ringed by three rivers, with drone dives into street life (riverside, the international port, today): 1350 founding, Wat Phra Si Sanphet, 1569, the 1592 elephant duel, Wat Chaiwatthanaram (1630), the fall on 7 April 1767, ruins, World Heritage 1991. Score in central-Thai classical colours (`scripts/soundtrack_ayutthaya.py`).

## Sukhothai

[`sukhothai.mp4`](https://github.com/stamp44101/themotion/releases/download/renders/sukhothai.mp4) — 75 s: Khmer Wat Phra Phai Luang, founding c. 1249, a market drone dive, Thai script per Inscription 1, Wat Mahathat's lotus-bud chedi, the triple walls, a Sangkhalok kiln dive, Wat Si Chum, the 1438 merger with Ayutthaya, ruins, historical park, World Heritage 1991, a cycling dive and a Loy Krathong night finale (krathongs on the moat, lanterns, fireworks). Score with khlui flute (`scripts/soundtrack_sukhothai.py`).

## Phitsanulok

[`phitsanulok.mp4`](https://github.com/stamp44101/themotion/releases/download/renders/phitsanulok.mp4) — 75 s: the city of two rivers. Khmer-era
Song Khwae at the confluence of the Nan and the Khwae Noi, Wat Chulamani, the casting of Phra
Phuttha Chinnarat (attributed to 1357) and Wat Phra Si Rattana Mahathat, Borommatrailokanat moving
the Ayutthaya capital here for 25 years (1463–1488), Naresuan's birth at the Chandra Palace (1555)
and his years as uparaja (1571), the fall of Ayutthaya and the Burmese sack that burned and emptied
the town, the railway (1907), the great fire of 2 January 1957 that took the whole central market
quarter, and the modern city rebuilt around the same Buddha image. Central-Thai court score with pi
reed and ranat (`scripts/soundtrack_phitsanulok.py`).

The walled city uses a real footprint rather than the engine's default rectangle: a trapezoid traced
off the ONEP old-town boundary map, 1,136 m x 2,921 m, long north-south along the Nan, which runs
through the middle of it — Phitsanulok's other old nickname is "เมืองอกแตก", the city with a split chest.

Dates are footnoted in `src/cities/phitsanulok/timeline.ts`. Two to be aware of: the 1357 casting is
*attributed* ("สันนิษฐานว่า") rather than documented, and the great fire is **1957**, not the 1955
that English Wikipedia gives — Thai sources are unanimous on 2 January 2500 BE.

## All cities

Every city after the Chiang Mai versions is built on the shared diorama engine (`src/engine/`) from its
own folder, with a dated, sourced brief. The sections below describe a few of them in detail.

| City | Source | Brief |
|---|---|---|
| Nakhon Ratchasima (Korat) | `src/cities/korat/` | `docs/briefs/korat.md` |
| Ayutthaya | `src/cities/ayutthaya/` | `docs/briefs/ayutthaya.md` |
| Sukhothai | `src/cities/sukhothai/` | `docs/briefs/sukhothai.md` |
| Phitsanulok | `src/cities/phitsanulok/` | `docs/briefs/phitsanulok.md` |
| Chachoengsao | `src/cities/chachoengsao/` | `docs/briefs/chachoengsao.md` |
| Nakhon Sawan | `src/cities/nakhonsawan/` | `docs/briefs/nakhonsawan.md` |
| Chonburi | `src/cities/chonburi/` | `docs/briefs/chonburi.md` |
| Nakhon Si Thammarat | `src/cities/nakhonsi/` | `docs/briefs/nakhonsi.md` |
| Lampang | `src/cities/lampang/` | `docs/briefs/lampang.md` |
| Khon Kaen | `src/cities/khonkaen/` | `docs/briefs/khonkaen.md` |
| Phetchaburi | `src/cities/phetchaburi/` | `docs/briefs/phetchaburi.md` |
| Chiang Rai | `src/cities/chiangrai/` | `docs/briefs/chiangrai.md` |
| Wat Rai Khing (landmark reel, 35 s) | `src/landmarks/watraikhing/` | `docs/briefs/watraikhing.md` |

Finished clips are on the rolling release: https://github.com/stamp44101/themotion/releases/tag/renders

### Build, check, render

```bash
npm run check                    # typecheck + every check_story rule, for every city
npm run audio:<city>             # regenerate the synthesized soundtrack (python3 + numpy + scipy)
npm run render:<city>            # runs check_story for the city, then renders out/<city>.mp4
npm run encode -- <city>         # renders/<city>.mp4 + out/<city>_social.mp4, then checks both
```

How to build a new city, and every lesson so far: `CLAUDE.md`. Working alongside other agents:
`AGENTS.md`. Cities from Phetchaburi on are built to the storyline standard, `docs/storyline.md`.
Rendering on a GPU machine: `docs/render-locally.md`.

## Develop (the 2D Chiang Mai version)

```bash
npm install
npm run studio   # live preview
npm run audio    # regenerate public/soundtrack.wav (needs python3 + numpy + scipy)
npm run render   # -> out/chiangmai-timelapse.mp4
```

Re-run `npm run audio` after changing the timing in `src/lib.ts` so the sound stays in sync.

- `src/lib.ts` — year curve (seconds → year), captions, era labels, colour helpers
- `src/geometry.ts` — perspective projection and procedurally placed trees, houses, buildings
- `src/Scene.tsx` — the landscape and city
- `src/Overlay.tsx` — year counter, Thai captions, callouts, timeline bar, intro/finale, grain/vignette/light leaks
- `scripts/make_soundtrack.py` — procedural soundtrack; `scripts/export_timeline.mjs` feeds it the year/day–night timeline

## Chonburi

`Chonburi` is a 60-second coastal diorama following Sri Phalo and the fishing
settlements, Ayutthaya-era Bang Pla Soi, the 1767 eastern mobilisation, Ban
Saphan Bang Pla Soi, Ang Sila's convalescent buildings, the buffalo race and
Bang Saen's 1943 resort development into the modern coastal city. The scene is
in `src/cities/chonburi/`; research notes and disputed dates are in
`docs/briefs/chonburi.md`.

```bash
npm run audio:chonburi
npm run render:chonburi
npm run encode -- chonburi
```

`render:chonburi` regenerates the procedural soundtrack before checking and
rendering the film, so the committed `public/soundtrack_chonburi.wav` is always rebuilt from
the script.
