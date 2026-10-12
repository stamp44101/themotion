// Exports per-frame year + lighting (from src/lib.ts) so the soundtrack syncs to the picture.
import fs from 'node:fs';
import ts from 'typescript';

const src = fs.readFileSync(new URL('../src/lib.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020}}).outputText;
const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const frames = [];
for (let f = 0; f < mod.SECONDS * mod.FPS; f++) {
  const t = f / mod.FPS;
  const l = mod.lighting(t);
  frames.push([+mod.yearAt(t).toFixed(3), +l.night.toFixed(3)]);
}
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/timeline.json', JSON.stringify({fps: mod.FPS, frames}));
console.log('frames', frames.length);
