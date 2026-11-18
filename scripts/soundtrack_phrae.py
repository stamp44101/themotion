"""Phrae soundtrack: a Lanna palette (the sueng's plucked lines, a soft pi chum reed, the khong wong's wooden-mallet gongs as
ranat bars, a klong and ching) under a small sound for everything that appears or moves: the bow saw rasping through the
cover's teak gable and the cut-outs clattering down, wood knocked as the house rises under it; the Shan's running feet and
their banner, the Siamese column's drum and feet; the gang's sleepers, the steam train's chuff and whistle at Den Chai; the
elephants' trumpets and footfalls, logs rolling into the Yom; bricks and footsteps up Cho Hae's stair, a temple bell; the
town's pops and traffic; the dyers' cloth flapping; the walking street's crowd and the saw again, fireworks at the end.
All code (no generated audio); kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/phrae/timeline.ts out/timeline_phrae.json
      python3 scripts/soundtrack_phrae.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_phrae.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_phrae.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, shan, rail, teak, chohae, grow, mohom, fair, today = (
    B("hero"), B("shan"), B("rail"), B("teak"), B("chohae"), B("grow"), B("mohom"), B("fair"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.9  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the cover's saw (src/styleframes/phrae.tsx: 60 holes, the left half cut before frame 0, the rest by CUT_END)
HOLES, CUT_END = 60, 2.1
hole_at = lambda k: -1 if k < HOLES / 2 else ((k - HOLES / 2 + 1) / (HOLES / 2)) * CUT_END

# ---------------------------------------------------------------- score (D minor pentatonic, a slow Lanna sueng feel, 92 bpm)
BEAT = 60 / 92
PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81]
Dm, F, C, Am, G = [50, 57, 62, 65], [53, 60, 65, 69], [48, 55, 60, 64], [45, 52, 57, 60], [43, 50, 55, 59]
sections = (
    (0.0, shan[0], Dm, 1.0),
    (shan[0], rail[0], Am, 1.0),
    (rail[0], teak[0], F, 1.0),
    (teak[0], chohae[0], Dm, 0.95),
    (chohae[0], grow[0], C, 0.95),
    (grow[0], mohom[0], F, 1.0),
    (mohom[0], fair[0], Am, 0.95),
    (fair[0], DUR, [50, 57, 62, 65, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1500), t0, gain=0.11 * lvl)
    add(music, filt(pi_reed(notes[2] + 12, t1 - t0 + 0.3), "low", 2000), t0 + 0.2, pan=-0.2, gain=0.03 * lvl)


def khong_line(t0, t1, amp, step=BEAT / 2, prob=0.8):
    """the khong wong: running pentatonic on wooden-mallet bars"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.5), "low", 2200), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def sueng_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.3:
        d = BEAT * rng.choice([0.5, 0.5, 1])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(pluck(PENTA[i] - 12, 1.2, bright=0.8), "low", 2100), t, pan=0.25, gain=amp)
        t += d


def klong(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0, 0.8, 0.4, 0.6, 0]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(95, 115), 55, 0.24, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.45)
        t += BEAT / 2
        k += 1


sueng_line(0.4, hero[1], 0.07)
klong(shan[0], shan[1], 0.12)
sueng_line(shan[0], shan[1], 0.05)
khong_line(rail[0], rail[1], 0.08, prob=0.55)
sueng_line(teak[0], teak[1], 0.07)
klong(teak[0] + 0.5, teak[1], 0.06)
khong_line(chohae[0], chohae[1], 0.09, prob=0.6)
khong_line(grow[0], grow[1], 0.11, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
sueng_line(mohom[0], mohom[1], 0.07)
khong_line(mohom[0] + 0.5, mohom[1], 0.06, prob=0.5)
khong_line(fair[0], DUR - 3.0, 0.13, prob=0.85)
sueng_line(fair[0], DUR - 3.0, 0.06)
klong(fair[0] + 0.2, DUR - 3.0, 0.11)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1960 else 0.45)
    t += rng.exponential(1.0)
TT = np.arange(N) / SR
# fields and wind at the cover and the gate; the yard at Den Chai; the Yom's water in the teak beat; the hill's wind at Cho Hae;
# the town bed from the 1950s
win = lambda a, b, r=1.0: np.clip((TT - a) / r, 0, 1) * (1 - np.clip((TT - b) / r, 0, 1))
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * (win(-1, rail[0]) + win(chohae[0], grow[0])) * 0.1, 0)
add(amb, filt(pink(N), "band", (150, 900)) * win(teak[0], chohae[0]) * 0.16, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 60, 0, 1) * 0.15, 0)


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


