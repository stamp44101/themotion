import React from 'react';
import {useCurrentFrame} from 'remotion';
import {
  BANK_TREES,
  BIRDS,
  MISTS,
  RAIN,
  BUILDINGS,
  CLOUDS,
  HOUSES,
  LANTERNS,
  MOUNTAIN_FOREST,
  PADDIES,
  RIDGE,
  STARS,
  TREES,
  proj,
  ridgeY,
} from './geometry';
import {FPS, bump, camera, keyColor, layerTransform, lerp, lighting, mix, ramp, smooth, sstep, yearAt} from './lib';

type Shade = (c: string) => string;

export const SKY_TOP: [number, string][] = [
  [400, '#6fa8cf'],
  [1290, '#6fa8cf'],
  [1400, '#5b98cf'],
  [1540, '#5b98cf'],
  [1562, '#6d7884'],
  [1770, '#6d7884'],
  [1800, '#68a2d0'],
  [1930, '#68a2d0'],
  [2026, '#4a8ed6'],
];
export const SKY_BOTTOM: [number, string][] = [
  [400, '#d6ecee'],
  [1290, '#e2eed9'],
  [1400, '#ffdcaa'],
  [1540, '#ffdcaa'],
  [1562, '#c4baa8'],
  [1770, '#c4baa8'],
  [1800, '#e6eddd'],
  [1930, '#e6eddd'],
  [2026, '#d3e8f7'],
];
export const GROUND: [number, string][] = [
  [400, '#5c8d47'],
  [1250, '#6c9649'],
  [1560, '#6c9649'],
  [1700, '#6f8650'],
  [1800, '#6c9649'],
  [1940, '#7d9555'],
  [2026, '#8f9a7f'],
];
const BANK: [number, string][] = [
  [400, '#4f7d3c'],
  [1880, '#5d8442'],
  [1960, '#7b7f62'],
  [2026, '#6f7068'],
];

export const BUILD_PALETTES = [
  ['#e9e4da', '#c7c0b2', '#b3ab9c'],
  ['#d9d2c4', '#b4ab9a', '#a0978a'],
  ['#c8d3dc', '#a2afba', '#8f9ca7'],
  ['#efe0c8', '#cdbb9f', '#b7a68b'],
  ['#d6c2b8', '#b19c92', '#9c897f'],
];

const box = (
  key: string,
  x: number,
  y: number,
  w: number,
  h: number,
  dw: number,
  cols: string[],
  sh: Shade,
  night: number,
  lit: number,
) => {
  const l = x - w / 2;
  const r = x + w / 2;
  const top = y - h;
  const ry = dw * 0.55;
  return (
    <g key={key}>
      <polygon points={`${r},${y} ${r + dw},${y - ry} ${r + dw},${top - ry} ${r},${top}`} fill={sh(cols[1])} />
      <polygon points={`${l},${top} ${r},${top} ${r + dw},${top - ry} ${l + dw},${top - ry}`} fill={sh(cols[2])} />
      <rect x={l} y={top} width={w} height={h} fill={sh(cols[0])} />
      {h > 14 && (
        <rect
          x={l + 3}
          y={top + 4}
          width={w - 6}
          height={h - 8}
          fill="url(#winDay)"
          opacity={0.5 * (1 - night)}
        />
      )}
      {h > 14 && night > 0.05 && (
        <rect x={l + 3} y={top + 4} width={w - 6} height={h - 8} fill="url(#winNight)" opacity={night * lit} />
      )}
    </g>
  );
};

const tree = (key: string, x: number, y: number, s: number, k: number, dark: boolean, sh: Shade) =>
  k <= 0.02 ? null : (
    <g key={key} transform={`translate(${x},${y}) scale(${s * 1.25 * k})`}>
      <ellipse cx={5} cy={0} rx={11} ry={3} fill="#0b1a10" opacity={0.28} />
      <rect x={-1.6} y={-8} width={3.2} height={8} fill={sh('#4a3626')} />
      <ellipse cx={0} cy={-17} rx={11} ry={13} fill={sh(dark ? '#29532e' : '#356f39')} />
      <ellipse cx={-2.5} cy={-19.5} rx={8.5} ry={10} fill={sh(dark ? '#336437' : '#45844a')} />
      <ellipse cx={-4.5} cy={-23} rx={4.5} ry={5} fill={sh(dark ? '#4a8150' : '#6aa660')} />
    </g>
  );

const lannaHouse = (key: string, x: number, y: number, s: number, k: number, sh: Shade) =>
  k <= 0.02 ? null : (
    <g key={key} transform={`translate(${x},${y}) scale(${s},${s * k})`}>
      <rect x={-11} y={-9} width={22} height={9} fill={sh('#8a5a3a')} />
      <polygon points="-14,-9 14,-9 0,-22" fill={sh('#5c3a24')} />
      <polyline points="-4,-26 0,-21 4,-26" stroke={sh('#5c3a24')} strokeWidth={1.6} fill="none" />
    </g>
  );

const smallChedi = (key: string, x: number, y: number, sc: number, k: number, color: string, sh: Shade) =>
  k <= 0.02 ? null : (
    <g key={key} transform={`translate(${x},${y}) scale(${sc},${sc * k})`}>
      <rect x={-16} y={-10} width={32} height={10} fill={sh(mix(color, '#000000', 0.15))} />
      <rect x={-11} y={-18} width={22} height={8} fill={sh(mix(color, '#000000', 0.08))} />
      <path d="M -10 -18 C -10 -30, -4 -35, 0 -36 C 4 -35, 10 -30, 10 -18 Z" fill={sh(color)} />
      <polygon points="-3,-35 3,-35 0,-58" fill={sh(color)} />
    </g>
  );

