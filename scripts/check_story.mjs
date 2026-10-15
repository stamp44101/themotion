// Pre-render checks for every city: the timing mistakes that only show up on screen.
// Usage: node scripts/check_story.mjs [city ...]   (no args = every folder in src/cities)
// Exits 1 on any error. Warnings are printed but do not fail.
//
// Each rule here is something that shipped broken at least once -- Chachoengsao's
// first caption started at 2 s, under the intro title, and nobody saw it until the
// video was on TikTok.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import './node_guard.mjs';
import {buildSync} from 'esbuild';
import {cameraStats} from './camera_stats.mjs';
import {occlusion} from './occlusion.mjs';
import {textWidth} from './textwidth.mjs';

const lib = await load('src/lib.ts');
const engine = {...(await load('src/engine/world.ts')), ...(await load('src/engine/camera.ts'))};
const roads = await load('src/engine/roads.ts');
const geoLib = await load('src/engine/geo.ts');
const {INTRO_END, FINALE_LEAD, SECONDS, makeCurve} = lib;
const MIN_CAPTION = 2.5; // seconds on screen; shorter cannot be read in Thai at this size
const COLUMN = 820; // caption column width in px (Overlay: SAFE.left..SAFE.right)
// Camera rhythm floors. Every approved city clears them; see camera_stats.mjs for
// what each number means and the review that set them.
const CAM = {maxZoom: 0.65, minOrbit: 0.15, minAzSwept: 300, minMidWide: 100};
// Cities that predate the camera rule. Re-tune their keys, then remove them here.
const CAMERA_WAIVED = new Set(['chachoengsao']);
// Posted before the cars-on-water rule; the owner is not re-rendering them. Its ring
// road's west side lies in the Bang Pakong. Warn only.
const WATER_WAIVED = new Set(['chachoengsao']);
// Grandeur floors (docs/grandeur.md). The clip must end on something big: today's city
// filling the tile, or a real mountain. Chiang Mai, the owner's reference, ends with
// walls + modern city on 46% of the tile and a 20-high Doi Suthep behind; Nakhon
// Sawan ended on 4 buildings (2%) and read as a toy. Posted before the rule, warn only:
const GRANDEUR = {minFinaleShare: 0.2, heroPeak: 8, minOldTown: 0.03};
const GRANDEUR_WAIVED = new Set(['chachoengsao', 'nakhonsawan']);
// A year named in a caption (พ.ศ.) must be on the counter for at least this long while
// the caption is up. Chonburi's Bang Saen caption said พ.ศ. 2486 while the counter ran
// 2490-2523; Ayutthaya's "7 เมษายน 2310" counter left 2310 within a second.
const YEAR_HOLD = 1.0;
// Posted before the year-hold rule; the owner is not re-rendering them. Warn only.
const YEAR_HOLD_WAIVED = new Set(['ayutthaya', 'chachoengsao', 'chonburi', 'nakhonsawan', 'phitsanulok', 'sukhothai']);
// Compass directions between real places (src/engine/geo.ts): a pair whose model
// bearing is off by more than this fails. Chonburi put the Gulf east of the town.
const GEO_MAX_DIFF = 30;
// Posted before geo anchors existed; the owner is not re-rendering them. Warn only.
const GEO_WAIVED = new Set(['ayutthaya', 'chachoengsao', 'chonburi', 'nakhonsawan', 'phitsanulok', 'sukhothai']);
// Cities built before briefs existed.
const NO_BRIEF_OK = new Set(['ayutthaya', 'korat', 'phitsanulok', 'sukhothai']);

