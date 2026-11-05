"""Sakon Nakhon soundtrack: an Isan palette (the khaen's chords, the phin's plucked line, the klong and the ching)
under a small sound for everything that moves or appears: the cloth snapping and the dye dripping over the cover,
the water rising over the legend town, the Khmer town's mallets and a conch-like horn for the Brahmins, a bell as
the stupa closes over the prasat, the column's feet and carts leaving south, the elephants and carts of the Tai Yo,
the rafts' paddles and a chapel bell at Tha Rae, the planes' drone and the chutes over Phu Phan, the town and the
airliner in the grow shot, and the procession's drums, crowd and khaen at the stupa. All code; kept under ~2.4 kHz
(the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/sakonnakhon/timeline.ts out/timeline_sakonnakhon.json
      python3 scripts/soundtrack_sakonnakhon.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_sakonnakhon.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_sakonnakhon.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, sink, khmer, lx, leave, arrive, cross, drop, grow, pay, today = (
    B("hero"), B("sink"), B("khmer"), B("lanxang"), B("leave"), B("arrive"), B("cross"), B("drop"), B("grow"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.35  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below

# ---------------------------------------------------------------- score (A minor pentatonic, the Isan lai, 92 bpm)
BEAT = 60 / 92
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, Dm, F = [45, 52, 57], [48, 55, 60], [43, 50, 55], [50, 57, 62], [41, 48, 53]

sections = (
    (0.0, sink[0], [45, 52, 57, 64], 1.0),
    (sink[0], khmer[0], Dm, 0.85),
    (khmer[0], lx[0], C, 0.9),
    (lx[0], leave[0], F, 0.9),
    (leave[0], arrive[0], [45, 52, 57], 0.7),
    (arrive[0], cross[0], G, 0.95),
    (cross[0], drop[0], C, 0.9),
    (drop[0], grow[0], Dm, 0.8),
    (grow[0], pay[0], F, 0.95),
    (pay[0], DUR, [45, 52, 57, 60, 64], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.2 * lvl)
    add(music, filt(khaen(notes, t1 - t0 + 0.4, bright=2000), "low", 2200), t0, pan=-0.15, gain=0.07 * lvl)


def phin_run(t0, t1, amp, step=BEAT / 2, prob=0.8):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(pluck(PENTA[i], 0.9, 0.8), "low", 2300), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def klong(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0.7, 0, 0.5, 0.8, 0.4]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(140, 165), 85, 0.14, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 4 == 0:
            add(music, drum(66, 44, 0.5, 0.9), t, pan=0.1, gain=gain * 0.8)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.5)
        t += BEAT / 2
        k += 1


phin_run(2.0, hero[1], 0.12, prob=0.55)
phin_run(khmer[0], khmer[1], 0.11, prob=0.6)
phin_run(arrive[0], arrive[1], 0.12, prob=0.7)
klong(arrive[0] + 0.4, arrive[1], 0.1)
phin_run(cross[0], cross[1], 0.11, prob=0.6)
phin_run(grow[0], grow[1], 0.12, prob=0.75)
phin_run(pay[0], DUR - 3.0, 0.12, prob=0.8)
klong(pay[0] + 0.2, DUR - 3.0, 0.15)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.8)
lake_on = np.clip((np.arange(N) / SR - sink[0]) / 3.0, 0, 1)
add(amb, filt(pink(N), "band", (120, 600)) * lake_on * 0.18, 0)  # the lake's lapping, once it is there
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 50, 0, 1) * 0.17, 0)  # the town bed


# ---------------------------------------------------------------- the small sounds
def blip(f=None, gain=1.0):
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


def mallet(gain=1.0):
    return filt(drum(rng.uniform(180, 260), 120, 0.08, 0.5), "low", 1800) * gain


def drip(gain=1.0):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 18) + 300) / SR) * np.exp(-t * 40) * 0.3 * gain


def flap(gain=1.0):
    """cloth snapping in the wind"""
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (200, 1400)) * np.exp(-t * 22) * 0.5 * gain


def paddle(gain=1.0):
    return splash() * 0.35 * gain


def horn(gain=1.0, dur=1.6, f=147):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * f * t * (1 + 0.003 * np.sin(2 * np.pi * 5 * t))
    x = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)
    return filt(x, "low", 900) * env_ar(n, 0.15, 0.6) * 0.14 * gain


def rise_tone(dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (45, 52, 57, 60, 64):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


# the cover: the cloth is already climbing at frame 0: drips into the pot, the cloth snapping, a khaen swell
for k in range(14):
    add(sfx, drip(0.8), 0.05 + k * 0.32 + rng.uniform(0, 0.08), pan=rng.uniform(-0.3, 0.3))
t = 1.5
while t < 4.6:
    add(sfx, flap(0.9), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.35, 0.6)
add(sfx, filt(whoosh(1.2, 0.6), "low", 1800), 1.4, pan=0.0, gain=0.5)
add(sfx, filt(khaen([57, 64, 69], 2.2, 2000), "low", 2200), 0.0, pan=0.0, gain=0.12)
add(sfx, filt(whoosh(1.6, 0.7), "low", 1600), 4.4, pan=0.1, gain=0.5)  # the cloth draws away into the lake
# the legend: the ground groans, the town drops, the water rushes in
n = int((sink[1] - sink[0]) * SR)
add(sfx, filt(pink(n), "low", 300) * env_ar(n, 0.4, 1.2) * 0.45, sink[0], pan=0.0)
add(sfx, filt(pink(n), "band", (150, 900)) * env_ar(n, 1.6, 1.0) * 0.4, sink[0] + 0.4, pan=0.2)
for p in (0.15, 0.35, 0.6):
    add(sfx, splash() * 0.9, at(sink, p), pan=rng.uniform(-0.4, 0.4))
for k in range(8):
    add(sfx, creak(0.5) * 0.5, at(sink, 0.05 + k * 0.06), pan=rng.uniform(-0.5, 0.5))
# the Khmer town: the moat and the prasat going up, mallets, the Brahmins' horn and their feet over the bridge
t = khmer[0] + 0.2
while t < at(khmer, 0.6):
    add(sfx, mallet(0.7), t, pan=rng.uniform(-0.6, 0.6))
    t += rng.uniform(0.18, 0.3)
for k in range(10):
    add(sfx, blip(rng.uniform(220, 340), 0.7), at(khmer, 0.05 + k * 0.05), pan=rng.uniform(-0.5, 0.5))
add(sfx, horn(1.0, 1.8, 147), at(khmer, 0.3), pan=-0.3)
add(sfx, horn(0.8, 1.6, 196), at(khmer, 0.55), pan=-0.3)
t = at(khmer, 0.3)
while t < khmer[1] - 0.2:
    add(sfx, footstep(0.5), t, pan=-0.2)
    t += 0.28
add(sfx, gong(70, 2.4, 0.3), at(khmer, 0.62), pan=0.2)
# Lan Xang: the stupa closes over the prasat: a rising tone, bells
add(sfx, rise_tone(2.2, 1.0), lx[0] + 0.1, pan=0.0)
for k in range(3):
    add(sfx, filt(bell(392 * (1, 1.5, 2)[k], 2.6, decay=1.8), "low", 2200), at(lx, 0.25 + 0.2 * k), pan=rng.uniform(-0.3, 0.3), gain=0.12)
add(sfx, gong(66, 3.0, 0.35), at(lx, 0.7), pan=0.0)
# 2370: the column led away south: feet, carts, a low drum, nothing loud
t = at(leave, 0.08)
while t < leave[1] - 0.3:
    add(sfx, footstep(0.6), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.24
for k in range(3):
    add(sfx, creak(0.7) * 0.6, at(leave, 0.2 + 0.25 * k), pan=0.2)
for t in np.arange(leave[0] + 0.3, leave[1] - 0.3, BEAT * 2):
    add(sfx, drum(80, 52, 0.4, 0.8), t, pan=-0.1, gain=0.12)
# 2381: the Tai Yo arrive: elephants, carts, feet, the town's babble as the houses go up
for k in range(3):
    add(sfx, filt(trumpet_elephant(1.0), "low", 2000), at(arrive, 0.1 + 0.25 * k), pan=rng.uniform(-0.5, 0.5), gain=0.5)
t = arrive[0]
while t < at(arrive, 0.75):
    add(sfx, footstep(0.6), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.22
for k in range(4):
    add(sfx, creak(0.7) * 0.6, at(arrive, 0.3 + 0.12 * k), pan=0.3)
for k in range(14):
    add(sfx, blip(rng.uniform(240, 380), 0.6), at(arrive, 0.55 + k * 0.03), pan=rng.uniform(-0.5, 0.5))
add(sfx, babble(arrive[1] - at(arrive, 0.5), 0.8), at(arrive, 0.5), pan=-0.1, gain=0.3)
add(sfx, gong(74, 2.6, 0.3), at(arrive, 0.85), pan=0.1)
# 2427: the rafts' paddles across the lake, the chapel bell at Tha Rae
t = cross[0] + 0.1
while t < at(cross, 0.85):
    add(sfx, paddle(1.0), t, pan=rng.uniform(-0.5, 0.3), gain=0.8)
    t += rng.uniform(0.3, 0.45)
for k in range(8):
    add(sfx, blip(rng.uniform(260, 380), 0.6), at(cross, 0.6 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
for k in range(3):
    add(sfx, filt(bell(523, 2.2, decay=2.2), "low", 2200), at(cross, 0.72 + 0.08 * k), pan=0.3, gain=0.1)
# 2487: the planes' drone over the hills, the chutes opening, the fires
n = int((drop[1] - drop[0]) * SR)
t_ = np.arange(n) / SR
drone = filt(np.sin(2 * np.pi * 92 * t_) + 0.5 * np.sin(2 * np.pi * 184 * t_ * (1 + 0.01 * np.sin(t_))), "low", 700)
add(sfx, drone * env_ar(n, 0.6, 1.0) * 0.14, drop[0], pan=0.4)
for k in range(10):
    add(sfx, filt(whoosh(0.5, 0.4), "low", 1600), drop[0] + 1.4 + k * 0.28, pan=rng.uniform(-0.5, 0.5), gain=0.25)
add(sfx, crackle(drop[1] - at(drop, 0.2)), at(drop, 0.2), pan=-0.3, gain=0.25)
# the grow shot: a pop per block, traffic, the airliner landing
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.4)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 1.5, 1.5) * 0.3, grow[0], pan=0.3)
add(sfx, filt(jet(3.0), "low", 1800), at(grow, 0.4), pan=-0.4, gain=0.35)
# the procession: drums, ching, the crowd, khaen, the stupa's gong
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.35)
add(sfx, babble(today[1] - pay[0], 1.0), pay[0] + 0.2, pan=0.3, gain=0.35)
for t in np.arange(pay[0] + 0.3, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(78, 50, 0.4, 0.9), t, pan=-0.2, gain=0.2)
add(sfx, filt(khaen([57, 64, 69, 72], 3.0, 2000), "low", 2200), pay[0] + 0.4, pan=0.0, gain=0.14)
add(sfx, rise_tone(2.0, 1.0), pay[0] + 0.2, pan=0.0)
add(sfx, gong(74, 3.0, 0.4), at(pay, 0.92), pan=0.0)


# ---------------------------------------------------------------- the gaps between beats
def bridge_gap(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [hero, sink, khmer, lx, leave, arrive, cross, drop, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.3
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU")
mix = master("public/soundtrack_sakonnakhon.wav", music, amb, sfx)
print("wrote public/soundtrack_sakonnakhon.wav", {"hero": round(hero[0], 2), "payoff": round(pay[0], 2)})
