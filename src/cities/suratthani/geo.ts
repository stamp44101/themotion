import type {Geo} from '../../engine/geo';
import {CHAIYA, KO_LAMPHU, LANDING, NARIT, NEW_HALL, PILLAR, SHRINE, STATION, THA_KHAM} from './places';

// Pins from [local]'s map (docs/briefs/suratthani_onep/suratthani_pins.geojson, PR #81, a67d83d); the
// pillar is the origin, 150 m/unit.
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 9.1391892, lon: 99.3217049, at: PILLAR, centre: true, source: 'OSM way 167081575'},
    {name: 'Ban Don pier (the royal landing, 2458)', lat: 9.1434466, lon: 99.3227906, at: LANDING, source: 'OSM node 2502419676'},
    {name: 'Saphan Narit', lat: 9.1456231, lon: 99.3236418, at: NARIT, source: 'Google ([local])'},
    {name: 'Kuan U shrine, old market', lat: 9.1431473, lon: 99.3290565, at: SHRINE, source: 'Google ([local])'},
    {name: 'Provincial hall, Don Nok', lat: 9.1327378, lon: 99.3321371, at: NEW_HALL, source: 'Google ([local])'},
    {name: 'Ko Lamphu', lat: 9.1375087, lon: 99.3155913, at: KO_LAMPHU, source: 'OSM way 242787629'},
    {name: 'Tapi below the pillar', lat: 9.1428, lon: 99.3221, at: [0.3, -2.7], water: true, source: 'OSM way 557048595 ([local])'},
    {name: 'Tapi mouth', lat: 9.19189, lon: 99.37922, at: [42.1, -38.8], water: true, source: '[local]'},
    {name: 'Chulachomklao bridge, Tha Kham', lat: 9.1128657, lon: 99.2236832, at: THA_KHAM, far: true, source: 'OSM way 1330203990; 11.2 km W, drawn at the tile edge'},
    {name: 'Surat Thani station (Phun Phin)', lat: 9.1039732, lon: 99.2305827, at: STATION, far: true, source: 'OSM way 937312515; 10.7 km W'},
    {name: 'Phra Borommathat Chaiya', lat: 9.3845961, lon: 99.1847363, at: CHAIYA, far: true, source: 'Google ([local]); 31 km NW, drawn on the tile NW shore'},
  ],
};
