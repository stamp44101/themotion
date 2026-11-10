import type {Geo} from '../../engine/geo';
import {HALL, LANDING, MUSEUM, PARK, PILLAR, WAT_MAHATHAT, WAT_SING_THA} from './places';

// Pins from [local]'s map (docs/briefs/yasothon_onep/yasothon_story_places.geojson); the city pillar is the origin, 100
// m/unit, the town at true scale. The landing is [local]'s estimate from imagery; the hall is unverified (the government
// compound east of Chaeng Sanit), drawn 1.5 E of its pin to stand clear of the road.
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 15.79152, lon: 104.14332, at: PILLAR, centre: true, source: '[local] map (OSM way 1564102761)'},
    {name: 'Wat Sing Tha', lat: 15.79106, lon: 104.14245, at: WAT_SING_THA, source: '[local] map (OSM)'},
    {name: 'Wat Mahathat (Phra That Phra Anon)', lat: 15.79411, lon: 104.14228, at: WAT_MAHATHAT, source: '[local] map (OSM)'},
    {name: 'Old landing on the Chi', lat: 15.7898, lon: 104.1385, at: LANDING, source: '[local] estimate from imagery; drawn 0.4 E onto the bank'},
    {name: 'The Chi west of Wat Sing Tha', lat: 15.7905, lon: 104.1367, at: [-7.0, 1.0], water: true, source: 'OSM centreline, drawn 80 m W'},
    {name: 'Provincial hall (candidate)', lat: 15.802, lon: 104.1395, at: HALL, source: '[local] (unverified); drawn 2.2 E of the pin'},
    {name: 'Phaya Khankhak museum', lat: 15.79108, lon: 104.15504, at: MUSEUM, source: '[local] map (OSM)'},
    {name: 'Phaya Thaen park', lat: 15.78315, lon: 104.15308, at: PARK, source: '[local] map (OSM)'},
    {name: 'Phaya Thaen water', lat: 15.7890, lon: 104.1590, at: [15.4, 2.8], water: true, source: 'OSM water polygon'},
  ],
};
