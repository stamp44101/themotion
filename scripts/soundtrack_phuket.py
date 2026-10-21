"""Phuket soundtrack: an Andaman palette (surf, ranat-like plucks, pi reed) that turns Hokkien
(gongs, cymbal-like bells, a steady drum) when the tin town comes, + SFX, all code.

Run:  node scripts/export_timeline.mjs src/cities/phuket/timeline.ts out/timeline_phuket.json
      python3 scripts/soundtrack_phuket.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_phuket.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_phuket.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
# cues sit on the story's beats (timeline.ts), so a retime of the picture moves the score
B = tl.beat
tin, siege, mines, oldtown, dredge, bridge_b, growth, turtles = (
    B("tin"), B("siege"), B("mines"), B("oldtown"), B("dredge"), B("bridge"), B("growth"), B("turtles"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (D major pentatonic, 96 bpm)
# a bright, open sea key; the siege drops to the relative minor
BEAT = 60 / 96
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83]
D, Bm, G, A, Em = [38, 45, 50], [35, 42, 47], [31, 38, 43], [33, 40, 45], [40, 47, 52]

add(music, pad(D, tin[1] + 0.5, 900), 0.0, gain=0.5)
sections = (
    (tin[1], siege[1], Bm),
    (siege[1], oldtown[0] - 0.4, Em),
    (oldtown[0] - 0.4, bridge_b[0] - 0.4, G),
    (bridge_b[0] - 0.4, growth[1], A),
    (growth[1], DUR, [38, 50, 57, 62, 66]),
)
for t0, t1, notes in sections:
    add(music, pad(notes, t1 - t0 + 0.6, 1400), t0, gain=0.36)
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        add(music, pluck(notes[2] + 12, 1.2, 0.6), t, pan=-0.25, gain=0.2)
        add(music, pluck(notes[1] + 24, 0.9, 0.5), t + BEAT / 2, pan=0.2, gain=0.11)


def ranat(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """ranat-like runs over the pentatonic: mostly steps, the odd leap, uneven."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        add(music, pluck(PENTA[i], 1.0, 0.55), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step * rng.choice([1, 1, 2])


def reed(t0, t1, step, amp, low=0, high=7, start=3):
    """pi phrases: long, slow vibrato, kept under 2.4 kHz (no harsh top)."""
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


khlui_line(1.2, tin[1], BEAT, 0.2)
reed(siege[0], siege[1], BEAT, 0.55)
ranat(mines[0], mines[1], BEAT / 2, 0.26, low=1)
ranat(oldtown[0], oldtown[1], BEAT / 2, 0.28, low=2)
ranat(dredge[0], dredge[1], BEAT / 2, 0.22, low=1)
khlui_line(growth[0], growth[1], BEAT, 0.18)
ranat(turtles[0] - 0.4, DUR - 2.5, BEAT / 2, 0.3, low=3)

# ---------------------------------------------------------------- ambience
# the sea: a quiet, irregular surf bed under everything, louder at the beach scenes
# owner: "ได้ยินแต่เสียงดนตรี" -- the small sounds are what people praise in the older clips. The
# ambience sat ~18 dB under the score (CLAUDE.md asks 8-12): it is an island, so a quiet surf is
# under every frame, with wind in the trees, dense birdsong before the town, crickets at night
add(amb, filt(pink(N), "band", (120, 700)) * 0.07, 0, pan=-0.3)
add(amb, filt(noise(N), "band", (180, 800)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * T)) * 0.035, 0, pan=0.3)


def surf(t0, t1, gain, pan=-0.3):
    """waves on the beach: each a slow swell and a hiss, at uneven intervals."""
    t = t0
    while t < t1 - 0.6:
        d = rng.uniform(1.2, 2.0)
        n = int(d * SR)
        add(amb, filt(pink(n), "band", (200, 1600)) * env_ar(n, d * 0.45, d * 0.5) * gain, t, pan=pan + rng.uniform(-0.2, 0.2))
        add(amb, splash(), t + d * 0.45, pan=pan, gain=gain * 1.5)
        t += rng.uniform(1.4, 2.9)


