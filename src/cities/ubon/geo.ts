import type {Geo} from '../../engine/geo';
import {AIRFIELD, DON_MOT_DAENG, PILLAR, THA_BO, WARIN_STATION, WAT_LUANG, WAT_SI_UBON, WAT_THUNG} from './places';

// Pins from the Gemini research (docs/briefs/ubon_research_gemini.md §4), converted with
// scripts/geo.mjs, checked on OSM by the workstation (PR #63). ผาแต้ม and โขงเจียม are named in a
// caption but not drawn, so they carry no pin here.
export const GEO: Geo = {
  points: [
    {name: 'Thung Si Mueang (centre)', lat: 15.230222, lon: 104.857306, at: [0, 0], centre: true, source: 'Wikipedia 15°13′48.8″N 104°51′26.3″E'},
    {name: 'Ubon city pillar shrine', lat: 15.228581, lon: 104.857683, at: PILLAR, source: 'm-culture; OSM way 739078963'},
    {name: 'Wat Thung Si Mueang', lat: 15.23, lon: 104.860833, at: WAT_THUNG, source: 'm-culture'},
    {name: 'Wat Si Ubon Rattanaram', lat: 15.227569, lon: 104.856192, at: WAT_SI_UBON, source: 'm-culture'},
    {name: 'Wat Luang', lat: 15.225346, lon: 104.860424, at: WAT_LUANG, source: 'DOPA / m-culture'},
    {name: 'Mun River at Seri Prachathipatai bridge', lat: 15.2227, lon: 104.8573, at: [0, 10.4], water: true, source: 'Wikipedia 15°13′22″N 104°51′26″E'},
    {name: 'Ubon Ratchathani station (Warin)', lat: 15.2005, lon: 104.8587, at: WARIN_STATION, source: 'Wikipedia 15°12′02″N 104°51′31″E'},
    {name: 'Ubon air base / airport', lat: 15.251278, lon: 104.870231, at: AIRFIELD, source: 'Wikipedia'},
    {name: 'Ban Tha Bo (Huai Chae Ramae)', lat: 15.255142, lon: 104.823857, at: THA_BO, source: 'DOPA (Wat Ban Tha Bo), pulled in x0.75'},
    {name: 'Don Mot Daeng island', lat: 15.2904, lon: 105.0524, at: DON_MOT_DAENG, far: true, source: 'lovethailand; Esri imagery (workstation, PR #63)'},
  ],
};
