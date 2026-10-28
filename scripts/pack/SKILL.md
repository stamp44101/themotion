---
name: "thai-city-timelapse"
description: "Make a 9:16 history timelapse of a Thai city as a code-built 3D diorama — the city grows on a floating tile of land from legend to today, with a year counter, Thai captions, a synthesized score and SFX. Built with Remotion + Three.js. Use for ประวัติเมือง/จังหวัด timelapse reels, or any request to make a 1minutecity-style clip."
---

# Thai City Timelapse (1minutecity)

คลิปแนวตั้งเล่าประวัติเมืองไทยเป็นไดโอรามา 3 มิติ: ทั้งเมืองอยู่บนแผ่นดินลอยฟ้าที่เห็นชั้นดินด้านข้าง เริ่มจากป่าหรือตำนาน แล้วเมืองค่อยๆ ก่อ ขยาย ล่ม ฟื้น จนถึงวันนี้ ตัวเลขปี พ.ศ. วิ่ง คำบรรยายภาษาไทยขึ้นทีละจังหวะ กล้องโดรนบินรอบเมือง ภาพและเสียงสร้างจากโค้ดทั้งหมด

Worked example: **นครราชสีมา** (`src/cities/korat/`): dinosaurs walking on the tile from frame 0, 131K views on Instagram, the series' best opening (skip rate 32.9%). Read its `timeline.ts`, `index.ts`, `Landmarks.tsx` and `actors.ts` before building a new city. `CLAUDE.md` holds every lesson; read it first.

## Fixed format (keep)

* **Frame:** 1080×1920, 30 fps, **60 s** (75 s only when the extra time is action on screen). Remotion + Three.js (`@remotion/three`), rendered `--gl=angle`.
* **The look:** the whole city on a floating square tile with a soil cross-section, a CSS sky gradient behind, low-poly trees and houses, real shadows, a continuous day/night cycle. Render the `look: 'shader'` cut (bloom at night only).
* **Text:** Kanit. The top ~30% of the frame holds the year counter (พ.ศ. + ค.ศ.) and the caption; every caption title fits on one line at 74 px. Keep everything inside the TikTok safe area (`SAFE` in the Overlay).
* **Clip shape:** intro title for 3 s with nothing else on screen → beats → the counter lands on today and holds → finale card. Captions and callouts end 4 s before the end.
* **The story is beats** (`buildStory` in `timeline.ts`): each beat owns its seconds, a year range or a held year, one caption, one verb (`kind`), callouts and camera keys. The year curve is derived from the beats.
* **The hero (`role: 'hero'`):** something large and *moving* on the whole tile from frame 0, which comes back in the payoff (`role: 'callback'`). Korat's walking dinosaurs, a naga uncoiling down a candle, Hanuman lifting the city.
* **Real geography:** every dimension is written in metres first (80 m per unit), and every landmark gets its real lat/lon in `geo.ts`. Directions must match reality (±30°); distances may be compressed. Trace the old town's footprint from the ONEP old-town data when the city has one.
* **Sound:** synthesized in Python (`scripts/synth.py` + `scripts/soundtrack_<city>.py`), cued on beats (`tl.beat("siege")`), mastered to **-16 LUFS**, true peak ≤ -1 dBTP.
* **Delivery:** `out/<city>.mp4` master, `renders/<city>.mp4` shareable copy (<100 MB), and `out/<city>_social.mp4`, one upload file for TikTok, Instagram and Facebook (x264 CRF 21, ~7.5 Mbps, tagged limited-range bt709).

## Not fixed (vary every city)

* **The arc.** Default spine: legend or wilderness → first settlement → founding → a crisis (war, flood, fire, fall) → the railway or a modern turn → growth → today. Follow what the city actually has; a date with nothing to show on screen is a sub line, not a beat.
* **The hero.** Pick from the city's own story: an animal, a creature from its legend, a procession. Large and moving beats standing; never open on a static landmark however big.
* **The landmarks and their silhouettes** (`Landmarks.tsx`). Model the large recognisable form first, the icon second.
* **The moving things** (`actors.ts`): armies, boats, trains, carts, processions. Each beat needs something happening.
* **The palette of the score**: Lanna phin and khong wong, Isan khaen, phin and ponglang, central-Thai pi and ranat, the sea… and the small sounds that make the place: a soft pop per building, hooves, paddles, gulls, bells.
* **The finale**: lanterns, fireworks, krathongs, a candle procession — whatever the city celebrates.

## Pipeline

1. **Brief first.** Copy `docs/city-brief.template.md` to `docs/briefs/<city>.md`. Research the history, check every date with a web search, and mark what is attributed (สันนิษฐานว่า) or disputed. Fill the storyline worksheet (`docs/storyline.md`).
2. **Style frames.** Show the user 2–3 opening frames (hero choices) as stills before building anything.
3. **Footprint and pins.** Convert every real coordinate with `node scripts/geo.mjs <originLat> <originLon> <m/unit> <lat,lon> ...`; write `places.ts` and `geo.ts`.
4. **Beats.** `src/cities/<city>/timeline.ts`: `buildStory({standard: 1, duration, beats})`. Hold a named year through its caption.
5. **Layout, landmarks, actors.** `index.ts` (rivers, rail, roads, `sites`, `openGround`), `Landmarks.tsx`, `actors.ts`. Register the composition in `src/Root.tsx` and add `audio:<city>` / `render:<city>` to `package.json` (copy Korat's lines).
6. **Iterate on stills.** `npx remotion still <Id> out/s.png --frame=N --gl=angle`, then a contact sheet with ffmpeg `hstack`/`vstack`. Moving things: `node scripts/actor_strips.mjs <city>`. Go through the plausibility checklist in `CLAUDE.md`.
7. **Soundtrack.** `npm run audio:<city>`. Effects at or above the music in every action beat, ambience 8–12 dB under, a bridge across every gap between beats.
8. **Check.** `npm run check`: typecheck, river paths, every `check_story` rule (captions, holds, callouts and actors in frame and readable, occlusion, geo bearings, terrain, camera jerk, storyline) and loudness.
9. **Render once, encode.** `npm run render:<city>` → `npm run encode -- <city>` (it fails loudly on flicker, dark nights or bad tagging). Post `out/<city>_social.mp4`, from the web rather than the phone app.

## Sound persona

Warm and regional, never harsh. Pentatonic score in the region's instruments, soft attacks, nothing bright above ~3 kHz in the foreground. The small sounds carry the charm: everything that appears or moves gets its own quiet sound. Same loudness every city (-16 LUFS), with quiet passages kept in the score.

## Commands

```bash
npm install
pip install numpy scipy
npm run studio                   # live preview
npm run check                    # typecheck + every check, for every city
npm run audio:korat              # regenerate public/soundtrack_korat.wav
npm run render:korat             # check_story for the city, then out/korat.mp4
npm run encode -- korat          # renders/korat.mp4 + out/korat_social.mp4, then checks both
```

## Where things live

* `src/engine/`: the reusable diorama (tile, terrain, trees, houses, walls, water, rail, roads, lighting, camera, story builder, occupancy map).
* `src/cities/<city>/`: `timeline.ts` (beats), `index.ts` (layout), `places.ts`, `geo.ts`, `Landmarks.tsx`, `actors.ts`.
* `src/Overlay.tsx`: year counter, captions, callouts, intro and finale.
* `scripts/`: `synth.py` and the soundtracks, `check_*.mjs`, `encode.mjs`, `geo.mjs`, `actor_strips.mjs`.
* `docs/`: `storyline.md` (the standard), `grandeur.md`, `city-brief.template.md`, `briefs/`.
