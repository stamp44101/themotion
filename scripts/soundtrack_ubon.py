"""Ubon soundtrack: an Isan palette (แคน drone, พิณ plucks, โปงลาง wood) round one tradition --
the candle -- with a small sound for everything that moves or appears, all code.

Run:  node scripts/export_timeline.mjs src/cities/ubon/timeline.ts out/timeline_ubon.json
      python3 scripts/soundtrack_ubon.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_ubon.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_ubon.json")
Y = tl.YEAR
EV = tl.events
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
naga, mig, flood, found, front, candle1, rail, grow, pay, today = (
    B("naga"), B("migration"), B("flood"), B("founding"), B("frontier"), B("firstcandle"), B("railway"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (A minor pentatonic, 112 bpm)
# a lai of the Mun: the khaen holds each era's chord; the flood drops to a bare fifth and goes
# quiet, so the clip keeps a real loudness range (Korat and Chiang Mai ~6 LU)
BEAT = 60 / 112
PENTA = [69, 72, 74, 76, 79, 81, 84, 86, 88]
Am, G, C, Em, F = [45, 52, 57], [43, 50, 55], [48, 55, 60], [40, 47, 52], [41, 48, 53]

# the cover: a low khaen swell and a struck gong as the naga wakes
add(music, khaen([33, 40, 45], naga[1] + 0.6, 1600), 0.0, gain=0.28)
add(sfx, gong(82, 5.0, 0.35), 0.15)
sections = (
    (naga[1] - 0.2, flood[0], Am, 1.0),
    (flood[0], flood[1], [45, 52], 0.45),  # the flood: only a fifth, half as loud
    (flood[1], front[0], C, 1.0),
    (front[0], candle1[0], Em, 0.9),
    (candle1[0], rail[1], G, 1.0),
    (rail[1], pay[0], F, 0.95),
    (pay[0], DUR, [45, 57, 64, 69, 76], 1.1),
)
for t0, t1, notes, lvl in sections:
    add(music, khaen(notes, t1 - t0 + 0.6), t0, gain=0.3 * lvl)
    if lvl < 0.6:
        continue
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        # พิณ: a pluck on the beat, the fifth on the off-beat
        add(music, pluck(notes[1] + 12, 0.6, 0.7), t, pan=-0.2, gain=0.24 * lvl)
        add(music, pluck(notes[2] + 12, 0.45, 0.6), t + BEAT / 2, pan=0.2, gain=0.14 * lvl)


def ponglang(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """โปงลาง phrases (struck wood) over the pentatonic."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        add(music, ranat(PENTA[i], 0.6), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step * rng.choice([1, 1, 2])


ponglang(naga[0] + 3.2, naga[1], BEAT, 0.16, low=2)
ponglang(found[0], found[1], BEAT / 2, 0.22)
ponglang(candle1[0], candle1[1], BEAT / 2, 0.24, low=2)
ponglang(pay[0], DUR - 2.5, BEAT / 2, 0.26, low=3)

# ---------------------------------------------------------------- ambience
# the river under everything, birds before the city, crickets at night, traffic late
add(amb, filt(pink(N), "band", (150, 700)) * 0.05, 0, pan=-0.3)
add(amb, filt(noise(N), "band", (200, 900)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * T)) * 0.03, 0, pan=0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2800), t, pan=rng.uniform(-0.8, 0.8), gain=1.6 if Y[i] < 1950 else 0.6)
    t += rng.exponential(0.5)
cr = np.sin(2 * np.pi * 4300 * T) * (np.sin(2 * np.pi * 27 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.6 * T) > 0.1).astype(float), "low", 40)
crickets = filt(cr, "low", 3000) * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.41 * SR)) * 0.8, 0, pan=0.6)
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1500)) * 0.05
add(amb, traffic * np.clip((Y - 1955) / 45, 0, 1) * 0.06, 0)

# ---------------------------------------------------------------- the small sounds


def blip(f=None, gain=1.0):
    """something going up: a soft, round wooden 'tok' with a falling pitch, no sharp top"""
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f0 = f or rng.uniform(320, 620)
    tone = np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 9)) / SR) * np.exp(-t * 26)
    knock = filt(noise(n), "band", (600, 2200)) * np.exp(-t * 90) * 0.25
    return (tone + knock) * 0.55 * gain


def babble(dur, density=1.0):
    """people talking nearby: voice-band noise chopped into syllables, kept under 2.5 kHz"""
    n = int(dur * SR)
    t = np.arange(n) / SR
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


