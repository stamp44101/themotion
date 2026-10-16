"""Explainer soundtrack: a quiet pad under the voice-free text, a soft bell at each scene.

Run:  python3 scripts/soundtrack_explainer.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
import synth  # noqa: E402

synth.init(60)
from synth import *  # noqa: E402,F403

music, amb, sfx = stereo(), stereo(), stereo()
SCENES = [0, 6, 14, 23, 32, 41, 50]
CHORDS = [[38, 45, 50], [38, 45, 50], [36, 43, 50], [41, 48, 53], [38, 45, 50], [36, 43, 48], [38, 50, 57, 62]]
for i, t0 in enumerate(SCENES):
    t1 = SCENES[i + 1] if i + 1 < len(SCENES) else 60
    add(music, pad(CHORDS[i], t1 - t0 + 1.2, 1100), t0, gain=0.32)
    add(sfx, bell(mtof(81 if i < 6 else 86), 2.6, (1, 2.0, 2.76, 4.07), 1.5), t0 + 0.15, pan=0.2, gain=0.16)
for k in range(5):  # closing flourish
    add(music, bell(mtof([81, 79, 76, 74, 69][k]), 2.4, (1, 2.01, 3.92), 1.4), 56.0 + k * 0.16, gain=0.14)
add(amb, filt(pink(N), "low", 500) * 0.012, 0)
master("public/soundtrack_explainer.wav", music, amb, sfx)
print("wrote public/soundtrack_explainer.wav")