// Wat Chedi Luang, drawn in local units (170 tall), with construction and 1545 collapse.
const CHEDI_RUIN = '-80,6 80,6 80,-90 44,-99 24,-92 6,-106 -14,-95 -36,-102 -80,-88';
const CHEDI_TOP = '-80,-220 80,-220 80,-90 44,-99 24,-92 6,-106 -14,-95 -36,-102 -80,-88';
const chediParts = (sh: Shade, gold: number) => (
  <>
    <rect x={-60} y={-28} width={120} height={28} fill={sh('#a85d3c')} />
    <rect x={-60} y={-28} width={120} height={5} fill={sh('#c27850')} />
    {[-48, -36, -24, 24, 36, 48].map((ex) => (
      <ellipse key={ex} cx={ex} cy={-31} rx={5} ry={4} fill={sh('#8f8a80')} />
    ))}
    <rect x={-48} y={-56} width={96} height={28} fill={sh('#9c5435')} />
    <rect x={-48} y={-56} width={96} height={5} fill={sh('#b86c48')} />
    <rect x={-36} y={-86} width={72} height={30} fill={sh('#a85d3c')} />
    <rect x={-26} y={-80} width={9} height={16} rx={4} fill={sh('#5a2f1e')} />
    <rect x={17} y={-80} width={9} height={16} rx={4} fill={sh('#5a2f1e')} />
    <polygon points="-11,0 11,0 7,-56 -7,-56" fill={sh('#b8704c')} />
    <path d="M -30 -86 C -30 -112, -12 -122, 0 -126 C 12 -122, 30 -112, 30 -86 Z" fill={sh('#b5653f')} />
    <rect x={-12} y={-133} width={24} height={8} fill={sh('#9c5435')} />
    <polygon points="-8,-133 8,-133 0,-172" fill={sh(mix('#b5653f', '#e6b84c', gold))} />
    <line x1={-5} y1={-145} x2={5} y2={-145} stroke={sh('#7a3f26')} strokeWidth={1.5} />
    <line x1={-3.5} y1={-155} x2={3.5} y2={-155} stroke={sh('#7a3f26')} strokeWidth={1.5} />
  </>
);