def paddle(t0, t1, every, gain, pan=0.0):
    """a paddle drawn through the water: a soft swish that swells in and trails off, with the odd
    drip off the blade. It used to start in 20 ms and read as a knock ('ปั่กๆ', owner), so the
    attack is slow now and nothing in it is percussive."""
    t = t0
    while t < t1:
        d = rng.uniform(0.38, 0.55)
        n = int(d * SR)
        swish = filt(pink(n), "band", (220, 900)) * env_ar(n, d * 0.45, d * 0.5)
        add(sfx, swish * 0.32, t, pan=pan + rng.uniform(-0.3, 0.3), gain=gain)
        if rng.random() < 0.35:
            add(sfx, filt(splash(), "low", 1400) * 0.25, t + d * 0.7, pan=pan + rng.uniform(-0.3, 0.3), gain=gain)
        t += every * rng.uniform(1.0, 1.6)


def scales(t0, t1, gain):
    """the naga's body sliding: a soft scaly rasp that swells and fades, nothing above 2 kHz"""
    n = int((t1 - t0) * SR)
    x = filt(noise(n), "band", (180, 1800)) * (0.6 + 0.4 * np.sin(2 * np.pi * 1.3 * np.arange(n) / SR))
    add(sfx, x * env_ar(n, 0.4, 0.8) * 0.35, t0, pan=-0.1, gain=gain)


# the cover: the naga uncoils down the candle, its body sliding, a breath, into the water
scales(0.1, at(naga, 0.55), 0.8)
add(sfx, filt(pink(int(1.4 * SR)), "low", 300) * env_ar(int(1.4 * SR), 0.5, 0.8) * 0.6, 0.8, gain=0.4)
add(sfx, splash(), at(naga, 0.6), pan=0.1, gain=0.9)
add(sfx, whoosh(1.0, 0.7), at(naga, 0.55) - 0.4, gain=0.3)
paddle(at(naga, 0.45), naga[1] - 0.3, 0.55, 0.5, pan=-0.3)
add(sfx, splash(), naga[1] - 0.5, pan=-0.4, gain=0.7)  # it dives
# 2314: elephants' footfalls, carts creaking, rafts and poles, people talking
for t in np.arange(at(mig, 0.1), at(mig, 0.9), 0.5):
    add(sfx, drum(62, 36, 0.35, 0.9), t + rng.uniform(-0.04, 0.04), pan=-0.3, gain=0.4)
for t in np.arange(at(mig, 0.15), at(mig, 0.9), 0.7):
    add(sfx, creak(0.4), t, pan=rng.uniform(-0.6, -0.1), gain=0.35)
paddle(at(mig, 0.05), at(mig, 0.8), 0.45, 0.45, pan=0.3)
add(sfx, filt(trumpet_elephant(1.2), "low", 1800), at(mig, 0.4), pan=-0.3, gain=0.35)
add(sfx, babble(mig[1] - mig[0] - 1.0, 1.0), mig[0] + 0.5, pan=0.1, gain=0.55)
for k in range(6):
    add(sfx, blip(rng.uniform(260, 380), 0.8), at(mig, 0.55 + k * 0.05), pan=-0.2)  # the camp's huts
# the flood: rain and the river rising, the huts going under, paddles away
n = int((flood[1] - flood[0]) * SR)
add(amb, filt(noise(n), "band", (300, 2000)) * env_ar(n, 1.0, 1.4) * 0.12, flood[0], pan=0.0)
add(sfx, filt(pink(n), "low", 400) * env_ar(n, 1.6, 1.2) * 0.45, flood[0], pan=-0.2)
paddle(at(flood, 0.15), at(flood, 0.95), 0.4, 0.55, pan=0.2)
for k in range(5):
    add(sfx, filt(splash(), "low", 1500), at(flood, 0.1 + k * 0.06), pan=rng.uniform(-0.4, 0.4), gain=0.5)
# bees in the dong u phueng: a low hum under the end of the flood
n = int(2.6 * SR)
bee = np.sin(2 * np.pi * (220 + 8 * np.sin(2 * np.pi * 3 * np.arange(n) / SR)) * np.arange(n) / SR)
add(sfx, filt(bee, "low", 900) * env_ar(n, 0.8, 1.0) * 0.12, at(flood, 0.55), pan=0.3)
# 2335: a pop per house as it rises, the temple's bell, voices and hammers
for i in range(26):
    add(sfx, blip(gain=0.75), at(found, 0.04 + (i / 26) * 0.6 + 0.04), pan=rng.uniform(-0.6, 0.6))
