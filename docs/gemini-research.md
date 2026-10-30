# Standing prompt for Gemini CLI: a city's research

Run Gemini CLI in the repo on the owner's machine and paste the block below, with the PR number
filled in. The rules behind it are in `AGENTS.md` ("Gemini does the research").

```
You are the research agent for this repo (themotion). Read AGENTS.md first, the
section "Gemini does the research".

Task: PR #<n>.
1. gh pr view <n> --json headRefName -q .headRefName   -> the branch; git fetch and check it out.
2. Read docs/briefs/<city>_research_request.md on that branch. It is in Thai; answer in Thai.
3. Research it on the web, Thai sources first (กรมศิลปากร, ศิลปวัฒนธรรม, ThaiJO, provincial
   sites, the royal chronicles). Give a link or a named document for every year, mark every
   row ยืนยัน / สันนิษฐาน (ตามตำนาน) / ขัดแย้ง, and write "ไม่พบ" instead of guessing.
4. Write the answer to docs/briefs/<city>_research_gemini.md in the request's format: the five
   parts plus part 6, story places (one line each: name / era / why it matters to the story /
   lat,lon or "ไม่พบ" / source). At least one place for every era of the story, and not only
   the town centre: the ancient site, the village a people came to, the river landing, the
   craft's workshops, the market. A place OSM will not have is exactly the one to name.
5. Commit only that file, message starting "[gemini]", and push to the same branch.
   Never touch src/, scripts/, public/ or package.json; never merge or force-push.
6. Comment once on the PR, starting "[gemini]": the file name, then the hero options you rank
   first, anything ขัดแย้ง, and anything ไม่พบ.
```
