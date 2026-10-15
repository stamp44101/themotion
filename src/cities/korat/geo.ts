import type {Geo} from '../../engine/geo';
import {BAN_PRASAT, MONUMENT, PHIMAI, RUNWAY, SEMA, THUNG_SAMRIT} from './Landmarks';

// Real anchors for Korat, read off Google Maps.
export const GEO: Geo = {
  points: [
    {name: 'Prasat Hin Phimai', lat: 15.2208, lon: 102.4939, at: PHIMAI, source: 'Wikipedia, Phimai Historical Park'},
    {name: 'Wing 1 air base', lat: 14.9306, lon: 102.0808, at: RUNWAY, source: 'Wikipedia, Korat RTAFB'},
    {name: 'Thao Suranari Monument', lat: 14.9747, lon: 102.0981, at: MONUMENT, source: 'Google Maps'},
    {name: 'Nakhon Ratchasima station', lat: 14.9725, lon: 102.0789, at: [-24, -21.6], source: 'Google Maps'},
    {name: 'Lam Takhong north of the old town', lat: 14.9807, lon: 102.1115, at: [0, -13], water: true, source: 'Google Maps'},
    {name: 'Thung Samrit monument', lat: 15.2113, lon: 102.3847, at: THUNG_SAMRIT, source: 'Google Maps'},
    {name: 'Ban Prasat archaeological site', lat: 15.2456, lon: 102.3710, at: BAN_PRASAT, source: 'Google Maps'},
    {name: 'Wat Thammachak Semaram (Sema reclining Buddha)', lat: 14.9167, lon: 101.7937, at: SEMA, source: 'Google Maps'},
  ],
};
void [MONUMENT, SEMA, THUNG_SAMRIT, BAN_PRASAT];
