# Suphanburi (สุพรรณบุรี) — brief (draft)

Research: `suphanburi_research_request.md` → `suphanburi_research_gemini.md` (Gemini via Antigravity CLI,
27 Oct 2026, the first city to use the in-repo Gemini step). Look: shader only. Length: 60 s.
Pins and the river: waiting on the workstation (PR #73, [local] tasks). The positions below are
Gemini's and only good to a few hundred metres.

Cover rule (experiments §8–9): **an event in the first 1–2 s**, the hero filling the middle of the
cover frame; a walk or a glide is not enough. The payoff brings the hero back.

## §4 Hero — decided (owner, 27 Oct 2026): **A, the ยุทธหัตถี**

Style frames (`suphanburi_styleframes_A1.jpg`, `_A2.jpg`; 0, 0.5, 1, 4.5, 8 s): the two war elephants at
legend scale on the whole tile (A1 8x, A2 6x), already charging at frame 0, meeting tusk to tusk at
0.55 s under a golden flash where the glaives cross, dust bursting; the Siamese elephant drives the
other aside and the bell stupa rises behind. Models in `src/styleframes/suphanburiElephant.tsx`.
The counter reads พ.ศ. 2135 (18 Jan 2135 BE is January 1593 CE, before the old Thai new year).

The options as offered:

| | the first second | the payoff (callback) | for | against |
|---|---|---|---|---|
| **A (recommended)** | ยุทธหัตถี: two caparisoned war elephants charge from left and right and meet tusk to tusk in a burst of dust and golden light; the royal elephant drives the other aside; the Don Chedi stupa rises on the field | งานอนุสรณ์ดอนเจดีย์ (every 25 Jan since 2502; the elephant re-enactment since 2523): the two elephants meet again in the show before the stupa, at night with lights | the province's motto opens with "เมืองยุทธหัตถี"; a collision at frame 0 is the strongest cover event we have had; the whole country knows it | a royal figure: the riders stay small, no faces, no weapon strikes a body, nobody falls (research §5.3); Don Chedi is ~19 km NNW of the town, so the cover plays on the far corner of the tile (as Korat's Phimai) before the camera flies to the town |
| B | the 135 m dragon of the Dragon Descendants Museum dives out of the clouds and coils round the city pillar shrine | the dragon building at the pillar shrine, Chinese New Year crowds | full-frame motion like Ubon's naga; it stands in the town itself | a modern building (opened ~2551, unverified), not a legend; the length and year are not confirmed on the web |
| C | ขุนแผน chants under the giant tamarind at Wat Khae; the leaves turn into a swarm of golden wasps that fly at the camera; he rides off on ม้าสีหมอก | Wat Khae and the tamarind today | literature everyone knows; fantasy like Lopburi's Hanuman | fiction, not history; the swarm reads as a threat |

## v1 as built (27 Oct 2026, 60 s, shader look): `src/cities/suphanburi/`

Contact sheet: `suphanburi_v1_contact.jpg` (0, 0.5, 5, 7, 10, 15.7, 21.3, 28, 33, 40, 46, 53 s). 50 m/unit,
origin the city pillar; the town is ONEP zone 1; Don Chedi is drawn on the tile's north-west corner on
its bearing (323 vs 330 degrees), the duel's stupa south of the field so the cover's camera (north,
looking south) sees the giants, the stupa, the town and the Tha Chin together.

