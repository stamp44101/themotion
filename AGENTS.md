# Working on this repo alongside other agents

Read this first, whichever tool you are. `CLAUDE.md` is the engineering guide —
how the diorama engine works, how to build a city, what breaks. **This file is
about working in parallel with other agents without stepping on them.**

More than one agent works here: Claude Code, Google Antigravity, Gemini, and
cheaper models running mechanical passes. The repo owner is **stamp44101**, who
decides what ships.

## What a city is, and why that makes parallel work safe

One city is almost entirely its own files:

```
src/cities/<city>/timeline.ts     story beats, year curve, captions
src/cities/<city>/Landmarks.tsx   the buildings unique to that city
src/cities/<city>/index.ts        layout, cameras, callouts, palette
scripts/soundtrack_<city>.py      its score
public/soundtrack_<city>.wav      the rendered audio
renders/<city>.mp4                the repo copy of the video
```

plus **one line in `src/Root.tsx`** to register it, and two lines in
`package.json` scripts. Nothing else.

So two agents can build two different cities at the same time with essentially
no overlap. Use a branch per city: `city/<name>`.

## The one rule that matters

**Only one agent touches `src/engine/` at a time.**

The engine (`Diorama.tsx`, `world.ts`, `poly.ts`, `parts.tsx`, `Life.tsx`,
`camera.ts`, `types.ts`) and `src/Overlay.tsx` are shared by every city. An
engine change lands on its own branch, gets merged, and *then* city work
rebases onto it. Two agents editing the engine in parallel will produce a merge
no one can safely resolve, because the breakage shows up as wrong pixels rather
than as a conflict.

If your task needs an engine change, say so before starting it.

## Nothing ships unreviewed

Every defect found in this project so far was caught by the owner watching the
finished video, not by the agent that made it: houses built on a river, a city
plan the wrong shape, a wall running across open water. Those are all things
that look fine in code and wrong on screen.

So: **before any video is handed over, it passes the physical-plausibility
checklist in `CLAUDE.md`, and a model that did not build it looks at the contact
sheet.** Reviewing each other's output is the point of having several agents, and
it matters more as parallelism increases, not less.

When reviewing someone else's city, you are looking for things that could not
exist in the real world. Say what is wrong and where; do not fix another agent's
city on their branch without asking.

## Every review becomes a rule

The owner should never have to give the same note twice. When a review --
the owner's, a PR comment, or another model's contact-sheet check -- finds a
problem, the agent that fixes it also makes it impossible to repeat, **in the
same PR**:

1. **If a script can detect it, add the check.** `scripts/check_story.mjs`
   (story, captions, camera; runs before every render and in CI) or
   `scripts/check_render.mjs` (the finished file). Prefer an error to a warning.
2. **If it needs judgement, add one line** to the lessons in `CLAUDE.md` or the
   plausibility checklist, saying what went wrong and in which city.

A PR that fixes a review note without doing one of these is not finished.
Rules already earned this way, all enforced by `npm run check` / `npm run encode`:

| rule | from |
|---|---|
| nothing on screen under the intro or finale title | Chachoengsao, caption at 2 s |
| caption title fits on one line (measured with Kanit's real widths) | Chachoengsao, year dropped to its own line |
| light never jumps > 8 luma per frame, nights stay > 35 | Chachoengsao, light snapped at 3 s |
| camera: zoom <= 65%, orbit >= 15%, azimuth >= 300 deg, a wide shot mid-story | Nakhon Sawan, "it just zooms in and out" |
| a callout's subject is not hidden behind trees (line of sight tested per tree) | Nakhon Sawan, shrine shot showed only trees |
| no callout points below the ground; landmarks on a slope sit at `terrainH` | Nakhon Sawan, San Khu redoubt buried in a hill |
| audio scripts call `python3` | Nakhon Sawan, failed on macOS |
| every new city has a sourced brief in `docs/briefs/` | Nakhon Sawan |
| Node 18-25 only | first Mac render, Node 26 broke Chrome's unzip |
| the rail does not run along a river's bed (crossings get a bridge automatically) | Nakhon Sawan, train crossed the Nan on bare water |

Before you ask the owner to look at anything, `npm run check` passes. It is
cheaper for you to read its errors than for the owner to find them on a phone.

## Handing work between agents

Write a city brief first and put it in `docs/briefs/<city>.md` — copy
`docs/city-brief.template.md`. It carries the traced wall outline, the real
dimensions in metres, the dated story beats with a confidence level on each, and
the landmarks. A brief that is complete lets any agent build the city without
redoing the research, which is the expensive half.

Research and plan-tracing is worth doing on a strong model. Rendering, encoding,
contact sheets and publishing are mechanical and belong on a cheap one — the
render is GPU-bound anyway, so a bigger model buys nothing there.

## Verifying your own work

Two scripts catch what used to be found only on a phone. Run both; neither is
optional.

- **Before rendering:** `npm run check` -- typecheck (an import of a file you
  never committed fails here, not on the next agent's machine) plus caption and
  callout timing for every city: nothing under the intro title (before
  `INTRO_END`, 3 s) or the finale title, no two captions on screen at once, no
  caption title wider than one line, the year curve never running backwards. `npm run render:<city>` runs the timing
  check itself and will not start if it fails. CI runs `npm run check` on every PR.
- **After rendering:** `npm run encode -- <city>` makes the repo copy and the
  upload copy and then checks all three files: light may not jump more than 8
  luma levels between frames or drop below 35 before the finale, the repo copy
  must be under 100 MB and tagged limited-range bt709. A render that fails is
  not handed over. `npm run check:render -- <file>` checks any file on its own.

Both checks would have stopped Chachoengsao's first version, whose opening
caption sat on top of the title and whose light snapped at 3 s.

- **Measure, do not estimate.** Bitrates and durations come from `ffprobe`.
- **A/B still against still.** Comparing a still to a frame pulled from an
  encoded video differs everywhere from compression alone and proves nothing.
- **Check a cheap thing before an expensive one.** Render one still to confirm
  the layout before committing to a 2-minute render.
- When you change the shared engine, render a still of a city you did *not*
  touch and confirm it is byte-identical.

## Conventions

- **No AI attribution anywhere.** No `Co-Authored-By` trailer, no "generated by"
  in commits, README or code comments. stamp44101 is the sole author.
- Commit messages are plain prose explaining *why*, not a feature list.
- **Do not commit**: `out/`, `shots/`, `__pycache__/`, or any upload master
  (they run 135–160 MB, over the repo's own limit).
- **Leave alone unless it is your task**: `package-lock.json` (npm rewrites
  metadata on install — revert it), `public/grain.png` (regenerating it produces
  a byte-different file for no reason).
- `renders/<city>.mp4` stays under 100 MB.
- Open a PR against the default branch rather than pushing to it.

## Current state

- Engine supports non-rectangular city footprints (`city.outline`) and opens the
  wall where a river crosses it. See `CLAUDE.md`.
- `src/Overlay.tsx` enforces a TikTok safe area. Any render made before that
  change has the old layout baked in and needs redoing.
- Captions and callouts are held back until the intro title has gone
  (`INTRO_END` in `src/lib.ts`), and the day/night cycle is continuous with
  shallow nights. Renders made before that change can fail `check:render`.
- Cities built: Chiang Mai (2D and 3D), Sukhothai, Korat, Ayutthaya, Phitsanulok,
  Chachoengsao.
- Rendering on the owner's own GPU machine: `docs/render-locally.md`.
