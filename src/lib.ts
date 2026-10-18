export const FPS = 30;
export const SECONDS = 60;
export const W = 1080;
export const H = 1920;
/** The intro title is gone by this time; captions and callouts start no earlier
 *  (scripts/check_story.mjs enforces it, the Overlay also holds them back). */
export const INTRO_END = 3.0;
/** The finale title fades in this many seconds before the end; captions and
 *  callouts must be gone by then. */
export const FINALE_LEAD = 4;

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ramp = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
export const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
export const sstep = (a: number, b: number, x: number) => smooth((x - a) / (b - a));
export const bump = (x: number, a: number, b: number, fade = 0.4) =>
  sstep(a, a + fade, x) * (1 - sstep(b - fade, b, x));

const hexToRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, t: number) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const c = clamp01(t);
  return (
    '#' +
    A.map((v, i) => Math.round(v + (B[i] - v) * c).toString(16).padStart(2, '0')).join('')
  );
};
export const keyColor = (stops: [number, string][], x: number) => {
  if (x <= stops[0][0]) return stops[0][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [x0, c0] = stops[i];
    const [x1, c1] = stops[i + 1];
    if (x <= x1) return mix(c0, c1, (x - x0) / (x1 - x0));
  }
  return stops[stops.length - 1][1];
};

// Seconds -> Christian-era year. Slow segments hold on key events, fast ones fly.
const KEYS: [number, number][] = [
  [0, 400],
  [3, 500],
  [9, 1100],
  [13, 1280],
  [14, 1293],
  [20, 1298], // founding of Chiang Mai, 1296
  [24, 1380],
  [27, 1480], // Lanna golden age
  [29, 1544],
  [31, 1546], // earthquake, 1545
  [34, 1560], // Burmese rule from 1558
  [36.5, 1770],
  [39, 1776], // Kawila, 1775
  [42, 1800], // resettled 1796
  [44, 1900],
  [46, 1923], // railway, 1921
  [48, 1936], // Doi Suthep road, 1935
  [53, 2000],
  [56, 2026],
  [60, 2026],
];

const xs = KEYS.map((k) => k[0]);
const ys = KEYS.map((k) => k[1]);
// Fritsch–Carlson monotone cubic tangents, so the counter never runs backwards.
const tangents = (() => {
  const n = xs.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  const m = new Array<number>(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  return m;
})();

export const yearAt = (t: number) => {
  if (t <= xs[0]) return ys[0];
  if (t >= xs[xs.length - 1]) return ys[ys.length - 1];
  let i = 0;
  while (t > xs[i + 1]) i++;
  const h = xs[i + 1] - xs[i];
  const u = (t - xs[i]) / h;
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    (2 * u3 - 3 * u2 + 1) * ys[i] +
    (u3 - 2 * u2 + u) * h * tangents[i] +
    (-2 * u3 + 3 * u2) * ys[i + 1] +
    (u3 - u2) * h * tangents[i + 1]
  );
};

/** `note`: a small footnote line under the sub (Khon Kaen's 1976 find: ครบ 50 ปี in 2569). It may
 *  name a year other than the counter's, so the caption-year hold check reads only the sub. */
export type Caption = {t0: number; t1: number; title: string; sub: string; note?: string};

export const CAPTIONS: Caption[] = [
  {t0: 3, t1: 9, title: 'ก่อนมีเมือง', sub: 'หุบเขาลุ่มน้ำปิง เชิงดอยสุเทพ ถิ่นฐานดั้งเดิมของชาวลัวะ'},
  {t0: 9, t1: 14, title: 'หริภุญชัย', sub: 'อาณาจักรมอญของพระนางจามเทวี รุ่งเรืองอยู่ทางใต้ ณ ลำพูน'},
  {
    t0: 14,
    t1: 19.3,
    title: 'พญามังรายสร้างเมือง',
    sub: 'ร่วมกับพญางำเมืองและพ่อขุนรามคำแหง ขุดคูน้ำ ก่อกำแพงเมืองสี่เหลี่ยม',
  },
  {t0: 19.3, t1: 24, title: 'นพบุรีศรีนครพิงค์เชียงใหม่', sub: 'ราชธานีแห่งอาณาจักรล้านนา'},
  {
    t0: 24,
    t1: 29,
    title: 'ยุคทองล้านนา',
    sub: 'พระธาตุดอยสุเทพ · เจดีย์หลวงสูงตระหง่าน · สังคายนาพระไตรปิฎก ณ วัดเจ็ดยอด',
  },
  {t0: 29, t1: 31.6, title: 'แผ่นดินไหวครั้งใหญ่', sub: 'ยอดเจดีย์หลวงพังทลายลง'},
  {t0: 31.6, t1: 37, title: 'ใต้อำนาจพม่า', sub: 'กว่า 200 ปี บ้านเมืองทรุดโทรมจนร้างผู้คน'},
  {
    t0: 37,
    t1: 43,
    title: 'พระเจ้ากาวิละ',
    sub: 'ร่วมกับสยามขับไล่พม่า แล้วฟื้นฟูเชียงใหม่ขึ้นใหม่ พ.ศ. 2339',
  },
  {t0: 43, t1: 47, title: 'สู่สยามประเทศ', sub: 'ทางรถไฟสายเหนือมาถึงเชียงใหม่ พ.ศ. 2464'},
  {t0: 47, t1: 50, title: 'ทางขึ้นดอยสุเทพ', sub: 'ครูบาศรีวิชัยนำแรงศรัทธาสร้างถนน พ.ศ. 2478'},
  {
    t0: 50,
    t1: 55.6,
    title: 'เมืองสมัยใหม่',
    sub: 'มหาวิทยาลัย สนามบิน นิมมานฯ นครแห่งการท่องเที่ยวและงานสร้างสรรค์',
  },
];