surf(0.0, 3.6, 0.28)
surf(tin[0] + 3, tin[1], 0.08, pan=0.4)
surf(dredge[0], dredge[1], 0.06, pan=0.3)
surf(turtles[0] - 0.5, DUR - 3, 0.24)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (siege[0] < t < siege[1]):
        # rounded off at 2.8 kHz: the owner dislikes sharp highs, and an unfiltered chirp
        # every 0.34 s put the clip's brightest moments in its first ten seconds
        add(amb, filt(chirp_bird(), "low", 2800), t, pan=rng.uniform(-0.8, 0.8), gain=1.8 if Y[i] < 1900 else 0.9)
    t += rng.exponential(0.5)
cr = np.sin(2 * np.pi * 4300 * T) * (np.sin(2 * np.pi * 27 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.6 * T) > 0.1).astype(float), "low", 40)
crickets = filt(cr, "low", 3000) * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.41 * SR)) * 0.8, 0, pan=0.6)
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1500)) * 0.05
add(amb, traffic * np.clip((Y - 1965) / 40, 0, 1) * 0.07, 0)

# ---------------------------------------------------------------- sfx
# the cover: flippers dragging sand, a heavy breath, then a low gong as they dig in (2.2-3.4 s)
for k in range(9):
    tt = 0.15 + k * 0.42 + rng.uniform(0, 0.06)
    if tt > 3.3:
        break
    n = int(0.35 * SR)
    add(sfx, filt(pink(n), "band", (150, 900)) * env_ar(n, 0.06, 0.28) * 0.5, tt, pan=rng.uniform(-0.3, 0.3), gain=0.5)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.45)
add(sfx, filt(pink(int(1.2 * SR)), "low", 300) * env_ar(int(1.2 * SR), 0.4, 0.7) * 0.6, 1.0, gain=0.35)
add(sfx, gong(88, 5.0, 0.3), 2.6)
add(sfx, whoosh(1.1, 0.75), 2.7, gain=0.3)
# 1675: the ship's timbers and a rope, the elephants' footfalls up the track, a trumpet at
# Luppoone, the tin lumps knocking in the boat
add(sfx, creak(0.6), at(tin, 0.4), pan=0.5, gain=0.3)
e0, e1 = at(tin, 0.42), at(tin, 0.97)
for t in np.arange(e0, e1, 0.46):
    add(sfx, drum(62, 36, 0.35, 0.9), t + rng.uniform(-0.04, 0.04), pan=0.4 - 0.8 * (t - e0) / (e1 - e0), gain=0.5)
add(sfx, filt(trumpet_elephant(1.3), "low", 1800), e1 - 0.6, pan=-0.3, gain=0.4)
for _ in range(8):
    add(sfx, drum(rng.uniform(300, 420), 200, 0.06, 0.2), rng.uniform(at(tin, 0.45), tin[1] - 0.2), pan=rng.uniform(0.3, 0.7), gain=0.25)
# 1785: war drums, the army's tramp, cannon from the stockade (low thumps, no crack), shouts
for i, t in enumerate(np.arange(siege[0] + 0.2, at(siege, 0.72), BEAT / 2)):
    add(sfx, drum(110, 55, 0.35, 0.8), t, pan=-0.2, gain=0.34 if i % 2 == 0 else 0.18)
for t in np.arange(siege[0] + 0.3, siege[1] - 0.3, 0.3):
    add(sfx, drum(rng.uniform(150, 200), 90, 0.07, 0.3), t + rng.uniform(-0.05, 0.05), pan=rng.uniform(-0.5, 0.0), gain=0.18)
t = at(siege, 0.42)
while t < at(siege, 0.74):
    add(sfx, drum(52, 28, 1.2, 1.0), t, pan=0.2, gain=0.55)
    add(sfx, filt(pink(int(1.0 * SR)), "low", 260) * env_ar(int(1.0 * SR), 0.01, 0.9) * 0.6, t + 0.02, gain=0.35)
    t += 1 / 1.6 * 2
add(sfx, crowd(siege[1] - siege[0] - 2.0), siege[0] + 1.0, pan=0.1, gain=0.2)
add(sfx, gong(98, 4.0, 0.28), at(siege, 0.86))
# 1849-69: picks in the pits, water in the sluices, Hokkien gongs as the town takes shape
t = mines[0] + 0.2
while t < at(mines, 0.92):
    add(sfx, drum(rng.uniform(160, 230), 100, 0.08, 0.3), t, pan=rng.uniform(-0.5, 0.2), gain=0.3)
    t += rng.uniform(0.2, 0.42)
