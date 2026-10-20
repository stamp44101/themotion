"""Chiang Rai soundtrack: Lanna palette (ซึง, สะล้อ, ปี่จุม, กลองสะบัดชัย, ฆ้อง) + SFX, all code.

Run:  node scripts/export_timeline.mjs src/cities/chiangrai/timeline.ts out/timeline_chiangrai.json
      python3 scripts/soundtrack_chiangrai.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_chiangrai.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_chiangrai.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
# cues sit on the story's beats (timeline.ts), so a retime of the picture moves the score
B = tl.beat
founding, emerald, procession, revival, streets, airfield, growth, temple, design = (
    B("founding"), B("emerald"), B("procession"), B("revival"), B("streets"), B("airfield"), B("growth"), B("temple"), B("design"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (A minor pentatonic, 100 bpm)
# northern tunes sit on a minor-sounding pentatonic; ซึง (plucked lute) carries the pulse,
# สะล้อ (bowed fiddle, here a soft reed with slow vibrato) the long lines
BEAT = 60 / 100
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76, 79]
Am, C, G, Dm, F = [33, 40, 45], [36, 43, 48], [31, 38, 43], [38, 45, 50], [29, 36, 41]

add(music, pad(Am, founding[1] + 0.5, 900), 0.0, gain=0.5)
sections = (
    (founding[1], emerald[1], Dm),
    (emerald[1], procession[1], Am),
    (procession[1], streets[0] - 0.4, F),
    (streets[0] - 0.4, growth[0] - 0.4, C),
    (growth[0] - 0.4, temple[0] - 0.4, G),
    (temple[0] - 0.4, DUR, [33, 45, 52, 57, 60]),
)
for t0, t1, notes in sections:
    add(music, pad(notes, t1 - t0 + 0.6, 1400), t0, gain=0.36)
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        add(music, pluck(notes[2] + 12, 1.2, 0.6), t, pan=-0.25, gain=0.22)
        add(music, pluck(notes[1] + 24, 0.9, 0.5), t + BEAT / 2, pan=0.2, gain=0.12)


def sueng(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """ซึง runs over the pentatonic: mostly steps, the odd leap, never a metronome."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        add(music, pluck(PENTA[i], 1.0, 0.55), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step * rng.choice([1, 1, 2])


