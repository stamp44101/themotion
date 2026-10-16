// Sequential strips of a city's moving things, the way the render sees them.
//
//   node scripts/actor_strips.mjs <city> [actorId]
//
// A `remotion still` starts on a fresh page while a render reuses one page across frames,
// so a still cannot show a moving thing that the render culls or drops (Korat's armies,
// Nakhon Si's train). For each registered actor (src/engine/actors.ts, plus every train)
// this renders 1.5 s around the middle of its beat with --sequence --concurrency=1, keeps
// five frames and writes shots/<city>/actor_<id>.png. Bundles to out/bundle first. About
// a minute per actor in the container.
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSync} from 'esbuild';

const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const [city, only] = process.argv.slice(2);
if (!city) {
  console.error('usage: node scripts/actor_strips.mjs <city> [actorId]');
  process.exit(2);
}
const load = (file) => {
  const tmp = path.resolve(`out/.strip_${path.basename(file)}_${Date.now()}.mjs`);
  fs.mkdirSync('out', {recursive: true});
  buildSync({entryPoints: [file], bundle: true, format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic', outfile: tmp, logLevel: 'error'});
  return import(pathToFileURL(tmp).href);
};
const mod = await load(`src/cities/${city}/index.ts`);
const name = Object.keys(mod).find((k) => mod[k] && mod[k].layout);
const cfg = mod[name];
const root = fs.readFileSync('src/Root.tsx', 'utf8');
const comp = root.match(new RegExp(`const (\\w+): React.FC = \\(\\) => <DioramaComposition city={${name}}`))?.[1];
if (!comp) {
  console.error(`no composition in src/Root.tsx uses ${name}`);
  process.exit(1);
}
const actorLib = await load('src/engine/actors.ts');
const actors = [...(cfg.actors ?? []), ...actorLib.trainActors(cfg.layout)].filter((a) => !only || a.id === only);
if (!actors.length) {
  console.error(`no actors${only ? ` named ${only}` : ''} in ${city}`);
  process.exit(1);
}

fs.rmSync('out/bundle', {recursive: true, force: true});
execFileSync('npx', ['remotion', 'bundle', 'src/index.ts', '--out-dir=out/bundle', '--log=error'], {stdio: 'inherit'});
fs.mkdirSync(`shots/${city}`, {recursive: true});
const FPS = 30;
for (const a of actors) {
  const [t0, t1] = typeof a.during === 'string' ? cfg.story.beats[a.during] : a.during;
  const mid = (t0 + t1) / 2;
  const f0 = Math.max(0, Math.round((mid - 0.75) * FPS));
  const f1 = Math.round((mid + 0.75) * FPS);
  const dir = `shots/${city}/strip_${a.id}`; // no dot: remotion reads one as an extension
  fs.rmSync(dir, {recursive: true, force: true});
  console.log(`${a.id}: frames ${f0}-${f1} (${t0.toFixed(1)}-${t1.toFixed(1)} s)`);
  const r = spawnSync('npx', ['remotion', 'render', 'out/bundle', comp, dir, '--sequence', `--frames=${f0}-${f1}`, '--concurrency=1', '--gl=angle', `--browser-executable=${BROWSER}`, '--scale=0.4', '--image-format=png', '--log=error'], {stdio: 'ignore'});
  if (r.status !== 0) {
    console.log(`FAIL ${a.id}`);
    continue;
  }
  const frames = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
  const pick = [0, 0.25, 0.5, 0.75, 1].map((u) => frames[Math.round(u * (frames.length - 1))]);
  const inputs = pick.flatMap((f) => ['-i', `${dir}/${f}`]);
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', `hstack=${pick.length}`, `shots/${city}/actor_${a.id}.png`], {stdio: 'inherit'});
  fs.rmSync(dir, {recursive: true, force: true});
  console.log('wrote', `shots/${city}/actor_${a.id}.png`);
}
