// Geometry regression checks for curved/polyline rivers. These stay separate
// from a city so the shared engine is verified before Ayutthaya depends on it.
import assert from 'node:assert/strict';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {buildSync} from 'esbuild';
import './node_guard.mjs';

const out = path.resolve('out/.check_river_paths_bundle.mjs');
buildSync({
  entryPoints: ['src/engine/roads.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  packages: 'external',
  outfile: out,
  logLevel: 'error',
});
const roads = await import(pathToFileURL(out).href + '?' + Date.now());
const riverOut = path.resolve('out/.check_river_geometry_bundle.mjs');
buildSync({
  entryPoints: ['src/engine/river.ts'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  packages: 'external',
  outfile: riverOut,
  logLevel: 'error',
});
const river = await import(pathToFileURL(riverOut).href + '?' + Date.now());

const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-5, `${message}: ${actual} != ${expected}`);
const base = {
  tile: {x0: -20, x1: 20, z0: -20, z1: 20},
  bridges: [],
  roads: [],
  ringRoadYear: 9999,
  cars: [9999, 9999],
};

const pathRiver = {path: [[-10, 0], [0, 0], [0, 10]], width: 2};
const layout = {...base, rivers: [pathRiver]};
near(river.riverLength(layout, pathRiver), 20, 'path length');
const turn = river.riverPointAt(layout, pathRiver, 15);
near(turn.x, 0, 'point x');
near(turn.z, 5, 'point z');
near(turn.angle, Math.PI / 2, 'point tangent');
assert.equal(river.inRiver(layout, pathRiver, -5, 0.9), true, 'point within path width');
assert.equal(river.inRiver(layout, pathRiver, -5, 1.1), false, 'point beyond path width');
assert.equal(roads.overWater(layout, 0.8, 5), true, 'overWater follows the bend');

const road = {a: [-5, -5], b: [-5, 5], width: 1.2, k: 1};
const crossing = roads.roadCrossings(layout, road);
assert.equal(crossing.length, 1, 'road crosses curved river once');
near(crossing[0].x, -5, 'crossing x');
near(crossing[0].z, 0, 'crossing z');
near(crossing[0].len, 3.4, 'perpendicular bridge length');

const bridged = {...layout, bridges: [{river: 0, at: 5, year: 1900, modernYear: 1900}]};
assert.equal(roads.roadCrossings(bridged, road).length, 0, 'explicit path bridge suppresses generated deck');
const deck = roads.decks(bridged, 1910)[0];
near(deck.x, -5, 'path bridge x');
near(deck.z, 0, 'path bridge z');

const dry = river.subtractPathRivers(layout, road.a, road.b);
assert.equal(dry.length, 2, 'wall is split around curved water');
assert.ok(dry[0][1][1] < 0 && dry[1][0][1] > 0, 'wall gap straddles river centreline');

const axisRiver = {axis: 'z', pos: 0, width: 2, span: [-10, 10]};
const legacy = {...base, rivers: [axisRiver]};
const oldCrossing = roads.roadCrossings(legacy, {a: [-5, 0], b: [5, 0], width: 1.2, k: 1});
assert.equal(oldCrossing.length, 1, 'legacy axis river still crosses once');
near(oldCrossing[0].x, 0, 'legacy crossing x');
near(oldCrossing[0].z, 0, 'legacy crossing z');
near(oldCrossing[0].len, 3.4, 'legacy bridge length');

console.log('river paths ok');
