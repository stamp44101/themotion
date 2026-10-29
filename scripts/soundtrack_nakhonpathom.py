"""Nakhon Pathom soundtrack: a central-Thai palette (the ranat, the khong wong's gongs, the khlui,
ching on the beat) under a small sound for everything that moves or appears: the golden bell closing
over the old stupa tier by tier and its crown, the builders, the canal dug toward the chedi and the
brick boats paddling up it, the July 2403 rains and the shell slumping, the crown raised, the first
train in from Bangkok and the market by the canal, the Wild Tiger Corps marching to Sanam Chandra, the
town spreading, and the 12th-month fair round the lit chedi. All code; kept under ~2.4 kHz (the owner
dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/nakhonpathom/timeline.ts out/timeline_nakhonpathom.json
      python3 scripts/soundtrack_nakhonpathom.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_nakhonpathom.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_nakhonpathom.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, canal, collapse, crown, train, palace, grow, pay, today = (
    B("hero"), B("canal"), B("collapse"), B("crown"), B("train"), B("palace"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (D major pentatonic, 88 bpm)
BEAT = 60 / 88
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]
D, G, A, Bm = [50, 57, 62], [43, 50, 55], [45, 52, 57], [47, 54, 59]

sections = (
    (0.0, canal[0], [50, 57, 62, 66], 1.0),
    (canal[0], collapse[0], D, 0.8),
    # the rains: the score drops to a low drone and lets the storm speak
    (collapse[0], collapse[1], [38, 45], 0.55),
    (crown[0], train[1], G, 0.85),
    (train[1], grow[0], A, 0.85),
    (grow[0], pay[0], Bm, 0.9),
    (pay[0], DUR, [50, 57, 62, 66, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.22 * lvl)


def ranat_run(t0, t1, amp, step=BEAT / 2, prob=0.85):
    """the ranat ek, soft mallets wandering the pentatonic, rounded at 2.4 kHz"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.6), "low", 2400), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def khong(t0, t1, amp):
    """the khong wong's small gongs on the strong beats"""
    t = t0
    i = 2
    while t < t1:
        i = int(np.clip(i + rng.choice([-1, 1, 2, -2]), 0, len(PENTA) - 1))
        add(music, filt(bell(mtof(PENTA[i] - 12), 1.2, decay=2.4), "low", 2000), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += BEAT * rng.choice([1, 1, 2])


def chings(t0, t1, gain):
    for t in np.arange(t0, t1, BEAT):
        add(sfx, filt(ching(), "low", 2400), t, pan=-0.15, gain=gain)


ranat_run(2.2, hero[1], 0.12, prob=0.55)
khong(canal[0], canal[1], 0.1)
ranat_run(crown[0], train[1], 0.13)
add(music, filt(khlui(69, 3.2), "low", 2200), palace[0] + 0.4, pan=0.2, gain=0.2)
add(music, filt(khlui(74, 2.6), "low", 2200), palace[0] + 3.0, pan=0.2, gain=0.18)
ranat_run(grow[0], grow[1], 0.12, prob=0.7)
ranat_run(pay[0] + 0.3, DUR - 3.0, 0.15)
khong(pay[0] + 1.0, DUR - 3.0, 0.1)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
add(amb, filt(pink(N), "band", (150, 700)) * 0.25, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    rainy = collapse[0] - 0.3 < t < collapse[1] - 1.0
    if tl.NIGHT[i] < 0.2 and not rainy:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.1 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.7)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 50, 0, 1) * 0.17, 0)

# ---------------------------------------------------------------- the small sounds


def blip(f=None, gain=1.0):
    """something going up: a soft, round wooden 'tok' with a falling pitch"""
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


def steps(t0, t1, every, gain, pan=0.0):
    t = t0
    while t < t1:
        add(sfx, filt(footstep(gain), "low", 900), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.2, 0.2))
        t += every * rng.uniform(0.85, 1.15)


