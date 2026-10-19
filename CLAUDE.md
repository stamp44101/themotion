# themotion — city history timelapse videos

Vertical (1080×1920, 30 fps, 60 s) motion videos of Thai city histories, built with Remotion.
Thai text uses Kanit. Everything is code-generated; the soundtrack is synthesized in Python.

> **Working alongside other agents?** Read [AGENTS.md](AGENTS.md) first — branch
> rules, the one-agent-in-the-engine rule, and the review gate. This file is the
> engineering guide; that one is the collaboration protocol.

## Ground rules
- Never use a paid service (Higgsfield/HF, Comfy, any credit-based generator) without an explicit
  "yes" from the user for that spend. Choosing a style is not consent to spend credits.
- History content gets posted publicly: verify dates with a web search before writing captions,
  and tell the user which facts are approximate or disputed.
- **The province series is code, not generation (owner's rule).** Picture and sound are both
  made by code: the score and SFX come from `scripts/synth.py`. Do not add generated audio
  (ElevenLabs SFX, music or voice) to a province clip. `synth.sample()` and `public/sfx/` exist for
  other series. Khon Kaen's ElevenLabs test set was tried and taken out (prompts in commit 6377944).

## Workflow that works (do it in this order)
1. Agree the visual style first (show 2–3 quick style frames) before building anything.
2. Write the story beats + year curve + captions (`src/cities/<city>/timeline.ts`).
3. Lay out the diorama (`src/cities/<city>/layout.ts`) and city-specific landmarks (`Landmarks.tsx`).
4. Check composition with a contact sheet of 8–12 stills (`npx remotion still … --frame=N`, then
   `ffmpeg … hstack/vstack`) — iterate on stills, never on full renders.
5. Export the timeline and synthesize the soundtrack so audio is synced to the year curve.
6. `npm run check`, then full render once (`npm run render:<city>`), then `npm run encode -- <city>`
   for the repo copy (<100 MB) and the upload copy; it fails loudly on flicker, dark nights or bad
   tagging. A chat preview (<30 MB) is extra and is not an upload file.

## Environment notes (cloud container)
- Browser: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
- 3D (Three.js via @remotion/three) needs `--gl=angle`; it renders in software: ~35 min for 1800 frames
  at concurrency 4. 2D SVG versions render in ~3–7 min.
- Python audio needs `pip install numpy scipy`.
- Never render test stills while a full render runs: they steal CPU (Korat took ~55 min instead of ~35).
- `--scale=0.5` drafts are NOT much faster for 3D (bottleneck is shadows + draw calls, ~38 frames/min either
  way); review with still contact sheets instead, then render full-res once. Shadow map 2048 is enough.
- Never `pkill -f` with a pattern that also appears in your own command line; kill by PID.
- A GPU machine (`npm run render:<city>` locally) renders the 3D versions many times faster.
  Measured on a Windows RTX 4070 (ANGLE -> D3D11, not SwiftShader): **1 m 15 s for 1800 frames**,
  ~28x faster than the container figure above. Iterating on full renders is fine there.
- `scripts/export_timeline.mjs` needs `pathToFileURL()` for the dynamic import — a bare Windows
  absolute path ('G:\...') is not a valid ESM specifier.

## Three.js gotcha
- Fire/glow FX built from `meshStandardMaterial` + `emissive` get washed out by ACES tone mapping in
  daylight — they render, but pale enough to look like they are missing. Use `meshBasicMaterial`
  with `toneMapped={false}` for anything that must read as self-lit.
- Put landmark interiors (a Buddha image inside a viharn) *outside* the building, or the drone dive
  only ever sees roof.

## Look & feel lessons
- **Bloom can black out a whole frame.** With `look: 'shader'`, Nakhon Si's first frames came
  out black: under a low dawn sun the sea threw a highlight past half-float range, and the bloom
  chain spread the Inf into NaN across the frame even at intensity 0. `Look.tsx` now mounts
  Bloom only at night. Check a shader-look city's dawn and wide shots on stills, not only noon.
  **A mesh mounted at scale 0 does the same.** Phetchaburi's shader cut went black for 1.4 s
  at dusk: Phra That Chom Phet was mounted at the start of its build with a y-scale of exactly
  0, a singular normal matrix gave NaN shading on a few pixels, and bloom spread them over the
  frame (the plain cut shows nothing). Gate every growing mesh on its own scale (`> 0.02`),
  not on the beat or year that drives it. Bisect on one still: a still is a fresh page, so a
  black still means per-frame overflow, not page reuse.
- **Model a named landmark's silhouette before its icon.** Chonburi's first
  Khao Sam Muk shot put a small red shrine on a round green mound; the label was
  correct, but the place was not recognisable. The useful identity was the long
  wooded promontory, pale sea-facing cliff and road curling around its foot.
  Block those large forms first, then add the shrine and other detail.
- **An exact-date beat needs a hold in the year curve.** Chonburi's liberation
  caption said พ.ศ. 2310 while the counter had already advanced to พ.ศ. 2326,
  and the fleet—whose visibility was driven by year—had begun to disappear.
  Hold the named year through the shot, then accelerate across the gap between
  captions. Check the counter, caption, landmark and soundtrack together.
  `check_story.mjs` fails a caption whose พ.ศ. year is on the counter for under 1 s.
  Holding a year moves everything driven by the year: Korat's Thung Samrit armies finished
  before their caption came up once the 1826 hold was added, and the callout pointed at empty
  forest. After retiming the curve, re-check every year-driven animation against its caption's
  seconds on stills. The counter rounds, so a hold on พ.ศ. X must stay below X + 0.5.
- **Coastal ambience is a sequence of places, not one surf loop.** Chonburi
  became specific only after the continuous noise bed was kept quiet and
  irregular waves, pier timber, paddles and sail, Ang Sila rock wash, buffalo
  hooves, Bang Saen beach murmur and a distant modern boat horn were attached
  to their matching beats. Keep ambience 8–12 dB under the score and avoid
  evenly spaced repetitions.
- **A railway bridges every river it crosses.** The engine (`RailBridges` in
  `Diorama.tsx`) now puts a girder bridge where the rail meets a river, found
  automatically from the layout; Nakhon Sawan's train used to run across the Nan on
  bare water. A rail *parallel* to a river must stay out of its bed -- a bridge
  cannot fix that, and `check_story.mjs` errors on it.
- **Trace curved rivers as centrelines, not stacked straight bands.** A river may
  use `path: [[x, z], ...]` (and optional `closed`) instead of `axis`/`pos`;
  `width` is still in world units. For a path river, a bridge's `at` is distance
  in world units from `path[0]`. Water, boats, wall gaps, dry-land placement,
  roads/cars and rail bridges all use the same centreline geometry in
  `src/engine/river.ts`; `npm run check` exercises both path and legacy rivers.
- **Every road bridges the water it crosses; cars drive only on built roads.** The engine's
  ring road is a rectangle around the tile centre, and Nakhon Sawan's centre is the confluence:
  three sides lay on the river, the road sank under the water at each bank and the cars drove
  across. `RoadBridges` now puts a concrete bridge wherever the ring road or a listed road
  crosses a river that no `bridges` entry already spans, and `Cars` runs on the ring and on
  every built road instead of a fixed loop.
  An explicit `bridges` entry only carries a road whose deck it actually overlaps: the ring
  crossed the Chao Phraya 3.4 units from the Dechatiwong bridge, an older tolerance counted
  that as spanned, and the cars drove on bare water again. Cars now ride only on a deck
  (`carAt()` in `src/engine/roads.ts`), and `check_story.mjs` simulates every car over the
  whole clip and fails any that is on open water.
- **People, stalls and animals stay on land; stations stand beside the track.** Nakhon
  Sawan's riverfront crowds walked on the Ping, its station sat on the rail line so every
  train drove through it, and village houses could land on the track. The engine now drops
  or shortens any walker, stall, buffalo or elephant that would touch a river (`wet()` in
  `Life.tsx`), moves a station that is within 2.2 of the line to 2.6 off it and clears the
  trees there (`stationPos()` in `world.ts`), and keeps villages off the rail.
- **A wall never runs across open water.** Where a river crosses the wall line the
  engine now opens a gap and stands a water gate there (piers + lintel) — boats
  had to pass. `subtractBands()` in `poly.ts` splits each wall edge around the
  river footprint, while `subtractPathRivers()` does the same for curved
  channels, and the merlons skip the gap too. Only bites on cities whose
  river actually crosses the walls, so the rectangle cities are unaffected.
- **Real city footprints are not rectangles.** `city.outline` takes a polygon in
  world units; walls, moat, city ground and the in-city house grid all follow it,
  and `hx`/`hz` stay as the bounding half-extents. Cities without `outline` keep
  the original rectangle code path untouched. Trace the shape off the ONEP
  "ขอบเขตพื้นที่เมืองเก่า" PDF for that province — it is georeferenced to a UTM
  grid, so vertices convert straight to metres and then to units at 80 m/unit.
- Changing the footprint invalidates the camera keys: a long thin city needs
  roughly 1.3-1.45x the distance of a square one, and a few degrees more
  elevation on the wide shots.
- **A still is not proof that a moving thing shows in the render.** Every `remotion still`
  starts on a fresh page; a render reuses one page across frames. three.js caches an
  InstancedMesh's bounding sphere the first time it is culled, so Korat's armies, first seen in
  the town, were culled once they marched to Thung Samrit: the stills showed them, the render
  showed only their shadows. `updateInstances()` now recomputes the sphere each frame.
  **Moving things are actors** (`src/engine/actors.ts`): a city lists them in `actors`
  (`src/cities/<city>/actors.ts`, pure position math that `Landmarks.tsx` also draws from;
  the engine adds every train). `check_story.mjs` projects each actor through the camera for
  every frame of its beat and fails one that is out of frame too long (80% in frame; a train
  that crosses the tile 15%), hidden behind trees, or that pops out and back in. It found
  Nakhon Si's relic boat lasting 0.8 s after the beats conversion. To see what the render
  sees, `node scripts/actor_strips.mjs <city> [actor]` renders 1.5 s around each actor's
  beat with `--sequence --concurrency=1` into `shots/<city>/actor_<id>.png`.
  **In frame is not the same as readable.** `projectAt()` also returns `scale`, video px per
  world unit at the actor's depth; an actor needs `scale x size` >= 80 px for 0.4 s of its
  beat or `check_story` fails it (size = its half-size in units, so set it honestly: Lampang's
  hero carriage is drawn 8x and reads from the whole-tile shot at 26 px/unit). Calibrated on Korat: the 1901 train that reads sits at 78, the
  armies at 51-62, the procession at 88; the modern train crossing the finale's wide shot
  ran at 26 (a 10 px line over dense blocks) and was cut. Bring the camera in or cut the
  actor; a thing nobody can see is not a beat.
- When A/B-ing an engine change, compare **still vs still**. A still against a
  frame pulled from an encoded render differs everywhere from compression alone
  and tells you nothing.
- A capital destroyed without a documented wall restoration must not keep an
  intact crenellated enclosure in modern shots; set `city.ruinStrength` high
  enough that walls and gatehouses read as archaeological ruins (Ayutthaya v2).
- **Nothing goes on open water.** The in-city house grid in `src/engine/world.ts`
  had no `inRiver()` check (trees, buildings and villages all had one). It never
  showed because Korat/Ayutthaya/Sukhothai keep their rivers outside the walls;
  Phitsanulok is the first city with a river running *through* the walled area.
  Fixed in the engine. When adding a city, audit every hand-placed coordinate
  (gates, landmark sub-parts, roads, `life` groups) against the river band —
  `|x - pos| < width/2 + 0.8` — not just the generated ones. Bridges, boats and
  houseboats are the only things that belong over water.
- The 3D "isometric diorama" look = the whole city on a floating square tile with a soil cross-section,
  sky gradient behind (CSS), camera always aimed at the city; mountains only as a backdrop at the tile edge.
- Keep the top ~30% of the frame for the year counter + caption (camera uses a view offset).
- TikTok safe area (video px): tall phones crop ~100 px per side; search bar covers y<215; captions/username
  cover y>1480; action buttons cover x>860 below y≈900. Overlay `SAFE` enforces this — keep text/labels inside.
- Remove clouds near the camera path; they clutter. Boost night ambient/moon light in 3D (ACES darkens).
- Film grain balloons file size (110 MB); re-encode with x264 CRF 21–25 + maxrate.
- **Nothing goes on screen during the intro title.** First caption and first callout at
  `t0 >= INTRO_END` (3 s); last ones gone `FINALE_LEAD` (4 s) before the end. Chachoengsao shipped
  with its first caption at 2 s, stacked on the title. `scripts/check_story.mjs` enforces it.
- **A caption title is one line.** At 74 px the column is 820 px wide; anything wider wraps and
  drops its last word, usually the year, onto a line of its own. `check_story.mjs` measures titles
  with Kanit's real advance widths (`scripts/textwidth.mjs`, identical to Chrome's layout) and fails
  a title that wraps. Shorten it, or put the year in the sub.
