"""Phayao soundtrack: a Lanna palette (the sueng's plucked lines, a salo-like bowed reed, wooden bars, the klong and
ching, gongs) under a small sound for everything that appears or moves: bricks laid and stucco troweled on the cover's
Buddha and a bell as the gold goes on; feet, a temple bell and a chant as the people circle it; war drums far off, carts
and feet as the town is left; carts, voices and posts as the settlers come back; adzes, logs and a gong as the vihara
goes up; the gate's winches and clanks, then the water rushing over the marsh; the parade's drums and the crowd; the
town's pops and traffic; Paet Peng's crowd, bells and boats on the lake. All code (no generated audio); kept under
~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/phayao/timeline.ts out/timeline_phayao.json
      python3 scripts/soundtrack_phayao.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_phayao.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_phayao.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, paetpeng, abandon, refound, vihara, lake, province, grow, payoff, today = (
    B("hero"), B("paetpeng"), B("abandon"), B("refound"), B("vihara"), B("lake"), B("province"), B("grow"), B("payoff"),
    B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.6  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the cover's fronts (src/cities/phayao/actors.ts buildFronts)
BRICK_END, STUCCO_END, GOLD0, GOLD_END = 1.7, 2.5, 2.3, 3.4

# ---------------------------------------------------------------- score (G pentatonic, a slow Lanna sueng-and-salo feel, 92 bpm)
BEAT = 60 / 92
PENTA = [55, 57, 59, 62, 64, 67, 69, 71, 74]
G, Em, C, D, Am = [43, 50, 55, 59], [40, 47, 52, 55], [48, 55, 60, 64], [50, 57, 62, 66], [45, 52, 57, 60]
sections = (
    (0.0, paetpeng[0], G, 1.0),
    (paetpeng[0], abandon[0], G, 1.0),
    (abandon[0], refound[0], Em, 0.9),
    (refound[0], vihara[0], C, 1.0),
    (vihara[0], lake[0], G, 1.0),
    (lake[0], province[0], Am, 0.95),
    (province[0], grow[0], D, 1.0),
    (grow[0], payoff[0], C, 1.0),
    (payoff[0], DUR, [43, 50, 55, 59, 62], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1500), t0, gain=0.11 * lvl)
    add(music, filt(pad(notes[:2], t1 - t0 + 0.6, bright=900), "low", 1200), t0, gain=0.06 * lvl)


def wood_line(t0, t1, amp, step=BEAT / 2, prob=0.8):
    """wooden bars: running pentatonic"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.5), "low", 2200), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def sueng_line(t0, t1, amp):
    """the sueng: a plucked lute line"""
    t = t0
    i = 3
    while t < t1 - 0.3:
        d = BEAT * rng.choice([0.5, 0.5, 1])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(pluck(PENTA[i] - 12, 1.2, bright=0.8), "low", 2100), t, pan=0.25, gain=amp)
        t += d


def salo_line(t0, t1, amp):
    """the salo: a bowed fiddle's long held notes (a reed with vibrato, kept dark)"""
    t = t0
    i = 4
    while t < t1 - 0.6:
        d = BEAT * rng.choice([2, 2, 3])
        i = int(np.clip(i + rng.choice([-1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(pi_reed(PENTA[i], min(d, t1 - t) + 0.2, vib=5.0), "low", 1800), t, pan=-0.25, gain=amp)
        t += d


def klong(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0, 0.8, 0.4, 0.6, 0]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(100, 120), 56, 0.24, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.45)
        t += BEAT / 2
        k += 1


sueng_line(0.4, hero[1], 0.07)
sueng_line(paetpeng[0], paetpeng[1], 0.07)
salo_line(paetpeng[0] + 0.5, paetpeng[1], 0.035)
salo_line(abandon[0], abandon[1], 0.04)
sueng_line(refound[0], refound[1], 0.07)
klong(refound[0] + 1.0, refound[1], 0.06)
wood_line(vihara[0], vihara[1], 0.08, prob=0.6)
salo_line(lake[0], lake[1], 0.04)
sueng_line(lake[0] + 0.5, lake[1], 0.05)
klong(province[0], province[1], 0.12)
wood_line(province[0] + 0.5, province[1], 0.06, prob=0.5)
wood_line(grow[0], grow[1], 0.11, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
wood_line(payoff[0], DUR - 3.0, 0.11, prob=0.8)
sueng_line(payoff[0], DUR - 3.0, 0.06)
salo_line(payoff[0] + 0.4, DUR - 3.0, 0.035)
klong(payoff[0] + 0.2, DUR - 3.0, 0.09)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(1.0)
TT = np.arange(N) / SR
# the marsh's wind before the gate; the lake lapping after it; the town bed from the 1960s
wind_on = 1 - np.clip((TT - lake[0]) / 2.0, 0, 1)
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * wind_on * 0.09, 0)
lap_on = np.clip((TT - at(lake, 0.3)) / 1.5, 0, 1)
add(amb, filt(pink(N), "band", (150, 700)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.4 * TT)) * lap_on * 0.08, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1960) / 60, 0, 1) * 0.15, 0)


