import type {Geo} from '../../engine/geo';
import {CHEDI, HO_PHRA_ISUAN, HO_PHRA_NARAI, NORTH_GATE, PHUTTHASIHING} from './Landmarks';

// Real anchors from docs/briefs/nakhonsi.md §5a (Google Maps pins, UNESCO for the chedi).
// The town is at true scale (80 m/unit, origin 8.41680, 99.96438); Khao Luang (26 km WNW)
// and the Gulf (13 km E) are pulled onto the tile edges by direction (`far`).
export const GEO: Geo = {
  points: [
    {name: 'Phra Borommathat Chedi', lat: 8.41148, lon: 99.96622, at: CHEDI, centre: true, source: 'UNESCO 1761'},
    {name: 'North gate / old city wall', lat: 8.42763, lon: 99.96358, at: NORTH_GATE, source: 'Google Maps'},
    {name: 'Ho Phra Isuan', lat: 8.42418, lon: 99.9637, at: HO_PHRA_ISUAN, source: 'Google Maps'},
    {name: 'Ho Phra Narai', lat: 8.4243, lon: 99.96427, at: HO_PHRA_NARAI, source: 'Google Maps + OSM'},
    {name: 'Ho Phra Phutthasihing', lat: 8.4191, lon: 99.96363, at: PHUTTHASIHING, source: 'Google Maps'},
    {name: 'Nakhon Si Thammarat station', lat: 8.43954, lon: 99.95986, at: [-8.9, -31.4], source: 'Google Maps'},
    {name: 'Tha Wang market (Tha Sak)', lat: 8.4409, lon: 99.96684, at: [3.4, -33.3], source: 'Google Maps'},
    {name: 'Central Nakhon Si', lat: 8.38234, lon: 99.9696, at: [7.2, 47.6], source: 'Google Maps'},
    {name: 'Khlong Na Mueang by the north wall', lat: 8.42807, lon: 99.96378, at: [-0.9, -15.6], water: true, source: 'OSM way 145173593'},
    {name: 'Khao Luang summit', lat: 8.49417, lon: 99.73, at: [-44, -4], far: true, source: 'Google Maps'},
    {name: 'Gulf of Thailand', lat: 8.45, lon: 100.12, at: [44, -8], far: true, water: true, source: 'satellite'},
  ],
};
