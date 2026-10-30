# Handoff: where the work stands (29 ต.ค. 2569)

For a new session: read `CLAUDE.md`, `AGENTS.md`, `docs/storyline.md` (§7 is the current standard),
`docs/experiments.md` (§10–11 are the latest reads), then this file.

## Done and merged
- Phetchabun (PR #72), Suphanburi v2 (PR #73), Udon Thani v1 (PR #74). Upload files are on the
  `renders` release as `<city>_look_social.mp4`.
- Udon Thani is the first city built to storyline v2 from the start; it has not been posted yet.

## Done
- **Udon Thani's 24-h read** is `experiments.md` §12 (skip 41.4%, share 4.7%, the best yet).

## Was waiting
- **Udon Thani's 24-h read.** Compare its skip rate with Phetchabun's 37.7% (the cover) and its like
  / save / share rates with Suphanburi v2's 8.0 / 0.8 / 0.8% (the 0-to-100 spine). Record it as
  `experiments.md` §12.

## Nakhon Pathom v1 (PR #76, draft): rendered, waiting on the owner
- Cover A1 (owner): the golden bell closes over the old stupa at legend scale, then settles to ~4x
  true size as the town grows round it; beats: canal + brick boats, the July 2403 collapse in the
  rains, the 2413 crown, the 2446 train, the Wild Tiger Corps to Sanam Chandra, the grow shot, the
  12th-month fair. Brief: `docs/briefs/nakhonpathom.md`.
- [local] rendered adb965c: `check_render` ok (max jump 4.7, darkest 64.4); upload copy on the
  `renders` release as `nakhonpathom_look_social.mp4`. Open by design: the train's steam puffs are
  engine-wide (`engine/train-steam` if wanted).
- Next: the owner watches it, says "Merge" and posts; record its 24-h read in `experiments.md`.

## Ratchaburi v1 (PR #78, draft): rendered, waiting on the owner
- Cover A1 (owner): a giant dragon jar thrown on a wheel on the Mae Klong's west bank; the dragon is a
  relief drawn after the loong's nine resemblances and the owner's photo of the jar monument
  (`src/cities/ratchaburi/dragon.tsx`). Beats: the Thai Yuan from Chiang Saen 2347 → Rama II's
  east-bank wall 2360 → back west, Koi Ki 2440 → the train over the black bridge 2446 → the first
  kiln 2476 → the jar boats in the war → the grow shot → the jar fountain in front of Koi Ki.
  Brief: `docs/briefs/ratchaburi.md` (started from a resident's account; the wall is approximate).
- [local] rendered 5f20290: `check_render` ok (max jump 4.8 at 19.18 s, darkest 58.8), -16.0 LUFS,
  score +2.6 LU over the effects; upload copy `ratchaburi_look_social.mp4` on the `renders` release.
- New workflow rule from this city: the research names the story places (part 6), [local] maps them.
- Next: the owner watches it, says "Merge" and posts; record its 24-h read in `experiments.md`.

## Standing rules the owner gave in chat (also in CLAUDE.md / AGENTS.md)
- Reply to the owner in Thai. Ask before merging; the owner says "Merge".
- No paid generators; code-only audio at -16 LUFS; shader look only.
- Commits as stamp44101 with no AI attribution; GitHub comments start with [cloud] and end with the
  Claude Code footer.
- No full render until the owner passes the stills.
