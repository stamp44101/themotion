// Real positions (docs/briefs/lampang.md §5a, Google Maps / OSM) via scripts/geo.mjs.
// World origin = the centre of the approximate เขลางค์ wall oval, 18.29838, 99.50423;
// 80 m/unit, +x east, -z north. Pure data so actors.ts, timeline.ts and geo.ts share it.
export const WAT_PHRA_KAEW: [number, number] = [5.4, -3.6]; // วัดพระแก้วดอนเต้าสุชาดาราม
export const PRATU_MA: [number, number] = [3.7, -5.1]; // street pin 3.6,-4.9 moved onto the wall line
export const BRIDGE: [number, number] = [-4.6, 7.1]; // สะพานรัษฎาภิเศก
export const STATION: [number, number] = [-41.3, 25.7]; // สถานีรถไฟนครลำปาง
export const WAT_SI_CHUM: [number, number] = [-5.9, 19.3];
export const BAN_SAO_NAK: [number, number] = [5.0, 5.9];
export const KAD_KONG_TA: [number, number] = [-6.4, 9.4];
export const CLOCK_TOWER: [number, number] = [-17.6, 13.1];
export const CENTRAL: [number, number] = [-12.7, 22.8];
// far places, pulled onto the tile by direction (geo.ts marks them `far`)
export const LAMPANG_LUANG: [number, number] = [-32, 40]; // 15.5 km SW (real -151.8, 112.1)
export const MAE_MOH: [number, number] = [41, -6]; // 25 km E (real 311.3, -5.1)
export const KHUN_TAN: [number, number] = [-40, -38]; // ดอยขุนตาล, 1,304 m, WNW
// a factory quarter for the ชามตราไก่ kilns: position in town is illustrative, not a pin
export const KILNS: [number, number] = [9, 17];

// แม่น้ำวัง through the city: OSM way 234994042 (11.8,-6.4 / 11.6,3.4 / -17.0,8.3 /
// -35.6,10.9), the bridge, and a bend south of บ้านเสานัก (on the north bank, 204 m from
// the river); extended to the tile edges along the same headings.
export const WANG: [number, number][] = [
  [52, -40],
  [36, -27.5],
  [21, -14.5],
  [11.8, -6.4],
  [11.6, 3.4],
  [5, 8.5],
  BRIDGE,
  [-17, 8.3],
  [-35.6, 10.9],
  [-53, 15.5],
];
// distance along WANG to the bridge (a path river's bridge `at`)
export const BRIDGE_AT = WANG.slice(0, WANG.indexOf(BRIDGE) + 1).reduce(
  (s, p, i, a) => (i ? s + Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) : 0),
  0,
);

// เขลางค์ wall: APPROXIMATE. Secondary sources give ~600 rai, ~4,400 m round, earth with
// timber, oval, on the north bank. Not traced: an ellipse 1,440 x 576 m (a 9, b 3.6 units),
// its long axis along the river (ENE), placed so ประตูม้า sits on its north side and
// วัดพระแก้วดอนเต้า inside. Replace with a trace off satellite when someone has one.
const A = 9;
const B = 3.6;
const DIR: [number, number] = [0.89, -0.455];
export const WALL: [number, number][] = Array.from({length: 20}, (_, i) => {
  const th = (i / 20) * Math.PI * 2;
  const u = A * Math.cos(th);
  const v = B * Math.sin(th);
  return [+(u * DIR[0] - v * DIR[1]).toFixed(2), +(u * DIR[1] + v * DIR[0]).toFixed(2)] as [number, number];
});
