import type {Geo} from '../../engine/geo';
import {RIVER_Z, UBOSOT} from './Temple';

// The model puts the Tha Chin north of the ubosot (one travel guide says the image
// faces north to the river). That side is NOT verified yet: the water point below
// must come from a map (Google Maps: right-click the river in front of the temple,
// copy the coordinates). Until it is filled in, `npm run check` fails this reel.
export const GEO: Geo = {
  points: [
    {name: 'Wat Rai Khing ubosot', lat: 13.7426, lon: 100.258577, at: UBOSOT, source: 'NGA GEOnet gazetteer'},
    // {name: 'Tha Chin in front of the temple', lat: ?, lon: ?, at: [UBOSOT[0], RIVER_Z - 10], water: true, source: 'Google Maps'},
  ],
};
void RIVER_Z;
