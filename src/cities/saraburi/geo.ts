import type {Geo} from '../../engine/geo';
import {ADISORN, CEMENT, FOOT, NEW_HALL, OLD_HALL, PILLAR, SAMUHA, SAO_HAI_MKT, STATION, TON_TAN, WAT_PAK_PHRIAO, WAT_SUNG} from './places';

// Pins from [local]'s check of every story place on Google Maps (docs/briefs/saraburi_onep/
// saraburi_story_places.geojson, PR #80, commit 8620269); the pillar is the origin.
export const GEO: Geo = {
  points: [
    {name: 'City pillar shrine (origin)', lat: 14.5289281, lon: 100.9089886, at: PILLAR, centre: true, source: 'OSM node 5589680721'},
    {name: 'Old provincial hall', lat: 14.5281393, lon: 100.9098098, at: OLD_HALL, source: 'Google ([local])'},
    {name: 'Wat Pak Phriao', lat: 14.53057, lon: 100.9156276, at: WAT_PAK_PHRIAO, source: 'Google ([local])'},
    {name: 'Saraburi station', lat: 14.52744, lon: 100.916518, at: STATION, source: 'Google ([local]); OSM node 5394772572; drawn south of the track (places.ts)'},
    {name: 'Adisorn camp', lat: 14.519645, lon: 100.9255838, at: ADISORN, source: 'Google ([local])'},
    {name: 'New provincial hall, Takut', lat: 14.5363519, lon: 100.9339204, at: NEW_HALL, source: 'Google ([local])'},
    {name: 'Ban Ton Tan (Thai Yuan)', lat: 14.5529136, lon: 100.8796151, at: TON_TAN, source: 'Google ([local])'},
    {name: 'Wat Samuha Pradittharam', lat: 14.5544784, lon: 100.8580795, at: SAMUHA, source: 'Google ([local])'},
    {name: 'Wat Sung (the weeping pillar)', lat: 14.547727, lon: 100.8477525, at: WAT_SUNG, source: 'Google ([local])'},
    {name: 'Sao Hai 100-year market', lat: 14.55111, lon: 100.84494, at: SAO_HAI_MKT, source: 'Google ([local]), drawn 170 m back from the water'},
    {name: 'Pa Sak at Saphan Amnuai Songkhram', lat: 14.53074, lon: 100.91218, at: [3.4, -2.0], water: true, source: 'Google ([local])'},
    {name: 'Pa Sak at Ban Ton Tan', lat: 14.5503, lon: 100.8786, at: [-32.9, -23.5], water: true, source: 'OSM way 40268412 ([local])'},
    {name: 'Wat Phra Phutthabat (the Footprint)', lat: 14.718375, lon: 100.788596, at: FOOT, far: true, source: 'Google ([local]); 24.6 km NNW, drawn on the tile NW'},
    {name: 'Kaeng Khoi - Thap Kwang cement hills', lat: 14.6393992, lon: 101.0369652, at: CEMENT, far: true, source: 'Google ([local]); 18.4 km NE, drawn on the tile NE'},
  ],
};
