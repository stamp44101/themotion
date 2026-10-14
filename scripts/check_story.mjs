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
const {INTRO_END, FINALE_LEAD, SECONDS, makeCurve} = lib;
const MIN_CAPTION = 2.5; // seconds on screen; shorter cannot be read in Thai at this size
const COLUMN = 820; // caption column width in px (Overlay: SAFE.left..SAFE.right)
// Camera rhythm floors. Every approved city clears them; see camera_stats.mjs for
// what each number means and the review that set them.
const CAM = {maxZoom: 0.65, minOrbit: 0.15, minAzSwept: 300, minMidWide: 100};
// Cities that predate the camera rule. Re-tune their keys, then remove them here.
const CAMERA_WAIVED = new Set(['chachoengsao']);
// Cities built before briefs existed.
const NO_BRIEF_OK = new Set(['ayutthaya', 'korat', 'phitsanulok', 'sukhothai']);

const root = fs.readFileSync('src/Root.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const cities = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync('src/cities').sort();

let errors = 0;
let warnings = 0;
for (const city of cities) {
  const out = [];
  const err = (m) => out.push(`  ERROR ${m}`);
  const warn = (m) => out.push(`  warn  ${m}`);
  const mod = await load(`src/cities/${city}/index.ts`);
  const cfg = Object.values(mod).find((v) => v && v.story && v.layout);
  if (!cfg) {
    console.log(`${city}\n  ERROR src/cities/${city}/index.ts exports no CityConfig`);
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
  const keys = layout.cameraKeys;
  if (keys[0][0] > 0) err(`first camera key is at ${s(keys[0][0])}, not 0.`);
  if (keys.at(-1)[0] < D - 0.5) warn(`last camera key is at ${s(keys.at(-1)[0])}; the camera freezes for the last ${s(D - keys.at(-1)[0])}.`);
  for (let i = 1; i < keys.length; i++) if (keys[i][0] <= keys[i - 1][0]) err(`camera keys out of order at ${s(keys[i][0])}.`);

  // camera rhythm: not just zooming in and out
  const cam = cameraStats(keys, D, makeCurve);
  const pct = (x) => `${Math.round(x * 100)}%`;
  const camIssues = [];
  if (cam.share.zoom > CAM.maxZoom) camIssues.push(`zoom is the main motion ${pct(cam.share.zoom)} of the time (max ${pct(CAM.maxZoom)}): move between nearby landmarks at a constant distance instead of pulling out and diving in again`);
  if (cam.share.orbit < CAM.minOrbit) camIssues.push(`orbit is only ${pct(cam.share.orbit)} (min ${pct(CAM.minOrbit)}): circle the subject so the diorama shows depth`);
  if (cam.azSwept < CAM.minAzSwept) camIssues.push(`azimuth sweeps ${Math.round(cam.azSwept)} degrees in total (min ${CAM.minAzSwept}): the city is only ever seen from one side`);
  if (cam.midWide < CAM.minMidWide) camIssues.push(`no wide shot between 15s and ${s(D - 8)} (widest distance ${Math.round(cam.midWide)}, need >= ${CAM.minMidWide}): pull back at least once so the viewer sees the city grow`);
  for (const m of camIssues) (CAMERA_WAIVED.has(city) ? warn : err)(`camera: ${m}.`);

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
  for (const [name, v] of Object.entries(lm)) {
    if (!Array.isArray(v) || v.length !== 2 || typeof v[0] !== 'number') continue;
    const g = world.terrainH(v[0], v[1]);
    if (g > 0.5) warn(`${name} stands where the terrain is ${g.toFixed(1)} high: make sure Landmarks.tsx places it at terrainH(x, z), not at y = 0.`);
  }

  // the thing a callout points at must be visible, not behind a wall of trees
  for (const o of occlusion(cfg, engine)) {
    if (o.blocked > 0.5)
      err(`callout "${o.label}" (${s(o.t0)}): trees hide it ${pct(o.blocked)} of the time. Raise the camera elevation or swing the azimuth so the line of sight crosses open ground or water.`);
  }

  // registration
  if (!root.includes(`./cities/${city}'`)) err(`not registered in src/Root.tsx.`);
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
