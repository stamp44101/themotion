import {PerspectiveCamera, Vector3} from 'three';
import {H, W, makeCurve} from '../lib';
import type {CamKey} from './types';

export type DroneCam = {pos: [number, number, number]; target: [number, number, number]; fov: number};

const cache = new Map<CamKey[], (t: number) => DroneCam>();

/** Drone path from keys; azimuth from +z (south) toward +x (east). */
export const droneCamera = (keys: CamKey[]) => {
  let f = cache.get(keys);
  if (f) return f;
  const C = [1, 2, 3, 4, 5, 6, 7].map((i) => makeCurve(keys.map((k) => [k[0], k[i]])));
  f = (t: number) => {
    const [tx, ty, tz, dist, az, el, fov] = C.map((c) => c(t));
    const a = ((az + Math.sin(t * 0.35) * 1.5) * Math.PI) / 180;
    const e = (el * Math.PI) / 180;
    return {
      pos: [tx + dist * Math.cos(e) * Math.sin(a), ty + dist * Math.sin(e), tz + dist * Math.cos(e) * Math.cos(a)],
      target: [tx, ty, tz],
      fov,
    };
  };
  cache.set(keys, f);
  return f;
};

// Keep the top ~30% of the frame for captions.
const VIEW_SHIFT = -0.1 * H;

export const applyCamera = (cam: PerspectiveCamera, s: DroneCam) => {
  cam.fov = s.fov;
  cam.aspect = W / H;
  cam.near = 0.5;
  cam.far = 2000;
  cam.position.set(...s.pos);
  cam.lookAt(...s.target);
  cam.setViewOffset(W, H, 0, VIEW_SHIFT, W, H);
  cam.updateProjectionMatrix();
  cam.updateMatrixWorld();
};

const scratch = new PerspectiveCamera();
const v = new Vector3();
/** Where world point p lands on the 1080x1920 frame at second t, and `scale`: how many
 *  video pixels one world unit covers at that depth (0 behind the camera). */
export const projectAt = (keys: CamKey[], t: number, p: [number, number, number]) => {
  const s = droneCamera(keys)(t);
  applyCamera(scratch, s);
  v.set(...p).project(scratch);
  const depth = Math.hypot(p[0] - s.pos[0], p[1] - s.pos[1], p[2] - s.pos[2]);
  const scale = depth > 0 ? H / (2 * Math.tan((s.fov * Math.PI) / 360) * depth) : 0;
  return {x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H, scale};
};
