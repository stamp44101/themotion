# Storyline standard (v1, 19 ตุลาคม 2569)

What every reel's story must do so viewers do not leave, and so each new city starts with a
hook that has a chance. It is built from the posts measured in `docs/experiments.md` and the
owner's notes, not from taste. Every city from Phetchaburi on declares
`buildStory({standard: 1, ...})`, which turns on the checks in `scripts/storyline.mjs`
(part of `npm run check`).

Read §1 once. Use §2, §5 and §7 (v2, the 0-to-100 spine) every time.

## 1. What the numbers say

| reel | frame 0 | skip (first 3 s) | kept at 3 s | kept at 17 s | avg watch | shares |
|---|---|---|---|---|---|---|
| baseline, 10 clips | forest tile | ~52% | — | — | 9–25 s | — |
| Korat | three big dinosaurs, walking | **32.9%** | ~67% | ~35% | 21 s | 1.3% |
| Nakhon Si (75 s) | whole tile, the relic boat a speck | 43.1% | ~57% | ~31% | 21 s | 0.8% |
| Lampang | a big horse carriage, standing | 44.9% | ~60% | ~30% | 18 s | 1.2% |
| Khon Kaen | the stupa at hero scale, standing; a small dinosaur at the edge | 44.7% | ~59% | ~34% | 19 s | 1.4% |
| Phetchaburi (standard v1) | Khao Wang and a hill-sized tray, a piece lifting | 50.4% | ~51% | ~24% | 15 s | 0.7% |

1. **The hook is the hero at frame 0, and only one kind of hero worked.** Korat's dinosaurs were
   big, surprising (prehistoric animals on a city tile), moving (they walk), and tied to what
   people know about Korat. Lampang's carriage was big and tied to the city, but stood still and
   surprised no one: 44.9%, no better than Nakhon Si's speck of a boat.
2. **Between 3 s and 17 s every clip loses about half of the people the hook kept.** Korat lost
   them during archaeology with no people in it (Ban Prasat, Sema, Phimai). From the town and the
   armies on (18 s+), people stayed.
3. **After 17 s the curve is almost flat.** Whoever is still there at 17 s mostly finishes.
4. **Average watch is about 20 s, so most viewers never see the ending.** What the city is known
   for has to be on screen at the start. The ending is the reward for those who stay.
