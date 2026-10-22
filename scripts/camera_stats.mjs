// What the drone camera spends its time doing, computed from a city's camera keys.
// Used by check_story.mjs. Each frame is classified by its dominant motion:
//   zoom    |d ln(distance)/dt|               (pushing in / pulling out)
//   orbit   |d azimuth/dt| * cos(elevation)   (circling, which gives the 3D its depth)
//   travel  |d target| / distance per second  (gliding across the map)
//   tilt    |d elevation/dt|
//   hold    every motion under 0.05/s         (time to read a caption)
// Nakhon Sawan's first cut was 75% zoom, 5% orbit and never pulled back to a
// wide shot between 7 s and 56 s; the owner's verdict was "it just zooms in and out".
export const cameraStats = (keys, duration, makeCurve) => {
  const C = [1, 2, 3, 4, 5, 6, 7].map((i) => makeCurve(keys.map((k) => [k[0], k[i]])));
  const at = (t) => C.map((f) => f(t));
  const dt = 1 / 30;
  const share = {zoom: 0, orbit: 0, travel: 0, tilt: 0, hold: 0};
  let azSwept = 0;
  for (let t = 0; t < duration - dt; t += dt) {
    const a = at(t);
    const b = at(t + dt);
    const z = Math.abs(Math.log(b[3] / a[3])) / dt;
    const o = (((Math.abs(b[4] - a[4]) * Math.PI) / 180) * Math.cos((a[5] * Math.PI) / 180)) / dt;
    const tr = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / a[3] / dt;
    const ti = (Math.abs(b[5] - a[5]) * Math.PI) / 180 / dt;
    azSwept += Math.abs(b[4] - a[4]);
    const m = Math.max(z, o, tr, ti);
    share[m < 0.05 ? 'hold' : m === z ? 'zoom' : m === o ? 'orbit' : m === tr ? 'travel' : 'tilt'] += dt / duration;
  }
  // jerk: how abruptly the camera's speed changes. Speed is the view direction's swing plus
  // log-zoom plus the target sliding across the frame, all in deg/s; a spike in its change per
  // second is a cut-like lurch. The owner felt Phuket's first moves "กระชาก" at 600-3,300;
  // with smoothstep glides (timeline.ts glide()) they came to 332.
  const D2R = Math.PI / 180;
  const unit = (c) => [Math.cos(c[5] * D2R) * Math.sin(c[4] * D2R), Math.sin(c[5] * D2R), Math.cos(c[5] * D2R) * Math.cos(c[4] * D2R)];
  const speedAt = (t) => {
    const a = at(t), b = at(t + dt);
    const ua = unit(a), ub = unit(b);
    const ang = Math.acos(Math.min(1, ua[0] * ub[0] + ua[1] * ub[1] + ua[2] * ub[2])) / D2R / dt;
    const zoom = (Math.abs(Math.log(b[3] / a[3])) / dt) / D2R;
    const slide = (Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / a[3] / dt) / D2R;
    return ang + zoom + slide;
  };
  let jerk = 0, jerkAt = 0, prev = speedAt(0);
  for (let t = dt; t < duration - 2 * dt; t += dt) {
    const v = speedAt(t);
    const j = Math.abs(v - prev) / dt;
    if (j > jerk) { jerk = j; jerkAt = t; }
    prev = v;
  }
  // widest framing in the middle of the story (intro and finale excluded)
  let midWide = 0;
  for (let t = 15; t <= duration - 8; t += 0.25) midWide = Math.max(midWide, at(t)[3]);
  return {share, azSwept, midWide, jerk, jerkAt};
};
