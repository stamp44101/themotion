import type {Geo} from '../../engine/geo';
import {BAN_PRASAT, MONUMENT, PHIMAI, RUNWAY, SEMA, THUNG_SAMRIT} from './Landmarks';

// Real anchors for Korat. Points marked TODO still need a coordinate read off Google Maps
// (right-click the place, copy the numbers); until then `npm run check` fails this city.
export const GEO: Geo = {
  points: [
    {name: 'Prasat Hin Phimai', lat: 15.2208, lon: 102.4939, at: PHIMAI, source: 'Wikipedia, Phimai Historical Park'},
    {name: 'Wing 1 air base', lat: 14.9306, lon: 102.0808, at: RUNWAY, source: 'Wikipedia, Korat RTAFB'},
    // TODO {name: 'Thao Suranari Monument', lat: ?, lon: ?, at: MONUMENT, source: 'Google Maps'},
    // TODO {name: 'Nakhon Ratchasima station', lat: ?, lon: ?, at: [-24, -21.6], source: 'Google Maps'},
    // TODO {name: 'Lam Takhong north of the old town', lat: ?, lon: ?, at: [0, -13], water: true, source: 'Google Maps'},
    // TODO {name: 'Thung Samrit monument', lat: ?, lon: ?, at: THUNG_SAMRIT, source: 'Google Maps'},
    // TODO {name: 'Ban Prasat archaeological site', lat: ?, lon: ?, at: BAN_PRASAT, source: 'Google Maps'},
    // TODO verify: forum post gives 14.917, 101.794 for the reclining Buddha temple
    // {name: 'Wat Thammachak Semaram (Sema reclining Buddha)', lat: ?, lon: ?, at: SEMA, source: 'Google Maps'},
  ],
};
void [MONUMENT, SEMA, THUNG_SAMRIT, BAN_PRASAT];
