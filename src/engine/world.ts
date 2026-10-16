import {random} from 'remotion';
import {Occupancy, baseOccupancy, stationPos} from './occupancy';
import {cityPoly, inPoly, shrinkPoly} from './poly';
import {isPathRiver, riverLength} from './river';
import type {CityLayout} from './types';

export {stationPos};

/** Extent of the railway along its axis: the whole tile unless `rail.span` ends it at a terminus. */
export const railSpan = (L: CityLayout): [number, number] => {
  const {rail, tile} = L;
  if (rail?.span) return rail.span;
  return rail?.axis === 'z' ? [tile.z0, tile.z1] : [tile.x0, tile.x1];
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

// finite: a ramp(Y, Infinity, Infinity) is NaN and makes a mesh vanish
const FOREVER = 1e9;
const ALWAYS = -1e9;

// Placement goes through one occupancy map (occupancy.ts): water, landmark sites, open
// ground, roads, rail and the station are claimed first, then trees, then buildings,
// houses and huts in that order. Trees under anything built later are evicted at its
// build year; a building, house or hut that would stand on something it must not is
// not placed. Generation order and random seeds are unchanged from the per-generator
// version, so a posted city only moves where it was wrong.
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

  const occ: Occupancy = baseOccupancy(L);
  // the old in-city keep-out boxes are landmark ground too
  for (const [kx, kz, r] of L.houses.keepOut) occ.record({rect: [kx, kz, 2 * r, 2 * r]}, {kind: 'site', from: ALWAYS, to: FOREVER, label: 'keepOut'});

  const trees: {x: number; y: number; z: number; s: number; clear: number; regrow?: [number, number]; tint: number}[] = [];
  for (let i = 0; i < 3400; i++) {
    const x = tile.x0 + 1 + random(`tx${i}`) * (S - 2);
    const z = tile.z0 + 1 + random(`tz${i}`) * (S - 2);
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
    for (const [cx, cz, cr, cy] of L.clearings ?? []) if (Math.hypot(x - cx, z - cz) < cr) clear = Math.min(clear, cy);
    const tree = {x, y: h, z, s: 0.7 + random(`ts${i}`) * 0.7, clear, regrow, tint: random(`tt${i}`)};
    // a tree in the water is never planted; one where a road, the rail or the station
    // comes later is felled the year before it is built; a building felling it later
    // comes through onEvict
    const stood = occ.claim(
      {disc: [x, z, 0.3]},
      {
        kind: 'tree',
        from: ALWAYS,
        to: clear,
        onEvict: (year) => {
          tree.clear = Math.min(tree.clear, year - 1);
          tree.regrow = undefined;
        },
      },
      0.5,
    );
    if (!stood) continue;
    if (stood[1] < clear) {
      tree.clear = stood[1] - 1;
      tree.regrow = undefined;
    }
    // forest that reclaims an abandoned town (Ayutthaya after 1767) is a second stand:
    // it never grows where a house is rebuilt or a road comes, and is cut when they do
    if (tree.regrow) {
      const rg = occ.claim(
        {disc: [x, z, 0.3]},
        {
          kind: 'tree',
          from: tree.regrow[0],
          to: tree.regrow[1],
          onEvict: (year) => {
            if (tree.regrow) tree.regrow = year <= tree.regrow[0] ? undefined : [tree.regrow[0], Math.min(tree.regrow[1], year)];
          },
        },
        0.5,
      );
      tree.regrow = rg ? [rg[0], rg[1]] : undefined;
    }
    trees.push(tree);
  }

  const paddies: {x: number; z: number; appear: number; urban: number; tone: number}[] = [];
  const buildings: {x: number; z: number; w: number; d: number; h: number; lift: number; built: number; gone: number; palette: number}[] = [];
  let k = 0;
  for (let z = tile.z0; z < tile.z1; z += 4) {
    for (let x = tile.x0; x < tile.x1; x += 4) {
      k++;
      const cx = x + 2;
      const cz = z + 2;
      if (!inTile(cx, cz, 2.2) || inCity(cx, cz, 3) || !occ.free({disc: [cx, cz, 0]}, 'building', ALWAYS, FOREVER) || terrainH(cx, cz) > 0.6) continue;
      const d = cityDist(cx, cz);
      const ub = L.urbanBox;
      const inUrban = !ub || (cx > ub.x0 && cx < ub.x1 && cz > ub.z0 && cz < ub.z1);
      const urban = inUrban ? L.urban.from + d * L.urban.rate + random(`pu${k}`) * 30 : Infinity;
      if (random(`p${k}`) < 0.7) {
        paddies.push({x: cx, z: cz, appear: L.paddies[0] + random(`pa${k}`) * (L.paddies[1] - L.paddies[0]), urban, tone: random(`pt${k}`)});
      }
      if (!inUrban) continue;
      const tower = L.towers.find((tw) => cx > tw.x0 && cx < tw.x1 && cz > tw.z0 && cz < tw.z1);
      const n = random(`bc${k}`) < 0.6 ? 2 : 1;
      for (let j = 0; j < n; j++) {
        const hs = L.sprawl?.height ?? 1;
        const base = (0.8 + random(`bh${k}-${j}`) * 1.6) * hs;
        let h = base;
        if (tower) h += random(`bn${k}-${j}`) * tower.extra;
        else if (random(`bt${k}-${j}`) < (L.sprawl?.tall ?? 0.07)) h += random(`bn${k}-${j}`) * 6 * hs;
        const bx = cx + (random(`bx${k}-${j}`) - 0.5) * 2.2;
        const bz = cz + (random(`bz${k}-${j}`) - 0.5) * 2.2;
        const bw = 1.0 + random(`bw${k}-${j}`) * 1.2;
        const bd = 1.0 + random(`bd${k}-${j}`) * 1.2;
        const built = urban + 4 + random(`bb${k}-${j}`) * 16 - (tower ? 12 : 0);
        // the whole footprint is claimed: a block on water, a road, the rail, a landmark
        // site or open ground is not built; trees under it are felled the year before;
        // a road laid through it later (the ring road) takes it down that year
        const stood = occ.claim({rect: [bx, bz, bw, bd]}, {kind: 'building', from: built, to: FOREVER, label: 'building'});
        if (!stood) continue;
        buildings.push({x: bx, z: bz, w: bw, d: bd, h, lift: h - base, built, gone: stood[1], palette: Math.floor(random(`bp${k}-${j}`) * 5)});
      }
    }
  }

  const houses: {x: number; z: number; rot: number; built: number; gone: number; rebuilt: number; modern: number; modernH: number; razed: number; palette: number}[] = [];
  k = 0;
  for (let z = -city.hz + 1; z <= city.hz - 0.99; z += 1.3) {
    for (let x = -city.hx + 1; x <= city.hx - 0.99; x += 1.3) {
      k++;
      const hx = x + (random(`hx${k}`) - 0.5) * 0.4;
      const hz = z + (random(`hz${k}`) - 0.5) * 0.4;
      // keep the grid inside the real footprint, a little clear of the wall
      if (city.outline && !inPoly(shrinkPoly(poly, 1.1), hx, hz)) continue;
      if (Math.abs(hz) < 0.7 || Math.abs(hx) < 0.6) continue; // main cross streets
      const ab = L.houses.abandon;
      const abandoned = !!ab && random(`ha${k}`) < ab.prob;
      const house = {
        x: hx,
        z: hz,
        rot: random(`hr0${k}`) < 0.5 ? 0 : Math.PI / 2,
        built: L.houses.built[0] + Math.pow(random(`hb${k}`), 1.6) * L.houses.built[1],
        gone: abandoned && ab ? ab.from + random(`hg${k}`) * ab.spread : Infinity,
        rebuilt: abandoned && ab ? ab.rebuild + random(`hr${k}`) * ab.rebuildSpread : Infinity,
        modern: random(`hm${k}`) < 0.6 ? L.houses.modern[0] + random(`hn${k}`) * L.houses.modern[1] : Infinity,
        modernH: (0.6 + random(`hh${k}`) * 0.9) * (L.sprawl?.height ?? 1),
        razed: FOREVER,
        palette: Math.floor(random(`hp${k}`) * 5),
      };
      // water, a landmark site or keep-out: not built. A road or rail laid through the
      // old town later razes the house for good, whatever phase it is in. Each phase is
      // its own claim, so forest can regrow on an abandoned plot between them.
      const fp = {rect: [hx, hz, 0.85, 0.85] as [number, number, number, number]};
      const first = occ.claim(fp, {kind: 'house', from: house.built, to: house.gone, label: 'house'}, 0.1);
      if (!first) continue;
      if (first[1] < house.gone) house.razed = first[1];
      if (house.rebuilt < Infinity) {
        const again = occ.claim(fp, {kind: 'house', from: house.rebuilt, to: FOREVER, label: 'house'}, 0.1);
        if (!again) house.rebuilt = FOREVER;
        else if (again[1] < FOREVER) house.razed = Math.min(house.razed, again[1]);
      }
      if (house.modern < Infinity && house.modern >= house.gone && house.modern < house.rebuilt) {
        // a modern house on a plot that was empty when it was built
        const mod = occ.claim(fp, {kind: 'house', from: house.modern, to: FOREVER, label: 'modern house'}, 0.1);
        if (!mod) house.modern = FOREVER;
        else if (mod[1] < FOREVER) house.razed = Math.min(house.razed, mod[1]);
      }
      houses.push(house);
    }
  }

  const village: {x: number; z: number; rot: number; built: number; urban: number}[] = [];
  L.villages.centers.forEach(([cx, cz], c) => {
    for (let j = 0; j < 16; j++) {
      const a = random(`va${c}-${j}`) * Math.PI * 2;
      const r = 1 + random(`vr${c}-${j}`) * 5;
      const x = cx + Math.cos(a) * r;
      const z = cz + Math.sin(a) * r;
      if (inCity(x, z, 3) || !inTile(x, z, 2)) continue;
      const hut = {
        x,
        z,
        rot: random(`vo${c}-${j}`) < 0.5 ? 0 : Math.PI / 2,
        built: L.villages.built[0] + random(`vb${c}-${j}`) * L.villages.built[1],
        urban: L.urban.from + cityDist(x, z) * L.urban.rate + random(`vu${c}-${j}`) * 25,
      };
      const stood = occ.claim({rect: [x, z, 0.85, 0.85]}, {kind: 'hut', from: hut.built, to: hut.urban, label: 'hut'}, 0.3);
      if (!stood) continue;
      hut.urban = Math.min(hut.urban, stood[1]);
      village.push(hut);
    }
  });

  const boatRun = isPathRiver(river) ? riverLength(L, river) : S;
  const boats = new Array(6).fill(0).map((_, i) => ({
    at: random(`boz${i}`) * Math.max(0, boatRun - 6) + Math.min(3, boatRun / 2),
    sp: (random(`bos${i}`) < 0.5 ? -1 : 1) * (1.5 + random(`bov${i}`) * 2),
    off: (random(`boo${i}`) - 0.5) * river.width * 0.5,
  }));

  return {S, C, terrainH, trees, paddies, buildings, houses, village, boats, inTile, cityDist, occ};
};

