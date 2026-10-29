"""Udon Thani soundtrack: an Isan palette (the khaen drone, the พิณ plucked soft, the pong lang) under a
small sound for everything that moves or appears: the jar rising out of the dig and its red scrolls
brushed on, the 1893 column of soldiers, carts and elephants coming down from Nong Khai and the camp
going up, a tok for each house of the town filling round the lake, the first train in from Khon Kaen,
the dragon dance and the market round the station, the planes on the airfield, the city spreading, and
the Thung Si Mueang fair with the jar lantern. All code; kept under ~2.4 kHz (the owner dislikes sharp
highs).

Run:  node scripts/export_timeline.mjs src/cities/udonthani/timeline.ts out/timeline_udonthani.json
      python3 scripts/soundtrack_udonthani.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402
import elephant_voices as ev  # noqa: E402

synth.init(json.load(open("out/timeline_udonthani.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_udonthani.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, camp, town, train, market, air, grow, pay, today = (
    B("hero"), B("camp"), B("town"), B("train"), B("market"), B("airfield"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (A minor pentatonic, 96 bpm)
BEAT = 60 / 96
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, D = [45, 52, 57], [48, 55, 60], [43, 50, 55], [50, 57, 62]

sections = (
    (0.0, camp[0], [45, 52, 57, 64], 1.0),
    (camp[0], town[1], Am, 0.85),
    (town[1], market[1], C, 0.85),
    (market[1], grow[0], G, 0.85),
    (grow[0], pay[0], D, 0.9),
    (pay[0], DUR, [45, 52, 57, 64, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, khaen(notes, t1 - t0 + 0.6, bright=2000), t0, gain=0.26 * lvl)


def phin(t0, t1, notes, amp, step=BEAT / 2, prob=0.85):
    """the พิณ, plucked soft: the chord's tones and the pentatonic in between, rounded at 2.4 kHz"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(pluck(PENTA[i], 0.7, 0.6), "low", 2400), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def ponglang(t0, t1, amp):
    """the pong lang's wooden bars, a lighter run"""
    t = t0
    i = 3
    while t < t1:
        i = int(np.clip(i + rng.choice([-1, 1, 1, -1, 2, -2]), 0, len(PENTA) - 1))
        add(music, filt(ranat(PENTA[i] + 12, 0.5), "low", 2400), t, pan=rng.uniform(-0.5, 0.5), gain=amp)
        t += BEAT / 2 * rng.choice([1, 1, 2])


phin(2.2, hero[1], Am, 0.14, prob=0.55)
phin(camp[0], town[1], Am, 0.16)
ponglang(train[0], market[1], 0.11)
phin(air[0], grow[1], G, 0.13, prob=0.7)
phin(pay[0] + 0.3, DUR - 3.0, Am, 0.17)
ponglang(pay[0] + 1.5, DUR - 3.0, 0.1)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
add(amb, filt(pink(N), "band", (150, 700)) * 0.25, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
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


def heavy_steps(t0, t1, every, gain, pan=0.0, f=52):
    t = t0
    while t < t1:
        add(sfx, drum(f + rng.uniform(-4, 4), 30, 0.5, 0.9), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.15, 0.15), gain=gain)
        t += every * rng.uniform(0.9, 1.1)


def rise_tone(dur, gain):
    """a soft swell of low voices and a glow, no sharp edge"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (45, 52, 57, 60, 64):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def earth(dur, gain):
    """earth giving way round the rising jar: a low crumbling wash"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = filt(pink(n), "band", (60, 500)) * (0.7 + 0.3 * filt(noise(n), "low", 12) * 6)
    return x * env_ar(n, 0.02, dur * 0.6) * 0.8 * gain


def brush(dur, gain):
    """the brush sweeping round the jar: soft swishes rising in pitch"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    sweep = 0.5 + 0.5 * np.sin(2 * np.pi * 3.2 * t) ** 2
    return filt(noise(n), "band", (400, 1800)) * sweep * env_ar(n, 0.05, 0.3) * 0.3 * gain


def hammer(gain=1.0):
    return filt(drum(rng.uniform(260, 380), 180, 0.12, 0.6), "low", 1800) * gain


def truck(dur=2.2, f=46):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.03 * np.sin(2 * np.pi * 0.5 * t))) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 16))
    return filt(x, "low", 1200, order=4) * env_ar(n, 0.5, 0.9) * 0.16


def props(dur, gain):
    """a twin-prop transport rolling and climbing: a low throbbing drone, rounded"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    f = 38 + 14 * p
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 12)) * (0.7 + 0.3 * np.sin(2 * np.pi * 9 * t))
    return filt(x, "low", 1100, order=4) * np.sin(np.pi * np.clip(p * 1.1, 0, 1)) * 0.2 * gain


# the cover: the earth giving, the jar rising, the brush going round, the ring running out
add(sfx, earth(1.2, 1.0), 0.0, pan=0.0)
add(sfx, drum(58, 32, 0.9, 1.0), 0.0, pan=0.0, gain=0.9)
add(sfx, drum(64, 36, 0.8, 1.0), 0.66, pan=0.0, gain=0.7)
add(sfx, brush(1.5, 1.0), 0.1, pan=-0.2)
for k in range(8):
    add(sfx, blip(300 + k * 30, 0.35), 0.15 + k * 0.18, pan=-0.5 + k * 0.14)
