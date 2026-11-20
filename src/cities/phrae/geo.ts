import type {Geo} from '../../engine/geo';
import {CHOHAE, DENCHAI, KHUM, PILLAR, THUNGHONG, WAT_LUANG, WONGBURI, YOM} from './places';

// Pins from cloud's map (docs/briefs/phrae_onep/phrae_story_places.geojson); the city pillar is the origin, 100 m/unit,
// the town at true scale, Cho Hae and Den Chai drawn closer (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 18.14318, lon: 100.1385, at: PILLAR, centre: true, source: 'OSM node 3961429157'},
    {name: 'Wat Luang', lat: 18.14514, lon: 100.13703, at: WAT_LUANG, source: 'OSM node 11410724034'},
    {name: 'Khum Chao Luang', lat: 18.14424, lon: 100.13873, at: KHUM, source: 'OSM way 433838558'},
    {name: 'Khum Wongburi', lat: 18.14341, lon: 100.13628, at: WONGBURI, source: 'OSM way 1418653926'},
    {name: 'Ban Thung Hong', lat: 18.16931, lon: 100.17165, at: THUNGHONG, source: 'OSM node 4242476619'},
    {name: 'Yom, north bend', lat: 18.1501, lon: 100.1398, at: YOM[11], water: true, source: 'OSM way 1304426787'},
    {name: 'Phra That Cho Hae', lat: 18.08624, lon: 100.20438, at: CHOHAE, far: true, source: 'OSM way 540201653'},
    {name: 'Den Chai station', lat: 17.98073, lon: 100.04635, at: DENCHAI, far: true, source: 'OSM way 895625052'},
  ],
};