n = int((mines[1] - mines[0]) * SR)
add(amb, filt(pink(n), "band", (300, 1400)) * env_ar(n, 0.6, 0.6) * 0.07, mines[0], pan=-0.2)
for k, t in enumerate(np.arange(mines[0] + 0.4, mines[1], BEAT * 2)):
    add(music, gong(rng.choice([196, 220, 262]), 1.0, 0.1), t, pan=rng.uniform(-0.3, 0.3))
# 1901-06: hammers and trowels on the shophouses, a street's voices
for _ in range(18):
    add(sfx, drum(rng.uniform(260, 420), 180, 0.12, 0.2), rng.uniform(at(oldtown, 0.05), at(oldtown, 0.8)), pan=rng.uniform(-0.6, 0.6))
add(sfx, crowd(oldtown[1] - oldtown[0] - 0.5), oldtown[0] + 0.3, pan=-0.1, gain=0.14)
# 1909: the dredge: the bucket chain's slow clank, the engine's thump, steam


def engine(dur, f0=4.2):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    thump = (np.sin(2 * np.pi * f0 * tt) > 0.85).astype(float)
    return filt(thump, "low", 160) * env_ar(n, 0.4, 0.6) * 0.7


add(sfx, engine(dredge[1] - dredge[0] + 0.4), dredge[0] - 0.2, pan=0.2, gain=0.5)
for t in np.arange(dredge[0] + 0.3, dredge[1] - 0.2, 0.55):
    add(sfx, drum(rng.uniform(320, 380), 220, 0.07, 0.25), t, pan=0.25, gain=0.28)
n = int(1.6 * SR)
for t in (at(dredge, 0.3), at(dredge, 0.75)):
    add(sfx, filt(noise(n), "band", (600, 2000)) * env_ar(n, 0.2, 1.2) * 0.12, t, pan=0.3)
# 1967: engines and tyres over the bridge, a horn


def horn(dur):
    n = int(dur * SR)
    ph = 2 * np.pi * np.arange(n) / SR
    return filt(np.sign(np.sin(410 * ph)) + np.sign(np.sin(500 * ph)), "band", (350, 2000)) * env_ar(n, 0.01, 0.06) * 0.25


n = int((bridge_b[1] - bridge_b[0]) * SR)
add(sfx, filt(pink(n), "low", 300) * env_ar(n, 0.8, 0.8) * 0.25, bridge_b[0], pan=-0.1)
add(sfx, horn(0.25), at(bridge_b, 0.35), pan=0.2, gain=0.1)
add(sfx, horn(0.18), at(bridge_b, 0.7), pan=-0.3, gain=0.08)
# the town grows: hammers, traffic, a distant jet coming in to Mai Khao
for _ in range(14):
    add(sfx, drum(rng.uniform(260, 420), 180, 0.12, 0.2), rng.uniform(at(growth, 0.05), at(growth, 0.8)), pan=rng.uniform(-0.6, 0.6))
n = int(3.5 * SR)
add(sfx, filt(pink(n), "band", (150, 900)) * env_ar(n, 1.8, 1.4) * 0.35, at(growth, 0.3), pan=-0.4)
# the payoff: surf, the hatchlings' patter on the sand, the crowd and Songkran drums
for _ in range(40):
    add(sfx, drum(rng.uniform(500, 700), 400, 0.03, 0.15), rng.uniform(turtles[0] + 0.3, turtles[1] - 0.2), pan=rng.uniform(-0.4, 0.2), gain=0.12)
add(sfx, crowd(turtles[1] - turtles[0] + 1.0), turtles[0] - 0.3, pan=0.2, gain=0.26)
for i, t in enumerate(np.arange(turtles[0] + 0.4, turtles[1], BEAT / 2)):
    add(sfx, drum(120, 62, 0.3, 0.7), t, pan=rng.uniform(-0.2, 0.2), gain=0.26 if i % 2 == 0 else 0.14)

# ---------------------------------------------------------------- the small sounds
# every thing that appears or moves on screen gets its own small sound, under nothing


