"""Saraburi soundtrack: a central-Thai palette (the ranat, the khong wong's gongs, the khlui, ching on the
beat), a northern pluck for the Thai Yuan coming down to Sao Hai, under a small sound for everything
that moves or appears: the deer's hooves and the splash at the Footprint with a bright swell as the
water lights, the hunter's running feet, the king's elephants and their bells on the straight road, the
mondop going up, the fire of 2310, the seven-tier mondop raised in 2330, the Thai Yuan's boats and
houses, the first train and the town following it, the trucks turning off for Isan, the town and the
cement works growing, and flower alms with the monks' feet on the naga stairs. All code; kept under
~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/saraburi/timeline.ts out/timeline_saraburi.json
      python3 scripts/soundtrack_saraburi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_saraburi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_saraburi.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, proc, fire, rebuild, yuan, train, road, grow, pay, today = (
    B("hero"), B("procession"), B("fire"), B("rebuild"), B("yuan"), B("train"), B("road"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.7  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below

# ---------------------------------------------------------------- score (A minor pentatonic, 84 bpm)
BEAT = 60 / 84
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, F, C, G, Dm, Em = [45, 52, 57], [41, 48, 53], [48, 55, 60], [43, 50, 55], [50, 57, 62], [40, 47, 52]

sections = (
    (0.0, proc[0], [45, 52, 57, 64], 1.0),
    (proc[0], fire[0], C, 0.9),
    (fire[0], rebuild[0], Em, 0.85),
    (rebuild[0], yuan[0], F, 0.9),
    (yuan[0], train[0], Dm, 0.85),
    (train[0], grow[0], Am, 0.9),
    (grow[0], pay[0], G, 0.9),
    (pay[0], DUR, [45, 52, 57, 60, 64], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.22 * lvl)


def ranat_run(t0, t1, amp, step=BEAT / 2, prob=0.85):
    """the ranat ek, soft mallets wandering the pentatonic, rounded at 2.4 kHz"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.6), "low", 2400), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def sueng(t0, t1, amp):
    """a northern plucked lute for the Thai Yuan: slow, open intervals"""
    t = t0
    i = 3
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, 1, 2]), 0, len(PENTA) - 1))
        add(music, filt(pluck(PENTA[i] - 12, 1.6, 0.8), "low", 2200), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += BEAT * rng.choice([1, 1, 2])


def khong(t0, t1, amp):
    t = t0
    i = 2
    while t < t1:
        i = int(np.clip(i + rng.choice([-1, 1, 2, -2]), 0, len(PENTA) - 1))
        add(music, filt(bell(mtof(PENTA[i] - 12), 1.2, decay=2.4), "low", 2000), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += BEAT * rng.choice([1, 1, 2])


def chings(t0, t1, gain):
    for t in np.arange(t0, t1, BEAT):
        add(sfx, filt(ching(), "low", 2400), t, pan=-0.15, gain=gain)


ranat_run(2.2, hero[1], 0.12, prob=0.55)
khong(proc[0], proc[1], 0.1)
add(music, filt(khlui(64, 3.0), "low", 2200), fire[0] + 0.6, pan=0.2, gain=0.16)
khong(rebuild[0], rebuild[1], 0.1)
sueng(yuan[0], yuan[1], 0.16)
ranat_run(train[0], road[1], 0.13)
ranat_run(grow[0], grow[1], 0.12, prob=0.7)
add(music, filt(khlui(69, 3.2), "low", 2200), pay[0] + 0.4, pan=0.2, gain=0.18)
ranat_run(pay[0] + 0.3, DUR - 3.0, 0.15)
khong(pay[0] + 1.0, DUR - 3.0, 0.1)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
# the forest and its birds while the land is open; the Pa Sak under the river beats; the town bed
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.1 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.7)
n = int((yuan[1] - yuan[0] + 1.0) * SR)
add(amb, filt(pink(n), "band", (150, 700)) * env_ar(n, 0.6, 0.6) * 0.3, yuan[0] - 0.4, pan=-0.3)
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


def steps(t0, t1, every, gain, pan=0.0):
    t = t0
    while t < t1:
        add(sfx, filt(footstep(gain), "low", 900), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.2, 0.2))
        t += every * rng.uniform(0.85, 1.15)


def hoof(gain=1.0):
    """a deer's hoof on earth and rock: a short, hollow knock"""
    return filt(drum(rng.uniform(150, 210), 90, 0.09, 0.5), "low", 1600) * gain


