# Chonburi production learnings

Recorded after the Chonburi contact-sheet review on 2026-10-14. These notes
capture decisions that should reduce rework on the next coastal city.

## What changed after review

| First result | Why it failed | Change | Reusable rule |
|---|---|---|---|
| The พ.ศ. 2310 caption played while the counter had reached พ.ศ. 2326. | The year curve kept moving during an exact-date beat. The fleet also used year-based visibility, so it faded during its own caption. | Hold 1767 through the fleet shot, then accelerate to the next era between captions. | When a title names a year, inspect the middle of the caption—not only its first frame. Hold the year long enough for every year-driven visual and sound. |
| The fleet callout pointed to open water. | The callout used the component origin while the visible hero boat was offset inside the group. | Point to the visible boat's final world coordinate. | Callouts target visible geometry, not a parent group's nominal origin. |
| Khao Sam Muk looked like a generic red shrine on a small round hill. | A symbolic detail was modelled before the landmark's large-scale shape. | Build a long wooded ridge, pale cliff face and curling coast road; place the shrine on the ridge. | Recognition comes from silhouette and context first, architectural detail second. |
| The opening settlement and early city read as specks. | The camera distance was inherited from a wide map view while the historic footprint was small. | Tighten the early camera keys and enlarge only the city-specific landmark group. | Match shot distance to the footprint that exists in that year; do not frame an early village like the modern metropolis. |
| A fishing boat intersected the pier. | Both objects were positioned from their centres without checking their footprints. | Move the boats alongside the jetty and re-render the beat. | Audit the footprint of every hand-placed sub-part, not only its anchor coordinate. |
| The first soundtrack sounded broadly Thai and seaside, but not specifically Chonburi. | One continuous surf layer and generic instrumental colours carried most of the identity. | Use a quiet acoustic horizon plus irregular, beat-specific coastal foley: timber and oars, rock wash, buffalo-race hooves and crowd, beach murmur and a distant working-vessel horn. | Sound identity should follow the story's places and activities; a constant ambience bed is only glue. |

## Workflow that saved time

1. Render eight chronological stills before a full movie.
2. Have a model that did not build the city review the contact sheet.
3. Re-render only the frames named in the review.
4. Check exact-date beats at the middle of their captions.
5. Run `npx tsc --noEmit`, `node scripts/check_story.mjs chonburi` and
   `git diff --check` before committing.
6. Generate the soundtrack during `render:chonburi`; commit the required
   `public/soundtrack_chonburi.wav`, but keep render masters and upload copies
   out of the source commit.

## Coastal-city checklist

- Does the water band meet the edge of the tile and read as a coast rather than
  an inland river?
- Does each named headland, bay or beach have the correct large silhouette?
- Are roads and buildings on dry ground, with boats beside—not through—piers?
- Do waves vary in timing and texture instead of exposing a short loop?
- Does the soundscape change between port, temple, fishing, festival, beach and
  modern-city beats?
- At exact-date captions, do the counter, visible landmark and soundtrack all
  describe the same year?

## Local rendering and handoff

- Keep repository downloads small with a shallow, blobless sparse checkout.
- Keep generated MP4 masters and upload copies out of the source commit.
- Launch Python through `scripts/python_chonburi.mjs` so Windows can use
  `py -3` while macOS/Linux can use `python3`.
- On a Windows RTX 4070, ANGLE uses D3D11 for the Three.js scene. Concurrency is
  still bounded by CPU threads and RAM; raise it only while memory remains
  comfortably below saturation.
