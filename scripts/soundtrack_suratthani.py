"""Surat Thani soundtrack: a southern palette (the pi reed of the nora ensemble, the thap and the klong
thon on the beat, ranat and mong gongs), under a small sound for everything that moves or appears: the
coconut monkey scrabbling up the palm and chirring, the coconut creaking round and dropping into the Tapi
with a splash, the ships' sails and the bay, Chaiya burning and the armies' drums, the shipwrights'
mallets and saws and a hull sliding into the river, Tha Thong's boats and the houses going up, the royal
barge's drum and the welcome, the first train over the Tapi bridge, the town and the ferries in the grow
shot, and Chak Phra: the drums on the boats, the race's paddles, the crowd and the monkey's chirr again.
All code; kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/suratthani/timeline.ts out/timeline_suratthani.json
      python3 scripts/soundtrack_suratthani.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_suratthani.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_suratthani.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, fight, yard, move, royal, train, grow, pay, today = (
    B("hero"), B("fight"), B("shipyard"), B("move"), B("royal"), B("train"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.35  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below

# ---------------------------------------------------------------- score (D minor pentatonic, 92 bpm)
BEAT = 60 / 92
PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81]
Dm, Bb, F, C, Gm, Am = [50, 57, 62], [46, 53, 58], [41, 48, 53], [48, 55, 60], [43, 50, 55], [45, 52, 57]

sections = (
    (0.0, fight[0], [50, 57, 62, 69], 1.0),
    (fight[0], yard[0], Gm, 0.9),
    (yard[0], move[0], Bb, 0.9),
    (move[0], royal[0], F, 0.9),
    (royal[0], train[0], C, 0.95),
    (train[0], grow[0], Am, 0.85),
    (grow[0], pay[0], Bb, 0.9),
    (pay[0], DUR, [50, 57, 62, 65, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.22 * lvl)


def ranat_run(t0, t1, amp, step=BEAT / 2, prob=0.85):
    """the ranat, soft mallets wandering the pentatonic, rounded at 2.4 kHz"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.6), "low", 2400), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def pi_line(t0, t1, amp):
    """the southern pi reed: a slow, ornamented line"""
    t = t0
    i = 3
    while t < t1 - 0.3:
        i = int(np.clip(i + rng.choice([-2, -1, 1, 1, 2]), 0, len(PENTA) - 1))
        d = BEAT * rng.choice([1, 1, 2, 2, 3])
        add(music, filt(pi_reed(PENTA[i] - 12, min(d, t1 - t), vib=5.0), "low", 2200), t, pan=0.15, gain=amp)
        t += d


def thap(t0, t1, gain):
    """the thap and the klong thon: the nora's quick drum pattern"""
    pat = [1.0, 0, 0.5, 0.6, 0, 0.5, 0.8, 0.4]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(150, 175), 90, 0.12, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 4 == 0:
            add(music, drum(70, 45, 0.5, 0.9), t, pan=0.1, gain=gain * 0.8)
        t += BEAT / 2
        k += 1


def chings(t0, t1, gain):
    for t in np.arange(t0, t1, BEAT):
        add(sfx, filt(ching(), "low", 2400), t, pan=-0.15, gain=gain)


ranat_run(2.4, hero[1], 0.12, prob=0.55)
thap(fight[0], fight[1], 0.14)
pi_line(fight[0] + 0.4, fight[1], 0.13)
ranat_run(yard[0], yard[1], 0.11, prob=0.7)
pi_line(move[0], move[1], 0.12)
thap(royal[0] + 0.3, royal[1], 0.12)
ranat_run(royal[0], royal[1], 0.12)
ranat_run(train[0], train[1], 0.12)
ranat_run(grow[0], grow[1], 0.12, prob=0.7)
add(music, filt(khlui(69, 3.2), "low", 2200), pay[0] + 0.4, pan=0.2, gain=0.16)
pi_line(pay[0] + 0.8, DUR - 3.0, 0.13)
thap(pay[0] + 0.3, DUR - 3.0, 0.14)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
# the forest's birds while the land is open; the river; the bay's small waves; the town bed
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.75)


def lap(gain=1.0):
    """a small wave on a mud shore: a soft, low wash"""
    n = int(rng.uniform(0.7, 1.2) * SR)
    return filt(pink(n), "band", (120, 900)) * np.hanning(n) * 0.25 * gain