def rise_tone(dur, gain):
    """a soft swell of low voices and a glow, no sharp edge"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (50, 57, 62, 66, 69):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def stone(gain=1.0):
    """a tier locking into place: a deep, round thud with a short stone knock"""
    return filt(drum(rng.uniform(70, 90), 44, 0.6, 1.0), "low", 1400) * gain


def trowel(gain=1.0):
    return filt(drum(rng.uniform(300, 420), 200, 0.08, 0.5), "low", 2000) * gain


def rain(dur, gain):
    """days of rain: a dense hiss with drops, rounded under 2.4 kHz"""
    n = int(dur * SR)
    hiss = filt(pink(n), "band", (300, 2200)) * 0.5
    drops = filt(noise(n) * (rng.random(n) < 0.002), "band", (500, 2000)) * 3
    return (hiss + drops) * env_ar(n, 0.8, 1.2) * gain


def rumble(dur, gain):
    """the shell slumping: a long, low crumbling roar"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = filt(pink(n), "band", (35, 380)) * (0.7 + 0.3 * np.sin(2 * np.pi * 3 * t))
    return x * env_ar(n, 0.15, dur * 0.7) * 1.2 * gain


def paddle(gain=1.0):
    return splash() * 0.35 * gain


# the cover: each tier of the bell locks in with a deep thud rising in pitch, the spire swells, the
# crown chimes
for k in range(7):
    add(sfx, stone(0.8), max(0.0, -0.3 + k * 0.14), pan=0.0, gain=0.9)
    add(sfx, blip(220 + k * 40, 0.4), max(0.0, -0.3 + k * 0.14) + 0.02, pan=-0.3 + k * 0.1)
add(sfx, whoosh(0.8, 0.5), 0.9, pan=0.0)
add(sfx, rise_tone(2.4, 1.1), 0.9, pan=0.0)
add(sfx, filt(bell(587, 3.0), "low", 2400), 1.45, pan=0.0, gain=0.35)
add(sfx, gong(73, 4.0, 0.45), 1.5, pan=0.0)
# the chedi settles to the town's scale and winds back to the brick shell: the builders start
add(sfx, whoosh(1.6, 0.4), 4.6, pan=0.1)
steps(5.6, collapse[0] + 1.0, 0.42, 0.3, pan=0.2)
for _ in range(10):
    add(sfx, trowel(0.6), rng.uniform(5.8, hero[1] + 4), pan=rng.uniform(-0.5, 0.5))
add(sfx, babble(canal[1] - 5.6, 0.6), 5.6, pan=-0.2, gain=0.25)
# the canal: spades, water let in, brick boats paddling up, a boatman's call
for _ in range(14):
    add(sfx, filt(drum(rng.uniform(150, 210), 90, 0.18, 0.6), "low", 1500), rng.uniform(canal[0], at(canal, 0.6)), pan=rng.uniform(0.1, 0.6), gain=0.5)
t = at(canal, 0.15)
while t < canal[1] - 0.1:
    add(sfx, paddle(1.0), t, pan=rng.uniform(-0.3, 0.4), gain=0.9)
    t += rng.uniform(0.38, 0.55)
add(sfx, filt(pink(int(1.2 * SR)), "band", (200, 900)) * env_ar(int(1.2 * SR), 0.3, 0.6) * 0.3, at(canal, 0.1), pan=0.3)
add(sfx, creak(0.5), at(canal, 0.5), pan=0.2, gain=0.3)
add(sfx, creak(0.6), at(canal, 0.8), pan=-0.1, gain=0.3)
# 2403: the rains, the shell slumps, bricks tumble, then quiet and the trowels start again
add(sfx, rain(collapse[1] - collapse[0] - 1.0, 0.55), collapse[0] - 0.2, pan=0.0)
add(sfx, filt(gong(55, 3.0, 0.3), "low", 400), collapse[0] + 0.1, pan=0.0)
add(sfx, rumble(2.4, 1.0), at(collapse, 0.22), pan=0.0)
for k in range(16):
    add(sfx, filt(drum(rng.uniform(140, 260), 80, 0.2, 0.6), "low", 1500), at(collapse, 0.26 + k * 0.018 + rng.uniform(0, 0.02)), pan=rng.uniform(-0.6, 0.6), gain=0.5)
add(sfx, babble(1.6, 1.4), at(collapse, 0.45), pan=0.3, gain=0.35)
for _ in range(6):
    add(sfx, trowel(0.6), rng.uniform(at(collapse, 0.75), collapse[1]), pan=rng.uniform(-0.5, 0.5))
