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

## Next city (recommended to the owner, not yet chosen): Nakhon Pathom
- Cover: the old, small Phra Pathom Chedi alone in forest, then the giant chedi rising over it in
  tiers until it fills the middle of the frame (Rama IV's encasing). A big shape change in the first
  second, and real scale (the tallest stupa in Thailand), not an enlarged one.
- 0 to 100: Nakhon Chai Si abandoned in forest → the chedi built → the Chedi Bucha canal → the
  southern railway → Sanam Chandra Palace (Rama VI) → Silpakorn University → the town joining the
  Bangkok suburbs.
- Payoff: the Phra Pathom Chedi fair (the 12th lunar month), crowds round the chedi.
- Ask Gemini to judge how far to tell the Phraya Kong / Phraya Phan legend.
- Alternatives offered: Samut Prakan (the 1893 Paknam incident at the forts, then the industrial
  city and Suvarnabhumi; a battle, and Udon also opens on ร.ศ. 112), Prachuap / Hua Hin (railway and
  Klai Kangwon; no strong first-second hero yet).
- Steps: open a draft PR with `docs/briefs/<city>_research_request.md` for [gemini] (see
  `docs/gemini-research.md`), ask [local] for the ONEP polygon and OSM pins, verify dates on the
  web, style frames 2–3 options, owner picks, build, stills, owner passes, [local] renders.

## Standing rules the owner gave in chat (also in CLAUDE.md / AGENTS.md)
- Reply to the owner in Thai. Ask before merging; the owner says "Merge".
- No paid generators; code-only audio at -16 LUFS; shader look only.
- Commits as stamp44101 with no AI attribution; GitHub comments start with [cloud] and end with the
  Claude Code footer.
- No full render until the owner passes the stills.
