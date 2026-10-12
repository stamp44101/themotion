import {random} from 'remotion';

// World units: the old-city square spans x, z in [-10, 10]. +x = east, -z = north, y = up.
// The Ping River runs north–south east of the city; Doi Suthep rises to the west/north-west.
export const RIVER_X = 26;
export const RIVER_W = 5;
export const RAIL_X = 40;
// The world is a floating diorama tile.
export const TILE = {x0: -52, x1: 44, z0: -52, z1: 44};
export const TILE_C = [(TILE.x0 + TILE.x1) / 2, (TILE.z0 + TILE.z1) / 2] as const;
export const TILE_S = TILE.x1 - TILE.x0;
const inTile = (x: number, z: number, m = 1) => x > TILE.x0 + m && x < TILE.x1 - m && z > TILE.z0 + m && z < TILE.z1 - m;

const peak = (x: number, z: number, cx: number, cz: number, h: number, r: number) => {
  const d2 = ((x - cx) ** 2 + (z - cz) ** 2) / (r * r);
  return h * Math.exp(-d2);
};
// Doi Suthep (with the temple shoulder) and Doi Pui behind it.
export const terrainH = (x: number, z: number) => {
  const h =
    peak(x, z, -40, -38, 17, 15) +
    peak(x, z, -49, -47, 20, 13) +
    peak(x, z, -28, -24, 5, 8) +
    peak(x, z, -50, -20, 11, 13) +
    peak(x, z, -22, -48, 9, 12);
  const n = Math.sin(x * 0.31) * Math.cos(z * 0.27) * 1.2 + Math.sin(x * 0.7 + z * 0.5) * 0.5;
  return h > 1.5 ? h + n * Math.min(1, h / 8) : h;
};

export const DOI_SUTHEP_TEMPLE: [number, number, number] = (() => {
  const x = -32;
  const z = -28;
  return [x, terrainH(x, z) + 0.2, z];
})();

export const ROAD_PATH: [number, number][] = [
  [-13, -11],
  [-18, -14],
  [-22, -12],
  [-24, -18],
  [-27, -16],
  [-29, -22],
  [-32, -28],
];

const inCity = (x: number, z: number, pad = 12.2) => Math.abs(x) < pad && Math.abs(z) < pad;
const cityDist = (x: number, z: number) => Math.max(Math.abs(x) - 10, Math.abs(z) - 10, 0);
const inRiver = (x: number) => Math.abs(x - RIVER_X) < RIVER_W / 2 + 0.8;

export type Tree = {x: number; y: number; z: number; s: number; clear: number; regrow?: [number, number]; tint: number};
export const TREES: Tree[] = [];
for (let i = 0; i < 3400; i++) {
  const x = TILE.x0 + 1 + random(`tx${i}`) * (TILE_S - 2);
  const z = TILE.z0 + 1 + random(`tz${i}`) * (TILE_S - 2);
  if (inRiver(x)) continue;
  const h = terrainH(x, z);
  const r = random(`tr${i}`);
  let clear: number;
  let regrow: [number, number] | undefined;
  if (h > 1.2) {
    clear = r < 0.1 ? 1960 + r * 400 : Infinity; // mountain forest stays
  } else if (inCity(x, z, 10.8)) {
    clear = 1294.6 + r * 1.2;
    if (r < 0.45) regrow = [1600 + random(`tg${i}`) * 120, 1786 + r * 20];
  } else if (Math.abs(Math.abs(x) - 11.2) < 1.2 && Math.abs(z) < 12.4) {
    clear = 1294.4 + r; // moat line
  } else if (Math.abs(Math.abs(z) - 11.2) < 1.2 && Math.abs(x) < 12.4) {
    clear = 1294.4 + r;
  } else if (r < 0.14) {
    clear = Infinity;
  } else if (r < 0.4) {
    clear = 880 + random(`tc${i}`) * 380; // rice fields
  } else {
    clear = 1905 + cityDist(x, z) * 2.4 + random(`tc${i}`) * 45;
  }
  if (x > RAIL_X - 2 && x < RAIL_X + 2) clear = Math.min(clear, 1919);
  TREES.push({x, y: h, z, s: 0.7 + random(`ts${i}`) * 0.7, clear, regrow, tint: random(`tt${i}`)});
}

export type Paddy = {x: number; z: number; appear: number; urban: number; tone: number};
export const PADDIES: Paddy[] = [];
export type Building = {x: number; z: number; w: number; d: number; h: number; built: number; palette: number};
export const BUILDINGS: Building[] = [];
{
  let k = 0;
  for (let z = -60; z < 40; z += 4) {
    for (let x = -60; x < 56; x += 4) {
      k++;
      const cx = x + 2;
      const cz = z + 2;
      if (!inTile(cx, cz, 2.2) || inCity(cx, cz, 13) || inRiver(cx) || terrainH(cx, cz) > 0.6) continue;
      const d = cityDist(cx, cz);
      const urban = 1930 + d * 1.6 + random(`pu${k}`) * 30;
      if (random(`p${k}`) < 0.7) {
        PADDIES.push({x: cx, z: cz, appear: 860 + random(`pa${k}`) * 420, urban, tone: random(`pt${k}`)});
      }
      if (Math.abs(cx - RAIL_X) < 2.5) continue;
      const nimman = cx < -10 && cx > -30 && cz < -8 && cz > -30;
      const riverside = cx > 13 && cx < RIVER_X - 3 && Math.abs(cz) < 18;
      const n = random(`bc${k}`) < 0.6 ? 2 : 1;
      for (let j = 0; j < n; j++) {
        let h = 0.8 + random(`bh${k}-${j}`) * 1.6;
        if (nimman) h += random(`bn${k}-${j}`) * 9;
        else if (riverside) h += random(`bn${k}-${j}`) * 5;
        else if (random(`bt${k}-${j}`) < 0.07) h += random(`bn${k}-${j}`) * 6;
        BUILDINGS.push({
          x: cx + (random(`bx${k}-${j}`) - 0.5) * 2.2,
          z: cz + (random(`bz${k}-${j}`) - 0.5) * 2.2,
          w: 1.0 + random(`bw${k}-${j}`) * 1.2,
          d: 1.0 + random(`bd${k}-${j}`) * 1.2,
          h,
          built: urban + 4 + random(`bb${k}-${j}`) * 16 - (nimman ? 12 : 0),
          palette: Math.floor(random(`bp${k}-${j}`) * 5),
        });
      }
    }
  }
}