add(sfx, bell(392, 3.0, ratios=(1, 2.0, 3.0), decay=1.2), at(found, 0.8), pan=0.3, gain=0.3)
add(sfx, babble(found[1] - found[0] - 1.5, 0.9), found[0] + 1.0, pan=-0.2, gain=0.45)
for _ in range(10):
    add(sfx, drum(rng.uniform(260, 420), 180, 0.1, 0.2), rng.uniform(at(found, 0.1), at(found, 0.9)), pan=rng.uniform(-0.5, 0.5))
# 2436: the commissioner's elephants and soldiers' feet, the office going up
for t in np.arange(at(front, 0.05), at(front, 0.85), 0.5):
    add(sfx, drum(64, 36, 0.35, 0.9), t, pan=-0.4 + 0.6 * (t - front[0]) / (front[1] - front[0]), gain=0.4)
steps(at(front, 0.1), at(front, 0.85), 0.3, 0.22, pan=-0.2)
for k in range(5):
    add(sfx, blip(rng.uniform(220, 320), 0.8), at(front, 0.4 + k * 0.08), pan=0.3)
add(sfx, filt(trumpet_elephant(1.0), "low", 1800), at(front, 0.3), pan=-0.4, gain=0.3)
# 2444: the first procession -- drums (กลองยาว), the carts' wheels, a crowd, a ching keeping time
for i, t in enumerate(np.arange(candle1[0] + 0.2, candle1[1] - 0.2, BEAT / 2)):
    add(sfx, drum(130, 70, 0.3, 0.7), t, pan=rng.uniform(-0.2, 0.2), gain=0.3 if i % 2 == 0 else 0.16)
for t in np.arange(candle1[0] + 0.2, candle1[1] - 0.2, BEAT * 2):
    add(sfx, filt(ching(), "low", 2600), t, pan=0.3, gain=0.35)
for t in np.arange(candle1[0] + 0.3, candle1[1], 0.8):
    add(sfx, creak(0.35), t, pan=rng.uniform(-0.5, 0.5), gain=0.3)
add(sfx, crowd(candle1[1] - candle1[0]), candle1[0], pan=0.1, gain=0.25)
add(sfx, babble(candle1[1] - candle1[0] - 0.5, 1.2), candle1[0] + 0.3, pan=-0.2, gain=0.55)
# 2473: the steam train into Warin, then the ferry boats across the Mun
trains = EV.get("trains", [])
if trains:
    s0 = trains[0]["t0"] + 0.1
    s1 = trains[0]["t0"] + trains[0]["dur"]
    t = s0
    while t < s1:
        p = (t - s0) / (s1 - s0)
        add(sfx, chuff(), t, pan=-0.6 + 1.0 * p, gain=0.8 - 0.3 * p)
        t += 0.2 + 0.14 * p
    add(sfx, filt(steam_whistle(), "low", 2400), s0 + 0.4, pan=-0.3, gain=0.8)
paddle(at(rail, 0.5), rail[1], 0.4, 0.5, pan=0.2)
add(sfx, babble(2.0, 0.8), at(rail, 0.55), pan=0.2, gain=0.4)
# 2497 on: the bridge going up, the jets far off (kept low and soft), the town's patter
for k in range(6):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.03), pan=0.0)
for i in range(3):
    n = int(2.2 * SR)
    add(sfx, filt(noise(n), "low", 700) * env_ar(n, 0.5, 1.4) * 0.3, at(grow, 0.16 + i * 0.07), pan=0.4 - i * 0.3, gain=0.6)
t = at(grow, 0.3)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
# the payoff: the naga rising out of the Mun, the procession's drums, khaen and crowd
add(sfx, splash(), at(pay, 0.08) + 0.3, pan=-0.2, gain=0.9)
scales(at(pay, 0.12), at(pay, 0.9), 0.7)
for i, t in enumerate(np.arange(pay[0] + 0.3, today[1], BEAT / 2)):
    add(sfx, drum(120, 62, 0.3, 0.7), t, pan=rng.uniform(-0.2, 0.2), gain=0.28 if i % 2 == 0 else 0.15)
for t in np.arange(pay[0] + 0.3, today[1], BEAT * 2):
    add(sfx, filt(ching(), "low", 2600), t, pan=-0.3, gain=0.3)
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.28)
add(sfx, babble(today[1] - pay[0], 1.3), pay[0] + 0.2, pan=-0.3, gain=0.9)
steps(pay[0] + 0.4, today[1], 0.24, 0.18, pan=0.3)

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


order = [naga, mig, flood, found, front, candle1, rail, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)

# finale: lanterns rising over the field -- soft low thumps and a last khaen chord
for i in range(5):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.2 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.6
mix = master("public/soundtrack_ubon.wav", music, amb, sfx)
print("wrote public/soundtrack_ubon.wav", {"flood": round(flood[0], 2), "payoff": round(pay[0], 2)})
