# City brief — <City name in English> / <ชื่อเมืองภาษาไทย>

Copy this to `docs/briefs/<city>.md` and fill it in **before** writing any code.
A complete brief is what lets a different agent build the city without redoing
the research, which is the expensive half of the work.

Anything still unknown stays written as `[unknown]` — never as a plausible
guess. A guess that reaches the screen is worse than a gap, because nobody
knows to check it.

---

## 1. Wall footprint

Traced from the ONEP old-town boundary PDF:
`nced.onep.go.th/opendata/.../oldtown36_announce/<province>.pdf`

That map is georeferenced to a UTM grid, so vertices convert straight to metres.
Render the map page with PyMuPDF at ~2.4x to read the grid lines.

- **Source PDF page:** <n>
- **UTM vertices (easting, northing):**
  | # | easting | northing |
  |---|---|---|
  | 1 | | |
- **Extent:** <w> m east-west x <h> m north-south (ratio 1:<r>)
- **Shape in words:** <rectangle / trapezoid / irregular — and *why*, e.g.
  "trapezoid, the river eroded the north-east corner">
- **`city.outline` in world units** (1 unit = 80 m, +x = east, +z = south,
  recentred on the footprint centroid):
  ```ts
  outline: [[x, z], ...]
  ```
- **Bounding half-extents:** `hx = `, `hz = `

## 2. Water

Dimensions in **metres first**, then converted — guessing in units is how a
190 m river ended up 350 m wide.

| river | real width (m) | units | axis | position | notes |
|---|---|---|---|---|---|
| | | | | | |

- Does a river pass **through** the walls? <yes/no> — if yes the wall needs a
  water-gate gap, which the engine does automatically from the river footprint.
- Confluences, moat relationship to the river, anything else notable:

## 3. Story beats

Every date carries a confidence level. Mark it honestly:
**confirmed** (multiple independent sources agree) · **attributed**
(sources say สันนิษฐานว่า / "traditionally dated") · **disputed** (sources
disagree — say which and why you picked one).

| CE year | event | confidence | source |
|---|---|---|---|
| | | | |

Known traps: English Wikipedia dates for Thai provincial history are sometimes
wrong where Thai sources are unanimous. Prefer Thai sources for Thai local
history and say so in the brief.

- **Era labels** (for the scrubber): 
- **Clip duration:** <60 / 75> s

## 4. Landmarks

| name | real location relative to river/walls | in-model (x, z) | appears (CE) | notes |
|---|---|---|---|---|
| | | | | |

Check each against the river footprint **including the building's own radius**,
not just its centre point, and against the city polygon.

Anything meant to be *seen* in a camera dive goes outside its building — a drone
diving at an image inside a viharn sees only roof.

## 5. Terrain and palette

- **Hills:** only where the province actually has them. If the city sits on flat
  plain, say so and leave `peaks` empty rather than adding them for composition.
- **Sky / ground colour keys:** 
- **Gloom periods** (wars, abandonment):

## 5b. Grandeur (see `docs/grandeur.md`)

- **The big thing:** a real mountain (name, height in m), the modern city (real
  extent in km², where its CBD is), or the water (river width, confluence).
  `npm run check` fails a city that ends on neither a city covering 20% of the
  tile nor a peak of 8+.
- **The shape the viewer recognises:**
- **The framing held across centuries:**
- **The last frame:**

## 6. Sound

- Regional instrument palette (`scripts/synth.py` has pad, khlui, pi reed,
  ranat, khong wong, gong, drum, ching and a bank of SFX):
- Events to hit, keyed to the **year** not the second:

## 7. Open questions

Things that could not be verified, and what would settle them. Carry these into
the handover rather than resolving them with a guess.
