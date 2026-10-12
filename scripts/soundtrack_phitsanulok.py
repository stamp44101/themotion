"""Phitsanulok soundtrack (75 s): central-Thai court colours — pi reed, ranat,
khong wong, klong — plus river ambience, the 1775 sack and the 1957 fire.

Run:  node scripts/export_timeline.mjs src/cities/phitsanulok/timeline.ts out/timeline_phitsanulok.json
      python3 scripts/soundtrack_phitsanulok.py
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_phitsanulok.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_phitsanulok.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()

BEAT = 0.58
# C pentatonic — a touch darker than Sukhothai's D, this story ends in fire
SCALE = [60, 62, 65, 67, 69, 72, 74, 77, 79, 81, 84]

t_chinnarat = tl.t_of(EV["chinnarat"])
t_capital = tl.t_of(EV["capital"])
t_naresuan = tl.t_of(EV["naresuanBorn"])
t_falls = tl.t_of(EV["ayutthayaFalls"])
t_siege = tl.t_of(EV["siege"])
t_fire = tl.t_of(EV["greatFire"])

# ---------------------------------------------------------------- pads
PADS = [
    (0.0, 8.2, [36, 43, 48], 800),            # river mist
    (8.0, 18.2, [48, 55, 60, 64], 1700),      # Khmer / Sukhothai
    (18.0, 29.2, [48, 55, 60, 64, 67], 2300), # the image is cast
    (29.0, 42.2, [50, 57, 62, 65, 69], 2600), # royal capital
    (42.0, 55.2, [48, 55, 60, 64], 2100),     # Naresuan
    (55.0, 61.2, [43, 50, 54], 700),          # war
    (61.0, 66.2, [41, 48, 51], 600),          # fire and ash
    (66.0, 75.0, [48, 55, 60, 64, 67], 2500), # rebuilt
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


ranat_run(12.0, 18.0, BEAT / 2, 0.24, prob=0.55)
ranat_run(23.0, 29.0, BEAT / 2, 0.28, prob=0.8)
ranat_run(29.0, 42.0, BEAT / 2, 0.30, prob=0.9)   # the capital years are the busiest
ranat_run(66.5, 74.0, BEAT / 2, 0.26, prob=0.7)

# pi reed carries the court and the lament; khlui the quiet stretches
REED = [
    (t_capital + 0.6, [67, 69, 72, 74, 72, 69], 0.62),
    (t_naresuan + 0.8, [72, 74, 77, 79, 77, 74, 72], 0.56),
    (t_siege + 0.4, [65, 62, 60, 57, 55], 0.95),   # falling line for the sack
]
for t0, notes, step in REED:
    for k, m in enumerate(notes):
        add(music, pi_reed(m, step * 1.5), t0 + k * step, pan=0.12, gain=0.85)

FLUTE = [
    (3.6, [72, 74, 77, 79, 77, 74], 0.72),
    (19.0, [79, 81, 84, 81, 79, 77, 74], 0.58),
    (t_fire + 2.2, [60, 62, 65, 62, 60], 1.0),      # after the ash
    (67.5, [72, 74, 77, 79, 81, 79, 77, 74, 72, 77], 0.54),
]
for t0, notes, step in FLUTE:
    for k, m in enumerate(notes):
        add(music, khlui(m, step * 1.6), t0 + k * step, pan=-0.12, gain=1.0)

# khong wong shimmer when the image is revealed
for k, t in enumerate(np.arange(t_chinnarat - 0.4, t_chinnarat + 4.4, BEAT / 2)):
    add(music, bell(mtof([84, 81, 79, 77, 74, 72][k % 6]), 2.2, (1, 2.01, 3.92, 5.2), 1.5), t, pan=0.3 * np.sin(k), gain=0.22)

# ching + klong keep time through the capital years and the modern finale
for sec in ((29.0, 42.0), (67.0, 74.0)):
    for k, t in enumerate(np.arange(sec[0], sec[1], BEAT)):
        add(music, ching(), t + BEAT / 2, pan=0.3, gain=0.5 if k % 2 else 0.75)
        if k % 2 == 0:
            add(music, drum(118, 56, 0.5, 0.42), t)

# war drums: faster, lower, no ching
for t in np.arange(t_falls - 0.5, t_siege + 1.5, BEAT / 2):
    add(music, drum(96, 44, 0.42, 0.55), t, pan=rng.uniform(-0.3, 0.3))

for t, f, g in (
    (0.15, 62, 0.9),
    (tl.t_of(EV["khmer"]), 72, 0.6),
    (t_chinnarat, 92, 1.15),            # the image
    (t_capital, 86, 1.1),               # the capital
    (tl.t_of(EV["capitalBack"]), 70, 0.7),
    (t_naresuan, 96, 1.0),
    (t_falls, 58, 1.1),                 # low gong for the fall
    (t_fire, 52, 1.2),                  # lower still for the fire
    (68.5, 82, 1.0),
):
    add(music, gong(f, 7, g), t)

# ---------------------------------------------------------------- ambience
# two rivers: a wider, wetter bed than the other cities
add(amb, filt(noise(N), "band", (160, 900)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.08 * T)) * 0.038, 0, pan=-0.35)
add(amb, filt(pink(N), "low", 850) * 0.04, 0, pan=0.45)

t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1960 else 0.6)
    t += rng.exponential(0.34)

car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)

# ---------------------------------------------------------------- sfx
# the confluence: water and boats
r0, r1 = EV["riverDive"]
for _ in range(9):
    add(sfx, splash(), rng.uniform(r0, r1), pan=rng.uniform(-0.7, 0.7), gain=0.5)
for _ in range(5):
    add(sfx, creak(), rng.uniform(r0, r1 + 2), pan=rng.uniform(-0.6, 0.6), gain=0.45)

# the royal market
m0, m1 = EV["marketDive"]
add(sfx, crowd(m1 - m0) * 0.55, m0)
add(sfx, trumpet_elephant(1.0), m0 + 1.3, pan=0.4, gain=0.6)
for _ in range(8):
    add(sfx, clink(), rng.uniform(m0, m1), pan=rng.uniform(-0.6, 0.6))

# building the walls under Trailokanat
for _ in range(34):
    add(sfx, drum(rng.uniform(300, 520), 220, 0.12, 0.22), rng.uniform(tl.t_of(1455), tl.t_of(1468)), pan=rng.uniform(-0.6, 0.6))

# temple bell at the casting of the image
add(sfx, bell(1500, 2.4), t_chinnarat + 0.15, pan=0.2, gain=0.35)
add(sfx, bell(1120, 3.0), t_chinnarat + 0.9, pan=-0.25, gain=0.28)

# the sack of 1775: clash, fire, collapse
for _ in range(14):
    add(sfx, clash(), rng.uniform(t_siege - 1.6, t_siege + 1.4), pan=rng.uniform(-0.8, 0.8), gain=0.5)
add(sfx, crackle(5.0) * env_ar(int(5.0 * SR), 0.6, 2.0) * 0.6, t_siege - 0.4)
add(sfx, drum(64, 30, 2.8, 1.0), t_siege + 0.2, gain=0.6)

# the railway reaches town
add(sfx, steam_whistle(1.4), 62.6, pan=-0.3, gain=0.5)
for k in range(16):
    add(sfx, chuff(), 62.9 + k * 0.26, pan=-0.2 + k * 0.02, gain=0.4)

# 2 Jan 1957 — the great fire: the loudest thing in the piece
add(sfx, crackle(7.0) * env_ar(int(7.0 * SR), 0.5, 3.0) * 0.95, t_fire - 1.0)
add(sfx, crowd(5.0) * 0.4, t_fire - 0.6)
add(sfx, drum(58, 26, 3.2, 1.0), t_fire, gain=0.7)
for _ in range(7):
    add(sfx, clash(), rng.uniform(t_fire, t_fire + 3.0), pan=rng.uniform(-0.8, 0.8), gain=0.35)

# today
d0, d1 = EV["todayDive"]
add(sfx, crowd(d1 - d0) * 0.35, d0)
for _ in range(6):
    add(sfx, bicycle_bell(), rng.uniform(d0, d1), pan=rng.uniform(-0.7, 0.7))
add(sfx, jet(3.0) * 0.3, 70.5, pan=0.5)

# Loy Krathong night on the Nan
n0, n1 = EV["night"]
add(sfx, filt(pink(int((n1 - n0) * SR)), "low", 800) * env_ar(int((n1 - n0) * SR), 1.0, 1.5) * 0.08, n0)
add(sfx, crowd(max(0.5, n1 - n0 - 2)) * 0.25, n0 + 1)
for i in range(8):
    add(sfx, firework_pop(), 71.2 + i * 0.5 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.45)

# era transitions
for et in (3.0, 8.0, 12.0, 29.0, 42.0, 55.0, 61.0, 66.0):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.5)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.5)

master("public/soundtrack_phitsanulok.wav", music, amb, sfx)
print(
    "wrote public/soundtrack_phitsanulok.wav",
    {
        "chinnarat": round(t_chinnarat, 2),
        "capital": round(t_capital, 2),
        "naresuan": round(t_naresuan, 2),
        "siege": round(t_siege, 2),
        "fire": round(t_fire, 2),
    },
)
