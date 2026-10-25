"""Lopburi soundtrack: a central-Thai palette (ขลุ่ย flute, ระนาด rounded off, ฆ้อง and ฉิ่ง) under a
small sound for everything that moves or appears: Hanuman's leaps, the troop's chatter, elephants,
boats, the palace going up, the water in the pipes, the train, the buffet. All code.

Run:  node scripts/export_timeline.mjs src/cities/lopburi/timeline.ts out/timeline_lopburi.json
      python3 scripts/soundtrack_lopburi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_lopburi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_lopburi.json")
Y = tl.YEAR
EV = tl.events
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
leg, lavo, ele, prang, narai, fr, fade, rail, grow, pay, today = (
    B("legend"), B("lavo"), B("elephants"), B("prang"), B("narai"), B("french"), B("fade"), B("railway"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (D pentatonic, 104 bpm)
BEAT = 60 / 104
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]
D, G, A, Bm, Em = [50, 57, 62], [43, 50, 55], [45, 52, 57], [47, 54, 59], [40, 47, 52]

add(music, pad([38, 45, 50], leg[1] + 0.8, 1200), 0.0, gain=0.3)
add(sfx, gong(82, 5.0, 0.35), 0.15)
sections = (
    (leg[1] - 0.2, ele[1], D, 0.9),
    (ele[1], narai[0], Em, 0.9),
    (narai[0], fade[0], G, 1.0),
    (fade[0], fade[1], [45, 52], 0.45),  # the abandoned town: a bare fifth, half as loud
    (fade[1], grow[0], A, 0.95),
    (grow[0], pay[0], Bm, 0.95),
    (pay[0], DUR, [38, 50, 57, 62, 66], 1.1),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, 1400), t0, gain=0.3 * lvl)
    if lvl < 0.6:
        continue
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        add(music, pluck(notes[1] + 12, 0.6, 0.6), t, pan=-0.2, gain=0.2 * lvl)


def ranat_soft(m, dur=0.6):
    """ระนาด rounded off above 2.4 kHz: its top partial and mallet click read as harsh"""
    return filt(ranat(m, dur), "low", 2400, order=4)


def ranat_line(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        add(music, ranat_soft(PENTA[i]), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step * rng.choice([1, 1, 2])


def flute(t0, t1, amp):
    """ขลุ่ย phrases: long notes over the pentatonic"""
    i = 4
    t = t0
    while t < t1 - 0.4:
        i = int(np.clip(i + rng.choice([-1, -1, 0, 1, 1]), 1, len(PENTA) - 2))
        d = BEAT * rng.choice([1, 2, 2, 3])
        add(music, filt(khlui(PENTA[i] - 12, d), "low", 2600), t, pan=0.15, gain=amp)
        t += d


ranat_line(lavo[0], lavo[1], BEAT / 2, 0.18)
flute(prang[0], prang[1], 0.2)
ranat_line(narai[0], fr[1], BEAT / 2, 0.22, low=2)
flute(fade[0] + 0.2, fade[1], 0.16)
ranat_line(pay[0], DUR - 2.5, BEAT / 2, 0.24, low=3)

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "band", (150, 700)) * 0.05, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2800), t, pan=rng.uniform(-0.8, 0.8), gain=1.4 if Y[i] < 1937 else 0.5)
    t += rng.exponential(0.55)
cr = np.sin(2 * np.pi * 4300 * T) * (np.sin(2 * np.pi * 27 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.6 * T) > 0.1).astype(float), "low", 40)
crickets = filt(cr, "low", 3000) * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03
add(amb, crickets, 0, pan=-0.5)
traffic = filt(pink(N), "low", 450) * 0.6
add(amb, traffic * np.clip((Y - 1950) / 50, 0, 1) * 0.06, 0)

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
    t = np.arange(n) / SR
    syl = np.zeros(n)
    k = 0
    while k < n:
        L = int(rng.uniform(0.08, 0.22) * SR)
        syl[k : k + L] = rng.uniform(0.3, 1.0) * np.hanning(min(L, n - k))
        k += L + int(rng.exponential(0.06 / density) * SR)
    v = filt(noise(n), "band", (250, 1100)) + 0.5 * filt(noise(n), "band", (1200, 2400))
    return v * filt(syl, "low", 30) * env_ar(n, 0.3, 0.5) * 0.6


def chatter(dur, density=1.0):
    """the troop: short rounded 'ook' calls that slide up and down, kept under ~1.6 kHz"""
    n = int(dur * SR)
    out = np.zeros(n)
    t = 0.0
    while t < dur - 0.25:
        d = rng.uniform(0.07, 0.16)
        m = int(d * SR)
        tt = np.arange(m) / SR
        f0 = rng.uniform(420, 820)
        sweep = f0 * (1 + rng.uniform(-0.35, 0.35) * tt / d)
        call = np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.sin(np.pi * tt / d) ** 2
        i0 = int(t * SR)
        out[i0 : i0 + m] += call * rng.uniform(0.4, 1.0)
        t += rng.exponential(0.12 / density) + d
    return filt(out, "low", 1600, order=4) * 0.35


def steps(t0, t1, every, gain, pan=0.0):
    t = t0
    while t < t1:
        add(sfx, filt(footstep(gain), "low", 900), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.2, 0.2))
        t += every * rng.uniform(0.85, 1.15)


def paddle(t0, t1, every, gain, pan=0.0):
    t = t0
    while t < t1:
        d = rng.uniform(0.38, 0.55)
        n = int(d * SR)
        swish = filt(pink(n), "band", (220, 900)) * env_ar(n, d * 0.45, d * 0.5)
        add(sfx, swish * 0.18, t, pan=pan + rng.uniform(-0.3, 0.3), gain=gain)
        t += every * rng.uniform(1.0, 1.6)


def leap(t0, dur, gain):
    """Hanuman's leap: a low rushing swell, no hiss on top"""
    n = int(dur * SR)
    x = filt(pink(n), "band", (80, 700), order=4) * env_ar(n, dur * 0.6, dur * 0.35)
    add(sfx, x * 0.6, t0, pan=0.1, gain=gain)


