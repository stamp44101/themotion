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

## Open
- **Owner (10 Nov): cities already posted are not reopened.** The 11 older cities' hip roofs (baselined as
  warnings by `check_roofs`), Chanthaburi's two defects in the posted clip and Kanchanaburi's v1f ideas stay
  as they are. New cities must pass `check_roofs` with no baseline.
- **Engine-wide, for the next cities:** the ค.ศ. line under the พ.ศ. counter (under 2316 it reads 1773, but
  7 Jan 2316 in the old April-new-year count is January 1774); the train's steam puffs are the same
  everywhere (`engine/train-steam` if wanted).

## In progress: Yasothon (ยโสธร), branch `city/yasothon`, draft PR #89 (owner picked it, 10 Nov)
- Brief v0 `docs/briefs/yasothon.md` (dates checked on the web from search excerpts; the province's and the
  Isaan Record's pages are outside cloud's network), research request `docs/briefs/yasothon_research_request.md`
  for [gemini], style frames `docs/briefs/yasothon_styleframes.jpg` (`src/styleframes/yasothon.tsx`).
- Covers: **A1 a giant bang fai bound by hand, swung up onto its tower (cloud's pick)**, A2 the khit axe pillow
  stuffed section by section, B Phaya Khankhak the toad king with a rocket going up. **Owner picked A1 (10 Nov).** Cloud watches PR #89.
- [gemini] answered (160efc6); cloud checked it (c114ab8). **Owner approved storyline v1 (10 Nov)**: launch 3-9 s,
  2357 and 2515 held, trade / road / grow in the town, payoff at the May festival with the toad museum (opened 10 May 2562).
  Beat table at the end of the brief.
- [local]'s map landed (ff931f5: the Chi is WEST of the town, the festival water EAST; no ONEP outline). **v1 built**
  (`src/cities/yasothon/`, soundtrack at -16 LUFS, `npm run check` 0 errors); stills `docs/briefs/yasothon_v1_contact.jpg`.
  v1b fixed what v1 flagged (owner's rule "fix what you flag").
  **Owner passed the stills and sent it to render (10 Nov).** [local] rendered v1b; its QA found 4 defects (rocket in
  the text band, boats out of scale, trucks missing, tower through the toad), all fixed in v1c with a new `tall` check.
  [local]'s v1c still QA found 4 more (cloud on the caption, tower poles in
  the text, tower over the toad, a missing truck): fixed in v1d; [local]'s
  v1d render passed, its two minor notes (empty sky at 7.6 s, small trucks) fixed in v1e. v1f (0ad6830) rendered and passed
  [local]'s QA with no defects; `yasothon_look_social.mp4` on the `renders` release. The owner saw roads through the landmarks on v1f;
  fixed in v1g with a new road-vs-landmark check. **Next: [local] renders v1g; the owner watches and says "Merge".** Post 19:00-21:00 and write the time down; the read goes in `experiments.md` §21.
- Disputed so far: the founding (2357 under Rama II in most sources; the province's page says Rama III), whether
  ยศสุนทร was granted or only proposed; no year yet for ยศสุนทร → ยโสธร or for the festival becoming the province's.
- Next: [gemini] answers the request; [local] the ONEP outline and the story places; cloud checks the answer and
  writes the storyline (launch at 3-9 s, the town small at the cover, at most two far places).

## Next
- After Yasothon, one city per session. Candidates named before: Samut Songkhram, Ang Thong (also Tak,
  Chiang Mai, Nong Khai). Hybrid loop: the owner picks the cover and passes the 0–11 s stills; cloud,
  [gemini] and [local] run research, map, build, render and QA.

## Old branches (10 Nov review, owner: "จัดการตามที่เสนอ")
- Delete, nothing lost: `city/kanchanaburi` (in main via PR #83), `exp/korat-hero` (in main),
  `claude/youthful-sagan-wnhw9o` (§20 merged via PR #88), `explainer` (16 Oct, never posted; rebuild on the
  current engine if wanted), `exp/korat-hook` (15 Oct; §19-20 settled the cover question).
- **Keep `sound/plan-v2`** (18 Oct, 338 commits behind): ~20 procedural sounds main does not have
  (`steam_train`, `diesel_train`, `ox_carts`, `phin`, `bird_call`, `fireworks`, `convoy`, `room`, ...).
  Do not merge it whole; port one sound at a time into `scripts/synth.py` when a city needs it, and listen
  for the owner's old notes (crackle, "แสบหู", the high sweep) before using it.
- **`claude/ecstatic-fermi-01603k`** (the 1minutecity Skill customer pack builder): waiting on the owner,
  keep it or drop the Skill. If kept, refresh the pack (Korat example, `check_roofs`, standard v2).

## Standing rules the owner gave in chat (also in CLAUDE.md / AGENTS.md)
- Reply to the owner in Thai. Ask before merging; the owner says "Merge".
- Posts go up between 19:00 and 21:00 (from 1 Nov).
- No paid generators; code-only audio at -16 LUFS; shader look only.
- Commits as stamp44101 with no AI attribution; GitHub comments start with [cloud] and end with the
  Claude Code footer.
- No full render until the owner passes the stills.
