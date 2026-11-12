import type {Geo} from '../../engine/geo';
import {BANG_KUNG, DON_HOI_LOT, FORT, HALL, LANDING, MOUTH, PILLAR, RAMA2_BRIDGE, STATION, WAT_PHET} from './places';

// Pins from cloud's map (docs/briefs/samutsongkhram_onep/samutsongkhram_story_places.geojson); the city pillar is the
// origin, 100 m/unit, the town at true scale, the far reaches drawn closer (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 13.41204, lon: 100.00271, at: PILLAR, centre: true, source: 'OSM way 829998820'},
    {name: 'Mae Klong station', lat: 13.40749, lon: 99.99843, at: STATION, source: 'OSM node 1085870067'},
    {name: 'Wat Phet Samut Worawihan', lat: 13.4092, lon: 99.9987, at: WAT_PHET, source: 'en/th.wiki, matches imagery'},
    {name: 'Landing in front of Wat Phet', lat: 13.4089, lon: 99.9975, at: LANDING, source: 'estimate from imagery; drawn on the bank'},
    {name: 'Phikhat Khasuek fort site (hospital)', lat: 13.40618, lon: 99.99784, at: FORT, source: 'OSM way 377405321'},
    {name: 'Provincial hall', lat: 13.41304, lon: 100.00164, at: HALL, source: 'OSM way 604642021'},
    {name: 'Mae Klong west of the town', lat: 13.4110, lon: 99.9963, at: [-6.6, 1.2], water: true, source: 'OSM centreline'},
    {name: 'Rama II bridge', lat: 13.3836, lon: 99.9835, at: RAMA2_BRIDGE, far: true, source: 'OSM way 40233518'},
    {name: 'Mae Klong mouth', lat: 13.368, lon: 99.999, at: MOUTH, far: true, water: true, source: 'estimate from imagery'},
    {name: 'Don Hoi Lot', lat: 13.3625, lon: 100.0226, at: DON_HOI_LOT, far: true, source: 'OSM node 1197465106'},
    {name: 'Wat Bang Kung', lat: 13.44612, lon: 99.94114, at: BANG_KUNG, far: true, source: 'OSM way 1372919704'},
  ],
};
