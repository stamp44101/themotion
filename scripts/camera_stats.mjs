import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSync} from 'esbuild';

async function load(file) {
  const tmp = path.resolve(`out/.stats_${path.basename(path.dirname(file))}_${path.basename(file)}.mjs`);
  fs.mkdirSync('out', {recursive: true});
  buildSync({entryPoints: [file], bundle: true, format: 'esm', platform: 'node', packages: 'external', jsx: 'automatic', outfile: tmp, logLevel: 'error'});
  return import(pathToFileURL(tmp).href + '?' + Date.now());
}

const lib = await load('src/lib.ts');
const {makeCurve} = lib;

export const analyzeCamera = (keys, dur = 60) => {
  const C = [1, 2, 3, 4, 5, 6, 7].map((i) => makeCurve(keys.map((k) => [k[0], k[i]])));
  const dt = 1 / 30;
  const N = Math.floor(dur / dt);

  let zoomFrames = 0;
  let orbitFrames = 0;
  let travelFrames = 0;
  let holdFrames = 0;
  let totalAzSwept = 0;
  let wideBetween10and50 = 0;

  for (let i = 0; i < N - 1; i++) {
    const t0 = i * dt;
    const t1 = (i + 1) * dt;

    const [tx0, ty0, tz0, d0, az0, el0] = C.map((c) => c(t0));
    const [tx1, ty1, tz1, d1, az1, el1] = C.map((c) => c(t1));

    const dAz = Math.abs(az1 - az0);
    totalAzSwept += dAz;

    const zoom = Math.abs(Math.log(d1) - Math.log(d0)) / dt;
    const elRad = (el0 * Math.PI) / 180;
    const orbit = ((dAz * Math.PI) / 180 / dt) * Math.cos(elRad);
    const dTarget = Math.hypot(tx1 - tx0, ty1 - ty0, tz1 - tz0);
    const travel = dTarget / d0 / dt;

    const maxM = Math.max(zoom, orbit, travel);
    if (maxM < 0.05) {
      holdFrames++;
    } else if (maxM === zoom) {
      zoomFrames++;
    } else if (maxM === orbit) {
      orbitFrames++;
    } else {
      travelFrames++;
    }

    if (t0 >= 10 && t0 <= 50 && d0 >= 100) {
      wideBetween10and50++;
    }
  }

  const total = N - 1;
  return {
    zoom: Math.round((zoomFrames / total) * 100),
    orbit: Math.round((orbitFrames / total) * 100),
    travel: Math.round((travelFrames / total) * 100),
    hold: Math.round((holdFrames / total) * 100),
    azimuthSwept: Math.round(totalAzSwept),
    wideFrames: wideBetween10and50,
  };
};

if (process.argv[2]) {
  const mod = await load(`src/cities/${process.argv[2]}/index.ts`);
  const city = Object.values(mod).find((v) => v && v.layout && v.layout.cameraKeys);
  const stats = analyzeCamera(city.layout.cameraKeys, city.story.duration ?? 60);
  console.log(process.argv[2], stats);
}
