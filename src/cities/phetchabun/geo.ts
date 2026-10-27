import type {Geo} from '../../engine/geo';
import {MAHATHAT, NAKHONBAN, POOL, PRATU_DAO, TRAIPHUM, WALL_HALL} from './places';

// Pins from the workstation's check (docs/briefs/phetchabun_onep/README.md, PR #72).
export const GEO: Geo = {
  points: [
    {name: 'City pillar (origin)', lat: 16.4209739, lon: 101.1600819, at: [0, 0], centre: true, source: 'OSM node 2322827369'},
    {name: 'Wat Mahathat', lat: 16.420741, lon: 101.155265, at: MAHATHAT, source: 'OSM way 1456688280'},
    {name: 'Wat Traiphum', lat: 16.422673, lon: 101.161512, at: TRAIPHUM, source: 'Google Maps'},
    {name: 'Wall exhibition hall', lat: 16.423494, lon: 101.161996, at: WALL_HALL, source: 'Google Maps'},
    {name: 'Wat Pratu Dao', lat: 16.423576, lon: 101.164772, at: PRATU_DAO, source: 'Google Maps'},
    {name: 'Nakhonban monument', lat: 16.417047, lon: 101.153887, at: NAKHONBAN, source: 'Google Maps (Gemini pin)'},
    {name: 'Um Phra Dam Nam site (Pa Sak)', lat: 16.429102, lon: 101.163123, at: POOL, water: true, source: 'Google Maps'},
  ],
};
