import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS, ramp} from '../lib';
import {droneCamera, projectAt} from './camera';
import type {CamKey} from './types';

/** Small north arrow, top right, turning with the camera, so locals can read the map.
 *  Added after a Chonburi viewer asked for real directions. World north is -z. */
export const Compass: React.FC<{keys: CamKey[]; duration: number}> = ({keys, duration}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const {target} = droneCamera(keys)(t);
  const a = projectAt(keys, t, target);
  const b = projectAt(keys, t, [target[0], target[1], target[2] - 10]);
  const ang = (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI;
  const k = ramp(t, 3.0, 3.6) * (1 - ramp(t, duration - 4.2, duration - 3.6));
  if (k <= 0) return null;
  const r = (ang * Math.PI) / 180;
  return (
    <svg width={110} height={110} viewBox="-55 -55 110 110" style={{position: 'absolute', left: 840, top: 250, opacity: 0.92 * k}}>
      <circle r={30} fill="rgba(10,14,30,0.5)" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} />
      <g transform={`rotate(${ang})`}>
        <path d="M0,-25 L8,2 L0,-4 L-8,2 Z" fill="#ffd27a" />
        <path d="M0,25 L8,2 L0,8 L-8,2 Z" fill="rgba(255,255,255,0.55)" />
      </g>
      {/* the letter stays upright, just beyond the north tip */}
      <text x={Math.sin(r) * 42} y={-Math.cos(r) * 42 + 6} textAnchor="middle" fontFamily="Kanit" fontWeight={700} fontSize={17} fill="#ffd27a">
        N
      </text>
    </svg>
  );
};