def rasp(dur, gain=1.0, rate=15.0):
    """a bow saw in teak: band noise pulsed by the strokes"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    stroke = 0.35 + 0.65 * np.abs(np.sin(np.pi * rate * t))
    return filt(noise(n), "band", (380, 1700)) * stroke * env_ar(n, 0.02, 0.08) * 0.22 * gain


def clack(gain=1.0):
    """a cut-out of teak landing on the ground"""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return (filt(noise(n), "band", (500, 1900)) * np.exp(-t * 80) * 0.4 + np.sin(2 * np.pi * rng.uniform(180, 260) * t) * np.exp(-t * 40) * 0.3) * gain


# the cover: the saw rasps from frame 0, a clack for every cut-out that drops, then wood knocked as the house rises
add(sfx, rasp(CUT_END + 0.05, 1.0), 0.0, pan=0.1)
for k in range(HOLES):
    s = hole_at(k)
    if s >= 0 and k % 2 == 0:
        add(sfx, clack(0.7), s + 0.3, pan=rng.uniform(-0.3, 0.3))
add(sfx, clack(0.9), 0.0, pan=0.0)
for k in range(5):
    add(sfx, thud(0.45, rng.uniform(100, 150)), 2.25 + k * 0.18, pan=rng.uniform(-0.3, 0.3))
add(sfx, filt(whoosh(0.9, 0.5), "low", 1400), 2.2, pan=0.0, gain=0.35)
add(sfx, gong(82, 2.6, 0.2), 3.2, pan=0.0)
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.5, pan=0.0, gain=0.35)  # the gable folds away
# shan: the Shan's running feet and voices, their banner; the Siamese drum and marching feet
t = shan[0] + 0.2
while t < at(shan, 0.42):
    add(sfx, footstep(0.45), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.17
add(sfx, babble(at(shan, 0.62) - shan[0], 1.4), shan[0] + 0.3, pan=-0.2, gain=0.3)
add(sfx, filt(whoosh(0.5, 0.4), "low", 1500), at(shan, 0.38), pan=0.1, gain=0.35)
t = at(shan, 0.44)
k = 0
while t < shan[1]:
    add(sfx, footstep(0.5), t, pan=0.2)
    if k % 2 == 0:
        add(sfx, drum(120, 60, 0.2, 0.7) * 0.35, t, pan=0.3)
    t += BEAT / 2
    k += 1
t = at(shan, 0.62)
while t < shan[1]:
    add(sfx, footstep(0.35), t, pan=-0.4)
    t += 0.2
add(sfx, gong(98, 3.0, 0.3), at(shan, 0.7), pan=0.0)
# rail: sleepers thumped down, then the train's chuff, whistle and brakes
for k in range(8):
    add(sfx, thud(0.35, rng.uniform(80, 120)), at(rail, 0.02 + 0.05 * k), pan=rng.uniform(-0.4, 0.4))
    add(sfx, tick(0.6), at(rail, 0.04 + 0.05 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, filt(steam_whistle(1.4), "low", 2200), 11.6, pan=-0.4, gain=0.4)
t = 12.0
step = 0.16
while t < 15.0:
    add(sfx, filt(chuff(), "low", 1800), t, pan=-0.3 + 0.3 * (t - 12) / 3, gain=0.5)
    t += step
    step = min(0.42, step * 1.07)
add(sfx, filt(whoosh(1.2, 0.5), "low", 1200), 14.6, pan=0.1, gain=0.4)
add(sfx, babble(2.0, 1.0), 14.0, pan=0.2, gain=0.22)
# teak: the elephants' feet and trumpets, logs dragging and rolling into the Yom, the rafts' paddles
t = teak[0] + 0.3
while t < at(teak, 0.55):
    add(sfx, thud(0.45, rng.uniform(55, 75)), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.42
add(sfx, filt(trumpet_elephant(), "low", 2000), at(teak, 0.12), pan=-0.3, gain=0.35)
add(sfx, filt(trumpet_elephant(), "low", 2000), at(teak, 0.5), pan=0.3, gain=0.3)
n = int((at(teak, 0.55) - teak[0]) * SR)
add(sfx, filt(pink(n), "low", 300) * env_ar(n, 0.3, 0.3) * 0.2, teak[0], pan=-0.1)
for k in range(3):
    add(sfx, thud(0.6, 70), at(teak, 0.6 + 0.08 * k), pan=-0.2 + 0.2 * k)
    add(sfx, splash() * 0.5, at(teak, 0.66 + 0.08 * k), pan=-0.2 + 0.2 * k)
# chohae: bricks set down and footsteps up the stair, a temple bell as the spire rises
t = chohae[0] + 0.2
while t < chohae[1] - 0.3:
    add(sfx, footstep(0.3), t, pan=rng.uniform(-0.4, 0.4))
    if rng.random() < 0.35:
        add(sfx, tick(0.7), t + 0.08, pan=rng.uniform(-0.4, 0.4))
    t += 0.26
add(sfx, babble(chohae[1] - chohae[0] - 0.6, 0.8), chohae[0] + 0.3, pan=0.1, gain=0.18)
for j in range(3):
    add(sfx, filt(bell(392 + 49 * j, 2.4, decay=1.8), "low", 2300), at(chohae, 0.4 + j * 0.2), pan=-0.2 + 0.2 * j, gain=0.14)
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# mohom: cloth snapped onto the lines, the dyers' voices
for j in range(6):
    for c in range(6):
        add(sfx, filt(whoosh(0.18, 0.4), "low", 1500), at(mohom, 0.05 + j * 0.1 + c * 0.03), pan=-0.5 + 0.2 * j, gain=0.3)
add(sfx, babble(mohom[1] - mohom[0] - 0.5, 0.9), mohom[0] + 0.3, pan=0.2, gain=0.22)
# the fair: the crowd, the saw again on the craftsman's trestle, feet
add(sfx, babble(today[1] - fair[0], 1.2), fair[0], pan=0.2, gain=0.3)
add(sfx, crowd(today[1] - fair[0]), fair[0] + 0.3, pan=-0.2, gain=0.18)
add(sfx, rasp(2.1, 0.6), fair[0] + 1.0, pan=-0.2)
for k in range(10):
    add(sfx, clack(0.4), fair[0] + 1.2 + k * 0.2, pan=-0.2)
t = fair[0] + 0.5
while t < today[1]:
    add(sfx, footstep(0.25), t, pan=rng.uniform(-0.5, 0.5))
    t += BEAT


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


order = [shan, rail, teak, chohae, grow, mohom, fair]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 1.8
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_phrae.wav", music, amb, sfx)
print("wrote public/soundtrack_phrae.wav", {"hero": round(hero[0], 2), "fair": round(fair[0], 2)})
