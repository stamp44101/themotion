import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {STARS} from '../../geometry';
import {applyCamera, droneCamera, projectAt} from '../../engine/camera';
import {Compass} from '../../engine/Compass';
import {FPS, H, W, clamp01, mix, sstep} from '../../lib';
import {Overlay, type ScreenCallout} from '../../Overlay';
import {CALLOUTS, CAMERA_KEYS, STORY, WAT_RAI_KHING} from './index';
import {Temple} from './Temple';
import {DURATION} from './timeline';

/** Day through the story, golden hour for the hero shot, night for the fair. Continuous. */
export const lightAt = (t: number) => {
  const golden = sstep(24.5, 28.5, t);
  const night = sstep(28.2, 31.6, t);
  return {golden, night};
};

const Rig: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const advance = useThree((s) => s.advance);
  useLayoutEffect(() => {
    applyCamera(cam, droneCamera(CAMERA_KEYS)(t));
    advance(performance.now());
  }, [cam, t, frame, advance]);
  return null;
};

const CALLS: ScreenCallout[] = CALLOUTS.map((c) => ({...c, at: (tt: number) => projectAt(CAMERA_KEYS, tt, c.p(tt))}));

export const WatRaiKhing: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const Y = STORY.yearAt(t);
  const {golden, night} = lightAt(t);
  const fair = clamp01(sstep(27.0, 29.5, t));
  const [handle] = useState(() => delayRender('Loading Kanit'));
  useEffect(() => {
    Promise.all(['400', '500', '600', '700'].map((w) => document.fonts.load(`${w} 40px Kanit`, 'ไทย 0123'))).then(() => continueRender(handle));
  }, [handle]);
  const top = mix(mix('#7fb2e0', '#e58a5c', golden), '#0b1030', night);
  const bottom = mix(mix('#e8f0f2', '#fbd7a8', golden), '#3a2a55', night);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bottom} 60%, ${bottom} 100%)`}}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y * 0.8} r={s.r} fill="#fff" opacity={night * (0.55 + 0.45 * Math.sin(s.tw + frame * 0.2))} />
        ))}
      </svg>
      <ThreeCanvas
        width={W}
        height={H}
        frameloop="never"
        shadows
        gl={{antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15}}
        camera={{fov: 30, near: 0.5, far: 2000, position: [80, 60, 80]}}
      >
        <Temple Y={Y} night={night} fair={fair} frame={frame} />
        <Rig t={t} frame={frame} />
      </ThreeCanvas>
      {[
        {top: 0, height: H * 0.42, mask: 'linear-gradient(180deg, black 0%, black 35%, transparent 100%)'},
        {top: H * 0.7, height: H * 0.3, mask: 'linear-gradient(0deg, black 0%, black 30%, transparent 100%)'},
      ].map((b, i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: b.top, height: b.height, backdropFilter: 'blur(5px)', WebkitMaskImage: b.mask, maskImage: b.mask}} />
      ))}
      <Overlay callouts={CALLS} story={STORY} />
      <Compass keys={CAMERA_KEYS} duration={DURATION} />
      <Audio src={staticFile(WAT_RAI_KHING.soundtrack)} />
    </AbsoluteFill>
  );
};

export const WAT_RAI_KHING_FRAMES = DURATION * FPS;
