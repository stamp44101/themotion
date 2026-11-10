# Handoff: where the work stands (10 พ.ย. 2569)

For a new session: read `CLAUDE.md`, `AGENTS.md`, `docs/storyline.md` (§7 is the current standard),
`docs/experiments.md` (§19–20 are the latest reads), then this file. Each city's full story (picks,
fixes, renders, what is approximate) is in its brief, `docs/briefs/<city>.md`; this file keeps only
what is open.

## Done, merged and posted
Every city in `src/cities/` is merged; upload files are on the `renders` release as
`<city>_look_social.mp4`. The latest, each with its read in `experiments.md`:

| city | PR | posted | read | skip |
|---|---|---|---|---|
| Udon Thani | #74 | morning | §12 | 41.4% |
| Nakhon Pathom | #76 | | §13 | 49.2% |
| Ratchaburi | #78 | morning | §14 | 42.0% |
| Saraburi | #80 | 1 Nov 20:00 | §15 | 48.9% |
| Surat Thani | #81 | 3 Nov evening | §16 (early read only) | 47.4% |
| Kanchanaburi | #83 | 4 Nov | §17 | 58.6% |
| Sakon Nakhon | #84 | 5 Nov evening | §18 | 53.1% |
| Chanthaburi | #86 | 7 Nov ~12:00 | §19 | 40.6% |
| Uttaradit | #87 | 8 Nov ~20:00 | §20 | **38.1%** (best) |

## What the reads say for the next city (§19–20)
- Frame 0: a symbol half-made by hand that changes shape (jar, gem, sword), on the whole land tile at
  legend scale, filling ~1/3 of the frame. No blank canvas, no thin far strip.
- A big, close event inside 3–9 s, ideally the cover's own object in a local hero's hand.
- Next sag to fix: 11–17 s (Uttaradit's long travel to Bang Pho Tha It); average watch fell to 13 s.
- Shares come from something each viewer names as theirs (the jars' 4–5%); a resident's pick helps.
- Post 19:00–21:00 and **write down the post time**.

## Open (each in its own PR, when the owner wants it)
- **Hip roofs in 11 older cities** are baselined as warnings by `check_roofs`; fix them with `HipRoof`
  (mechanical pass). Not re-posted.
- **Chanthaburi defects in the posted clip:** porters on the river at 28.5 s, a ~30 px stone column at
  21–23 s (noted in the brief; merged as rendered).
- **Engine-wide:** the ค.ศ. line under the พ.ศ. counter (under 2316 it reads 1773, but 7 Jan 2316 in the
  old April-new-year count is January 1774); the train's steam puffs are the same everywhere
  (`engine/train-steam` if wanted).
- **Kanchanaburi v1f ideas** (no re-post planned): roads and cars (need engine bridges), the Saeng Chuto
  road, the sprawl's uniform orange blocks.

## Next
- A new city in a new session (one city per session). Candidates named before: Yasothon, Samut
  Songkhram, Ang Thong (also Tak, Chiang Mai, Nong Khai). Hybrid loop: the owner picks the cover and
  passes the 0–11 s stills; cloud, [gemini] and [local] run research, map, build, render and QA.

## Old branches (10 Nov review; delete in GitHub, the cloud session may not delete refs)
Safe to delete, nothing lost: `city/kanchanaburi` (in main via PR #83), `exp/korat-hero` (in main),
`claude/youthful-sagan-wnhw9o` (§20 is merged through `claude/wizardly-allen-njcptm`).
Unmerged experiments, 300-400 commits behind main; keep until the owner decides (tag first if deleted):
- `explainer`: a 60 s clip on how the videos are made (16 Oct).
- `sound/plan-v2`: Sound v2 work on Khon Kaen (18 Oct; procedural SFX, phin/pong lang, click fixes).
- `exp/korat-hook`: Korat opens on its finale, then rewinds (15 Oct).
- `claude/ecstatic-fermi-01603k`: the 1minutecity Skill customer pack builder (`scripts/pack_customer.mjs`, 28-31 Oct).

## Standing rules the owner gave in chat (also in CLAUDE.md / AGENTS.md)
- Reply to the owner in Thai. Ask before merging; the owner says "Merge".
- Posts go up between 19:00 and 21:00 (from 1 Nov).
- No paid generators; code-only audio at -16 LUFS; shader look only.
- Commits as stamp44101 with no AI attribution; GitHub comments start with [cloud] and end with the
  Claude Code footer.
- No full render until the owner passes the stills.
