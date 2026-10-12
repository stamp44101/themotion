// Exports per-frame year + night amount for a city so the soundtrack syncs to the picture.
// Usage: node scripts/export_timeline.mjs [src/cities/<city>/timeline.ts] [out/timeline_<city>.json]
// With no args it exports the original Chiang Mai timeline (src/lib.ts) to out/timeline.json.
import fs from 'node:fs';
import path from 'node:path';
import {buildSync} from 'esbuild';

const [cityPath, outPath = 'out/timeline.json'] = process.argv.slice(2);
const lib = path.resolve('src/lib.ts');
const entry = cityPath
  ? `import {lighting, FPS, SECONDS} from ${JSON.stringify(lib)};\nexport * from ${JSON.stringify(path.resolve(cityPath))};\nexport {lighting, FPS, SECONDS};`
  : `export {lighting, FPS, SECONDS, yearAt} from ${JSON.stringify(lib)};`;
fs.mkdirSync('out', {recursive: true});
const tmp = path.resolve('out/.timeline_bundle.mjs');
buildSync({stdin: {contents: entry, resolveDir: process.cwd(), loader: 'ts'}, bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error'});
const mod = await import(tmp + '?' + Date.now());
const frames = [];
const dur = mod.DURATION ?? mod.SECONDS;
for (let f = 0; f < dur * mod.FPS; f++) {
  const t = f / mod.FPS;
  frames.push([+mod.yearAt(t).toFixed(3), +mod.lighting(t, dur).night.toFixed(3)]);
}
fs.writeFileSync(outPath, JSON.stringify({fps: mod.FPS, duration: dur, frames, events: mod.SOUND_EVENTS ?? {}}));
console.log('wrote', outPath, frames.length, 'frames');
