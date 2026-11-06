"""Chanthaburi soundtrack: a Thai central-plains palette for the east coast (the ranat's bright bars, the khlui's line,
the klong and the ching, a pad under them) under a small sound for everything that appears or moves: the lap's whine,
chips ticking and a glint chime per crust piece for the cover; the stones of the wall going up and the junks' oars;
pots cracking, the elephant's trumpet and the timber gate for 2310, the torches' crackle; sails and oars down to the
sea; laterite blocks set at Noen Wong and the forts' cannon laid; feet and hammers for the waterfront row; a bugle and
the flag rope for 2436 and 2447, the steamer's whistle; the cathedral's bells; the town and traffic in the grow shot;
the market's murmur, tweezers ticking and the gem's chime at the payoff. All code (no generated audio); kept under
~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/chanthaburi/timeline.ts out/timeline_chanthaburi.json
      python3 scripts/soundtrack_chanthaburi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_chanthaburi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_chanthaburi.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, build, smash, sail, move, ret, occ, leave, rais, grow, trade, today = (
    B("hero"), B("build"), B("smash"), B("sail"), B("move"), B("return"), B("occupy"), B("leave"), B("raise"), B("grow"),
    B("trade"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.75  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
CUT_END = 2.2

# ---------------------------------------------------------------- score (D major pentatonic, 96 bpm)
BEAT = 60 / 96
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]
D, G, A, Bm, Em = [50, 57, 62], [43, 50, 55], [45, 52, 57], [47, 54, 59], [52, 59, 64]

sections = (
    (0.0, build[0], [50, 57, 62, 66], 1.0),
    (build[0], smash[0], G, 0.9),
    (smash[0], sail[0], Bm, 0.95),
    (sail[0], move[0], D, 1.0),
    (move[0], ret[0], Em, 0.85),
    (ret[0], occ[0], G, 0.9),
    (occ[0], rais[0], Bm, 0.85),
    (rais[0], grow[0], D, 0.95),
    (grow[0], trade[0], A, 1.0),
    (trade[0], DUR, [50, 57, 62, 66, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.2 * lvl)


def ranat_run(t0, t1, amp, step=BEAT / 2, prob=0.8):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.7), "low", 2300), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def khlui_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.5:
        d = BEAT * rng.choice([1, 2, 2, 3])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(khlui(PENTA[i], d + 0.2), "low", 2200), t, pan=0.2, gain=amp)
        t += d


def klong(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0.7, 0, 0.5, 0.8, 0.4]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(140, 165), 85, 0.14, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 4 == 0:
            add(music, drum(66, 44, 0.5, 0.9), t, pan=0.1, gain=gain * 0.8)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.5)
        t += BEAT / 2
        k += 1


ranat_run(1.0, hero[1], 0.1, prob=0.6)
khlui_line(build[0], build[1], 0.08)
klong(smash[0] + 0.2, smash[1], 0.13)
ranat_run(sail[0], sail[1], 0.11, prob=0.75)
klong(sail[0], sail[1], 0.08)
khlui_line(move[0], move[1], 0.08)
ranat_run(ret[0], ret[1], 0.1, prob=0.6)
khlui_line(occ[0], leave[1], 0.07)
ranat_run(rais[0], rais[1], 0.09, prob=0.5)
ranat_run(grow[0], grow[1], 0.12, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
ranat_run(trade[0], DUR - 3.0, 0.12, prob=0.8)
khlui_line(trade[0], DUR - 3.0, 0.08)
klong(trade[0] + 0.2, DUR - 3.0, 0.12)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.9)
TT = np.arange(N) / SR
# the river by the town (from the build on), the sea at the mouth (sail and the forts), the town bed (grow on)
river_on = np.clip((TT - build[0]) / 2.0, 0, 1) * (1 - 0.6 * ((TT > sail[0]) & (TT < sail[1])))
add(amb, filt(pink(N), "band", (120, 600)) * river_on * 0.12, 0)
sea_on = np.clip(1 - np.abs(TT - at(sail, 0.75)) / 2.5, 0, 1)
add(amb, filt(pink(N), "band", (90, 500)) * (0.5 + 0.5 * np.sin(2 * np.pi * TT / 3.1)) * sea_on * 0.25, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 50, 0, 1) * 0.15, 0)
# night insects through the smash
n = int((smash[1] - smash[0]) * SR)
add(amb, filt(noise(n), "band", (1600, 2300)) * (0.5 + 0.5 * np.sin(2 * np.pi * 22 * np.arange(n) / SR)) * env_ar(n, 0.5, 1.0) * 0.03, smash[0])


# ---------------------------------------------------------------- the small sounds
def blip(f=None, gain=1.0):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f0 = f or rng.uniform(320, 620)
    tone = np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 9)) / SR) * np.exp(-t * 26)
    knock = filt(noise(n), "band", (600, 2200)) * np.exp(-t * 90) * 0.25
    return (tone + knock) * 0.55 * gain


def babble(dur, density=1.0):
    n = int(dur * SR)
    syl = np.zeros(n)
    k = 0
    while k < n:
        L = int(rng.uniform(0.08, 0.22) * SR)
        syl[k : k + L] = rng.uniform(0.3, 1.0) * np.hanning(min(L, n - k))
        k += L + int(rng.exponential(0.06 / density) * SR)
    v = filt(noise(n), "band", (250, 1100)) + 0.5 * filt(noise(n), "band", (1200, 2400))
    return v * filt(syl, "low", 30) * env_ar(n, 0.3, 0.5) * 0.6


def lap_whine(dur):
    """the cutting lap: a steady hum with the stone's grinding on it"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 118 * (1 + 0.01 * np.sin(2 * np.pi * 0.7 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    hum = np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.15 * np.sin(4 * ph)
    grind = filt(noise(n), "band", (700, 1800)) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t))
    return (filt(hum, "low", 900) * 0.25 + grind * 0.12) * env_ar(n, 0.02, 0.6)


