import type {Geo} from '../../engine/geo';
import {DAM, LANDING, MONUMENT, PARAMIN, PHICHAI, RESIDENCE, SILA_AT, STATION, THA_SAO} from './places';

// Pins from [local]'s map (docs/briefs/uttaradit_onep/uttaradit_story_places.geojson); the monument is the origin, 100
// m/unit. The town is true scale; Phichai is a true-size patch moved north along the valley (places.ts), so its places
// keep their bearings from each other and the town-to-Phichai bearing is drawn ~12 degrees off; the far places are
// pulled in along their bearings. Ban Huai Kha, Wat Ekka and the Nam Phi pits are drawn but not pinned here: none is
// named on screen, and Phichai's 36 km squeezed to ~4 km bends their bearings from Ban Dara and the dam (brief, v1 build).
export const GEO: Geo = {
  points: [
    {name: 'Phraya Phichai monument (origin)', lat: 17.62966, lon: 100.09742, at: MONUMENT, centre: true, source: '[local] map (OSM)'},
    {name: 'Old governor\'s residence', lat: 17.6269, lon: 100.099, at: RESIDENCE, source: 'gem (unchecked)'},
    {name: 'Bang Pho Tha It landing (Wat Tha Thanon)', lat: 17.6195, lon: 100.0986, at: LANDING, source: '[local] map (gem pin, fits OSM)'},
    {name: 'Uttaradit station', lat: 17.6204, lon: 100.0972, at: STATION, source: '[local] map (OSM); drawn 3.7 W, beside the straight line'},
    {name: 'Sila At station', lat: 17.6392, lon: 100.1010, at: SILA_AT, source: '[local] map (OSM); drawn 2.2 W, beside the straight line'},
    {name: 'The Nan below the landing', lat: 17.6162, lon: 100.0992, at: [2.2, 14.7], water: true, source: 'OSM centreline (drawn 60 m E)'},
    {name: 'Tha Sao', lat: 17.6458, lon: 100.1183, at: THA_SAO, source: '[local] map (OSM)'},
    {name: 'Paramin bridge, Ban Dara', lat: 17.3832, lon: 100.0828, at: PARAMIN, far: true, source: '[local] map; 27.5 km S, pulled in (where the drawn line crosses the Nan)'},
    {name: 'Old Phichai (wall centre)', lat: 17.30526, lon: 100.0799, at: PHICHAI, far: true, source: '[local] trace; 36 km S, moved north'},
    {name: 'Sirikit dam', lat: 17.7639, lon: 100.5633, at: DAM, far: true, source: '[local] map; 51.5 km ENE, pulled in'},
  ],
};
