// Run today's occupancy audit (src/engine/occupancy.ts) over layouts built by an OLDER
// engine, to prove the rules catch what used to be caught by eye:
//
//   node scripts/audit_engine.mjs 965f38e        # world.ts before layout.sites
//   node scripts/audit_engine.mjs 25f9505        # before footprints kept blocks off roads
//
// It checks out that commit's src/engine/world.ts beside the current one, builds every
// city with it, audits the result with the current occupancy rules and prints the
// forbidden pairs per city. A commit that prints "clean" everywhere would mean the audit
// no longer catches anything that engine got wrong.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSync} from 'esbuild';

const [commit] = process.argv.slice(2);
if (!commit) {
  console.error('usage: node scripts/audit_engine.mjs <commit>');
  process.exit(2);
}
const load = (file) => {
  const tmp = path.resolve(`out/.audit_${path.basename(file)}_${Date.now()}.mjs`);
  fs.mkdirSync('out', {recursive: true});
  buildSync({entryPoints: [file], bundle: true, format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic', outfile: tmp, logLevel: 'error'});
  return import(pathToFileURL(tmp).href);
};
const old = `src/engine/.world_${commit}.ts`;
fs.writeFileSync(old, execFileSync('git', ['show', `${commit}:src/engine/world.ts`], {encoding: 'utf8'}));
try {
  const now = await load('src/engine/world.ts');
  const then = await load(old);
  const cities = fs.readdirSync('src/cities').filter((c) => fs.existsSync(`src/cities/${c}/index.ts`));
  for (const c of cities) {
    const m = await load(`src/cities/${c}/index.ts`);
    const cfg = Object.values(m).find((v) => v && v.layout);
    if (!cfg) continue;
    const found = now.auditWorld(cfg.layout, then.getWorld(cfg.layout));
    console.log(c.padEnd(13), found.map((x) => `${x.over} on ${x.under}: ${x.count}`).join(' | ') || 'clean');
  }
} finally {
  fs.rmSync(old, {force: true});
}
