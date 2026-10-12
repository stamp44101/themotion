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
  /** Rivers run along `axis` at cross-axis position `pos`; `span` limits their extent along the axis
   *  (defaults to the whole tile). The first river carries the boats. */
  rivers: {axis: Axis; pos: number; width: number; span?: [number, number]}[];
  /** Bridges across river `river` (index, default 0): `at` = position along that river's axis. */
  bridges: {at: number; year: number; modernYear: number; river?: number}[];
  /** Walled city has its own moat (false when rivers form the moat). */
  noMoat?: boolean;
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
  /** If set, modern buildings only appear inside this box (e.g. a new town away from a historic park). */
  urbanBox?: {x0: number; x1: number; z0: number; z1: number};
  towers: {x0: number; x1: number; z0: number; z1: number; extra: number}[];
  roads: {from: [number, number]; to: [number, number]; width: number; year: number}[];
  ringRoadYear: number;
  cars: [number, number];
  boats: [number, number];
  /** 'loykrathong' = lanterns + fireworks + candle krathongs drifting on the moat and `krathongPonds`. */
  finale: 'lanterns' | 'fireworks' | 'loykrathong';
  krathongPonds?: [number, number, number][];
  /** Street life for the drone dives. Each group is visible from `from` to `to` (years). */
  life?: {
    people?: {x: number; z: number; r: number; count: number; from: number; to: number; colors?: string[]; monks?: boolean}[];
    stalls?: {x: number; z: number; r: number; count: number; from: number; to: number}[];
    ships?: {river: number; count: number; from: number; to: number; offset?: number}[];
    houseboats?: {river: number; count: number; from: number; to: number}[];
    elephants?: {x: number; z: number; r: number; count: number; from: number; to: number; howdah?: boolean}[];
    buffalo?: {x: number; z: number; r: number; count: number; from: number; to: number}[];
  };
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