export type House = {
  x: number;
  z: number;
  rot: number;
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
  for (let z = -9; z <= 9.01; z += 1.3) {
    for (let x = -9; x <= 9.01; x += 1.3) {
      k++;
      const hx = x + (random(`hx${k}`) - 0.5) * 0.4;
      const hz = z + (random(`hz${k}`) - 0.5) * 0.4;
      if (Math.abs(hx) < 3.2 && Math.abs(hz) < 3.2) continue; // Wat Chedi Luang compound
      if (Math.abs(hx + 4.5) < 1.6 && Math.abs(hz - 0.5) < 1.6) continue; // Wat Phra Singh
      if (Math.abs(hx - 5.5) < 1.3 && Math.abs(hz + 6.5) < 1.3) continue; // Wat Chiang Man
      if (Math.abs(hz) < 0.7) continue; // Ratchadamnoen road to Tha Phae gate
      const abandoned = random(`ha${k}`) < 0.78;
      HOUSES.push({
        x: hx,
        z: hz,
        rot: random(`hr0${k}`) < 0.5 ? 0 : Math.PI / 2,
        built: 1296.6 + Math.pow(random(`hb${k}`), 1.6) * 190,
        gone: abandoned ? 1566 + random(`hg${k}`) * 170 : Infinity,
        rebuilt: abandoned ? 1796 + random(`hr${k}`) * 45 : Infinity,
        modern: random(`hm${k}`) < 0.6 ? 1925 + random(`hn${k}`) * 85 : Infinity,
        modernH: 0.6 + random(`hh${k}`) * 0.9,
        palette: Math.floor(random(`hp${k}`) * 5),
      });
    }
  }
}

// Rural Lanna villages on the plain: appear with the kingdom, give way to the modern city.
export const VILLAGE: {x: number; z: number; rot: number; built: number; urban: number}[] = [];
{
  const centers: [number, number][] = [[-24, 14], [18, 22], [-30, -6], [34, 16], [12, -26], [-8, 28], [36, -24]];
  centers.forEach(([cx, cz], c) => {
    for (let j = 0; j < 16; j++) {
      const a = random(`va${c}-${j}`) * Math.PI * 2;
      const r = 1 + random(`vr${c}-${j}`) * 5;
      const x = cx + Math.cos(a) * r;
      const z = cz + Math.sin(a) * r;
      if (inRiver(x) || inCity(x, z, 13)) continue;
      VILLAGE.push({
        x,
        z,
        rot: random(`vo${c}-${j}`) < 0.5 ? 0 : Math.PI / 2,
        built: 1300 + random(`vb${c}-${j}`) * 180,
        urban: 1935 + cityDist(x, z) * 1.6 + random(`vu${c}-${j}`) * 25,
      });
    }
  });
}

export const CLOUDS = new Array(5).fill(0).map((_, i) => ({
  x: random(`cx${i}`) * 160,
  y: 48 + random(`cy${i}`) * 10,
  z: -56 + random(`cz${i}`) * 100,
  s: 2.2 + random(`cs${i}`) * 2.2,
  sp: 0.6 + random(`cp${i}`) * 0.8,
  puffs: new Array(5).fill(0).map((__, j) => [
    (random(`cpx${i}-${j}`) - 0.5) * 3.2,
    random(`cpy${i}-${j}`) * 0.8,
    (random(`cpz${i}-${j}`) - 0.5) * 1.8,
    0.7 + random(`cps${i}-${j}`) * 0.6,
  ]),
}));

export const LANTERNS = new Array(220).fill(0).map((_, i) => ({
  t0: 55.0 + random(`lt${i}`) * 4.8,
  x: (random(`lx${i}`) - 0.5) * 34,
  z: (random(`lz${i}`) - 0.5) * 34,
  speed: 2.2 + random(`lv${i}`) * 2.2,
  wob: random(`lw${i}`) * Math.PI * 2,
}));

export const BOATS = new Array(6).fill(0).map((_, i) => ({
  z: random(`boz${i}`) * 90 - 50,
  sp: (random(`bos${i}`) < 0.5 ? -1 : 1) * (1.5 + random(`bov${i}`) * 2),
  off: (random(`boo${i}`) - 0.5) * 2.4,
}));

export const KUKUT: [number, number] = [-16, 32];
export const LAWA_HUTS: [number, number][] = [
  [-20, -16],
  [-34, -6],
  [-16, -30],
  [-24, 2],
];
