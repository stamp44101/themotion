import type {Geo} from '../../engine/geo';
import {CENTRAL, DAM, KKU, PHU_WIANG, PILLAR, STATION, STUPA, THUNG_SANG} from './places';

// Real pins from issue #46 (Google Maps / OSM); see docs/briefs/khonkaen.md.
export const GEO: Geo = {
  points: [
    {name: 'Bueng Kaen Nakhon (water centroid)', lat: 16.41304, lon: 102.83739, at: [0, 0], centre: true, water: true, source: '#46, masked off satellite'},
    {name: 'Phra Mahathat Kaen Nakhon', lat: 16.40943, lon: 102.83422, at: STUPA, source: '#46 "Wat Nong Waeng Phra Aram Luang"'},
    {name: 'Khon Kaen City Pillar Shrine', lat: 16.43108, lon: 102.82846, at: PILLAR, source: '#46'},
    {name: 'Khon Kaen station', lat: 16.42675, lon: 102.82576, at: STATION, source: '#46'},
    {name: 'Central Khon Kaen', lat: 16.43317, lon: 102.82617, at: CENTRAL, source: '#46'},
    {name: 'Bueng Thung Sang', lat: 16.44923, lon: 102.85137, at: THUNG_SANG, source: '#46 (pulled in x0.7)'},
    {name: 'Khon Kaen University', lat: 16.47441, lon: 102.82202, at: KKU, source: '#46 (7 km N, pulled in to the tile edge)'},
    {name: 'Ubolratana dam', lat: 16.77544, lon: 102.61841, at: DAM, far: true, source: '#46'},
    {name: 'Phu Wiang dinosaur museum', lat: 16.67792, lon: 102.26706, at: PHU_WIANG, far: true, source: '#46'},
  ],
};
