import type {Geo} from '../../engine/geo';
import {PILLAR, STRIP, TOWER, WAT_BUENG, WAT_BURAPHA, WAT_KLANG, WAT_NUEA, WAT_SA_THONG} from './places';

// Pins from cloud's map (docs/briefs/roiet_onep/roiet_story_places.geojson); the city pillar is the origin, 100 m/unit,
// everything at true scale (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 16.0567477, lon: 103.6525301, at: PILLAR, centre: true, source: 'OSM way 1444501158'},
    {name: 'Bueng Phlan Chai', lat: 16.0578218, lon: 103.6525809, at: [0.2, -1.2], water: true, source: 'OSM relation 2222833 (nominatim centre; the model point is on the water east of the island)'},
    {name: 'Hor Wot 101', lat: 16.0546478, lon: 103.6524378, at: TOWER, source: 'OSM node 11496203069'},
    {name: 'Wat Bueng Phra Lan Chai', lat: 16.0560908, lon: 103.6492109, at: WAT_BUENG, source: 'OSM way 358474620'},
    {name: 'Wat Klang Ming Mueang', lat: 16.0617203, lon: 103.6544369, at: WAT_KLANG, source: 'OSM way 358469909'},
    {name: 'Wat Sa Thong', lat: 16.0634389, lon: 103.6497349, at: WAT_SA_THONG, source: 'OSM way 358486279'},
    {name: 'Wat Nuea', lat: 16.0612, lon: 103.6458, at: WAT_NUEA, source: 'OSM node 4741206410'},
    {name: 'Phra Sung Yai, Wat Burapha', lat: 16.06219, lon: 103.65849, at: WAT_BURAPHA, source: 'OSM node 3633967718'},
    {name: 'Old airstrip, south end', lat: 16.06629, lon: 103.64689, at: STRIP[0], source: 'OSM runway 17/35'},
  ],
};
