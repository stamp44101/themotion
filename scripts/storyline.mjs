// The storyline standard (docs/storyline.md), as far as a script can test it. Run by
// check_story.mjs for every story built with `buildStory({standard: 1, ...})`.
//
// Each rule comes from a measured post (docs/experiments.md): Korat's moving, surprising hero
// cut the skip rate from ~52% to 32.9% while Lampang's standing one did not; every clip lost
// about half of its 3-s audience by 17 s, during beats with nothing moving; the owner rejected
// the finale-first cover and an ending that ran the counter through years with nothing on screen.

export const KINDS = new Set(['legend', 'build', 'fight', 'disaster', 'procession', 'arrive', 'trade', 'discover', 'grow', 'celebrate', 'today']);
const SPECTACLE = new Set(['fight', 'disaster', 'procession', 'celebrate']);
const W = 1080;
const H = 1920;
const S = {
  heroBox: {x0: 0.2, x1: 0.8, y0: 0.5, y1: 0.85}, // centred under the title
  heroShare: 0.7, // of 0-2 s
  callbackFrom: 0.4, // of the clip
  dangerZone: [3, 17],
  dangerShare: 0.7,
  deadAir: 4,
  firstBeat: 6.5, // s after the title
  spectacleBy: 12,
  beatLen: [4, 10],
  landing: 1, // s on today's year before the finale card
  endWindow: 12,
  bigJump: 20, // years
  cps: 12, // Thai base characters per second, sub + note
};

// Thai base characters: tone and vowel marks above/below the line do not take reading time
export const thaiChars = (s = '') => s.replace(/[ัิ-ฺ็-๎\s]/g, '').length;

