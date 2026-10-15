import type {Geo} from '../../engine/geo';
import {RIVER_Z, UBOSOT} from './Temple';

// The Tha Chin runs WNW-ESE past the temple, about 160 m NNE of the ubosot (bearing
// ~28 deg). The model's river is an east-west band north of the ubosot at compressed
// distance; the water point below is where that same bearing meets the band.
export const GEO: Geo = {
  points: [
    {name: 'Wat Rai Khing ubosot', lat: 13.7426, lon: 100.258577, at: UBOSOT, source: 'NGA GEOnet gazetteer'},
    {name: 'Tha Chin in front of the temple', lat: 13.743898, lon: 100.2593425, at: [16, RIVER_Z - 10], water: true, source: 'Google Maps, read by the owner'},
  ],
};
