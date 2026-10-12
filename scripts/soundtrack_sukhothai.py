"""Sukhothai soundtrack (75 s): gentle khlui / ranat / khong wong score, ambience and SFX.

Run:  node scripts/export_timeline.mjs src/cities/sukhothai/timeline.ts out/timeline_sukhothai.json
      python3 scripts/soundtrack_sukhothai.py
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_sukhothai.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_sukhothai.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()

BEAT = 0.55
SCALE = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86]  # D pentatonic, bright and serene
SHIFT = EV["finaleShift"]
merger = tl.t_of(EV["merger"])

PADS = [
    (0.0, 8.2, [38, 45, 50], 900),
    (8.0, 16.7, [50, 57, 62, 66], 2000),
    (16.5, 32.2, [50, 57, 62, 66, 69], 2400),
    (32.0, 41.2, [47, 54, 59, 62], 2000),
    (41.0, 51.2, [45, 52, 57], 1000),
    (51.0, 63.7, [50, 57, 62, 66], 2200),
    (63.5, 75.0, [43, 50, 55, 59, 62], 2600),
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
        t += step


ranat_run(8.2, 16.5, BEAT / 2, 0.26, prob=0.6)
ranat_run(16.5, 32.0, BEAT / 2, 0.3, prob=0.85)
ranat_run(32.0, 41.0, BEAT / 2, 0.26, prob=0.7)
ranat_run(51.0, 63.5, BEAT / 2, 0.26, prob=0.7)

# khlui flute melodies: dawn, golden age, the quiet ruins, and a Loy Krathong night song
FLUTE = [
    (3.4, [74, 76, 78, 81, 78, 76], 0.7),
    (17.0, [81, 83, 86, 83, 81, 78, 76], 0.55),
    (merger + 1.5, [74, 71, 69, 66, 64], 0.9),
    (55.5, [78, 81, 83, 81, 78], 0.6),
    (63.8, [74, 76, 78, 81, 83, 81, 78, 76, 74, 78, 81, 86], 0.5),
]
for t0, notes, step in FLUTE:
    for k, m in enumerate(notes):
        add(music, khlui(m, step * 1.6), t0 + k * step, pan=-0.1, gain=1.0)

# khong wong sparkle on the great monuments; ching and gentle drum keep time in the golden age
for k, t in enumerate(np.arange(22.0, 27.4, BEAT / 2)):
    add(music, bell(mtof([86, 83, 81, 78, 76, 74][k % 6]), 2.0, (1, 2.01, 3.92, 5.2), 1.4), t, pan=0.3 * np.sin(k), gain=0.2)
for sec in ((16.5, 32.0), (59.0, 63.5), (65.0, 72.0)):
    for k, t in enumerate(np.arange(sec[0], sec[1], BEAT)):
        add(music, ching(), t + BEAT / 2, pan=0.3, gain=0.5 if k % 2 else 0.75)
        if k % 2 == 0:
            add(music, drum(115, 58, 0.5, 0.4), t)

for t, f, g in (
    (0.15, 66, 0.9),
    (tl.t_of(EV["khmer"]), 74, 0.6),
    (tl.t_of(EV["founding"]), 88, 1.1),
    (tl.t_of(EV["script"]), 100, 0.8),
    (tl.t_of(EV["mahathat"][1]), 92, 0.8),
    (tl.t_of(EV["siChum"]), 80, 0.9),
    (merger, 62, 1.0),
    (tl.t_of(EV["heritage"]), 88, 1.0),
    (56.0 + SHIFT, 70, 1.1),
):
    add(music, gong(f, 7, g), t)

# ---------------------------------------------------------------- ambience
add(amb, filt(noise(N), "band", (180, 800)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * T)) * 0.03, 0, pan=-0.3)
add(amb, filt(pink(N), "low", 900) * 0.035, 0, pan=0.4)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1960 else 0.6)
    t += rng.exponential(0.32)
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)

# ---------------------------------------------------------------- sfx
m0, m1 = EV["marketDive"]
add(sfx, crowd(m1 - m0) * 0.55, m0)
add(sfx, trumpet_elephant(1.0), m0 + 1.2, pan=0.4, gain=0.6)
for _ in range(6):
    add(sfx, clink(), rng.uniform(m0, m1), pan=rng.uniform(-0.6, 0.6))

for _ in range(40):
    t0 = rng.uniform(tl.t_of(1250.5), tl.t_of(1257))
    add(sfx, drum(rng.uniform(300, 520), 220, 0.12, 0.22), t0, pan=rng.uniform(-0.6, 0.6))
add(sfx, bell(1500, 2.0), tl.t_of(EV["script"]) + 0.1, pan=0.2, gain=0.3)

k0, k1 = EV["kilnDive"]
add(sfx, crackle(k1 - k0) * env_ar(int((k1 - k0) * SR), 0.5, 0.8), k0, gain=0.7)
for _ in range(22):
    add(sfx, clink(), rng.uniform(k0, k1), pan=rng.uniform(-0.7, 0.7))
add(sfx, crowd(k1 - k0) * 0.3, k0)

d0, d1 = EV["todayDive"]
for _ in range(7):
    add(sfx, bicycle_bell(), rng.uniform(d0, d1), pan=rng.uniform(-0.7, 0.7))
add(sfx, crowd(d1 - d0) * 0.35, d0)

# Loy Krathong night: water, gentle crowd, then fireworks
n0, n1 = EV["night"]
add(sfx, filt(pink(int((n1 - n0) * SR)), "low", 800) * env_ar(int((n1 - n0) * SR), 1.0, 1.5) * 0.08, n0)
add(sfx, crowd(n1 - n0 - 2) * 0.25, n0 + 1)
for i in range(8):
    add(sfx, firework_pop(), 55.4 + SHIFT + i * 0.56 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.45)

for et in (3.0, 8.0, 16.5, 41.0, 51.0, 63.5, 56.0 + SHIFT):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.5)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.5)

master("public/soundtrack_sukhothai.wav", music, amb, sfx)
print("wrote public/soundtrack_sukhothai.wav", {"founding": round(tl.t_of(1249), 2), "script": round(tl.t_of(1283), 2), "merger": round(merger, 2)})