def chime(f, gain=1.0):
    return filt(bell(f, 1.4, decay=2.6), "low", 2300) * 0.16 * gain


def tick(gain=1.0):
    n = int(0.05 * SR)
    return filt(noise(n), "band", (900, 2200)) * np.exp(-np.arange(n) / SR * 120) * 0.35 * gain


def thud(gain=1.0, f=90):
    return filt(drum(f, 48, 0.3, 0.8), "low", 900) * gain


def crack(gain=1.0):
    """a clay pot breaking: a knock and a spray of shards"""
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    knock = filt(noise(n), "band", (300, 1400)) * np.exp(-t * 40)
    shards = sum(np.roll(filt(noise(n), "band", (900, 2200)) * np.exp(-t * 70), int(rng.uniform(0.01, 0.12) * SR)) for _ in range(4)) * 0.3
    return (knock * 0.7 + shards) * gain


def oar(gain=1.0):
    return splash() * 0.3 * gain


def bugle(notes, gain=1.0):
    out = np.zeros(int((len(notes) * 0.32 + 0.6) * SR))
    for k, m in enumerate(notes):
        dur = 0.5 if k == len(notes) - 1 else 0.3
        n = int(dur * SR)
        t = np.arange(n) / SR
        ph = 2 * np.pi * mtof(m) * t
        x = (np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)) * env_ar(n, 0.02, 0.1)
        i = int(k * 0.32 * SR)
        out[i : i + n] += x
    return filt(out, "low", 1900) * 0.12 * gain


