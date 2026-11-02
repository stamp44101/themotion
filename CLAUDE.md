# themotion — city history timelapse videos (slim guide)

Vertical (1080×1920, 30 fps, 60 s) motion videos of Thai city histories, built with Remotion; Thai text
in Kanit; picture and sound all code (the score from `scripts/synth.py`).

> **This is the slim guide.** Every rule is one line here; the reason, the city it came from and the
> numbers are in **[docs/claude-full.md](docs/claude-full.md)** under the same bold heading. When a line
> is not enough to act on, read that section before acting. Most rules are also enforced by
> `npm run check` (`check_story`) or `npm run encode` (`check_render`): read their errors first.
> A new lesson goes into the full guide in full and gets one line here.
> Working with other agents: [AGENTS.md](AGENTS.md) (branches, one agent in the engine, review gate).
> Where the work stands: [docs/handoff.md](docs/handoff.md).

## Ground rules
- No paid service (HF, Comfy, any credit generator) without the user's explicit "yes" for that spend.
- Verify every date on the web before a caption; tell the user what is approximate or disputed.
- The province series is code only: no generated audio (ElevenLabs etc.) in a province clip.
- Reply to the owner in Thai; commits as stamp44101, no AI attribution; GitHub comments signed `[cloud]`.
- Ask before merging; no full render until the owner passes the stills; shader look only.

## Workflow (in this order)
1. 2–3 style frames, owner picks. 2. Brief + storyline worksheet (`docs/storyline.md` §5, §7 v2), then
`timeline.ts` (`buildStory`). 3. Layout (`index.ts`, `places.ts`, `geo.ts`), `Landmarks.tsx`,
`actors.ts`. 4. Contact sheet of 8–12 stills; iterate on stills. 5. Export timeline, synthesise the
soundtrack on `tl.beat(...)`. 6. `npm run check` → `npm run render:<city>` once → `npm run encode -- <city>`.
New city: trace the real footprint first (ONEP via [local]), dimensions in metres, verify dates, beats,
layout + audit every hand-placed coordinate, camera keys last.

## Environment (cloud container)
- 3D needs `--gl=angle`; software render ~35–50 min / 1800 frames; a GPU machine ([local]) ~1–5 min.
- Stills: `npx remotion still <Comp> out.png --frame=N --gl=angle --scale=0.5`; never during a full render.
- Python audio: `pip install numpy scipy`. Kill by PID, never `pkill -f` on your own pattern.
- Videos are gitignored; finished clips go on the `renders` release (`<city>_look_social.mp4`).

## Lessons — one line each (details: docs/claude-full.md, same heading)
**Three.js:** self-lit things use `meshBasicMaterial` + `toneMapped={false}`; interiors go outside the building.

