// A/B stills for engine changes: the same six frames of every engine city, rendered into
// shots/ab/<tag>/, and a before-vs-after sheet per city when both tags exist.
//
//   node scripts/ab_stills.mjs before            # on the base commit
//   node scripts/ab_stills.mjs after             # on the branch
//   node scripts/ab_stills.mjs sheet             # shots/ab/<city>.png: before row over after row
//
// Compare still vs still (CLAUDE.md), never a still against a frame from an encoded render.
// Bundles to out/bundle first; frames are 10/30/50/70/85/97% of each clip.
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';

const BROWSER = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const FRACS = [0.1, 0.3, 0.5, 0.7, 0.85, 0.97];
const SKIP = new Set(['ChiangMaiIso', 'ChiangMaiTimelapse', 'KoratLook']); // legacy builds and a duplicate
const [tag] = process.argv.slice(2);
if (!tag) {
  console.error('usage: node scripts/ab_stills.mjs before|after|sheet');
  process.exit(2);
}

const comps = () => {
  const out = execFileSync('npx', ['remotion', 'compositions', 'out/bundle', `--browser-executable=${BROWSER}`], {encoding: 'utf8'});
  return out
    .split('\n')
    .map((l) => l.trim().split(/\s+/))
    .filter((p) => p.length >= 4 && /^\d+$/.test(p[3] ?? '') && !SKIP.has(p[0]))
    .map((p) => ({id: p[0], frames: +p[3]}));
};

if (tag === 'sheet') {
  const before = fs.readdirSync('shots/ab/before').filter((f) => f.endsWith('.png'));
  const ids = [...new Set(before.map((f) => f.split('_')[0]))];
  for (const id of ids) {
    const rows = ['before', 'after'].map((t) =>
      FRACS.map((_, i) => `shots/ab/${t}/${id}_${i}.png`).filter((p) => fs.existsSync(p)),
    );
    if (rows.some((r) => r.length !== FRACS.length)) continue;
    const inputs = rows.flat().flatMap((p) => ['-i', p]);
    const n = FRACS.length;
    const fc = `${rows[0].map((_, i) => `[${i}:v]`).join('')}hstack=${n}[a];${rows[1].map((_, i) => `[${n + i}:v]`).join('')}hstack=${n}[b];[a][b]vstack,scale=2400:-1`;
    spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, `shots/ab/${id}.png`], {stdio: 'inherit'});
    console.log('wrote', `shots/ab/${id}.png`);
  }
  process.exit(0);
}

fs.rmSync('out/bundle', {recursive: true, force: true});
execFileSync('npx', ['remotion', 'bundle', 'src/index.ts', '--out-dir=out/bundle', '--log=error'], {stdio: 'inherit'});
fs.mkdirSync(`shots/ab/${tag}`, {recursive: true});
const jobs = [];
for (const {id, frames} of comps())
  FRACS.forEach((f, i) => jobs.push({id, i, frame: Math.min(frames - 1, Math.round(frames * f))}));
// three at a time: stills are CPU-bound in software GL
let next = 0;
const worker = async () => {
  while (next < jobs.length) {
    const j = jobs[next++];
    const out = `shots/ab/${tag}/${j.id}_${j.i}.png`;
    const r = spawnSync('npx', ['remotion', 'still', 'out/bundle', j.id, out, `--frame=${j.frame}`, '--gl=angle', `--browser-executable=${BROWSER}`, '--scale=0.5', '--log=error'], {stdio: 'ignore'});
    console.log(r.status === 0 ? 'ok  ' : 'FAIL', out, `frame ${j.frame}`);
  }
};
await Promise.all([worker(), worker(), worker()]);
