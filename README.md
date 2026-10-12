# Chiang Mai Timelapse — เชียงใหม่ จากผืนป่า สู่นครแห่งล้านนา

A 60-second, 9:16 motion-graphics "hybrid timelapse" of Chiang Mai's history, built with [Remotion](https://www.remotion.dev/).
A fixed camera looks west across the Ping River toward Doi Suthep while the city is founded, flourishes, falls, is rebuilt and modernises.

Rendered video: [`renders/chiangmai-timelapse.mp4`](renders/chiangmai-timelapse.mp4) (1080×1920, 30 fps, Thai text, no audio)

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

## Develop

```bash
npm install
npm run studio   # live preview
npm run render   # -> out/chiangmai-timelapse.mp4
```

- `src/lib.ts` — year curve (seconds → year), captions, era labels, colour helpers
- `src/geometry.ts` — perspective projection and procedurally placed trees, houses, buildings
- `src/Scene.tsx` — the landscape and city
- `src/Overlay.tsx` — year counter, Thai captions, callouts, timeline bar, intro/finale