def salo(t0, t1, step, amp, low=0, high=7, start=3):
    """สะล้อ phrases: long, slow vibrato, kept under 3 kHz (no harsh top)."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-1, -1, 0, 1, 1, 2]), low, high))
        d = step * rng.choice([2, 2, 3])
        add(music, filt(pi_reed(PENTA[i], min(d * 1.1, t1 - t + 0.2), vib=3.5), "low", 2400), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += d


def khlui_line(t0, t1, step, amp, low=2, high=len(PENTA) - 1, start=5):
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, 0, 1, 1, 2]), low, high))
        d = step * rng.choice([1, 1, 2])
        add(music, khlui(PENTA[i], min(d * 1.1, t1 - t + 0.2)), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += d


khlui_line(1.2, founding[1], BEAT, 0.2)
salo(procession[0], procession[1], BEAT, 0.6)
sueng(revival[0], revival[1], BEAT / 2, 0.3, low=1)
khlui_line(growth[0], growth[1], BEAT, 0.18)
sueng(design[0] - 0.4, DUR - 2.5, BEAT / 2, 0.3, low=3)
salo(temple[0], temple[1], BEAT, 0.5, start=4)
# the storm: the score ducks under the rain and thunder
music *= (1 - 0.45 * bump(T, emerald[0], emerald[1], 0.4))[:, None]

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "low", 600) * 0.03, 0, pan=-0.3)
t = 0.3
while t < design[0]:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (emerald[0] - 0.4 < t < emerald[1] + 0.3):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=0.7 if Y[i] < 1900 else 0.3)
    t += rng.exponential(0.55)
car = np.sin(2 * np.pi * 4200 * T) * (np.sin(2 * np.pi * 26 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.6 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.02
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.41 * SR)) * 0.8, 0, pan=0.6)
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1500)) * 0.05
add(amb, traffic * np.clip((Y - 1955) / 50, 0, 1) * 0.05, 0)


def wash(t0, t1, gain, pan=-0.3):
    """the Kok along the bank: low wash with a few irregular laps."""
    n = int((t1 - t0) * SR)
    add(amb, filt(pink(n), "band", (180, 900)) * env_ar(n, 0.8, 0.8) * gain, t0, pan=pan)
    t = t0 + rng.uniform(0.3, 1.0)
    while t < t1 - 0.4:
        add(amb, splash(), t, pan=pan + rng.uniform(-0.2, 0.2), gain=gain * 2.0)
        t += rng.uniform(1.2, 2.8)


wash(3.2, founding[1], 0.05, pan=-0.4)
wash(growth[0], at(growth, 0.7), 0.045, pan=-0.2)

# ---------------------------------------------------------------- sfx
# the hero's sound first (docs/storyline.md 3.1): the temple's hanging bells in a breeze and the
# hands rising out of the water; a low gong as it folds into the ground (2-3.5 s)


def chimes(t0, t1, gain, pan=0.2):
    """the small bells that hang in their thousands at วัดร่องขุ่น: soft, low-ish, uneven."""
    t = t0
    while t < t1:
        add(sfx, bell(rng.uniform(900, 1500), 1.6, ratios=(1, 2.4, 3.9), decay=2.4), t, pan=pan + rng.uniform(-0.4, 0.4), gain=gain * rng.uniform(0.5, 1))
        t += rng.uniform(0.12, 0.45)


chimes(0.1, 2.4, 0.07)
for k in range(6):
    add(sfx, splash(), 0.3 + k * 0.22 + rng.uniform(0, 0.08), pan=rng.uniform(-0.3, 0.3), gain=0.18)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.5)
add(sfx, gong(88, 5.0, 0.3), at(founding, 0.26))
add(sfx, whoosh(1.1, 0.75), at(founding, 0.3), gain=0.3)
# 1262: the elephant's footfalls on the bank, a trumpet as it stops at the hill, the men's
# hoes on the rampart
e0, e1 = at(founding, 0.38), at(founding, 0.72)
for t in np.arange(e0, e1, 0.46):
    add(sfx, drum(62, 36, 0.35, 0.9), t + rng.uniform(-0.04, 0.04), pan=-0.2 + 0.4 * (t - e0) / (e1 - e0), gain=0.5)
add(sfx, filt(trumpet_elephant(1.3), "low", 1800), e1 - 0.2, pan=-0.1, gain=0.4)
t = at(founding, 0.62)
while t < founding[1] - 0.2:
    add(sfx, drum(rng.uniform(150, 210), 90, 0.1, 0.35), t, pan=rng.uniform(-0.5, 0.0), gain=0.3)
    t += rng.uniform(0.22, 0.5)
# 1434: rain, a long low thunder roll, the crack as the bolt strikes (low-passed: the owner
# dislikes harsh highs), the plaster giving way
n = int((emerald[1] - emerald[0] + 0.8) * SR)
add(amb, filt(pink(n), "band", (250, 2200)) * env_ar(n, 0.5, 0.6) * 0.12, emerald[0] - 0.3, pan=0.0)
strike = at(emerald, 0.27)
add(sfx, filt(noise(int(0.25 * SR)), "low", 1600) * env_ar(int(0.25 * SR), 0.002, 0.2) * 0.5, strike, gain=0.4)
add(sfx, filt(pink(int(2.6 * SR)), "low", 220) * env_ar(int(2.6 * SR), 0.05, 2.0) * 0.8, strike + 0.05, gain=0.5)
add(sfx, filt(crackle(0.6), "low", 2000), at(emerald, 0.36), pan=-0.1, gain=0.3)
add(music, bell(523, 2.5, ratios=(1, 2.0, 3.0), decay=1.2), at(emerald, 0.5), pan=0.1, gain=0.12)
# 1436: the procession: กลองสะบัดชัย and a small gong in step, the elephant balking at the fork
# (a trumpet at the stop), then on south
p_on, p_stop, p_go = at(procession, 0.05), at(procession, 0.42), at(procession, 0.5)
for i, t in enumerate(np.arange(p_on, procession[1] - 0.2, BEAT / 2)):
    if p_stop < t < p_go:
        continue
    add(sfx, drum(132, 70, 0.3, 0.7), t, pan=-0.1, gain=0.34 if i % 2 == 0 else 0.2)
    if i % 4 == 0:
        add(music, gong(176, 1.1, 0.12), t, pan=0.1)
add(sfx, filt(trumpet_elephant(1.4), "low", 1800), p_stop + 0.05, pan=-0.2, gain=0.45)
for t in np.arange(p_go, procession[1] - 0.3, 0.5):
    add(sfx, drum(62, 36, 0.3, 0.8), t + rng.uniform(-0.04, 0.04), pan=0.1, gain=0.35)
# 1843: the caravan: hooves, cart creaks, the bell on an ox, voices; then the walls going up
for t in np.arange(revival[0] + 0.3, at(revival, 0.85), 0.55):
    add(sfx, drum(rng.uniform(180, 240), 120, 0.09, 0.3), t + rng.uniform(-0.06, 0.06), pan=0.3, gain=0.32)
for t in np.arange(revival[0] + 0.6, at(revival, 0.8), 1.3):
    add(sfx, creak(0.45), t + rng.uniform(-0.15, 0.15), pan=rng.uniform(0.1, 0.5), gain=0.3)
    add(sfx, bell(rng.uniform(1000, 1200), 0.6), t + 0.3, pan=0.35, gain=0.06)
add(sfx, crowd(revival[1] - revival[0] - 1.0), revival[0] + 0.8, pan=-0.2, gain=0.18)
for _ in range(14):
    add(sfx, drum(rng.uniform(260, 400), 180, 0.12, 0.2), rng.uniform(at(revival, 0.45), at(revival, 0.95)), pan=rng.uniform(-0.6, 0.6))
add(sfx, gong(98, 4.0, 0.25), at(revival, 0.97))
# 1895: picks and hoes along the new street, in loose time
t = streets[0] + 0.2
while t < at(streets, 0.9):
    add(sfx, drum(rng.uniform(160, 220), 100, 0.08, 0.3), t, pan=-0.5 + (t - streets[0]) / (streets[1] - streets[0]), gain=0.32)
    t += rng.uniform(0.18, 0.4)
# 1923: a biplane engine drawing near and throttling down as it lands


def prop_engine(dur, f0=55.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    f = f0 * (1 - 0.25 * np.clip((tt - dur * 0.6) / (dur * 0.4), 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    buzz = sum(np.sin(k * ph) / k for k in range(1, 14))
    return filt(buzz, "low", 1400) * env_ar(n, dur * 0.5, dur * 0.25) * 0.35


add(sfx, prop_engine(airfield[1] - airfield[0]), airfield[0], pan=0.0, gain=0.6)
add(sfx, drum(80, 40, 0.3, 0.6), at(airfield, 0.62), pan=0.1, gain=0.4)
# the town grows: hammers and timber, then motor traffic and a couple of horns
for _ in range(16):
    add(sfx, drum(rng.uniform(260, 420), 180, 0.12, 0.2), rng.uniform(at(growth, 0.05), at(growth, 0.8)), pan=rng.uniform(-0.6, 0.6))


def horn(dur):
    n = int(dur * SR)
    ph = 2 * np.pi * np.arange(n) / SR
    return filt(np.sign(np.sin(410 * ph)) + np.sign(np.sin(500 * ph)), "band", (350, 2000)) * env_ar(n, 0.01, 0.06) * 0.25


for p, d, pan in ((0.66, 0.2, 0.4), (0.83, 0.14, -0.3), (0.86, 0.26, -0.3)):
    add(sfx, horn(d), at(growth, p), pan=pan, gain=0.1)
# the payoff: the cover's bells and water come back as the temple rises
chimes(temple[0] + 0.3, temple[1], 0.06, pan=-0.2)
for k in range(5):
    add(sfx, splash(), at(temple, 0.3) + k * 0.3 + rng.uniform(0, 0.1), pan=rng.uniform(-0.4, 0.0), gain=0.16)
# City of Design: the crowd round the gold clock tower, สะบัดชัย drums for the light show
add(sfx, crowd(design[1] - design[0] + 1.0), design[0] - 0.5, pan=0.1, gain=0.32)
for i, t in enumerate(np.arange(design[0] + 0.4, design[1], BEAT / 2)):
    add(sfx, drum(120, 62, 0.3, 0.7), t, pan=rng.uniform(-0.2, 0.2), gain=0.36 if i % 2 == 0 else 0.2)

# the gaps between beats: a rising swell and a quickening low roll carry each one, and a low
# gong lands the next downbeat (PR #53: the gaps fell to the ambience bed alone)


def bridge(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.12, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.12 + 0.22 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [founding, emerald, procession, revival, streets, airfield, growth, temple, design]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)
for b_ in (revival, streets, growth, temple):
    add(sfx, whoosh(1.1, 0.75), b_[0] - 0.95, pan=rng.uniform(-0.3, 0.3), gain=0.45)

# finale: khom loi lanterns rising -- soft gongs and a last ซึง phrase, no pops
for i in range(5):
    add(music, gong(rng.choice([132, 176, 198]), 2.4, 0.12), DUR - 4.4 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

mix = master("public/soundtrack_chiangrai.wav", music, amb, sfx)
print("wrote public/soundtrack_chiangrai.wav", {"emerald": round(emerald[0], 2), "design": round(design[0], 2)})
