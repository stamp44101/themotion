# Surin (สุรินทร์) — brief (draft)

Research: `surin_research_request.md` → `surin_research_gemini.md` (Gemini, 24 Oct 2026).

## §4 Hero — decided (owner, 25 Oct 2026): **A, the wild herd**

Style frames: `surin_styleframes.jpg` (rows A/B/C at 0, 2, 4, 8 s). The owner picked **A**: a herd
of wild Asian elephants (a tusker, cows, two calves) walking across the forest tile from frame 0;
they return in the payoff as the elephants of the round-up / the elephant buffet at the
Phraya Surin Phakdi monument. Model: `SurinElephant` in `src/styleframes/surinFigures.tsx` (moves to `src/cities/surin/` with the city: check_story treats every folder there as a city).

To do on the hero before the build: larger at frame 0 (it reads small on the whole tile),
softer legs, the herd kept in the opening clearing for the whole title.

## Dates checked so far (web, 24 Oct 2026)

| BE | event | status |
|---|---|---|
| 2302 | white elephant breaks out of Ayutthaya, caught with the Kuy headmen | from ประชุมพงศาวดาร ภาค 4 (จ.ศ. 1121); some local posts say 2303 → caption "ตามพงศาวดาร" |
| 2306 | Ban Khu Prathai raised to เมืองประทายสมันต์ | agrees (Thai Wikipedia, provincial culture office) |
| 2329 | renamed เมืองสุรินทร์ | agrees ("240 ปี เมืองสุรินทร์" in 2569) |
| 1 May 2469 | railway reaches Surin | agrees (Thai Wikipedia; station centenary 2569) |
| 19 Nov 2503 | first elephant show, Tha Tum | agrees; 2498 = first gathering, 2505 = moved into town |
| 2546 (2003) | Guinness record elephant buffet | agrees; **269 elephants**, 50 t of fruit (Nation) |
| 13 Apr 2528 | Phraya Surin Phakdi monument opened | Gemini/TAT; not yet cross-checked |

Leave out: the Thai–Cambodian border clashes and the Ta Muen / Ta Kwai temples; the
brick-spell legend of the white elephant hunt (a later addition).

Open: the inner moat's size (Gemini gives 1,000 × 1,300 m and 1,540 × 2,280 m); the ONEP
polygon (workstation).

## §1 Footprint (from `surin_onep/README.md`, PR #69)

40 m/unit (Lopburi's scale): the inner oval is 1,055 × 1,381 m = 26 × 35 units, the ONEP outer
zone 2.5 × 1.9 km, the railway, the station and the elephant ground all fit on the ±48 tile.
Origin = the **inner moat centre, 14.884570, 103.489456**; x east, z south.

- Inner moat (พุทธศตวรรษที่ 12–13, dug before the Khmer town): the six-pond hull, the NE quarter
  rounded; ~55 m wide = 1.4 units, with its earth rampart inside.
- Outer moat (Khmer, สันนิษฐานว่า พุทธศตวรรษที่ 16–18): the ONEP polygon; its north side is
  drawn along the railway, which the engine lays straight east–west (the real line rises ~8°).
- Both moats are drawn by `Landmarks.tsx`, not the engine moat: the engine digs only the first
  four edges of an outline moat (`ramp * 4` in `Water`), and Surin's oval has 12.

## §3 Story worksheet (storyline standard v1)

```
Hero (0-3 s): a wild herd (tusker, cows, calves) crossing the forest tile   BIG ✓ IDENTITY ✓ MOVING ✓
Hero sound: footfalls + a low rumble, a trumpet at 1.5 s
Open loop: why elephants? -> the elephant buffet at the monument (payoff, ~47 s)
First event (3-8 s): the herd walks past an iron-age moated village, smoke from the smelters
Spectacle (12 s): the Khmer royal road: a caravan of elephants and carts, the outer moat dug
Middle: the inner moat dug (build) / royal road (procession) / white elephant caught (discover)
        / เมืองประทายสมันต์ (build) / the railway (arrive) / the elephant show moves to town (celebrate)
Grow shot (41-46 s, 1962-2015): the town fills the outer moat and spreads to the station
Payoff (46.8-54.6 s): the elephant buffet in front of the Phraya Surin Phakdi monument, the herd back
Tagline: ถิ่นช้างใหญ่ ผ้าไหมงาม ประคำสวย (the provincial slogan)
Sub lines only: the 2329 name เมืองสุรินทร์, three cultures (Khmer, Kuy, Lao), silk
```
