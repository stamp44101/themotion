"""Phetchabun soundtrack: a central-Thai palette (the ranat played soft, the ขลุ่ย flute, the gong
circle and a low pad) under a small sound for everything that moves or appears: the whirlpool
and the image rising, the oars and the raft, the bricks of the wall, the army's drums and the
camp's palisade falling, the axes and hammers of Nakhonban, the tamarind trucks, the town, and the
rite: the people on the bank, the dips and the gong. All code; kept under ~2.4 kHz (the owner
dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/phetchabun/timeline.ts out/timeline_phetchabun.json
      python3 scripts/soundtrack_phetchabun.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402
import elephant_voices as ev  # noqa: E402

synth.init(json.load(open("out/timeline_phetchabun.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_phetchabun.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, proc, wall, army, cap, tam, grow, pay, today = (
    B("hero"), B("procession"), B("wall"), B("army"), B("capital"), B("tamarind"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (C pentatonic, 84 bpm)
BEAT = 60 / 84
PENTA = [60, 62, 64, 67, 69, 72, 74, 76, 79]
C, Am, F, G, Dm = [48, 55, 60], [45, 52, 57], [41, 48, 53], [43, 50, 55], [38, 45, 50]

sections = (
    (0.0, proc[1], [36, 48, 55, 60, 64], 0.9),
    (proc[1], army[0], F, 0.85),
    (army[0], cap[0], Dm, 0.85),
    (cap[0], tam[0], Am, 0.8),
    (tam[0], grow[0], C, 0.9),
    (grow[0], pay[0], G, 0.9),
    (pay[0], DUR, [36, 48, 55, 60, 64], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, 1200), t0, gain=0.26 * lvl)


def soft_ranat(m, dur=0.9):
    """the ranat, played with soft mallets: rounded off at 2.4 kHz"""
    return filt(ranat(m, dur), "low", 2400, order=4)


def ranat_run(t0, t1, step, amp, prob=1.0, low=1, high=8):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), low, high))
            add(music, soft_ranat(PENTA[i]), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
            add(music, soft_ranat(PENTA[i] - 12), t, pan=rng.uniform(-0.4, 0.4), gain=amp * 0.35)
        t += step


def flute(t0, t1, amp, pan=0.2, start=5):
    i = start
    t = t0
    while t < t1 - 0.4:
        i = int(np.clip(i + rng.choice([-1, -1, 0, 1, 1]), 1, len(PENTA) - 2))
        d = BEAT * rng.choice([1, 1, 2, 3])
        add(music, filt(khlui(PENTA[i], d), "low", 2400), t, pan=pan, gain=amp)
        t += d


flute(3.3, hero[1] + 0.4, 0.2, start=6)
ranat_run(proc[0], proc[1], BEAT / 2, 0.16, prob=0.7)
ranat_run(wall[0], wall[1], BEAT / 2, 0.15, prob=0.8)
flute(cap[0] + 0.3, cap[1], 0.15, pan=-0.2)
ranat_run(tam[0], grow[1], BEAT / 2, 0.14, prob=0.75)
flute(pay[0] + 0.4, DUR - 3.0, 0.2, start=5)
ranat_run(pay[0] + 2.0, DUR - 3.0, BEAT, 0.12, prob=0.6)

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "band", (150, 700)) * 0.25, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.1 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.7)
river = filt(pink(N), "band", (90, 500)) * (0.6 + 0.4 * filt(noise(N), "low", 0.4) * 4)
add(amb, river * 0.25, 0, pan=0.2)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1965) / 50, 0, 1) * 0.17, 0)

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


def oar(gain=1.0):
    """an oar dipping and pulling: a soft low plunge and a wash"""
    n = int(0.36 * SR)
    t = np.arange(n) / SR
    plunge = filt(noise(n), "band", (160, 900)) * np.exp(-t * 12)
    body = np.sin(2 * np.pi * np.cumsum(130 * np.exp(-t * 6)) / SR) * np.exp(-t * 20) * 0.4
    return (plunge + body) * 0.5 * gain


def swirl(dur, gain):
    """the whirlpool: a slow, low turning wash that swells and falls away"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = filt(pink(n), "band", (90, 900))
    turn = 0.6 + 0.4 * np.sin(2 * np.pi * 1.1 * t) ** 2
    return x * turn * env_ar(n, 0.05, dur * 0.5) * 0.7 * gain


