# Handoff: where the work stands (29 ต.ค. 2569)

For a new session: read `CLAUDE.md`, `AGENTS.md`, `docs/storyline.md` (§7 is the current standard),
`docs/experiments.md` (§10–11 are the latest reads), then this file.

## Done and merged
- Phetchabun (PR #72), Suphanburi v2 (PR #73), Udon Thani v1 (PR #74). Upload files are on the
  `renders` release as `<city>_look_social.mp4`.
- Udon Thani is the first city built to storyline v2 from the start; it has not been posted yet.

## Done
- **Udon Thani's 24-h read** is `experiments.md` §12 (skip 41.4%, share 4.7%, the best yet).
- **Nakhon Pathom's 24-h read** is `experiments.md` §13 (skip 49.2%, every rate lower; the middle held
  best yet at ~37% at 15 s). A building growing still reads as a building.

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

## Ratchaburi v1: merged (PR #78) and posted
- 24-h read is `experiments.md` §14: skip 42.0%, share 4.1% (second best), the middle sagged on the
  Thai Yuan column (~25% at 15 s). Lesson for the next city: the first beat after the cover must be a
  big, close event, not a far procession.

## Saraburi v1 (branch `city/saraburi`, draft PR): research stage
- Started 1 Nov: the other half of the Thai Yuan journey Ratchaburi's resident named, the Buddha's
  Footprint legend (the hunter and the healed deer), the seat moved from Sao Hai to Pak Phriao,
  the cement hills. Brief v0: `docs/briefs/saraburi.md` (founding 2092 is a supposition; 2112 is
  the first record).
- [gemini] answered (3226139); cloud checked it and proposed the storyline (05c057c): the deer at
  the Footprint (reign of Songtham, no held year: the find is dated 2149 / 2165 / ~2166-67), the
  mondop burned 2310 and rebuilt 2330, Thai Yuan at Sao Hai 2347, the train 2440 and the town moving
  to Pak Phriao, the Friendship Highway 2501, flower alms as the payoff.
- Style frames A1 / A2 (the deer) and B (flower alms) in `docs/briefs/saraburi_styleframes_*.jpg`;
  **waiting on the owner's pick.** Out to [local]: ONEP + story places into `saraburi_onep/`.

## Next
- A new city in a new session (one city per session).
- **Posting time (owner, 1 Nov): 19:00-21:00 from now on**, not the morning; the next read changes the
  city and the hour at once (`experiments.md` §14).

## Standing rules the owner gave in chat (also in CLAUDE.md / AGENTS.md)
- Reply to the owner in Thai. Ask before merging; the owner says "Merge".
- Posts go up between 19:00 and 21:00 (from 1 Nov).
- No paid generators; code-only audio at -16 LUFS; shader look only.
- Commits as stamp44101 with no AI attribution; GitHub comments start with [cloud] and end with the
  Claude Code footer.
- No full render until the owner passes the stills.
