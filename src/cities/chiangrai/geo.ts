import type {Geo} from '../../engine/geo';
import {AIRFIELD, CHOM_THONG, GOLD_CLOCK, KLANG_WIANG, KOH_LOI, MONUMENT, NGAM_MUEANG, OLD_CLOCK, PHRA_KAEW, RONG_KHUN} from './places';

// Real anchors from docs/briefs/chiangrai_field.md §2 (OSM objects, pass 3, issue #54).
// True scale: 80 m/unit, origin 19.910348, 99.830185 (the ONEP core centroid).
export const GEO: Geo = {
  points: [
    {name: 'Wat Klang Wiang', lat: 19.910743, lon: 99.832357, at: KLANG_WIANG, centre: true, source: 'OSM way 256549545'},
    {name: 'Doi Chom Thong', lat: 19.915725, lon: 99.822768, at: CHOM_THONG, source: 'OSM node 2622028410'},
    {name: 'Doi Ngam Mueang', lat: 19.912669, lon: 99.825093, at: NGAM_MUEANG, source: 'OSM way 963882459'},
    {name: 'Wat Phra Kaew', lat: 19.911662, lon: 99.827016, at: PHRA_KAEW, source: 'OSM way 487642776'},
    {name: 'Gold clock tower', lat: 19.907163, lon: 99.830989, at: GOLD_CLOCK, source: 'OSM way 487637817'},
    {name: 'Old clock tower', lat: 19.910257, lon: 99.830604, at: OLD_CLOCK, source: 'OSM node 5384728145'},
    {name: 'King Mangrai monument', lat: 19.910446, lon: 99.840104, at: MONUMENT, source: 'OSM node 2622028552'},
    {name: 'Ko Loi park', lat: 19.918371, lon: 99.83766, at: KOH_LOI, source: 'OSM way 543872967'},
    {name: 'Old Chiang Rai airfield', lat: 19.889691, lon: 99.827621, at: AIRFIELD, source: 'OSM node 411928350'},
    // 12.16 km south-west: pulled onto the tile by direction
    {name: 'Wat Rong Khun', lat: 19.823983, lon: 99.762866, at: RONG_KHUN, far: true, source: 'OSM way 204897611'},
    {name: 'Kok river, north of the town', lat: 19.91811, lon: 99.832433, at: [2.9, -10.7], water: true, source: 'OSM way 40191691'},
  ],
};
