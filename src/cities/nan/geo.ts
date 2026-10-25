import type {Geo} from '../../engine/geo';
import {AIRFIELD, BOAT_MONUMENT, CHAE_HAENG, CHANG_KHAM, HOKHAM, KHAO_NOI_WAT, MING_MUEANG, PHUMIN} from './places';

// OSM positions from the workstation's check (docs/briefs/nan_onep/README.md, PR #70).
export const GEO: Geo = {
  points: [
    {name: 'Temple core centroid (ONEP record 23)', lat: 18.775818, lon: 100.771412, at: [0, 0], centre: true, source: 'README geometry'},
    {name: 'Wat Phumin', lat: 18.774602, lon: 100.771631, at: PHUMIN, source: 'OSM way 246657153'},
    {name: 'Ho Kham (Nan National Museum)', lat: 18.776202, lon: 100.770714, at: HOKHAM, source: 'OSM way 246667329'},
    {name: 'Phra That Chang Kham', lat: 18.776419, lon: 100.772033, at: CHANG_KHAM, source: 'OSM way 1489166430'},
    {name: 'Wat Ming Mueang (city pillar)', lat: 18.774941, lon: 100.76912, at: MING_MUEANG, source: 'OSM way 246657160'},
    {name: 'Phra That Chae Haeng', lat: 18.758252, lon: 100.791709, at: CHAE_HAENG, source: 'OSM node 3205822866'},
    {name: 'Wat Phra That Khao Noi', lat: 18.769549, lon: 100.750679, at: KHAO_NOI_WAT, source: 'OSM way 1089031375'},
    {name: 'Racing-boat monument', lat: 18.77584, lon: 100.779949, at: BOAT_MONUMENT, source: 'OSM node 6341405386'},
    {name: 'Nan Nakhon airport', lat: 18.808407, lon: 100.783986, at: AIRFIELD, source: 'OSM way 247767587 (3.8 km out, drawn 2.7 km out, bearing kept)'},
    {name: 'Nan river at the main bridge', lat: 18.775531, lon: 100.780606, at: [13.84, 0.46], water: true, source: 'OSM way 310184178'},
  ],
};
