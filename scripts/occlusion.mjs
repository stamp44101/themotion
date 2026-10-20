// Is the thing a callout points at actually visible, or hidden behind trees?
// For each callout, the line from the drone camera to the callout's point is
// tested against every tree crown standing in that year (same sizes as the
// engine's Trees: a 0.75-radius crown at 1.15 x scale). Returns the share of the
// callout's screen time the subject is blocked.
//
// Nakhon Sawan: the camera looked at the Thepharak shrine from 36 units away at
// 20 degrees elevation across a forested old town, and the owner saw only trees.
export const makeOcclusion = ({layout, story}, {getWorld, droneCamera}) => {
  const w = getWorld(layout);
  const cam = droneCamera(layout.cameraKeys);
  const crownsAt = (Y) => {
    const out = [];
    for (const tr of w.trees) {
      let k = Y < tr.clear ? 1 : 1 - Math.min(1, Math.max(0, (Y - tr.clear) / 2));
      if (tr.regrow && Y > tr.regrow[0]) {
        const g = Math.min(1, Math.max(0, (Y - tr.regrow[0]) / 50));
        const d = Math.min(1, Math.max(0, (Y - tr.regrow[1]) / 4));
        k = Math.max(k, g * (1 - d));
      }
      k *= tr.s;
      if (k > 0.02) out.push([tr.x, tr.y + 1.15 * k, tr.z, 0.75 * k]);
    }
    return out;
  };
  const blocked = (a, b, crowns) => {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const len2 = d[0] ** 2 + d[1] ** 2 + d[2] ** 2;
    for (const [x, y, z, r] of crowns) {
      // ignore crowns that sit on the subject itself
      if ((x - b[0]) ** 2 + (z - b[2]) ** 2 < 0.5 ** 2) continue;
      const u = Math.max(0, Math.min(1, ((x - a[0]) * d[0] + (y - a[1]) * d[1] + (z - a[2]) * d[2]) / len2));
      if (u > 0.98) continue;
      const px = a[0] + u * d[0] - x;
      const py = a[1] + u * d[1] - y;
      const pz = a[2] + u * d[2] - z;
      if (px * px + py * py + pz * pz < r * r) return true;
    }
    return false;
  };
  // Phetchaburi: the royal procession climbed Khao Wang's south-east flank while the palace
  // shot looked from the north, so the hill hid it for the whole beat; trees were never the
  // problem. Does the ground rise above the camera's line of sight on the way to p?
  const hill = (a, p) => {
    const b = [p[0], Math.max(p[1], w.terrainH(p[0], p[2]) + 0.5), p[2]];
    for (let i = 1; i < 64; i++) {
      const u = i / 64;
      const x = a[0] + u * (b[0] - a[0]);
      const z = a[2] + u * (b[2] - a[2]);
      // the subject's own patch of slope does not hide it
      if ((x - b[0]) ** 2 + (z - b[2]) ** 2 < 1) continue;
      if (w.terrainH(x, z) > a[1] + u * (b[1] - a[1]) + 0.2) return true;
    }
    return false;
  };
  return {
    /** is the line from the camera to p blocked by a standing tree at second t */
    hidden: (p, t) => blocked(cam(t).pos, p, crownsAt(story.yearAt(t))),
    /** is p on the far side of a hill from the camera at second t */
    behindHill: (p, t) => hill(cam(t).pos, p),
    standing: (p) => p[1] - w.terrainH(p[0], p[2]) >= 0.8,
  };
};

export const occlusion = (cfg, engine) => {
  const o = makeOcclusion(cfg, engine);
  return cfg.callouts.map((c) => {
    // Ground features (a moat, a road, a hillside) are meant to be seen through
    // and between trees; only standing subjects -- buildings, monuments -- count.
    if (!o.standing(c.p)) return {label: c.label, t0: c.t0, blocked: 0, ground: true};
    let n = 0;
    let hit = 0;
    for (let t = c.t0 + 0.3; t <= c.t1 - 0.3; t += 0.25) {
      n++;
      if (o.hidden(c.p, t)) hit++;
    }
    return {label: c.label, t0: c.t0, blocked: n ? hit / n : 0};
  });
};
