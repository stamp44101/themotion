import {ThreeCanvas} from '@remotion/three';
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {FPS, H, W, bump, keyColor, lighting, mix, ramp, yearAt} from '../lib';
import {Overlay, ScreenCallout} from '../Overlay';
import {SKY_BOTTOM, SKY_TOP} from '../Scene';
import {STARS} from '../geometry';
import {IsoScene} from './IsoScene';
import {projectAt} from './isoCamera';
import {DOI_SUTHEP_TEMPLE, KUKUT, RAIL_X, RIVER_X} from './world';

const RAIN = new Array(170).fill(0).map((_, i) => ({
  x: ((i * 397) % 1140) - 30,
  y: (i * 613) % 2100,
  speed: 55 + ((i * 37) % 25),
  len: 28 + ((i * 53) % 26),
}));

const at = (p: [number, number, number]) => (t: number) => projectAt(t, p);
const CALLOUTS: ScreenCallout[] = [
  {t0: 4, t1: 8.6, label: 'ดอยสุเทพ', dx: 90, dy: -80, at: at([-49, 20, -47])},
  {t0: 4.4, t1: 8.6, label: 'แม่น้ำปิง', dx: -40, dy: 110, at: at([RIVER_X, 0, 18])},
  {t0: 9.6, t1: 13.8, label: 'ลำพูน · หริภุญชัย', dx: 40, dy: -120, at: at([KUKUT[0], 4, KUKUT[1]])},
  {t0: 16, t1: 19.2, label: 'คูเมือง', dx: 80, dy: 120, at: at([11.4, 0, 5])},
  {t0: 19.6, t1: 23.6, label: 'ประตูท่าแพ', dx: 120, dy: 130, at: at([10, 2, 0])},
  {t0: 24.3, t1: 27.6, label: 'พระธาตุดอยสุเทพ', dx: 150, dy: -70, at: at(DOI_SUTHEP_TEMPLE)},
  {t0: 25.6, t1: 29.2, label: 'เจดีย์หลวง', dx: -170, dy: -110, at: at([0, 7, 0])},
  {t0: 27.2, t1: 29.2, label: 'วัดเจ็ดยอด', dx: -60, dy: -120, at: at([-16, 2.5, -18])},
  {t0: 29.6, t1: 31.8, label: 'พ.ศ. 2088', dx: -180, dy: -140, at: at([0, 4.5, 0])},
  {t0: 45.7, t1: 48, label: 'สถานีรถไฟเชียงใหม่', dx: -60, dy: -130, at: at([RAIL_X + 3, 2, -2])},
  {t0: 51, t1: 55, label: 'นิมมานเหมินท์', dx: 60, dy: -120, at: at([-16, 6, -14])},
];

export const ChiangMaiIso: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const Y = yearAt(t);
  const {night, dusk, finale} = lighting(t);
  const [handle] = useState(() => delayRender('Loading Kanit'));
  useEffect(() => {
    Promise.all(
      ['400', '500', '600', '700'].map((w) => document.fonts.load(`${w} 40px Kanit`, 'เชียงใหม่ 0123')),
    ).then(() => continueRender(handle));
  }, [handle]);

  const top = mix(mix(keyColor(SKY_TOP, Y), '#5a6aa0', dusk * 0.5), '#060a20', night);
  const bottom = mix(mix(keyColor(SKY_BOTTOM, Y), '#ff935a', dusk * 0.75), mix('#1c2350', '#4a2c55', finale), night);
  const burm = ramp(Y, 1556, 1563) * (1 - ramp(Y, 1775, 1792));
  const rain = bump(t, 32.2, 37.2, 0.8);
  const quake = Y >= 1545 && Y < 1545.8 ? 1 - ramp(Y, 1545, 1545.8) : 0;

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bottom} 55%, ${bottom} 100%)`}}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y * 0.8} r={s.r} fill="#fff" opacity={night * (0.55 + 0.45 * Math.sin(s.tw + frame * 0.2))} />
        ))}
      </svg>
      <AbsoluteFill
        style={{
          transform: `translate(${quake * 14 * Math.sin(frame * 2.7)}px, ${quake * 9 * Math.cos(frame * 3.3)}px)`,
          filter: `saturate(${1 - 0.6 * burm}) sepia(${0.3 * burm})`,
        }}
      >
        <ThreeCanvas
          width={W}
          height={H}
          frameloop="never"
          shadows
          gl={{antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15}}
          camera={{fov: 30, near: 0.5, far: 1200, position: [80, 60, 80]}}
        >
          <IsoScene fog={bottom} />
        </ThreeCanvas>
      </AbsoluteFill>
      {/* tilt-shift: blur the top and bottom bands for the miniature look */}
      {[
        {top: 0, height: H * 0.42, mask: 'linear-gradient(180deg, black 0%, black 35%, transparent 100%)'},
        {top: H * 0.7, height: H * 0.3, mask: 'linear-gradient(0deg, black 0%, black 30%, transparent 100%)'},
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: b.top,
            height: b.height,
            backdropFilter: 'blur(5px)',
            WebkitMaskImage: b.mask,
            maskImage: b.mask,
          }}
        />
      ))}
      {rain > 0.01 && (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0, opacity: rain}}>
          <rect width={W} height={H} fill="#4b5560" opacity={0.18} />
          {RAIN.map((r, i) => {
            const y = ((r.y + frame * r.speed) % 2100) - 120;
            return <line key={i} x1={r.x} y1={y} x2={r.x - 8} y2={y + r.len} stroke="#dfe7ee" strokeWidth={1.4} opacity={0.35} />;
          })}
        </svg>
      )}
      <Overlay callouts={CALLOUTS} />
      <Audio src={staticFile('soundtrack.wav')} />
    </AbsoluteFill>
  );
};
