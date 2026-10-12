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

## Look & feel lessons
- The 3D "isometric diorama" look = the whole city on a floating square tile with a soil cross-section,
  sky gradient behind (CSS), camera always aimed at the city; mountains only as a backdrop at the tile edge.
- Keep the top ~30% of the frame for the year counter + caption (camera uses a view offset).
- Remove clouds near the camera path; they clutter. Boost night ambient/moon light in 3D (ACES darkens).
- Film grain balloons file size (110 MB); re-encode with x264 CRF 21–25 + maxrate.
- Use a fast/slow year curve (monotone cubic) so key events get screen time; drive every visual and
  sound from the year, not from seconds.

## Layout
- `src/engine/` — reusable diorama engine (terrain tile, trees, houses, buildings, walls/moat/gates,
  water, rail/trains, roads/cars, lighting, camera, composition).
- `src/cities/<city>/` — per-city data + landmarks. New city = new folder + register in `src/Root.tsx`.
- `src/Overlay.tsx` — year counter, captions, callouts, timeline bar, intro/finale, grain/vignette.
- `scripts/synth.py` — shared instruments; `scripts/soundtrack_<city>.py` — per-city score + SFX.
- Legacy Chiang Mai versions: `src/Scene.tsx` (2D) and `src/iso/` (first 3D build).
