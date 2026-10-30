import type {Geo} from '../../engine/geo';
import {CHEDI, PALACE, PRATHON, SILPAKORN, STATION, THA_NA} from './places';

// OSM pins from the workstation's pull (docs/briefs/nakhonpathom_onep/README.md, PR #76); Tha Na from
// Gemini's §4 (docs/briefs/nakhonpathom_research_gemini.md).
export const GEO: Geo = {
  points: [
    {name: 'Phra Pathom Chedi (origin)', lat: 13.819673, lon: 100.060078, at: CHEDI, centre: true, source: 'OSM way 260617833'},
    {name: 'Nakhon Pathom station', lat: 13.824502, lon: 100.058739, at: STATION, source: 'OSM node 259729390'},
    {name: 'Sanam Chandra Palace', lat: 13.820498, lon: 100.045664, at: PALACE, source: 'OSM way 96936815'},
    {name: 'Silpakorn University, Sanam Chandra campus', lat: 13.817934, lon: 100.039971, at: SILPAKORN, source: 'OSM way 220825148'},
    {name: 'Phra Prathon Chedi', lat: 13.815034, lon: 100.096902, at: PRATHON, source: 'OSM way 1227287978'},
    {name: 'Khlong Chedi Bucha, north-east of the chedi', lat: 13.821265, lon: 100.071993, at: [16, -7.4], water: true, source: 'OSM way 618139639'},
    {name: 'Old Nakhon Chai Si (Tha Na market) on the Tha Chin', lat: 13.8018, lon: 100.1871, at: THA_NA, far: true, source: 'Gemini §4 (13.8 km E, drawn on the tile east edge)'},
  ],
};