def frogs(dur, gain=1.0):
    """frogs in the paddy ditches: soft low croaks"""
    n = int(dur * SR)
    out = np.zeros(n)
    k = 0
    while k < n - int(0.2 * SR):
        L = int(0.12 * SR)
        t = np.arange(L) / SR
        f = rng.uniform(260, 420)
        out[k : k + L] += np.sin(2 * np.pi * f * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 28 * t))) * env_ar(L, 0.01, 0.08) * 0.05
        k += int(rng.uniform(0.15, 0.6) * SR)
    return filt(out, "low", 1600) * gain




# ---------------------------------------------------------------- the small sounds
def blip(f=None, gain=1.0):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f0 = f or rng.uniform(320, 620)
    tone = np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 9)) / SR) * np.exp(-t * 26)
    knock_ = filt(noise(n), "band", (600, 2200)) * np.exp(-t * 90) * 0.25
    return (tone + knock_) * 0.55 * gain


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


def tick(gain=1.0):
    n = int(0.05 * SR)
    return filt(noise(n), "band", (900, 2200)) * np.exp(-np.arange(n) / SR * 120) * 0.35 * gain


def thud(gain=1.0, f=90):
    return filt(drum(f, 48, 0.3, 0.8), "low", 900) * gain


def scrape(dur, gain=1.0):
    """a brush on sandstone"""
    n = int(dur * SR)
    return filt(noise(n), "band", (500, 2000)) * env_ar(n, 0.05, 0.1) * 0.08 * gain


def rumble(dur, gain=1.0):
    n = int(dur * SR)
    return filt(pink(n), "low", 260) * env_ar(n, 0.3, 0.8) * 0.5 * gain


add(amb, frogs(lake[0] - paetpeng[0]), paetpeng[0], pan=-0.3, gain=0.8)


def trowel(dur, gain=1.0):
    """stucco worked on with a trowel: a soft wet scrape"""
    n = int(dur * SR)
    return filt(noise(n), "band", (300, 1400)) * env_ar(n, 0.05, 0.15) * 0.1 * gain


# the cover: a brick laid every ~0.12 s while the courses climb, the trowel after them, a bell as the gold goes on
add(sfx, thud(0.9, 110), 0.0, pan=0.0)
add(sfx, tick(0.9), 0.02, pan=0.1)
t = 0.12
while t < BRICK_END:
    add(sfx, tick(0.6), t, pan=rng.uniform(-0.3, 0.3))
    if rng.random() < 0.5:
        add(sfx, thud(0.25, rng.uniform(110, 150)), t, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.1, 0.16)
t = 0.4
while t < STUCCO_END:
    add(sfx, trowel(rng.uniform(0.2, 0.35)), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.25, 0.4)