const root = fs.readFileSync('src/Root.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// Landmark reels (src/landmarks/<name>) get the story checks; the city-layout checks
// (camera floors, grandeur, rivers, rail, cars, terrain, trees) do not apply to them.
const dirOf = (c) => (fs.existsSync(`src/landmarks/${c}`) ? 'landmarks' : 'cities');
const cities = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [...fs.readdirSync('src/cities'), ...(fs.existsSync('src/landmarks') ? fs.readdirSync('src/landmarks') : [])].sort();

let errors = 0;
let warnings = 0;
for (const city of cities) {
  const out = [];
  const err = (m) => out.push(`  ERROR ${m}`);
  const warn = (m) => out.push(`  warn  ${m}`);
  const dir = dirOf(city);
  const mod = await load(`src/${dir}/${city}/index.ts`);
  const cfg = Object.values(mod).find((v) => v && v.story && (v.layout || v.landmark));
  if (!cfg) {
    console.log(`${city}\n  ERROR src/${dir}/${city}/index.ts exports no CityConfig`);
    errors++;
    continue;
  }
  const {story, layout, callouts} = cfg;
  const D = story.duration ?? SECONDS;
  const finale = D - FINALE_LEAD;
  const s = (x) => `${+x.toFixed(2)}s`;

  // captions
  const caps = [...story.captions].sort((a, b) => a.t0 - b.t0);
  caps.forEach((c, i) => {
    const name = `caption "${c.title}"`;
    if (c.t0 < INTRO_END) err(`${name} starts at ${s(c.t0)}, under the intro title (gone at ${s(INTRO_END)}). Set t0 >= ${INTRO_END}.`);
    if (c.t1 > finale) err(`${name} ends at ${s(c.t1)}, under the finale title (starts at ${s(finale)}).`);
    const next = caps[i + 1];
    if (next && c.t1 > next.t0) err(`${name} (until ${s(c.t1)}) overlaps "${next.title}" (from ${s(next.t0)}).`);
    const shown = c.t1 - Math.max(c.t0, INTRO_END);
    if (shown < MIN_CAPTION) warn(`${name} is on screen ${s(shown)}; under ${MIN_CAPTION}s is hard to read.`);
    // A title that wraps drops its last word -- usually the year -- onto a line of its own.
    const tw = textWidth(c.title, 74, 600);
    if (tw > COLUMN) err(`${name} is ${Math.round(tw)} px wide and wraps (column ${COLUMN} px). Shorten it or move the year into the sub.`);
    const sl = Math.ceil(textWidth(c.sub, 40, 400) / COLUMN);
    if (sl > 3) warn(`${name}: sub runs to about ${sl} lines; the block runs down into the diorama.`);
  });

  // a named year is on the counter while its caption is up
  for (const c of caps) {
    const years = new Set([...`${c.title} ${c.sub}`.matchAll(/(?<!\d)(1[6-9]\d\d|2[0-5]\d\d)(?!\d)/g)].map((m) => +m[1]));
    for (const be of years) {
      const ce = be - 543;
      let held = 0;
      for (let t = Math.max(c.t0, INTRO_END); t < c.t1; t += 1 / 30) if (Math.abs(story.yearAt(t) - ce) <= 1) held += 1 / 30;
      if (held < YEAR_HOLD) {
        const shown = `${Math.round(story.yearAt(c.t0) + 543)}-${Math.round(story.yearAt(c.t1) + 543)}`;
        (YEAR_HOLD_WAIVED.has(city) ? warn : err)(
          `caption "${c.title}" names พ.ศ. ${be} but the counter shows it for ${s(held)} (counter runs ${shown}; need >= ${YEAR_HOLD}s). Hold the year curve at ${ce} through the caption, then speed up between captions.`,
        );
      }
    }
  }

  // callouts
  for (const c of callouts) {
    if (c.t0 < INTRO_END) err(`callout "${c.label}" starts at ${s(c.t0)}, under the intro title.`);
    if (c.t1 > finale) err(`callout "${c.label}" ends at ${s(c.t1)}, under the finale title.`);
    if (c.t1 <= c.t0) err(`callout "${c.label}" has t1 <= t0.`);
  }

  // year curve: never runs backwards, and covers the whole video
  let prev = -Infinity;
  for (let t = 0; t <= D; t += 1 / 30) {
    const y = story.yearAt(t);
    if (!Number.isFinite(y)) {
      err(`yearAt(${s(t)}) is not a number.`);
      break;
    }
    if (y < prev - 1e-6) {
      err(`year curve runs backwards at ${s(t)} (${prev.toFixed(1)} -> ${y.toFixed(1)}).`);
      break;
    }
    prev = y;
  }
  for (const e of story.eras ?? []) if (e.t < 0 || e.t > D) err(`era "${e.label}" at ${s(e.t)} is outside the video (0-${D}s).`);

  // camera keys cover the video
  const keys = (layout ?? cfg).cameraKeys;
  if (keys[0][0] > 0) err(`first camera key is at ${s(keys[0][0])}, not 0.`);
  if (keys.at(-1)[0] < D - 0.5) warn(`last camera key is at ${s(keys.at(-1)[0])}; the camera freezes for the last ${s(D - keys.at(-1)[0])}.`);
  for (let i = 1; i < keys.length; i++) if (keys[i][0] <= keys[i - 1][0]) err(`camera keys out of order at ${s(keys[i][0])}.`);

  if (layout) {
  // camera rhythm: not just zooming in and out
  const cam = cameraStats(keys, D, makeCurve);
  const pct = (x) => `${Math.round(x * 100)}%`;
  const camIssues = [];
  if (cam.share.zoom > CAM.maxZoom) camIssues.push(`zoom is the main motion ${pct(cam.share.zoom)} of the time (max ${pct(CAM.maxZoom)}): move between nearby landmarks at a constant distance instead of pulling out and diving in again`);
  if (cam.share.orbit < CAM.minOrbit) camIssues.push(`orbit is only ${pct(cam.share.orbit)} (min ${pct(CAM.minOrbit)}): circle the subject so the diorama shows depth`);
  if (cam.azSwept < CAM.minAzSwept) camIssues.push(`azimuth sweeps ${Math.round(cam.azSwept)} degrees in total (min ${CAM.minAzSwept}): the city is only ever seen from one side`);
  if (cam.midWide < CAM.minMidWide) camIssues.push(`no wide shot between 15s and ${s(D - 8)} (widest distance ${Math.round(cam.midWide)}, need >= ${CAM.minMidWide}): pull back at least once so the viewer sees the city grow`);
  for (const m of camIssues) (CAMERA_WAIVED.has(city) ? warn : err)(`camera: ${m}.`);

  // grandeur (docs/grandeur.md)
  {
    const g = engine.getWorld(layout);
    const t = layout.tile;
    const tileA = (t.x1 - t.x0) * (t.z1 - t.z0);
    const o = layout.city.outline;
    const oldTown = o
      ? Math.abs(o.reduce((a, [x, z], i) => a + x * o[(i + 1) % o.length][1] - o[(i + 1) % o.length][0] * z, 0)) / 2
      : 4 * layout.city.hx * layout.city.hz;
    const endYear = story.yearAt(D - 0.1);
    const modern = g.paddies.filter((p) => p.urban < endYear).length * 16; // 4 x 4 cells
    const share = (oldTown + modern) / tileA;
    const peak = Math.max(0, ...layout.peaks.map((p) => p[2]));
    if (share < GRANDEUR.minFinaleShare && peak < GRANDEUR.heroPeak)
      (GRANDEUR_WAIVED.has(city) ? warn : err)(
        `grandeur: at the end the city covers ${pct(share)} of the tile (min ${pct(GRANDEUR.minFinaleShare)}) and the highest peak is ${peak} (hero mountain >= ${GRANDEUR.heroPeak}): the finale has nothing big in it. Let today's city fill the tile -- widen or drop urbanBox, lower urban.rate, add towers -- as far as the real city reaches (docs/grandeur.md).`,
      );
    if (oldTown / tileA < GRANDEUR.minOldTown)
      warn(`grandeur: the old town covers ${(100 * oldTown / tileA).toFixed(1)}% of the tile; it will read as a speck in a forest on wide shots. Frame the early beats tighter and keep elevation >= 30 degrees (docs/grandeur.md).`);
  }

  // Curved rivers need a usable centreline. A malformed path otherwise renders
  // nothing while placement checks silently think the channel exists.
  layout.rivers.forEach((r, n) => {
    if (!(r.width > 0)) err(`river ${n} has non-positive width ${r.width}.`);
    if (!roads.isPathRiver(r)) return;
    if (r.path.length < (r.closed ? 3 : 2)) err(`curved river ${n} needs at least ${r.closed ? 3 : 2} path points.`);
    r.path.forEach((p, i) => {
      if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) err(`curved river ${n} point ${i} is not finite.`);
      if (i && Math.hypot(p[0] - r.path[i - 1][0], p[1] - r.path[i - 1][1]) < 1e-6)
        err(`curved river ${n} repeats path point ${i - 1} at ${i}.`);
    });
  });
  if (layout.city.ruinStrength !== undefined && (layout.city.ruinStrength < 0 || layout.city.ruinStrength > 1))
    err(`city.ruinStrength must be between 0 and 1; got ${layout.city.ruinStrength}.`);
  layout.bridges.forEach((b, n) => {
    const r = layout.rivers[b.river ?? 0];
    if (!r) return err(`bridge ${n} refers to missing river ${b.river ?? 0}.`);
    if (roads.isPathRiver(r) && (b.at < 0 || b.at > roads.riverLength(layout, r)))
      err(`bridge ${n} is at ${b.at}, outside curved river ${b.river ?? 0} length ${roads.riverLength(layout, r).toFixed(1)}.`);
  });

  // A rail that crosses a river gets a bridge from the engine; one that runs along a
  // river's bed cannot be bridged (Nakhon Sawan's train ran across the Nan on bare water).
  if (layout.rail) {
    const rail = layout.rail;
    const t = layout.tile;
    const rs = rail.axis === 'z' ? [t.z0, t.z1] : [t.x0, t.x1];
    layout.rivers.forEach((r, n) => {
      if (roads.isPathRiver(r)) {
        const step = 0.25;
        let run = 0;
        let longest = 0;
        for (let a = rs[0]; a <= rs[1]; a += step) {
          const [x, z] = rail.axis === 'z' ? [rail.pos, a] : [a, rail.pos];
          if (roads.inRiver(layout, r, x, z, 0.1)) {
            run += step;
            longest = Math.max(longest, run);
          } else run = 0;
        }
        if (longest > Math.max(4, r.width * 2.5))
          err(`rail runs along curved river ${n}'s bed for ${longest.toFixed(1)} units; move rail.pos to dry ground.`);
        return;
      }
      if (r.axis !== rail.axis) return;
      const span = r.span ?? rs;
      if (Math.abs(rail.pos - r.pos) < r.width / 2 + 1.0 && span[0] < rs[1] && rs[0] < span[1])
        err(`rail runs along river ${n}'s bed; move rail.pos to dry ground.`);
    });
  }

  // Cars cross water only on a bridge deck. The engine hides a car with no deck under
  // it, so a city that trips this has cars vanishing mid-river (Nakhon Sawan's ring road
  // crossed the Chao Phraya next to, not on, the Dechatiwong bridge; cars drove on water).
  const wet = new Map();
  for (let f = 0; f < D * 30; f += 2) {
    const Y = story.yearAt(f / 30);
    const segs = roads.driveSegments(layout, Y).filter((x) => x.k > 0.99);
    const dk = roads.decks(layout, Y);
    for (let i = 0; i < roads.MAX_CARS; i++) {
      const car = roads.carAt(layout, Y, f, i, segs, dk);
      if (!car?.wet) continue;
      const key = `${Math.round(car.x)},${Math.round(car.z)}`;
      if (!wet.has(key)) wet.set(key, {f, Y, x: car.x, z: car.z});
    }
  }
  const wetMsg = WATER_WAIVED.has(city) ? warn : err;
  for (const w of [...wet.values()].slice(0, 3))
    wetMsg(`a car is on open water at (${w.x.toFixed(1)}, ${w.z.toFixed(1)}) at ${s(w.f / 30)} (year ${Math.round(w.Y)}): the road crosses a river with no bridge deck under it. Line up the bridge's \`at\` with the road, or move the road.`);
  if (wet.size > 3) wetMsg(`... and cars on open water at ${wet.size - 3} more places.`);

  // Nothing sunk into a hill. Landmarks get terrainH in their props; one placed at
  // y = 0 on a slope ends up buried (Nakhon Sawan's San Khu redoubt sat 2.25 under
  // the Khao Kob foothill and its callout pointed at bare grass).
  const world = engine.getWorld(layout);
  for (const c of callouts) {
    const g = world.terrainH(c.p[0], c.p[2]);
    if (c.p[1] < g - 0.5)
      err(`callout "${c.label}" points ${(g - c.p[1]).toFixed(1)} below the ground there (terrain ${g.toFixed(1)}): place the landmark at terrainH(x, z) and raise the callout point with it.`);
  }
  const lm = await load(`src/cities/${city}/Landmarks.tsx`);
  const lmSrc = fs.readFileSync(`src/cities/${city}/Landmarks.tsx`, 'utf8');
  for (const [name, v] of Object.entries(lm)) {
    if (!Array.isArray(v) || v.length !== 2 || typeof v[0] !== 'number') continue;
    // already placed on the ground: at(NAME) or terrainH(NAME[0], ...)
    if (new RegExp(`\\b(at|terrainH)\\(\\s*${name}\\b`).test(lmSrc)) continue;
    const g = world.terrainH(v[0], v[1]);
    if (g > 0.5) warn(`${name} stands where the terrain is ${g.toFixed(1)} high: make sure Landmarks.tsx places it at terrainH(x, z), not at y = 0.`);
  }

  // the thing a callout points at must be visible, not behind a wall of trees
  for (const o of occlusion(cfg, engine)) {
    if (o.blocked > 0.5)
      err(`callout "${o.label}" (${s(o.t0)}): trees hide it ${pct(o.blocked)} of the time. Raise the camera elevation or swing the azimuth so the line of sight crosses open ground or water.`);
  }

  }

  // real compass directions (geo.ts next to index.ts)
  {
    const gMsg = GEO_WAIVED.has(city) ? warn : err;
    const gp = `src/${dir}/${city}/geo.ts`;
    if (!fs.existsSync(gp)) gMsg(`no ${gp}: give each landmark (and a point on the water) its real lat/lon so directions can be checked (src/engine/geo.ts).`);
    else {
      const geo = Object.values(await load(gp)).find((v) => v && Array.isArray(v.points));
      const pts = geo?.points ?? [];
      if (pts.length < 2) gMsg(`${gp} needs at least 2 points to check a direction.`);
      if ((layout?.rivers?.length ?? 0) > 0 && !pts.some((p) => p.water)) gMsg(`${gp} has no water point: add one so the river or sea is checked to be on the right side.`);
      for (const p of geoLib.geoPairs(geo ?? {points: []}))
        if (p.diff > GEO_MAX_DIFF)
          gMsg(`direction ${p.a} -> ${p.b} is ${Math.round(p.real)} deg in reality but ${Math.round(p.model)} deg in the model (off by ${Math.round(p.diff)}). ${p.water ? 'The water is on the wrong side.' : 'Move one of them.'}`);
    }
  }

  // registration
  if (!root.includes(dir === 'cities' ? `./cities/${city}'` : `./landmarks/${city}/`)) err(`not registered in src/Root.tsx.`);
  for (const k of [`render:${city}`, `audio:${city}`]) if (!pkg.scripts[k]) err(`package.json has no "${k}" script.`);
  if (/(^|&&\s*)python\s/.test(pkg.scripts[`audio:${city}`] ?? '')) err(`audio:${city} calls "python"; use "python3" (macOS has no "python").`);
  if (!NO_BRIEF_OK.has(city) && !fs.existsSync(`docs/briefs/${city}.md`)) err(`no docs/briefs/${city}.md: the dated, sourced brief is what the captions are checked against.`);
  if (!fs.existsSync(`public/${cfg.soundtrack}`)) err(`soundtrack public/${cfg.soundtrack} is missing (run npm run audio:${city}).`);

  errors += out.filter((l) => l.includes('ERROR')).length;
  warnings += out.filter((l) => l.includes('warn')).length;
  console.log(`${city} (${D}s, ${caps.length} captions, ${callouts.length} callouts)${out.length ? '\n' + out.join('\n') : ' ok'}`);
}
console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);

async function load(file) {
  const tmp = path.resolve(`out/.check_${path.basename(path.dirname(file))}_${path.basename(file)}.mjs`);
  fs.mkdirSync('out', {recursive: true});
  buildSync({entryPoints: [file], bundle: true, format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic', outfile: tmp, logLevel: 'error'});
  return import(pathToFileURL(tmp).href + '?' + Date.now());
}