/**
 * Audit a finished layout with the occupancy rules, trusting nothing the generators did:
 * every placed object is recorded without rules, then every forbidden pair standing on
 * the same ground at the same time is reported. Works on layouts from older engines too,
 * which is how check_story proves the rules catch what the owner used to catch by eye.
 */
export const auditWorld = (L: CityLayout, w: World) => {
  const occ = baseOccupancy(L);
  for (const [kx, kz, r] of L.houses.keepOut) occ.record({rect: [kx, kz, 2 * r, 2 * r]}, {kind: 'site', from: ALWAYS, to: FOREVER, label: 'keepOut'});
  for (const t of w.trees) {
    occ.record({disc: [t.x, t.z, 0.3]}, {kind: 'tree', from: ALWAYS, to: t.clear, label: 'tree'});
    if (t.regrow) occ.record({disc: [t.x, t.z, 0.3]}, {kind: 'tree', from: t.regrow[0], to: t.regrow[1], label: 'regrown tree'});
  }
  for (const b of w.buildings) occ.record({rect: [b.x, b.z, b.w, b.d]}, {kind: 'building', from: b.built, to: b.gone ?? FOREVER, label: 'building'});
  for (const h of w.houses) {
    const end = h.razed ?? FOREVER;
    occ.record({rect: [h.x, h.z, 0.85, 0.85]}, {kind: 'house', from: h.built, to: Math.min(h.gone, end), label: 'house'});
    if (h.rebuilt < end) occ.record({rect: [h.x, h.z, 0.85, 0.85]}, {kind: 'house', from: h.rebuilt, to: end, label: 'house'});
    if (h.modern < end) occ.record({rect: [h.x, h.z, 0.85, 0.85]}, {kind: 'house', from: h.modern, to: end, label: 'modern house'});
  }
  for (const v of w.village) occ.record({rect: [v.x, v.z, 0.85, 0.85]}, {kind: 'hut', from: v.built, to: v.urban, label: 'hut'});
  return occ.audit();
};
