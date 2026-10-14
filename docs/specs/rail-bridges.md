# Spec: rail bridges where the railway crosses a river

**Branch:** `engine/rail-bridges` (engine change; AGENTS.md: one agent in `src/engine/` at a time)
**Size:** one component in `src/engine/Diorama.tsx`, one check in `scripts/check_story.mjs`, docs.
**Model:** mid-tier is fine. The design decisions are made below; do not redesign them.

## The bug

The engine draws the railway as one straight line across the whole tile
(`Infrastructure` in `src/engine/Diorama.tsx`, about lines 592-650) and never looks at
the rivers. Where a river crosses that line, the rails lie flat on the water
with no bridge. The owner spotted it in Nakhon Sawan at frame 1300, where the
camera tracks the train across the Nan.

Measured crossings (rail perpendicular to a river whose span covers `rail.pos`):

| city | rail | river(s) crossed |
|---|---|---|
| nakhonsawan | z @ 18 | river 1 (Nan, axis x, z = 0, width 2.75) |
| ayutthaya | z @ 27 | river 0 (x @ 12.5, w 4.2), river 1 (x @ -12.5, w 3.4) |
| phitsanulok | z @ -26 | river 1 (x @ -30, w 2) |
| chachoengsao | x @ -14 | river 0 (z @ -4.8, w 2.8) |
| korat | x @ -19 | none (use as the "nothing changed" control) |

## What to build

### 1. `RailBridges` (new component in `Diorama.tsx`, rendered next to `Infrastructure`)

Compute the crossings from the layout and draw a steel girder bridge at each one.
No new layout fields and no per-city changes: every city with a crossing gets its
bridge automatically.

**Crossings.** For each `river` with `river.axis !== rail.axis`, take its span with
the existing `riverSpan(L, river)` helper. If `rail.pos` lies inside
`[span0 - river.width, span1 + river.width]`, there is a crossing:
- position along the rail: `a = river.pos`
- `len = river.width + 1.6`, which reaches 0.8 onto each bank

**Heights** (already fixed by the engine; do not change them):
- The water box top is at y = 0.10.
- The rails are at y = 0.12 (0.08 tall).
- The sleepers are at y = 0.06, under the water surface, which is why they vanish.
- The `Train` group sits at y = 0. Its body bottom is at y = 0.15 (body at 0.6, height 0.9).

So the train runs at deck height without any change to `Train`, provided the deck top is at **y = 0.15**.

**Geometry.** Build it in a group at `along(L, rail.axis, a, rail.pos, 0)`, with `rotation-y` matching the rails (`rail.axis === 'z' ? 0 : Math.PI / 2`); local z is along the track.

| part | box size [x, y, z] | position | colour |
|---|---|---|---|
| deck plate | `[1.7, 0.08, len]` | y = 0.11 (top 0.15) | `#4a4f55` |
| 2 side girders | `[0.12, 0.55, len]` | x = ±0.82, y = 0.15 + 0.275 | `#2f3439` |
| vertical posts on each girder, every 1.2 along `len` | `[0.14, 0.55, 0.14]` | same x and y as the girders | `#2f3439` |
| 2 abutments (stone, one per bank) | `[2.2, 0.5, 0.9]` | z = ±(river.width / 2 + 0.35), y = -0.1 (top flush with the deck at 0.15) | `#9b8f7a` |

- The train is 0.9 wide (half 0.45) and the girders' inner faces are at 0.76, so it passes between them. Check this on a still.
- Use `castShadow` / `receiveShadow` like the road bridges do.

**When it appears.** The rail is laid progressively: the visible length is
`railSpan[0] + railLen * railK`. Show a bridge only once the rail has reached it:
`a - len / 2 < railSpan[0] + railLen * railK`. Then scale it in along the track
over the next 1.5 units of rail, the same feel as the road bridges'
`scale={[k, 1, 1]}`. It must never appear before the railway opens
(`rail.open[0]`). That is the San Khu watchtower mistake again.

**Sleepers over water.** In the sleeper `updateInstances` callback, hide sleepers
whose position falls inside a crossing (`|a - river.pos| < len / 2`). The deck replaces them.

### 2. Check: rail along a riverbed (`scripts/check_story.mjs`)

Crossings are now handled. A rail that runs *along* a river cannot be fixed by a
bridge. Add one error, next to the other layout checks: for each river with
`river.axis === rail.axis`, if `|rail.pos - river.pos| < river.width / 2 + 1.0`
and the spans overlap, fail with
`rail runs along river N's bed; move rail.pos to dry ground`.
It must report nothing for the six current cities. Verify that.

### 3. Docs
- `CLAUDE.md` "Look & feel lessons": one line saying the engine now bridges the
  railway over any river it crosses (Nakhon Sawan's train ran across the Nan on bare
  water), and that a rail parallel to a river must stay out of its bed (checked).
- `AGENTS.md` rules table: add a row for the riverbed check.

## Verification (all of it, before asking the owner to look)

1. `npm run check`: 0 errors. The existing Chachoengsao camera warnings are expected.
2. **Korat is untouched.** Render `npx remotion still Korat … --frame=1100` on the base
   branch and on this branch and confirm the files are byte-identical (`cmp`).
   AGENTS.md requires this for any engine change.
3. **Each crossing city:** render stills where the crossing is on screen and look at them.
   - Nakhon Sawan: frame 1300. It is on `city/nakhonsawan`, not this branch, so
     merge this branch into a scratch copy of it, or check it after the owner merges.
   - Ayutthaya, Phitsanulok, Chachoengsao: render a still at the middle of each train pass,
     frame = `(t0 + dur / 2) * 30` from that city's `layout.trains`, plus one wide
     shot late in the clip.
   - Crop around the crossing and confirm:
     - the bridge is there
     - the train is on the deck, not below or above it
     - nothing clips the girders
     - before `rail.open[0]` there is no bridge (render one frame from the year before)
4. Put one 2x2 sheet of crop images in the PR description.

## Out of scope
- Roads crossing rivers. Roads have explicit `bridges`. If you notice a road on
  bare water, list it in the PR; do not fix it here.
- Re-rendering the cities. The owner renders locally after merge.
- Nakhon Sawan's geography. In reality the Northern Line probably stays on the east bank
  of the Nan inside the town (unconfirmed). The model's Nan runs east-west, so a
  crossing is unavoidable there; a bridge is the accepted compromise.

## Hand-off
Open a PR from `engine/rail-bridges` into `claude/busy-brown-ba1fp4`. In it, include
the crop sheet and the byte-identical result for Korat. Then tell Gemini, on PR #7,
to merge the base branch into `city/nakhonsawan` once this lands.
