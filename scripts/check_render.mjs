// Post-render checks on a finished video: the things you otherwise only see on a phone.
// Usage: node scripts/check_render.mjs out/<city>.mp4 [renders/<city>.mp4 ...]
// Exits 1 if any file fails.
//
// - Light must change smoothly. Chachoengsao's first render jumped 18 luma levels
//   in one frame and dropped to 26 at night; on a phone it read as flicker. After
//   the lighting fix the same city moves at most 2.5 per frame and stays above 46.
// - The last few seconds are skipped: the finale goes to night on purpose.
// - A file under renders/ must be under 100 MB and tagged limited-range bt709
//   (Remotion's own output is full range with a PAL matrix; see CLAUDE.md).
import fs from 'node:fs';
import path from 'node:path';
import {ffmpeg, ffprobe} from './ff.mjs';

const MAX_JUMP = 8; // mean luma (0-255, full range) between consecutive frames
const MIN_LUMA = 35; // darkest frame before the finale
const FINALE_SKIP = 5.4; // seconds at the end that may go dark
const REPO_LIMIT = 100 * 1024 * 1024;
const [LW, LH] = [64, 114];

export const checkRender = (file) => {
  const info = ffprobe(file);
  const dur = +info.format.duration;
  const size = +info.format.size;
  const video = info.streams.find((s) => s.codec_type === 'video');
  const audio = info.streams.some((s) => s.codec_type === 'audio');
  const limited = video.color_range === 'tv';

  // mean of the Y plane per frame, from a tiny raw yuv420p dump
  const raw = path.resolve('out/.luma.yuv');
  fs.mkdirSync('out', {recursive: true});
  ffmpeg(['-i', file, '-vf', `scale=${LW}:${LH}`, '-pix_fmt', 'yuv420p', '-c:v', 'rawvideo', '-f', 'image2pipe', raw]);
  const buf = fs.readFileSync(raw);
  fs.rmSync(raw);
  const fsz = (LW * LH * 3) / 2;
  const y = [];
  for (let o = 0; o + fsz <= buf.length; o += fsz) {
    let s = 0;
    for (let i = 0; i < LW * LH; i++) s += buf[o + i];
    const m = s / (LW * LH);
    y.push(limited ? ((m - 16) * 255) / 219 : m); // compare on the full-range scale
  }
  const fps = y.length / dur;
  const body = y.slice(0, Math.max(2, Math.floor(y.length - FINALE_SKIP * fps)));
  let j = 0;
  let jAt = 0;
  for (let i = 1; i < body.length; i++) {
    const d = Math.abs(body[i] - body[i - 1]);
    if (d > j) [j, jAt] = [d, (i - 1) / fps];
  }
  const lo = Math.min(...body);
  const loAt = body.indexOf(lo) / fps;

  const fails = [];
  if (j > MAX_JUMP) fails.push(`light jumps ${j.toFixed(1)} in one frame at ${jAt.toFixed(2)}s`);
  if (lo < MIN_LUMA) fails.push(`too dark (${lo.toFixed(1)}) at ${loAt.toFixed(2)}s`);
  if (!audio) fails.push('no audio stream');
  if (file.replace(/\\/g, '/').split('/').includes('renders')) {
    if (size >= REPO_LIMIT) fails.push(`${(size / 1e6).toFixed(1)} MB is over the 100 MB repo limit`);
    if (!(limited && video.color_space === 'bt709')) fails.push('repo copy is not tagged limited-range bt709 (use scripts/encode.mjs)');
  }
  console.log(
    `${file}: ${dur.toFixed(2)}s, ${(size / 1e6).toFixed(1)} MB, ${y.length} frames, ${video.color_range}/${video.color_space}, audio=${audio ? 'yes' : 'NO'}\n` +
      `  largest frame-to-frame luma jump ${j.toFixed(1)} at ${jAt.toFixed(2)}s (limit ${MAX_JUMP})\n` +
      `  darkest frame ${lo.toFixed(1)} at ${loAt.toFixed(2)}s (limit ${MIN_LUMA})\n` +
      (fails.length ? fails.map((f) => `  FAIL ${f}`).join('\n') : '  ok'),
  );
  return fails.length === 0;
};

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve('scripts/check_render.mjs')) {
  const files = process.argv.slice(2);
  if (!files.length) {
    console.log('usage: node scripts/check_render.mjs <video.mp4> [...]');
    process.exit(2);
  }
  const ok = files.map(checkRender).every(Boolean);
  process.exit(ok ? 0 : 1);
}