add(sfx, filt(whoosh(0.6, 0.4), "low", 1400), STUCCO_END - 0.3, pan=0.0, gain=0.35)  # the scaffold comes down
add(sfx, filt(bell(523, 2.6, decay=1.6), "low", 2300), GOLD0 + 0.2, pan=-0.1, gain=0.18)
add(sfx, gong(82, 3.0, 0.24), GOLD_END, pan=0.0)
add(sfx, filt(whoosh(0.9, 0.5), "low", 1300), 3.1, pan=0.0, gain=0.35)  # the giant goes back to its size
# paetpeng: feet circling, a low chant, temple bells, the ching
t = at(paetpeng, 0.15)
while t < paetpeng[1] - 0.2:
    add(sfx, footstep(0.3), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.26
add(sfx, babble(paetpeng[1] - paetpeng[0] - 0.8, 0.6), paetpeng[0] + 0.6, pan=0.1, gain=0.25)
for j in range(3):
    add(sfx, filt(bell(440 + 66 * j, 2.4, decay=2.0), "low", 2300), at(paetpeng, 0.25 + j * 0.25), pan=-0.3 + 0.3 * j, gain=0.13)
# abandon: war drums far off, carts creaking, feet leaving; then only wind
for k in range(10):
    add(sfx, filt(drum(80, 45, 0.5, 0.8), "low", 500), at(abandon, 0.05 + 0.07 * k), pan=-0.5, gain=0.25)
t = at(abandon, 0.1)
while t < at(abandon, 0.8):
    add(sfx, creak(0.4) * 0.35, t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, footstep(0.4), t + 0.12, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.4, 0.6)
add(sfx, babble(1.8, 1.2), at(abandon, 0.12), pan=0.2, gain=0.2)
add(sfx, rumble(1.6, 0.5), at(abandon, 0.7), pan=0.0)
# refound: carts, hooves, voices; posts knocked in as the houses go up
t = refound[0] + 0.3
while t < at(refound, 0.75):
    add(sfx, creak(0.4) * 0.4, t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, footstep(0.5), t + 0.15, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.45, 0.65)
add(sfx, babble(refound[1] - refound[0] - 0.6, 0.9), refound[0] + 0.4, pan=-0.1, gain=0.28)
for k in range(7):
    add(sfx, thud(0.3, rng.uniform(90, 130)), at(refound, 0.5 + 0.05 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, gong(98, 2.8, 0.25), at(refound, 0.9), pan=0.0)
# vihara: adzes and mallets, logs set down, a gong as the roof goes on
t = at(vihara, 0.05)
while t < at(vihara, 0.9):
    add(sfx, thud(0.3, rng.uniform(90, 140)), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, tick(0.5), t + 0.05, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.2, 0.3)
for k in range(5):
    add(sfx, thud(0.55, 75), at(vihara, 0.15 + 0.13 * k), pan=rng.uniform(-0.3, 0.3))
add(sfx, filt(bell(392, 2.6, decay=1.8), "low", 2300), at(vihara, 0.9), pan=0.0, gain=0.16)
# lake: the winches creak, the doors clank down, then the water rushes out over the marsh and splashes round the chedi
for k in range(6):
    add(sfx, creak(0.5) * 0.4, at(lake, 0.03 + 0.03 * k), pan=0.3)
for k in range(4):
    add(sfx, clink() * 0.5, at(lake, 0.08 + 0.04 * k), pan=0.2)
    add(sfx, thud(0.6, 70), at(lake, 0.1 + 0.04 * k), pan=0.2)
n = int((at(lake, 0.85) - at(lake, 0.18)) * SR)
add(sfx, filt(pink(n), "band", (120, 900)) * env_ar(n, 0.8, 1.2) * 0.4, at(lake, 0.18), pan=-0.1)
add(sfx, filt(whoosh(2.6, 0.8), "low", 1200), at(lake, 0.25), pan=0.0, gain=0.5)
for k in range(4):
    add(sfx, splash() * 0.45, at(lake, 0.45 + 0.1 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, gong(70, 3.6, 0.3), at(lake, 0.8), pan=0.0)
# province: the crowd along the shore road, feet in step
add(sfx, crowd(province[1] - province[0]), province[0] + 0.3, pan=0.1, gain=0.22)
t = at(province, 0.05)
while t < province[1] - 0.2:
    add(sfx, footstep(0.35), t, pan=rng.uniform(-0.4, 0.4))
    t += BEAT / 2
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# the payoff: the crowd and chant, temple bells, paddles on the lake
add(sfx, babble(today[1] - payoff[0], 1.0), payoff[0], pan=0.2, gain=0.25)
add(sfx, crowd(today[1] - payoff[0]), payoff[0] + 0.3, pan=-0.2, gain=0.15)
for j in range(4):
    add(sfx, filt(bell(440 + 44 * j, 2.6, decay=2.0), "low", 2300), at(payoff, 0.15 + j * 0.2), pan=-0.3 + 0.2 * j, gain=0.12)
t = payoff[0] + 0.4
while t < today[1]:
    add(sfx, splash() * 0.12, t, pan=rng.uniform(-0.6, 0.6))
    t += rng.uniform(0.6, 1.1)


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


order = [paetpeng, abandon, refound, vihara, lake, province, grow, payoff]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(4):
    add(music, gong(rng.choice([98, 131, 147]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 1.8
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_phayao.wav", music, amb, sfx)
print("wrote public/soundtrack_phayao.wav", {"hero": round(hero[0], 2), "payoff": round(payoff[0], 2)})