- **The camera has to travel, not just zoom.** Nakhon Sawan's first cut dived into a landmark,
  pulled out, dived into the next one a few hundred metres away, and never showed the whole city
  between 7 s and 56 s: 75% zoom, 5% orbit. What reads well (Korat): wide establishing shots
  that come back mid-story so the city visibly grows; nearby landmarks linked by an orbit or a
  glide at constant distance; a tracking shot that follows something moving (a train, a raft);
  a 1-1.5 s hold as each caption lands; the azimuth swinging around the city over the clip.
  `check_story.mjs` enforces the floors (`scripts/camera_stats.mjs`).
- **Low cameras look through forest.** Nakhon Sawan's shrine shot sat at 20 degrees elevation,
  36 units out, looking across the wooded old town: the owner saw only trees. Raising it to 34
  degrees (same azimuth and distance) showed the shrine, the crowd and the market. Below ~30
  degrees, aim the line of sight across water or open ground. `check_story.mjs` traces the
  camera-to-callout line past every standing tree (`scripts/occlusion.mjs`) and fails a
  building or monument hidden more than half its callout time; ground features (moat, road,
  hillside) are exempt, so check those on the contact sheet.
- **A callout's anchor stays in frame while the callout is up.** The Overlay keeps the label
  inside the safe area but draws the dot where the point projects, so a point off screen
  leaves a label floating over unrelated ground with its leader line running off the edge.
  Korat's ทุ่งสัมฤทธิ์ callout outlived the camera's pan by 0.2 s, and four more were off frame
  for most of their time (กองบิน 1 the whole time). `check_story.mjs` projects every callout
  through the camera and fails one whose anchor is out of frame more than 10% of its time
  (posted reels only warn). Fix it by ending the callout earlier, holding the camera, or
  moving the anchor to a part of the feature that is on screen (a river or road is long).
