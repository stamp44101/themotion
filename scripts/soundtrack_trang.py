"""Trang soundtrack: a southern palette (the khlui's line, plucked lines, a pi reed, gong and a soft frame-drum pulse) under a
small sound for everything that appears or moves: the tapping knife's scrape round the rubber tree and the latex dripping
into the cup; the junks' timbers creaking and water on their hulls; oars and voices as the governor's boats come down;
spades and seedlings in the first plot; the first train's chuffs, whistle and brakes, porters and a steamer's horn; the
tide flooding Kantang, the train up the line, the hall going up; the town's pops and traffic; long-tail engines and a
dugong's breath; the breakfast's cups, steamers and chatter; fireworks at the end. Ambience is a sequence of places: the
sea and the estuary, the rubber forest's birds, the town. All code (no generated audio); kept under ~2.4 kHz (the owner
dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/trang/timeline.ts out/timeline_trang.json
      python3 scripts/soundtrack_trang.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_trang.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_trang.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, junks, ratsada, rubber, train, move, grow, sea, breakfast, today = (
    B("hero"), B("junks"), B("ratsada"), B("rubber"), B("train"), B("move"), B("grow"), B("sea"), B("breakfast"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.2  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
CUT_END = 1.8  # src/cities/trang/Hero.tsx

# ---------------------------------------------------------------- score (D minor pentatonic, 96 bpm)
BEAT = 60 / 96
PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81]
Dm, F, C, Gm, Am = [50, 57, 62, 65], [53, 60, 65, 69], [48, 55, 60, 64], [55, 62, 67, 70], [57, 64, 69, 72]
sections = (
    (0.0, junks[0], Dm, 0.9),
    (junks[0], ratsada[0], Dm, 1.0),
    (ratsada[0], rubber[0], F, 1.0),
    (rubber[0], train[0], C, 0.95),
    (train[0], move[0], F, 1.0),
    (move[0], grow[0], Gm, 0.9),
    (grow[0], sea[0], C, 1.0),
    (sea[0], breakfast[0], Am, 0.95),
    (breakfast[0], DUR, [50, 57, 62, 65, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1500), t0, gain=0.11 * lvl)
    add(music, filt(pad(notes[:2], t1 - t0 + 0.6, bright=700), "low", 900), t0, gain=0.07 * lvl)


def pluck_line(t0, t1, amp, step=BEAT / 2, prob=0.75, octave=0):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(pluck(PENTA[i] + octave, 1.1, bright=0.8), "low", 2200), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def flute(t0, t1, amp):
    t = t0
    i = 4
    while t < t1 - 0.5:
        d = BEAT * rng.choice([1, 1, 2, 1.5])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(khlui(PENTA[i], d + 0.2), "low", 2300), t, pan=0.2, gain=amp)
        t += d


def pulse(t0, t1, gain):
    pat = [1.0, 0, 0.4, 0.6, 0.8, 0, 0.5, 0.3]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(100, 120), 60, 0.22, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 4 == 2:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.4)
        t += BEAT / 2
        k += 1


flute(0.3, hero[1], 0.06)
pluck_line(junks[0], junks[1], 0.07, prob=0.55)
pulse(ratsada[0], ratsada[1], 0.11)
flute(ratsada[0] + 0.5, ratsada[1], 0.05)
pluck_line(rubber[0], rubber[1], 0.08, prob=0.6)
pulse(train[0] + 0.5, train[1], 0.09)
pluck_line(train[0], train[1], 0.06, prob=0.5, octave=-12)
flute(move[0], move[1], 0.05)
pulse(move[0] + 1.0, move[1], 0.07)
pluck_line(grow[0], grow[1], 0.1, prob=0.75)
pulse(grow[0] + 1.0, grow[1], 0.08)
flute(sea[0], sea[1], 0.07)
pluck_line(breakfast[0], DUR - 3.0, 0.12, prob=0.85)
flute(breakfast[0] + 0.5, DUR - 3.0, 0.05)
pulse(breakfast[0] + 0.2, DUR - 3.0, 0.1)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
TT = np.arange(N) / SR
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (grow[0] < t < grow[1]) and not (breakfast[0] < t < breakfast[1]):
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=0.9)
    t += rng.exponential(1.1)
# the sea and the estuary under the junks, the flood and the long-tails; the rubber forest's air; the town bed
def win(a, b, fade=1.0):
    return np.clip((TT - a) / fade, 0, 1) * (1 - np.clip((TT - b) / fade, 0, 1))


waves = filt(pink(N), "band", (100, 700)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.12 * TT) ** 2)
add(amb, waves * (win(junks[0] - 0.5, ratsada[1]) + win(move[0], at(move, 0.5)) * 0.7 + win(sea[0] - 0.5, sea[1])) * 0.14, 0)
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * (win(-1, junks[0]) + win(rubber[0], train[0])) * 0.1, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1925) / 60, 0, 1) * (1 - win(sea[0], sea[1])) * 0.15, 0)


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
    """the tapping knife paring a strip of bark"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (400, 1900)) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * t)) * env_ar(n, 0.03, 0.08) * 0.12 * gain


def drip(gain=1.0):
    """a drop of latex into the cup: a soft rounded plip"""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * (700 + 900 * np.exp(-t * 40)) * t) * np.exp(-t * 45) * 0.25 * gain


