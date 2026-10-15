"""Ayutthaya soundtrack (75 s): central-Thai classical colours + ambience + SFX.

Run:  node scripts/export_timeline.mjs src/cities/ayutthaya/timeline.ts out/timeline_ayutthaya.json
      python3 scripts/soundtrack_ayutthaya.py
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_ayutthaya.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_ayutthaya.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()

BEAT = 0.5
SCALE = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84]  # pentatonic on C
fall = tl.t_of(EV["fall"])
first_fall = tl.t_of(EV["firstFall"])
naresuan = tl.t_of(EV["naresuan"])
SHIFT = EV["finaleShift"]

# drones / pads by section
PADS = [
    (0.0, 10.0, [48, 55, 60], 1400),
    (10.0, 24.0, [48, 55, 60, 64], 2000),
    (24.0, 37.8, [53, 60, 64, 69], 2200),
    (37.8, 44.6, [45, 52, 57], 900),
    (44.6, 58.0, [48, 55, 60, 67], 2400),
    (58.0, 64.2, [36, 43, 48], 700),
    (64.2, 75.0, [48, 55, 60, 64, 67], 2600),
]
for t0, t1, notes, br in PADS:
    add(music, pad(notes, t1 - t0, br), t0, gain=0.5)


def ranat_run(t0, t1, step, amp, prob=1.0, low=2, high=10):
    i = 5
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), low, high))
            add(music, ranat(SCALE[i]), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
            add(music, ranat(SCALE[i] - 12), t, pan=rng.uniform(-0.4, 0.4), gain=amp * 0.35)
        t += step


ranat_run(3.8, 15.8, BEAT / 2, 0.3, prob=0.7)
ranat_run(17.0, 36.6, BEAT / 2, 0.32, prob=0.85)
ranat_run(44.6, 57.0, BEAT / 2, 0.32, prob=0.9)
ranat_run(64.2, 70.0, BEAT / 2, 0.3, prob=0.8)
ranat_run(70.0, 74.0, BEAT / 4, 0.28, prob=0.9)

# pi nai phrases over the golden ages, a lament over the ruins
for t0, notes in ((17.0, [72, 74, 76, 79, 76]), (31.0, [79, 76, 74, 72, 74]), (45.0, [76, 79, 81, 79, 76]), (52.0, [72, 76, 79, 81]), (fall + 2.0, [67, 64, 62, 60])):
    for k, m in enumerate(notes):
        add(music, pi_reed(m, 1.1 if t0 < fall else 1.6), t0 + k * (1.0 if t0 < fall else 1.5), gain=0.8)

# ching keeps time; taphon/klong drums
for sec in ((3.8, 37.8), (44.6, 58.0), (64.2, 74.0)):
    for k, t in enumerate(np.arange(sec[0], sec[1], BEAT)):
        add(music, ching(), t + BEAT / 2, pan=0.3, gain=0.55 if k % 2 else 0.8)
        if k % 2 == 0:
            add(music, drum(120, 60, 0.5, 0.45), t)
for t in np.arange(37.8, naresuan + 0.5, BEAT / 2):
    add(music, drum(rng.uniform(110, 160), 60, 0.4, 0.5), t, pan=rng.uniform(-0.4, 0.4))

for t, f, g in (
    (0.15, 70, 1.0),
    (tl.t_of(EV["founding"]), 88, 1.1),
    (tl.t_of(EV["phanan"]), 92, 0.9),
    *[(tl.t_of(y), 96, 0.6) for y in EV["chedis"]],
    (first_fall, 66, 0.9),
    (naresuan + 0.4, 84, 1.1),
    (tl.t_of(EV["chaiwat"]), 92, 0.9),
    (fall, 60, 1.3),
    (tl.t_of(EV["heritage"]), 88, 1.0),
    (56.0 + SHIFT, 70, 1.2),
):
    add(music, gong(f, 7, g), t)

# duck the music during the fall
music *= (1 - 0.6 * bump(T, fall - 0.6, fall + 3.5, 0.5))[:, None]

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "low", 1200) * 0.07 * (1 - 0.3 * np.clip((Y - 1950) / 70, 0, 1)), 0, pan=0.2)
add(amb, filt(noise(N), "band", (180, 800)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * T)) * 0.03, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (fall - 1 < t < fall + 4):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.4)
    t += rng.exponential(0.34)
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)
add(amb, filt(pink(N), "low", 450) * 0.6 * np.clip((Y - 1960) / 50, 0, 1) * 0.04, 0)

# ---------------------------------------------------------------- sfx
r0, r1 = EV["riverDive"]
for _ in range(14):
    add(sfx, splash(), rng.uniform(r0, r1), pan=rng.uniform(-0.6, 0.6))
add(sfx, crowd(r1 - r0) * 0.35, r0)

for y in EV["chedis"]:
    add(sfx, bell(rng.uniform(900, 1300), 2.5), tl.t_of(y) + 0.2, pan=rng.uniform(-0.5, 0.5), gain=0.3)

f0 = first_fall - 0.4
add(sfx, crackle(2.6) * env_ar(int(2.6 * SR), 0.3, 0.8), f0, gain=0.6)

fort0, fort1 = EV["fortDive"]
for t in np.arange(fort0 + 0.4, fort1 - 0.5, 0.7):
    add(sfx, drum(rng.uniform(72, 105), 38, 0.9, 0.65), t, pan=rng.uniform(-0.5, 0.5))
add(sfx, crowd(fort1 - fort0) * 0.35, fort0)

p0, p1 = EV["portDive"]
add(sfx, crowd(p1 - p0) * 0.6, p0)
for k in range(4):
    add(sfx, bell(880, 1.6, ratios=(1, 2.4, 3.9), decay=2.2), p0 + 0.6 + k * 1.2, pan=0.5, gain=0.3)
for _ in range(8):
    add(sfx, creak(), rng.uniform(p0, p1), pan=rng.uniform(-0.7, 0.7))
for _ in range(10):
    add(sfx, splash(), rng.uniform(p0, p1), pan=rng.uniform(-0.6, 0.6), gain=0.6)

# 7 April 1767
fa, fb = fall - 0.8, fall + 3.2
add(sfx, crackle(fb - fa) * env_ar(int((fb - fa) * SR), 0.5, 1.0), fa, gain=1.1)
roar_ = filt(noise(int((fb - fa) * SR)), "low", 300) * env_ar(int((fb - fa) * SR), 0.6, 1.0) * 0.35
add(sfx, roar_, fa)
for k in range(5):
    cn = int(1.8 * SR)
    ct = np.arange(cn) / SR
    collapse = (filt(noise(cn), "low", 1200) * 0.7 + filt(noise(cn), "band", (60, 260)) * 1.4) * np.exp(-ct * 2.6)
    add(sfx, collapse * 0.45, fall + 0.3 + k * 0.6, pan=rng.uniform(-0.6, 0.6))

d0, d1 = EV["todayDive"]
for _ in range(6):
    add(sfx, bicycle_bell(), rng.uniform(d0, d1), pan=rng.uniform(-0.7, 0.7))
add(sfx, crowd(d1 - d0) * 0.4, d0)
tn = int(1.6 * SR)
tt = np.arange(tn) / SR
add(sfx, filt(np.sign(np.sin(2 * np.pi * (34 + 6 * tt) * tt)), "low", 900) * np.sin(np.pi * tt / 1.6) * 0.04, d0 + 1.0, pan=0.4)
add(sfx, trumpet_elephant(0.9), d0 + 2.2, pan=-0.4, gain=0.5)

for et in (3.8, 10.0, 17.0, 24.0, 30.8, 37.8, 44.6, 51.4, 58.0, 64.2, 67.8, 56.0 + SHIFT):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.55)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.6)
for i in range(16):
    add(sfx, firework_pop(), 55.4 + SHIFT + i * 0.28 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.5)

master("public/soundtrack_ayutthaya.wav", music, amb, sfx)
print("wrote public/soundtrack_ayutthaya.wav", {"founding": round(tl.t_of(1350), 2), "naresuan": round(naresuan, 2), "fall": round(fall, 2)})
