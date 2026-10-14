"""Procedural 60-second score and coastal soundscape for Chonburi.

The score follows the province's shoreline identity rather than using a
generic Thailand bed: wooden piers and oars, temple space, the 1767 eastern
fleet, Ang Sila's rock wash, buffalo-race percussion, Bang Saen leisure, and a
restrained modern-port finale. Every sound is synthesized here; no samples or
third-party recordings are required.

Run after exporting the city timeline:
  node scripts/export_timeline.mjs src/cities/chonburi/timeline.ts out/timeline_chonburi.json
  python3 scripts/soundtrack_chonburi.py
"""
import os
import sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_chonburi.json")
EV = tl.events
music, amb, sfx = stereo(), stereo(), stereo()

t_taksin = tl.t_of(EV["taksin"])
t_pier = tl.t_of(EV["fishingPier"])
t_angsila = tl.t_of(EV["angSila"])
t_buffalo = tl.t_of(EV["buffaloRace"])
t_bangsaen = tl.t_of(EV["bangSaen"])
t_modern = tl.t_of(EV["easternSeaboard"])


# ---------------------------------------------------------------- Coastal foley
def breaking_wave(dur=3.2, strength=1.0, rock=False):
    """A shaped shore break: low surge, foamy crest, then a long draw-back."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    rise = np.clip(p / 0.52, 0, 1) ** 2.2
    fall = np.exp(-np.maximum(0, p - 0.52) * (5.8 if rock else 4.2))
    env = rise * fall
    surge = filt(pink(n), "low", 240) * env * 0.10
    foam = filt(noise(n), "band", (380, 4200)) * env * (0.12 if rock else 0.095)
    hiss = filt(noise(n), "high", 3600) * np.exp(-np.maximum(0, p - 0.55) * 7) * rise * 0.022
    return (surge + foam + hiss) * strength


def sea_wind(dur=60.0):
    """Broad Gulf breeze with slow, irregular gusts rather than a short loop."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    gust = 0.48 + 0.22 * np.sin(2 * np.pi * 0.071 * t + 0.8)
    gust += 0.16 * np.sin(2 * np.pi * 0.037 * t + 2.1)
    body = filt(pink(n), "band", (90, 780)) * 0.020
    air = filt(noise(n), "band", (900, 4300)) * 0.006
    return (body + air) * np.clip(gust, 0.12, 0.9)


def gull_call():
    """Two distant coastal bird cries, kept low enough to avoid a stock loop."""
    dur = 1.15
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for start, base in ((0.05, 880), (0.58, 1040)):
        q = np.clip((t - start) / 0.34, 0, 1)
        env = np.sin(np.pi * q) ** 2 * ((t >= start) & (t <= start + 0.34))
        freq = base + 260 * np.sin(np.pi * q) - 130 * q
        phase = 2 * np.pi * np.cumsum(freq) / SR
        out += (np.sin(phase) + 0.22 * np.sin(2 * phase)) * env
    return out * 0.075


def paddle_stroke():
    n = int(0.75 * SR)
    t = np.arange(n) / SR
    dip = filt(noise(n), "band", (170, 1350)) * np.exp(-t * 7.5) * 0.12
    pull = filt(pink(n), "low", 320) * np.sin(np.pi * np.clip(t / 0.65, 0, 1)) ** 2 * 0.05
    return dip + pull


def wood_knock():
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 235 * t) + 0.42 * np.sin(2 * np.pi * 510 * t)
    return tone * np.exp(-t * 23) * 0.16


def stone_tap():
    return bell(rng.uniform(1150, 1650), 0.34, ratios=(1, 1.62, 2.78, 4.1), decay=13) * 0.20


def boat_horn(dur=2.8):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vibrato = 1 + 0.002 * np.sin(2 * np.pi * 4.1 * t)
    phase = 2 * np.pi * np.cumsum(92 * vibrato) / SR
    tone = np.sin(phase) + 0.52 * np.sin(2 * phase) + 0.18 * np.sin(3 * phase)
    return tone * env_ar(n, 0.32, 0.75) * 0.16


