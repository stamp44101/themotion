import type React from 'react';
import type {Story} from '../Overlay';

/** [centerX, centerZ, height, radius] of a gaussian hill. */
export type Peak = [number, number, number, number];
export type Axis = 'x' | 'z';
/** Camera key: [seconds, targetX, targetY, targetZ, distance, azimuth°, elevation°, fov°]. */
export type CamKey = [number, number, number, number, number, number, number, number];

export type CityLayout = {
  /** The floating diorama tile, in world units (1 unit ≈ 80 m). */
  tile: {x0: number; x1: number; z0: number; z1: number};
  peaks: Peak[];
  /** Mountain slope color (vertex tint). */
  forest?: string;
  /** River runs along `axis` at cross-axis position `pos`. */
  river: {axis: Axis; pos: number; width: number};
  /** Bridges across the river: `at` = position along the river axis. */
  bridges: {at: number; year: number; modernYear: number}[];
  rail?: {axis: Axis; pos: number; open: [number, number]; station: [number, number]; stationYear: number};
  trains: {t0: number; dur: number; dir: 1 | -1; modern: boolean}[];
  /** Walled old city: a rectangle of half-sizes hx × hz centred on the origin. */
  city: {
    hx: number;
    hz: number;
    moat: [number, number];
    wall: [number, number];
    gates: [number, number];
    /** Years the walls crumble and are restored: [decayStart, decayFull, restoreStart, restoreEnd]. */
    decay?: [number, number, number, number];
    groundFrom: number;
  };
  gates: {x: number; z: number; rot: number; width: number; pavilion?: boolean}[];
  houses: {
    built: [number, number];
    abandon?: {prob: number; from: number; spread: number; rebuild: number; rebuildSpread: number};
    modern: [number, number];
    keepOut: [number, number, number][];
  };
  villages: {centers: [number, number][]; built: [number, number]};
  forestCity: number;
  /** Trees cleared around a landmark: [x, z, radius, year]. */
  clearings?: [number, number, number, number][];
  regrowCity?: [number, number];
  paddies: [number, number];
  /** Modern sprawl: cells urbanize from `from`, `rate` years per unit distance from the walls. */
  urban: {from: number; rate: number};
  towers: {x0: number; x1: number; z0: number; z1: number; extra: number}[];
  roads: {from: [number, number]; to: [number, number]; width: number; year: number}[];
  ringRoadYear: number;
  cars: [number, number];
  boats: [number, number];
  finale: 'lanterns' | 'fireworks';
  plane?: [number, number];
  cameraKeys: CamKey[];
};

export type LandmarkProps = {Y: number; t: number; frame: number; night: number; terrainH: (x: number, z: number) => number};

export type CityConfig = {
  id: string;
  story: Story;
  layout: CityLayout;
  Landmarks: React.FC<LandmarkProps>;
  callouts: {t0: number; t1: number; label: string; dx: number; dy: number; p: [number, number, number]}[];
  soundtrack: string;
  sky: {top: [number, string][]; bottom: [number, string][]; ground: [number, string][]};
  /** 0..1 grade toward desaturated/sepia (wars, dark eras). */
  gloom: (Y: number) => number;
  rain?: [number, number][];
};
