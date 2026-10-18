import type {Geo} from '../../engine/geo';
import {BAN_SAO_NAK, BRIDGE, CENTRAL, CLOCK_TOWER, KAD_KONG_TA, KHUN_TAN, LAMPANG_LUANG, MAE_MOH, STATION, WAT_PHRA_KAEW, WAT_SI_CHUM} from './places';

// Real anchors from docs/briefs/lampang.md §5a (Google Maps pins, OSM for the river).
// The town is at true scale (80 m/unit, origin 18.29838, 99.50423); Lampang Luang (15.5 km SW),
// Mae Moh (25 km E) and Doi Khun Tan (WNW) are pulled onto the tile by direction (`far`).
export const GEO: Geo = {
  points: [
    {name: 'Wat Phra Kaew Don Tao', lat: 18.30096, lon: 99.50828, at: WAT_PHRA_KAEW, centre: true, source: 'Google Maps'},
    {name: 'Ratsadaphisek bridge', lat: 18.29325, lon: 99.50076, at: BRIDGE, source: 'Google Maps'},
    {name: 'Nakhon Lampang station', lat: 18.27979, lon: 99.47295, at: STATION, source: 'Google Maps'},
    {name: 'Wat Si Chum', lat: 18.2844, lon: 99.49973, at: WAT_SI_CHUM, source: 'Google Maps'},
    {name: 'Baan Sao Nak', lat: 18.2941, lon: 99.50805, at: BAN_SAO_NAK, source: 'Google Maps'},
    {name: 'Kad Kong Ta', lat: 18.29161, lon: 99.49941, at: KAD_KONG_TA, source: 'Google Maps'},
    {name: 'Clock tower', lat: 18.28888, lon: 99.4909, at: CLOCK_TOWER, source: 'Google Maps'},
    {name: 'Central Lampang', lat: 18.28185, lon: 99.49458, at: CENTRAL, source: 'Google Maps'},
    {name: 'Wang river', lat: 18.29594, lon: 99.513, at: [11.6, 3.4], water: true, source: 'OSM way 234994042'},
    {name: 'Wat Phra That Lampang Luang', lat: 18.21731, lon: 99.38935, at: LAMPANG_LUANG, far: true, source: 'Google Maps'},
    {name: 'Mae Moh mine', lat: 18.30204, lon: 99.73989, at: MAE_MOH, far: true, source: 'Google Maps'},
    {name: 'Doi Khun Tan', lat: 18.49569, lon: 99.27109, at: KHUN_TAN, far: true, source: 'Google Maps (park pin)'},
  ],
};
