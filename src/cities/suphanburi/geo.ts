import type {Geo} from '../../engine/geo';
import {FIELD, MAHATHAT, PALELAI, PHRA_RUP, TOWER, WAT_KHAE} from './places';

// OSM pins from the workstation's check (docs/briefs/suphanburi_onep/README.md, PR #73).
export const GEO: Geo = {
  points: [
    {name: 'City pillar (origin)', lat: 14.4784865, lon: 100.1110566, at: [0, 0], centre: true, source: 'OSM node 14109371999'},
    {name: 'Wat Mahathat prang', lat: 14.480519, lon: 100.113446, at: MAHATHAT, source: 'OSM way 905357563'},
    {name: 'Wat Pa Lelai', lat: 14.473958, lon: 100.094777, at: PALELAI, source: 'OSM way 905444399'},
    {name: 'Wat Khae', lat: 14.487271, lon: 100.117101, at: WAT_KHAE, source: 'OSM way 896906752'},
    {name: 'Banharn-Jamsai tower', lat: 14.470501, lon: 100.118056, at: TOWER, source: 'OSM way 905335902'},
    {name: 'Wat Phra Rup', lat: 14.469991, lon: 100.112287, at: PHRA_RUP, source: 'OSM way 1328382461'},
    {name: 'Tha Chin east of the pillar', lat: 14.476063, lon: 100.116782, at: [12.36, 5.36], water: true, source: 'OSM centreline (618, 268) m'},
    {name: 'Don Chedi (King Naresuan monument)', lat: 14.633412, lon: 100.020642, at: FIELD, far: true, source: 'OSM node 14111613114 (19.7 km, drawn on the tile corner)'},
  ],
};
