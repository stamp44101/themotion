"""Chachoengsao (Paet Riu) soundtrack (60 s):
Bang Pakong river ambience, Luang Pho Sothon chimes, Rama III fortress cannons,
the 1848 Ang-Yi clash, and the 1908 Eastern Railway opening.

Run:  node scripts/export_timeline.mjs src/cities/chachoengsao/timeline.ts out/timeline_chachoengsao.json
      python3 scripts/soundtrack_chachoengsao.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_chachoengsao.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()

BEAT = 0.52
SCALE = [60, 62, 65, 67, 69, 72, 74, 77, 79, 81, 84]

t_taksin = tl.t_of(EV["taksinBattle"])
t_sothon = tl.t_of(EV["sothonArrives"])
t_fortress = tl.t_of(EV["fortressBuilt"])
t_angyi = tl.t_of(EV["angYiUprising"])
t_monthon = tl.t_of(EV["monthonFormed"])
t_rail = tl.t_of(EV["railwayOpens"])
t_marble = tl.t_of(EV["marbleUbosot"])

# ---------------------------------------------------------------- pads
PADS = [
    (0.0, 7.5, [48, 55, 60], 900),              # ancient delta mist
    (7.0, 13.5, [45, 52, 57], 1400),            # battle of Pak Nam Jolo
    (13.0, 20.0, [48, 55, 60, 64, 67], 2400),   # Luang Pho Sothon arrives
    (19.5, 27.5, [48, 55, 60, 65], 2000),       # Rama III fortress
    (27.0, 35.0, [41, 48, 53], 800),            # Ang-Yi conflict
    (34.5, 43.0, [50, 57, 62, 65, 69], 2200),   # Monthon Prachinburi era
    (42.5, 50.0, [48, 55, 60, 64], 2500),       # Railway & Talat Ban Mai
    (49.5, 60.0, [48, 55, 60, 64, 67, 72], 2600)# Modern marble temple & today
]
for t0, t1, notes, br in PADS:
    add(music, pad(notes, t1 - t0, br), t0, gain=0.55)


def ranat_run(t0, t1, step, amp, prob=1.0, low=2, high=10):
    i = 5
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), low, high))
            add(music, ranat(SCALE[i]), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


# Melodic traditional instruments
ranat_run(13.5, 19.5, BEAT / 2, 0.28, prob=0.85)  # Wat Sothon theme
ranat_run(20.0, 26.5, BEAT / 2, 0.26, prob=0.7)   # Fortress construction
ranat_run(36.0, 42.5, BEAT / 2, 0.28, prob=0.85)  # Monthon era
ranat_run(50.5, 57.0, BEAT / 2, 0.30, prob=0.8)   # Grand finale

# Khlui flute melodies
FLUTE = [
    (2.5, [72, 74, 77, 79, 77, 74], 0.7),
    (14.0, [79, 81, 84, 81, 79, 77, 74, 72], 0.6),  # Sacred theme
    (36.5, [72, 74, 77, 74, 72, 69, 72], 0.65),
    (51.0, [72, 74, 77, 79, 81, 84, 81, 79], 0.55),
]
for t0, notes, step in FLUTE:
    for k, m in enumerate(notes):
        add(music, khlui(m, step * 1.6), t0 + k * step, pan=-0.15, gain=0.95)

# Temple bell shimmer on Luang Pho Sothon reveal and modern marble temple
for k, t in enumerate(np.arange(t_sothon, t_sothon + 4.5, BEAT / 2)):
    add(music, bell(mtof([84, 81, 79, 77, 74, 72][k % 6]), 2.2, (1, 2.01, 3.92, 5.2), 1.5), t, pan=0.3 * np.sin(k), gain=0.25)
for k, t in enumerate(np.arange(t_marble, t_marble + 4.0, BEAT / 2)):
    add(music, bell(mtof([84, 81, 79, 77, 74, 72][k % 6]), 2.2, (1, 2.01, 3.92, 5.2), 1.5), t, pan=0.3 * np.sin(k), gain=0.22)

# Ching & percussion rhythm
for sec in ((13.5, 19.5), (35.5, 42.5), (50.5, 57.5)):
    for k, t in enumerate(np.arange(sec[0], sec[1], BEAT)):
        add(music, ching(), t + BEAT / 2, pan=0.3, gain=0.5 if k % 2 else 0.75)
        if k % 2 == 0:
            add(music, drum(115, 55, 0.45, 0.4), t)

# Battle drums for Pak Nam Jolo (1767) and Ang-Yi (1848)
for t in np.arange(t_taksin - 0.5, t_taksin + 4.0, BEAT / 2):
    add(music, drum(100, 48, 0.4, 0.55), t, pan=rng.uniform(-0.3, 0.3))
for t in np.arange(t_angyi - 0.5, t_angyi + 4.5, BEAT / 2):
    add(music, drum(95, 44, 0.42, 0.6), t, pan=rng.uniform(-0.4, 0.4))

# Gongs at milestone transitions
for t, f, g in (
    (0.15, 65, 0.9),
    (t_taksin, 75, 0.8),
    (t_sothon, 85, 1.0),
    (t_fortress, 80, 1.0),
    (t_monthon, 88, 0.8),
    (55.5, 68, 1.2),
):
    add(music, gong(f, 6.5, g), t)

# ---------------------------------------------------------------- ambience
# Wide, lazy tidal river flow (Bang Pakong)
river = filt(pink(N), "low", 900) * 0.55
add(amb, river * 0.06 * (1 - 0.3 * np.clip((Y - 1950) / 70, 0, 1)), 0, pan=-0.25)
add(amb, filt(noise(N), "band", (150, 700)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.08 * T)) * 0.03, 0, pan=0.25)

# Riverside bird chirps
t = 0.4
while t < 55.0:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (t_angyi - 0.5 < t < t_angyi + 4.0):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=0.9 if Y[i] < 1920 else 0.35)
    t += rng.exponential(0.38)

# Distant road & water transport in modern era
traffic = filt(pink(N), "low", 400) * 0.5 + filt(noise(N), "band", (450, 1400)) * 0.04
add(amb, traffic * np.clip((Y - 1960) / 45, 0, 1) * (1 - 0.5 * bump(T, 56, 60, 1.5)) * 0.05, 0)

# ---------------------------------------------------------------- SFX
# Pak Nam Jolo clashes (1767)
for _ in range(12):
    add(sfx, clash(), rng.uniform(t_taksin, t_taksin + 3.2), pan=rng.uniform(-0.6, 0.6))

# Water splashing for Luang Pho Sothon floating down river
for t in np.arange(t_sothon - 0.8, t_sothon + 2.0, 0.4):
    n = int(0.2 * SR)
    add(sfx, filt(noise(n), "band", (600, 2200)) * np.sin(np.pi * np.arange(n) / n) * 0.06, t, pan=rng.uniform(-0.3, 0.3))

# Rama III Fortress building knocks (1834)
for _ in range(35):
    t0 = rng.uniform(t_fortress - 0.5, t_fortress + 2.5)
    add(sfx, drum(rng.uniform(280, 480), 200, 0.12, 0.22), t0, pan=rng.uniform(-0.5, 0.5))

# Ang-Yi 1848 rebellion: cannons & firearms
for t in [t_angyi, t_angyi + 1.2, t_angyi + 2.4]:
    add(sfx, drum(55, 25, 1.2, 1.1), t, pan=rng.uniform(-0.3, 0.3))  # Deep cannon boom
    add(sfx, crackle(1.5), t, gain=0.8)
for _ in range(18):
    add(sfx, clash(), rng.uniform(t_angyi + 0.5, t_angyi + 3.8), pan=rng.uniform(-0.7, 0.7))

# 1908 Eastern Railway steam train arrival
t_steam = 44.0
add(sfx, steam_whistle(), t_steam + 0.3, pan=-0.5)
t_chuff = t_steam + 0.2
while t_chuff < t_steam + 4.5:
    p = (t_chuff - t_steam) / 4.5
    add(sfx, chuff(), t_chuff, pan=-0.8 + 1.6 * p, gain=np.sin(np.pi * p) ** 0.5)
    t_chuff += 0.24 - 0.05 * p

# Era change whooshes
for et in (7.0, 13.0, 19.5, 27.0, 35.0, 42.5, 49.5, 55.5):
    add(sfx, whoosh(1.0, 0.7), et - 0.7, pan=rng.uniform(-0.3, 0.3), gain=0.5)

# Finale fireworks
for i in range(15):
    add(sfx, firework_pop(), 55.5 + i * 0.28 + rng.uniform(0, 0.18), pan=rng.uniform(-0.8, 0.8), gain=0.5)

# Master output
mix = master("public/soundtrack_chachoengsao.wav", music, amb, sfx)
print("wrote public/soundtrack_chachoengsao.wav")
