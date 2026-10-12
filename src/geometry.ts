import {random} from 'remotion';

// Camera looks west from the east bank of the Ping River toward Doi Suthep.
// (u, v) are ground coordinates: the old-city square spans u, v in [-1, 1];
// u runs south (-) to north (+), v runs west/far (-) to east/near (+).
export const proj = (u: number, v: number) => {
  const s = 0.86 + 0.14 * v;
  return {x: 540 + u * 355 * s, y: 1230 + v * 100, s};
};

const inCity = (u: number, v: number, pad = 1.18) => Math.abs(u) < pad && Math.abs(v) < pad;
const cityDist = (u: number, v: number) => Math.max(Math.abs(u) - 1, Math.abs(v) - 1, 0);
const uMax = (v: number) => 620 / (355 * (0.86 + 0.14 * v));

export type Tree = {u: number; v: number; clear: number; regrow?: [number, number]; dark: boolean};
export const TREES: Tree[] = [];
for (let i = 0; i < 340; i++) {
  const v = -2.25 + random(`tv${i}`) * 4.15;
  const u = (random(`tu${i}`) - 0.5) * 2 * uMax(v);
  const r = random(`tr${i}`);
  let clear: number;
  let regrow: [number, number] | undefined;
  if (inCity(u, v)) {
    clear = 1294.6 + r * 1.2;
    if (r < 0.4) regrow = [1600 + random(`tg${i}`) * 120, 1786 + r * 20];
  } else if (v < -1.95 && r > 0.25) {
    clear = Infinity; // forest at the foot of Doi Suthep
  } else if (r < 0.16) {
    clear = Infinity;
  } else if (r < 0.38) {
    clear = 880 + random(`tc${i}`) * 380; // rice fields
  } else {
    clear = 1905 + cityDist(u, v) * 50 + random(`tc${i}`) * 45;
  }
  TREES.push({u, v, clear, regrow, dark: random(`td${i}`) < 0.5});
}

export type Paddy = {u: number; v: number; du: number; dv: number; appear: number; urban: number};
export const PADDIES: Paddy[] = [];
export type Building = {u: number; v: number; w: number; h: number; built: number; palette: number; lit: number};
export const BUILDINGS: Building[] = [];
{
  let k = 0;
  for (let v = -2.05; v < 1.9; v += 0.3) {
    const um = uMax(v);
    for (let u = -um; u < um; u += 0.42) {
      k++;
      const cu = u + 0.21;
      const cv = v + 0.15;
      if (inCity(cu, cv, 1.25)) continue;
      const d = cityDist(cu, cv);
      const r = random(`p${k}`);
      const urban = 1935 + d * 38 + random(`pu${k}`) * 30;
      if (r < 0.62) {
        PADDIES.push({u: cu, v: cv, du: 0.19, dv: 0.13, appear: 860 + random(`pa${k}`) * 420, urban});
      }
      if (cv < -1.95 || cv > 1.85) continue;
      const nimman = cu > 0.7 && cv < -0.9 && cv > -1.95;
      const riverside = cv > 1.1 && Math.abs(cu) < 1.6;
      const count = random(`bc${k}`) < 0.55 ? 2 : 1;
      for (let j = 0; j < count; j++) {
        const rr = random(`bh${k}-${j}`);
        let h = 16 + rr * 34;
        if (nimman) h += random(`bn${k}-${j}`) * 125;
        else if (riverside) h += random(`bn${k}-${j}`) * 85;
        else if (random(`bt${k}-${j}`) < 0.08) h += random(`bn${k}-${j}`) * 110;
        BUILDINGS.push({
          u: cu + (random(`bx${k}-${j}`) - 0.5) * 0.3,
          v: cv + (random(`by${k}-${j}`) - 0.5) * 0.18,
          w: 24 + random(`bw${k}-${j}`) * 22,
          h,
          built: urban + 4 + random(`bb${k}-${j}`) * 18 - (nimman ? 15 : 0),
          palette: Math.floor(random(`bp${k}-${j}`) * 5),
          lit: 0.45 + random(`bl${k}-${j}`) * 0.55,
        });
      }
    }
  }
}

