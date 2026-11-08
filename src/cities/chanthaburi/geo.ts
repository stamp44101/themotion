import type {Geo} from '../../engine/geo';
import {
  BOT_MUEANG, CAMP, CATHEDRAL, KHAO_PLOI_WAEN, MARKET, NOEN_WONG, OLD_HALL, PILLAR, SAMET_NGAM, TUEK_DAENG, WATERFRONT, WEST_FORT,
} from './places';

// Pins from [local]'s map (docs/briefs/chanthaburi_onep/chanthaburi_story_places.geojson, PR #86); the city pillar is the
// origin, 100 m/unit. The far places are pulled in along their true bearings (places.ts `squeeze`), so their bearings
// from the pillar hold; the two forts at the mouth are drawn either side of the estuary.
export const GEO: Geo = {
  points: [
    {name: 'City pillar (origin)', lat: 12.61616, lon: 102.11061, at: PILLAR, centre: true, source: '[local] map (OSM)'},
    {name: 'Camp Taksin (Ban Lum wall line)', lat: 12.61963, lon: 102.10966, at: CAMP, source: '[local] map (OSM)'},
    {name: 'Old provincial hall', lat: 12.61496, lon: 102.11095, at: OLD_HALL, source: '[local] map (OSM)'},
    {name: 'Wat Bot Mueang', lat: 12.6138, lon: 102.11311, at: BOT_MUEANG, source: '[local] map (OSM)'},
    {name: 'Chanthabun waterfront', lat: 12.61271, lon: 102.11371, at: WATERFRONT, source: '[local] map (OSM)'},
    {name: 'Cathedral (east bank)', lat: 12.60923, lon: 102.11864, at: CATHEDRAL, source: '[local] map (OSM pin, not Gemini\'s)'},
    {name: 'Gem market, Si Chan road', lat: 12.60679, lon: 102.11517, at: MARKET, source: '[local] map (OSM); drawn 200 m W along the street'},
    {name: 'Chanthaburi River at the waterfront', lat: 12.61279, lon: 102.11403, at: [4.47, 3.73], water: true, source: 'OSM centreline (drawn 75 m E, the river is widened)'},
    {name: 'Noen Wong camp (Wat Yothanimit)', lat: 12.58657, lon: 102.06974, at: NOEN_WONG, far: true, source: '[local] map; 5.5 km SW, pulled in'},
    {name: 'Khao Ploi Waen', lat: 12.60923, lon: 102.04027, at: KHAO_PLOI_WAEN, far: true, source: '[local] map; 7.7 km W, pulled in'},
    {name: 'Samet Ngam (lower river)', lat: 12.53138, lon: 102.07646, at: SAMET_NGAM, far: true, source: '[local] map; 10 km SSW, pulled in'},
    {name: 'Fort Phairi Phinat (west headland)', lat: 12.47687, lon: 102.0575, at: WEST_FORT, far: true, source: '[local] map; 16.5 km SSW, pulled in'},
    {name: 'Tuek Daeng (east bank)', lat: 12.48131, lon: 102.06248, at: TUEK_DAENG, far: true, source: '[local] map; 15.9 km SSW, pulled in'},
  ],
};
