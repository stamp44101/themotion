import type {Geo} from '../../engine/geo';
import {DAM, FIRST_PILLAR, HALL, MONUMENT, PHU_KUM_KHAO, PILLAR, POND_C, SOMPHAMIT, WAT_KLANG, WAT_NUEA, WAT_TAI} from './places';

// Pins from cloud's map (docs/briefs/kalasin_onep/kalasin_story_places.geojson); the city pillar is the origin, 100 m/unit,
// the town at true scale, the dam and Phu Kum Khao drawn closer (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 16.43519, lon: 103.50069, at: PILLAR, centre: true, source: 'OSM way 1534234341'},
    {name: 'Chao Pho Somphamit shrine', lat: 16.43503, lon: 103.49946, at: SOMPHAMIT, source: 'OSM way 1444649565'},
    {name: 'Wat Nuea', lat: 16.4375, lon: 103.5018, at: WAT_NUEA, source: 'nominatim'},
    {name: 'Wat Klang', lat: 16.43515, lon: 103.5024, at: WAT_KLANG, source: 'OSM node 12466188801'},
    {name: 'Wat Tai Pho Kham', lat: 16.4326, lon: 103.5011, at: WAT_TAI, source: 'OSM way 546444753'},
    {name: 'Phraya Chai Sunthon monument', lat: 16.43433, lon: 103.50356, at: MONUMENT, source: 'OSM node 6183268777'},
    {name: 'Kut Nam Kin, first pillar site', lat: 16.4291, lon: 103.4996, at: FIRST_PILLAR, source: 'OSM water 169557178 (north rim)'},
    {name: 'Kaeng Don Klang pond', lat: 16.45021, lon: 103.51354, at: POND_C, water: true, source: 'OSM way 242763546'},
    {name: 'New provincial hall', lat: 16.44232, lon: 103.53538, at: HALL, source: 'OSM node 10823555706'},
    {name: 'Lam Pao dam', lat: 16.6034, lon: 103.4604, at: DAM, far: true, source: 'OSM way 36900154'},
    {name: 'Phu Kum Khao', lat: 16.6932, lon: 103.5243, at: PHU_KUM_KHAO, far: true, source: 'OSM way 659666469'},
  ],
};
