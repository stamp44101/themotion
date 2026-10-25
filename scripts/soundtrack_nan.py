"""Nan soundtrack: a Lanna palette (the สะล้อ fiddle and ซึง lute of the northern string band, the
long drum and ฉาบ of the boat-race crews, temple gongs) under a small sound for everything that
moves or appears: the paddles and the crew's call, the diggers round Chae Haeng, the white
bull, Tilokaraj's army and elephants, the people round Wat Phumin, the 2343 races, the flood
and the walk north, the walk back and the bricks, the biplane, the town, the race under the
bridge. All code; kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/nan/timeline.ts out/timeline_nan.json
      python3 scripts/soundtrack_nan.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402
import elephant_voices as ev  # noqa: E402

synth.init(json.load(open("out/timeline_nan.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_nan.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, chh, bull, siege, phumin, race, flood, ret, plane, grow, pay, today = (
    B("hero"), B("chaehaeng"), B("bull"), B("siege"), B("phumin"), B("race"), B("flood"), B("return"), B("plane"), B("growth"),
    B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (D pentatonic, 96 bpm)
BEAT = 60 / 96
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]
D, G, A, Bm, Em = [50, 57, 62], [43, 50, 55], [45, 52, 57], [47, 54, 59], [40, 47, 52]

sections = (
    (0.0, chh[1], D, 0.85),
    (chh[1], phumin[0], Bm, 0.9),
    (phumin[0], flood[0], G, 0.95),
    (flood[0], ret[0], Em, 0.8),
    (ret[0], grow[0], A, 0.95),
    (grow[0], pay[0], G, 0.95),
    (pay[0], DUR, [38, 50, 57, 62, 66], 1.1),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, 1300), t0, gain=0.28 * lvl)


def sueng(t0, t1, amp, root=62):
    """the ซึง lute: a plucked figure on the beat, the off-beat a fourth up"""
    for i, t in enumerate(np.arange(t0, t1 - 0.2, BEAT / 2)):
        m = root if i % 4 in (0, 2) else (root + 5 if i % 4 == 1 else root + 7)
        add(music, pluck(m, 0.7, 0.7), t, pan=-0.25, gain=amp * (1 if i % 2 == 0 else 0.6))


def salo(m, dur, vib=5.0):
    """the สะล้อ fiddle: a bowed, reedy tone with a slow vibrato, rounded off at 2.4 kHz"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m) * (1 + 0.006 * np.sin(2 * np.pi * vib * t) * np.clip(t / 0.3, 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k ** 1.25 for k in range(1, 12))
    bow = 1 + 0.08 * filt(noise(n), "low", 30)
    return filt(x * bow, "low", 2400, order=4) * env_ar(n, 0.12, min(0.4, dur * 0.4)) * 0.25


def phrase(t0, t1, amp, pan=0.2):
    i = 4
    t = t0
    while t < t1 - 0.4:
        i = int(np.clip(i + rng.choice([-1, -1, 0, 1, 1]), 1, len(PENTA) - 2))
        d = BEAT * rng.choice([1, 1, 2, 3])
        add(music, salo(PENTA[i], d), t, pan=pan, gain=amp)
        t += d


sueng(0.2, chh[1], 0.15)
phrase(3.2, hero[1], 0.16)
sueng(phumin[0], race[1], 0.14, root=67)
phrase(phumin[0] + 0.3, phumin[1], 0.18)
sueng(ret[0], plane[0], 0.14, root=69)
phrase(grow[0], grow[1], 0.15)
sueng(pay[0], DUR - 2.5, 0.16)
phrase(pay[0] + 0.4, DUR - 3.0, 0.2)

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "band", (150, 700)) * 0.05, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2800), t, pan=rng.uniform(-0.8, 0.8), gain=1.2 if Y[i] < 1930 else 0.5)
    t += rng.exponential(0.6)
# the river under it all: a slow, low wash
river = filt(pink(N), "band", (90, 500)) * (0.6 + 0.4 * filt(noise(N), "low", 0.4) * 4)
add(amb, river * 0.05, 0, pan=0.2)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1960) / 50, 0, 1) * 0.035, 0)

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


