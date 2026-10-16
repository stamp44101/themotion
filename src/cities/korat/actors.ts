// Pure position math for Korat's armies (src/engine/actors.ts): Vientiane troops march in
// from the north-east across the 'anouvong' beat and fall back to Thung Samrit over the
// first third of 'yamo'; Korat townsfolk gather in the city late in 'anouvong' and push
// them out. Landmarks.tsx draws from this; check_story projects it through the camera.
import type {Actor, ActorCtx} from '../../engine/actors';
import type {Formation} from '../../engine/army';
import {lerp, ramp, smooth} from '../../lib';
import {THUNG_SAMRIT} from './Landmarks';

export const war = (t: number, {beat}: ActorCtx) => {
  const anouvong = beat('anouvong');
  const yamo = beat('yamo');
  const inn = smooth(ramp(anouvong, 0, 0.25));
  const out = smooth(ramp(yamo, 0, 0.3));
  // both armies end inside the Thung Samrit clearing, either side of the callout point
  const laoAt: [number, number] = [lerp(lerp(40, 4, inn), THUNG_SAMRIT[0] + 3, out), lerp(lerp(-44, -4, inn), THUNG_SAMRIT[1] - 2, out)];
  const koratAt: [number, number] = [lerp(-6, THUNG_SAMRIT[0] - 2.5, out), lerp(2, THUNG_SAMRIT[1] + 1.5, out)];
  const laoOn = anouvong > 0 && yamo < 1;
  const koratOn = anouvong >= 0.6 && yamo < 1;
  // each army faces the other once both are out; before that the Lao army faces the town
  const lao: Formation = laoOn ? {at: laoAt, face: koratOn ? koratAt : [0, 0]} : null;
  const korat: Formation = koratOn ? {at: koratAt, face: laoAt} : null;
  return {lao, korat};
};

export const ACTORS: Actor[] = [
  {
    id: 'laoArmy',
    during: [27.4, 33.6],
    size: 3,
    at: (t, ctx) => {
      const f = war(t, ctx).lao;
      return f ? [f.at[0], 0.5, f.at[1]] : null;
    },
  },
  {
    id: 'koratArmy',
    during: [29.3, 33.6],
    size: 3,
    at: (t, ctx) => {
      const f = war(t, ctx).korat;
      return f ? [f.at[0], 0.5, f.at[1]] : null;
    },
  },
];
