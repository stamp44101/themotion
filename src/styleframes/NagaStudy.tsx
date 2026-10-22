// A study of Ubon's naga on its own, to judge the head's proportions: frame 0 from the side,
// 1 three-quarter, 2 from the front, 3 from above. Not part of any clip.
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import React, {useLayoutEffect, useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Naga, V3} from '../cities/ubon/Naga';

const VIEWS: [number, number][] = [
  [90, 10],
  [40, 15],
  [0, 8],
  [60, 55],
];

const Cam: React.FC<{az: number; el: number}> = ({az, el}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const a = (az * Math.PI) / 180;
    const e = (el * Math.PI) / 180;
    const d = 13;
    const target = new THREE.Vector3(0, 6.2, 1.2);
    camera.position.set(target.x + Math.sin(a) * Math.cos(e) * d, target.y + Math.sin(e) * d, target.z + Math.cos(a) * Math.cos(e) * d);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  }, [az, el, camera]);
  return null;
};

// a cobra pose: the body rises from the ground, the neck arches and the head looks forward (+z)
const pose = (): V3[] => {
  const pts: V3[] = [];
  for (let i = 0; i < 60; i++) {
    const u = i / 59;
    if (u < 0.25) {
      const k = u / 0.25;
      pts.push([0, 6.2 - k * 1.2 + Math.sin(k * Math.PI) * 0.6, 1.2 - k * 2.4]);
    } else {
      const k = (u - 0.25) / 0.75;
      pts.push([Math.sin(k * 5) * 1.2 * k, 5 - k * 5, -1.2 - k * 2 - Math.cos(k * 4) * 1.5 * k]);
    }
  }
  return pts;
};

export const NagaStudy: React.FC = () => {
  const frame = useCurrentFrame();
  const [az, el] = VIEWS[frame % VIEWS.length];
  const pts = useMemo(pose, []);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #8fb3d9 0%, #e9e2d0 100%)'}}>
      <ThreeCanvas width={1080} height={1080} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15}} camera={{fov: 30}}>
        <Cam az={az} el={el} />
        <hemisphereLight args={['#dfeaff', '#7a6a4a', 1.1]} />
        <directionalLight position={[8, 14, 10]} intensity={2.2} />
        <Naga pts={pts} r={0.75} jaw={0.6} t={0.1} />
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#c9b98f" />
        </mesh>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