# the bay through the hero and the fight (ships, Chaiya's shore), the river under the town beats
t = 0.5
while t < fight[1]:
    add(amb, lap(0.9), t, pan=rng.uniform(-0.6, 0.6))
    t += rng.uniform(0.6, 1.3)
n = int((royal[1] - yard[0]) * SR)
add(amb, filt(pink(n), "band", (150, 700)) * env_ar(n, 0.8, 0.8) * 0.22, yard[0], pan=-0.2)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 50, 0, 1) * 0.17, 0)

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


def scrabble(gain=1.0):
    """a monkey's hands and feet on palm bark: a quick, dry scratch"""
    n = int(0.09 * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (700, 2200)) * np.exp(-t * 45) * 0.35 * gain


def chirr(gain=1.0, dur=0.4):
    """the macaque's call: a short rising chirr, a few quick pulses, under 2.2 kHz"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 700 + 500 * (t / dur) + 60 * np.sin(2 * np.pi * 7 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    am = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * t))
    x = (np.sin(ph) + 0.4 * np.sin(2 * ph)) * am
    return filt(x, "low", 2200) * env_ar(n, 0.02, 0.12) * 0.16 * gain


def thunk(gain=1.0):
    """a coconut hitting the water: a deep plop with a splash on top"""
    return (drum(140, 60, 0.35, 0.9) * 0.8 + splash() * 1.2) * gain


def mallet(gain=1.0):
    return filt(drum(rng.uniform(180, 260), 120, 0.08, 0.5), "low", 1800) * gain


def saw_stroke(gain=1.0, dur=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (500, 1800)) * np.sin(np.pi * t / dur) * 0.2 * gain


def paddle(gain=1.0):
    return splash() * 0.35 * gain


def horn(gain=1.0, dur=1.4, f=110):
    """a ferry's low horn"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * f * t
    x = np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)
    return filt(x, "low", 900) * env_ar(n, 0.08, 0.4) * 0.14 * gain


