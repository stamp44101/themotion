import type {Geo} from '../../engine/geo';
import {AIRPORT, BATTLE, BIG_BUDDHA, CHARTERED, CHINPRACHA, HEROINES, JUI_TUI, KATHU, MAI_KHAO, PHRA_NANG_SANG, SAPHAN_HIN, SARASIN} from './places';

// Real anchors from docs/briefs/phuket_field.md §1 (OSM objects, the Thai-connection pass, #58).
// True scale: 80 m/unit, origin 7.878381, 98.392508 (the ONEP core centroid). Places beyond ~4 km
// are `far`, pulled in along their real bearing.
export const GEO: Geo = {
  points: [
    {name: 'Chartered Bank corner', lat: 7.883662, lon: 98.390734, at: CHARTERED, centre: true, source: 'OSM node 5060965586'},
    {name: 'Chinpracha House', lat: 7.8858, lon: 98.3839, at: CHINPRACHA, source: 'OSM node 6253270085'},
    {name: 'Jui Tui shrine', lat: 7.88325, lon: 98.38351, at: JUI_TUI, source: 'OSM node 12270302073'},
    {name: 'Saphan Hin circle', lat: 7.868334, lon: 98.396108, at: SAPHAN_HIN, source: 'OSM node 11020595696'},
    {name: 'Kathu shrine', lat: 7.91642, lon: 98.34508, at: KATHU, far: true, source: 'OSM way 570817600'},
    {name: 'Heroines monument', lat: 7.980988, lon: 98.363953, at: HEROINES, far: true, source: 'OSM node 2420388160'},
    {name: 'Thung Thalang Chana Suek monument', lat: 8.027727, lon: 98.320698, at: BATTLE, far: true, source: 'OSM node 7541339263'},
    {name: 'Wat Phra Nang Sang', lat: 8.026635, lon: 98.332533, at: PHRA_NANG_SANG, far: true, source: 'OSM node 4575295522'},
    {name: 'Mai Khao beach (south end)', lat: 8.1136, lon: 98.302421, at: MAI_KHAO, far: true, source: 'OSM node 4144223791'},
    {name: 'Phuket airport runway', lat: 8.11333, lon: 98.31694, at: AIRPORT, far: true, source: 'OSM way 23484036'},
    {name: 'Sarasin bridge', lat: 8.201518, lon: 98.298032, at: SARASIN, far: true, source: 'OSM way 965075211'},
    {name: 'Big Buddha', lat: 7.8275, lon: 98.31361, at: BIG_BUDDHA, far: true, source: 'OSM node 11794956978'},
    {name: 'Andaman, west of Mai Khao', lat: 8.11, lon: 98.21, at: [-35, -39], water: true, source: 'phuket_field.md §1 (open sea, 4 km clear)'},
    {name: 'Phuket Bay', lat: 7.86, lon: 98.46, at: [28, 10], water: true, source: 'phuket_field.md §1 (open water inside the bay)'},
  ],
};
