import type {Geo} from '../../engine/geo';
import {KHU_BUA, KILNS, MAHATHAT, OLD_HALL, PILLAR, STATION} from './places';

// OSM pins from [local]'s pull (docs/briefs/ratchaburi_onep/README.md, PR #78); the wall's pin and
// Koi Ki from Gemini's §4 (docs/briefs/ratchaburi_research_gemini.md).
export const GEO: Geo = {
  points: [
    {name: 'City pillar, 2360 walled town (origin side)', lat: 13.5441, lon: 99.8255, at: PILLAR, centre: true, source: 'Gemini §4 (Phanurangsi camp)'},
    {name: 'Wat Mahathat prang', lat: 13.5466, lon: 99.8144, at: MAHATHAT, source: 'OSM node 2578808283'},
    {name: 'Ratchaburi station', lat: 13.5306, lon: 99.8238, at: STATION, source: 'OSM node 259729391'},
    {name: 'Koi Ki old market', lat: 13.5402, lon: 99.8218, at: [-11.7, 8.6], source: 'Gemini §4'},
    {name: 'Old monthon hall (national museum)', lat: 13.5411, lon: 99.8177, at: OLD_HALL, source: 'OSM relation 12906115'},
    {name: 'Tao Hong Tai (the kiln quarter)', lat: 13.5428, lon: 99.8054, at: KILNS, source: 'OSM node 4585665489'},
    {name: 'Mae Klong at the bend', lat: 13.5414, lon: 99.8221, at: [-10, 4.3], water: true, source: 'OSM way 301356780'},
    {name: 'Khu Bua ancient town', lat: 13.4864, lon: 99.8357, at: KHU_BUA, far: true, source: 'OSM node 5583402621 (7 km S, drawn on the tile south edge)'},
  ],
};