def rise_tone(dur, gain):
    """the image rising: a soft swell of low voices and a glow, no sharp edge"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (48, 55, 60, 64, 67):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def hammer(gain=1.0):
    """a mallet on timber"""
    return filt(drum(rng.uniform(260, 380), 180, 0.12, 0.6), "low", 1800) * gain


# the cover: the whirlpool turning from frame 0, the burst, the rise, a gong as it stands
add(sfx, swirl(6.0, 1.0), 0.0, pan=0.0)
n = int(1.6 * SR)
add(sfx, filt(pink(n), "band", (120, 1400)) * env_ar(n, 0.02, 1.2) * 0.7, 0.0, pan=0.05)  # the burst
add(sfx, rise_tone(3.4, 1.0), 0.1, pan=0.0)
add(sfx, gong(98, 3.2, 0.35), 0.05, pan=0.0)
add(sfx, gong(147, 3.0, 0.25), 2.3, pan=0.1)
for k in range(4):
    add(sfx, filt(bell(rng.choice([392, 440, 523]), 2.2), "low", 2400), 1.8 + k * 0.35, pan=rng.uniform(-0.5, 0.5), gain=0.12)
for k in range(5):
    add(sfx, splash(), 0.2 + k * 0.32, pan=rng.uniform(-0.4, 0.4), gain=0.8)
add(sfx, babble(hero[1] - 4.0, 0.5), 3.8, pan=0.3, gain=0.3)
# the boats come in and the raft goes down to Wat Traiphum: oars, a drum, the people on the banks
t = 4.9
while t < proc[1] - 0.2:
    add(sfx, oar(0.75), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.42 * rng.uniform(0.9, 1.1)
for t in np.arange(proc[0] + 0.2, proc[1] - 0.2, BEAT):
    add(sfx, drum(96, 60, 0.3, 0.7), t, pan=-0.1, gain=0.4)
for k in range(4):
    add(sfx, filt(ching(), "low", 2400), at(proc, 0.1 + k * 0.25), pan=0.3, gain=0.35)
add(sfx, babble(proc[1] - proc[0], 0.8), proc[0], pan=0.2, gain=0.4)
add(sfx, gong(110, 2.6, 0.3), at(proc, 0.95), pan=0.0)
# the wall going up round the town: a tok per course, mallets, the builders' feet and voices
for i in range(34):
    add(sfx, blip(rng.uniform(240, 420), 0.65), at(wall, 0.05 + i * 0.024), pan=rng.uniform(-0.6, 0.6))
for _ in range(22):
    add(sfx, hammer(0.6), rng.uniform(wall[0] + 0.1, wall[1] - 0.2), pan=rng.uniform(-0.6, 0.6))
steps(wall[0] + 0.2, wall[1] - 0.2, 0.22, 0.45, pan=0.1)
add(sfx, babble(wall[1] - wall[0] - 0.6, 0.9), wall[0] + 0.3, pan=0.1, gain=0.4)
# 2370: the army up the west side, its drums, an elephant, the camp's palisade falling
for t in np.arange(army[0] + 0.1, army[1] - 0.2, BEAT):
    add(sfx, drum(80, 52, 0.4, 0.9), t, pan=-0.3, gain=0.5)
steps(army[0] + 0.1, army[1] - 0.2, 0.13, 0.5, pan=-0.2)
add(sfx, ev.trumpet(1.0), at(army, 0.15), pan=-0.3, gain=0.55)
add(sfx, ev.rumble(1.0, 2.0), at(army, 0.3), pan=-0.3, gain=0.45)
for k in range(10):
    add(sfx, creak(0.5), at(army, 0.44 + k * 0.025), pan=rng.uniform(-0.4, 0.4), gain=0.4)
    add(sfx, drum(rng.uniform(90, 130), 55, 0.35, 0.8), at(army, 0.45 + k * 0.025), pan=rng.uniform(-0.4, 0.4), gain=0.35)
for k in range(3):
    add(sfx, clash(), at(army, 0.48 + k * 0.05), pan=rng.uniform(-0.3, 0.3), gain=0.3)
add(sfx, crowd(1.8), at(army, 0.6), pan=-0.1, gain=0.25)
# 2486: Nakhonban: axes and hammers, the halls going up, the workers; then quiet
for _ in range(30):
    add(sfx, hammer(0.7), rng.uniform(cap[0] + 0.1, at(cap, 0.85)), pan=rng.uniform(-0.6, 0.6))
for i in range(14):
    add(sfx, blip(rng.uniform(200, 320), 0.7), at(cap, 0.05 + i * 0.055), pan=rng.uniform(-0.5, 0.5))
steps(cap[0] + 0.2, at(cap, 0.9), 0.24, 0.45, pan=0.2)
add(sfx, babble(at(cap, 0.85) - cap[0], 0.8), cap[0] + 0.2, pan=-0.1, gain=0.35)
add(sfx, gong(88, 3.0, 0.25), at(cap, 0.9), pan=0.0)
# the tamarind trucks: a low engine each as it passes, the pickers' voices
def truck(dur=2.2, f=46):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.03 * np.sin(2 * np.pi * 0.5 * t))) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 16))
    return filt(x, "low", 1200, order=4) * env_ar(n, 0.5, 0.9) * 0.16


for i in range(5):
    add(sfx, truck(), at(tam, 0.02 + i * 0.25), pan=rng.uniform(-0.3, 0.3), gain=0.8)
for _ in range(16):
    add(sfx, filt(clink(), "low", 2400), rng.uniform(tam[0] + 0.2, tam[1] - 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.4)
add(sfx, babble(tam[1] - tam[0] - 0.4, 0.9), tam[0] + 0.2, pan=-0.3, gain=0.4)
# the town spreading: a pop per block, then cars
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
# the payoff: the crowd on the banks, the wade, three dips with a wash each, a gong, the cheer
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.3)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.5)
n = int(2.4 * SR)
add(sfx, filt(pink(n), "band", (150, 900)) * env_ar(n, 0.4, 1.0) * 0.4, pay[0], pan=-0.1)  # the wade
for k in range(3):
    d0 = at(pay, 0.3 + (k + 0.5) * 0.55 / 3)
    n = int(1.0 * SR)
    add(sfx, filt(pink(n), "band", (120, 1100)) * env_ar(n, 0.05, 0.8) * 0.8, d0 - 0.2, pan=0.0)
    add(sfx, splash(), d0, pan=0.0, gain=1.0)
    add(sfx, gong(98, 2.4, 0.3), d0 + 0.3, pan=0.0)
add(sfx, rise_tone(3.0, 0.9), at(pay, 0.85), pan=0.0)
add(sfx, crowd(2.4), at(pay, 0.88), pan=0.0, gain=0.4)
for k in range(4):
    add(sfx, filt(ching(), "low", 2400), at(pay, 0.1 + k * 0.2), pan=0.3, gain=0.3)

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


order = [hero, proc, wall, army, cap, tam, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)

# finale: lanterns rising -- soft low gongs
for i in range(5):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.2 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.9
mix = master("public/soundtrack_phetchabun.wav", music, amb, sfx)
print("wrote public/soundtrack_phetchabun.wav", {"army": round(army[0], 2), "payoff": round(pay[0], 2)})