export function storylineChecks({cfg, plan, actors, keys, projectAt, ctxAt, D, INTRO_END, FINALE_LEAD, err, warn}) {
  const s = (x) => `${+x.toFixed(2)}s`;
  const story = cfg.story;
  const finale = D - FINALE_LEAD;
  const step = 1 / 15;
  const inFrame = (a, t, m = 40) => {
    const p = a.at(t, ctxAt(t));
    if (!p) return null;
    const q = projectAt(keys, t, p);
    return q.x >= m && q.x <= W - m && q.y >= m && q.y <= H - m ? q : null;
  };

  // hook: a hero at frame 0, centred under the title
  const heroes = actors.filter((a) => a.role === 'hero');
  if (!heroes.length) err('storyline: no hero actor (role: "hero") standing at frame 0 -- the cover needs one standout thing (docs/storyline.md §3.1).');
  let bestHero = 0;
  for (const a of heroes) {
    const t0 = typeof a.during === 'string' ? Infinity : a.during[0];
    if (t0 > 0.05) err(`storyline: hero "${a.id}" starts at ${s(t0)}; it has to stand from frame 0 (the cover).`);
    let n = 0;
    let ok = 0;
    for (let t = 0; t <= 2; t += step) {
      n++;
      const q = inFrame(a, t);
      const b = S.heroBox;
      if (q && q.x >= b.x0 * W && q.x <= b.x1 * W && q.y >= b.y0 * H && q.y <= b.y1 * H) ok++;
    }
    bestHero = Math.max(bestHero, ok / n);
  }
  if (heroes.length && bestHero < S.heroShare)
    err(`storyline: the hero is centred under the title (x ${S.heroBox.x0 * 100}-${S.heroBox.x1 * 100}%, y ${S.heroBox.y0 * 100}-${S.heroBox.y1 * 100}%) only ${Math.round(bestHero * 100)}% of 0-2 s (need ${S.heroShare * 100}%). Aim the opening camera so the hero sits under the title.`);

  // the open loop: the hero comes back in the payoff
  const callbacks = actors.filter((a) => a.role === 'callback');
  if (!callbacks.length) err('storyline: no callback actor (role: "callback"): bring the hero back in the payoff so the cover\'s question is answered (§3.2).');
  for (const a of callbacks) {
    const t0 = typeof a.during === 'string' ? (story.beats?.[a.during]?.[0] ?? 0) : a.during[0];
    if (t0 < S.callbackFrom * D) err(`storyline: callback "${a.id}" starts at ${s(t0)}; the payoff comes at >= ${Math.round(S.callbackFrom * 100)}% of the clip (${s(S.callbackFrom * D)}).`);
  }

  // something moving on screen: the danger zone, and no dead air anywhere after the title
  const movers = actors.filter((a) => a.role !== 'hero');
  const moving = (t) => movers.some((a) => {
    const [a0, a1] = typeof a.during === 'string' ? (story.beats?.[a.during] ?? [0, -1]) : a.during;
    return t >= a0 - 0.5 && t <= a1 + 0.5 && inFrame(a, t);
  });
  {
    const [z0, z1] = S.dangerZone;
    let n = 0;
    let on = 0;
    for (let t = z0; t <= z1; t += step) {
      n++;
      if (moving(t)) on++;
    }
    if (on / n < S.dangerShare)
      err(`storyline: something moves on screen only ${Math.round((100 * on) / n)}% of ${z0}-${z1} s (need ${S.dangerShare * 100}%). Half the viewers left every clip in this window; give the first beats people and motion (§3.3).`);
  }
  {
    let run = 0;
    let worst = 0;
    let worstAt = 0;
    for (let t = INTRO_END; t <= finale; t += step) {
      if (moving(t)) run = 0;
      else {
        run += step;
        if (run > worst) {
          worst = run;
          worstAt = t;
        }
      }
    }
    if (worst > S.deadAir)
      err(`storyline: ${s(worst)} with nothing moving on screen, ending at ${s(worstAt)} (max ${S.deadAir} s). Register what moves or is being built as an actor, or give the stretch an event (§3.4).`);
  }

  // verbs: every beat has one, no two alike in a row
  const beats = plan ?? [];
  for (const b of beats) {
    if (!b.kind) err(`storyline: beat "${b.id}" has no kind (one of ${[...KINDS].join(', ')}).`);
    else if (!KINDS.has(b.kind)) err(`storyline: beat "${b.id}" has an unknown kind "${b.kind}".`);
  }
  for (let i = 1; i < beats.length; i++)
    if (beats[i].kind && beats[i].kind === beats[i - 1].kind && beats[i].kind !== 'today')
      err(`storyline: beats "${beats[i - 1].id}" and "${beats[i].id}" are both "${beats[i].kind}": one verb per beat, never the same twice in a row (§3.4).`);
  const kinds = new Set(beats.map((b) => b.kind).filter(Boolean));
  if (kinds.size < 4) warn(`storyline: only ${kinds.size} kinds of beat (${[...kinds].join(', ')}); aim for >= 4.`);
  const builds = beats.filter((b) => b.kind === 'build').length;
  if (builds > 2) warn(`storyline: ${builds} "build" beats; more than 2 reads as one beat told again.`);
  const spec = beats.find((b) => SPECTACLE.has(b.kind));
  if (!spec || spec.t[0] > S.spectacleBy) warn(`storyline: no fight / disaster / procession / celebrate beat starts by ${S.spectacleBy} s${spec ? ` (first: "${spec.id}" at ${s(spec.t[0])})` : ''}; put the clip's biggest event in the danger zone if the chronology allows (§3.3).`);
  const firstCap = beats.find((b) => b.captioned);
  if (firstCap && firstCap.t[1] - INTRO_END > S.firstBeat) warn(`storyline: the first beat "${firstCap.id}" runs ${s(firstCap.t[1] - INTRO_END)} after the title (max ${S.firstBeat} s).`);
  for (const b of beats.filter((x) => x.captioned)) {
    const len = b.t[1] - b.t[0];
    if (len < S.beatLen[0] || len > S.beatLen[1]) warn(`storyline: beat "${b.id}" runs ${s(len)} (aim for ${S.beatLen[0]}-${S.beatLen[1]} s).`);
  }

  // the landing: today's year on the counter before the finale card, no empty sprint to it
  const today = Math.round(story.yearAt(D));
  let held = 0;
  for (let t = finale - 3; t <= finale; t += step) if (Math.round(story.yearAt(t)) === today) held += step;
  if (held + 1e-6 < S.landing) err(`storyline: the counter shows today (${today + 543}) for ${s(held)} before the finale card (need ${S.landing} s): end on a short "today" beat (§3.5).`);
  let jumps = 0;
  for (let i = 1; i < beats.length; i++) {
    const a = beats[i - 1];
    const b = beats[i];
    if (b.t[0] >= finale - S.endWindow && b.years[0] - a.years[1] > S.bigJump) jumps++;
  }
  if (jumps > 1) warn(`storyline: ${jumps} jumps of more than ${S.bigJump} years in the last ${S.endWindow} s; the counter sprinting through empty years is what the owner called meaningless (§3.5).`);

  // the finale card says something
  const tag = story.finale?.sub ?? '';
  if (!/[ก-ฮ]/.test(tag)) err('storyline: finale.sub has no tagline (a line of identity or pride, not dates) (§3.5).');

  // captions can be read
  for (const c of story.captions) {
    const shown = c.t1 - Math.max(c.t0, INTRO_END);
    const cps = (thaiChars(c.sub) + thaiChars(c.note)) / shown;
    if (cps > S.cps) warn(`storyline: caption "${c.title}" asks for ${cps.toFixed(1)} Thai characters per second (max ${S.cps}); cut the sub or give it more time (§3.6).`);
  }

  if (D > 60) warn(`storyline: ${D} s; 60 s unless the extra time is action (§3.8).`);
}
