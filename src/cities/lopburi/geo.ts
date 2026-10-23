import type {Geo} from '../../engine/geo';
import {PALACE, PRANG, PRANG_KHAEK, PRATU_CHAI, SAN_PAOLO, SAN_PHRA_KAN, STATION, THALE_CHUP_SON_TRUE, VICHAYEN, WAT_MAHATHAT} from './places';

// OSM positions from the workstation's check (docs/briefs/lopburi_onep/README.md, PR #67).
export const GEO: Geo = {
  points: [
    {name: 'ONEP old-town centroid', lat: 14.800683, lon: 100.612775, at: [0, 0], centre: true, source: 'ONEP oldtown_all.shp record 48'},
    {name: 'Phra Prang Sam Yot', lat: 14.802923, lon: 100.614076, at: PRANG, source: 'OSM way 1011171287'},
    {name: 'San Phra Kan', lat: 14.802278, lon: 100.615034, at: SAN_PHRA_KAN, source: 'OSM way 1128114911'},
    {name: 'Prang Khaek', lat: 14.802289, lon: 100.611711, at: PRANG_KHAEK, source: 'OSM node 2066042913'},
    {name: 'Wat Phra Si Rattana Mahathat', lat: 14.798644, lon: 100.613946, at: WAT_MAHATHAT, source: 'OSM way 196252384'},
    {name: 'Phra Narai Ratchaniwet', lat: 14.799839, lon: 100.610796, at: [(PALACE.x0 + PALACE.x1) / 2, (PALACE.z0 + PALACE.z1) / 2], source: 'OSM way 40634521'},
    {name: 'Ban Wichayen', lat: 14.80305, lon: 100.610215, at: VICHAYEN, source: 'OSM way 40632293'},
    {name: 'Wat San Paolo', lat: 14.795017, lon: 100.619584, at: SAN_PAOLO, source: 'OSM node 6773612485'},
    {name: 'Pratu Chai', lat: 14.7952, lon: 100.6143, at: PRATU_CHAI, source: 'OSM way 1539990211'},
    {name: 'Lopburi station', lat: 14.798571, lon: 100.615253, at: STATION, source: 'OSM way 881081030'},
    {name: 'Lopburi River at the palace', lat: 14.79978, lon: 100.6079, at: [-13.9, 2.3], water: true, source: 'OSM way 986386580'},
    {name: 'Phra Thinang Yen (Thale Chup Son)', lat: 14.8121, lon: 100.645, at: THALE_CHUP_SON_TRUE, far: true, source: 'research §4.2'},
  ],
};