export const ERAS: {t: number; label: string}[] = [
  {t: 3, label: 'ลัวะ'},
  {t: 9, label: 'หริภุญชัย'},
  {t: 14, label: 'ล้านนา'},
  {t: 31.6, label: 'พม่า'},
  {t: 37, label: 'กาวิละ'},
  {t: 43, label: 'สยาม'},
  {t: 50, label: 'ปัจจุบัน'},
];

export type Callout = {t0: number; t1: number; x: number; y: number; dx: number; dy: number; label: string};

// Generic monotone-cubic curve over [time, value] keys.
export const makeCurve = (keys: [number, number][]) => {
  const kx = keys.map((k) => k[0]);
  const ky = keys.map((k) => k[1]);
  const n = kx.length;
  const d: number[] = [];
  for (let i = 0; i < n - 1; i++) d.push((ky[i + 1] - ky[i]) / (kx[i + 1] - kx[i]));
  const m = new Array<number>(n).fill(0);
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0;
      m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i];
    const b = m[i + 1] / d[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      m[i] = tau * a * d[i];
      m[i + 1] = tau * b * d[i];
    }
  }
  return (t: number) => {
    if (t <= kx[0]) return ky[0];
    if (t >= kx[n - 1]) return ky[n - 1];
    let i = 0;
    while (t > kx[i + 1]) i++;
    const h = kx[i + 1] - kx[i];
    const u = (t - kx[i]) / h;
    const u2 = u * u;
    const u3 = u2 * u;
    return (
      (2 * u3 - 3 * u2 + 1) * ky[i] +
      (u3 - 2 * u2 + u) * h * m[i] +
      (-2 * u3 + 3 * u2) * ky[i + 1] +
      (u3 - u2) * h * m[i + 1]
    );
  };
};

// Camera: [seconds, zoom, focusX, focusY] in plain-layer coordinates.
const CAM: [number, number, number, number][] = [
  [0, 1.0, 540, 960],
  [3, 1.05, 540, 960],
  [8.5, 1.1, 470, 980],
  [13.5, 1.08, 420, 1000],
  [16, 1.32, 540, 1160],
  [21, 1.42, 540, 1180],
  [24.2, 1.22, 560, 860],
  [27.2, 1.25, 600, 1000],
  [29.8, 1.5, 540, 1120],
  [31.2, 1.45, 540, 1110],
  [34.5, 1.12, 540, 1040],
  [38, 1.15, 520, 1060],
  [42.5, 1.18, 560, 1100],
  [45.5, 1.35, 650, 1350],
  [47.2, 1.32, 640, 1300],
  [48.4, 1.25, 620, 880],
  [50.5, 1.1, 600, 980],
  [55, 1.2, 620, 1060],
  [60, 1.02, 540, 960],
];
const camZ = makeCurve(CAM.map((c) => [c[0], c[1]]));
const camX = makeCurve(CAM.map((c) => [c[0], c[2]]));
const camY = makeCurve(CAM.map((c) => [c[0], c[3]]));
export type Cam = {z: number; x: number; y: number};
export const camera = (t: number): Cam => {
  const z = camZ(t);
  const hw = W / 2 / z;
  const hh = H / 2 / z;
  return {
    z,
    x: Math.min(W - hw, Math.max(hw, camX(t))),
    y: Math.min(H - hh, Math.max(hh, camY(t))),
  };
};
// Parallax: depth p = 1 is the city plain; smaller p moves less (sky, mountains).
const layerCam = (c: Cam, p: number) => ({
  z: 1 + (c.z - 1) * p,
  x: W / 2 + (c.x - W / 2) * p,
  y: H / 2 + (c.y - H / 2) * p,
});
export const layerTransform = (c: Cam, p: number) => {
  const l = layerCam(c, p);
  return `translate(${W / 2},${H / 2}) scale(${l.z}) translate(${-l.x},${-l.y})`;
};
export const camPoint = (c: Cam, p: number, x: number, y: number) => {
  const l = layerCam(c, p);
  return {x: W / 2 + (x - l.x) * l.z, y: H / 2 + (y - l.y) * l.z};
};

// Day/night: a 5 s cycle sells the timelapse; the finale settles into night.
// The day–night cycle runs continuously from the first frame. It used to restart when the intro
// title ended, which jumped the sun from noon to the horizon in one frame; and its nights were
// deep and switched on over ~0.4 s, which read as flicker rather than time passing.
const CYCLE = 6; // seconds per day–night cycle
export const DAYLIGHT = 0.8; // fraction of the cycle the sun is above the horizon
const NIGHT_DEPTH = 0.4; // story-time nights stay readable; the finale goes fully dark
// Raised-cosine bump on the cycle (wraps around), so light fades in and out with no corners.
const cycleBump = (cyc: number, centre: number, half: number) => {
  let d = Math.abs(cyc - centre);
  d = Math.min(d, 1 - d);
  return d >= half ? 0 : 0.5 * (1 + Math.cos((Math.PI * d) / half));
};

export const lighting = (t: number, dur: number = SECONDS) => {
  const intro = t < 3;
  const cyc = (t / CYCLE + 0.08) % 1; // opens just after sunrise
  const finale = sstep(dur - 5.4, dur - 3.8, t);
  let night = cycleBump(cyc, 0.9, 0.2) * NIGHT_DEPTH;
  let dusk = cycleBump(cyc, 0.74, 0.14);
  night = Math.max(night * (1 - finale), finale * 0.92);
  dusk *= 1 - finale;
  return {intro, cyc, finale, night, dusk};
};
