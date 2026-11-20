import type {Geo} from '../../engine/geo';
import {FAIR, KRADUENG, LOEI, PHON_CHAI, STUPA} from './places';

// Pins from cloud's map (docs/briefs/loei_onep/loei_story_places.geojson); Wat Phon Chai is the origin, 100 m/unit, Dan
// Sai at true scale, Loei town and Phu Kradueng drawn closer (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'Wat Phon Chai (origin)', lat: 17.27452, lon: 101.14908, at: PHON_CHAI, centre: true, source: 'OSM node 4319746818'},
    {name: 'Phra That Si Song Rak', lat: 17.27001, lon: 101.14069, at: STUPA, source: 'OSM way 667841411'},
    {name: 'Phi Ta Khon festival ground', lat: 17.27999, lon: 101.14637, at: FAIR, source: 'OSM node 13197811002'},
    {name: 'The Man north of Wat Phon Chai', lat: 17.27685, lon: 101.14902, at: [0.06, -2.52], water: true, source: 'OSM way 310614163'},
    {name: 'Loei city pillar', lat: 17.4866, lon: 101.72886, at: LOEI, far: true, source: 'OSM way 1427324009'},
    {name: 'Phu Kradueng', lat: 16.8885, lon: 101.76167, at: KRADUENG, far: true, source: 'OSM relation 6011589'},
  ],
};
