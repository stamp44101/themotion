// Eased camera moves for a city's timeline.ts.
// Camera keys [t, tx, ty, tz, dist, az, el, fov].
export type CameraKey = [number, number, number, number, number, number, number, number];
type Key = CameraKey;
// Shared from Phuket on; check_story fails a move whose speed changes by more than JERK_MAX.
// A camera move from key a to key b that eases in and out: the keys in between follow a
// smootherstep, the distance changes on a log scale (a zoom reads even), so the drone speeds up
// and settles instead of whipping between two keys and stopping dead. The owner felt the early
// cuts jerk ("กระชากนิดๆ"): the cover-to-ship move peaked at 116 deg/s and dropped to 8 within
// 0.3 s. Returns the keys after a, up to and including b.
// `lift` raises the drone mid-move (distance x (1 + lift) at the halfway point), so a long
// crossing goes over the island instead of skimming the canopy.
export const glide = (a: Key, b: Key, n = 6, lift = 0): Key[] =>
  Array.from({length: n}, (_, k) => {
    const u = (k + 1) / n;
    const e = u * u * u * (u * (u * 6 - 15) + 10);
    const up = 1 + lift * Math.sin(Math.PI * u) ** 2;
    return a.map((x, i) => (i === 0 ? x + (b[0] - a[0]) * u : i === 4 ? x * (b[4] / x) ** e * up : x + (b[i] - x) * e)) as Key;
  });
// both ends of every move between beats
export const between = (a: Key, b: Key, n = 6, lift = 0) => glide(a, b, n, lift).slice(0, -1);
