# Chiang Mai Timelapse — เชียงใหม่ จากผืนป่า สู่นครแห่งล้านนา

A 60-second, 9:16 motion-graphics "hybrid timelapse" of Chiang Mai's history, built with [Remotion](https://www.remotion.dev/).
A fixed camera looks west across the Ping River toward Doi Suthep while the city is founded, flourishes, falls, is rebuilt and modernises.

Rendered video: [`renders/chiangmai-timelapse.mp4`](renders/chiangmai-timelapse.mp4) (1080×1920, 30 fps, Thai text, stereo ambience + score)

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

[`renders/chiangmai-iso.mp4`](renders/chiangmai-iso.mp4) — the same story and soundtrack as a Three.js diorama: Chiang Mai on a floating tile of land with a soil cross-section, low-poly trees, real shadows, a scripted drone camera and tilt-shift blur. Source in `src/iso/` (composition `ChiangMaiIso`, render with `npm run render:iso`).

## Nakhon Ratchasima (Korat)

[`renders/korat.mp4`](renders/korat.mp4) — built with the reusable diorama engine (`src/engine/`) from `src/cities/korat/`: dinosaurs, Ban Prasat, Sema and Phimai, King Narai's walled city, the 1826 Thao Suranari story, the first railway (1900), the monument (1934), Mittraphap Highway (1958), fireworks finale. Isan-flavoured score from `scripts/soundtrack_korat.py`.

## Ayutthaya

[`renders/ayutthaya.mp4`](renders/ayutthaya.mp4) — 75 s, island city ringed by three rivers, with drone dives into street life (riverside, the international port, today): 1350 founding, Wat Phra Si Sanphet, 1569, the 1592 elephant duel, Wat Chaiwatthanaram (1630), the fall on 7 April 1767, ruins, World Heritage 1991. Score in central-Thai classical colours (`scripts/soundtrack_ayutthaya.py`).

## Sukhothai

[`renders/sukhothai.mp4`](renders/sukhothai.mp4) — 75 s: Khmer Wat Phra Phai Luang, founding c. 1249, a market drone dive, Thai script per Inscription 1, Wat Mahathat's lotus-bud chedi, the triple walls, a Sangkhalok kiln dive, Wat Si Chum, the 1438 merger with Ayutthaya, ruins, historical park, World Heritage 1991, a cycling dive and a Loy Krathong night finale (krathongs on the moat, lanterns, fireworks). Score with khlui flute (`scripts/soundtrack_sukhothai.py`).

## Develop

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
