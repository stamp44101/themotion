# Surat Thani (สุราษฎร์ธานี) — brief (v0, research stage)

Research: `suratthani_research_request.md` → `suratthani_research_gemini.md` ([gemini], pending).
Map: `suratthani_onep/` ([local], pending). Look: shader only. Length: 60 s. Standard: storyline v2 (0 to 100).

**This city is the owner's loop experiment (2 Nov 2569):** cloud and [local] work it through the draft PR
up to [local]'s render without stopping for the owner; where the owner would decide (the hero, the stills),
cloud picks from the owner's past choices and the reads in `experiments.md`, and writes down why here.

## Why Surat Thani next

- **The symbol that moves is the lesson of §15** (Saraburi: the deer moved, the Footprint did not). Surat
  has a symbol that *is* a living, moving thing: **the coconut monkey** (ลิงเก็บมะพร้าว), plus food symbols
  the locals name themselves (slogan: เมืองร้อยเกาะ เงาะอร่อย หอยใหญ่ ไข่แดง แหล่งธรรมะ — word for word to check).
- **A town that moved to the river mouth:** Srivijaya at Chaiya, then Tha Thong, then Ban Don at the Tapi
  mouth, named Surat Thani ("city of good people") by Rama VI in 2458 together with the Tapi river.
- **0 to 100:** a riverside village on the mud of Bandon Bay, the southern railway at Phun Phin / Tha Kham,
  the ferries to Samui, the hub of the upper south; the Chak Phra boat festival on the Tapi as the payoff.

## First dates checked on the web (2 Nov 2026; WebSearch only, the container cannot open silpa-mag/wiki)

