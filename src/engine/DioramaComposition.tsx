import {ThreeCanvas} from '@remotion/three';
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {STARS} from '../geometry';
import {FPS, H, W, bump, keyColor, lighting, mix} from '../lib';
import {Overlay, ScreenCallout} from '../Overlay';
import {projectAt} from './camera';
import {Diorama} from './Diorama';
import type {CityConfig} from './types';

const RAIN = new Array(170).fill(0).map((_, i) => ({
  x: ((i * 397) % 1140) - 30,
  y: (i * 613) % 2100,
  speed: 55 + ((i * 37) % 25),
  len: 28 + ((i * 53) % 26),
}));

export const DioramaComposition: React.FC<{city: CityConfig}> = ({city: c}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const Y = c.story.yearAt(t);
  const {night, dusk, finale} = lighting(t);
  const [handle] = useState(() => delayRender('Loading Kanit'));
  useEffect(() => {
    Promise.all(['400', '500', '600', '700'].map((w) => document.fonts.load(`${w} 40px Kanit`, 'ไทย 0123'))).then(() =>
      continueRender(handle),
    );
  }, [handle]);

  const callouts: ScreenCallout[] = c.callouts.map((co) => ({
    ...co,
    at: (tt: number) => projectAt(c.layout.cameraKeys, tt, co.p),
  }));
  const top = mix(mix(keyColor(c.sky.top, Y), '#5a6aa0', dusk * 0.5), '#060a20', night);
  const bottom = mix(mix(keyColor(c.sky.bottom, Y), '#ff935a', dusk * 0.75), mix('#1c2350', '#4a2c55', finale), night);
  const g = c.gloom(Y);
  const rain = Math.max(0, ...(c.rain ?? []).map(([a, b]) => bump(t, a, b, 0.8)));

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bottom} 55%, ${bottom} 100%)`}}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y * 0.8} r={s.r} fill="#fff" opacity={night * (0.55 + 0.45 * Math.sin(s.tw + frame * 0.2))} />
        ))}
      </svg>
      <AbsoluteFill style={{filter: `saturate(${1 - 0.6 * g}) sepia(${0.3 * g})`}}>
        <ThreeCanvas
          width={W}
          height={H}
          frameloop="never"
          shadows
          gl={{antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15}}
          camera={{fov: 30, near: 0.5, far: 2000, position: [80, 60, 80]}}
        >
          <Diorama c={c} />
        </ThreeCanvas>
      </AbsoluteFill>
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
      <Overlay callouts={callouts} story={c.story} />
      <Audio src={staticFile(c.soundtrack)} />
    </AbsoluteFill>
  );
};