def tread(t0, t1, every, gain, pan=0.0, f=60):
    t = t0
    while t < t1:
        add(sfx, drum(f + rng.uniform(-4, 4), 34, 0.35, 0.9), t + rng.uniform(-0.04, 0.04), pan=pan + rng.uniform(-0.2, 0.2), gain=gain)
        t += every * rng.uniform(0.85, 1.15)


def paddle(gain=1.0):
    """a blade going in and pulling: a soft low plunge and a wash"""
    n = int(0.32 * SR)
    t = np.arange(n) / SR
    plunge = filt(noise(n), "band", (160, 900)) * np.exp(-t * 14)
    body = np.sin(2 * np.pi * np.cumsum(140 * np.exp(-t * 6)) / SR) * np.exp(-t * 20) * 0.4
    return (plunge + body) * 0.5 * gain


def hui(gain=1.0):
    """the crew's call on the stroke: a short, low chorus of 'hui'"""
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in (150, 185, 222, 260):
        ph = 2 * np.pi * np.cumsum(f * (1 + rng.uniform(-0.03, 0.03)) * (1 + 0.15 * t)) / SR
        out += sum(np.sin(k * ph) / k ** 1.4 for k in range(1, 9))
    return filt(out, "band", (180, 1800)) * env_ar(n, 0.03, 0.2) * 0.12 * gain


def stroke(t0, t1, rate, gain, pan=0.0, call=True, drum_on=True):
    """a crew in time: blades, the drum on the catch and the call every other stroke"""
    k = 0
    t = t0
    while t < t1:
        add(sfx, paddle(gain), t + 0.05, pan=pan + rng.uniform(-0.15, 0.15))
        if drum_on:
            add(sfx, drum(90, 62, 0.3, 0.8), t, pan=pan, gain=gain * 0.55)
        if call and k % 2 == 0:
            add(sfx, hui(gain), t - 0.02, pan=pan)
        k += 1
        t += 1 / rate


