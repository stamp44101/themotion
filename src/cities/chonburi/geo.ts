import type {Geo} from '../../engine/geo';
import {BANG_SAEN, KHAO_SAM_MUK, WAT_YAI} from './Landmarks';

// Real anchors for the posted Chonburi film. The check reports that the model puts the
// Gulf east of the town; it is west (Chonburi is on the east shore of the Bight of Bangkok).
// The sea point sits on the model's water band (index.ts SEA_X = 29).
// Posted, so it only warns; a revised Chonburi should move the sea west.
export const GEO: Geo = {
  points: [
    {name: 'Bang Pla Soi (Wat Yai)', lat: 13.3697, lon: 100.9834, at: WAT_YAI, source: 'Wikipedia, Bang Pla Soi subdistrict point'},
    {name: 'Khao Sam Muk', lat: 13.31278, lon: 100.90472, at: KHAO_SAM_MUK, source: 'Wikipedia, Khao Sam Muk'},
    {name: 'Bang Saen Beach', lat: 13.291, lon: 100.909, at: BANG_SAEN, source: 'Wikipedia, Bang Saen Beach'},
    {name: 'Gulf off Ang Sila', lat: 13.33, lon: 100.87, at: [29, 5], water: true, source: 'open water 3.5 km west of Khao Sam Muk'},
  ],
};
