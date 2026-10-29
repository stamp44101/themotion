# Handoff: where the work stands (29 ต.ค. 2569)

For a new session: read `CLAUDE.md`, `AGENTS.md`, `docs/storyline.md` (§7 is the current standard),
`docs/experiments.md` (§10–11 are the latest reads), then this file.

## Done and merged
- Phetchabun (PR #72), Suphanburi v2 (PR #73), Udon Thani v1 (PR #74). Upload files are on the
  `renders` release as `<city>_look_social.mp4`.
- Udon Thani is the first city built to storyline v2 from the start; it has not been posted yet.

## Waiting
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

## Standing rules the owner gave in chat (also in CLAUDE.md / AGENTS.md)
- Reply to the owner in Thai. Ask before merging; the owner says "Merge".
- No paid generators; code-only audio at -16 LUFS; shader look only.
- Commits as stamp44101 with no AI attribution; GitHub comments start with [cloud] and end with the
  Claude Code footer.
- No full render until the owner passes the stills.
