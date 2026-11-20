import type {Geo} from '../../engine/geo';
import {AIRPORT, BANGPU, BRIDGES, CHEDI, CHULA, HALL, PHISUEA, PILLAR, WAT_KLANG} from './places';

// Pins from cloud's map (docs/briefs/samutprakan_onep/samutprakan_story_places.geojson); the city pillar is the origin,
// 150 m/unit, the delta at true scale, Suvarnabhumi and the Bhumibol bridges drawn closer (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 13.59349, lon: 100.59755, at: PILLAR, centre: true, source: 'nominatim node 5214164522'},
    {name: 'Provincial hall', lat: 13.59879, lon: 100.59737, at: HALL, source: 'nominatim node 5215769222'},
    {name: 'Wat Klang Worawihan', lat: 13.59234, lon: 100.5994, at: WAT_KLANG, source: 'OSM way 1229700134'},
    {name: 'Phra Samut Chedi', lat: 13.60027, lon: 100.58683, at: CHEDI, source: 'OSM way 29976964'},
    {name: 'Phi Suea Samut fort', lat: 13.59529, lon: 100.58754, at: PHISUEA, source: 'OSM way 1224439620'},
    {name: 'Phra Chulachomklao fort', lat: 13.53722, lon: 100.57901, at: CHULA, source: 'OSM way 1010188105 (drawn 0.6 km E, by the shore)'},
    {name: 'Bang Pu resort', lat: 13.51989, lon: 100.65091, at: BANGPU, source: 'OSM way 543819719'},
    {name: 'Chao Phraya off Pak Nam', lat: 13.5965, lon: 100.5925, at: [-3.6, -3.5], water: true, source: 'OSM river centreline'},
    {name: 'Gulf off the mouth', lat: 13.53, lon: 100.6, at: [1.8, 46.8], water: true, source: 'OSM coastline 787931156 (sea side)'},
    {name: 'Suvarnabhumi airport', lat: 13.68188, lon: 100.74858, at: AIRPORT, far: true, source: 'OSM relation 6641648'},
    {name: 'Bhumibol bridge 2', lat: 13.65673, lon: 100.54044, at: BRIDGES[1], far: true, source: 'OSM way 956029041'},
  ],
};
