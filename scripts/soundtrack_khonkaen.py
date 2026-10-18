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
# SOUND_V2=1 renders the docs/sound.md phase-1-3 sample to out/ (A/B); the default is the posted mix
V2 = os.environ.get("SOUND_V2") == "1"


def fx(sig, t0, pan=0.0, gain=1.0, dist=0.35, size="outdoor"):
    """An on-screen sound: v1 mixes it dry and panned; v2 places it at a distance in a room."""
    if V2:
        add(sfx, place(sig * gain, dist, pan, size), t0)
    else:
        add(sfx, sig, t0, pan=pan, gain=gain)
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
        if V2:
            # v2 swaps the roles (owner: the พิณ was acting as the beat and the โปงลาง as the
            # tune): struck wood keeps the pulse, the พิณ gets the melody below
            add(music, ranat(notes[1] + 24, 0.45), t, pan=-0.15, gain=0.2)
            add(music, ranat(notes[2] + 24, 0.35), t + BEAT / 2, pan=0.15, gain=0.12)
        else:
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


PHIN_KS = os.environ.get("SOUND_PHIN") == "ks"


def phin_line(t0, t1, amp, low=0, high=len(PENTA) - 1, seed=0):
    """พิณ melody, หมอลำ-style: a two-bar riff of eighths (with rests) repeated, its tail varied
    every third time round, instead of a random walk."""
    r = np.random.default_rng(seed)
    i = r.integers(low + 2, min(high, low + 6))
    riff = []
    for k in range(16):
        if r.random() < 0.22 and k % 4:
            riff.append(None)
        else:
            i = int(np.clip(i + r.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
            riff.append(PENTA[i])
    t, rep_n = t0, 0
    while t < t1:
        line = list(riff)
        if rep_n % 3 == 2:
            for k in (13, 14, 15):
                line[k] = PENTA[int(np.clip(r.integers(low, high + 1), low, high))]
        for m in line:
            if t >= t1:
                break
            if m is not None:
                note = phin(m, 0.6, seed=int(t * 100)) if PHIN_KS else pluck(m, 0.55, 0.8)
                add(music, note, t, pan=-0.1, gain=amp)
            t += BEAT / 2
        rep_n += 1


if V2:
    phin_line(founding[0], founding[1], 0.34 if PHIN_KS else 0.28, seed=3)
    phin_line(stupa[0], stupa[1], 0.36 if PHIN_KS else 0.3, low=2, seed=5)
    phin_line(modern[0], DUR - 2.5, 0.34 if PHIN_KS else 0.28, low=3, seed=7)
else:
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
if V2:
    fx(giant_steps(dinos[1] - dinos[0] - 3.2), dinos[0] + 3.4, pan=-0.3, gain=0.9, dist=0.4)
else:
    for t in np.arange(dinos[0] + 3.4, dinos[1], 0.9):
        fx(drum(60, 30, 0.6, 0.9), t, pan=-0.3, gain=0.5)
fx(roar(2.0, 70.0), dinos[0] + 4.8, pan=-0.3, gain=0.5)
# Recorded/generated SFX (public/sfx/, ElevenLabs) replace the synthesized one for a beat when
# the file is there; without it the script falls back to the synth, so it always runs.
S = {k: sample(k) for k in ("sauropod_steps", "ox_carts", "steam_train", "convoy_trucks", "dig_sandstone", "train_viaduct", "fireworks_city")}
print("sfx samples:", {k: v is not None for k, v in S.items()})
if S["sauropod_steps"] is not None:
    fx(S["sauropod_steps"], 3.6, gain=0.55)

# 1797: ox carts creaking up to Bueng Bon, then building
if S["ox_carts"] is not None:
    fx(S["ox_carts"], founding[0] + 0.3, gain=0.55)
elif V2:
    fx(ox_carts(0.75 * (founding[1] - founding[0])), founding[0] + 0.3, pan=0.3, gain=0.8, dist=0.35)
else:
    for t in np.arange(founding[0] + 0.3, founding[0] + 0.7 * (founding[1] - founding[0]), 0.55):
        fx(creak(0.4), t, pan=rng.uniform(0.1, 0.6), gain=0.4)
for _ in range(14):
    fx(drum(rng.uniform(300, 480), 200, 0.12, 0.25), rng.uniform(founding[0] + 4, founding[1]), pan=rng.uniform(-0.5, 0.5))
# 1933: the first train arrives from the south
steam = EV["trains"][0]
s0, s1 = steam["t0"] + 0.2, steam["t0"] + steam["dur"]
if S["steam_train"] is not None:
    fx(S["steam_train"], s0, gain=0.5)
else:
    if V2:
        fx(steam_train(s1 - s0 + 1.2, stop_at=0.78), s0, pan=-0.2, gain=0.9, dist=0.35)
    t = s0
    while t < s1 and not V2:
        p = (t - s0) / (s1 - s0)
        fx(chuff(), t, pan=-0.6 + 1.2 * p, gain=0.9 - 0.3 * p)
        t += 0.2 + 0.12 * p
    if not V2:
        fx(steam_whistle(), s0 + 0.3, pan=-0.4)
# 1956-57: the convoy on the new highway
if S["convoy_trucks"] is not None:
    fx(S["convoy_trucks"], mitt[0], gain=0.6)
elif V2:
    fx(convoy(mitt[1] - mitt[0]), mitt[0], pan=-0.1, gain=0.8, dist=0.4)
else:
    fx(filt(noise(int((mitt[1] - mitt[0]) * SR)), "low", 160) * env_ar(int((mitt[1] - mitt[0]) * SR), 0.8, 1.0) * 0.4, mitt[0])
# 1976: picks and trowels in the sandstone at irregular gaps, then a low bell as the animal
# appears over the trench
if S["dig_sandstone"] is not None:
    fx(S["dig_sandstone"], dig[0] + 0.3, gain=0.55)
elif V2:
    fx(fossil_dig(0.55 * (dig[1] - dig[0])), dig[0] + 0.4, pan=0.1, gain=0.85, dist=0.3)
else:
    t = dig[0] + 0.5
    while t < dig[0] + 0.5 * (dig[1] - dig[0]):
        n = int(0.06 * SR)
        fx(filt(noise(n), "band", (1500, 4500)) * env_ar(n, 0.003, 0.05) * 0.5, t, pan=rng.uniform(-0.4, 0.4))
        t += rng.uniform(0.28, 0.6)
fx(bell(196, 4.0), dig[0] + 0.55 * (dig[1] - dig[0]), gain=0.45, dist=0.5, size="open")
# 2019: the train on the viaduct, a long low hum rising as it comes in, and a horn
if S["train_viaduct"] is not None:
    fx(S["train_viaduct"], modern[0] + 0.3, gain=0.65)
elif V2:
    fx(diesel_train(0.85 * (modern[1] - modern[0])), modern[0] + 0.2, pan=0.15, gain=0.75, dist=0.4)
else:
    n = int((modern[1] - modern[0]) * 0.75 * SR)
    fx(filt(noise(n), "low", 220) * env_ar(n, 2.0, 1.2) * 0.35, modern[0] + 0.2, pan=0.2)
    fx(filt(pi_reed(57, 1.0), "low", 1400) * 0.4, modern[0] + 0.5 * (modern[1] - modern[0]), pan=0.1, gain=0.5)
# 1996: the stupa's tiers going up, then a temple bell
for i in range(10):
    fx(drum(220 + i * 18, 140, 0.25, 0.5), stupa[0] + i * 0.55 * (stupa[1] - stupa[0]) / 10, pan=0.1, gain=0.45)
fx(bell(392, 3.0), stupa[0] + 0.58 * (stupa[1] - stupa[0]), gain=0.5, dist=0.3, size="open")

for et in (3.0, founding[0] - 0.2, railway[0] - 0.2, mitt[0] - 0.2, dig[0] - 0.2, stupa[0] - 0.2, modern[0] - 0.2):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.5)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.6)
if S["fireworks_city"] is not None:
    fx(S["fireworks_city"], DUR - 4.6, gain=0.6)
elif V2:
    fx(fireworks(4.4), DUR - 4.6, gain=0.9, dist=0.7)
else:
    for i in range(16):
        fx(firework_pop(), DUR - 4.4 + i * 0.28 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.5, dist=0.75)

if V2:
    mix = master2("out/soundtrack_khonkaen_v2.wav", music, amb, sfx)
else:
    mix = master("public/soundtrack_khonkaen.wav", music, amb, sfx)
print("wrote", "out/soundtrack_khonkaen_v2.wav" if V2 else "public/soundtrack_khonkaen.wav", {"railway": round(railway[0], 2), "stupa": round(stupa[0], 2)})
