"""Pattani soundtrack: a southern Malay-coast palette (a serunai-like reed line over rebana frame drums and a gong, a
plucked gambus, a pad of the bay) under a small sound for everything that appears or moves: the mallet on clay and the
hiss of the bronze for the cover's giant gun; the furnace's roar and the smiths' hammers at Kru Se; the haulers' feet,
rollers creaking and the salute's boom; ships' creaks, gulls and porters at the anchorage; the gun dragged to the landing,
the splash of the second gun, the junk's sail; oars and voices up the river; rivets on the bridge; the town's pops and
traffic; the procession's drums, cymbals, firecrackers and splashing feet; fireworks at the end.
All code (no generated audio); kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/pattani/timeline.ts out/timeline_pattani.json
      python3 scripts/soundtrack_pattani.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_pattani.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_pattani.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, cast, haul, port, taken, newtown, bridge, grow, fair, today = (
    B("hero"), B("cast"), B("haul"), B("port"), B("taken"), B("newtown"), B("bridge"), B("grow"), B("fair"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.9  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
POUR_END, MALLET = 1.4, 0.36  # src/cities/pattani/actors.ts
CALLBACK_T = 50.2

# ---------------------------------------------------------------- score (D minor, a Malay asli feel, 96 bpm)
BEAT = 60 / 96
SCALE = [62, 64, 65, 67, 69, 70, 72, 74, 76, 77]
Dm, Gm, A7, F, Bb = [50, 57, 62, 65], [55, 58, 62, 67], [45, 52, 57, 61], [53, 57, 60, 65], [46, 53, 58, 62]
sections = (
    (0.0, cast[0], Dm, 1.0),
    (cast[0], haul[0], Dm, 1.0),
    (haul[0], port[0], Gm, 1.0),
    (port[0], taken[0], F, 1.0),
    (taken[0], newtown[0], A7, 0.9),
    (newtown[0], bridge[0], Dm, 0.9),
    (bridge[0], grow[0], Bb, 0.95),
    (grow[0], fair[0], F, 1.0),
    (fair[0], DUR, [50, 57, 62, 65, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1300), t0, gain=0.09 * lvl)
    add(music, filt(khaen(notes[:3], t1 - t0 + 0.6, bright=1400), "low", 1800), t0, gain=0.04 * lvl)


def reed_line(t0, t1, amp):
    """the serunai: a long ornamented reed line"""
    t, i = t0, 4
    while t < t1 - 0.4:
        d = BEAT * rng.choice([1, 1, 2, 0.5])
        i = int(np.clip(i + rng.choice([-1, 1, -2, 2, 0]), 0, len(SCALE) - 1))
        add(music, filt(pi_reed(SCALE[i], d + 0.1), "low", 2200), t, pan=0.15, gain=amp)
        t += d


def gambus(t0, t1, amp):
    t, i = t0, 3
    while t < t1 - 0.3:
        d = BEAT * rng.choice([0.5, 0.5, 1])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2]), 0, len(SCALE) - 1))
        add(music, filt(pluck(SCALE[i] - 12, 1.0, bright=0.8), "low", 2000), t, pan=-0.25, gain=amp)
        t += d


def rebana(t0, t1, gain):
    """frame drums: dum . tak dum . tak tak ."""
    pat = [1.0, 0, 0.5, 0.8, 0, 0.5, 0.5, 0]
    t, k = t0, 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            low = g >= 0.8
            add(music, drum(rng.uniform(90, 110) if low else rng.uniform(170, 200), 60 if low else 120, 0.2, 0.7), t, pan=-0.15 if low else 0.2, gain=gain * g)
        t += BEAT / 2
        k += 1


gambus(0.5, hero[1], 0.06)
rebana(cast[0], cast[1], 0.08)
reed_line(cast[0] + 0.4, cast[1], 0.05)
rebana(haul[0], haul[1], 0.13)
reed_line(haul[0], haul[1], 0.07)
gambus(port[0], port[1], 0.07)
reed_line(port[0] + 1.0, port[1], 0.05)
reed_line(taken[0], taken[1], 0.06)
gambus(newtown[0], newtown[1], 0.07)
rebana(bridge[0] + 0.5, bridge[1], 0.07)
gambus(bridge[0], bridge[1], 0.05)
rebana(grow[0], grow[1], 0.1)
reed_line(grow[0], grow[1], 0.06)
rebana(fair[0], DUR - 3.0, 0.12)
reed_line(fair[0], DUR - 3.0, 0.07)
gambus(fair[0], DUR - 3.0, 0.05)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
TT = np.arange(N) / SR
# the cover's plain wind; the bay's surf at Kru Se (cast to taken); the river in the town; the town bed from the 1950s
wind_on = 1 - np.clip((TT - cast[0]) / 1.5, 0, 1)
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * wind_on * 0.1, 0)
surf_on = np.clip((TT - cast[0] + 0.5) / 1.5, 0, 1) * (1 - np.clip((TT - newtown[0]) / 1.5, 0, 1))
swell = 0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * TT) ** 2
add(amb, filt(pink(N), "band", (150, 1100)) * swell * surf_on * 0.14, 0)
river_on = np.clip((TT - newtown[0]) / 1.5, 0, 1) * (1 - np.clip((TT - grow[0]) / 1.5, 0, 1)) + np.clip((TT - fair[0]) / 1.0, 0, 1) * 0.8
add(amb, filt(pink(N), "band", (120, 600)) * river_on * 0.08, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 60, 0, 1) * 0.15, 0)
t = 0.4
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        g = 1.0 if (port[0] - 6 < t < newtown[0]) else 0.5
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=g)
    t += rng.exponential(1.1)


# ---------------------------------------------------------------- the small sounds
def blip(f=None, gain=1.0):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f0 = f or rng.uniform(320, 620)
    tone = np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 9)) / SR) * np.exp(-t * 26)
    knock_ = filt(noise(n), "band", (600, 2200)) * np.exp(-t * 90) * 0.25
    return (tone + knock_) * 0.55 * gain


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


def tick(gain=1.0):
    n = int(0.05 * SR)
    return filt(noise(n), "band", (900, 2200)) * np.exp(-np.arange(n) / SR * 120) * 0.35 * gain


def thud(gain=1.0, f=90):
    return filt(drum(f, 48, 0.3, 0.8), "low", 900) * gain


def hiss(dur, gain=1.0):
    """molten bronze running into clay: a soft low hiss with bubbling"""
    n = int(dur * SR)
    tt = np.arange(n) / SR
    return filt(noise(n), "band", (300, 1500)) * (0.7 + 0.3 * np.sin(2 * np.pi * 13 * tt)) * env_ar(n, 0.05, 0.3) * 0.18 * gain


def boom(gain=1.0):
    return filt(drum(70, 34, 1.2, 1.0), "low", 500) * gain + filt(pink(int(1.2 * SR)), "low", 300) * env_ar(int(1.2 * SR), 0.01, 1.0) * 0.4 * gain


def rumble(dur, gain=1.0):
    n = int(dur * SR)
    return filt(pink(n), "low", 260) * env_ar(n, 0.3, 0.8) * 0.5 * gain


# the cover: the mallet on clay every 0.36 s while the shell comes off, clay crumbling, the bronze hissing into the head
add(sfx, hiss(POUR_END + 0.3, 1.0), 0.0, pan=0.25)
t = 0.0
while t < 2.6:
    add(sfx, thud(0.9, rng.uniform(80, 100)), t + MALLET * 0.25, pan=rng.uniform(-0.15, 0.15))
    add(sfx, tick(0.6), t + MALLET * 0.25 + 0.03, pan=rng.uniform(-0.3, 0.3))
    t += MALLET
add(sfx, gong(73, 2.8, 0.22), 2.7, pan=0.0)
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.3, pan=0.0, gain=0.4)  # the giant sinks away
# cast: the furnace's roar, the pour's hiss into each mould, hammers, voices
add(sfx, rumble(cast[1] - cast[0], 0.5), cast[0], pan=-0.3)
for j in range(3):
    add(sfx, hiss(1.1, 0.8), at(cast, 0.12 + 0.22 * j), pan=-0.3 + 0.3 * j)
t = at(cast, 0.05)
while t < cast[1] - 0.2:
    add(sfx, tick(0.5), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.3, 0.5)
for k in range(5):
    add(sfx, thud(0.35, rng.uniform(110, 150)), at(cast, 0.82 + 0.03 * k), pan=rng.uniform(-0.3, 0.3))
add(sfx, babble(cast[1] - cast[0] - 0.4, 0.8), cast[0] + 0.2, pan=0.1, gain=0.25)
# haul: feet in time, rollers creaking, the crowd, the salute
t = haul[0] + 0.1
while t < at(haul, 0.75):
    add(sfx, footstep(0.4), t, pan=rng.uniform(-0.3, 0.3))
    if rng.random() < 0.35:
        add(sfx, creak(0.4) * 0.35, t + 0.1, pan=rng.uniform(-0.3, 0.3))
    t += BEAT / 2
add(sfx, babble(at(haul, 0.8) - haul[0], 1.1), haul[0], pan=0.0, gain=0.3)
add(sfx, boom(0.7), at(haul, 0.8), pan=0.1)
add(sfx, crowd(2.0), at(haul, 0.82), pan=-0.1, gain=0.3)
# port: ships' timbers, gulls, porters' feet and voices, a ship's bell
for k in range(5):
    add(sfx, creak(0.6) * 0.3, at(port, 0.1 + 0.15 * k), pan=rng.uniform(-0.5, 0.5))
add(sfx, filt(bell(523, 2.0, decay=1.8), "low", 2300), at(port, 0.55), pan=0.3, gain=0.12)
add(sfx, babble(port[1] - port[0] - 1.0, 1.0), port[0] + 0.8, pan=0.2, gain=0.25)
t = at(port, 0.3)
while t < port[1] - 0.3:
    add(sfx, footstep(0.3), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.4
# taken: the gun dragged, the splash of the second, the junk's sail filling
t = at(taken, 0.12)
while t < at(taken, 0.5):
    add(sfx, footstep(0.4), t, pan=rng.uniform(-0.3, 0.3))
    add(sfx, creak(0.3) * 0.25, t + 0.12, pan=rng.uniform(-0.3, 0.3))
    t += 0.32
for k in range(3):
    add(sfx, splash() * 0.6, at(taken, 0.47 + 0.03 * k), pan=-0.2 + 0.2 * k)
add(sfx, filt(whoosh(1.6, 0.6), "low", 1300), at(taken, 0.58), pan=0.0, gain=0.5)
add(sfx, gong(66, 3.4, 0.25), at(taken, 0.62), pan=0.0)
# newtown: oars, voices up the river, posts knocked in as the town rises
t = newtown[0] + 0.3
while t < at(newtown, 0.6):
    add(sfx, splash() * 0.12, t, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.5, 0.8)
add(sfx, babble(newtown[1] - newtown[0] - 0.6, 0.8), newtown[0] + 0.4, pan=-0.1, gain=0.25)
for k in range(9):
    add(sfx, thud(0.3, rng.uniform(90, 130)), at(newtown, 0.3 + 0.07 * k), pan=rng.uniform(-0.4, 0.4))
# bridge: rivets and steel clanks, the deck's thump, carts across
t = at(bridge, 0.2)
while t < at(bridge, 0.7):
    add(sfx, clink() * 0.4, t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.18, 0.3)
add(sfx, thud(0.7, 70), at(bridge, 0.7), pan=0.0)
t = at(bridge, 0.74)
while t < bridge[1] - 0.2:
    add(sfx, creak(0.3) * 0.25, t, pan=rng.uniform(-0.3, 0.3))
    t += 0.45
# the grow shot: a pop per block, traffic, the mosque's rise
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
add(sfx, filt(bell(392, 3.0, decay=1.5), "low", 2300), at(grow, 0.7), pan=0.0, gain=0.14)
# the fair: drums and cymbals of the procession, firecrackers, feet splashing through the river, the crowd
add(sfx, crowd(today[1] - fair[0]), fair[0] + 0.3, pan=-0.2, gain=0.2)
add(sfx, babble(today[1] - fair[0], 1.2), fair[0], pan=0.2, gain=0.25)
t = fair[0] + 0.2
while t < CALLBACK_T:
    add(sfx, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=0.18)
    add(sfx, drum(150, 70, 0.2, 0.5), t + BEAT / 2, pan=-0.2, gain=0.2)
    t += BEAT
for k in range(14):
    add(sfx, filt(firework_pop(), "low", 2000), at(fair, 0.05) + k * 0.18 + rng.uniform(0, 0.08), pan=rng.uniform(-0.5, 0.5), gain=0.12)
t = at(fair, 0.25)
while t < at(fair, 0.55):
    add(sfx, splash() * 0.18, t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.2, 0.35)
add(sfx, filt(whoosh(1.2, 0.6), "low", 1300), CALLBACK_T, pan=0.0, gain=0.45)  # the giant gun rises again
add(sfx, gong(73, 3.2, 0.3), CALLBACK_T + 1.0, pan=0.0)


# ---------------------------------------------------------------- the gaps between beats: a rising bridge into each
def bridge_gap(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [cast, haul, port, taken, newtown, bridge, grow, fair]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.2
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_pattani.wav", music, amb, sfx)
print("wrote public/soundtrack_pattani.wav", {"hero": round(hero[0], 2), "fair": round(fair[0], 2)})
