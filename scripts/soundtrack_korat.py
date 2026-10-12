"""Nakhon Ratchasima (Korat) soundtrack: Isan-flavoured score + ambience + SFX.

Run:  node scripts/export_timeline.mjs src/cities/korat/timeline.ts out/timeline_korat.json
      python3 scripts/soundtrack_korat.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_korat.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()

# ---------------------------------------------------------------- score (A minor pentatonic, 120 bpm)
BEAT = 0.5
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81]
A, G, C = [57, 64, 69], [55, 62, 67], [60, 67, 72]
victory = tl.t_of(1826.9)

KHAEN = [
    (0.0, 3.3, [45, 52, 57], 0.55),
    (8.0, 12.3, A, 0.45),
    (12.0, 17.5, G, 0.45),
    (17.0, 22.9, A, 0.6),
    (22.5, 27.3, C, 0.6),
    (victory, 34.7, A, 0.7),
    (34.3, 40.3, G, 0.6),
    (40.0, 45.3, C, 0.65),
    (45.0, 50.3, A, 0.6),
    (50.0, 53.2, G, 0.6),
    (53.0, 56.3, A, 0.6),
    (56.0, 60.0, [45, 57, 64, 69, 76], 0.8),
]
for t0, t1, notes, g in KHAEN:
    add(music, khaen(notes, t1 - t0), t0, gain=g)
# deep-time and wartime drones
add(music, pad([33, 40, 45], 5.6, 700), 3.0, gain=0.6)
add(music, pad([33, 40, 45, 48], victory - 27.0 + 0.5, 900), 27.0, gain=0.55)

# bass on chord roots
for t0, t1, notes, _ in KHAEN[1:-1]:
    for t in np.arange(t0 + 0.2, t1 - 0.2, BEAT * 2):
        add(music, pluck(notes[0] - 24, 0.9, 0.3), t, gain=0.5)


def phin(t0, t1, step, amp, low=0, high=len(PENTA) - 1, prob=1.0, start=4, dur=1.4):
    i = start
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
            add(music, pluck(PENTA[i], dur, bright=rng.uniform(0.8, 1.3)), t, pan=rng.uniform(-0.5, 0.5), gain=amp)
        t += step


phin(8.4, 16.9, BEAT * 2, 0.3, high=6)
phin(17.2, 26.8, BEAT, 0.32)
phin(victory, 34.4, BEAT / 2, 0.28, prob=0.8, low=3)
phin(34.6, 44.8, BEAT / 2, 0.26, prob=0.7)
phin(45.0, 55.8, BEAT / 2, 0.27, prob=0.8, low=2)
for k, t in enumerate(np.arange(56.1, 59.2, BEAT / 2)):
    add(music, pluck([81, 79, 76, 74, 72, 69, 67, 64][k % 8], 2.2), t, pan=0.4 * np.sin(k), gain=0.3)

# klong drums + ching
for t in np.arange(17.2, 26.8, BEAT * 2):
    add(music, drum(110, 55, 0.6, 0.55), t)
for sec in ((34.6, 39.9), (45.0, 55.8)):
    for t in np.arange(sec[0], sec[1], BEAT):
        add(music, drum(115, 55, 0.5, 0.5 if int(round((t - sec[0]) / BEAT)) % 2 == 0 else 0.3), t)
    for t in np.arange(sec[0] + BEAT / 2, sec[1], BEAT):
        add(music, ching(), t, pan=0.3, gain=0.7)
# war drums: ominous, then the battle at Thung Samrit
for t in np.arange(27.2, 30.4, BEAT * 2):
    add(music, drum(80, 40, 0.9, 0.8), t)
for t in np.arange(30.4, victory, BEAT / 2):
    add(music, drum(rng.uniform(130, 170), 70, 0.35, 0.45), t, pan=rng.uniform(-0.4, 0.4))

for t, f, g in ((0.15, 70, 1.0), (tl.t_of(1100), 96, 0.6), (tl.t_of(1657), 88, 1.1), (victory, 82, 1.1), (tl.t_of(1934), 92, 0.9), (56.0, 70, 1.2)):
    add(music, gong(f, 7, g), t)
for k in range(6):  # walls finished: khong flourish
    add(music, bell(mtof([81, 79, 76, 74, 72, 69][k]), 2.2, (1, 2.01, 3.92, 5.2), 1.4), tl.t_of(1663) + k * 0.12, gain=0.22)

# ---------------------------------------------------------------- ambience
river = filt(pink(N), "low", 1100) * 0.6
add(amb, river * 0.05 * (1 - 0.4 * np.clip((Y - 1950) / 70, 0, 1)), 0, pan=-0.3)
add(amb, filt(noise(N), "band", (180, 800)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * T)) * 0.035, 0, pan=0.3)

t = 0.3
while t < 55.5:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (27.0 < t < victory):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1900 else 0.35)
    t += rng.exponential(0.34)
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03 * (1 - 0.5 * np.clip((Y - 1960) / 50, 0, 1))
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)

traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1600)) * 0.05
add(amb, traffic * np.clip((Y - 1955) / 50, 0, 1) * (1 - 0.5 * bump(T, 56, 61, 1.5)) * 0.06, 0)

# ---------------------------------------------------------------- sfx
# dinosaurs: heavy footsteps and roars
for t in np.arange(3.2, 8.0, 0.85):
    add(sfx, footstep(0.7), t + rng.uniform(-0.1, 0.1), pan=rng.uniform(-0.6, 0.6))
for t, f in zip(EV["dinoRoars"], (95, 130, 80)):
    add(sfx, roar(1.9, f), t, pan=rng.uniform(-0.5, 0.5), gain=1.2)

# building the walls: digging + wooden knocks
for _ in range(60):
    t0 = rng.uniform(tl.t_of(1656.6), tl.t_of(1663))
    if rng.random() < 0.5:
        n = int(0.18 * SR)
        add(sfx, filt(noise(n), "band", (700, 2600)) * np.sin(np.pi * np.arange(n) / n) * 0.08, t0, pan=rng.uniform(-0.6, 0.6))
    else:
        add(sfx, drum(rng.uniform(300, 520), 220, 0.12, 0.25), t0, pan=rng.uniform(-0.6, 0.6))

# 1826: the city burns, then the battle at Thung Samrit
w0, w1 = tl.t_of(1826.0), tl.t_of(1826.8)
add(sfx, crackle(w1 - w0 + 1.0) * env_ar(int((w1 - w0 + 1.0) * SR), 0.4, 0.8), w0, gain=0.9)
add(sfx, crowd(victory - 30.0 + 0.6), 30.0, gain=0.8)
for _ in range(26):
    add(sfx, clash(), rng.uniform(30.8, victory), pan=rng.uniform(-0.7, 0.7))

# 1900: the first train arrives
steam = next(tr for tr in EV["trains"] if not tr["modern"])
modern = next(tr for tr in EV["trains"] if tr["modern"])
s0, s1 = steam["t0"] + 0.3, steam["t0"] + steam["dur"] - 0.2
t = s0
while t < s1:
    p = (t - s0) / (s1 - s0)
    add(sfx, chuff(), t, pan=-0.9 + 1.8 * p, gain=np.sin(np.pi * p) ** 0.5)
    t += 0.24 - 0.06 * p
add(sfx, steam_whistle(), s0 + 0.4, pan=-0.6)

# jets over Korat air base, later an airliner
j0, j1 = EV["jets"]
p0, p1 = EV["plane"]
add(sfx, pan_sweep(jet(j1 - j0 + 0.4), -0.9, 0.9), j0 - 0.2, gain=1.4)
add(sfx, pan_sweep(jet(p1 - p0) * 0.4, 0.9, -0.9), p0)
# modern train
mn = int(modern["dur"] * SR)
mt = np.arange(mn) / SR
add(sfx, pan_sweep(filt(np.sign(np.sin(2 * np.pi * 78 * mt)), "low", 400) * np.sin(np.pi * mt / modern["dur"]) * 0.05, 0.9, -0.9), modern["t0"])

# era-change whooshes + opening boom
for et in (3.0, 8.2, 12.0, 17.2, 27.0, 34.5, 45.0, 56.0):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.55)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.6)

# finale fireworks
for i in range(16):
    add(sfx, firework_pop(), 55.4 + i * 0.28 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.5)

# duck the music under the battle crowd a little
music *= (1 - 0.3 * bump(T, 30.0, victory, 0.4))[:, None]

mix = master("public/soundtrack_korat.wav", music, amb, sfx)
print("wrote public/soundtrack_korat.wav", {"founding": round(tl.t_of(1657), 2), "victory": round(victory, 2), "railway": round(tl.t_of(1900), 2), "monument": round(tl.t_of(1934), 2)})
