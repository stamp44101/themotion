# Handoff: where the work stands (4 พ.ย. 2569)

For a new session: read `CLAUDE.md`, `AGENTS.md`, `docs/storyline.md` (§7 is the current standard),
`docs/experiments.md` (§10–11 are the latest reads), then this file.

## Done and merged
- Phetchabun (PR #72), Suphanburi v2 (PR #73), Udon Thani v1 (PR #74). Upload files are on the
  `renders` release as `<city>_look_social.mp4`.
- Udon Thani is the first city built to storyline v2 from the start; it has not been posted yet.

## Done
- **Udon Thani's 24-h read** is `experiments.md` §12 (skip 41.4%, share 4.7%, the best yet).
- **Saraburi's read** (posted 1 Nov 20:00) is `experiments.md` §15: at 24 h skip 48.9%, share 0.4%,
  like 4.3%, 4,349 views, all rates "lower"; the deer moved but the symbol (the Footprint) did not.
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

## Saraburi v1: merged (PR #80) and posted (1 Nov, 20:00)
- Started 1 Nov: the other half of the Thai Yuan journey Ratchaburi's resident named, the Buddha's
  Footprint legend (the hunter and the healed deer), the seat moved from Sao Hai to Pak Phriao,
  the cement hills. Brief v0: `docs/briefs/saraburi.md` (founding 2092 is a supposition; 2112 is
  the first record).
- [gemini] answered (3226139); cloud checked it and proposed the storyline (05c057c): the deer at
  the Footprint (reign of Songtham, no held year: the find is dated 2149 / 2165 / ~2166-67), the
  mondop burned 2310 and rebuilt 2330, Thai Yuan at Sao Hai 2347, the train 2440 and the town moving
  to Pak Phriao, the Friendship Highway 2501, flower alms as the payoff.
- Owner picked **A1** (1 Nov). v1 built in `src/cities/saraburi/` on [local]'s map (8620269): contact
  sheet `docs/briefs/saraburi_v1_contact.jpg`, `npm run check` passes, soundtrack -16.0 LUFS (+1.1 LU).
  What is approximate is listed in the brief ("v1 build").
- Owner passed the stills (1 Nov). v1 rendered; owner: "เกือบดี", the station popped in and the
  elephants had no call. Fixed in v1c (station grown on the beat, track laid in the 2440 hold, three
  trumpets; lesson in CLAUDE.md), plus the flare on time and the train seen down the line.
- [local] rendered v2 (head 6607189): `check_render` ok (max jump 3.0, darkest 57.3); upload copy on the
  `renders` release as `saraburi_look_social.mp4`. Owner posted it 1 Nov 20:00 and said merge (2 Nov).

## Kanchanaburi v0 (3 Nov, owner: "ลุย" from the shortlist)
- Picked from five candidates (Kanchanaburi, Samut Songkhram, Chiang Mai, Chanthaburi, Nong Khai). Hook:
  the Kwai bridge with a train. Brief v0 `docs/briefs/kanchanaburi.md` (dates checked: seat moved to Pak
  Phraek 2374, bridge opened 25 Dec 2486, bombed from Nov 2487, mended 2489 but th.wikipedia also lists 2491 and
  2495: ขัดแย้ง). Research request `docs/briefs/kanchanaburi_research_request.md` written for [gemini].
- **v1 built (3 Nov, PR #83):** research and [local]'s map landed (f654118, b2e66d5); cloud picked the cover A1
  (the train on the bridge) and built v1 (`npm run check` 0 errors, -16.0 LUFS); the render goes to [local]. What is
  approximate is in the brief ("v1 build"): no roads or cars yet, the bridge drawn 1.4x, the wall's axis guessed.
- **Kanchanaburi rendered (v1e, e2272b9, PR #83 draft):** [local] rendered it (`check_render` ok, max jump 7.9 at 28 s, darkest 49.7);
  upload copy on the `renders` release as `kanchanaburi_look_social.mp4`; cloud checked the frames and the dense 4.0-6.2 s strip: nothing to fix. Two
  bugs found after v1: the map's look (v1c) and the cover train on the water (v1e, found by [local]). Next: the owner watches, says "Merge" and
  posts at 19:00-21:00; the 24-h read goes in `experiments.md` §17. Open for a v1f: roads and cars (need engine bridges), the Saeng Chuto road,
  the sprawl's uniform orange blocks, the cover's size (held to the title-safe box).
- **Autoloop (owner, 3 Nov), like Surat Thani:** cloud decides in the owner's place and writes why in the
  brief. War weight decided by cloud: no suffering shown, one beat (the bridge breaks, the Thai government
  mends it), a short quiet memorial. Next: [gemini] answers; [local] pins the ONEP polygon and story
  places; then cloud proposes the storyline.

## Surat Thani v1 (PR #81, draft): the loop experiment, rendered, waiting on the owner
- Owner (2 Nov): cloud and [local] loop through the PR to the render, cloud standing in for the owner's
  picks. Cloud picked the cover **A1, the coconut monkey** (Gemini ranked it 4th; the reasons are in
  `docs/briefs/suratthani.md`), built v1 on [local]'s map (a67d83d) and Gemini's research (df8eb1b), had a
  second model review the contact sheet, fixed its notes and passed the stills (780e4fb, `npm run check` 0
  errors, -16.0 LUFS, +1.7 LU).
- [local] rendered 780e4fb (= 5902c1e in picture and sound): `check_render` ok (max jump 6.4 at 8.64 s,
  darkest 59.5); upload copy on the `renders` release as `suratthani_look_social.mp4`; moving checks and
  audio spectrograms in `shots/suratthani/` (f4dba7c). Cloud checked the frames: nothing to fix. The loop
  ran from the request to the render in about 70 minutes with no owner input.
- Open notes for the owner: the giant palm leaves the frame as it settles (its shrink is barely seen); the
  junks overlap in perspective at ~6 s.
- The owner asked for a detail pass; [local] found five things (hollow hulls, the monkey in the fronds at
  both ends, overlapping junks, a slab-like rail bridge), cloud fixed them (v1b, brief), and [local]
  re-rendered 37b2ccb: `check_render` ok (max jump 2.9, darkest 59.4), all five confirmed on the render
  (`shots/suratthani/v1b_*`, 7fe7861). Left, optional: one junk passes under the caption at 7-8 s.
- Next: the owner watches, says "Merge" and posts at 19:00-21:00; the 24-h read goes in `experiments.md` §16.

## Surat Thani: merged (PR #81, 3 Nov 18:25) and posted that evening
- Early read (3 Nov 22:32, a few hours in): `experiments.md` §16: skip 47.4%, share 0.5%, average watch 11 s. **A true 24-h read is still owed**
  (screenshots on 4 Nov at about the post's hour; the post time was not recorded).

## Kanchanaburi: merged (PR #83, 4 Nov) and posted
- 24-h read (owner's screenshots, 00:44) is `experiments.md` §17: **skip 58.6%, the worst of all reads**, share 0.1% (the lowest),
  like 4.2%, 2,999 views, all rates "lower". The train moved but was a thin strip on a far tile at frame 0; the Kwai bridge is famous,
  not local. Lesson: the symbol that moves must fill ~1/3 of the frame at second 0 (check it on the style frame), and a resident's pick
  for shares. v1f/v1g (bridge deck, camera over the glare) were merged after the posted render; no re-post planned.

## Next
- **Sakon Nakhon v0 (4 Nov; owner picked it over Tak):** brief `docs/briefs/sakonnakhon.md`, research request for [gemini]
  `docs/briefs/sakonnakhon_research_request.md`, style frames `docs/briefs/sakonnakhon_styleframes.jpg` (A1 indigo cloth on the
  whole tile, cloud's pick; A2 closer; B the Nong Han legend). **Hybrid loop (owner, 4 Nov):** the loop runs research, map, build,
  render and QA, but the owner picks the cover and passes the 0-6 s stills; write down the post time. **Owner picked A1 (4 Nov).** [gemini] answered (072ac04), [local] pinned the map (0d5524c); cloud checked the years and
  proposed the storyline in the brief (5 Nov). v1 built (5 Nov): check 0 errors, -16.0 LUFS; what is approximate is in the brief ("v1 build").
  **Owner passed the 0-11 s stills (5 Nov, "ผ่าน").** Next: [local] renders e2a316d+
  (`npm run render:sakonnakhon`, then `npm run encode -- sakonnakhon`); cloud checks the frames (the rafts, the legend town's exit at 11.6 s). Earlier plan:
  [gemini] answers; [local] pins the lake, the old town and the story places (`sakonnakhon_onep/`).
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
