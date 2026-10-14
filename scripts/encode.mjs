// Turns the master render into the two files that leave the machine, then checks them.
// Usage: node scripts/encode.mjs <city>        (reads out/<city>.mp4)
//
//   renders/<city>.mp4     repo copy, under 100 MB
//   out/<city>_tiktok.mp4  upload copy, ~17 Mbps -- never commit it
//
// Both are converted from Remotion's full-range/PAL-matrix output to the
// limited-range bt709 that players and TikTok assume (see CLAUDE.md).
import fs from 'node:fs';
import {checkRender} from './check_render.mjs';
import {ffmpeg} from './ff.mjs';

const city = process.argv[2];
const master = `out/${city}.mp4`;
if (!city || !fs.existsSync(master)) {
  console.log(`usage: node scripts/encode.mjs <city>   (expects ${master || 'out/<city>.mp4'})`);
  process.exit(2);
}

const VF = ['-vf', 'scale=in_range=full:out_range=limited,format=yuv420p'];
const TAGS = ['-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709'];

console.log(`encoding renders/${city}.mp4 (repo copy) ...`);
fs.mkdirSync('renders', {recursive: true});
ffmpeg(['-i', master, ...VF, '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-maxrate', '7M', '-bufsize', '14M', ...TAGS,
  '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', `renders/${city}.mp4`]);

console.log(`encoding out/${city}_tiktok.mp4 (upload copy) ...`);
ffmpeg(['-i', master, ...VF, '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-maxrate', '20M', '-bufsize', '40M',
  '-profile:v', 'high', '-level', '4.2', ...TAGS,
  '-x264-params', 'keyint=60:min-keyint=30:colorprim=bt709:transfer=bt709:colormatrix=bt709:range=tv',
  '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', `out/${city}_tiktok.mp4`]);

const ok = [master, `renders/${city}.mp4`, `out/${city}_tiktok.mp4`].map(checkRender).every(Boolean);
console.log(ok ? '\nall checks passed' : '\nchecks FAILED -- do not post or commit this render');
process.exit(ok ? 0 : 1);
