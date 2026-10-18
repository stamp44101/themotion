import type {Geo} from '../../engine/geo';
import {CENTRAL, DAM, KKU, PHU_WIANG, STATION, STUPA, THUNG_SANG} from './places';

// PROVISIONAL anchors (from memory, not Google Maps) until issue #46: replace with real pins.
export const GEO: Geo = {
  points: [
    {name: 'Bueng Kaen Nakhon (centre)', lat: 16.418, lon: 102.832, at: [0, 0], centre: true, water: true, source: 'provisional, #46'},
    {name: 'Phra Mahathat Kaen Nakhon', lat: 16.4183, lon: 102.8378, at: STUPA, source: 'provisional, #46'},
    {name: 'Khon Kaen station', lat: 16.433, lon: 102.8235, at: STATION, source: 'provisional, #46'},
    {name: 'Central Khon Kaen', lat: 16.4325, lon: 102.826, at: CENTRAL, source: 'provisional, #46'},
    {name: 'Bueng Thung Sang', lat: 16.444, lon: 102.856, at: THUNG_SANG, source: 'provisional, #46'},
    {name: 'Khon Kaen University', lat: 16.4746, lon: 102.8227, at: KKU, source: 'provisional, #46 (6 km N, pulled in to the tile edge)'},
    {name: 'Ubolratana dam', lat: 16.775, lon: 102.6186, at: DAM, far: true, source: 'provisional, #46'},
    {name: 'Phu Wiang', lat: 16.68, lon: 102.37, at: PHU_WIANG, far: true, source: 'provisional, #46'},
  ],
};
