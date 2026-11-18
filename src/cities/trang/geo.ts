import type {Geo} from '../../engine/geo';
import {LIBONG} from './actors';
import {CLOCK, FIRST_RUBBER, HALL, KT_PORT, KT_STATION, PILLAR, SRA, TR_STATION} from './places';

// Pins from cloud's map (docs/briefs/trang_onep/trang_story_places.geojson); the city pillar at Khuan Thani is the origin,
// 200 m/unit, true scale north of Kantang, the sea pulled up and Ko Libong drawn closer (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine, Khuan Thani (origin)', lat: 7.52393, lon: 99.55701, at: PILLAR, centre: true, source: 'OSM way 1442965281'},
    {name: 'Kantang station', lat: 7.4108, lon: 99.51462, at: KT_STATION, source: 'OSM way 888443191'},
    {name: 'Kantang port', lat: 7.4103, lon: 99.50883, at: KT_PORT, source: 'OSM way 1365541871'},
    {name: 'First rubber tree', lat: 7.40961, lon: 99.52284, at: FIRST_RUBBER, source: 'OSM node 13271459613'},
    {name: 'Trang estuary at Kantang', lat: 7.4108, lon: 99.5049, at: [-29.6, 38.8], water: true, source: 'OSM relation 2030831'},
    {name: 'Trang station', lat: 7.55445, lon: 99.60461, at: TR_STATION, source: 'OSM way 668543346'},
    {name: 'Clock tower', lat: 7.55677, lon: 99.60989, at: CLOCK, source: 'OSM node 5267704421'},
    {name: 'Provincial hall', lat: 7.55822, lon: 99.61143, at: HALL, source: 'OSM node 5356395221 (drawn 1.7 N, off the streets)'},
    {name: 'Sra Kaphang Surin', lat: 7.57632, lon: 99.62439, at: SRA, water: true, source: 'OSM relation 3992344'},
    {name: 'Ko Libong', lat: 7.24357, lon: 99.39641, at: LIBONG, far: true, source: 'OSM way 23984406'},
  ],
};
