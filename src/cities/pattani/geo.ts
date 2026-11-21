import type {Geo} from '../../engine/geo';
import {CENTRAL_MOSQUE, CHABANG_TIGA, DECHA_BRIDGE, HALL, KRUESE, MOUTH, PILLAR, PSU, SHRINE, TOMB} from './places';

// Pins from cloud's map (docs/briefs/pattani_onep/pattani_story_places.geojson); the city pillar is the origin, 125 m/unit,
// everything at true scale (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 6.86878, lon: 101.25252, at: PILLAR, centre: true, source: 'OSM way 1337146202'},
    {name: 'Dechanuchit bridge', lat: 6.86595, lon: 101.25214, at: DECHA_BRIDGE, source: 'OSM way 1508045127'},
    {name: 'Provincial hall', lat: 6.86767, lon: 101.24998, at: HALL, source: 'OSM relation 18320468'},
    {name: 'Lim Ko Niao shrine', lat: 6.87154, lon: 101.2582, at: SHRINE, source: 'OSM way 1337111627'},
    {name: 'Central Mosque', lat: 6.86211, lon: 101.25507, at: CENTRAL_MOSQUE, source: 'OSM way 1337106151'},
    {name: 'Chabang Tiga palace', lat: 6.85592, lon: 101.2485, at: CHABANG_TIGA, source: 'nominatim'},
    {name: 'PSU Pattani', lat: 6.88151, lon: 101.23608, at: PSU, source: 'OSM way 475509862'},
    {name: 'Krue Se mosque', lat: 6.87295, lon: 101.30305, at: KRUESE, source: 'OSM node 14231572759'},
    {name: 'Lim Ko Niao tomb', lat: 6.87321, lon: 101.3021, at: TOMB, source: 'OSM node 8231022818'},
    {name: 'Mid Pattani bay', lat: 6.915, lon: 101.27, at: [15.5, -40.9], water: true, source: 'Esri imagery'},
    {name: 'River mouth', lat: 6.9041, lon: 101.2442, at: MOUTH, source: 'OSM way 37273146 meets the coastline'},
  ],
};