export type House = {
  u: number;
  v: number;
  built: number;
  gone: number;
  rebuilt: number;
  modern: number;
  modernH: number;
  palette: number;
};
export const HOUSES: House[] = [];
{
  let k = 0;
  for (let v = -0.9; v <= 0.92; v += 0.15) {
    for (let u = -0.9; u <= 0.92; u += 0.15) {
      k++;
      const hu = u + (random(`hx${k}`) - 0.5) * 0.08;
      const hv = v + (random(`hy${k}`) - 0.5) * 0.06;
      if (Math.abs(hu) < 0.28 && Math.abs(hv) < 0.3) continue; // Wat Chedi Luang
      if (Math.abs(hu + 0.35) < 0.14 && Math.abs(hv + 0.45) < 0.14) continue; // Wat Phra Singh
      if (Math.abs(hu - 0.55) < 0.12 && Math.abs(hv - 0.55) < 0.12) continue; // Wat Chiang Man
      if (Math.abs(hu) < 0.12 && hv > 0.8) continue; // Tha Phae gate road
      const abandoned = random(`ha${k}`) < 0.78;
      HOUSES.push({
        u: hu,
        v: hv,
        built: 1296.6 + Math.pow(random(`hb${k}`), 1.6) * 190,
        gone: abandoned ? 1566 + random(`hg${k}`) * 170 : Infinity,
        rebuilt: abandoned ? 1796 + random(`hr${k}`) * 45 : Infinity,
        modern: random(`hm${k}`) < 0.6 ? 1925 + random(`hn${k}`) * 85 : Infinity,
        modernH: 14 + random(`hh${k}`) * 22,
        palette: Math.floor(random(`hp${k}`) * 5),
      });
    }
  }
}

export const STARS = new Array(80).fill(0).map((_, i) => ({
  x: random(`sx${i}`) * 1080,
  y: random(`sy${i}`) * 880,
  r: 0.8 + random(`sr${i}`) * 1.8,
  tw: random(`st${i}`) * Math.PI * 2,
}));

export const CLOUDS = new Array(7).fill(0).map((_, i) => ({
  x: random(`cx${i}`) * 1500,
  y: 140 + random(`cy${i}`) * 680,
  sc: 0.6 + random(`cs${i}`) * 0.9,
  sp: 0.7 + random(`cp${i}`) * 0.8,
}));

export const LANTERNS = new Array(110).fill(0).map((_, i) => ({
  t0: 55.0 + random(`lt${i}`) * 4.6,
  x: 160 + random(`lx${i}`) * 760,
  y: 1150 + random(`ly${i}`) * 230,
  speed: 150 + random(`lv${i}`) * 140,
  wob: random(`lw${i}`) * Math.PI * 2,
  size: 0.7 + random(`ls${i}`) * 0.6,
}));

export const MOUNTAIN_FOREST = new Array(70).fill(0).map((_, i) => ({
  x: random(`mx${i}`) * 1100,
  y: 0,
  r: 10 + random(`mr${i}`) * 26,
  k: random(`mk${i}`),
}));

// Doi Suthep ridge silhouette, interpolated for placing texture on it.
export const RIDGE: [number, number][] = [
  [-20, 905],
  [80, 830],
  [200, 715],
  [330, 645],
  [450, 690],
  [560, 765],
  [700, 845],
  [850, 905],
  [1100, 965],
];
export const ridgeY = (x: number) => {
  for (let i = 0; i < RIDGE.length - 1; i++) {
    const [x0, y0] = RIDGE[i];
    const [x1, y1] = RIDGE[i + 1];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return RIDGE[RIDGE.length - 1][1];
};

// East-bank forest in the foreground; rows near the railway clear before it arrives (1921).
export const BANK_TREES = new Array(44)
  .fill(0)
  .map((_, i) => {
    const y = 1568 + random(`ky${i}`) * 140;
    const r = random(`kc${i}`);
    const clear = r < 0.22 ? Infinity : y > 1600 ? 1840 + r * 75 : 1880 + r * 120;
    return {x: random(`kx${i}`) * 1100 - 10, y, s: 1.7 + ((y - 1568) / 140) * 1.0, clear, dark: random(`kd${i}`) < 0.5};
  })
  .sort((a, b) => a.y - b.y);