def moo(t0, gain, pan=0.0):
    """the white bull: a long, low call falling at the end"""
    dur = 1.6
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 105 * (1 + 0.25 * np.minimum(1, t / 0.25)) * (1 - 0.18 * np.clip((t - 1.0) / 0.6, 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k ** 1.1 for k in range(1, 14))
    add(sfx, filt(x, "low", 1400, order=4) * env_ar(n, 0.12, 0.5) * 0.3, t0, pan=pan, gain=gain)


def rush(t0, dur, gain, pan=0.0):
    """water coming over the bank"""
    n = int(dur * SR)
    x = filt(pink(n), "band", (120, 1400)) * (0.5 + 0.5 * np.linspace(0, 1, n) ** 0.7)
    add(sfx, x * env_ar(n, dur * 0.3, dur * 0.3) * 0.6, t0, pan=pan, gain=gain)


def engine(dur, f=72):
    """a 1920s rotary engine: a low buzzing pulse, kept under 2 kHz"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.02 * np.sin(2 * np.pi * 0.7 * t))) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 18))
    pulse = 0.6 + 0.4 * (np.sin(2 * np.pi * f / 2 * t) > 0)
    return filt(x * pulse, "low", 1800, order=4) * 0.18


# the cover: the crews' strokes from the first frame, the drum and the call, the river
stroke(0.05, hero[1] + 0.3, 1.35, 0.85, pan=-0.1)
stroke(1.2, hero[1] - 0.4, 1.3, 0.35, pan=0.35, call=False, drum_on=False)
add(sfx, gong(98, 2.4, 0.25), 0.0, pan=0.0)
add(sfx, babble(hero[1] - 3.8, 0.5), 3.6, pan=0.3, gain=0.25)
# Chae Haeng: hoes and baskets round the moat; the chedi and the huts going up
for _ in range(24):
    add(sfx, drum(rng.uniform(150, 240), 110, 0.12, 0.3), rng.uniform(chh[0] + 0.1, chh[1] - 0.2), pan=rng.uniform(-0.7, 0.7), gain=0.35)
for i in range(12):
    add(sfx, blip(rng.uniform(240, 380), 0.65), at(chh, 0.08 + i * 0.07), pan=rng.uniform(-0.5, 0.5))
add(sfx, babble(chh[1] - chh[0] - 0.6, 0.9), chh[0] + 0.3, pan=0.1, gain=0.4)
add(sfx, bell(330, 2.5), at(chh, 0.55), pan=0.2, gain=0.25)
# 1911: the bull's hooves, a call, the wade through the channel, the log wall going up
t = bull[0] + 0.1
while t < at(bull, 0.62):
    add(sfx, filt(drum(rng.uniform(130, 170), 80, 0.12, 0.6), "low", 1200), t, pan=-0.1, gain=0.5)
    t += 0.2 * rng.uniform(0.9, 1.1)
moo(at(bull, 0.12), 0.9, pan=-0.2)
moo(at(bull, 0.7), 0.7, pan=0.1)
n = int(1.2 * SR)
add(sfx, filt(pink(n), "band", (200, 1200)) * env_ar(n, 0.1, 0.6) * 0.5, at(bull, 0.4), pan=0.1)  # the wade
for i in range(26):
    add(sfx, drum(rng.uniform(170, 230), 120, 0.14, 0.5), at(bull, 0.38 + i * 0.022), pan=rng.uniform(-0.6, 0.6), gain=0.4)
# 1993: the army's drums and feet, the war elephants' calls, the houses of the town going up
tread(siege[0] + 0.2, at(siege, 0.75), 0.48, 0.5, pan=-0.4)
steps(siege[0] + 0.1, at(siege, 0.78), 0.14, 0.45, pan=-0.3)
for t in np.arange(siege[0] + 0.1, siege[1] - 0.2, BEAT):
    add(sfx, drum(80, 52, 0.4, 0.9), t, pan=-0.3, gain=0.45)
add(sfx, ev.trumpet(1.0), at(siege, 0.18), pan=-0.4, gain=0.6)
add(sfx, ev.trumpet(0.8), at(siege, 0.5), pan=-0.2, gain=0.5)
add(sfx, ev.rumble(1.0, 2.0), at(siege, 0.3), pan=-0.3, gain=0.5)
for k in range(3):
    add(sfx, clash(), at(siege, 0.8 + k * 0.05), pan=rng.uniform(-0.3, 0.3), gain=0.35)
for i in range(18):
    add(sfx, blip(gain=0.55), at(siege, 0.05 + i * 0.045), pan=rng.uniform(-0.6, 0.6))
# 2139: Wat Phumin rising, the people walking round it, a temple gong and bells
for i in range(10):
    add(sfx, blip(rng.uniform(220, 340), 0.7), at(phumin, 0.04 + i * 0.05), pan=rng.uniform(-0.4, 0.4))
add(sfx, gong(110, 3.0, 0.35), at(phumin, 0.55), pan=0.0)
for k in range(5):
    add(sfx, bell(rng.choice([392, 440, 494]), 2.0), at(phumin, 0.6 + k * 0.07), pan=rng.uniform(-0.5, 0.5), gain=0.12)
steps(phumin[0] + 0.3, phumin[1] - 0.2, 0.3, 0.35, pan=0.2)
add(sfx, babble(phumin[1] - phumin[0] - 1.0, 0.6), phumin[0] + 0.5, pan=0.2, gain=0.3)
# 2343: the races in the channel: two crews, the drums, the crowd on the bank
stroke(race[0] + 0.1, race[1] - 0.1, 1.45, 0.8, pan=-0.2)
stroke(race[0] + 0.3, race[1] - 0.1, 1.4, 0.6, pan=0.25, call=True, drum_on=False)
add(sfx, crowd(race[1] - race[0]), race[0], pan=0.2, gain=0.22)
for k in range(3):
    add(sfx, filt(ching(), "low", 2400), at(race, 0.2 + k * 0.3), pan=0.3, gain=0.3)
# 2360: the water rising, the logs cracking, the walk north with carts and elephants
rush(flood[0], 3.4, 0.7, pan=0.1)
for k in range(8):
    add(sfx, creak(0.5), at(flood, 0.3 + k * 0.05), pan=rng.uniform(-0.5, 0.5), gain=0.4)
    add(sfx, drum(rng.uniform(70, 110), 45, 0.4, 0.8), at(flood, 0.32 + k * 0.05), pan=rng.uniform(-0.5, 0.5), gain=0.35)
steps(at(flood, 0.15), flood[1], 0.2, 0.55, pan=0.2)
for t in np.arange(at(flood, 0.2), flood[1], 0.6):
    add(sfx, creak(0.4), t, pan=0.3, gain=0.25)
tread(at(flood, 0.25), flood[1], 0.55, 0.4, pan=0.2)
add(sfx, ev.rumble(0.9, 1.6), at(flood, 0.5), pan=0.2, gain=0.4)
add(sfx, babble(flood[1] - flood[0] - 1.2, 1.0), flood[0] + 1.0, pan=0.1, gain=0.45)
# 2398: the walk back south, the brick wall going up course by course, the gates
steps(ret[0] + 0.1, at(ret, 0.9), 0.2, 0.55, pan=-0.2)
tread(ret[0] + 0.2, at(ret, 0.9), 0.55, 0.4, pan=-0.2)
for t in np.arange(ret[0] + 0.3, at(ret, 0.9), 0.6):
    add(sfx, creak(0.4), t, pan=-0.3, gain=0.25)
for i in range(30):
    add(sfx, blip(rng.uniform(260, 460), 0.6), at(ret, 0.12 + i * 0.026), pan=rng.uniform(-0.6, 0.6))
add(sfx, babble(ret[1] - ret[0] - 0.8, 0.9), ret[0] + 0.4, pan=0.1, gain=0.4)
add(sfx, gong(98, 2.6, 0.25), at(ret, 0.85), pan=0.0)
# ~2470: the biplane coming in over the forest, the touchdown, the crowd
n = int((plane[1] - plane[0]) * SR)
eng = engine(plane[1] - plane[0])
dop = np.clip(np.linspace(-0.2, 1.4, n), 0, 1)
level = np.clip(np.linspace(0.3, 1.6, n), 0, 1) * (1 - 0.6 * np.clip(np.linspace(-2.2, 1.0, n), 0, 1))
add(sfx, eng * level, plane[0], pan=0.0, gain=1.0)
add(sfx, filt(noise(int(0.4 * SR)), "band", (120, 700)) * env_ar(int(0.4 * SR), 0.02, 0.3) * 0.5, at(plane, 0.42), pan=0.1)
add(sfx, crowd(plane[1] - at(plane, 0.4)), at(plane, 0.4), pan=0.2, gain=0.3)
add(sfx, babble(2.4, 1.0), at(plane, 0.55), pan=-0.2, gain=0.4)
# the town spreading: a pop per block, cars after the road comes
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
# the payoff: the race under the bridge: the hero crew's drum and call, the other crews, the
# crowd on both banks, a gong at the finish
# the crews stop at the finish by the bridge (82% of the beat): a cheer goes up
fin = at(pay, 0.82)
stroke(pay[0] + 0.1, fin, 1.5, 0.95, pan=-0.1)
stroke(pay[0] + 0.25, fin, 1.45, 0.55, pan=0.3, call=True, drum_on=False)
stroke(pay[0] + 0.5, fin - 0.4, 1.4, 0.3, pan=-0.4, call=False, drum_on=False)
add(sfx, crowd(2.4), fin - 0.2, pan=0.0, gain=0.35)
add(sfx, gong(98, 3.0, 0.4), fin, pan=0.0)
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.3)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.55)
for k in range(4):
    add(sfx, filt(ching(), "low", 2400), at(pay, 0.15 + k * 0.22), pan=0.3, gain=0.3)

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


order = [hero, chh, bull, siege, phumin, race, flood, ret, plane, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)

# finale: lanterns rising -- soft low gongs
for i in range(5):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.2 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.9
mix = master("public/soundtrack_nan.wav", music, amb, sfx)
print("wrote public/soundtrack_nan.wav", {"flood": round(flood[0], 2), "payoff": round(pay[0], 2)})
