# themotion — city history timelapse videos

Vertical (1080×1920, 30 fps, 60 s) motion videos of Thai city histories, built with Remotion.
Thai text uses Kanit. Everything is code-generated; the soundtrack is synthesized in Python.

## Ground rules
- Never use a paid service (Higgsfield/HF, Comfy, any credit-based generator) without an explicit
  "yes" from the user for that spend. Choosing a style is not consent to spend credits.
- History content gets posted publicly: verify dates with a web search before writing captions,
  and tell the user which facts are approximate or disputed.

## Workflow that works (do it in this order)
1. Agree the visual style first (show 2–3 quick style frames) before building anything.
2. Write the story beats + year curve + captions (`src/cities/<city>/timeline.ts`).
3. Lay out the diorama (`src/cities/<city>/layout.ts`) and city-specific landmarks (`Landmarks.tsx`).
4. Check composition with a contact sheet of 8–12 stills (`npx remotion still … --frame=N`, then
   `ffmpeg … hstack/vstack`) — iterate on stills, never on full renders.
5. Export the timeline and synthesize the soundtrack so audio is synced to the year curve.
6. Full render once; then encode two copies: repo copy (<100 MB) and a chat preview (<30 MB).

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
- **A wall never runs across open water.** Where a river crosses the wall line the
  engine now opens a gap and stands a water gate there (piers + lintel) — boats
  had to pass. `subtractBands()` in `poly.ts` splits each wall edge around the
  river footprint, and the merlons skip the gap too. Only bites on cities whose
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
- When A/B-ing an engine change, compare **still vs still**. A still against a
  frame pulled from an encoded render differs everywhere from compression alone
  and tells you nothing.
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

## Layout
- `src/engine/` — reusable diorama engine (terrain tile, trees, houses, buildings, walls/moat/gates,
  water, rail/trains, roads/cars, lighting, camera, composition).
- `src/cities/<city>/` — per-city data + landmarks. New city = new folder + register in `src/Root.tsx`.
- `src/Overlay.tsx` — year counter, captions, callouts, timeline bar, intro/finale, grain/vignette.
- `scripts/synth.py` — shared instruments; `scripts/soundtrack_<city>.py` — per-city score + SFX.
- Legacy Chiang Mai versions: `src/Scene.tsx` (2D) and `src/iso/` (first 3D build).
