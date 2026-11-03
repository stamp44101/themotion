import type {Geo} from '../../engine/geo';
import {BRIDGE, CHONG_KAI, DON_RAK, GATE, LAT_YA, NEW_HALL, OLD_HALL, PILLAR, PIER, STATION} from './places';

// Pins from [local]'s map (docs/briefs/kanchanaburi_onep/kanchanaburi_story_places.geojson, PR #83);
// the pillar is the origin, 100 m/unit.
export const GEO: Geo = {
  points: [
    {name: 'City pillar (origin)', lat: 14.01964, lon: 99.53081, at: PILLAR, centre: true, source: '[local] map'},
    {name: 'Front gate of the Pak Phraek wall', lat: 14.01942, lon: 99.52991, at: GATE, source: '[local] map'},
    {name: 'Old provincial hall (inside the wall)', lat: 14.0185, lon: 99.5305, at: OLD_HALL, source: '[local] map'},
    {name: 'Old pier / Skywalk at the confluence', lat: 14.0185, lon: 99.5278, at: PIER, water: true, source: '[local] map'},
    {name: 'Kwai bridge', lat: 14.041, lon: 99.504, at: BRIDGE, source: '[local] map; 3.7 km NW'},
    {name: 'Kanchanaburi station', lat: 14.0342, lon: 99.5253, at: STATION, source: '[local] map; OSM 34 m off'},
    {name: 'Don Rak war cemetery', lat: 14.03167, lon: 99.52556, at: DON_RAK, source: '[local] map'},
    {name: 'Chong Kai cemetery', lat: 14.0052, lon: 99.5146, at: CHONG_KAI, source: '[local] map'},
    {name: 'New provincial hall (Ban Bo)', lat: 14.0044, lon: 99.5484, at: NEW_HALL, source: '[local] map'},
    {name: 'Lat Ya (the old seat, pre-2374)', lat: 14.118198, lon: 99.399609, at: LAT_YA, far: true, source: '[local] map; 17.9 km NW, drawn at the tile NW corner'},
  ],
};
