// Turns the master render into the two files that leave the machine, then checks them.
// Usage: node scripts/encode.mjs <city>        (reads out/<city>.mp4)
//
//   renders/<city>.mp4     shareable copy, under 100 MB (gitignored; goes on the release)
//   out/<city>_social.mp4  the upload copy for TikTok, Instagram and Facebook, ~7.5 Mbps -- never commit it
//
// Both are converted from Remotion's full-range/PAL-matrix output to the limited-range bt709
// that players and the platforms assume (see CLAUDE.md).
//
// Why one upload file: Instagram expects around 5 Mbps for a reel and reacts to a file several
// times that by sitting on "processing" and then silently dropping the post -- no error to read.
// TikTok re-encodes whatever it is given to a few Mbps, so the ~17 Mbps copy it used to get bought
// nothing visible. One file at ~7.5 Mbps, high@4.0 (what older IG clients accept) posts to all
// three; the owner has posted from it since Phetchaburi.
import './node_guard.mjs';
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

console.log(`encoding renders/${city}.mp4 (shareable copy) ...`);
fs.mkdirSync('renders', {recursive: true});
ffmpeg(['-i', master, ...VF, '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-maxrate', '7M', '-bufsize', '14M', ...TAGS,
  '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', `renders/${city}.mp4`]);

console.log(`encoding out/${city}_social.mp4 (the upload copy: TikTok, Instagram and Facebook) ...`);
ffmpeg(['-i', master, ...VF, '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-maxrate', '8M', '-bufsize', '16M',
  '-profile:v', 'high', '-level', '4.0', ...TAGS,
  '-x264-params', 'keyint=60:min-keyint=30:colorprim=bt709:transfer=bt709:colormatrix=bt709:range=tv',
  '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2', `out/${city}_social.mp4`]);

const ok = [master, `renders/${city}.mp4`, `out/${city}_social.mp4`].map(checkRender).every(Boolean);
console.log(ok ? '\nall checks passed' : '\nchecks FAILED -- do not post or commit this render');
process.exit(ok ? 0 : 1);