def engine(dur, f=38, gain=1.0):
    """a long-tail's open engine, low and throaty"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    saw = 2 * ((f * t) % 1) - 1
    return filt(saw * 0.5 + pink(n) * 0.4, "low", 500) * env_ar(n, 0.4, 0.6) * 0.3 * gain


# the cover: the knife pares the cut round the trunk from frame 0, latex drips into the cup
add(sfx, scrape(CUT_END, 1.2), 0.0, pan=-0.1)
t = 0.15
while t < hero[1] + 0.8:
    add(sfx, drip(0.9), t, pan=0.15)
    t += 1 / 2.2
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.3, pan=0.0, gain=0.4)  # the tree sinks away
# junks: timbers creaking, water on the hulls, a gong as they come off the bank
t = junks[0] + 0.3
while t < junks[1] - 0.3:
    add(sfx, creak(0.5) * 0.35, t, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.5, 0.9)
for k in range(5):
    add(sfx, splash() * 0.18, at(junks, 0.15 + 0.15 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, gong(82, 2.6, 0.22), at(junks, 0.9), pan=0.0)
# ratsada: oars, the drum of the governor's boat, voices on landing, posts knocked in for the shophouses
t = ratsada[0] + 0.2
while t < at(ratsada, 0.6):
    add(sfx, splash() * 0.12, t, pan=rng.uniform(-0.3, 0.3))
    t += 0.42
add(sfx, babble(at(ratsada, 1.0) - at(ratsada, 0.5), 1.0), at(ratsada, 0.5), pan=0.1, gain=0.28)
for k in range(8):
    add(sfx, thud(0.3, rng.uniform(90, 130)), at(ratsada, 0.45 + 0.05 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, gong(98, 3.0, 0.25), at(ratsada, 0.62), pan=0.0)
# rubber: spades into the earth and a seedling set in, one by one; the first tapping at the end
t = at(rubber, 0.05)
while t < at(rubber, 0.5):
    add(sfx, thud(0.28, rng.uniform(70, 100)), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, tick(0.4), t + 0.08, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.18, 0.28)
add(sfx, filt(bell(523, 2.0, decay=1.8), "low", 2300), at(rubber, 0.55), pan=0.0, gain=0.12)
add(sfx, scrape(0.9, 0.8), at(rubber, 0.8), pan=0.2)
# train: the rails laid, chuffs as the first train runs in, whistle, brakes; porters, a steamer's horn
for k in range(8):
    add(sfx, tick(0.6), at(train, 0.03 + 0.045 * k), pan=rng.uniform(-0.4, 0.4))
t = at(train, 0.3)
step = 0.16
while t < at(train, 0.82):
    add(sfx, chuff(), t, pan=0.15, gain=0.6)
    t += step
    step = min(0.32, step * 1.05)
add(sfx, filt(steam_whistle(1.2), "low", 2000), at(train, 0.35), pan=0.2, gain=0.28)
add(sfx, filt(whoosh(0.7, 0.4), "low", 1200), at(train, 0.82), pan=0.1, gain=0.3)
t = at(train, 0.84)
while t < train[1]:
    add(sfx, footstep(0.35), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.26
add(sfx, filt(gong(70, 2.0, 0.3), "low", 600), at(train, 0.4), pan=-0.4, gain=0.6)  # the steamer's horn
# move: the tide over the streets, then the train up the line, the hall going up
add(sfx, filt(whoosh(2.4, 0.8), "low", 1000), move[0] + 0.1, pan=-0.1, gain=0.5)
for k in range(4):
    add(sfx, splash() * 0.25, at(move, 0.08 + 0.08 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, babble(1.6, 1.2), at(move, 0.1), pan=0.2, gain=0.22)
t = at(move, 0.3)
while t < at(move, 0.88):
    add(sfx, chuff(), t, pan=-0.1, gain=0.5)
    t += 0.2
add(sfx, filt(steam_whistle(1.0), "low", 2000), at(move, 0.32), pan=0.0, gain=0.22)
for k in range(5):
    add(sfx, thud(0.3, rng.uniform(90, 130)), at(move, 0.7 + 0.05 * k), pan=rng.uniform(-0.3, 0.3))
add(sfx, gong(88, 2.6, 0.22), at(move, 0.95), pan=0.0)
# grow: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# sea: the long-tails' engines going by, a dugong's breath and splash
add(sfx, engine(sea[1] - sea[0], 36, 0.8), sea[0], pan=-0.3)
add(sfx, engine(sea[1] - sea[0] - 0.6, 42, 0.5), sea[0] + 0.6, pan=0.3)
add(sfx, filt(whoosh(0.5, 0.6), "low", 1300), at(sea, 0.45), pan=0.2, gain=0.35)
add(sfx, splash() * 0.3, at(sea, 0.52), pan=0.2)
# breakfast: chatter, cups and plates, the steamers' lids, the tree's cup dripping again
add(sfx, babble(today[1] - breakfast[0], 1.3), breakfast[0], pan=0.2, gain=0.3)
add(sfx, crowd(today[1] - breakfast[0]), breakfast[0] + 0.3, pan=-0.2, gain=0.16)
t = breakfast[0] + 0.4
while t < today[1]:
    add(sfx, clink(), t, pan=rng.uniform(-0.6, 0.6), gain=0.35)
    t += rng.uniform(0.3, 0.8)
t = at(breakfast, 0.25)
while t < at(breakfast, 0.9):
    add(sfx, drip(0.7), t, pan=-0.3)
    t += 0.9


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


order = [junks, ratsada, rubber, train, move, grow, sea, breakfast]
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
mix = master("public/soundtrack_trang.wav", music, amb, sfx)
print("wrote public/soundtrack_trang.wav", {"hero": round(hero[0], 2), "breakfast": round(breakfast[0], 2)})
