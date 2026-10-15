// Lat/lon -> world (x, z) for placing landmarks. North = -z, east = +x.
// Usage: node scripts/geo.mjs <originLat> <originLon> <metresPerUnit> <lat,lon> [<lat,lon> ...]
//   cities use 80 m/unit, landmark reels 2 m/unit.
const [lat0, lon0, mpu, ...pts] = process.argv.slice(2);
if (!pts.length) {
  console.log('usage: node scripts/geo.mjs <originLat> <originLon> <metresPerUnit> <lat,lon> ...');
  process.exit(2);
}
const R = Math.PI / 180;
for (const p of pts) {
  const [lat, lon] = p.split(',').map(Number);
  const c = Math.cos(((lat + +lat0) / 2) * R);
  const x = ((lon - lon0) * 111320 * c) / mpu;
  const z = (-(lat - lat0) * 110574) / mpu;
  console.log(`${p}  ->  [${x.toFixed(1)}, ${z.toFixed(1)}]`);
}