# 2413: the bell relaid, the spire and the crown raised, the monks' chant swell and a gong
for k in range(7):
    add(sfx, stone(0.6), at(crown, 0.03 + k * 0.06), pan=-0.2 + k * 0.06)
add(sfx, rise_tone(2.2, 1.0), at(crown, 0.42), pan=0.0)
add(sfx, filt(bell(587, 3.0), "low", 2400), at(crown, 0.75), pan=0.0, gain=0.32)
add(sfx, gong(73, 4.0, 0.4), at(crown, 0.78), pan=0.0)
chings(at(crown, 0.8), crown[1], 0.22)
add(sfx, crowd(crown[1] - at(crown, 0.6)), at(crown, 0.6), pan=0.2, gain=0.2)
# 2446: the first train in from Bangkok, the market by the canal
t = train[0] + 0.2
while t < train[1] - 0.3:
    add(sfx, filt(chuff(), "low", 1800), t, pan=0.3, gain=1.1)
    t += 0.2
add(sfx, filt(steam_whistle(1.4), "low", 2000), train[0] + 0.5, pan=0.3, gain=0.7)
add(sfx, filt(steam_whistle(1.0), "low", 2000), at(train, 0.75), pan=0.2, gain=0.5)
add(sfx, crowd(train[1] - train[0]), train[0] + 0.5, pan=-0.2, gain=0.25)
add(sfx, babble(train[1] - train[0] - 1, 1.1), at(train, 0.3), pan=-0.3, gain=0.4)
for k in range(8):
    add(sfx, blip(rng.uniform(260, 420), 0.5), at(train, 0.1 + k * 0.1), pan=rng.uniform(-0.6, 0.6))
# Rama VI: the Wild Tiger Corps marching, a snare and bugle-ish khlui, the palace going up
steps(palace[0] + 0.1, at(palace, 0.92), 0.34, 0.55, pan=-0.1)
steps(palace[0] + 0.27, at(palace, 0.92), 0.34, 0.45, pan=0.15)
for t in np.arange(palace[0] + 0.1, at(palace, 0.92), BEAT / 2):
    add(sfx, drum(150, 110, 0.12, 0.5), t, pan=0.0, gain=0.22 if int(t / (BEAT / 2)) % 2 == 0 else 0.12)
for k in range(8):
    add(sfx, blip(rng.uniform(240, 380), 0.55), at(palace, 0.1 + k * 0.08), pan=rng.uniform(-0.6, 0.6))
# the town spreading: a pop per block, traffic
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
add(sfx, filt(pink(int(5 * SR)), "low", 600) * env_ar(int(5 * SR), 1.5, 1.5) * 0.25, at(grow, 0.4), pan=0.3)
# the payoff: the fair round the lit chedi: crowd, footsteps round the cloister, the wheel's creak,
# drums and ching, a gong at the end
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.32)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.5)
add(sfx, rise_tone(2.0, 1.0), pay[0] + 0.2, pan=0.0)
for t in np.arange(pay[0] + 0.4, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(80, 52, 0.4, 0.9), t, pan=-0.2, gain=0.24)
chings(pay[0] + 0.4, pay[1] - 0.2, 0.25)
for t in np.arange(at(pay, 0.2), pay[1] - 0.4, 1.3):
    add(sfx, creak(0.5), t, pan=0.4, gain=0.18)
steps(pay[0] + 0.3, pay[1] - 0.3, 0.3, 0.3, pan=-0.3)
add(sfx, gong(73, 3.0, 0.4), at(pay, 0.92), pan=0.0)

# ---------------------------------------------------------------- the gaps between beats


def bridge(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [hero, canal, collapse, crown, train, palace, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(73, 2.6, 0.2), b_[0], pan=0.05)

# finale: fireworks over the fair -- soft low pops and gongs
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.35)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.9
mix = master("public/soundtrack_nakhonpathom.wav", music, amb, sfx)
print("wrote public/soundtrack_nakhonpathom.wav", {"collapse": round(collapse[0], 2), "payoff": round(pay[0], 2)})