5. **75 s loses people in the last 10 s** (Nakhon Si). 60 s is the owner's rule.
6. **Shares follow the city's own symbols.** They were 1.2–1.4% when its best-known symbol was on
   screen (Korat, Lampang, Khon Kaen), but only 0.7% for Phetchaburi's ขนมหม้อแกง, so this is weak and 0.8% when it was not (Nakhon Si). Locals comment to add what they
   know (Lampang's "three towns" comment).
7. **The owner's notes:**
   - the cover is a green tile with one standout thing on it; the finale-first opening was
     rejected because it breaks the grid;
   - a list of dates over forest is boring (Nakhon Si v1);
   - the ending must not cut to the present with the counter running through years that mean
     nothing (Khon Kaen v1);
   - the finale needs a tagline;
   - every beat needs something happening on screen.

## 2. The shape of a 60-s reel

| seconds | slot | what has to be on screen |
|---|---|---|
| 0–3 | **Hook** (the cover) | the whole green tile with one hero, under the title |
| 3–9 | **First event** | people or animals doing something, ending ≤ 6.5 s after the title; the oldest era, compressed |
| 9–18 | **Spectacle** | the clip's biggest event: a war, a siege, a disaster, a mass procession |
| 18–45 | **Middle** | 3–4 beats, each a different verb, each with something moving; one wide shot where the city visibly grows |
| 45–54 | **Payoff** | today's identity, with people, and the hero back again (the open loop closes) |
| 54–56 | **Landing** | the counter reaches today and holds |
| 56–60 | **Finale card** | the city's name with a tagline, lights or fireworks |

The order of events stays chronological, because that is the format. Chronology decides what
happens; this table decides how long each thing gets and how it is shown.

## 3. The rules

### 3.1 Hook and cover (0–3 s)
- **Frame 0 shows the whole tile with one hero on it**, centred under the title: x between 20%
  and 80% of the frame, y between 50% and 85%. *(checked)*
- **The hero scorecard.** The hero must be:
  - **BIG:** readable on the whole-tile shot (≥ 80 px; aim for 150+);
  - **IDENTITY:** something the province is known for, from its slogan, its food or its landmark.

  It must also have at least one of:
  - **MOVING** within the first second;
  - **SURPRISING:** out of scale, out of era, or impossible.

  Korat had all four. Lampang had only the first two.
- **Measure the motion.** On two stills 1 s apart, the moving part travels ≥ 30 px. Phetchaburi's
  first lifting piece moved 5 px, which no viewer sees. A camera push-in does not count; the
  hero itself has to move.
- **The first sound belongs to the hero,** within 0.5 s: a footfall, an engine, a knife going
  through custard.
- `intro.sub` names the identity the hero shows.
- **Hero menu,** strongest first:
  1. a creature or fossil found there;
  2. a giant local food or product, doing something;
  3. a vehicle the city is known for, moving;
  4. the landmark at hero scale, building itself up.

### 3.2 The open loop
- The hero comes back in the payoff, at ≥ 40% of the clip, and a callout names it. *(checked)*
- The cover makes viewers ask why that thing is there; the payoff answers it, and pays the
  people who stayed. Examples: Lampang's carriage returned in 1916, and Khon Kaen's dinosaurs
  returned at the dig.

### 3.3 The danger zone (3–17 s)
- **The first beat is short and has people in it:** ending ≤ 6.5 s after the title, with people or
  animals moving. Stones rising on their own do not count. A legend gets one short beat, never
  two.
- **The spectacle starts by 12 s** when the chronology allows. If the oldest era is calm,
  compress it and jump. *(warned)*
- **Something moves on screen for ≥ 70% of 3–17 s.** Moving things are registered actors.
  *(checked)*

### 3.4 Pace (17–50 s)
- **Every beat has an actor:** something moving or being built, registered in `actors.ts`.
  Stones rising count while they rise.
- **No dead air:** never more than 4 s without an actor on screen between the title and the
  finale card. *(checked)*
- **Beats run 4–10 s** each, with a 1–1.5 s camera hold as each caption lands.
- **One verb per beat** (`kind`): `legend`, `build`, `fight`, `disaster`, `procession`, `arrive`,
  `trade`, `discover`, `grow`, `celebrate`, `today`. No two beats in a row with the same kind,
  ≤ 2 `build`, ≥ 4 different kinds. Three palaces rising one after another is one beat told
  three times. *(checked)*
- **One `grow` beat, as a wide shot, where the city visibly spreads.** That is the timelapse
  pleasure the format promises. The counter may only run fast while the picture changes.

### 3.5 The ending (the last 12 s)
- **The payoff beat** shows today's identity with people (a fair, a crowd), and the hero returns.
- **The counter reaches today and holds ≥ 1 s** before the finale card. In the last 12 s there is
  at most one jump of more than 20 years. *(checked)*
- **The finale card carries a tagline,** taken from the provincial slogan or a line of local
  pride, never only a date range. *(checked)*

### 3.6 Captions
- **A title is one line, and a claim or a surprise rather than a label:**
  - "ปราสาทขอมในเมืองเพชร", not "ยุคเขมร";
  - "วังบนเขาของรัชกาลที่ 4", not "พระนครคีรี".
- **Reading speed:** sub and note together stay at or under 12 Thai characters per second on
  screen. Tone and vowel marks are not counted. *(warned)*
- **A fact with nothing on screen goes in a sub line, not a beat.** An attributed fact carries
  สันนิษฐานว่า or ราว.

### 3.6a What we do not show (owner, 20 ต.ค. 2569)
- **In:**
  - natural events with little loss of life or property (a landslide on empty hillside, a river
    changing course, lightning splitting a chedi);
  - wars and battles centuries back, which are the town's history, shown as armies meeting and
    never as violence.
- **Out:**
  - anything within living memory that killed or injured people or cost many their homes;
  - anything else that still hurts the people who live there, however strong the picture.

  Chiang Rai: the 2485 bombing, the 2557 earthquake, the 2567 flood and Tham Luang are out.

### 3.7 Sound
- The hero's sound comes first.
- Every event gets its SFX on the beat.
- Ambience is a sequence of places, 8–12 dB under the score.
- Nothing harsh above 5 kHz (the owner disliked sharp highs).
- The whole mix is mastered to −16 LUFS (CLAUDE.md, `synth.master`).

### 3.8 Length
- 60 s. A 75 s cut only when the extra time is action.

## 4. What `npm run check` enforces (`standard: 1`)

`scripts/storyline.mjs`, errors unless noted:

| rule | threshold |
|---|---|
| a `hero` actor stands from 0 s, centred under the title | x 20–80%, y 50–85% for ≥ 70% of 0–2 s |
| a `callback` actor (the hero returning) | starts at ≥ 40% of the clip |
| something moves in the danger zone | actors in frame ≥ 70% of 3–17 s |
| no dead air | ≤ 4 s without an actor in frame, from the title to the finale card |
| every beat has a `kind` | from the list in §3.4 |
| verbs vary | no two consecutive kinds alike (`today` exempt); ≥ 4 kinds (warn); ≤ 2 `build` (warn) |
| the spectacle comes early | a `fight` / `disaster` / `procession` / `celebrate` beat by 12 s (warn) |
| the first beat is short | ends ≤ 6.5 s after the title (warn) |
| beats run 4–10 s | captioned beats (warn) |
| the landing | the counter shows today for ≥ 1 s before the finale card |
| no meaningless counter run at the end | ≤ 1 jump > 20 years in the last 12 s (warn) |
| the finale has a tagline | `finale.sub` is words, not dates |
| reading speed | sub + note ≤ 12 Thai characters per second (warn) |
| length | over 60 s (warn): only when the extra time is action (§3.8) |

What a script cannot judge (surprise, identity, verbs that are honest) is the reviewer's job
on the contact sheet: AGENTS.md, "Nothing ships unreviewed".

## 5. Worksheet: fill it in the brief (§3) before writing code

```
Hero (0-3 s): ............  BIG  IDENTITY  MOVING  SURPRISING   (tick; at least 3)
Hero sound: ............
Open loop: what the hero makes viewers ask -> where it is answered (s): ............
First event (3-9 s, people): ............
Spectacle (by 12 s): ............
Middle beats, one verb each: ............ / ............ / ............
Grow shot (s, years): ............
Payoff (45-54 s, people + hero back): ............
Tagline: ............
Facts with nothing to show (sub lines only): ............
```

## 6. Measure every post

Record in `docs/experiments.md`, about 24 h after posting:
- skip rate;
- average watch;
- retention at 3 s, at 17 s and at the end (read off the curve);
- shares;
- follows.

Change one new thing per city after this standard. Phetchaburi is the first city built to it,
so it tests the standard as a package against Korat and Lampang. The number it has to move is
**retention at 17 s**, which was 30–35% on every clip so far.

## 7. Standard v2: the town grows from 0 to 100 (owner, 27–29 ต.ค. 2569)

Phetchabun, the Suphanburi v1 cut and the clips before them all passed v1 and still felt flat to the
owner: the town stood full at frame 0, the camera hopped between far-off places, and growth was squeezed
into one 6-s beat. The owner's reference is Chiang Mai: **you watch a place go from nothing to a city.**
Suphanburi was rebuilt to it (v2), and Udon Thani was the first city built to it from the start.

Rules (on top of §2–§6; the script does not test them yet, so the contact sheet does):
1. **Start small.** At the cover the tile is mostly forest, water and fields: the town is a camp, a
   village or a sparse old town (Suphanburi: ~13% of its houses in 2135; Udon: forest and the lake).
   Set `houses.built` so the town fills *during* the middle beats, not before frame 0.
2. **The middle happens in the growing town.** Each middle beat's event (a procession, a train, a
   market, an airfield) stands in or at the edge of the town, so every beat also shows it bigger.
3. **At most two far places** (a landmark tens of km out: Don Chedi, Ban Chiang). A third far beat is
   cut or folded into a sub line (Suphanburi v2 dropped "พบซากเจดีย์" into the payoff's sub).
4. **Wide shots come back:** at least three wide or medium-wide shots of the same town from a similar
   side (the cover, one in the middle, the grow shot, the landing), so the growth reads as a before
   and after.
5. **The landing is the whole tile again,** at the cover's distance, now full of city: the 0 and the
   100 in one clip.
6. **The grow beat is long** (≥ 7 s) and wide (distance ≥ 160), the counter running fast only while
   blocks are visibly going up.

What the first read says (`experiments.md` §11): Suphanburi v2's like, save, share, repost and
comment rates were all above a typical reel, the first time since Lopburi, while its skip rate (44%)
was worse than Phetchabun's (37.7%): the spine pays the people who stay, and the hook still has to
be won by the cover (§3.1, CLAUDE.md "The cover shows the land, with a giant on it").
