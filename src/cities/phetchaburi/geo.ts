import type {Geo} from '../../engine/geo';
import {BAN_PUEN, KAMPHAENG_LAENG, MAHATHAT, PEAK_E, PEAK_M, PEAK_W, STATION, WAT_YAI} from './places';

// Real anchors from docs/briefs/phetchaburi.md §5a (Google Maps pins, OSM for the river).
// True scale: 80 m/unit, origin 13.10398, 99.95308 (the centre of the traced wall).
export const GEO: Geo = {
  points: [
    {name: 'Wat Kamphaeng Laeng', lat: 13.1055759, lon: 99.9558739, at: KAMPHAENG_LAENG, centre: true, source: 'Google Maps'},
    {name: 'Wat Mahathat Worawihan', lat: 13.1054562, lon: 99.947223, at: MAHATHAT, source: 'Google Maps'},
    {name: 'Wat Yai Suwannaram', lat: 13.1090569, lon: 99.9533429, at: WAT_YAI, source: 'Google Maps'},
    {name: 'Phra Nakhon Khiri, west peak (palace)', lat: 13.1092418, lon: 99.936603, at: PEAK_W, source: 'Google Maps'},
    {name: 'Phra That Chom Phet, middle peak', lat: 13.1076347, lon: 99.9383112, at: PEAK_M, source: 'Google Maps'},
    {name: 'Wat Phra Kaeo Noi, east peak', lat: 13.1078438, lon: 99.9394913, at: PEAK_E, source: 'Google Maps'},
    {name: 'Phra Ram Ratchaniwet (Ban Puen)', lat: 13.09497, lon: 99.9473744, at: BAN_PUEN, source: 'Google Maps'},
    {name: 'Phetchaburi station', lat: 13.116271, lon: 99.941152, at: STATION, source: 'Google Maps'},
    // the open Gulf, 19 km SE (GEBCO -6 m): pulled onto the tile by direction, so an east-west
    // flip of the coast (Chonburi's mistake) fails the check
    {name: 'Gulf of Thailand, open water', lat: 13.00756, lon: 100.09549, at: [44.5, 30.7], far: true, water: true, source: 'issue #51, GEBCO 2020'},
    {name: 'Phetchaburi river, south', lat: 13.09571, lon: 99.94868, at: [-5.95, 11.4], water: true, source: 'OSM way 120451772'},
  ],
};
