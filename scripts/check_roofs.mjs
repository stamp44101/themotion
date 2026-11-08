// Fails when a hip roof is built the skewed way: one <mesh> carrying both a 45-degree y rotation and a scale
// whose x and z differ, around a 4-segment cone. three.js scales a mesh before it rotates it, so the cone is
// stretched along its corner diagonals into a rhombus and the roof does not sit square on its box (owner,
// Uttaradit 8 Nov). Use HipRoof from src/engine/parts.tsx (rotate inside, scale outside).
// Files that had the pattern before this check are listed in BASELINE and only warn; fix them in their own PR
// and take them off the list.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const BASELINE = new Set([
  'src/cities/chanthaburi/Landmarks.tsx',
  'src/cities/lampang/Landmarks.tsx',
  'src/cities/lopburi/Landmarks.tsx',
  'src/cities/nakhonpathom/Landmarks.tsx',
  'src/cities/nan/Landmarks.tsx',
  'src/cities/phetchabun/figures.tsx',
  'src/cities/sakonnakhon/Landmarks.tsx',
  'src/cities/saraburi/Landmarks.tsx',
  'src/cities/suratthani/Landmarks.tsx',
  'src/cities/surin/Landmarks.tsx',
  'src/cities/udonthani/Landmarks.tsx',
]);

const walk = (dir) =>
  fs.readdirSync(dir, {withFileTypes: true}).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return p.endsWith('.tsx') ? [p] : [];
  });

const quarterY = (attrs) =>
  /rotation-y=\{\s*Math\.PI\s*\/\s*4\s*\}/.test(attrs) ||
  /rotation=\{\[\s*[^,\]]+,\s*Math\.PI\s*\/\s*4\s*,/.test(attrs);

const unevenScale = (attrs) => {
  const m = attrs.match(/scale=\{\[([^\]]*)\]\}/);
  if (!m) return false;
  const parts = m[1].split(',').map((s) => s.trim());
  return parts.length === 3 && parts[0] !== parts[2];
};

let errors = 0;
let warnings = 0;
for (const file of walk(path.join(ROOT, 'src'))) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const src = fs.readFileSync(file, 'utf8');
  const re = /<mesh\b([^>]*)>/g;
  let m;
  while ((m = re.exec(src))) {
    const attrs = m[1];
    if (!quarterY(attrs) || !unevenScale(attrs)) continue;
    const after = src.slice(re.lastIndex, re.lastIndex + 200);
    if (!/<coneGeometry\s+args=\{\[[^\]]*,\s*4\s*\]\}/.test(after)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    const msg = `${rel}:${line}: a 4-sided cone rotated 45 deg and scaled unevenly on the same mesh is a skewed roof; use HipRoof from engine/parts`;
    if (BASELINE.has(rel)) {
      warnings++;
      console.warn(`warning (baseline) ${msg}`);
    } else {
      errors++;
      console.error(`error ${msg}`);
    }
  }
}
console.log(`check_roofs: ${errors} error(s), ${warnings} baseline warning(s)`);
process.exit(errors ? 1 : 0);
