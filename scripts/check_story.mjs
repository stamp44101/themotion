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
import {textWidth} from './textwidth.mjs';

const lib = await load('src/lib.ts');
const {INTRO_END, FINALE_LEAD, SECONDS} = lib;
const MIN_CAPTION = 2.5; // seconds on screen; shorter cannot be read in Thai at this size
const COLUMN = 820; // caption column width in px (Overlay: SAFE.left..SAFE.right)

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

  // registration
  if (!root.includes(`./cities/${city}'`)) err(`not registered in src/Root.tsx.`);
  for (const k of [`render:${city}`, `audio:${city}`]) if (!pkg.scripts[k]) err(`package.json has no "${k}" script.`);
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