- **Towers wait for their era.** Korat stood a 10-storey block beside the 1934 monument in
  1940 because tower cells are built tall from the day they appear. Set `layout.highRise` to
  the year the city's high-rises began; buildings stay low-rise until then and their extra
  storeys go up over the following 12 years.
- **Everything placed goes through one occupancy map** (`src/engine/occupancy.ts`). Every
  generator used to carry its own partial keep-out (`inRiver`, `onRoad`, `onSite`, `wet()`...)
  and each missed something: houses on a chedi (Korat, Nakhon Si), the in-city grid on the
  river (Phitsanulok), blocks over the kerb and towers through trees (Nakhon Si 14/42, Korat
  4/151), and, found only by the audit, blocks on the rail (Ayutthaya, 120 cells) and on the
  station (Phitsanulok, Nakhon Si). Now water, `sites`, `openGround`, `footprints`, every
  road (ring road included), the rail and the station are claimed first; trees, blocks,
  houses and huts *claim their whole footprint* after them, in that order. A higher claim
  evicts a lower one from the year it arrives (a block fells the trees under it; a ring road
  laid through a block or an old-town house razes it: `gone` / `razed`), a lower claim
  landing on a higher one is refused. `check_story.mjs` runs `auditWorld()`, which records
  the finished layout with no rules and reports every forbidden pair; it is engine-agnostic,
  and `node scripts/audit_engine.mjs <commit>` proves it still catches an older engine's
  mistakes. Keep giving every landmark `[x, z, radius]` in `layout.sites` (the check for a
  landmark with none stays), and give hand-placed parts with their own years
  `layout.footprints`. Compare engine changes with `node scripts/ab_stills.mjs before|after|sheet`.
