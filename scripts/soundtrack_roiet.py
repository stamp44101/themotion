"""Roi Et soundtrack: the town of khaen makers, so the khaen carries the score (a lam phloen run, D minor pentatonic, 104
bpm) with a phin and a klong; the wot (โหวด) is its breathy flute voice, first at the cover and back at the tower. Under
it a small sound for everything that appears or moves: a hollow bamboo knock for every pipe of the cover's wot as it
drops in, the wax pressed on, the wot's whistle as it spins; ox carts, feet and voices as Thao Thon's people come up from
the south, axes in ดงกุ่ม and the first sim's bell; hammers and temple bells as the town fills the moat, a biplane's
engine coming down onto the strip and the crowd; hoes and baskets and thousands of voices at the bueng, the water coming
back; the town's pops and traffic; the wot's flight back and the tower set down with a gong; the Phawet procession's
drums, khaen bands and crowd; fireworks at the end. All code (no generated audio); kept under ~2.4 kHz (the owner dislikes
sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/roiet/timeline.ts out/timeline_roiet.json
      python3 scripts/soundtrack_roiet.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_roiet.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_roiet.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, found, plane, dig, grow, tower, fair, today = (
    B("hero"), B("found"), B("plane"), B("dig"), B("grow"), B("tower"), B("fair"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.2  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the cover's wot (src/cities/roiet/actors.ts wotAt)
WOTS, W_END, SPIN0 = 14, 1.9, 2.1
wot_at = lambda k: -1 if k < WOTS / 2 else ((k - WOTS / 2 + 1) / (WOTS / 2)) * W_END

# ---------------------------------------------------------------- score (D minor pentatonic, lam phloen feel, 104 bpm)
BEAT = 60 / 104
PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81]
Dm, F, C, Gm, Am = [50, 57, 62, 65], [53, 60, 65, 69], [48, 55, 60, 64], [55, 62, 67, 70], [45, 52, 57, 60]
sections = (
    (0.0, found[0], Dm, 0.9),
    (found[0], plane[0], Dm, 1.0),
    (plane[0], dig[0], F, 1.0),
    (dig[0], grow[0], Gm, 0.95),
    (grow[0], tower[0], C, 1.0),
    (tower[0], fair[0], Am, 1.0),
    (fair[0], DUR, [50, 57, 62, 65, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, filt(khaen(notes, t1 - t0 + 0.6, bright=2000), "low", 2300), t0, gain=0.14 * lvl)
    add(music, pad(notes[:3], t1 - t0 + 0.6, bright=1300), t0, gain=0.06 * lvl)


def khaen_run(t0, t1, amp, step=BEAT / 2, prob=0.85):
    """the khaen's melody line: short pentatonic phrases over its drone"""
    i = 3
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(khaen([PENTA[i]], step * 1.6, bright=1900), "low", 2200), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += step


def phin_line(t0, t1, amp):
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
            add(music, drum(rng.uniform(105, 125), 58, 0.22, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.45)
        t += BEAT / 2
        k += 1


def wot_phrase(t0, t1, amp):
    """the wot's breathy flute: long held notes high in the scale"""
    t = t0
    i = 5
    while t < t1 - 0.4:
        d = BEAT * rng.choice([1, 2, 2])
        i = int(np.clip(i + rng.choice([-1, 1, -2]), 3, len(PENTA) - 1))
        add(music, filt(khlui(PENTA[i], min(d + 0.2, t1 - t)), "low", 2300), t, pan=-0.15, gain=amp)
        t += d


wot_phrase(SPIN0, hero[1] + 0.8, 0.09)
phin_line(found[0], found[1], 0.06)
klong(found[0] + 0.3, found[1], 0.1)
khaen_run(plane[0], plane[1], 0.06, prob=0.6)
phin_line(dig[0], dig[1], 0.06)
klong(dig[0] + 0.4, dig[1], 0.07)
khaen_run(grow[0], grow[1], 0.08, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
wot_phrase(tower[0], tower[1], 0.1)
khaen_run(fair[0], DUR - 3.0, 0.1, prob=0.9)
phin_line(fair[0], DUR - 3.0, 0.06)
klong(fair[0] + 0.2, DUR - 3.0, 0.12)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(1.0)
TT = np.arange(N) / SR
# the paddy wind at the cover and over the old town; the bueng's water lapping from the dig on; the town bed from the 1950s
wind_on = 1 - np.clip((TT - plane[1]) / 2.0, 0, 1) * 0.6
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * wind_on * 0.1, 0)
water_on = np.clip((TT - at(dig, 0.8)) / 1.0, 0, 1) * (1 - np.clip((TT - grow[0]) / 1.0, 0, 1) * 0.7) + np.clip((TT - fair[0]) / 1.0, 0, 1) * 0.4
add(amb, filt(pink(N), "band", (150, 800)) * water_on * 0.12, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 60, 0, 1) * 0.15, 0)


def frogs(dur, gain=1.0):
    """frogs in the moat and the paddy ditches: soft low croaks"""
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


add(amb, frogs(found[1] + 1.0), 0.0, pan=-0.3)
add(amb, frogs(plane[1] - plane[0]), plane[0], pan=0.3, gain=0.6)


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


def bamboo(gain=1.0, f=None):
    """a hollow bamboo pipe knocked into place: a short pitched tube resonance"""
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    f0 = f or rng.uniform(240, 420)
    body = (np.sin(2 * np.pi * f0 * t) + 0.4 * np.sin(2 * np.pi * f0 * 2.02 * t)) * np.exp(-t * 18)
    hit = filt(noise(n), "band", (500, 1800)) * np.exp(-t * 80) * 0.4
    return (body * 0.5 + hit) * gain