def rise_tone(dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (50, 57, 62, 65, 69):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


# the cover: the monkey's first sound is its scrabble up the trunk from frame 0, a chirr, the coconut
# creaking round, the fall and the splash in the Tapi
t = 0.02
while t < 1.1:
    add(sfx, scrabble(1.0), t, pan=-0.1 + rng.uniform(-0.1, 0.1))
    t += rng.uniform(0.07, 0.11)
add(sfx, chirr(1.0, 0.45), 0.25, pan=-0.05)
add(sfx, creak(0.8), 1.1, pan=0.05, gain=1.4)
add(sfx, chirr(0.9, 0.35), 1.55, pan=-0.05)
add(sfx, whoosh(0.6, 0.35), 1.9, pan=0.1)
add(sfx, thunk(1.0), 2.45, pan=0.15)
add(sfx, gong(74, 3.0, 0.3), 2.45, pan=0.0)
# the ships: sails filling, a creak of timber, the hulls through the bay
add(sfx, whoosh(1.6, 0.4), 2.8, pan=-0.3)
for k in range(5):
    add(sfx, creak(0.5), 3.2 + k * 0.7, pan=-0.4 + k * 0.2, gain=0.8)
add(sfx, rise_tone(2.2, 0.9), 3.3, pan=0.0)
# 2328: Chaiya burning, the war drums, the armies' cry
add(sfx, crackle(fight[1] - fight[0] + 0.2) * 0.5, fight[0] + 0.1, pan=-0.1)
for t in np.arange(fight[0] + 0.2, fight[1] - 0.2, BEAT):
    add(sfx, drum(62, 40, 0.5, 0.9), t, pan=0.3, gain=0.35)
add(sfx, crowd(fight[1] - fight[0] - 1.0), at(fight, 0.25), pan=0.3, gain=0.35)
for k in range(6):
    add(sfx, filt(clash(), "low", 2200), at(fight, 0.45 + k * 0.07), pan=rng.uniform(-0.4, 0.4), gain=0.25)
add(sfx, gong(62, 3.0, 0.4), at(fight, 0.1), pan=0.0)
# ~2375: the shipyard's mallets and saws, a hull sliding into the river
for k in range(26):
    add(sfx, mallet(0.6), rng.uniform(yard[0] + 0.1, at(yard, 0.7)), pan=rng.uniform(-0.5, 0.5))
for k in range(8):
    add(sfx, saw_stroke(0.9), at(yard, 0.08 + k * 0.07), pan=0.3)
n = int(1.4 * SR)
add(sfx, filt(pink(n), "low", 300) * env_ar(n, 0.4, 0.5) * 0.4, at(yard, 0.68), pan=0.1)
add(sfx, splash() * 1.4, at(yard, 0.92), pan=0.1)
add(sfx, babble(yard[1] - yard[0] - 0.6, 0.6), yard[0] + 0.3, pan=-0.3, gain=0.25)
# Rama IV: Tha Thong's boats up the reach, voices, the houses and the shrine going up
t = move[0] + 0.2
while t < move[1] - 0.1:
    add(sfx, paddle(1.0), t, pan=rng.uniform(-0.5, 0.3), gain=0.8)
    t += rng.uniform(0.3, 0.45)
add(sfx, babble(move[1] - move[0] - 0.4, 0.8), move[0] + 0.2, pan=-0.1, gain=0.3)
for k in range(14):
    add(sfx, blip(rng.uniform(240, 380), 0.6), at(move, 0.3 + k * 0.035), pan=rng.uniform(-0.5, 0.5))
add(sfx, gong(70, 2.4, 0.3), at(move, 0.75), pan=0.2)
# 2458: the royal barge's drum and the rowers' stroke, the welcome at the landing
t = royal[0] + 0.1
while t < royal[1] - 0.2:
    add(sfx, paddle(1.2), t, pan=rng.uniform(-0.3, 0.3))
    add(sfx, drum(95, 60, 0.3, 0.8), t, pan=0.0, gain=0.3)
    t += BEAT
add(sfx, crowd(royal[1] - at(royal, 0.5)), at(royal, 0.5), pan=0.2, gain=0.35)
add(sfx, gong(74, 3.2, 0.45), at(royal, 0.85), pan=0.0)
chings(at(royal, 0.6), royal[1], 0.18)
# 2459: the first train over the Tapi bridge into Phun Phin, its whistle, the girders' rumble
t = train[0] + 0.15
while t < train[1] - 0.2:
    add(sfx, filt(chuff(), "low", 1800), t, pan=0.3, gain=1.0)
    t += 0.2
add(sfx, filt(steam_whistle(1.4), "low", 2000), train[0] + 0.4, pan=0.3, gain=0.7)
n = int(1.6 * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 0.3, 0.6) * 0.35, at(train, 0.35), pan=0.2)
for k in range(8):
    add(sfx, blip(rng.uniform(260, 420), 0.6), at(train, 0.05 + k * 0.04), pan=rng.uniform(-0.4, 0.4))
# the grow shot: a pop per block, traffic, the ferries' horns out of the mouth
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.4)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 2.0, 2.0) * 0.3, grow[0], pan=0.3)
add(sfx, horn(1.0), at(grow, 0.3), pan=0.5)
add(sfx, horn(0.8, f=98), at(grow, 0.7), pan=0.4)
# the payoff: the drums on the boats, the paddles of the race, the crowd's cheer, the monkey again
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.35)
add(sfx, babble(today[1] - pay[0], 1.0), pay[0] + 0.2, pan=0.3, gain=0.35)
for t in np.arange(pay[0] + 0.3, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(78, 50, 0.4, 0.9), t, pan=-0.2, gain=0.2)
t = at(pay, 0.2)
while t < pay[1] - 0.3:
    add(sfx, paddle(1.3), t, pan=0.3)
    t += 0.24
add(sfx, chirr(1.0, 0.45), at(pay, 0.2), pan=-0.3)
add(sfx, chirr(0.8, 0.35), at(pay, 0.62), pan=-0.3)
add(sfx, rise_tone(2.0, 1.0), pay[0] + 0.2, pan=0.0)
chings(pay[0] + 0.4, pay[1] - 0.2, 0.2)
add(sfx, gong(74, 3.0, 0.4), at(pay, 0.92), pan=0.0)

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


order = [hero, fight, yard, move, royal, train, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)

# finale: fireworks over the town -- soft low pops and gongs
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.35)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))

# the score carries the clip at a steady level, raised and left alone (owner, Nakhon Pathom)
music *= MUSIC_GAIN
amb *= 2.3
# meter the buses as master weights them: the score must sit 0 to +3 LU over the effects
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU")
mix = master("public/soundtrack_suratthani.wav", music, amb, sfx)
print("wrote public/soundtrack_suratthani.wav", {"hero": round(hero[0], 2), "payoff": round(pay[0], 2)})
