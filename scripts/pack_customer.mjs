// Builds the customer pack of the skill: the engine, the checks, the synth and Korat as the worked
// example, without the other cities, the post analytics or the repo's own publishing rules.
// Usage: node scripts/pack_customer.mjs [version]   -> out/pack/1minutecity-skill/ and its .zip
//
// What goes in is a whitelist, so a new city or a new private doc never leaks into the pack by
// default. After an engine change, run this, then `npm install && npm run check` inside the pack.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const VERSION = process.argv[2] || new Date().toISOString().slice(0, 10);
const NAME = '1minutecity-skill';
const OUT = path.resolve('out/pack', NAME);
const T = 'scripts/pack';

const COPY = [
  'src/engine', 'src/Overlay.tsx', 'src/lib.ts', 'src/geometry.ts', 'src/Scene.tsx', 'src/index.ts',
  'src/cities/korat',
  'public/grain.png', 'public/soundtrack_korat.wav',
  'remotion.config.ts', 'tsconfig.json',
  'docs/storyline.md', 'docs/grandeur.md', 'docs/city-brief.template.md',
];
// every generic script; city soundtracks other than Korat's and repo-only tools stay out
const SCRIPT_SKIP = /^(soundtrack_(?!korat)|python_chonburi|elephant_voices|make_soundtrack|audit_engine|pack_customer)/;

// CLAUDE.md sections that are about this repo (agents, release, budget), not about making a clip
const CLAUDE_KEEP = ['Three.js gotcha', 'Look & feel lessons', 'Starting a new city', 'Delivering a file for upload'];

fs.rmSync(OUT, {recursive: true, force: true});
fs.mkdirSync(OUT, {recursive: true});
const put = (rel, text) => {
  fs.mkdirSync(path.dirname(path.join(OUT, rel)), {recursive: true});
  fs.writeFileSync(path.join(OUT, rel), text);
};

for (const p of COPY) fs.cpSync(p, path.join(OUT, p), {recursive: true});
for (const f of fs.readdirSync('scripts')) {
  const p = path.join('scripts', f);
  if (fs.statSync(p).isFile() && !SCRIPT_SKIP.test(f)) fs.cpSync(p, path.join(OUT, p));
}
fs.mkdirSync(path.join(OUT, 'docs/briefs'), {recursive: true});
fs.writeFileSync(path.join(OUT, 'docs/briefs/.gitkeep'), '');

fs.cpSync(`${T}/Root.tsx`, path.join(OUT, 'src/Root.tsx'));
fs.cpSync(`${T}/SKILL.md`, path.join(OUT, '.claude/skills/thai-city-timelapse/SKILL.md'), {recursive: true});
fs.cpSync(`${T}/START.md`, path.join(OUT, 'เริ่มต้นใช้งาน.md'));
fs.cpSync(`${T}/TERMS.md`, path.join(OUT, 'TERMS.md'));

// CLAUDE.md: the pack's own head, then the lesson sections of the repo's guide
const src = fs.readFileSync('CLAUDE.md', 'utf8');
const sections = src.split(/\n(?=## )/).filter((s) => CLAUDE_KEEP.some((k) => s.startsWith(`## ${k}`)));
// drop the repo's own publishing rules (release assets, which cut to post) from the delivery section
const cut = (text, start) => {
  const i = text.indexOf(start);
  if (i < 0) return text;
  const j = text.indexOf('\n\n', i);
  return text.slice(0, i) + (j < 0 ? '' : text.slice(j + 2));
};
let lessons = sections.join('\n');
for (const start of ['The finished `_social` file', '**Render only the shader look', 'Keep the copies straight:']) lessons = cut(lessons, start);
lessons = `${lessons.trimEnd()}\n\n**Render the shader look** (\`look: 'shader'\`, the \`Korat\` composition); the plain cut (\`KoratPlain\`) is there for comparison.`;
put('CLAUDE.md', `${fs.readFileSync(`${T}/CLAUDE.head.md`, 'utf8').trimEnd()}\n\n${lessons.trimEnd()}\n`);

// references to files the pack does not carry (post analytics, the agents protocol)
const REWRITE = {
  'CLAUDE.md': [['written from the posts in `docs/experiments.md`', "written from the series' measured Instagram posts"]],
  'docs/storyline.md': [
    ['the posts measured in `docs/experiments.md`', "the series' measured Instagram posts"],
    ['on the contact sheet: AGENTS.md, "Nothing ships unreviewed".', 'on the contact sheet: nothing renders unreviewed.'],
    ['Record in `docs/experiments.md`,', 'Record in your own log (e.g. `docs/experiments.md`),'],
  ],
  'scripts/storyline.mjs': [['a measured post (docs/experiments.md)', "a measured post of the 1minutecity series"]],
};
for (const [rel, pairs] of Object.entries(REWRITE)) {
  let text = fs.readFileSync(path.join(OUT, rel), 'utf8');
  for (const [a, b] of pairs) {
    if (!text.includes(a)) throw new Error(`pack: "${a}" not found in ${rel}; update REWRITE`);
    text = text.replaceAll(a, b);
  }
  fs.writeFileSync(path.join(OUT, rel), text);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const keep = ['check', 'check:render', 'encode', 'studio', 'audio:korat', 'render:korat'];
put('package.json', JSON.stringify({
  name: NAME,
  version: VERSION.replace(/-/g, '.').replace(/^(\d+)\.0*(\d+)\.0*(\d+)$/, '$1.$2.$3'),
  private: true,
  description: '1minutecity Skill: Thai city history timelapses (9:16) as code-built 3D dioramas, built with Remotion',
  engines: pkg.engines,
  scripts: {
    ...Object.fromEntries(keep.map((k) => [k, pkg.scripts[k]])),
    'render:korat': 'node scripts/check_story.mjs korat && remotion render Korat out/korat.mp4 --gl=angle --audio-codec=aac --audio-bitrate=256k',
    'still:korat': 'remotion still Korat out/korat.png --frame=600 --gl=angle',
  },
  dependencies: pkg.dependencies,
}, null, 2) + '\n');

put('.gitignore', 'node_modules/\nout/\nrenders/\n.DS_Store\n__pycache__/\nshots/\n');
put('CHANGELOG.md', `# Changelog\n\n## ${VERSION}\n- First release: engine, checks, synth and the Korat example.\n`);
put('VERSION', `${VERSION}\n`);

const zip = path.resolve('out/pack', `${NAME}-${VERSION}.zip`);
fs.rmSync(zip, {force: true});
execFileSync('zip', ['-qr', zip, NAME, '-x', `${NAME}/node_modules/*`, `${NAME}/out/*`], {cwd: path.resolve('out/pack')});
console.log(`${OUT}\n${zip} (${(fs.statSync(zip).size / 1048576).toFixed(1)} MB)`);
