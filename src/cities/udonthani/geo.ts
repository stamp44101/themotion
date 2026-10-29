import type {Geo} from '../../engine/geo';
import {BAN_CHIANG, CLOCK, HALL, LAKE_C, MATCHIMA, MONUMENT, PHO_SI, PUYA, STATION} from './places';

// OSM pins from the workstation's pull (docs/briefs/udonthani_onep/README.md, PR #74); the rest from
// Gemini's §4 (docs/briefs/udonthani_research_gemini.md).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 17.4136718, lon: 102.78775, at: [0, 0], centre: true, source: 'OSM node 13245284100'},
    {name: 'Provincial hall', lat: 17.41523, lon: 102.78739, at: HALL, source: 'OSM relation 9300032'},
    {name: 'Nong Prachak (water centroid)', lat: 17.41763, lon: 102.781892, at: LAKE_C, water: true, source: 'OSM relation 1609427'},
    {name: 'Prince Prachak monument', lat: 17.4042796, lon: 102.79392, at: MONUMENT, source: 'OSM node 757352767'},
    {name: 'Udon Thani station', lat: 17.4041726, lon: 102.8055689, at: STATION, source: 'OSM node 675458495'},
    {name: 'Wat Matchimawat', lat: 17.4131, lon: 102.7938, at: MATCHIMA, source: 'Gemini §4'},
    {name: 'Wat Pho Si', lat: 17.4063, lon: 102.7785, at: PHO_SI, source: 'Gemini §4'},
    {name: 'Clock tower', lat: 17.4035, lon: 102.8005, at: CLOCK, source: 'Gemini §4'},
    {name: 'Pu-Ya shrine', lat: 17.4004, lon: 102.8066, at: PUYA, source: 'Gemini §4'},
    {name: 'Ban Chiang (the dig at Wat Pho Si Nai)', lat: 17.4082, lon: 103.2433, at: BAN_CHIANG, far: true, source: 'Gemini §4 (48 km E, drawn on the tile east side)'},
  ],
};
