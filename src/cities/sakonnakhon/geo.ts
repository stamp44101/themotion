import type {Geo} from '../../engine/geo';
import {AIRPORT, CITY_GATE, DON_SAWAN, HALL, KHOM_BRIDGE, NARAI, PILLAR, SRA_PHANG, STUPA, THA_RAE, THAT_DUM, PALACE} from './places';

// Pins from [local]'s map (docs/briefs/sakonnakhon_onep/sakonnakhon_story_places.geojson, PR #84); the stupa is the
// origin, 100 m/unit. The lake's places are drawn 0.55x about the town's shore (places.ts): their bearings hold.
export const GEO: Geo = {
  points: [
    {name: 'Phra That Choeng Chum (origin)', lat: 17.1646, lon: 104.1533, at: STUPA, centre: true, source: '[local] map; OSM 19 m off'},
    {name: 'Sra Phang Thong (Khmer baray)', lat: 17.1665, lon: 104.1565, at: SRA_PHANG, source: '[local] map'},
    {name: 'Khom bridge (laterite, 11 openings)', lat: 17.1695, lon: 104.1422, at: KHOM_BRIDGE, source: 'Gemini §4; [local] map'},
    {name: 'City gate (Lan Ruam Jai Thai Sakon)', lat: 17.1692, lon: 104.1425, at: CITY_GATE, source: '[local] map'},
    {name: 'City pillar', lat: 17.1592, lon: 104.1518, at: PILLAR, source: 'Gemini §4'},
    {name: 'Provincial hall (2507 / 2541)', lat: 17.1671, lon: 104.1458, at: HALL, source: 'Gemini §4'},
    {name: 'Phra That Dum', lat: 17.1439, lon: 104.1642, at: THAT_DUM, source: '[local] map; drawn 160 m W, off the coarse shore'},
    {name: 'Sakon Nakhon airport', lat: 17.1951, lon: 104.1186, at: AIRPORT, source: '[local] map; OSM 89 m off'},
    {name: 'Ko Don Sawan (in Nong Han)', lat: 17.1877, lon: 104.1915, at: DON_SAWAN, water: true, source: '[local] map; drawn 0.55x toward the shore'},
    {name: 'Ban Tha Rae (north shore)', lat: 17.2552, lon: 104.1905, at: THA_RAE, far: true, source: '[local] map; 10.8 km NNE, drawn 0.55x'},
    {name: 'Phra That Narai Cheng Weng', lat: 17.1871, lon: 104.0958, at: NARAI, far: true, source: '[local] map; 6.6 km WNW, drawn at the tile edge'},
    {name: 'Phu Phan palace (2518)', lat: 17.098, lon: 104.086, at: PALACE, far: true, source: '[local] map; 10.3 km SW'},
  ],
};