| beat | kind | s | year (BE) | on screen | caption hedge |
|---|---|---|---|---|---|
| hero | fight | 0–7.4 | 2135 (hold) | the giants (8x) charge, clash, the stupa rises; they settle to the field's scale | site named หนองสาหร่าย, no argument |
| palelai | build | 7.7–12.6 | 2398–2409 | Luang Pho To on its base, scaffold, the hall's walls rising (open on the camera side) | "ราวสมัยรัชกาลที่ 4" |
| royal | procession | 13–18.6 | 2447 (hold) | the barge and six boats up the Tha Chin to Wat Khae | 4 Aug 2447 confirmed (Silpa-mag, The Bangkok Insight) |
| found | discover | 19–24.6 | 2455–2457 | diggers clear the overgrown mound at Don Chedi | no year ("สมัยรัชกาลที่ 6") |
| boats | trade | 25–30.6 | 2468–2488 | red two-deck mail boats up and down past the town | no year, no boat names (not confirmed) |
| road | arrive | 31–36.4 | 2493–2508 | Malaiman road through the west gate, buses and cars | no year |
| growth | grow | 36.8–42.6 | 2509–2561 | wide: the town over both banks, the tower, the dragon | no years (dragon's not confirmed) |
| payoff | celebrate | 43–52.6 | 2568 | the fair: two elephants (2.2x) charge and meet twice before the stupa, crowd, lights | no year |

The railway (Gemini: 16 Jun 2506) is left out: not confirmed on the web.

## Story sketch for A (draft, before the build)

Everything older than 2135 stands on the tile at frame 0: the Ayutthaya-era town on the west bank of
the Tha Chin with Wat Mahathat's prang, Luang Pho To's temple south of it, the double earth ramparts
on the west side (the river-side wall was razed in the 16th century), Wat Khae on the bank.

| beat | kind | year (BE) | on screen |
|---|---|---|---|
| hero | fight | 2135 (hold) | the duel at Don Chedi, the stupa rises (caption: ยุทธหัตถี ณ ตำบลหนองสาหร่าย, 18 ม.ค. 2135) |
| boats | procession | 2447 | Rama V's boat trip up the Tha Chin, the stop at Wat Khae's landing under the tamarind (4 Aug 2447) |
| rediscover | discover | 2456 | the jungle cleared at Don Chedi, the old stupa base found (Phraya Pariyat Sarutaphani) |
| mailboats | trade | 2446–2504 | the red two-deck mail boats up the river to Sam Chuk, the riverside market |
| water | build | 2464–2475 | the Pho Phraya water gate across the Tha Chin; the plain turns to paddy |
| road | arrive | 2493–2506 | Malaiman road from Nakhon Pathom; the railway to Suphanburi (opened 16 Jun 2506) |
| growth | grow | 2507–2560 | the town spreads to the east bank; Banharn-Jamsai tower (2533–2537, 123.25 m); the new provincial hall |
| payoff | celebrate | 2569 | the Don Chedi fair at night: the re-enactment, the two elephants meet again before the stupa |

## Dates checked so far (web, 27 Oct 2026)

| BE | event | status |
|---|---|---|
| 18 Jan 2135 | ยุทธหัตถี | agrees: the chronicle's date (แรม 2 ค่ำ เดือนยี่ จ.ศ. 954) computed to 18 Jan by ล้อม เพ็งแก้ว; Cabinet moved Armed Forces Day from 25 to 18 Jan on 22 Aug 2549 (Silpa-mag, Khaosod, Gotoknow). The site is disputed (หนองสาหร่าย, Suphanburi vs ตะพังตรุ, Kanchanaburi): caption names หนองสาหร่าย / ดอนเจดีย์ without arguing |
| 25 Jan 2502 | Don Chedi monument opened by Rama IX; the fair held every year since | agrees (Daily News, TrueID, Sarasatr journal); the elephant re-enactment since 2523; 2569 is the 67th fair |
| 2091 | the town walls of Suphanburi, Lopburi and Nakhon Nayok razed | partly: one source gives 2091 under Maha Chakkraphat, others tie it to a different war → no year in a caption |
| 2551 | Dragon museum opened, 135 m | not found on the web (Gemini only) |
| 2447 | Rama V at Wat Khae | Gemini only, cites Damrong's travel record → to check |
| 16 Jun 2506 | railway to Suphanburi | Gemini only → to check |

Leave out (research §5.6): the 2534 Lauda Air crash, the 2555 firework accident at the dragon park, the
2567 firework factory explosion; and present-day politics (the tower and roads are shown, not who
built them).
