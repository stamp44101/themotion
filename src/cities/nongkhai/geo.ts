import type {Geo} from '../../engine/geo';
import {BAN_PHAI, BRIDGE, NEW_STATION, OLD_STATION, PRAPHO, SALA_KAEW_KU, THAT, WAT_PHO_CHAI} from './places';

// Pins from cloud's map (docs/briefs/nongkhai_onep/nongkhai_story_places.geojson); the Prap Ho monument is the origin,
// 100 m/unit, everything at true scale (places.ts).
export const GEO: Geo = {
  points: [
    {name: 'Prap Ho monument (origin)', lat: 17.87962, lon: 102.74057, at: PRAPHO, centre: true, source: 'OSM node 13017978186'},
    {name: 'Tha Sadet market (Ban Phai)', lat: 17.8854, lon: 102.74751, at: BAN_PHAI, source: 'OSM way 1415105521'},
    {name: 'Wat Pho Chai', lat: 17.88453, lon: 102.7575, at: WAT_PHO_CHAI, source: 'OSM way 334828532'},
    {name: 'Phra That Lahanong (in the river)', lat: 17.9002, lon: 102.7655, at: THAT, water: true, source: 'OSM node 13288480852, moved ~200 m out into the river (news snippets)'},
    {name: 'Old station by the river', lat: 17.87946, lon: 102.72837, at: OLD_STATION, source: 'OSM way 40271689 (abandoned track end)'},
    {name: 'Nong Khai station (2545)', lat: 17.86442, lon: 102.73122, at: NEW_STATION, source: 'OSM way 32233676'},
    {name: 'Friendship Bridge, Thai end', lat: 17.87481, lon: 102.71599, at: BRIDGE[0], source: 'OSM way 78373187'},
    {name: 'Friendship Bridge, Lao end', lat: 17.88544, lon: 102.71428, at: BRIDGE[1], source: 'OSM way 1449697859'},
    {name: 'Sala Kaew Ku', lat: 17.88737, lon: 102.78254, at: SALA_KAEW_KU, source: 'OSM node 919885420'},
    {name: 'Mekong off Tha Sadet', lat: 17.8875, lon: 102.7445, at: [4.2, -8.7], water: true, source: 'Esri imagery'},
  ],
};