def engine(dur, gain=1.0):
    """a 1920s radial engine: a low buzz that rises as it nears"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    buzz = filt(pink(n), "low", 380) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 34 * t)))
    return buzz * np.linspace(0.3, 1.0, n) * env_ar(n, 0.4, 0.6) * 0.5 * gain


def hoe(gain=1.0):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (200, 900)) * np.exp(-t * 40) * 0.5 * gain


# the cover: a hollow knock for every pipe that drops in from frame 0, the wax pressed on, the whistle as it spins
for k in range(WOTS):
    s = wot_at(k)
    if s >= 0:
        add(sfx, bamboo(1.0, 420 - k * 12), s, pan=rng.uniform(-0.2, 0.2))
add(sfx, bamboo(0.8, 300), 0.0, pan=0.0)
add(sfx, thud(0.5, 80), W_END + 0.05, pan=0.0)
add(sfx, gong(82, 2.6, 0.22), W_END + 0.1, pan=0.0)
n = int(1.6 * SR)
add(sfx, filt(noise(n), "band", (500, 1400)) * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(np.linspace(2, 9, n)) / SR)) * env_ar(n, 0.3, 0.6) * 0.12, SPIN0, pan=0.0)
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.4, pan=0.0, gain=0.4)  # the wot lifts away
# found: ox carts creaking, feet, voices; axes in the forest; the first sim's bell
t = found[0] + 0.3
while t < at(found, 0.85):
    add(sfx, creak(0.4) * 0.4, t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, footstep(0.5), t + 0.15, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.45, 0.65)
add(sfx, babble(found[1] - found[0] - 0.5, 0.9), found[0] + 0.4, pan=-0.1, gain=0.3)
t = at(found, 0.45)
while t < found[1] - 0.2:
    add(sfx, thud(0.3, rng.uniform(110, 150)), t, pan=rng.uniform(-0.5, 0.5))
    add(sfx, tick(0.5), t + 0.04, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.22, 0.34)
add(sfx, filt(bell(440, 2.4, decay=1.8), "low", 2300), at(found, 0.85), pan=-0.2, gain=0.15)
# plane: hammers and bells as the town fills, the biplane's engine coming down, the crowd at the strip
# (the town fills the moat in the run between the founding and the plane: hammers and the old temples' bells)
t = found[1] + 0.1
while t < plane[0] + 0.6:
    add(sfx, thud(0.25, rng.uniform(90, 140)), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.18, 0.3)
for j in range(3):
    add(sfx, filt(bell(392 + 49 * j, 2.2, decay=2.0), "low", 2300), found[1] + 0.3 + j * 0.5, pan=-0.2 + 0.2 * j, gain=0.12)
add(sfx, engine(at(plane, 0.92) - at(plane, 0.2), 0.9), at(plane, 0.2), pan=-0.1)
add(sfx, thud(0.5, 70), at(plane, 0.68), pan=0.0)
add(sfx, crowd(2.2), at(plane, 0.7), pan=0.1, gain=0.3)
# dig: hoes and baskets, thousands of voices, then the water coming back
t = at(dig, 0.05)
while t < at(dig, 0.78):
    add(sfx, hoe(0.6), t, pan=rng.uniform(-0.6, 0.6))
    if rng.random() < 0.3:
        add(sfx, footstep(0.3), t + 0.07, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.08, 0.16)
add(sfx, babble(at(dig, 0.8) - dig[0], 1.6), dig[0] + 0.2, pan=0.15, gain=0.32)
add(sfx, crowd(at(dig, 0.8) - dig[0]), dig[0] + 0.3, pan=-0.15, gain=0.15)
add(sfx, filt(whoosh(1.8, 0.8), "low", 1200), at(dig, 0.78), pan=0.0, gain=0.5)
for k in range(3):
    add(sfx, splash() * 0.4, at(dig, 0.8 + 0.05 * k), pan=-0.3 + 0.3 * k)
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# tower: the wot's whistle as it comes back, a knock as it sets down, a gong as it stands as the tower
n = int((at(tower, 0.55) - tower[0]) * SR)
add(sfx, filt(noise(n), "band", (500, 1400)) * (0.5 + 0.5 * np.sin(2 * np.pi * np.cumsum(np.linspace(8, 2, n)) / SR)) * env_ar(n, 0.4, 0.4) * 0.12, tower[0], pan=0.1)
add(sfx, bamboo(1.0, 260), at(tower, 0.55), pan=0.0)
add(sfx, thud(0.7, 64), at(tower, 0.56), pan=0.0)
add(sfx, gong(74, 3.4, 0.3), at(tower, 0.62), pan=0.0)
add(sfx, crowd(2.4), at(tower, 0.7), pan=0.1, gain=0.22)
# fair: the procession's feet and drums, voices, the crowd in the park
add(sfx, babble(today[1] - fair[0], 1.2), fair[0], pan=0.2, gain=0.3)
add(sfx, crowd(today[1] - fair[0]), fair[0] + 0.3, pan=-0.2, gain=0.18)
t = fair[0] + 0.3
while t < today[1]:
    add(sfx, footstep(0.25), t, pan=rng.uniform(-0.5, 0.5))
    t += BEAT / 2


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


order = [found, plane, dig, grow, tower, fair]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(max(a_[1] - 0.9, b_[0] - 1.2), b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.1
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_roiet.wav", music, amb, sfx)
print("wrote public/soundtrack_roiet.wav", {"hero": round(hero[0], 2), "fair": round(fair[0], 2)})
