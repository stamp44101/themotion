import {random} from 'remotion';
import {cityPoly, inPoly, shrinkPoly} from './poly';
import {inRiver as pointInRiver, isPathRiver, riverLength} from './river';
import type {CityLayout} from './types';

/** The station stands beside the track, never on it. A station placed on the rail
 *  line (Nakhon Sawan, Phitsanulok) had every train drive through the building, so
 *  it is moved to the platform side, 2.6 off the line. */
export const stationPos = (rail: NonNullable<CityLayout['rail']>): [number, number, number] => {
  const [sx, sz] = rail.station;
  const cross = rail.axis === 'z' ? sx : sz;
  const off = cross - rail.pos;
  if (Math.abs(off) >= 2.2) return [sx, 0, sz];
  const c = rail.pos + (off < 0 ? -2.6 : 2.6);
  return rail.axis === 'z' ? [c, 0, sz] : [sx, 0, c];
};

export type World = ReturnType<typeof buildWorld>;

const cache = new Map<CityLayout, World>();
export const getWorld = (L: CityLayout) => {
  let w = cache.get(L);
  if (!w) {
    w = buildWorld(L);
    cache.set(L, w);
  }
  return w;
};

const buildWorld = (L: CityLayout) => {
  const {tile, city} = L;
  const river = L.rivers[0];
  const S = tile.x1 - tile.x0;
  const C: [number, number] = [(tile.x0 + tile.x1) / 2, (tile.z0 + tile.z1) / 2];
  const peak = (x: number, z: number, cx: number, cz: number, h: number, r: number) =>
    h * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (r * r));
  const terrainH = (x: number, z: number) => {
    let h = 0;
    for (const [cx, cz, ph, r] of L.peaks) h += peak(x, z, cx, cz, ph, r);
    const n = Math.sin(x * 0.31) * Math.cos(z * 0.27) * 1.2 + Math.sin(x * 0.7 + z * 0.5) * 0.5;
    return h > 1.5 ? h + n * Math.min(1, h / 8) : h;
  };
  const inTile = (x: number, z: number, m = 1) => x > tile.x0 + m && x < tile.x1 - m && z > tile.z0 + m && z < tile.z1 - m;
  const poly = cityPoly(city);
  // With a real (non-rectangular) footprint the padded test has to grow the
  // polygon rather than the bounding box, or the corners leak.
  const inCity = (x: number, z: number, pad = 2.2) =>
    city.outline
      ? inPoly(shrinkPoly(poly, -pad), x, z)
      : Math.abs(x) < city.hx + pad && Math.abs(z) < city.hz + pad;
  const cityDist = (x: number, z: number) => Math.max(Math.abs(x) - city.hx, Math.abs(z) - city.hz, 0);
  const inRiver = (x: number, z: number) =>
    L.rivers.some((r) => pointInRiver(L, r, x, z, 0.8, r.width));
  const onRail = (x: number, z: number) => !!L.rail && Math.abs((L.rail.axis === 'z' ? x : z) - L.rail.pos) < 2;
  const onRoad = (x: number, z: number) =>
    L.roads.some(({from: [ax, az], to: [bx, bz], width}) => {
      const dx = bx - ax;
      const dz = bz - az;
      const len2 = dx * dx + dz * dz;
      const u = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / len2));
      return Math.hypot(x - (ax + u * dx), z - (az + u * dz)) < width / 2 + 0.6;
    });

  const trees: {x: number; y: number; z: number; s: number; clear: number; regrow?: [number, number]; tint: number}[] = [];
  for (let i = 0; i < 3400; i++) {
    const x = tile.x0 + 1 + random(`tx${i}`) * (S - 2);
    const z = tile.z0 + 1 + random(`tz${i}`) * (S - 2);
    if (inRiver(x, z)) continue;
    const h = terrainH(x, z);
    const r = random(`tr${i}`);
    let clear: number;
    let regrow: [number, number] | undefined;
    if (h > 1.2) clear = r < 0.1 ? 1960 + r * 400 : Infinity;
    else if (inCity(x, z, 0.8)) {
      clear = L.forestCity + r * 1.2;
      if (L.regrowCity && r < 0.45) regrow = [L.regrowCity[0] + random(`tg${i}`) * 40, L.regrowCity[1] + r * 10];
    } else if (inCity(x, z, 2.4)) clear = (L.noMoat ? city.wall[0] : city.moat[0]) + r;
    else if (r < 0.14) clear = Infinity;
    else if (r < 0.4) clear = L.paddies[0] + random(`tc${i}`) * (L.paddies[1] - L.paddies[0]);
    else clear = L.urban.from - 25 + cityDist(x, z) * L.urban.rate * 1.5 + random(`tc${i}`) * 45;
    if (onRail(x, z) && L.rail) clear = Math.min(clear, L.rail.open[0] - 1);
    if (L.rail) {
      const [sx, , sz] = stationPos(L.rail);
      if (Math.abs(x - sx) < 2.2 && Math.abs(z - sz) < 3) clear = Math.min(clear, L.rail.stationYear - 1);
    }
    if (onRoad(x, z)) clear = Math.min(clear, Math.min(...L.roads.map((rd) => rd.year)) - 1);
    for (const [cx, cz, cr, cy] of L.clearings ?? []) if (Math.hypot(x - cx, z - cz) < cr) clear = Math.min(clear, cy);
    trees.push({x, y: h, z, s: 0.7 + random(`ts${i}`) * 0.7, clear, regrow, tint: random(`tt${i}`)});
  }

  const paddies: {x: number; z: number; appear: number; urban: number; tone: number}[] = [];
  // landmark sites: nothing generated stands on a chedi, a gate or a monument
  const onSite = (x: number, z: number, pad: number) => (L.sites ?? []).some(([sx, sz, r]) => Math.hypot(x - sx, z - sz) < r + pad);
  const buildings: {x: number; z: number; w: number; d: number; h: number; lift: number; built: number; palette: number}[] = [];
  let k = 0;
  for (let z = tile.z0; z < tile.z1; z += 4) {
    for (let x = tile.x0; x < tile.x1; x += 4) {
      k++;
      const cx = x + 2;
      const cz = z + 2;
      if (!inTile(cx, cz, 2.2) || inCity(cx, cz, 3) || inRiver(cx, cz) || terrainH(cx, cz) > 0.6) continue;
      const d = cityDist(cx, cz);
      const ub = L.urbanBox;
      const inUrban = !ub || (cx > ub.x0 && cx < ub.x1 && cz > ub.z0 && cz < ub.z1);
      const urban = inUrban ? L.urban.from + d * L.urban.rate + random(`pu${k}`) * 30 : Infinity;
      if (random(`p${k}`) < 0.7) {
        paddies.push({x: cx, z: cz, appear: L.paddies[0] + random(`pa${k}`) * (L.paddies[1] - L.paddies[0]), urban, tone: random(`pt${k}`)});
      }
      if (onRail(cx, cz) || onRoad(cx, cz) || !inUrban) continue;
      const tower = L.towers.find((tw) => cx > tw.x0 && cx < tw.x1 && cz > tw.z0 && cz < tw.z1);
      const n = random(`bc${k}`) < 0.6 ? 2 : 1;
      for (let j = 0; j < n; j++) {
        const base = 0.8 + random(`bh${k}-${j}`) * 1.6;
        let h = base;
        if (tower) h += random(`bn${k}-${j}`) * tower.extra;
        else if (random(`bt${k}-${j}`) < 0.07) h += random(`bn${k}-${j}`) * 6;
        const bx = cx + (random(`bx${k}-${j}`) - 0.5) * 2.2;
        const bz = cz + (random(`bz${k}-${j}`) - 0.5) * 2.2;
        if (onRoad(bx, bz)) continue;
        // Korat's Wing 1 runway was built over by towers once the sprawl reached it
        if (L.openGround?.some((o) => bx > o.x0 - 1.1 && bx < o.x1 + 1.1 && bz > o.z0 - 1.1 && bz < o.z1 + 1.1)) continue;
        if (onSite(bx, bz, 1.1)) continue;
        buildings.push({
          x: bx,
          z: bz,
          w: 1.0 + random(`bw${k}-${j}`) * 1.2,
          d: 1.0 + random(`bd${k}-${j}`) * 1.2,
          h,
          lift: h - base,
          built: urban + 4 + random(`bb${k}-${j}`) * 16 - (tower ? 12 : 0),
          palette: Math.floor(random(`bp${k}-${j}`) * 5),
        });
      }
    }
  }

  const houses: {x: number; z: number; rot: number; built: number; gone: number; rebuilt: number; modern: number; modernH: number; palette: number}[] = [];
  k = 0;
  for (let z = -city.hz + 1; z <= city.hz - 0.99; z += 1.3) {
    for (let x = -city.hx + 1; x <= city.hx - 0.99; x += 1.3) {
      k++;
      const hx = x + (random(`hx${k}`) - 0.5) * 0.4;
      const hz = z + (random(`hz${k}`) - 0.5) * 0.4;
      // keep the grid inside the real footprint, a little clear of the wall
      if (city.outline && !inPoly(shrinkPoly(poly, 1.1), hx, hz)) continue;
      if (L.houses.keepOut.some(([kx, kz, r]) => Math.abs(hx - kx) < r && Math.abs(hz - kz) < r)) continue;
      if (onSite(hx, hz, 0.5)) continue;
      if (Math.abs(hz) < 0.7 || Math.abs(hx) < 0.6) continue; // main cross streets
      // Nothing is built on open water. Every other placement pass already
      // skips the rivers; this one did not, which only showed up once a city
      // (Phitsanulok) had a river running *through* the walled area.
      if (inRiver(hx, hz)) continue;
      const ab = L.houses.abandon;
      const abandoned = !!ab && random(`ha${k}`) < ab.prob;
      houses.push({
        x: hx,
        z: hz,
        rot: random(`hr0${k}`) < 0.5 ? 0 : Math.PI / 2,
        built: L.houses.built[0] + Math.pow(random(`hb${k}`), 1.6) * L.houses.built[1],
        gone: abandoned && ab ? ab.from + random(`hg${k}`) * ab.spread : Infinity,
        rebuilt: abandoned && ab ? ab.rebuild + random(`hr${k}`) * ab.rebuildSpread : Infinity,
        modern: random(`hm${k}`) < 0.6 ? L.houses.modern[0] + random(`hn${k}`) * L.houses.modern[1] : Infinity,
        modernH: 0.6 + random(`hh${k}`) * 0.9,
        palette: Math.floor(random(`hp${k}`) * 5),
      });
    }
  }

  const village: {x: number; z: number; rot: number; built: number; urban: number}[] = [];
  L.villages.centers.forEach(([cx, cz], c) => {
    for (let j = 0; j < 16; j++) {
      const a = random(`va${c}-${j}`) * Math.PI * 2;
      const r = 1 + random(`vr${c}-${j}`) * 5;
      const x = cx + Math.cos(a) * r;
      const z = cz + Math.sin(a) * r;
      if (inRiver(x, z) || inCity(x, z, 3) || !inTile(x, z, 2) || onRoad(x, z) || onRail(x, z) || onSite(x, z, 0.6)) continue;
      village.push({
        x,
        z,
        rot: random(`vo${c}-${j}`) < 0.5 ? 0 : Math.PI / 2,
        built: L.villages.built[0] + random(`vb${c}-${j}`) * L.villages.built[1],
        urban: L.urban.from + cityDist(x, z) * L.urban.rate + random(`vu${c}-${j}`) * 25,
      });
    }
  });

  const boatRun = isPathRiver(river) ? riverLength(L, river) : S;
  const boats = new Array(6).fill(0).map((_, i) => ({
    at: random(`boz${i}`) * Math.max(0, boatRun - 6) + Math.min(3, boatRun / 2),
    sp: (random(`bos${i}`) < 0.5 ? -1 : 1) * (1.5 + random(`bov${i}`) * 2),
    off: (random(`boo${i}`) - 0.5) * river.width * 0.5,
  }));

  return {S, C, terrainH, trees, paddies, buildings, houses, village, boats, inTile, cityDist};
};