def thump(t0, gain):
    add(sfx, drum(70, 32, 0.6, 1.0), t0, gain=gain)
    add(sfx, filt(noise(int(0.5 * SR)), "low", 500) * env_ar(int(0.5 * SR), 0.01, 0.4) * 0.5, t0, gain=gain * 0.6)


# the cover: Hanuman's leap and landing, the troop round him, the smelters' fires
leap(0.0, 2.5, 1.0)
thump(2.4, 0.9)
add(sfx, chatter(leg[1] - 1.0, 1.2), 0.6, pan=-0.2, gain=0.8)
add(sfx, crackle(leg[1] - 1.0), 0.6, pan=0.4, gain=0.25)
leap(7.0, 1.2, 0.7)
# Lavo: the stupa going up brick by brick, boats on the river
for i in range(14):
    add(sfx, blip(rng.uniform(260, 380), 0.6), at(lavo, 0.05 + i * 0.05), pan=rng.uniform(-0.4, 0.4))
paddle(at(lavo, 0.1), at(lavo, 0.95), 0.5, 0.5, pan=-0.3)
add(sfx, babble(lavo[1] - lavo[0] - 1.0, 0.7), lavo[0] + 0.5, pan=0.2, gain=0.4)
# 1155: the elephants' footfalls and a call, the junk's timbers, its sail going up
for t in np.arange(at(ele, 0.05), at(ele, 0.55), 0.45):
    add(sfx, drum(62, 36, 0.35, 0.9), t + rng.uniform(-0.04, 0.04), pan=-0.3, gain=0.45)
add(sfx, filt(trumpet_elephant(1.2), "low", 1800), at(ele, 0.25), pan=-0.2, gain=0.4)
for t in np.arange(at(ele, 0.5), ele[1], 0.6):
    add(sfx, creak(0.45), t, pan=0.3, gain=0.35)
n = int(1.2 * SR)
add(sfx, filt(pink(n), "band", (150, 900)) * env_ar(n, 0.3, 0.8) * 0.4, at(ele, 0.58), pan=0.3)
# the prang: laterite blocks set one by one, then the procession's drum, ching and chant
for i in range(18):
    add(sfx, blip(rng.uniform(200, 300), 0.7), at(prang, 0.02 + i * 0.019), pan=rng.uniform(-0.5, 0.5))
for i, t in enumerate(np.arange(at(prang, 0.4), prang[1], BEAT)):
    add(sfx, drum(110, 60, 0.4, 0.7), t, pan=0.1, gain=0.25)
for t in np.arange(at(prang, 0.4), prang[1], BEAT * 2):
    add(sfx, filt(ching(), "low", 2400), t, pan=0.3, gain=0.3)
