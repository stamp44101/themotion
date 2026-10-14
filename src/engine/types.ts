import type React from 'react';
import type {Story} from '../Overlay';

/** [centerX, centerZ, height, radius] of a gaussian hill. */
export type Peak = [number, number, number, number];
export type Axis = 'x' | 'z';
export type AxisRiver = {
  /** Direction of flow for the legacy straight river band. */
  axis: Axis;
  /** Position on the cross axis. */
  pos: number;
  width: number;
  /** Limits the river along `axis`; defaults to the whole tile. */
  span?: [number, number];
  path?: undefined;
  closed?: undefined;
};
export type PathRiver = {
  /** River centreline in world-space [x, z] points. `at` values on bridges are
   *  distances in world units from path[0]. */
  path: [number, number][];
  width: number;
  /** Join the last point back to the first, for a closed water loop. */
  closed?: boolean;
  axis?: undefined;
  pos?: undefined;
  span?: undefined;
};
export type River = AxisRiver | PathRiver;
/** Camera key: [seconds, targetX, targetY, targetZ, distance, azimuth°, elevation°, fov°]. */
export type CamKey = [number, number, number, number, number, number, number, number];

export type CityLayout = {
  /** The floating diorama tile, in world units (1 unit ≈ 80 m). */
  tile: {x0: number; x1: number; z0: number; z1: number};
  peaks: Peak[];
  /** Mountain slope color (vertex tint). */
  forest?: string;
  /** A river is either the legacy straight axis band or a polyline centreline.
   *  The first river carries the generic boats. */
  rivers: River[];
  /** Bridges across river `river` (index, default 0). `at` is the coordinate
   *  along an axis river, or distance from path[0] for a polyline river. */
  bridges: {at: number; year: number; modernYear: number; river?: number}[];
  /** Walled city has its own moat (false when rivers form the moat). */
  noMoat?: boolean;
  rail?: {axis: Axis; pos: number; open: [number, number]; station: [number, number]; stationYear: number};
  trains: {t0: number; dur: number; dir: 1 | -1; modern: boolean}[];
  /** Walled old city: a rectangle of half-sizes hx × hz centred on the origin,
   *  unless `outline` gives a real footprint. */
  city: {
    hx: number;
    hz: number;
    /** Actual wall footprint as a closed polygon (world units, clockwise or
     *  counter-clockwise). Real cities are rarely rectangles -- Phitsanulok's
     *  wall is a trapezoid because the Nan eroded one corner. When set, the
     *  walls, moat, city ground and the in-city house grid all follow this
     *  instead of hx/hz; hx/hz stay as the bounding half-extents. */
    outline?: [number, number][];
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
