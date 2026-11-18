import type {Geo} from '../../engine/geo';
import {GATE, MONUMENT, PILLAR, WAT_RATCHAKHRUE, WAT_SI_KHOM_KHAM, WAT_SI_UMONG, WAT_TILOK} from './places';

// Pins from cloud's map (docs/briefs/phayao_onep/phayao_story_places.geojson); the city pillar is the origin, 100 m/unit,
// everything at true scale (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 19.1665, lon: 99.901947, at: PILLAR, centre: true, source: 'OSM way 1468605644'},
    {name: 'Wat Si Khom Kham', lat: 19.176503, lon: 99.889309, at: WAT_SI_KHOM_KHAM, source: 'OSM way 210167222'},
    {name: 'Wat Tilok Aram (in the lake)', lat: 19.158517, lon: 99.899646, at: WAT_TILOK, water: true, source: 'OSM node 5230006780'},
    {name: 'Wat Si Umong Kham', lat: 19.16544, lon: 99.900735, at: WAT_SI_UMONG, source: 'OSM way 1212763493'},
    {name: 'Wat Ratchakhrue', lat: 19.167001, lon: 99.903516, at: WAT_RATCHAKHRUE, source: 'OSM node 4733160948'},
    {name: 'Ngam Mueang monument', lat: 19.168766, lon: 99.896075, at: MONUMENT, source: 'OSM node 6315215536'},
    {name: 'Kwan outlet / the 2482 gate', lat: 19.1588, lon: 99.9128, at: GATE, source: 'estimate on the Ing above the OSM bridge'},
  ],
};
