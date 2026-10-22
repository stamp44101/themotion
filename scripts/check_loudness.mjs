// Every soundtrack plays at the same loudness: the level of the two best-performing clips,
// Korat and Chiang Mai, which both measure -16 LUFS integrated. `synth.master` masters to it;
// this measures the committed wavs (ITU-R BS.1770-4, the same numbers ffmpeg's ebur128 gives)
// and fails a city that drifts. The clips posted before the rule are waived to a warning; their
// wavs are what their posted renders used.
import fs from 'node:fs';
import path from 'node:path';

const TARGET = -16.0; // LUFS, synth.TARGET_LUFS
const TOL = 1.0; // LU either side
const TRUE_PEAK = -1.0; // dBTP, synth.TRUE_PEAK
const WAIVED = new Set([
  'soundtrack', 'soundtrack_ayutthaya', 'soundtrack_chachoengsao', 'soundtrack_chiangrai',
  'soundtrack_chonburi', 'soundtrack_khonkaen', 'soundtrack_korat', 'soundtrack_lampang',
  'soundtrack_nakhonsawan', 'soundtrack_nakhonsi', 'soundtrack_phetchaburi',
  'soundtrack_phitsanulok', 'soundtrack_phuket', 'soundtrack_sukhothai', 'soundtrack_watraikhing',
]);

function readWav(file) {
  const b = fs.readFileSync(file);
  let p = 12, fmt, data;
  while (p < b.length - 8) {
    const id = b.toString('ascii', p, p + 4), size = b.readUInt32LE(p + 4);
    if (id === 'fmt ') fmt = {ch: b.readUInt16LE(p + 10), sr: b.readUInt32LE(p + 12), bits: b.readUInt16LE(p + 22)};
    if (id === 'data') data = b.subarray(p + 8, p + 8 + size);
    p += 8 + size + (size & 1);
  }
  if (!fmt || !data || fmt.bits !== 16) throw new Error(`${file}: expected 16-bit PCM`);
  const n = data.length / 2 / fmt.ch;
  const chans = Array.from({length: fmt.ch}, () => new Float64Array(n));
  for (let i = 0; i < n; i++) for (let c = 0; c < fmt.ch; c++) chans[c][i] = data.readInt16LE((i * fmt.ch + c) * 2) / 32768;
  return {sr: fmt.sr, chans};
}

function biquad(x, b, a) {
  const y = new Float64Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}

function kWeight(x, fs) {
  let K = Math.tan(Math.PI * 1681.974450955533 / fs);
  const Vh = 10 ** (3.999843853973347 / 20), Vb = Vh ** 0.4996667741545416;
  let Q = 0.7071752369554196, a0 = 1 + K / Q + K * K;
  x = biquad(x, [(Vh + Vb * K / Q + K * K) / a0, 2 * (K * K - Vh) / a0, (Vh - Vb * K / Q + K * K) / a0],
    [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]);
  K = Math.tan(Math.PI * 38.13547087602444 / fs);
  Q = 0.5003270373238773; a0 = 1 + K / Q + K * K;
  return biquad(x, [1, -2, 1], [1, 2 * (K * K - 1) / a0, (1 - K / Q + K * K) / a0]);
}

export function lufs({sr, chans}) {
  const y = chans.map((c) => kWeight(c, sr));
  const n = Math.round(0.4 * sr), hop = Math.round(0.1 * sr);
  const z = [];
  for (let i = 0; i + n <= y[0].length; i += hop) {
    let s = 0;
    for (const c of y) { let m = 0; for (let k = i; k < i + n; k++) m += c[k] * c[k]; s += m / n; }
    z.push(s);
  }
  const L = (v) => -0.691 + 10 * Math.log10(v + 1e-12);
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
  const abs = z.filter((v) => L(v) > -70);
  const rel = L(mean(abs)) - 10;
  return L(mean(abs.filter((v) => L(v) > rel)));
}

// 4x oversampling with a 48-tap-per-phase windowed sinc, as BS.1770 Annex 2 suggests
export function truePeak({chans}) {
  const R = 4, H = 24, taps = [];
  for (let ph = 0; ph < R; ph++) {
    const t = [];
    for (let k = -H; k < H; k++) {
      const u = k + ph / R, w = 0.5 + 0.5 * Math.cos(Math.PI * u / H);
      t.push(u === 0 ? 1 : (Math.sin(Math.PI * u) / (Math.PI * u)) * w);
    }
    taps.push(t);
  }
  let peak = 0;
  for (const x of chans) {
    for (let i = 0; i < x.length; i++) {
      peak = Math.max(peak, Math.abs(x[i]));
      if (Math.abs(x[i]) < 0.5) continue; // an inter-sample peak only matters next to a loud sample
      for (let ph = 1; ph < R; ph++) {
        let s = 0;
        for (let k = -H; k < H; k++) { const j = i - k; if (j >= 0 && j < x.length) s += x[j] * taps[ph][k + H]; }
        peak = Math.max(peak, Math.abs(s));
      }
    }
  }
  return 20 * Math.log10(peak + 1e-12);
}

const files = fs.readdirSync('public').filter((f) => /^soundtrack.*\.wav$/.test(f)).sort();
let errors = 0;
for (const f of files) {
  const name = path.basename(f, '.wav');
  const w = readWav(path.join('public', f));
  const I = lufs(w), tp = truePeak(w);
  const problems = [];
  if (Math.abs(I - TARGET) > TOL) problems.push(`${I.toFixed(1)} LUFS, the target is ${TARGET} ± ${TOL}`);
  if (tp > TRUE_PEAK + 0.3) problems.push(`true peak ${tp.toFixed(1)} dBTP, over the ${TRUE_PEAK} ceiling`);
  if (!problems.length) { console.log(`  ok    ${f}: ${I.toFixed(1)} LUFS, ${tp.toFixed(1)} dBTP`); continue; }
  const waived = WAIVED.has(name);
  if (!waived) errors++;
  console.log(`  ${waived ? 'warn ' : 'ERROR'} ${f}: ${problems.join('; ')}${waived ? ' (posted before the loudness rule)' : '. Re-run its audio script: synth.master normalises it'}`);
}
if (errors) { console.error(`check_loudness: ${errors} soundtrack(s) off the -16 LUFS standard`); process.exit(1); }