add(sfx, filt(babble(prang[1] - at(prang, 0.4), 1.4), "low", 900), at(prang, 0.4), pan=-0.2, gain=0.6)
add(sfx, chatter(2.0, 0.6), at(prang, 0.1), pan=-0.5, gain=0.4)
# Narai: the palace walls and halls going up (a pop each), hammers, then water running down
# the clay pipe and the fountains springing
for i in range(22):
    add(sfx, blip(gain=0.7), at(narai, 0.02 + i * 0.022), pan=rng.uniform(-0.6, 0.6))
for _ in range(10):
    add(sfx, drum(rng.uniform(260, 420), 180, 0.1, 0.2), rng.uniform(at(narai, 0.05), at(narai, 0.5)), pan=rng.uniform(-0.5, 0.5))
n = int((narai[1] - at(narai, 0.25)) * SR)
gurgle = filt(pink(n), "band", (120, 600), order=4) * (0.6 + 0.4 * np.sin(2 * np.pi * 5 * np.arange(n) / SR))
add(sfx, gurgle * env_ar(n, 0.6, 0.6) * 0.5, at(narai, 0.25), pan=0.2)
n = int((narai[1] - at(narai, 0.7)) * SR)
add(sfx, filt(noise(n), "band", (300, 1600), order=4) * env_ar(n, 0.3, 0.4) * 0.12, at(narai, 0.7), pan=-0.1)
# 1685: the fleet's paddles and drums, the elephants on the bank, the crowd; then the eclipse:
# the sounds thin out and a low gong as the moon goes red
paddle(fr[0] + 0.2, at(fr, 0.75), 0.3, 0.6, pan=-0.2)
for i, t in enumerate(np.arange(fr[0] + 0.3, at(fr, 0.6), BEAT / 2)):
    add(sfx, drum(130, 70, 0.3, 0.7), t, pan=rng.uniform(-0.2, 0.2), gain=0.28 if i % 2 == 0 else 0.14)
add(sfx, filt(trumpet_elephant(1.0), "low", 1800), at(fr, 0.3), pan=0.4, gain=0.35)
add(sfx, crowd(at(fr, 0.6) - fr[0]), fr[0], pan=0.1, gain=0.25)
add(sfx, gong(73, 4.0, 0.45), at(fr, 0.6), pan=0.0)
add(sfx, bell(330, 3.0, ratios=(1, 2.0, 3.0), decay=1.2), at(fr, 0.75), pan=0.3, gain=0.2)
# the abandoned town: wind, a few calls from the troop moving in, then Rama IV's builders
n = int((fade[1] - fade[0]) * SR)
add(amb, filt(pink(n), "band", (120, 600)) * env_ar(n, 0.8, 0.8) * 0.18, fade[0])
add(sfx, chatter(fade[1] - fade[0] - 0.5, 0.7), fade[0] + 0.3, pan=0.3, gain=0.6)
for k in range(5):
    add(sfx, blip(rng.uniform(240, 320), 0.7), at(fade, 0.75 + k * 0.04), pan=-0.2)
# 2444: the steam train between the prang and ศาลพระกาฬ; the troop scatters
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
    add(sfx, chatter(1.6, 1.6), s0 + 0.8, pan=0.4, gain=0.7)
add(sfx, babble(2.0, 0.8), at(rail, 0.6), pan=0.2, gain=0.4)
# the new town: a pop per block, a bugle-like low horn from the camps (soft), the town's patter
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
# the payoff: Hanuman lands, the buffet: crowd, drums, ching, and the troop at the tables
leap(pay[0] + 0.2, 1.7, 0.8)
thump(pay[0] + 1.8, 0.7)
for i, t in enumerate(np.arange(pay[0] + 0.3, today[1], BEAT / 2)):
    add(sfx, drum(120, 62, 0.3, 0.7), t, pan=rng.uniform(-0.2, 0.2), gain=0.26 if i % 2 == 0 else 0.13)
for t in np.arange(pay[0] + 0.3, today[1], BEAT * 2):
    add(sfx, filt(ching(), "low", 2400), t, pan=-0.3, gain=0.28)
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.26)
add(sfx, chatter(today[1] - pay[0], 1.8), pay[0] + 0.3, pan=-0.2, gain=0.9)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.6)

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


order = [leg, lavo, ele, prang, narai, fr, fade, rail, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)

# finale: lanterns rising -- soft low gongs
for i in range(5):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.2 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.6
mix = master("public/soundtrack_lopburi.wav", music, amb, sfx)
print("wrote public/soundtrack_lopburi.wav", {"narai": round(narai[0], 2), "payoff": round(pay[0], 2)})