**Look & feel**
- **Bloom can black out a whole frame.** Gate every growing mesh on its own scale (`> 0.02`); bloom only at night.
- **A flat slab grown by its height pops in at full width.** Grow ground slabs outward (x/z) or fade them.
- **The cover shows the land, with a giant on it (owner).** Legend-scale hero, camera ~280–330 out, whole tile in frame.
- **Model a named landmark's silhouette before its icon.**
- **An exact-date beat needs a hold in the year curve.** Named พ.ศ. year on the counter ≥ 1 s; re-check year-driven motion after retiming.
- **Coastal ambience is a sequence of places, not one surf loop.**
- **The small sounds are the charm (owner).** Every thing that appears or moves gets a sound; ambience 8–12 dB under the score.
- **The score carries the clip at a steady level (owner).** Score 0 to +3 LU over the effects across the clip; never duck it.
- **Every city plays at -16 LUFS (owner).** `synth.master` does it; keep quiet passages.
- **The gaps between beats need sound too.** A rising bridge into each beat.
- **A building "on the hill" sits on the crown, not on the slope.**
- **A looping procession fades out and back in at its restart.**
- **A railway bridges every river it crosses;** a rail parallel to a river stays out of its bed.
- **Trace curved rivers as centrelines** (`path`), not stacked bands.
- **A boat never passes under a deck lower than itself.**
- **Every road bridges the water it crosses; cars drive only on built roads.** The engine bridges only its own rivers.
- **People, stalls and animals stay on land; stations stand beside the track.**
- **A wall never runs across open water** (water gate where a river crosses).
- **Real city footprints are not rectangles** (`city.outline` from ONEP); a new footprint means new camera keys.
- **A still is not proof that a moving thing shows in the render.** Moving things are `actors`; ≥ 80 px readable; not behind trees or hills.
- **Figures must read as people** (white/indigo/undyed; strung out, not stacked).
- **A/B engine changes still vs still,** never against an encoded frame.
- **A destroyed capital's walls read as ruins** (`city.ruinStrength`).
- **Nothing goes on open water** except bridges, boats, houseboats; audit hand-placed parts too.
- **Keep the top ~30% for counter + caption; respect the TikTok safe area.**
- **Nothing goes on screen during the intro title** (≥ 3 s) or the last 4 s.
- **A caption title is one line** (820 px at 74 px Kanit).
- **The camera has to travel, not just zoom;** wide shots come back; azimuth swings round the city.
- **The camera must not lurch (owner).** Ease every move with `glide()` / `between()`; jerk ≤ 700.
- **Low cameras look through forest.** Below ~30° look across water or open ground.
- **A callout's anchor stays in frame while the callout is up.**
- **Towers wait for their era** (`layout.highRise`).
- **Everything placed goes through one occupancy map;** give landmarks `sites`, hand-placed parts `footprints`.
- **A train that pulls in to a terminus parks; a lifted line closes** (`rail.close`).
- **Modern sprawl builds over anything not marked open** (`openGround` for airfields, parks, plazas).
- **Built things sit on the ground; the ground is level where a town stands.**
- **Landmarks sit on the terrain** (`terrainH`), and so do their callouts.
- **Directions come from real coordinates** (`geo.ts`, ≤ 30° off; route named roads where they really run).
- **The story names the places; the map only finds them.** Research part 6 lists story places per era; [local] pins each, flags what OSM lacks.
- **Grandeur is scale contrast** (`docs/grandeur.md`); the clip ends on something big.
- **Every beat needs something happening on screen;** a date with nothing to show is a sub line.
- **Every city is built to the storyline standard** (`standard: 1`, v2 0-to-100): hero at frame 0 + callback, motion through 3–17 s, one verb per beat, a grow shot, the counter lands on today.
- **60 s by default, 75 s only for action (owner).**
- **Beats own their seconds; the year curve is derived** (`buildStory`): motion on `beat(id)`, visibility on the year.
- **A forest-only opening reads dark and green** (`ambient(Y)`, open ground).
- **Light must never snap** (≤ 8 luma per frame, > 35 before the finale).
- **Nothing grows on a year the counter jumps over** (station, track, clearings): grow it inside the beat's years or on `beat(id)`.

## Physical plausibility checklist (before calling a city done)
Nothing on open water but bridges/boats/houseboats · the wall opens with a water gate where a river
crosses · gates not in the channel · landmark parts do not intersect · the wall does not run through a
landmark · nothing meant to be seen inside a closed building · roads not along a riverbed · crowds and
stalls on land · hills only where real · every callout points at something visible · nothing before it
was built or after it was gone.

## Model / token budget
Mechanical passes (scaffolding, data from an agreed outline, renders, contact sheets) on a cheaper
model; footprints, sources, composition, camera and contact-sheet review on the stronger one. One city
per session: write decisions to the brief, the PR and `docs/handoff.md` as they are made, so a new
session (or a compacted one) loses nothing.

## Upload file and layout
- Upload copy: `npm run encode -- <city>` (limited-range bt709, ~7.5 Mbps, one file for TikTok/IG/FB);
  the exact ffmpeg line is in the full guide.
- `src/engine/` shared engine · `src/cities/<city>/` per city · `src/landmarks/<name>/` landmark reels ·
  `src/Overlay.tsx` text layer · `scripts/synth.py` + `scripts/soundtrack_<city>.py` sound.