add(sfx, gong(98, 3.0, 0.4), 1.6, pan=0.0)
add(sfx, rise_tone(2.6, 1.0), 1.4, pan=0.0)
steps(1.8, hero[1] - 0.5, 0.5, 0.25, pan=0.3)  # the diggers at the rim
add(sfx, filt(bell(330, 2.5), "low", 2400), 4.6, pan=0.2, gain=0.2)
# 2436: the column down from Nong Khai: boots, two elephants, cart wheels, a drum, the camp going up
steps(camp[0], at(camp, 0.78), 0.22, 0.5, pan=0.1)
heavy_steps(camp[0] + 0.1, at(camp, 0.75), 0.38, 0.5, pan=-0.2)
add(sfx, ev.trumpet(0.8), at(camp, 0.15), pan=-0.3, gain=0.4)
for t in np.arange(camp[0] + 0.1, at(camp, 0.75), BEAT):
    add(sfx, drum(96, 60, 0.3, 0.7), t, pan=-0.1, gain=0.3)
for t in np.arange(at(camp, 0.3), at(camp, 0.8), 0.5):
    add(sfx, creak(0.4), t, pan=0.3, gain=0.25)
for k in range(10):
    add(sfx, hammer(0.6), at(camp, 0.6 + k * 0.035), pan=rng.uniform(-0.5, 0.5))
add(sfx, filt(bell(392, 1.6), "low", 2400), at(camp, 0.9), pan=0.0, gain=0.2)
add(sfx, babble(camp[1] - camp[0] - 0.6, 0.6), camp[0] + 0.3, pan=0.2, gain=0.3)
# the town filling round the lake: a soft tok for each house, mallets, a temple bell
t = town[0] + 0.3
while t < town[1] - 0.2:
    add(sfx, blip(rng.uniform(260, 420), 0.45), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.09)
for _ in range(14):
    add(sfx, hammer(0.5), rng.uniform(town[0] + 0.1, town[1] - 0.2), pan=rng.uniform(-0.6, 0.6))
add(sfx, filt(bell(330, 2.5), "low", 2400), at(town, 0.3), pan=-0.2, gain=0.25)
add(sfx, babble(town[1] - town[0] - 0.6, 0.8), town[0] + 0.3, pan=0.1, gain=0.3)
# 2484: the first train in from Khon Kaen: chuffs, the whistle, the crowd at the platform
t = train[0] + 0.2
while t < train[1] - 0.3:
    add(sfx, filt(chuff(), "low", 1800), t, pan=0.2, gain=1.1)
    t += 0.2
add(sfx, filt(steam_whistle(1.4), "low", 2000), train[0] + 0.6, pan=0.2, gain=0.7)
add(sfx, filt(steam_whistle(1.0), "low", 2000), at(train, 0.75), pan=0.3, gain=0.5)
add(sfx, crowd(train[1] - train[0]), train[0] + 0.5, pan=-0.2, gain=0.25)
add(sfx, babble(train[1] - train[0] - 1, 1.0), at(train, 0.3), pan=-0.3, gain=0.35)
# the market round the station: the dragon's drum and cymbals, voices, a bicycle bell
for t in np.arange(market[0] + 0.1, market[1] - 0.2, BEAT / 2):
    add(sfx, drum(110, 70, 0.25, 0.7), t, pan=0.1, gain=0.32 if int(t / (BEAT / 2)) % 2 == 0 else 0.18)
for t in np.arange(market[0] + 0.1, market[1] - 0.2, BEAT):
    add(sfx, filt(ching(), "low", 2400), t, pan=-0.2, gain=0.3)
add(sfx, crowd(market[1] - market[0]), market[0], pan=0.2, gain=0.28)
add(sfx, babble(market[1] - market[0] - 0.4, 1.2), market[0] + 0.2, pan=-0.2, gain=0.45)
for k in range(3):
    add(sfx, filt(bicycle_bell(), "low", 2400), at(market, 0.2 + k * 0.28), pan=0.4, gain=0.25)
# the air base years: planes rolling and climbing, a truck convoy, a pop per new block
for i in range(3):
    add(sfx, props(3.4, 1.0), air[0] + 0.2 + i * 2.2, pan=rng.uniform(-0.3, 0.3))
for i in range(3):
    add(sfx, truck(2.0, 44 + i * 3), at(air, 0.1 + i * 0.28), pan=rng.uniform(-0.3, 0.3), gain=0.6)
t = at(air, 0.1)
while t < air[1] - 0.2:
    add(sfx, blip(rng.uniform(220, 360), 0.45), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
# the city spreading: a pop per block, the modern train, traffic
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
add(sfx, truck(5.0, 40), grow[0] + 2, pan=0.4, gain=0.6)
# the payoff: the fair: the crowd, the khaen band, the jar lantern rising, a gong at the end
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.32)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.5)
add(sfx, earth(1.0, 0.6), pay[0] + 0.1, pan=0.0)
add(sfx, rise_tone(2.0, 1.0), pay[0] + 0.2, pan=0.0)
for t in np.arange(pay[0] + 0.4, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(80, 52, 0.4, 0.9), t, pan=-0.2, gain=0.26)
for k in range(5):
    add(sfx, filt(ching(), "low", 2400), at(pay, 0.1 + k * 0.18), pan=0.3, gain=0.3)
steps(pay[0] + 0.3, pay[1] - 0.3, 0.3, 0.3, pan=-0.3)
add(sfx, gong(98, 3.0, 0.4), at(pay, 0.92), pan=0.0)

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


order = [hero, camp, town, train, market, air, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)

# finale: lanterns rising -- soft low gongs
for i in range(5):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.2 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.9
mix = master("public/soundtrack_udonthani.wav", music, amb, sfx)
print("wrote public/soundtrack_udonthani.wav", {"train": round(train[0], 2), "payoff": round(pay[0], 2)})