def blip(f=None, gain=1.0):
    """a building popping up: a soft, round wooden 'tok' with a falling pitch, no sharp top"""
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f0 = f or rng.uniform(320, 620)
    tone = np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 9)) / SR) * np.exp(-t * 26)
    knock = filt(noise(n), "band", (600, 2200)) * np.exp(-t * 90) * 0.25
    return (tone + knock) * 0.55 * gain


def babble(dur, density=1.0):
    """people talking nearby: voice-band noise chopped into syllables, kept under 2.5 kHz"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    syl = np.zeros(n)
    k = 0
    while k < n:
        L = int(rng.uniform(0.08, 0.22) * SR)
        syl[k : k + L] = rng.uniform(0.3, 1.0) * np.hanning(min(L, n - k))
        k += L + int(rng.exponential(0.06 / density) * SR)
    v = filt(noise(n), "band", (250, 1100)) + 0.5 * filt(noise(n), "band", (1200, 2400))
    return v * filt(syl, "low", 30) * env_ar(n, 0.3, 0.5) * 0.6


def steps(t0, t1, every, gain, pan=0.0, soft=True):
    t = t0
    while t < t1:
        add(sfx, filt(footstep(gain), "low", 900) if soft else footstep(gain), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.2, 0.2))
        t += every * rng.uniform(0.85, 1.15)


# 1675: the lifeguard's feet beside the elephants, tin knocking into the boat, gulls
steps(at(tin, 0.42), at(tin, 0.97), 0.32, 0.22, pan=0.1)
for _ in range(10):
    # tin lumps knocking in the boat: a dull metal knock, not a bright ceramic clink
    add(sfx, filt(bell(rng.uniform(700, 1000), 0.3, ratios=(1, 2.32), decay=14), "low", 2400) * 0.4, rng.uniform(at(tin, 0.4), tin[1] - 0.2), pan=rng.uniform(0.3, 0.7), gain=0.5)
for _ in range(3):
    add(sfx, filt(chirp_bird(), "low", 2600), rng.uniform(tin[0] + 3.4, tin[1]), pan=rng.uniform(0.2, 0.8), gain=0.7)
# 1785: the camp's tents going up, the women's column marching out, shouts on both sides
for k in range(6):
    add(sfx, blip(rng.uniform(260, 360), 0.8), siege[0] + 0.4 + k * 0.22, pan=-0.4)
steps(at(siege, 0.32), at(siege, 0.86), 0.26, 0.2, pan=0.3)
add(sfx, babble(siege[1] - siege[0] - 1.0, 1.4), siege[0] + 0.6, pan=0.2, gain=0.5)
# 1849-69: each pit opening, the miners' feet and voices down the canal, the new town's
# houses popping up along it
for k in range(9):
    tk = tl.t_of(1849 + k * 2.2)
    if mines[0] <= tk <= mines[1]:
        add(sfx, blip(rng.uniform(200, 280), 1.0), tk, pan=rng.uniform(-0.5, 0.0))
        add(sfx, splash(), tk + 0.1, pan=rng.uniform(-0.5, 0.0), gain=0.25)
steps(mines[0] + 0.3, at(mines, 0.9), 0.3, 0.2, pan=-0.2)
add(sfx, babble(mines[1] - mines[0], 0.8), mines[0], pan=-0.1, gain=0.4)
t = at(mines, 0.3)
while t < mines[1]:
    add(sfx, blip(gain=0.6), t, pan=rng.uniform(-0.6, 0.6))
    t += rng.exponential(0.22)
# 1901-06: every shophouse that goes up on Thalang Road gets its pop, in order, east to west;
# the mansions a deeper one; the street fills with voices and a bicycle bell
for i in range(14):
    p = 0.1 + (i / 14) * 0.6
    add(sfx, blip(520 - i * 12, 1.0), at(oldtown, p), pan=0.5 - i * 0.07)
    add(sfx, blip(500 - i * 10, 0.7), at(oldtown, p) + 0.06, pan=0.4 - i * 0.07)
add(sfx, blip(240, 1.1), at(oldtown, 0.45), pan=-0.4)
add(sfx, babble(oldtown[1] - oldtown[0], 1.2), oldtown[0] + 0.3, pan=0.0, gain=0.55)
add(sfx, filt(bicycle_bell(), "low", 3000), at(oldtown, 0.8), pan=0.4, gain=0.6)
# 1909: gulls over the dredge
for _ in range(3):
    add(sfx, filt(chirp_bird(), "low", 2600), rng.uniform(dredge[0], dredge[1]), pan=rng.uniform(-0.6, 0.6), gain=0.6)
# 1967: the ferry's low horn, each pier going in as the bridge spans out, the cars' tyres
add(sfx, filt(steam_whistle(0.9), "low", 900), at(bridge_b, 0.05), pan=0.3, gain=0.25)
for k in range(7):
    add(sfx, blip(220 + k * 20, 0.9), at(bridge_b, 0.08 + k * 0.06), pan=-0.3 + k * 0.1)
t = at(bridge_b, 0.5)
while t < bridge_b[1]:
    m = int(0.5 * SR)
    add(sfx, filt(pink(m), "band", (120, 700)) * env_ar(m, 0.15, 0.3) * 0.3, t, pan=rng.uniform(-0.3, 0.3))
    t += 2.0 / 5
# 1973-2015: the town filling -- a quick patter of pops as the blocks and towers go up; the Big
# Buddha's completion gets a temple bell
t = growth[0] + 0.3
while t < at(growth, 0.75):
    add(sfx, blip(gain=0.55), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
add(sfx, bell(523, 3.0, ratios=(1, 2.0, 3.0), decay=1.0), at(growth, 0.8), pan=-0.2, gain=0.3)
# the payoff: sand under the mother's flippers, the hatchlings' small splashes as they reach the
# water, the crowd's voices close, footsteps in the sand as they walk in
for k in range(6):
    m = int(0.3 * SR)
    add(sfx, filt(pink(m), "band", (150, 800)) * env_ar(m, 0.05, 0.25) * 0.4, turtles[0] + 0.6 + k * 0.7, pan=-0.1, gain=0.6)
def plip():
    """a hatchling reaching the water: a soft droplet 'plip' (a falling tone, no hiss on top)
    over a short wash, so each one reads as its own event over the voices"""
    w = filt(splash(), "low", 2400)
    t = np.arange(len(w)) / SR
    drop = np.sin(2 * np.pi * np.cumsum(1300 * np.exp(-t * 18) + 500) / SR) * np.exp(-t * 30)
    return drop * 0.35 + w * 0.8


# each splash its own event: spaced, not clumped, and over the voices rather than inside them
t = turtles[0] + 2.0
while t < DUR - 4:
    add(sfx, plip(), t, pan=rng.uniform(-0.4, 0.2), gain=0.8)
    t += rng.uniform(0.45, 0.9)
steps(turtles[0], turtles[0] + 1.4, 0.2, 0.18, pan=0.4)
add(sfx, babble(DUR - turtles[0] - 3.5, 1.3), turtles[0] + 0.4, pan=0.3, gain=1.1)
add(sfx, babble(DUR - turtles[0] - 3.5, 0.9), turtles[0] + 0.9, pan=-0.3, gain=0.7)

# the gaps between beats: a rising swell and a quickening low roll carry each one, and a low
# gong lands the next downbeat (Phetchaburi's lesson: the gaps fell to the ambience bed)


def bridge(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [tin, siege, mines, oldtown, dredge, bridge_b, growth, turtles]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)
for b_ in (mines, dredge, growth, turtles):
    add(sfx, whoosh(1.1, 0.75), b_[0] - 0.95, pan=rng.uniform(-0.3, 0.3), gain=0.45)

# finale: fireworks over the bay -- soft low thumps and a last ranat phrase, no sharp pops
for i in range(6):
    add(sfx, drum(rng.uniform(55, 80), 30, 1.2, 0.9), DUR - 4.4 + i * 0.6, pan=rng.uniform(-0.5, 0.5), gain=0.3)
    add(music, gong(rng.choice([147, 196, 220]), 2.4, 0.1), DUR - 4.4 + i * 0.6 + 0.1, pan=rng.uniform(-0.5, 0.5))

# the score steps back ~4.5 dB so the small sounds carry (owner); it still leads the gaps
music *= 0.6
mix = master("public/soundtrack_phuket.wav", music, amb, sfx)
print("wrote public/soundtrack_phuket.wav", {"siege": round(siege[0], 2), "turtles": round(turtles[0], 2)})