| fact | status | source |
|---|---|---|
| Rama VI names Ban Don "Surat Thani" | ยืนยัน 2458; the day **ขัดแย้ง**: 29 Jul 2458 (the visit) vs 8 Aug 2458 (gazette) | Wikipedia (Mueang Surat Thani; gazette vol. 32 part 145); silpa-mag ?p=136896 |
| Phun Phin (Tha Kham) station opens | ยืนยัน 2458 (1915) | Wikipedia / SRT station pages |
| Tha Thong moved to Ban Don, renamed Kanchanadit | **ขัดแย้ง**: Rama III vs Rama IV (gotoknow) | gotoknow 47907; matichon |
| Chaiya + Kanchanadit merged as "Mueang Chaiya", seat to Ban Don | **ขัดแย้ง** 2440 vs 2442 | wikiwand; kupi |
| School rambutan: seed planted at Na San | 2469; the name from 2479 (school bought K. Wong's house); one source says 2480 | silpa-mag ?p=154807; khaosod |
| Chak Phra, Thot Pha Pa and long-boat races on the Tapi, end of Lent | ยืนยัน (annual; 4–12 Oct 2568) | dailynews; thansettakij |

Out (§3.6a): the Japanese landing of 8 Dec 2484 (people died, remembered), Typhoon Gay 2532, the floods.

## Hero options (cloud picks for the owner after the style frames)

- **A. The coconut monkey** (cloud's first pick): a legend-scale ลิงกัง climbs a coconut palm on the Tapi
  bank at frame 0, spins a coconut free and drops it (splash); the creature *is* the symbol, so it moves
  from frame 0. Callback in the payoff: the monkey on a palm by the Chak Phra boats.
- **B. The school rambutan:** a giant rambutan tree springing up and its fruit flushing red, hairs out.
  An object changing shape and colour, like Udon's jar (41.4%); a slogan word (เงาะอร่อย).
- **C. The Chak Phra boat:** a giant gilt Buddha barge rowed up the Tapi. Locals' own festival, but a boat
  moving is closer to Lampang's carriage (44.9%) than to the jars.

Why A first: every cover that held (Korat 32.9%, Phetchabun 37.7%, Udon 41.4%, Ratchaburi 42.0%) had the
symbol itself change or move; the creature covers (Korat) are the best ever; Saraburi failed because the
animal was not the symbol. The monkey is both.

## Style frames (cloud, 2 Nov; `src/styleframes/suratthani.tsx`, figures in `src/cities/suratthani/figures.tsx`)

Strips are frames 0, 30, 42, 66, 80 (0 / 1.0 / 1.4 / 2.2 / 2.7 s). River and bay are placeholders.
- **A1** (`suratthani_styleframes_A1.jpg`): palm 34 units on the whole tile (camera ~310); the monkey
  climbs from frame 0, is at the crown by 1.0 s, spins the coconut, drops it into the Tapi by 2.4 s; the
  handler leans back on the rope.
- **A2** (`suratthani_styleframes_A2.jpg`): the same at 24 units, camera ~230.
- **B** (`suratthani_styleframes_B.jpg`): a rambutan tree springing up, its fruit flushing red, one giant
  rambutan rolling out. Reads small on the whole tile and the event is slow.

### Cloud's pick for the owner: **A1** (loop experiment)

- The owner picked the legend-scale, whole-tile frame (A1) for every city since Phetchabun (Suphanburi,
  Udon, Nakhon Pathom, Ratchaburi, Saraburi), and has said more than once that the cover shows the land
  with a giant on it (CLAUDE.md).
- The data: creature and shape-change covers held the thumb (Korat 32.9%, Phetchabun 37.7%, Udon 41.4%,
  Ratchaburi 42.0%); Saraburi's deer failed because the symbol (the Footprint) did not move. Here the
  creature is the symbol and it moves from frame 0 (≥ 30 px/s up the trunk on the stills).
- B is an object, reads small, and its event starts late: like Gemini on Saraburi's flowers, it is kept
  for the payoff idea (rambutan in the festival), not the cover.
- For v1: the monkey bigger (~0.3 of the palm), finer fronds, the coconut landing clearly in the water,
  the monkey's face turned to camera; portrayal gentle (the 2563 PETA row over coconut monkeys: the
  handler never pulls hard, the monkey is shown working, not punished).

## Research checked (cloud, 2 Nov; Gemini's answer `suratthani_research_gemini.md`, df8eb1b)

| fact | status | caption use | source |
|---|---|---|---|
| Srivijaya at Chaiya: Phra Borommathat (~24 m, base ~13 × 10 m), the port of Laem Pho (Tang ceramics) | ยืนยัน, dated only to the 13th–14th Buddhist century | "ราว พ.ศ. 1300", no held exact year | FAD; ThaiJO (NAJUA-Arch 64951) |
| the Burmese burn Chaiya in the Nine Armies War, 2328; Siamese armies drive them out of the south (2329) | ยืนยัน that Chaiya was burned (chronicle via Gemini, Blockdit) and that the south was cleared; **the Front Palace beating them *at Chaiya* is not confirmed** | "พม่าเผาเมืองไชยา" 2328, sub "ทัพไทยยกลงมาขับพม่า" (no named commander at Chaiya) | Rattanakosin chronicle R1 (Gemini); th.wikipedia สงครามเก้าทัพ |
| a royal shipyard at Ban Don under Chao Phraya Nakhon (Noi), Rama III: timber floated down to Ban Don, warships sent to Bangkok, the royal warship อมรแมนสวรรค์ | ยืนยัน the shipyard (th.wikipedia ท่าทอง); the year ~2375 is approximate | "ราว 2375", the first village at Ban Don | th.wikipedia ท่าทอง; Gemini part 1 |
| Tha Thong moved to Ban Don and renamed Kanchanadit | ยืนยัน for Rama IV; **no year** (th.wikipedia: renamed 2410) | "สมัยรัชกาลที่ 4", the counter runs through the 2400s | Gemini; th.wikipedia ท่าทอง |
| Chaiya + Kanchanadit + Khiri Rat merged as "Mueang Chaiya", hall at Ban Don | ยืนยัน **2442** (2440 is Monthon Chumphon) | sub line only | Gemini; th.wikipedia ท่าทอง |
| Rama VI comes by royal barge to Ban Don (28 Jul 2458) and names it Surat Thani and the river Tapi (29 Jul 2458); gazette in August | ยืนยัน: the province marks 29 Jul as its name day ("111 ปี สุราษฎร์ธานี นามพระราชทาน", 29 Jul 2569) | held 2458, sub "29 ก.ค. 2458" | gazette vol. 32 pp. 149–151, 187–188 (Gemini); dailynews 6067976 |
| the southern line reaches Phun Phin (Tha Kham), 14 km W, with the 200 m Tapi rail bridge | 2458 sections open, through running **2459** | held 2459 | SRT; Tha Kham municipality (Gemini); Wikipedia station page (1915) |
| municipality 2.67 km² (7 Dec 2478) → city 68.97 km² (2550); ferries Don Sak–Samui 2524; Sri Surat bridge at the mouth 1 Oct 2556 | ยืนยัน | grow shot | suratcity.go.th; doh.go.th (Gemini) |
| Chak Phra, Thot Pha Pa and long-boat races on the Tapi at Saphan Narit at the end of Lent, 100+ phanom phra boats | ยืนยัน (annual; 4–12 Oct 2568) | payoff, held 2568 | dailynews; thansettakij; ich-thailand |
| the coconut monkey schools (Somporn Saekhow, ~2500) | ยืนยัน | the hero is undated (no caption year) | Gemini; Thai PBS 294359 |

Out (§3.6a): the Japanese landing 8 Dec 2484 and the bombing of the Tha Kham bridge, the 19 Mar 2525 bombing of
the old provincial hall, Typhoon Gay 2532, the floods. The monkey wears **no rope or chain** and no one holds a
stick (Gemini 5.2: the 2563 PETA row); monks and Buddha images are shown calm and raised (5.3).

### Gemini's hero ranking, and why cloud keeps the monkey

Gemini ranks the giant oyster (slogan "หอยใหญ่") first, the Chak Phra boat second, the rambutan third and the
monkey fourth (not in the slogan; the PETA row). Cloud keeps A1 because the reads in `experiments.md` rank by
what moves at frame 0: an object opening is the jars' 41–42% at best, a creature that *is* the symbol is the
only thing that has beaten them (Korat 32.9%), and Saraburi showed an animal that is not the symbol fails. The
oyster and the Chak Phra boat go where Gemini says they pay: oyster farms (ขนำ) in the grow shot, the boats as
the payoff. The rope is dropped: the handler stands by, the monkey works free.

## Storyline v1 (cloud, for the loop)

The town that grew from a shipyard: Srivijaya's ships in the bay, the great stupa at Chaiya, Chaiya burned in
2328, a shipyard in the teak-and-takhian forest at Ban Don, the town of Tha Thong moving in, Rama VI's barge
naming it "the city of good people", the train at Tha Kham, the town filling both banks, Chak Phra on the Tapi.
Tile: the Tapi's last ~8 km to Bandon Bay, Ban Don on the south-east bank, Ko Lamphu, the bay across the north;
far places Chaiya (NNW, across the bay, on the tile's NW shore) and Tha Kham / Phun Phin (W, the tile's west edge).

```
Hero (0-3 s): a legend-scale ลิงกัง climbing a coconut palm on the Tapi bank, spinning a coconut free and
  dropping it into the river (splash)   BIG IDENTITY MOVING SURPRISING
Hero sound: the trunk scrabble, the monkey's chirr, the coconut's spin and creak, the splash
Open loop: why a giant monkey? -> it is back on a palm over the Chak Phra boats in the payoff
First event (3-9 s, people): ราว พ.ศ. 1300, Srivijaya junks and dhows sail into Bandon Bay, close, toward
  Laem Pho (trade); the monkey and palm settle to true size
Spectacle (by 12 s): 2328, the Burmese army at Chaiya, the town burning, the Siamese army marching in (fight);
  the great stupa stands on the far shore through it (built ~1300, seen from the hero beat on)
Middle beats, one verb each: build ~2375 (warships on the slips at Ban Don, the first village) / arrive
  สมัย ร.4 (Tha Thong's boats move the town to Ban Don, the Chinese market) / procession 2458 (Rama VI's barge
  down the Tapi to the landing; Surat Thani and the Tapi named) / arrive 2459 (the train over the Tapi bridge
  at Tha Kham, the motor boats to Ban Don)
Grow shot (~39-46 s, 2478-2565): the town fills the south-east bank, Ko Lamphu park, the oyster farms in the
  bay, ferries heading out NE to Samui, the Sri Surat bridge over the mouth
Payoff (~47-54 s, people + hero back): Chak Phra: phanom phra boats towed down the Tapi past Saphan Narit,
  long boats racing, crowds on the embankment; the monkey on a palm on Ko Lamphu
Tagline: "เมืองร้อยเกาะ เงาะอร่อย หอยใหญ่" (slogan, first three phrases)
Facts with nothing to show (sub lines only): Kanchanadit → Mueang Chaiya 2442; the name after Surat and the
  Tapti in India; school rambutan 2469; Suan Mokkh 2475
```
