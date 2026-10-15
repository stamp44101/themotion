"""Procedural 35-second score for the Wat Rai Khing landmark reel.

Central-Thai colours over the Tha Chin: a quiet river bed and birds for the
ginger fields, temple bells and khlui as the ubosot rises, paddled bamboo raft
and a pi reed line for the Luang Pho legend, a gong for the 1903 renaming, and
the night fair (crowd, ranat run, ching) for the finale.

  node scripts/export_timeline.mjs src/landmarks/watraikhing/timeline.ts out/timeline_watraikhing.json
  python3 scripts/soundtrack_watraikhing.py
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
import synth  # noqa: E402

synth.init(35)
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_watraikhing.json")
EV = tl.events
music, amb, sfx = stereo(), stereo(), stereo()

t_found = tl.t_of(EV["founded"])
t_raft = tl.t_of(EV["raft"])
t_renamed = tl.t_of(EV["renamed"])
t_fair = tl.t_of(EV["fair"])

PENTA = [60, 62, 64, 67, 69]  # central-Thai pentatonic on C


def scale(i):
    return PENTA[i % 5] + 12 * (i // 5)


# ---------------------------------------------------------------- river bed
river = filt(pink(N), "low", 520) * 0.020 + filt(noise(N), "band", (700, 2600)) * (0.005 + 0.004 * np.sin(2 * np.pi * 0.11 * T) ** 2)
add(amb, river, 0, pan=-0.25)
for t, p, g in ((1.2, -0.5, 0.55), (4.6, 0.35, 0.45), (7.1, -0.2, 0.35), (12.8, 0.5, 0.3), (23.4, -0.4, 0.3)):
    add(amb, chirp_bird(), t, pan=p, gain=g)

# ---------------------------------------------------------------- score
# Pad under everything; harmony shifts with each beat.
for t0, dur, notes in ((0, 8.8, [48, 55, 64]), (8.8, 6.4, [50, 57, 62]), (15.2, 6.6, [45, 52, 60]), (21.8, 5.2, [48, 55, 67]), (27.0, 8.0, [43, 50, 59, 62])):
    add(music, pad(notes, dur + 1.2, 1500), t0, gain=0.55)

# Khlui melody for the fields and the founding.
line = [(3.4, 4, 0.9), (4.4, 3, 0.6), (5.1, 2, 1.2), (6.6, 3, 0.7), (7.4, 4, 1.3), (9.2, 5, 1.0), (10.3, 4, 0.6), (11.0, 3, 0.8), (12.0, 2, 1.4), (13.6, 1, 1.2)]
for t, i, d in line:
    add(music, khlui(scale(i) + 12, d), t, pan=0.2, gain=0.9)

# Pi reed carries the raft legend.
for t, i, d in ((15.6, 3, 1.4), (17.1, 4, 0.8), (18.0, 5, 1.6), (19.8, 4, 1.0), (20.9, 3, 1.2)):
    add(music, pi_reed(scale(i) + 12, d), t, pan=-0.15, gain=0.75)

# Ranat run into the renaming, then a festive ranat pattern for the fair.
for k in range(10):
    add(music, ranat(scale(10 - k) + 12, 0.6), t_renamed - 1.0 + k * 0.1, pan=0.3, gain=0.6)
pattern = [5, 7, 6, 8, 7, 5, 6, 4]
for k, t in enumerate(np.arange(t_fair + 0.4, 34.0, 0.25)):
    add(music, ranat(scale(pattern[k % len(pattern)]) + 12, 0.5), t, pan=0.35 * np.sin(k), gain=0.42)
    if k % 4 == 0:
        add(music, ching(), t, pan=-0.3, gain=0.6)
    if k % 8 == 4:
        add(music, drum(110, 55, 0.6, 0.6), t, pan=0.0, gain=0.7)

# Gongs mark the founding, the raft's arrival and the renaming.
add(music, gong(88, 6.0, 0.9), t_found, pan=0.0)
add(music, gong(98, 5.0, 0.7), 19.6, pan=-0.2)
add(music, gong(78, 6.0, 1.0), t_renamed, pan=0.1)
add(music, gong(66, 7.0, 1.1), 31.0, pan=0.0)

# ---------------------------------------------------------------- foley
# Temple bells as the ubosot rises.
for t, f, g in ((t_found + 0.6, 690, 0.32), (t_found + 2.9, 920, 0.2), (t_found + 4.7, 690, 0.25)):
    add(sfx, bell(f, 3.5, ratios=(1, 2.03, 2.72, 4.18), decay=1.4), t, pan=-0.2, gain=g)

# The raft: poles in the water, bamboo creaks.
for i, t in enumerate(np.arange(t_raft + 0.3, 19.8, 0.95)):
    add(sfx, splash(), t + rng.uniform(-0.08, 0.08), pan=-0.6 + 0.25 * (i % 5), gain=0.6)
    if i % 2 == 0:
        add(sfx, creak(0.7), t + 0.3, pan=0.3, gain=0.45)

# Night fair: crowd swell and distant chatter.
add(amb, crowd(35.0 - t_fair), t_fair, pan=0.0, gain=0.09)
for t in (8.3, 14.9, 21.4, 26.6):
    add(sfx, whoosh(1.0, 0.7), t - 0.6, pan=rng.uniform(-0.3, 0.3), gain=0.4)

master("public/soundtrack_watraikhing.wav", music, amb, sfx)
print("wrote public/soundtrack_watraikhing.wav")