- **A train that pulls in to a terminus parks** (`trains[].park`, seconds) instead of
  vanishing the moment its run ends.
- **A line that is lifted or replaced closes** (`rail.close`, a year): Khon Kaen's at-grade
  track went up on a viaduct in 2019 and would otherwise have stayed under it. Rails, sleepers
  and rail bridges go; the corridor and station stay claimed. `check_story.mjs` fails a train
  that still runs after the close.
- **Modern sprawl builds over anything not marked open.** Korat's Wing 1 runway disappeared
  under towers once the city reached it. Put airfields, parks and plazas in
  `layout.openGround`; tree `clearings` do not keep buildings out.
- **Built things sit on the ground; the ground is level where a town stands.** Roads, the
  rail, sleepers, the station, trains, cars, village huts and modern blocks were all drawn at
  y = 0 while a peak was a gaussian whose tail ran across the plain: Nakhon Si's train ran
  buried, Sukhothai had a village 5 units deep in a hill, Nakhon Sawan's gate 2.5 deep in Khao
  Kob, Korat's Mittraphap 14 up a hillside. Now (`world.ts` `terrainH`) a peak fades to exactly
  0 between 1.2 r and 1.7 r, the ground inside the moat ring is cut level and rises back over
  4 units, and everything listed above follows `terrainH` (`Strip` in `Diorama.tsx` lays a road
  or rail in pieces that each sit on the slope). `check_story.mjs` fails a hill under the
  walled town or a gate, a railway over 1.5 of hill, and a road steeper than 35 degrees: route
  the road round the hill or move the peak (Korat's Khao Yai hills moved east of the
  highway's entry). Chonburi's ring road legitimately climbs Khao Sam Muk's foot now.
- **Landmarks sit on the terrain, not at y = 0.** Nakhon Sawan's San Khu redoubt was placed at
  y = 0 where the Khao Kob foothill is 2.25 high: the whole model was buried and its callout
  pointed at grass. `Landmarks` receives `terrainH` in its props; use `terrainH(x, z)` for the
  y of anything near a peak, and lift the callout point with it. `check_story.mjs` fails a
  callout more than 0.5 below the ground and warns for every exported landmark position where
  the terrain is above 0.5.
- **Directions come from real coordinates.** Chonburi put the Gulf east of the town; it is
  west, and a viewer from the city noticed at once. Every city and landmark reel has a
  `geo.ts` next to its `index.ts`: each landmark's real lat/lon (copy it from Google Maps)
  and where the model puts it, plus one point on the water. `check_story.mjs` compares the
  compass bearing of every pair in reality and in the model and fails anything more than
  30 degrees off -- distances may be compressed, directions may not. Place things with
  `node scripts/geo.mjs <originLat> <originLon> <m/unit> <lat,lon> ...` instead of by eye.
  No on-screen compass: the owner tried one and found it heavy-handed; get it right instead.
  A place tens of km out (Korat's Phimai, 50 km NE) is marked `far: true` and checked only
  against the `centre: true` point and other far places; its distance is compressed far more
  than the town's, so its bearing to a nearby landmark means nothing.
  Roads count too: Korat's Mittraphap Highway was drawn straight through the Thao Suranari
  Monument at Chumphon Gate, and a viewer from Korat pointed out it passes well west of the
  old town and the station. Route a named road by where it really runs, not to the nearest
  landmark.
- **Grandeur is scale contrast.** Chiang Mai reads grand because thousands of small things
  (trees, houses, lit windows) sit under one big thing (Doi Suthep, the moated square, a modern
  city on 46% of the tile). Nakhon Sawan ended on 4 buildings and 3-high hills and read as a
  toy garden. Grow the modern city to its real extent, use real mountains at real height, and
  keep wide shots at >= 30 degrees. Full guide and measurements: `docs/grandeur.md`;
  `check_story.mjs` fails a clip that ends on nothing big.
- **Every beat needs something happening on screen, not just a caption.** Nakhon Si's first
  cut was a list of dates over a forest with one small chedi (inscription no. 23, Song records,
  an Ayutthaya province, Chandrabhanu): the owner found it boring. v2 kept only beats with an
  event to show -- the relic boat coming ashore, junks in the Gulf, walls rising, two armies at
  the north gate, a train, a mudslide, the แห่ผ้าขึ้นธาตุ procession wrapping the chedi --
  and folded the text-only facts into the sub lines. Plan the story as a list of on-screen
  events first; a date with nothing to show is a sub line, not a beat.
- **60 s by default, 75 s when it pays (owner's rule).** Go to 75 s only if the extra time goes
  to beats with action on screen (a siege, a procession, a tracking shot), never to longer
  holds or more text. Set `duration` in the story, register the composition with
  `(CITY.story.duration ?? SECONDS) * FPS`, export `DURATION` from timeline.ts for the
  soundtrack, and call `synth.init(...)` in the soundtrack script.
- **Beats own their seconds; the year curve is derived** (`src/engine/story.ts`). The curve
  used to be a hand-tuned key list and every animation ran on the year, so any retime
  silently changed animation speed: Korat's armies finished before their caption, Nakhon
  Si's siege army stood still for 2 s because a two-key hold eases in, and 60 -> 75 s needed a
  hand-written WARP table applied to five things at once. Now `timeline.ts` declares
  `buildStory({duration, beats})`: each beat has `t: [s0, s1]`, `year: [y0, y1]` or
  `{hold: Y}` (runs Y .. Y+0.45 so the counter never rounds up), and its caption, era,
  callouts and camera keys. The year runs *linearly* inside a beat and a monotone cubic
  carries the gaps. `index.ts` takes `STORY.captions/eras/callouts/cameraKeys/yearAt/beat`.
  Landmarks get `beat(id)` (0 -> 1 across the beat's seconds): drive **motion** with it
  (armies, boats, processions) and keep **visibility** on the year ("built in 1914").
  `export_timeline` writes the beats and the soundtrack script cues on `tl.beat("siege")`
  instead of hard-coded seconds. Two captions in one stretch are two beats (Korat's
  `anouvong` / `yamo`). Posted cities before Korat keep their key lists; the builder
  throws on overlapping beats, a year running backwards, or a duplicate camera second.
- **A forest-only opening reads dark and green.** Nakhon Si's legend-era beats (forest and one
  small white chedi) measured ~30 luma under Korat's and 86% green-dominant pixels; its darkest
  frame was 35.8 against `check_render`'s floor of 35. Open the ground where the story allows
  (a sand ridge, early paddies), give the plain a sandier `sky.ground`, and use `c.ambient(Y)`
  (extra sky fill, ramped slowly by year) rather than a per-shot light. Measure mean luma on
  the early stills, not only by eye.
- **Light must never snap.** The day/night cycle in `lighting()` is continuous (no reset after the
  intro) and nights only dim to ~half. Do not add per-city light that jumps; `check_render.mjs`
  fails anything over 8 luma levels per frame or darker than 35 before the finale.
- Use a fast/slow year curve (monotone cubic) so key events get screen time; drive every visual and
  sound from the year, not from seconds.

## Starting a new city — do it in this order

Learned the hard way on Phitsanulok, where doing it out of order cost three full
re-renders and a re-tune of all 31 camera keys.

1. **Trace the real footprint FIRST, before placing anything.** Download
   `nced.onep.go.th/opendata/.../oldtown36_announce/<province>.pdf` ("โครงการ
   กำหนดขอบเขตพื้นที่เมืองเก่า"). Its boundary map is georeferenced to a UTM
   grid: read the vertices off the grid, convert to metres, divide by 80 for
   world units. Render the map page with PyMuPDF at ~2.4x to read it.
2. **Write every real dimension in metres first, then convert.** River widths,
   wall extents, distances between landmarks. Guessing in "units" is how the Nan
   ended up 350 m wide inside a 1,136 m city.
3. **Verify the dates** (the repo rule) and note which are attributed vs
   documented. Say so in the caption when a date is `สันนิษฐานว่า`.
4. Story beats + year curve + captions → `timeline.ts`.
5. Layout + landmarks, then **audit every hand-placed coordinate** against the
   rivers and the city polygon — including each object's footprint radius, not
   just its centre point. The engine only protects what it generates.
6. Camera keys last, scaled to the footprint (see the note above).
7. Export the timeline, synthesise the soundtrack, render once, contact-sheet it.

### Physical plausibility checklist
Run through this before calling a city done. Every item is something that
shipped broken at least once:
- nothing built on open water except bridges, boats and houseboats
- the wall opens where a river crosses it, with a water gate
- city gates are not standing in the channel
- landmark sub-parts do not intersect each other (viharn clipping its own prang)
- a Buddha image or anything else meant to be seen is not inside a closed building
- roads do not run along a riverbed
- crowds and market stalls are on land
- hills only where the province actually has them
- every callout points at something you can actually see in that frame
- nothing appears before it was built or stays after it was gone: give each landmark part its own
  years (Nakhon Sawan's 1785 San Khu watchtower stood from 1357 to 2026, in front of later shots)

## Model / token budget
A whole city in one high-end session is expensive and mostly mechanical. Split it:
- **Execution on a cheaper model** (Sonnet): scaffolding the city folder, writing
  timeline/caption data from an agreed outline, placing landmarks to given
  coordinates, running renders and encodes, building contact sheets.
- **Keep on the stronger model**: reading the ONEP map and deriving the outline,
  judging historical sources and what is disputed, composition and camera work,
  and reviewing contact sheets against the plausibility checklist above.
Hand over a written spec (outline coordinates, metre dimensions, beat list) so
the execution pass does not have to re-derive any of it.

## Delivering a file for upload (TikTok / Reels)

Remotion's own output is high bitrate (~20 Mbps) but **mis-tagged**: it comes out
`yuvj420p`, `color_range=pc`, `color_space=bt470bg` — full range with a PAL
matrix. Players and platform encoders assume limited-range bt709, so the upload
can come back with shifted contrast and colour. This applies to every render in
`renders/`, not just one city.

Convert and tag explicitly for the upload copy:

```bash
ffmpeg -i out/<city>.mp4   -vf "scale=in_range=full:out_range=limited,format=yuv420p"   -c:v libx264 -preset slow -crf 17 -maxrate 20M -bufsize 40M   -profile:v high -level 4.2 -pix_fmt yuv420p   -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709   -x264-params "keyint=60:min-keyint=30:colorprim=bt709:transfer=bt709:colormatrix=bt709:range=tv"   -movflags +faststart -c:a aac -b:a 320k -ar 48000 out/<city>_tiktok.mp4
```

~17 Mbps, ~155 MB for 75 s. TikTok re-encodes everything to a few Mbps anyway,
so the only thing that matters is giving its encoder a clean, high-bitrate,
correctly-tagged source. Upload from the web rather than the phone app, which
compresses before it ever reaches them.

Keep the copies straight: `out/<city>.mp4` is the master,
`renders/<city>.mp4` is the shareable copy (<100 MB), `out/<city>_tiktok.mp4`
is the TikTok upload, `out/<city>_ig.mp4` is the Instagram and Facebook upload,
and the chat preview is heavily squeezed (~1.8 Mbps) and is **not** an upload
file. `scripts/encode.mjs` builds all of them from the master in one pass.

**Instagram needs its own file; the TikTok one will not post.** TikTok takes a
heavy source and re-encodes it, so ~17 Mbps costs nothing there. Instagram
expects around 5 Mbps for a reel, and a file several times that gets stuck on
"processing" and is then dropped without an error. The IG copy is the same
picture, colour tags and frame rate at ~7.5 Mbps, `high@4.0`, AAC 192k.

## Where the videos live

`renders/` is **gitignored**. Video does not compress and git keeps every
version forever, so committing a 60 MB clip on each re-render only ever adds:
the history had reached 1.25 GB of mp4 across 34 blobs, four of them the same
city. The finished clips live on the rolling GitHub release instead:

```bash
gh release upload renders renders/<name>.mp4 --clobber
```

https://github.com/stamp44101/themotion/releases/tag/renders — one asset per
city or landmark, replaced in place, outside the repo's size. What stays in git
is the small stuff that explains a render: the contact sheet, the brief, the
soundtrack wav the render needs to run.

## Layout
- `src/engine/` — reusable diorama engine (terrain tile, trees, houses, buildings, walls/moat/gates,
  water, rail/trains, roads/cars, lighting, camera, composition).
- `src/cities/<city>/` — per-city data + landmarks. New city = new folder + register in `src/Root.tsx`.
- `src/landmarks/<name>/` — single-landmark reels (35 s, 2 m/unit), e.g. Wat Rai Khing. Own scene and
  camera; `check_story.mjs` runs the story checks on them (captions, titles, year holds, brief),
  not the city-layout ones.
- `src/Overlay.tsx` — year counter, captions, callouts, timeline bar, intro/finale, grain/vignette.
- `scripts/synth.py` — shared instruments; `scripts/soundtrack_<city>.py` — per-city score + SFX.
- Legacy Chiang Mai versions: `src/Scene.tsx` (2D) and `src/iso/` (first 3D build).
