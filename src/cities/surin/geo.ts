import type {Geo} from '../../engine/geo';
import {LAK_MUEANG, MONUMENT, MUEANG_THI_TRUE, OLD_HALL, STADIUM, STATION, WAT_BURAPHARAM, WAT_KLANG, WAT_SALA_LOI} from './places';

// OSM positions from the workstation's check (docs/briefs/surin_onep/README.md, PR #69).
export const GEO: Geo = {
  points: [
    {name: 'Inner moat centre', lat: 14.88457, lon: 103.489456, at: [0, 0], centre: true, source: 'hull of the six moat ponds (README)'},
    {name: 'San Lak Mueang', lat: 14.884593, lon: 103.489222, at: LAK_MUEANG, source: 'OSM way 1415663836'},
    {name: 'Old provincial hall', lat: 14.882233, lon: 103.492161, at: OLD_HALL, source: 'OSM way 483171858'},
    {name: 'Phraya Surin Phakdi monument', lat: 14.87837, lon: 103.489605, at: MONUMENT, source: 'OSM node 6410547185'},
    {name: 'Surin station', lat: 14.891592, lon: 103.493997, at: STATION, source: 'OSM node 3107829713 (drawn 1 unit south, off the line)'},
    {name: 'Si Narong stadium (elephant show)', lat: 14.874945, lon: 103.49713, at: STADIUM, source: 'OSM relation 18650315'},
    {name: 'Wat Burapharam', lat: 14.884386, lon: 103.493151, at: WAT_BURAPHARAM, source: 'OSM node 4759247929'},
    {name: 'Wat Klang Surin', lat: 14.884542, lon: 103.491197, at: WAT_KLANG, source: 'OSM way 1413605082'},
    {name: 'Wat Sala Loi', lat: 14.882077, lon: 103.496141, at: WAT_SALA_LOI, source: 'OSM node 4759247928'},
    {name: 'South moat lake (Suan Rak)', lat: 14.87907, lon: 103.49154, at: [5.6, 15.2], water: true, source: 'OSM way 293500774'},
    {name: 'Ban Mueang Thi', lat: 14.8884, lon: 103.6518, at: MUEANG_THI_TRUE, far: true, source: 'research §4.3'},
  ],
};
