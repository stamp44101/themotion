# 1minutecity Skill — city history timelapse videos

Vertical (1080×1920, 30 fps, 60 s) motion videos of Thai city histories, built with Remotion and
Three.js. Thai text uses Kanit. Everything is code-generated; the soundtrack is synthesized in Python.

The skill itself is `.claude/skills/thai-city-timelapse/SKILL.md`; this file is the engineering
guide: every lesson learned making the 1minutecity series, kept as rules. `src/cities/korat/` is a
complete worked example (Nakhon Ratchasima, the series' best-performing clip).

Where these notes say "the owner", they mean the 1minutecity creator whose feedback produced the
rule. Treat those as tested defaults: the person you are working for decides for their own clips.

## Ground rules
- History content gets posted publicly: verify dates with a web search before writing captions,
  and tell the user which facts are approximate or disputed.
- Picture and sound are both made by code: the score and SFX come from `scripts/synth.py`. Ask the
  user before spending money on any paid generator.

## Workflow that works (do it in this order)
1. Agree the visual style first (show 2–3 quick style frames) before building anything.
2. Write the story beats (`buildStory`: seconds, years, captions, callouts, camera keys) in
   `src/cities/<city>/timeline.ts` to the storyline standard, `docs/storyline.md`: fill its
   worksheet in the brief (`docs/briefs/<city>.md`, from `docs/city-brief.template.md`) first.
3. Lay out the diorama (`layout` in `src/cities/<city>/index.ts`, real positions in `places.ts`),
   city-specific landmarks (`Landmarks.tsx`) and the moving things (`actors.ts`).
4. Check composition with a contact sheet of 8–12 stills (`npx remotion still … --frame=N`, then
   `ffmpeg … hstack/vstack`) — iterate on stills, never on full renders without a GPU.
5. Export the timeline and synthesize the soundtrack, cueing sounds on the beats (`tl.beat(...)`).
6. `npm run check`, then full render once (`npm run render:<city>`), then `npm run encode -- <city>`
   for the shareable copy and the upload copy; it fails loudly on flicker, dark nights or bad tagging.

## Render notes
- 3D needs `--gl=angle`. With a GPU (e.g. RTX 4070, ANGLE -> D3D11) 1800 frames take ~1-2 min, so
  iterating on full renders is fine. Without one it renders in software, ~35-50 min per clip:
  review with still contact sheets instead.
- `--scale=0.5` drafts are NOT much faster for 3D; use stills.
- Python audio needs `pip install numpy scipy`.
- Never render test stills while a full render runs: they steal CPU.
- Never `pkill -f` with a pattern that also appears in your own command line; kill by PID.
- `scripts/export_timeline.mjs` uses `pathToFileURL()` for the dynamic import — a bare Windows
  absolute path ('G:\...') is not a valid ESM specifier.
- If `--gl=angle` fails with "Error creating WebGL context" (a Linux server or a machine without a
  GPU), use `--gl=swangle`.
- If the default Chrome is missing, pass `--browser-executable=<path to chrome or headless_shell>`.