def stomp(gain=1.0):
    """an elephant's foot: a deep, soft thud"""
    return filt(drum(rng.uniform(45, 60), 32, 0.35, 0.9), "low", 400) * gain


def rise_tone(dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (45, 52, 57, 60, 64):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def crackle(dur, gain):
    """the fire: a breathing roar with crackles"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    roar = filt(pink(n), "band", (60, 600)) * (0.8 + 0.2 * np.sin(2 * np.pi * 1.1 * t))
    pops = np.zeros(n)
    for _ in range(int(dur * 14)):
        k = rng.integers(0, n - 800)
        pops[k : k + 800] += filt(noise(800), "band", (500, 2200)) * np.exp(-np.arange(800) / 80) * rng.uniform(0.3, 1.0)
    return (roar + pops * 0.6) * env_ar(n, dur * 0.2, dur * 0.35) * gain


def brick(gain=1.0):
    return filt(drum(rng.uniform(110, 160), 70, 0.14, 0.6), "low", 1400) * gain


def paddle(gain=1.0):
    return splash() * 0.35 * gain


def engine_hum(dur, gain, f=55):
    """a truck going past: a low diesel hum that swells and fades"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.03 * np.sin(2 * np.pi * 6 * t))) / SR
    x = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.3 * filt(noise(n), "band", (80, 500))
    return filt(x, "low", 700) * np.hanning(n) * 0.4 * gain


def chant(dur, gain):
    """the monks' low recitation under the alms: a soft drone on two notes"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m, a in ((45, 1.0), (52, 0.5), (57, 0.3)):
        f = mtof(m - 12) * (1 + 0.006 * np.sin(2 * np.pi * 0.7 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += a * (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph))
    return filt(out, "low", 900) * env_ar(n, 1.0, 1.2) * 0.12 * gain


# the cover: the deer's hooves gallop in, a splash at the print, the water lights with a swell and a
# gong, the hunter's running feet, then the deer bounds away up the hill
t = 0.0
while t < 1.0:
    add(sfx, hoof(0.9), t, pan=-0.2 + t * 0.3)
    t += 0.13
add(sfx, splash() * 0.5, 1.0, pan=0.1)
add(sfx, rise_tone(2.2, 1.2), 0.95, pan=0.0)
add(sfx, gong(73, 4.0, 0.45), 1.0, pan=0.0)
add(sfx, whoosh(1.4, 0.4), 1.05, pan=0.0)
steps(0.1, 2.4, 0.22, 0.45, pan=-0.4)
t = 2.2
while t < 4.6:
    add(sfx, hoof(0.7 * (1 - (t - 2.2) / 3)), t, pan=0.2)
    t += 0.17
add(sfx, filt(bell(mtof(81), 1.2, decay=2.0), "low", 2200), 2.6, pan=-0.2, gain=0.2)
# the king's elephants on the straight road: slow thuds, their bells, the mondop going up
t = proc[0] + 0.1
while t < proc[1] - 0.1:
    add(sfx, stomp(0.9), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.25, 0.4)
for k in range(10):
    add(sfx, filt(bell(mtof(rng.choice([76, 79, 81])), 0.6, decay=1.6), "low", 2200), at(proc, 0.05 + k * 0.09), pan=rng.uniform(-0.5, 0.5), gain=0.12)
for k in range(8):
    add(sfx, blip(rng.uniform(280, 420), 0.6), at(proc, 0.45 + k * 0.06), pan=rng.uniform(-0.3, 0.3))
add(sfx, babble(proc[1] - proc[0] - 0.6, 0.6), proc[0] + 0.3, pan=-0.2, gain=0.25)
# 2310: the fire takes the mondop, the roof falls in
add(sfx, crackle(fire[1] - fire[0] + 0.4, 0.55), fire[0] + 0.2, pan=0.0)
add(sfx, whoosh(1.6, 0.6), at(fire, 0.12), pan=0.1)
n = int(1.4 * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 0.05, 1.2) * 0.7, at(fire, 0.5), pan=0.0)
add(sfx, gong(65, 3.0, 0.35), at(fire, 0.55), pan=0.0)
# 2330: the new mondop goes up tier by tier, mallets and bricks, the spire set with a gong and ching
for k in range(24):
    add(sfx, brick(0.55), rng.uniform(rebuild[0], at(rebuild, 0.75)), pan=rng.uniform(-0.6, 0.6))
for k in range(7):
    add(sfx, blip(300 + k * 30, 0.7), at(rebuild, 0.35 + k * 0.06), pan=-0.3 + k * 0.1)
add(sfx, gong(73, 3.0, 0.4), at(rebuild, 0.82), pan=0.0)
chings(at(rebuild, 0.84), rebuild[1], 0.18)
# 2347: the Thai Yuan's boats on the Pa Sak, voices, the houses going up, a loom's clack
t = yuan[0] + 0.2
while t < yuan[1] - 0.1:
    add(sfx, paddle(1.0), t, pan=rng.uniform(-0.5, 0.2), gain=0.8)
    t += rng.uniform(0.35, 0.5)
add(sfx, babble(yuan[1] - yuan[0] - 0.4, 0.8), yuan[0] + 0.2, pan=-0.1, gain=0.3)
for k in range(14):
    add(sfx, blip(rng.uniform(240, 360), 0.6), at(yuan, 0.3 + k * 0.035), pan=rng.uniform(-0.5, 0.5))
for t in np.arange(at(yuan, 0.6), yuan[1] - 0.2, 0.45):
    add(sfx, filt(drum(240, 180, 0.06, 0.4), "low", 1800), t, pan=0.3, gain=0.25)
# 2440: the first train, its whistle; the hall going up at Pak Phriao and the town filling
t = train[0] + 0.2
while t < train[1] - 0.2:
    add(sfx, filt(chuff(), "low", 1800), t, pan=0.3, gain=1.0)
    t += 0.2
add(sfx, filt(steam_whistle(1.4), "low", 2000), train[0] + 0.5, pan=0.3, gain=0.7)
for k in range(10):
    add(sfx, blip(rng.uniform(260, 420), 0.6), at(train, 0.35 + k * 0.05), pan=rng.uniform(-0.4, 0.4))
add(sfx, babble(train[1] - train[0] - 1, 1.0), at(train, 0.4), pan=-0.3, gain=0.35)
# 2501: the trucks turning off for Korat, horns soft and low
for k in range(8):
    add(sfx, engine_hum(1.8, 0.8, f=rng.uniform(48, 62)), at(road, 0.02 + k * 0.11), pan=-0.5 + k * 0.13)
add(sfx, filt(bell(mtof(64), 0.5, decay=0.8), "low", 1800), at(road, 0.3), pan=0.3, gain=0.15)
add(sfx, filt(bell(mtof(60), 0.5, decay=0.8), "low", 1800), at(road, 0.7), pan=-0.2, gain=0.12)
# the town and the cement works growing: a pop per block, the works' low rumble, traffic
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 220) * env_ar(n, 2.0, 2.0) * 0.35, grow[0], pan=0.4)
add(sfx, filt(pink(int(5 * SR)), "low", 600) * env_ar(int(5 * SR), 1.5, 1.5) * 0.25, at(grow, 0.4), pan=0.3)
# the payoff: flowers opening, the crowd, the monks' feet up the naga stairs, a drone, drums and ching
for k in range(12):
    add(sfx, blip(rng.uniform(420, 620), 0.45), at(pay, 0.02 + k * 0.035), pan=rng.uniform(-0.6, 0.6))
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.3)
add(sfx, babble(today[1] - pay[0], 1.0), pay[0] + 0.2, pan=0.3, gain=0.35)
add(sfx, chant(pay[1] - pay[0], 1.0), pay[0] + 0.3, pan=0.0)
add(sfx, rise_tone(2.0, 1.0), pay[0] + 0.2, pan=0.0)
steps(pay[0] + 0.3, pay[1] - 0.3, 0.32, 0.3, pan=-0.2)
for t in np.arange(pay[0] + 0.4, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(80, 52, 0.4, 0.9), t, pan=-0.2, gain=0.2)
chings(pay[0] + 0.4, pay[1] - 0.2, 0.22)
add(sfx, gong(73, 3.0, 0.4), at(pay, 0.92), pan=0.0)

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


order = [hero, proc, fire, rebuild, yuan, train, road, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(73, 2.6, 0.2), b_[0], pan=0.05)

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
mix = master("public/soundtrack_saraburi.wav", music, amb, sfx)
print("wrote public/soundtrack_saraburi.wav", {"hero": round(hero[0], 2), "payoff": round(pay[0], 2)})
