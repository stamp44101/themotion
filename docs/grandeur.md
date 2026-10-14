# Grandeur — what makes a clip look as big as Chiang Mai

> **สรุป:** ความอลังการไม่ได้มาจากการเรนเดอร์ แต่มาจากสเกล คือของเล็กจำนวนมาก
> (ต้นไม้ บ้าน ตึก) ที่อยู่ใต้ของใหญ่ชิ้นเดียว (ภูเขา เมืองทั้งเมือง) แล้วได้เห็นมันเปลี่ยนไป
> ในกรอบภาพเดิม ทุกเมืองต้องมี "ของใหญ่" อย่างน้อยหนึ่งอย่างที่เป็นของจริงของจังหวัดนั้น

The owner compared the Chiang Mai clip with Nakhon Sawan and found that Chiang Mai
"feels far grander". Both use the same engine, the same tree size and the same
tree count (3,400). Every difference below was found by putting frames from the
same seconds side by side and measuring the layouts.

## Measured

| city | old town / tile | city at the end / tile | highest peak | modern buildings at the end | how it reads |
|---|---|---|---|---|---|
| **chiangmai-iso (reference)** | 4.3% | **46%** | **20** | **476** | grand |
| phitsanulok | 4.8% | 46% | 11 | 460 | good |
| korat | 3.1% | 44% | 14 | 489 | good |
| ayutthaya | 5.9% | 40% | 0 | 297 | good |
| sukhothai | 4.1% | 6% | 14 | 15 | good (the mountains carry it) |
| nakhonsawan | 0.9% | **2%** | 3.4 | **4** | "toy garden" |
| chachoengsao | 0.3% | 2% | 0 | 15 | small |

The table sorts the cities into two groups. Every clip that reads well ends on a
big thing, either a modern city covering 40%+ of the tile or a mountain at least
11 high. Both weak clips end on neither.

## The five levers, strongest first

### 1. Scale contrast: small things under one big thing
The tile is ~92 units across, which is 7.4 km at 80 m/unit. When the city covers
1% of it, the camera has to come close to show it. Then the trees fill the frame
and look big, and the whole clip reads like a garden. When the city is big, the
camera stays far out, the trees become a fine carpet, and the eye reads
"enormous world".
- Don't enlarge a historical footprint to fake this. The old town is what it was.
- Grow the **modern** city to its real extent. A provincial capital today covers
  tens of km², a large share of the tile. Measure it on a map, then set
  `urban`, `urbanBox` and `towers` so the finale shows it: drop `urbanBox` or
  widen it, lower `urban.rate`, and add a `towers` box over the real CBD.
- Nakhon Sawan's `urbanBox` (16×22 units) and the river and old town inside it
  left 6 cells to build on. The clip ended on 4 buildings in a dark grid.

### 2. One shape the eye recognises
Chiang Mai is a square inside a moat with a chedi in the middle. From any
distance you know it is a city, and one framing tells the whole story: empty
forest → the square appears → the houses fill it → it is abandoned → it is
reborn.
- Pick the city's signature shape in the brief: a moated square, a river
  confluence, a hilltop, a wall following a river.
- Give it at least one shot that holds the **same framing** across centuries,
  so the viewer sees it change in place.

### 3. A hero backdrop that is really there
Doi Suthep, 20 units high, is the first image of the Chiang Mai clip and still
towers behind the finale. Nakhon Sawan's hills are 1.8–3.4 units high and read as
bumps.
- Hills go only where the province has them (CLAUDE.md, plausibility
  checklist). Where there are real mountains, use their real height. Elevation
  in metres ÷ 80 gives units, and a little vertical exaggeration (1.5–2x) is
  normal for dioramas. Place them where the camera's wide shots will have them
  behind the city.
- On flat plains the hero has to be the city itself (lever 1) or the water: a
  wide river, a confluence, a moat. Ayutthaya, an island ringed by rivers, works
  this way.

### 4. The finale is a sea of lights
Chiang Mai ends at dusk on hundreds of lit windows filling the tile, with the
mountain behind. That last image is what people remember and replay.
- Lever 1 is what makes this possible. With 4 buildings there is nothing to
  light.
- End wide, so the whole lit city is in frame with the hero behind it. Chiang
  Mai's last key is 240 units out at 27°, low enough that Doi Suthep rises behind
  the lights.

### 5. Camera high enough to see the city, not the forest
Chiang Mai's keys stay at 26–40° elevation, mostly 60–220 units out, with the
whole square in frame. Nakhon Sawan's landmark beats (9–21 s and 38–44 s) sat at
24–26° and 48–58 units, so most of the frame was tree crowns.
- Keep wide and establishing shots at ≥ 30° elevation.
- Go below 30° only when the line of sight crosses water or open ground (see
  "Low cameras look through forest" in CLAUDE.md).

## Before you build: grandeur in the brief
Answer these in `docs/briefs/<city>.md` (section "Grandeur" in the template):
1. **What is the big thing?** A real mountain (name and height in metres), the
   modern city (its real extent in km²), or water (river width, confluence).
2. **What shape will the viewer recognise?**
3. **Which framing do we hold across centuries?**
4. **What does the last frame show?**

If the answer to 1 is "nothing", say so before anything is built, and pick a
framing that leans on the city's growth. It may also be the wrong city for this
format.

## Enforced by `npm run check`
- **Error:** at the end of the clip, the city (old town + urbanised cells) covers
  less than 20% of the tile **and** no peak reaches 8. Nakhon Sawan and
  Chachoengsao were posted before this rule and only warn.
- **Warning:** the old town covers less than 3% of the tile. That is history and
  cannot be fixed, so frame the early beats tighter and higher.

Thresholds sit in `GRANDEUR` at the top of `scripts/check_story.mjs`. All five
clips the owner likes pass them.
