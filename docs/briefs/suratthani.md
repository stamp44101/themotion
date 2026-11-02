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