def hoof_cluster(speed=1.0):
    dur = 1.25
    n = int(dur * SR)
    out = np.zeros(n)
    for i, at in enumerate((0.02, 0.22, 0.58, 0.76)):
        hit = drum(78 + i * 5, 34, 0.34, 0.44)
        grit = filt(noise(len(hit)), "band", (180, 950)) * np.exp(-np.arange(len(hit)) / SR * 18) * 0.055
        pos = int((at / speed) * SR)
        end = min(n, pos + len(hit))
        out[pos:end] += (hit + grit)[: end - pos]
    return out

# Warm central-Thai harmony, opening sparse and widening with the city. The
# brighter final chords leave room for Bang Saen's relaxed plucked rhythm.
PADS = [
    (0.0, 9.0, [43, 50, 55, 62], 1100),
    (8.5, 15.5, [45, 52, 57, 60, 64], 1450),
    (15.0, 22.5, [38, 45, 50, 55], 900),
    (22.0, 29.0, [43, 50, 55, 59, 62], 1650),
    (28.5, 35.5, [45, 52, 57, 62, 64], 1900),
    (35.0, 42.5, [43, 50, 55, 59, 62], 2200),
    (42.0, 50.0, [48, 55, 60, 64, 67], 2500),
    (49.5, 60.0, [50, 57, 62, 66, 69, 74], 2900),
]
for t0, t1, notes, bright in PADS:
    add(music, pad(notes, t1 - t0, bright), t0, gain=0.52)

# Khlui carries the coast and old temple themes.
for t0, notes, step in [
    (2.8, [67, 69, 72, 74, 72, 69, 67], 0.72),
    (9.3, [72, 74, 76, 79, 76, 74, 72], 0.62),
    (29.2, [69, 72, 74, 76, 74, 72], 0.58),
    (43.0, [72, 76, 79, 81, 79, 76, 72], 0.52),
]:
    for i, note in enumerate(notes):
        add(music, khlui(note, step * 1.45), t0 + i * step, pan=-0.22, gain=0.82)

# Plucked lines evoke the Thai-Chinese fishing community.
for t0, notes, step in [
    (22.5, [62, 67, 71, 74, 71, 67, 62], 0.36),
    (25.6, [67, 71, 74, 79, 74, 71, 67], 0.32),
    (50.4, [69, 74, 78, 81, 78, 74, 69], 0.28),
]:
    for i, note in enumerate(notes):
        add(music, pluck(note, step * 2.1, 1.15), t0 + i * step, pan=0.3 * np.sin(i), gain=0.78)

# A clean, unhurried seaside pulse for Bang Saen; still pentatonic, but less
# ceremonial than the old-town passages.
for bar in np.arange(43.0, 50.0, 1.4):
    for i, note in enumerate([60, 67, 72, 76]):
        add(music, pluck(note, 1.15, 0.78), bar + i * 0.19, pan=-0.18 + i * 0.12, gain=0.34)

# Ranat and ching lift the seaside and finale.
for t0 in (31.0, 45.0, 52.0):
    for i, note in enumerate([67, 69, 72, 74, 77, 79, 81]):
        add(music, ranat(note, 0.7), t0 + i * 0.24, pan=(-0.25 + i * 0.08), gain=0.24)
for t in np.arange(42.5, 55.0, 0.5):
    add(music, ching(), t, pan=0.2, gain=0.24)

# 1767 mobilisation and the buffalo-race pulse.
for t in np.arange(t_taksin, t_taksin + 5.2, 0.58):
    add(music, drum(105, 48, 0.55, 0.72), t, pan=-0.2)
    add(music, drum(145, 72, 0.3, 0.42), t + 0.28, pan=0.2)
for t in np.arange(t_buffalo, t_buffalo + 6.2, 0.34):
    add(music, drum(130, 62, 0.4, 0.7), t, pan=0.25 * np.sin(t * 2))
    if int((t - t_buffalo) / 0.34) % 3 == 2:
        add(music, ching(), t + 0.12, pan=0.35, gain=0.42)

for gt, gf, gain in [
    (0.25, 62, 0.8),
    (t_taksin, 72, 1.0),
    (t_angsila, 82, 0.75),
    (t_buffalo, 68, 0.9),
    (t_bangsaen, 76, 0.9),
    (t_modern, 58, 1.15),
    (55.6, 52, 1.25),
]:
    add(music, gong(gf, 6.0, gain), gt)