def rope(dur, gain=1.0):
    """the flag's halyard squeaking through the block"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(600 + 140 * np.sin(2 * np.pi * 3.3 * t)) / SR)
    return filt(s * (0.5 + 0.5 * np.sin(2 * np.pi * 3.3 * t)) ** 4, "low", 1800) * env_ar(n, 0.05, 0.2) * 0.06 * gain


def rise_tone(dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (50, 57, 62, 66, 69):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


# the cover: the lap whines from frame 0, chips tick, a glint chime per crust piece, the gem lifts with a swell
add(sfx, lap_whine(CUT_END + 0.5), 0.0, pan=-0.1, gain=1.0)
t = 0.04
while t < CUT_END + 0.1:
    add(sfx, tick(rng.uniform(0.5, 1.0)), t, pan=rng.uniform(-0.6, 0.6))
    t += rng.exponential(0.06)
for k in range(12):
    add(sfx, chime(rng.choice([880, 988, 1175, 1319]), 0.8), 0.1 + k * 0.18 + rng.uniform(0, 0.05), pan=rng.uniform(-0.5, 0.5))
add(sfx, rise_tone(2.2, 1.0), CUT_END - 0.2, pan=0.0)
for k, f in enumerate((1175, 1480, 1760)):
    add(sfx, chime(f, 1.2), CUT_END + 0.45 + 0.14 * k, pan=0.0)
add(sfx, filt(whoosh(1.4, 0.6), "low", 1600), 2.3, pan=-0.4, gain=0.5)  # the gem flies west
add(sfx, thud(0.6, 70), 3.6, pan=-0.4)  # it settles on the hill
for k in range(3):  # the glint ring pulses while it sits there
    add(sfx, chime((880, 1175, 988)[k], 0.9), 3.6 + 1.1 * k, pan=-0.4)
# the build: laterite blocks set one after another, the junks' oars and creaks
t = build[0] + 0.1
while t < at(build, 0.6):
    add(sfx, thud(0.5, rng.uniform(80, 120)), t, pan=rng.uniform(-0.5, 0.5))
    add(sfx, tick(0.4), t + 0.02, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.16, 0.26)
t = at(build, 0.2)
while t < build[1]:
    add(sfx, oar(0.9), t, pan=0.4)
    t += rng.uniform(0.4, 0.55)
for k in range(3):
    add(sfx, creak(0.6) * 0.5, at(build, 0.3 + 0.2 * k), pan=0.3)
for k in range(10):
    add(sfx, blip(rng.uniform(240, 360), 0.5), at(build, 0.4 + k * 0.05), pan=rng.uniform(-0.5, 0.5))
# 2310: torches, the pots cracking one after another, the elephant, the timber gate, the column pouring in
add(sfx, crackle(smash[1] - smash[0]), smash[0], pan=0.2, gain=0.28)
for i in range(12):
    add(sfx, crack(0.9), at(smash, 0.04 + i * 0.024), pan=-0.5 + i / 11)
add(sfx, filt(trumpet_elephant(1.4), "low", 2000), at(smash, 0.3), pan=0.3, gain=0.7)
t = at(smash, 0.3)
while t < at(smash, 0.46):
    add(sfx, thud(0.6, 60), t, pan=0.2)
    t += 0.3
add(sfx, filt(drum(70, 40, 0.8, 1.0), "low", 800), at(smash, 0.46), pan=0.0, gain=0.6)
add(sfx, creak(0.9) * 0.8, at(smash, 0.46), pan=0.0)
for k in range(5):
    add(sfx, thud(0.4, rng.uniform(100, 160)), at(smash, 0.47 + k * 0.012), pan=rng.uniform(-0.3, 0.3))
add(sfx, filt(trumpet_elephant(1.0), "low", 2000), at(smash, 0.5), pan=0.1, gain=0.5)
add(sfx, crowd(smash[1] - at(smash, 0.5)), at(smash, 0.5), pan=0.0, gain=0.3)
t = at(smash, 0.5)
while t < smash[1] - 0.2:
    add(sfx, footstep(0.6), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.18
# the fleet: sails filling, oars, creaking hulls, then the sea
for k in range(6):
    add(sfx, filt(whoosh(0.8, 0.5), "low", 1500), at(sail, 0.05 + k * 0.12), pan=rng.uniform(-0.5, 0.5), gain=0.35)
t = sail[0]
while t < sail[1] - 0.2:
    add(sfx, oar(1.0), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.28, 0.4)
for k in range(5):
    add(sfx, creak(0.7) * 0.5, at(sail, 0.1 + 0.18 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, gong(70, 3.0, 0.3), at(sail, 0.85), pan=0.0)
# 2377: the wall's blocks lifted, the column's feet, the blocks set at Noen Wong, the cannon laid at the mouth
t = move[0] + 0.1
while t < at(move, 0.9):
    add(sfx, footstep(0.55), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.22
t = at(move, 0.25)
while t < at(move, 0.85):
    add(sfx, thud(0.5, rng.uniform(80, 110)), t, pan=-0.3)
    t += rng.uniform(0.2, 0.32)
for k in range(3):
    add(sfx, filt(drum(55, 38, 0.6, 1.0), "low", 600), at(move, 0.5 + 0.12 * k), pan=0.4, gain=0.3)
add(sfx, filt(bell(523, 1.8, decay=2.4), "low", 2200), at(move, 0.75), pan=0.4, gain=0.08)  # the little church
# 2419: the people coming back, hammers on the waterfront row
t = at(ret, 0.45)
while t < ret[1]:
    add(sfx, oar(0.8), t, pan=0.3)
    t += rng.uniform(0.35, 0.5)
t = ret[0]
while t < at(ret, 0.5):
    add(sfx, footstep(0.55), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.22
t = at(ret, 0.35)
while t < ret[1] - 0.1:
    add(sfx, blip(rng.uniform(200, 300), 0.6), t, pan=rng.uniform(-0.5, 0.5))
    add(sfx, tick(0.6), t + 0.05, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.12, 0.2)
add(sfx, babble(ret[1] - at(ret, 0.5), 0.8), at(ret, 0.5), pan=-0.1, gain=0.25)
# 2436: a bugle, the boots, the flag rope; 2447: the flag down, the Siamese flag up, the steamer's whistle
add(sfx, bugle([67, 72, 76, 79, 76, 72]), occ[0] + 0.1, pan=-0.2)
t = occ[0] + 0.1
while t < at(occ, 0.75):
    add(sfx, footstep(0.6), t, pan=0.1)
    t += 0.2
add(sfx, rope(1.2), at(occ, 0.3), pan=0.3)
add(sfx, rope(1.0), at(leave, 0.08), pan=0.3)
add(sfx, rope(1.0), at(leave, 0.48), pan=0.3)
add(sfx, filt(steam_whistle(1.3), "low", 1500), at(leave, 0.5), pan=-0.3, gain=0.35)
t = leave[0] + 0.1
while t < at(leave, 0.55):
    add(sfx, footstep(0.5), t, pan=-0.1)
    t += 0.2
t = at(leave, 0.5)
while t < leave[1]:
    add(sfx, chuff(), t, pan=-0.3, gain=0.15)
    t += 0.3
# ราว 2452: the cathedral's walls, then its bells
for k in range(8):
    add(sfx, blip(rng.uniform(220, 320), 0.6), at(rais, 0.05 + k * 0.05), pan=rng.uniform(-0.5, 0.5))
add(sfx, rise_tone(2.0, 1.0), at(rais, 0.3), pan=0.0)
for k in range(6):
    add(sfx, filt(bell((392, 523, 440)[k % 3], 2.6, decay=1.8), "low", 2200), at(rais, 0.55 + 0.07 * k), pan=0.3, gain=0.12)
# the grow shot: a pop per block, traffic, the spires down and back up
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.4)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 1.5, 1.5) * 0.3, grow[0], pan=0.3)
add(sfx, filt(bell(392, 2.2, decay=2.0), "low", 2200), at(grow, 0.75), pan=0.3, gain=0.1)
# the payoff: the market's murmur, tweezers ticking, the gem's chime
add(sfx, crowd(today[1] - trade[0] + 0.5), trade[0], pan=0.2, gain=0.3)
add(sfx, babble(today[1] - trade[0], 1.0), trade[0] + 0.2, pan=0.3, gain=0.35)
t = trade[0]
while t < today[1]:
    add(sfx, tick(rng.uniform(0.3, 0.6)), t, pan=rng.uniform(-0.6, 0.6))
    t += rng.exponential(0.25)
add(sfx, rise_tone(2.0, 1.0), trade[0] + 0.2, pan=0.0)
for k, f in enumerate((1175, 1480, 1760, 2093)):
    add(sfx, chime(f, 1.1), at(trade, 0.08) + 0.15 * k, pan=0.0)
add(sfx, gong(74, 3.0, 0.35), at(trade, 0.92), pan=0.0)


# ---------------------------------------------------------------- the gaps between beats: a rising bridge into each
def bridge_gap(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [hero, build, smash, sail, move, ret, occ, leave, rais, grow, trade]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.3
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_chanthaburi.wav", music, amb, sfx)
print("wrote public/soundtrack_chanthaburi.wav", {"hero": round(hero[0], 2), "trade": round(trade[0], 2)})
