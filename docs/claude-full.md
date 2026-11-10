# themotion — the full engineering guide

> The **full** version. `CLAUDE.md` at the repo root is the slim one loaded into every session; read
> the section you need here when a slim line is not enough. Keep both in step: a new lesson goes
> here in full and gets one line in `CLAUDE.md`.

Vertical (1080×1920, 30 fps, 60 s) motion videos of Thai city histories, built with Remotion.
Thai text uses Kanit. Everything is code-generated; the soundtrack is synthesized in Python.

> **Working alongside other agents?** Read [AGENTS.md](../AGENTS.md) first — branch
> rules, the one-agent-in-the-engine rule, and the review gate. This file is the
> engineering guide; that one is the collaboration protocol.

## Ground rules
- Never use a paid service (Higgsfield/HF, Comfy, any credit-based generator) without an explicit
  "yes" from the user for that spend. Choosing a style is not consent to spend credits.
- History content gets posted publicly: verify dates with a web search before writing captions,
  and tell the user which facts are approximate or disputed.
- **The province series is code, not generation (owner's rule).** Picture and sound are both
  made by code: the score and SFX come from `scripts/synth.py`. Do not add generated audio
  (ElevenLabs SFX, music or voice) to a province clip. `synth.sample()` (it reads `public/sfx/<name>`, which is
  not in the repo) exists for other series. Khon Kaen's ElevenLabs test set was tried and taken out (prompts in commit 6377944).

- **Fix what you flag (owner, 10 Nov 2569).** Yasothon v1's stills went to the owner with an "ยังต้องปรับ" list
  (the town still forest at 10-11 s, the stupa in front of the launch tower at 46 s) and a question whether to pass them.
  The owner: asking whether a known flaw should be fixed is pointless. Any defect you can name, fix before you show the
  work; the owner reviews what is left after your own fixes. If something truly cannot be fixed in the city (an engine-wide
  look, a fact nobody can pin), say so once as a fact with the reason, not as a question.

## Workflow that works (do it in this order)
1. Agree the visual style first (show 2–3 quick style frames) before building anything.
2. Write the story beats (`buildStory`: seconds, years, captions, callouts, camera keys) in
   `src/cities/<city>/timeline.ts` to the storyline
   standard, `docs/storyline.md`: fill its worksheet in the brief first.
3. Lay out the diorama (`layout` in `src/cities/<city>/index.ts`, real positions in `places.ts`),
   city-specific landmarks (`Landmarks.tsx`) and the moving things (`actors.ts`).
4. Check composition with a contact sheet of 8–12 stills (`npx remotion still … --frame=N`, then
   `ffmpeg … hstack/vstack`) — iterate on stills, never on full renders.
5. Export the timeline and synthesize the soundtrack, cueing sounds on the beats (`tl.beat(...)`).
6. `npm run check`, then full render once (`npm run render:<city>`), then `npm run encode -- <city>`
   for the repo copy (<100 MB) and the upload copy; it fails loudly on flicker, dark nights or bad
   tagging. A chat preview (<30 MB) is extra and is not an upload file.

## Environment notes (cloud container)
- Browser: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
- 3D (Three.js via @remotion/three) needs `--gl=angle`; it renders in software: ~35-50 min for 1800
  frames at concurrency 4 (~38 frames/min; `docs/render-locally.md` says 40-60 min). 2D SVG versions render in ~3–7 min.
- Python audio needs `pip install numpy scipy`.
- Never render test stills while a full render runs: they steal CPU (Korat took ~55 min instead of ~35).
- `--scale=0.5` drafts are NOT much faster for 3D (bottleneck is shadows + draw calls, ~38 frames/min either
  way); review with still contact sheets instead, then render full-res once. Shadow map 2048 is enough (the engine uses
  4096 only for the shader look).
- Never `pkill -f` with a pattern that also appears in your own command line; kill by PID.
- A GPU machine (`npm run render:<city>` locally) renders the 3D versions many times faster.
  Measured on a Windows RTX 4070 (ANGLE -> D3D11, not SwiftShader): **1 m 15 s for 1800 frames**,
  ~30-40x faster than the container figure above. Iterating on full renders is fine there.
- `scripts/export_timeline.mjs` needs `pathToFileURL()` for the dynamic import — a bare Windows
  absolute path ('G:\...') is not a valid ESM specifier.

## Three.js gotcha
- Fire/glow FX built from `meshStandardMaterial` + `emissive` get washed out by ACES tone mapping in
  daylight — they render, but pale enough to look like they are missing. Use `meshBasicMaterial`
  with `toneMapped={false}` for anything that must read as self-lit.
- Put landmark interiors (a Buddha image inside a viharn) *outside* the building, or the drone dive
  only ever sees roof.

## Look & feel lessons

- **A thing that rises declares `tall`; its top stays under the text band.** Yasothon v1b's rocket (and the second rocket
  at 49-54 s) ran through the caption and the counter (found by [local] on the encode, 10 Nov). Stills at whole seconds
  missed it. An actor that rises (a rocket, a tower, a giant) sets `tall` (the height of its top above `at`), and
  `check_story` fails it if that top is in the top 37% (a two-line subtitle reaches that far) for more than 0.3 s while
  the text is up. v1c still put the payoff's cloud on the caption and the tower's poles across the subtitle (found by [local]
  on v1c stills), so clouds and the tower are actors with `tall` too. Yasothon's fix: the camera
  rides up with the rocket at 200 out (target 10 under the nose), the rocket disappears into a thin rain-cloud layer at
  fly 32, the cloud fades as the camera comes down, and the payoff rocket rises from its foot on the tower instead of
  coming down out of the sky.
- **A boat keeps the river's scale and stops in the channel.** Yasothon v1b's trade boats were drawn x1.8 to pass the
  80-px rule: a 360 m hull, longer than the row of houses, lying across the 180 m Chi and running onto the bank at the landing.
  Draw the boat at the river's scale (x0.9) and bring the camera in instead (30-40 out). End its path mid-channel, not on a
  landing point on the bank.
- **A tall frame never stands in front of a landmark.** Yasothon v1b's bamboo launch tower stood between the camera and
  the toad museum at 45-49 s, so its legs read as piercing the toad. It also crossed the road shot at 26 s. Take a temporary
  structure down between its uses (`towerK`), and pick the azimuth so that the landmark is at least ~60 degrees off the line
  from the camera to the tall frame.
