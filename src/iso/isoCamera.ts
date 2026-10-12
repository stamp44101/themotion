import {PerspectiveCamera, Vector3} from 'three';
import {H, W, makeCurve} from '../lib';

// Drone path: [seconds, targetX, targetY, targetZ, distance, azimuth°, elevation°, fov°]
// Azimuth is measured from +z (south) toward +x (east): 45° = looking from the south-east.
const KEYS: [number, number, number, number, number, number, number, number][] = [
  [0, -4, 0, -4, 430, 38, 30, 30],
  [3, -4, 0, -4, 370, 42, 31, 30],
  [8.5, -6, 2, -6, 290, 46, 32, 30],
  [13.5, -6, 0, 0, 220, 50, 33, 30],
  [16, 0, 0, 0, 80, 50, 36, 30],
  [21, 0, 0, 0, 66, 60, 40, 30],
  [24.2, -18, 8, -16, 130, 42, 26, 30],
  [27.2, -6, 3, -6, 120, 40, 30, 30],
  [29.8, 0, 2.5, 0, 34, 42, 30, 30],
  [31.2, 0, 2.5, 0, 31, 46, 30, 30],
  [34.5, 0, 0, 0, 105, 36, 34, 30],
  [38, 0, 0, 0, 88, 30, 38, 30],
  [42.5, 6, 0, 0, 120, 38, 34, 30],
  [45.5, 32, 0, -6, 62, 52, 32, 30],
  [47.2, 34, 0, -8, 60, 56, 32, 30],
  [48.4, -18, 8, -14, 125, 40, 26, 30],
  [50.5, -4, 2, -6, 200, 40, 30, 30],
  [55, 0, 1, -2, 150, 50, 30, 30],
  [57, 0, 2, -2, 190, 52, 28, 30],
  [60, -2, 4, -4, 240, 54, 27, 30],
];

const ch = (i: number) => makeCurve(KEYS.map((k) => [k[0], k[i]]));
const C = [1, 2, 3, 4, 5, 6, 7].map(ch);

export type IsoCam = {pos: [number, number, number]; target: [number, number, number]; fov: number};

export const isoCamera = (t: number): IsoCam => {
  const [tx, ty, tz, dist, az, el, fov] = C.map((c) => c(t));
  // gentle drone sway
  const sway = Math.sin(t * 0.35) * 1.5;
  const a = ((az + sway) * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return {
    pos: [tx + dist * Math.cos(e) * Math.sin(a), ty + dist * Math.sin(e), tz + dist * Math.cos(e) * Math.cos(a)],
    target: [tx, ty, tz],
    fov,
  };
};

// The top ~30% of the frame holds the Thai captions, so shift the view down.
export const VIEW_SHIFT = -0.1 * H;

export const applyCamera = (cam: PerspectiveCamera, s: IsoCam) => {
  cam.fov = s.fov;
  cam.aspect = W / H;
  cam.near = 0.5;
  cam.far = 1200;
  cam.position.set(...s.pos);
  cam.lookAt(...s.target);
  cam.setViewOffset(W, H, 0, VIEW_SHIFT, W, H);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
};

const scratch = new PerspectiveCamera();
const v = new Vector3();
export const projectAt = (t: number, p: [number, number, number]) => {
  applyCamera(scratch, isoCamera(t));
  v.set(...p).project(scratch);
  return {x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H};
};
