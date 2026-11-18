import type {Geo} from '../../engine/geo';
import {BRIDGE_N, FORTS, MERMAID, MUSEUM, OLD_STATION, PILLAR, TANG_KUAN} from './places';

// Pins from cloud's map (docs/briefs/songkhla_onep/songkhla_story_places.geojson); the city pillar is the origin, 100 m/unit,
// everything at true scale (no far place is drawn).
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 7.1965754, lon: 100.5909966, at: PILLAR, centre: true, source: 'OSM node 4695685892'},
    {name: 'National museum (the mansion)', lat: 7.2023972, lon: 100.5889444, at: MUSEUM, source: 'OSM node 1116453647'},
    {name: 'Old Songkhla station', lat: 7.2011051, lon: 100.5936683, at: OLD_STATION, source: 'OSM way 996676181'},
    {name: 'Khao Tang Kuan', lat: 7.2108027, lon: 100.5892319, at: TANG_KUAN, source: 'OSM node 2506660318'},
    {name: 'Golden mermaid', lat: 7.2154941, lon: 100.5958091, at: MERMAID, source: 'OSM node 2506674446'},
    {name: 'Singora fort no. 8', lat: 7.2219, lon: 100.57387, at: FORTS[0], source: 'OSM node 11212240052'},
    {name: 'Tinsulanonda bridge, north span', lat: 7.1902013, lon: 100.5477088, at: [(BRIDGE_N[0][0] + BRIDGE_N[1][0]) / 2, (BRIDGE_N[0][1] + BRIDGE_N[1][1]) / 2], source: 'OSM relation 12981420'},
    {name: 'Gulf of Thailand off Samila', lat: 7.2200, lon: 100.6100, at: [21.0, -25.9], water: true, source: 'OSM coastline 988051068 (sea side)'},
    {name: 'Songkhla lake off the old town', lat: 7.1950, lon: 100.5800, at: [-12.2, 1.7], water: true, source: 'OSM relation 1116319'},
  ],
};
