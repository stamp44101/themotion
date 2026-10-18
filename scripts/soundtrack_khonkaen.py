"""Khon Kaen soundtrack: Isan palette (khaen drone, phin plucks, pong lang) + SFX.

Run:  node scripts/export_timeline.mjs src/cities/khonkaen/timeline.ts out/timeline_khonkaen.json
      python3 scripts/soundtrack_khonkaen.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_khonkaen.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_khonkaen.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
dinos, founding, railway, mitt, dig, stupa, modern = (
    B("dinos"), B("founding"), B("railway"), B("mittraphap"), B("discovery"), B("stupa"), B("doubletrack"))

# ---------------------------------------------------------------- score (A minor pentatonic, 126 bpm)
BEAT = 60 / 126
PENTA = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91]
Am, G, C, Em = [45, 52, 57], [43, 50, 55], [48, 55, 60], [40, 47, 52]

add(music, pad([33, 40, 45], dinos[1] + 0.6, 700), 0.0, gain=0.6)
for t0, t1, notes in ((dinos[1], railway[0] - 0.4, Am), (railway[0] - 0.4, dig[0] - 0.4, C),
                      (dig[0] - 0.4, stupa[0] - 0.4, G), (stupa[0] - 0.4, modern[0] - 0.4, Am), (modern[0] - 0.4, DUR, [45, 57, 64, 69, 76])):
    # แคน: a reedy drone on the chord under each era
    add(music, khaen(notes, t1 - t0 + 0.6), t0, gain=0.32)
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        # พิณ: a bright pluck on the beat, the fifth on the off-beat
        add(music, pluck(notes[1] + 12, 0.6, 0.7), t, pan=-0.2, gain=0.3)
        add(music, pluck(notes[2] + 12, 0.45, 0.6), t + BEAT / 2, pan=0.2, gain=0.18)


def ponglang(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """โปงลาง phrases (struck wood) over the pentatonic."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        add(music, ranat(PENTA[i], 0.6), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step * rng.choice([1, 1, 2])


ponglang(founding[0], founding[1], BEAT / 2, 0.26)
ponglang(stupa[0], stupa[1], BEAT / 2, 0.28, low=2)
ponglang(modern[0], DUR - 2.5, BEAT / 2, 0.26, low=3)

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "low", 600) * 0.03, 0, pan=-0.3)
t = 0.3
while t < modern[0]:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=0.8 if Y[i] < 1950 else 0.3)
    t += rng.exponential(0.5)
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.025
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1600)) * 0.05
add(amb, traffic * np.clip((Y - 1957) / 45, 0, 1) * 0.05, 0)

# ---------------------------------------------------------------- sfx
# the sauropods below Phu Wiang: footfalls and a low call
for t in np.arange(dinos[0] + 3.4, dinos[1], 0.9):
    add(sfx, drum(60, 30, 0.6, 0.9), t, pan=-0.3, gain=0.5)
add(sfx, roar(2.0, 70.0), dinos[0] + 4.8, pan=-0.3, gain=0.5)
# 1797: ox carts creaking up to Bueng Bon, then building
for t in np.arange(founding[0] + 0.3, founding[0] + 0.7 * (founding[1] - founding[0]), 0.55):
    add(sfx, creak(0.4), t, pan=rng.uniform(0.1, 0.6), gain=0.4)
for _ in range(14):
    add(sfx, drum(rng.uniform(300, 480), 200, 0.12, 0.25), rng.uniform(founding[0] + 4, founding[1]), pan=rng.uniform(-0.5, 0.5))
# 1933: the first train arrives from the south
steam = EV["trains"][0]
s0, s1 = steam["t0"] + 0.2, steam["t0"] + steam["dur"]
t = s0
while t < s1:
    p = (t - s0) / (s1 - s0)
    add(sfx, chuff(), t, pan=-0.6 + 1.2 * p, gain=0.9 - 0.3 * p)
    t += 0.2 + 0.12 * p
add(sfx, steam_whistle(), s0 + 0.3, pan=-0.4)
# 1956-57: the convoy on the new highway
add(sfx, filt(noise(int((mitt[1] - mitt[0]) * SR)), "low", 160) * env_ar(int((mitt[1] - mitt[0]) * SR), 0.8, 1.0) * 0.4, mitt[0])
# 1976: picks and trowels in the sandstone at irregular gaps, then a low bell as the animal
# appears over the trench
t = dig[0] + 0.5
while t < dig[0] + 0.5 * (dig[1] - dig[0]):
    n = int(0.06 * SR)
    add(sfx, filt(noise(n), "band", (1500, 4500)) * env_ar(n, 0.003, 0.05) * 0.5, t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.28, 0.6)
add(sfx, bell(196, 4.0), dig[0] + 0.55 * (dig[1] - dig[0]), gain=0.45)
# 2019: the train on the viaduct, a long low hum rising as it comes in, and a horn
n = int((modern[1] - modern[0]) * 0.75 * SR)
add(sfx, filt(noise(n), "low", 220) * env_ar(n, 2.0, 1.2) * 0.35, modern[0] + 0.2, pan=0.2)
add(sfx, filt(pi_reed(57, 1.0), "low", 1400) * 0.4, modern[0] + 0.5 * (modern[1] - modern[0]), pan=0.1, gain=0.5)
# 1996: the stupa's tiers going up, then a temple bell
for i in range(10):
    add(sfx, drum(220 + i * 18, 140, 0.25, 0.5), stupa[0] + i * 0.8 * (stupa[1] - stupa[0]) / 10, pan=0.1, gain=0.45)
add(sfx, bell(392, 3.0), stupa[0] + 0.82 * (stupa[1] - stupa[0]), gain=0.5)

for et in (3.0, founding[0] - 0.2, railway[0] - 0.2, mitt[0] - 0.2, dig[0] - 0.2, stupa[0] - 0.2, modern[0] - 0.2):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.5)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.6)
for i in range(16):
    add(sfx, firework_pop(), modern[1] - 0.4 + i * 0.28 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.5)

mix = master("public/soundtrack_khonkaen.wav", music, amb, sfx)
print("wrote public/soundtrack_khonkaen.wav", {"railway": round(railway[0], 2), "stupa": round(stupa[0], 2)})
