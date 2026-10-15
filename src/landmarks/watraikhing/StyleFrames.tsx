import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {applyCamera, droneCamera, projectAt} from '../../engine/camera';
import type {CamKey} from '../../engine/types';
import {FPS, H, W} from '../../lib';
import {Overlay, type ScreenCallout, type Story} from '../../Overlay';
import {Temple, UBOSOT} from './Temple';

// Three candidate looks for the owner to pick before the clip is built.
export type Variant = 'hero' | 'river' | 'fair';

const V: Record<Variant, {cam: CamKey; night: number; fair: number; year: number; title: string; sub: string; sky: [string, string]}> = {
  hero: {
    cam: [0, UBOSOT[0], 3, UBOSOT[1] - 2, 88, 162, 27, 30],
    night: 0,
    fair: 0,
    year: 1851,
    title: 'สร้างวัดไร่ขิง',
    sub: 'สันนิษฐานว่า พ.ศ. 2394 พระธรรมราชานุวัตร (พุก) สร้างวัดบนไร่ขิงของชาวจีนริมแม่น้ำท่าจีน',
    sky: ['#7fb2e0', '#e8f0f2'],
  },
  river: {
    cam: [0, 0, 0, -2, 170, 145, 38, 30],
    night: 0,
    fair: 0,
    year: 1903,
    title: 'วัดมงคลจินดาราม',
    sub: 'พ.ศ. 2446 สมเด็จพระมหาสมณเจ้าฯ ประทานนามใหม่ แต่ชาวบ้านยังเรียกวัดไร่ขิง',
    sky: ['#f0a066', '#fbe0b8'],
  },
  fair: {
    cam: [0, 4, 0, 2, 150, 200, 33, 30],
    night: 1,
    fair: 1,
    year: 2026,
    title: 'งานปิดทองหลวงพ่อ',
    sub: 'งานประจำปีกลางเดือนห้า เก้าวันเก้าคืน ริมแม่น้ำท่าจีน',
    sky: ['#0b1030', '#3a2a55'],
  },
};

const KEYS = Object.fromEntries(Object.entries(V).map(([k, v]) => [k, [v.cam, [60, ...v.cam.slice(1)] as CamKey]])) as Record<Variant, CamKey[]>;

// frameloop="never": set the camera, then advance one render per frame.
const Rig: React.FC<{keys: CamKey[]; t: number; frame: number}> = ({keys, t, frame}) => {
  const cam = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const advance = useThree((s) => s.advance);
  useLayoutEffect(() => {
    applyCamera(cam, droneCamera(keys)(t));
    advance(performance.now());
  }, [cam, keys, t, frame, advance]);
  return null;
};

export const WatRaiKhingStyle: React.FC<{variant: Variant}> = ({variant}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const v = V[variant];
  const keys = KEYS[variant];
  const [handle] = useState(() => delayRender('Loading Kanit'));
  useEffect(() => {
    Promise.all(['400', '600', '700'].map((w) => document.fonts.load(`${w} 40px Kanit`, 'ไทย 0123'))).then(() => continueRender(handle));
  }, [handle]);
  const story: Story = {
    captions: [{t0: 3.5, t1: 20, title: v.title, sub: v.sub}],
    eras: [],
    yearAt: () => v.year,
    intro: {kicker: '', title: 'วัดไร่ขิง', sub: ''},
    finale: {kicker: '', title: 'วัดไร่ขิง', sub: ''},
    approxBefore: 1860,
    duration: 60,
  };
  const callouts: ScreenCallout[] = [
    {t0: 4, t1: 20, label: 'พระอุโบสถ', dx: 120, dy: -60, at: (tt) => projectAt(keys, tt, [UBOSOT[0], 9, UBOSOT[1]])},
  ];
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${v.sky[0]} 0%, ${v.sky[1]} 60%)`}}>
      <ThreeCanvas
        width={W}
        height={H}
        frameloop="never"
        shadows
        gl={{antialias: true, alpha: true, preserveDrawingBuffer: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15}}
        camera={{fov: 30, near: 0.5, far: 2000, position: [80, 60, 80]}}
      >
        <Temple night={v.night} fair={v.fair} frame={frame} />
        <Rig keys={keys} t={t} frame={frame} />
      </ThreeCanvas>
      <Overlay callouts={callouts} story={story} />
    </AbsoluteFill>
  );
};