# Far water and Gulf breeze persist as a quiet acoustic horizon. Individual
# shore breaks supply movement, so the ambience never sounds like one loop.
far_surf = filt(pink(N), "low", 720) * 0.018
far_surf += filt(noise(N), "band", (260, 2200)) * (0.010 + 0.007 * np.sin(2 * np.pi * 0.093 * T) ** 2)
add(amb, far_surf, 0, pan=0.42)
add(amb, sea_wind(), 0, pan=-0.22, gain=0.82)

for t in (0.7, 4.2, 7.9, 11.7, 24.0, 29.1, 31.8, 34.0, 43.0, 46.0, 48.7, 53.1, 57.0):
    rocky = t_angsila - 0.4 <= t <= t_angsila + 6.2
    add(amb, breaking_wave(3.1, 1.12 if rocky else 0.82, rock=rocky), t, pan=0.52, gain=0.72)

# Sparse coastal birds, never at clockwork intervals.
for t, p, g in ((1.8, -0.55, 0.72), (6.3, 0.3, 0.48), (12.6, -0.25, 0.38), (30.8, 0.55, 0.32), (44.1, -0.48, 0.42), (48.0, 0.34, 0.40)):
    add(amb, gull_call(), t, pan=p, gain=g)

# Sri Phalo and Bang Pla Soi: timber, rigging, oars, and close water.
for t in (3.6, 5.2, 6.8, 23.0, 24.5, 26.1, 27.2):
    add(sfx, creak(0.8), t, pan=rng.uniform(-0.55, 0.55), gain=0.48)
    add(sfx, wood_knock(), t + 0.34, pan=rng.uniform(-0.45, 0.45), gain=0.52)
for t in np.arange(t_pier, t_pier + 5.8, 0.92):
    add(sfx, splash(), t + rng.uniform(-0.1, 0.1), pan=rng.uniform(0.1, 0.8), gain=0.55)

# Wat Yai breathes briefly between the waterfront and the mobilisation.
add(sfx, bell(690, 4.0, ratios=(1, 2.03, 2.72, 4.18), decay=1.35), 9.55, pan=-0.28, gain=0.34)
add(sfx, bell(920, 2.8, ratios=(1, 1.98, 3.02), decay=1.8), 12.25, pan=0.18, gain=0.18)

# The 1767 fleet is heard as coordinated paddling and working sail, not battle
# explosions: this beat is mobilisation, not a cannon scene.
for i, t in enumerate(np.arange(t_taksin + 0.25, t_taksin + 5.1, 0.72)):
    add(sfx, paddle_stroke(), t, pan=-0.55 + (i % 4) * 0.32, gain=0.74)
    if i % 2 == 0:
        add(sfx, creak(1.0), t + 0.18, pan=0.45, gain=0.45)

# Ang Sila: close water against stone with occasional masonry/stone texture.
for i, t in enumerate(np.arange(t_angsila + 0.5, t_angsila + 5.3, 1.15)):
    add(sfx, stone_tap(), t, pan=-0.35 + 0.18 * i, gain=0.42)

# Buffalo race: hoof cadence and a distant human swell support the long-drum
# pattern without turning the sequence into a generic stadium crowd.
add(amb, crowd(5.8), t_buffalo + 0.35, pan=0.0, gain=0.075)
for i, t in enumerate(np.arange(t_buffalo + 0.25, t_buffalo + 5.7, 0.62)):
    add(sfx, hoof_cluster(1.0 + i * 0.025), t, pan=-0.48 + (i % 4) * 0.3, gain=0.58)

# Bang Saen and the modern eastern coast: a restrained beach murmur, one
# distant working-vessel horn, then the existing flyover and finale fireworks.
add(amb, crowd(5.4), t_bangsaen + 1.0, pan=0.1, gain=0.035)
add(sfx, boat_horn(), t_modern + 0.8, pan=0.58, gain=0.48)
add(sfx, jet(4.2), 51.2, pan=-0.45, gain=0.18)
for i in range(18):
    add(sfx, firework_pop(), 55.5 + i * 0.23 + rng.uniform(0, 0.16), pan=rng.uniform(-0.8, 0.8), gain=0.5)
for t in (8.5, 15.3, 21.8, 28.6, 35.3, 42.2, 49.6, 55.3):
    add(sfx, whoosh(1.0, 0.7), t - 0.65, pan=rng.uniform(-0.3, 0.3), gain=0.48)

master("public/soundtrack_chonburi.wav", music, amb, sfx)
print("wrote public/soundtrack_chonburi.wav")