type MistT = {x: number; y: number; rx: number; ry: number; sp: number; layer: number};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const Y = yearAt(t);

  const {intro, cyc, finale, night, dusk} = lighting(t);
  const cam = camera(t);
  const L = (p: number) => layerTransform(cam, p);
  const rain = bump(t, 32.2, 37.2, 0.8);

  const mistAmt =
    (0.25 + 0.75 * Math.max(bump(cyc, -0.2, 0.25, 0.15), bump(cyc, 0.86, 1.3, 0.1))) *
    (1 - 0.55 * ramp(Y, 1900, 2000)) *
    (1 - finale * 0.6) +
    rain * 0.4 +
    (intro ? 0.5 : 0);
  const mist = (key: string, m: MistT) => (
    <ellipse
      key={key}
      cx={((m.x + t * m.sp) % 1700) - 300}
      cy={m.y}
      rx={m.rx}
      ry={m.ry}
      fill="url(#mist)"
      opacity={Math.min(0.9, mistAmt) * 0.75}
    />
  );
  const sh: Shade = (c) => mix(mix(c, '#ff9a5c', dusk * 0.14), '#121836', night * 0.62);

  const burm = ramp(Y, 1556, 1563) * (1 - ramp(Y, 1775, 1792));
  const quake = Y >= 1545 && Y < 1545.8 ? 1 - ramp(Y, 1545, 1545.8) : 0;
  const shakeX = quake * 14 * Math.sin(frame * 2.7);
  const shakeY = quake * 9 * Math.cos(frame * 3.3);

  // --- sky
  const top = mix(mix(keyColor(SKY_TOP, Y), '#5a6aa0', dusk * 0.5), '#060a20', night);
  const bottom = mix(
    mix(keyColor(SKY_BOTTOM, Y), '#ff935a', dusk * 0.75),
    mix('#1c2350', '#4a2c55', finale),
    night,
  );
  const sunY = lerp(-160, 1000, cyc / 0.72);
  const sunX = 800 - cyc * 260;
  const sunVis = intro ? 0 : (1 - finale) * (cyc < 0.74 ? 1 : 0);

  // --- city evolution parameters
  const moatP = ramp(Y, 1294.4, 1296.0);
  const decay = ramp(Y, 1600, 1720) * (1 - ramp(Y, 1790, 1800));
  const wallH = 22 * smooth(ramp(Y, 1295.4, 1297.2)) * (1 - 0.4 * decay);
  const gateK = smooth(ramp(Y, 1296.4, 1297.6));
  const ground = sh(keyColor(GROUND, Y));
  const cityGround = mix(keyColor(GROUND, Y), Y > 1940 ? '#a9a596' : '#a39a72', 0.55 * ramp(Y, 1295, 1297));

  const objects: {v: number; el: React.ReactNode}[] = [];
  const push = (v: number, el: React.ReactNode) => el && objects.push({v, el});

  // Trees
  TREES.forEach((tr, i) => {
    let k = Y < tr.clear ? 1 : 1 - ramp(Y, tr.clear, tr.clear + (Math.abs(tr.u) < 1.2 ? 1.2 : 6));
    if (tr.regrow && Y > tr.regrow[0]) {
      k = Math.max(k, ramp(Y, tr.regrow[0], tr.regrow[0] + 50) * (1 - ramp(Y, tr.regrow[1], tr.regrow[1] + 4)));
    }
    const p = proj(tr.u, tr.v);
    push(tr.v, tree(`t${i}`, p.x, p.y, p.s, k, tr.dark, sh));
  });

  // Lawa stilt huts at the foot of the mountain
  [
    [-0.9, -2.0],
    [0.15, -2.1],
    [1.4, -1.9],
    [-1.7, -1.7],
  ].forEach(([u, v], i) => {
    const k = ramp(Y, 450, 540) * (1 - ramp(Y, 1240, 1300));
    if (k <= 0.02) return;
    const p = proj(u, v);
    push(
      v,
      <g key={`lawa${i}`} transform={`translate(${p.x},${p.y}) scale(${p.s * 1.2},${p.s * 1.2 * k})`}>
        <line x1={-8} y1={0} x2={-8} y2={-8} stroke={sh('#5b4330')} strokeWidth={2} />
        <line x1={8} y1={0} x2={8} y2={-8} stroke={sh('#5b4330')} strokeWidth={2} />
        <rect x={-11} y={-16} width={22} height={8} fill={sh('#8c6a45')} />
        <polygon points="-15,-16 15,-16 0,-29" fill={sh('#b39a62')} />
      </g>,
    );
  });

  // Hariphunchai: Ku Kut-style stepped chedi on the far southern horizon (Lamphun)
  {
    const k = smooth(ramp(Y, 661, 720));
    if (k > 0.02) {
      push(
        -0.8,
        <g key="kukut" transform={`translate(95,1152) scale(0.85,${0.85 * k})`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={-22 + i * 3.5} y={-10 - i * 10} width={44 - i * 7} height={10} fill={sh(i % 2 ? '#a7834f' : '#b9925a')} />
              {[-1, 0, 1].map((d) => (
                <circle key={d} cx={d * (12 - i * 2)} cy={-5 - i * 10} r={1.6} fill={sh('#6e5432')} />
              ))}
            </g>
          ))}
          <polygon points="-5,-50 5,-50 0,-64" fill={sh('#c7a066')} />
        </g>,
      );
    }
  }

  // Traditional houses -> abandoned -> rebuilt -> modern low-rise (old-city height limit)
  HOUSES.forEach((h, i) => {
    const p = proj(h.u, h.v);
    const trad =
      smooth(ramp(Y, h.built, h.built + 6)) *
      (1 - ramp(Y, h.gone, h.gone + 10)) +
      (Y > h.rebuilt ? smooth(ramp(Y, h.rebuilt, h.rebuilt + 4)) : 0);
    const modern = smooth(ramp(Y, h.modern, h.modern + 5));
    if (modern > 0.02) {
      push(
        h.v,
        box(`hm${i}`, p.x, p.y, 22 * p.s, h.modernH * p.s * modern, 6 * p.s, BUILD_PALETTES[h.palette], sh, night, 0.8),
      );
    } else {
      push(h.v, lannaHouse(`h${i}`, p.x, p.y, p.s, Math.min(1, trad), sh));
    }
  });

  // Modern city outside the walls
  BUILDINGS.forEach((b, i) => {
    const g = smooth(ramp(Y, b.built, b.built + 6));
    if (g <= 0.02) return;
    const p = proj(b.u, b.v);
    push(b.v, box(`b${i}`, p.x, p.y, b.w * p.s, b.h * p.s * g, 8 * p.s, BUILD_PALETTES[b.palette], sh, night, b.lit));
  });

  // Temples
  {
    const p = proj(-0.35, -0.45);
    push(-0.45, smallChedi('phrasingh', p.x, p.y, p.s * 0.95, smooth(ramp(Y, 1345, 1352)), '#e3b54a', sh));
    const q = proj(0.55, 0.55);
    push(0.55, smallChedi('chiangman', q.x, q.y, q.s * 0.8, smooth(ramp(Y, 1296.8, 1297.6)), '#d9a85a', sh));
    const c = proj(1.35, -1.55);
    const k = smooth(ramp(Y, 1455, 1466));
    if (k > 0.02) {
      push(
        -1.55,
        <g key="chetyot" transform={`translate(${c.x},${c.y}) scale(${c.s * 1.1},${c.s * 1.1 * k})`}>
          <rect x={-26} y={-16} width={52} height={16} fill={sh('#b98a5c')} />
          {[-20, -13, 13, 20].map((x) => (
            <polygon key={x} points={`${x - 3},-16 ${x + 3},-16 ${x},-30`} fill={sh('#c99a62')} />
          ))}
          {[-7, 7].map((x) => (
            <polygon key={x} points={`${x - 3},-16 ${x + 3},-16 ${x},-33`} fill={sh('#c99a62')} />
          ))}
          <polygon points="-6,-16 6,-16 0,-44" fill={sh('#d5a86a')} />
        </g>,
      );
    }
  }

  // Wat Chedi Luang
  {
    const p = proj(0, 0.02);
    const prog = smooth(ramp(Y, 1392, 1475));
    const broken = Y >= 1545;
    const fall = ramp(Y, 1545, 1545.7);
    const gold = ramp(Y, 1440, 1475);
    const sc = p.s * 0.95;
    if (prog > 0.01) {
      push(
        0.02,
        <g key="chedi" transform={`translate(${p.x},${p.y}) scale(${sc})`}>
          <ellipse cx={0} cy={-90} rx={95} ry={110} fill="url(#flood)" opacity={night * ramp(Y, 1985, 2000)} />
          {!broken && <g clipPath="url(#chediGrow)">{chediParts(sh, gold)}</g>}
          {broken && <g clipPath="url(#chediRuin)">{chediParts(sh, 0)}</g>}
          {broken && fall < 1 && (
            <g transform={`translate(${fall * 30},${fall * fall * 95}) rotate(${fall * 28})`} opacity={1 - fall}>
              <g clipPath="url(#chediTop)">{chediParts(sh, gold)}</g>
            </g>
          )}
          {Y >= 1545 && Y < 1547 &&
            [0, 1, 2, 3, 4, 5].map((d) => {
              const a = ramp(Y, 1545.1, 1546.6);
              return (
                <circle
                  key={d}
                  cx={(d - 2.5) * 22 * (0.5 + a)}
                  cy={-40 - a * 40 - (d % 2) * 15}
                  r={18 + a * 40}
                  fill={sh('#b8a48a')}
                  opacity={0.55 * (1 - a)}
                />
              );
            })}
        </g>,
      );
    }
  }

  // City walls, gates and corner bastions, inserted into the depth order.
  if (wallH > 0.3) {
    const wall = (key: string, u1: number, v1: number, u2: number, v2: number, col: string) => {
      const a = proj(u1, v1);
      const b = proj(u2, v2);
      const ha = wallH * a.s;
      const hb = wallH * b.s;
      return (
        <g key={key}>
          <polygon points={`${a.x},${a.y} ${b.x},${b.y} ${b.x},${b.y - hb} ${a.x},${a.y - ha}`} fill={sh(col)} />
          <line
            x1={a.x}
            y1={a.y - ha}
            x2={b.x}
            y2={b.y - hb}
            stroke={sh(mix(col, '#ffffff', 0.18))}
            strokeWidth={4}
            strokeDasharray="5 4"
          />
        </g>
      );
    };
    const gate = (key: string, u: number, v: number, wide: number) => {
      const p = proj(u, v);
      const w = wide * p.s;
      const h = wallH * 1.55 * p.s * gateK;
      if (h < 1) return null;
      return (
        <g key={key}>
          <rect x={p.x - w / 2} y={p.y - h} width={w} height={h} fill={sh('#a9583a')} />
          <rect x={p.x - w / 2} y={p.y - h} width={w} height={4 * p.s} fill={sh('#c47652')} />
          <path
            d={`M ${p.x - w * 0.16} ${p.y} L ${p.x - w * 0.16} ${p.y - h * 0.5} Q ${p.x} ${p.y - h * 0.72} ${p.x + w * 0.16} ${p.y - h * 0.5} L ${p.x + w * 0.16} ${p.y} Z`}
            fill={sh('#3b2016')}
          />
        </g>
      );
    };
    const bastion = (key: string, u: number, v: number) => {
      const p = proj(u, v);
      const w = 30 * p.s;
      const h = wallH * 1.25 * p.s;
      return <rect key={key} x={p.x - w / 2} y={p.y - h} width={w} height={h} fill={sh('#8f4a2f')} />;
    };
    const E = 1.03;
    objects.push({
      v: -1.04,
      el: (
        <g key="wallBack">
          {wall('wb', -E, -E, E, -E, '#8e4a30')}
          {gate('gSuanDok', 0, -E, 40)}
          {bastion('bc1', -E, -E)}
          {bastion('bc2', E, -E)}
        </g>
      ),
    });
    objects.push({
      v: -1.02,
      el: (
        <g key="wallSides">
          {wall('wl', -E, -E, -E, E, '#7a3d27')}
          {wall('wr', E, -E, E, E, '#7a3d27')}
          {gate('gSuanPrung', -E, -0.45, 34)}
          {gate('gChiangMai', -E, 0.25, 36)}
          {gate('gChangPhueak', E, 0, 36)}
        </g>
      ),
    });
    objects.push({
      v: 1.04,
      el: (
        <g key="wallFront">
          {wall('wf', -E, E, E, E, '#a8573a')}
          {gate('gThaPhae', 0, E, 64)}
          {bastion('bc3', -E, E)}
          {bastion('bc4', E, E)}
        </g>
      ),
    });
  }

  objects.sort((a, b) => a.v - b.v);

  // Moat path (starts at Tha Phae gate and runs around the square)
  const M = 1.12;
  const mp = [proj(0, M), proj(M, M), proj(M, -M), proj(-M, -M), proj(-M, M), proj(0, M)];
  const moatD = 'M ' + mp.map((p) => `${p.x} ${p.y}`).join(' L ');
  const cityPts = [proj(-1.06, -1.06), proj(1.06, -1.06), proj(1.06, 1.06), proj(-1.06, 1.06)]
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  // River & foreground
  const riverTop = (x: number) => 1438 + 6 * Math.sin(x / 90 + 0.5);
  const riverBot = (x: number) => 1528 + 5 * Math.sin(x / 70 + 1.3);
  let riverD = 'M -10 ' + riverTop(-10);
  for (let x = 30; x <= 1100; x += 40) riverD += ` L ${x} ${riverTop(x)}`;
  for (let x = 1100; x >= -10; x -= 40) riverD += ` L ${x} ${riverBot(x)}`;
  riverD += ' Z';

  const bridgeK = ramp(Y, 1893, 1896);
  const bridgeCol = Y > 1965 ? '#a7a9ab' : '#7a5636';
  const railK = ramp(Y, 1920.5, 1921.6);
  const roadK = ramp(Y, 1950, 1958);
  const cars = Math.floor(ramp(Y, 1958, 2015) * 12);

  const trainAt = (t0: number, dur: number, dir: 1 | -1, modern: boolean) => {
    if (t < t0 || t > t0 + dur) return null;
    const p = (t - t0) / dur;
    const x = dir > 0 ? lerp(-560, 1450, p) : lerp(1450, -560, p);
    const body = modern ? '#2f5aa8' : '#1f1f22';
    const car = modern ? '#e8ecef' : '#7a3b2a';
    return (
      <g key={`train${t0}`}>
        {!modern &&
          [0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <circle
              key={k}
              cx={x + 52 * dir - k * 38 * dir}
              cy={1584 - k * 7}
              r={9 + k * 3.2}
              fill={sh('#e9e6e0')}
              opacity={0.55 * (1 - k / 8)}
            />
          ))}
        {[0, 1, 2, 3].map((c) => {
          const cx = x - dir * (90 + c * 92);
          return (
            <g key={c}>
              <rect x={cx - 42} y={1598} width={84} height={26} rx={3} fill={sh(car)} />
              {modern && <rect x={cx - 42} y={1614} width={84} height={4} fill={sh('#2f5aa8')} />}
              {[0, 1, 2, 3].map((w) => (
                <rect
                  key={w}
                  x={cx - 34 + w * 18}
                  y={1603}
                  width={11}
                  height={8}
                  fill={night > 0.2 ? '#ffd889' : sh('#cfd8de')}
                />
              ))}
            </g>
          );
        })}
        <rect x={x - 38} y={1596} width={76} height={28} rx={modern ? 8 : 3} fill={sh(body)} />
        {!modern && <rect x={x + dir * 18 - 4} y={1582} width={8} height={14} fill={sh(body)} />}
        {!modern && <rect x={x - dir * 26 - 12} y={1586} width={24} height={12} fill={sh(body)} />}
        {!modern &&
          [-24, -6, 12, 28].map((w) => <circle key={w} cx={x + w} cy={1626} r={6} fill={sh('#9b2b22')} />)}
        <circle cx={x + dir * 38} cy={1608} r={4} fill="#fff4c9" opacity={0.3 + night * 0.7} />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <radialGradient id="sun">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.25" stopColor={mix('#fff2b0', '#ff8a3c', sstep(0.45, 0.72, cyc))} />
          <stop offset="1" stopColor="#ffb060" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bottom} stopOpacity="0" />
          <stop offset="0.45" stopColor={bottom} stopOpacity={0.55 * (1 - night * 0.5)} />
          <stop offset="1" stopColor={bottom} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor={sh(mix('#8aa3b8', bottom, 0.3))} />
          <stop offset="0.75" stopColor={sh(mix('#8aa3b8', bottom, 0.65))} />
        </linearGradient>
        <linearGradient id="mtn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={sh(mix('#4f8257', '#5f6a60', burm * 0.4))} />
          <stop offset="0.32" stopColor={sh(mix('#447a4e', '#59645b', burm * 0.4))} />
          <stop offset="1" stopColor={sh(mix('#2f5c3b', '#4a544c', burm * 0.4))} />
        </linearGradient>
        <linearGradient id="mtnShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor={bottom} stopOpacity="0" />
          <stop offset="0.62" stopColor={bottom} stopOpacity={0.35 * (1 - night * 0.6)} />
        </linearGradient>
        <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2c4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="riverSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={bottom} stopOpacity="0.9" />
          <stop offset="0.5" stopColor={bottom} stopOpacity="0.15" />
          <stop offset="1" stopColor={top} stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="mist">
          <stop offset="0" stopColor={mix('#ffffff', '#9aa6c8', night)} stopOpacity="0.85" />
          <stop offset="1" stopColor={mix('#ffffff', '#9aa6c8', night)} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#ffcf6a" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ff9f3a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ff8a2a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="flood">
          <stop offset="0" stopColor="#ffd38a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffb560" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sh(mix('#4a8db5', '#6b7a80', burm * 0.5))} />
          <stop offset="1" stopColor={sh('#2c6890')} />
        </linearGradient>
        <pattern id="winNight" width="8" height="10" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="4" height="5" fill="#ffd27a" />
        </pattern>
        <pattern id="winDay" width="8" height="10" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="4" height="5" fill="#56677a" />
        </pattern>
        <clipPath id="chediGrow" clipPathUnits="userSpaceOnUse">
          <rect x={-90} y={-176 * smooth(ramp(Y, 1392, 1475))} width={180} height={182} />
        </clipPath>
        <clipPath id="chediRuin" clipPathUnits="userSpaceOnUse">
          <polygon points={CHEDI_RUIN} />
        </clipPath>
        <clipPath id="chediTop" clipPathUnits="userSpaceOnUse">
          <polygon points={CHEDI_TOP} />
        </clipPath>
      </defs>

      <g
        transform={`translate(${shakeX},${shakeY})`}
        style={{
          filter: `saturate(${1 - 0.62 * burm}) sepia(${0.32 * burm}) brightness(${1 - 0.06 * burm})`,
        }}
      >
        <g transform={L(0.12)}>
        {/* Sky */}
        <rect x={-80} y={-80} width={1240} height={2100} fill="url(#sky)" />
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#ffffff"
            opacity={night * (0.55 + 0.45 * Math.sin(s.tw + frame * 0.2))}
          />
        ))}
        {sunVis > 0 && (
          <g opacity={sunVis}>
            <circle cx={sunX} cy={sunY} r={190} fill="url(#sun)" />
            <circle cx={sunX} cy={sunY} r={34} fill={mix('#fffbe6', '#ffc070', sstep(0.45, 0.72, cyc))} />
          </g>
        )}
        {CLOUDS.map((c, i) => {
          const x = ((c.x + Y * 1.7 * c.sp) % 1500) - 250;
          const col = mix(mix('#ffffff', '#ffc2a0', dusk), '#3a4370', night);
          return (
            <g key={i} transform={`translate(${x},${c.y}) scale(${c.sc})`} opacity={0.8 * (1 - night * 0.6)}>
              <ellipse cx={0} cy={0} rx={90} ry={26} fill={col} />
              <ellipse cx={-35} cy={-14} rx={45} ry={24} fill={col} />
              <ellipse cx={30} cy={-20} rx={50} ry={30} fill={col} />
            </g>
          );
        })}

        {sunVis > 0 && cyc > 0.25 && (
          <g opacity={sunVis * bump(cyc, 0.3, 0.74, 0.12) * 0.55 * (1 - burm * 0.6)} style={{mixBlendMode: 'screen'}}>
            {[-34, -20, -8, 5, 17, 30, 44].map((a, i) => {
              const ang = ((90 + a) * Math.PI) / 180;
              const len = 1500;
              const spread = 0.035 + (i % 3) * 0.012;
              const x1 = sunX + Math.cos(ang - spread) * len;
              const y1 = sunY + Math.sin(ang - spread) * len;
              const x2 = sunX + Math.cos(ang + spread) * len;
              const y2 = sunY + Math.sin(ang + spread) * len;
              return <polygon key={i} points={`${sunX},${sunY} ${x1},${y1} ${x2},${y2}`} fill="url(#ray)" opacity={0.5 + 0.5 * Math.sin(frame * 0.05 + i)} />;
            })}
          </g>
        )}
        {BIRDS.map((b, i) => {
          const vis = (bump(t, 3.5, 13.5, 0.6) + bump(t, 24, 28.8, 0.6) + bump(t, 37.5, 42.5, 0.6)) * (1 - night);
          if (vis <= 0.02) return null;
          const x = ((b.x + t * b.speed) % 1400) - 160;
          const y = b.y + Math.sin(t * 0.8 + b.ph) * 20;
          const flap = Math.sin(t * b.flap + b.ph) * 6 * b.s;
          return (
            <path
              key={`bird${i}`}
              d={`M ${x - 9 * b.s} ${y - flap} Q ${x - 4 * b.s} ${y - 3} ${x} ${y} Q ${x + 4 * b.s} ${y - 3} ${x + 9 * b.s} ${y - flap}`}
              stroke={sh('#26303a')}
              strokeWidth={2}
              fill="none"
              opacity={vis}
            />
          );
        })}
        </g>
        <g transform={L(0.3)}>
        {/* Far range and Doi Suthep */}
        <path
          d="M -60 960 L 120 880 L 260 900 L 420 820 L 600 860 L 760 790 L 900 830 L 1140 780 L 1140 1260 L -60 1260 Z"
          fill="url(#far)"
        />
        </g>
        <g transform={L(0.55)}>
        <path
          d={`M -80 960 L ${RIDGE.map(([x, y]) => `${x} ${y}`).join(' L ')} L 1160 980 L 1160 1260 L -80 1260 Z`}
          fill="url(#mtn)"
        />
        <path
          d={`M 330 645 L 450 690 L 560 765 L 700 845 L 850 905 L 1160 980 L 1160 1260 L 520 1260 Z`}
          fill="#000000"
          opacity={0.12}
        />
        <path
          d={`M -80 960 L ${RIDGE.map(([x, y]) => `${x} ${y}`).join(' L ')} L 1160 980 L 1160 1260 L -80 1260 Z`}
          fill="url(#mtnShade)"
        />
        {MOUNTAIN_FOREST.map((m, i) => {
          const yTop = ridgeY(m.x);
          const y = yTop + 25 + m.k * (1040 - yTop - 30);
          return <circle key={i} cx={m.x} cy={y} r={m.r} fill={sh('#335c3c')} opacity={0.6} />;
        })}
        {/* Road up Doi Suthep, built 1934–35 */}
        <path
          d="M 720 1005 L 610 965 L 700 930 L 600 890 L 668 852 L 585 818 L 572 782"
          fill="none"
          stroke={sh('#d9c9a2')}
          strokeWidth={3.5}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={`${ramp(Y, 1934, 1935.6)} 1`}
        />
        {/* Wat Phra That Doi Suthep */}
        <circle cx={560} cy={740} r={60} fill="url(#flood)" opacity={night * ramp(Y, 1383, 1390)} />
        {smallChedi('doisuthep', 560, 776, 1.0, smooth(ramp(Y, 1383, 1389)), '#f0c14e', sh)}
        <g opacity={bump(Y, 1383, 1400, 6)} transform="translate(560,722)">
          <polygon points="0,-26 4,-4 26,0 4,4 0,26 -4,4 -26,0 -4,-4" fill="#fff6c8" />
        </g>

        {MISTS.filter((m) => m.layer === 0).map((m, i) => mist(`ma${i}`, m))}
        </g>
        <g transform={L(1)}>
        {/* Plain */}
        <rect x={-80} y={1000} width={1240} height={600} fill={ground} />
        <rect x={-40} y={975} width={1160} height={70} fill="url(#haze)" />
        {PADDIES.map((p, i) => {
          const k = ramp(Y, p.appear, p.appear + 30) * (1 - ramp(Y, p.urban, p.urban + 8));
          if (k <= 0.02) return null;
          const a = proj(p.u - p.du, p.v - p.dv);
          const b = proj(p.u + p.du, p.v - p.dv);
          const c = proj(p.u + p.du, p.v + p.dv);
          const d = proj(p.u - p.du, p.v + p.dv);
          const cyclePaddy = (Math.sin(Y * 0.9 + i) + 1) / 2;
          return (
            <polygon
              key={i}
              points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`}
              fill={sh(mix('#93b85a', '#d4c060', cyclePaddy * 0.6))}
              opacity={k * 0.85}
            />
          );
        })}
        {Y > 1940 &&
          PADDIES.map((p, i) => {
            const k = ramp(Y, p.urban, p.urban + 8);
            if (k <= 0.02) return null;
            const a = proj(p.u - 0.21, p.v - 0.15);
            const c = proj(p.u + 0.21, p.v + 0.15);
            return (
              <rect
                key={`u${i}`}
                x={a.x}
                y={a.y}
                width={c.x - a.x}
                height={c.y - a.y}
                fill={sh('#a6a394')}
                opacity={k * 0.7}
              />
            );
          })}

        {/* Old city ground and moat */}
        <polygon points={cityPts} fill={sh(cityGround)} opacity={ramp(Y, 1295, 1296.5)} />
        {moatP > 0 && (
          <path
            d={moatD}
            fill="none"
            stroke={sh(mix('#3d7fa8', '#5c7480', burm * 0.6))}
            strokeWidth={12}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${moatP} 1`}
          />
        )}

        {objects.map((o) => o.el)}
        {MISTS.filter((m) => m.layer === 1).map((m, i) => mist(`mb${i}`, m))}
        </g>

        <g transform={L(1.2)}>
        {/* River Ping */}
        <rect x={-80} y={1490} width={1240} height={560} fill={sh(keyColor(BANK, Y))} />
        <path d={riverD} fill="url(#river)" />
        <path d={riverD} fill="url(#riverSky)" opacity={0.55} />
        {sunVis > 0 &&
          new Array(26).fill(0).map((_, i) => {
            const x = sunX - 160 + ((i * 97) % 320) + Math.sin(frame * 0.2 + i) * 6;
            const y = 1446 + ((i * 29) % 72);
            const tw = Math.max(0, Math.sin(frame * 0.45 + i * 1.7));
            return <rect key={`gl${i}`} x={x} y={y} width={10} height={2} rx={1} fill="#fff6d8" opacity={tw * 0.8 * sunVis * bump(cyc, 0.3, 0.72, 0.1)} />;
          })}
        {new Array(18).fill(0).map((_, i) => {
          const x = ((i * 173 + frame * 1.3) % 1240) - 80;
          const y = 1452 + ((i * 37) % 66);
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + 34}
              y2={y}
              stroke="#ffffff"
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.3 * (1 - night * 0.5)}
            />
          );
        })}
        {new Array(14).fill(0).map((_, i) => {
          const x = 180 + i * 55 + Math.sin(frame * 0.3 + i) * 4;
          return (
            <rect
              key={`rf${i}`}
              x={x}
              y={1448}
              width={5}
              height={70}
              fill="#ffc46a"
              opacity={night * 0.35 * ramp(Y, 1950, 2000) * (0.6 + 0.4 * Math.sin(frame * 0.4 + i * 2))}
            />
          );
        })}
        {/* Nawarat bridge, wooden 1894, concrete 1965 */}
        {bridgeK > 0 && (
          <g opacity={bridgeK}>
            {[1462, 1490, 1518].map((y) => (
              <rect key={y} x={548 - (y - 1440) * 0.08} y={y} width={34 + (y - 1440) * 0.16} height={14} fill={sh(mix(bridgeCol, '#000000', 0.35))} />
            ))}
            <polygon points="550,1440 580,1440 588,1532 542,1532" fill={sh(bridgeCol)} />
            <line x1={550} y1={1440} x2={542} y2={1532} stroke={sh(mix(bridgeCol, '#ffffff', 0.3))} strokeWidth={3} />
            <line x1={580} y1={1440} x2={588} y2={1532} stroke={sh(mix(bridgeCol, '#ffffff', 0.3))} strokeWidth={3} />
          </g>
        )}
        {Y > 1985 && (
          <polygon
            points="262,1441 288,1441 294,1532 254,1532"
            fill={sh('#a3a6a8')}
            opacity={ramp(Y, 1985, 1990)}
          />
        )}

        {/* East bank: houses, trees, station, railway, road */}
        {[60, 150, 250, 340, 700, 790, 890, 985].map((x, i) => {
          const wood = smooth(ramp(Y, 1870 + i * 7, 1876 + i * 7));
          const modern = smooth(ramp(Y, 1955 + i * 6, 1961 + i * 6));
          if (wood <= 0.02) return null;
          if (modern > 0.02) {
            return box(`bk${i}`, x, 1572, 64, (34 + (i % 3) * 18) * modern, 10, BUILD_PALETTES[i % 5], sh, night, 0.9);
          }
          return (
            <g key={`bk${i}`} transform={`translate(${x},1572) scale(2.4,${2.4 * wood})`}>
              <rect x={-12} y={-11} width={24} height={11} fill={sh('#7d5236')} />
              <polygon points="-15,-11 15,-11 0,-24" fill={sh('#4f3020')} />
            </g>
          );
        })}
        {BANK_TREES.map((b, i) => tree(`bt${i}`, b.x, b.y, b.s, 1 - ramp(Y, b.clear, b.clear + 6), b.dark, sh))}
        {railK > 0 && (
          <g>
            {box('station', 880, 1622, 140 * Math.max(railK, 0.01), 48 * ramp(Y, 1921, 1923), 14, ['#ece4d0', '#c9bfa8', '#a4442c'], sh, night, 0.9)}
            <line x1={-10} y1={1631} x2={-10 + 1100 * railK} y2={1631} stroke={sh('#5a4632')} strokeWidth={9} strokeDasharray="3 7" />
            <line x1={-10} y1={1627} x2={-10 + 1100 * railK} y2={1627} stroke={sh('#8b8f96')} strokeWidth={2} />
            <line x1={-10} y1={1635} x2={-10 + 1100 * railK} y2={1635} stroke={sh('#8b8f96')} strokeWidth={2} />
          </g>
        )}
        {trainAt(45.4, 3.2, 1, false)}
        {trainAt(51.6, 2.8, -1, true)}
        {roadK > 0 && (
          <g opacity={roadK}>
            <rect x={-20} y={1690} width={1120} height={46} fill={sh('#4b4d52')} />
            <line x1={-20} y1={1713} x2={1100} y2={1713} stroke={sh('#e8e2c8')} strokeWidth={2} strokeDasharray="22 18" />
            {[60, 300, 540, 780, 1020].map((x) => (
              <g key={x}>
                <line x1={x} y1={1690} x2={x} y2={1650} stroke={sh('#6b6e74')} strokeWidth={2} />
                <circle cx={x} cy={1650} r={18} fill="url(#glow)" opacity={night * ramp(Y, 1965, 1975)} />
              </g>
            ))}
          </g>
        )}
        {new Array(cars).fill(0).map((_, i) => {
          const dir = i % 2 ? 1 : -1;
          const speed = 4 + (i % 4) * 1.3;
          const x = dir > 0 ? ((frame * speed + i * 211) % 1300) - 110 : 1190 - ((frame * speed + i * 137) % 1300);
          const y = dir > 0 ? 1730 : 1709;
          const songthaew = i % 3 === 0;
          const col = songthaew ? '#c8202f' : ['#e9e9ea', '#2b2f3a', '#9aa4ad', '#3a5f8f'][i % 4];
          const len = songthaew ? 42 : 32;
          return (
            <g key={`car${i}`}>
              <rect x={x - len / 2} y={y - 12} width={len} height={10} rx={3} fill={sh(col)} />
              <rect x={x - len / 2 + (songthaew ? 2 : 6)} y={y - 19} width={songthaew ? len - 4 : len - 12} height={8} rx={2} fill={sh(songthaew ? col : '#2a3440')} />
              <circle cx={x + (dir * len) / 2} cy={y - 7} r={night > 0.15 ? 9 : 0} fill="url(#glow)" />
              <circle cx={x - (dir * len) / 2} cy={y - 7} r={2.2} fill="#ff3b3b" opacity={0.3 + night * 0.7} />
            </g>
          );
        })}

        </g>
        <g transform={L(0.5)}>
        {/* Plane on approach to the airport (south-west) */}
        {t > 50.2 && t < 54 && (
          <g
            transform={`translate(${lerp(1150, -120, (t - 50.2) / 3.8)},${lerp(610, 820, (t - 50.2) / 3.8)}) rotate(-8)`}
          >
            <ellipse cx={0} cy={0} rx={30} ry={4.5} fill={sh('#eef1f4')} />
            <polygon points="-4,0 10,0 -6,16" fill={sh('#d3d8de')} />
            <polygon points="22,-2 30,-2 30,-14" fill={sh('#7a2a8a')} />
            <circle cx={-30} cy={0} r={2.5} fill="#ff4040" opacity={frame % 20 < 6 ? 1 : 0.15} />
          </g>
        )}
        </g>
        {rain > 0.01 && (
          <g opacity={rain}>
            <rect x={0} y={0} width={1080} height={1920} fill="#4b5560" opacity={0.18} />
            {RAIN.map((r, i) => {
              const y = ((r.y + frame * r.speed) % 2100) - 120;
              return <line key={`rn${i}`} x1={r.x} y1={y} x2={r.x - 8} y2={y + r.len} stroke="#dfe7ee" strokeWidth={1.4} opacity={0.35} />;
            })}
          </g>
        )}
      </g>

      {/* Yi Peng lanterns */}
      {LANTERNS.map((l, i) => {
        if (t < l.t0) return null;
        const age = t - l.t0;
        const y = l.y - age * l.speed;
        if (y < -60) return null;
        const x = l.x + Math.sin(age * 1.6 + l.wob) * 18 + age * 10;
        const s = l.size * lerp(1.1, 0.55, Math.min(1, age / 4.5));
        const fadeIn = ramp(age, 0, 0.4);
        return (
          <g key={`ln${i}`} transform={`translate(${x},${y}) scale(${s})`} opacity={fadeIn}>
            <circle cx={0} cy={0} r={30} fill="url(#glow)" />
            <rect x={-7} y={-10} width={14} height={18} rx={4} fill="#ffcf7a" />
            <rect x={-7} y={2} width={14} height={6} rx={2} fill="#fff1c2" />
          </g>
        );
      })}
    </svg>
  );
};
