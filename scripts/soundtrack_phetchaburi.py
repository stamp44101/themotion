"""Phetchaburi soundtrack: central-Thai palette (ระนาด, ฆ้องวง, ขลุ่ย, ปี่ and ฉิ่ง) + SFX.

Run:  node scripts/export_timeline.mjs src/cities/phetchaburi/timeline.ts out/timeline_phetchaburi.json
      python3 scripts/soundtrack_phetchaburi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_phetchaburi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_phetchaburi.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
# cues sit on the story's beats (timeline.ts), so a retime of the picture moves the score
B = tl.beat
khmer, siege, palace, railway, banpuen, unesco = (
    B("khmer"), B("siege"), B("palace"), B("railway"), B("banpuen"), B("unesco"))
# the hook (index.ts): the finale's fireworks for 1.4 s, a veil, then the story from 1.7 s
HOOK = 1.7

# ---------------------------------------------------------------- score (D major pentatonic, 112 bpm)
BEAT = 60 / 112
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83]
D, G, A, Bm = [38, 45, 50], [43, 50, 55], [45, 52, 57], [47, 54, 59]

add(music, pad([38, 45, 50], khmer[1] - HOOK + 0.5, 900), HOOK, gain=0.5)
for t0, t1, notes in ((khmer[1], siege[0] - 0.4, D), (siege[0] - 0.4, siege[1], Bm), (siege[1], railway[0] - 0.4, G),
                      (railway[0] - 0.4, banpuen[0] - 0.4, A), (banpuen[0] - 0.4, unesco[0] - 0.4, D), (unesco[0] - 0.4, DUR, [38, 50, 57, 62, 66])):
    add(music, pad(notes, t1 - t0 + 0.6, 1500), t0, gain=0.38)
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        # ฉิ่ง on the beat; ฆ้องวง (low struck bronze) on the root and fifth
        add(music, ching(0.25), t, pan=0.15, gain=0.16 if (t - t0) % (2 * BEAT) < 0.1 else 0.08)
        add(music, ranat(notes[1] + 12, 0.8), t + BEAT / 2, pan=-0.25, gain=0.16)


def ranat_line(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """ระนาดเอก runs over the pentatonic: mostly steps, the odd leap, never a metronome."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        add(music, ranat(PENTA[i], 0.5), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step * rng.choice([1, 1, 2])


def flute(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """ขลุ่ย phrases over the pentatonic."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        d = step * rng.choice([1, 1, 2])
        add(music, khlui(PENTA[i], min(d * 1.1, t1 - t + 0.2)), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += d


flute(HOOK + 1.4, khmer[1], BEAT, 0.2)
ranat_line(palace[0], palace[1], BEAT / 2, 0.24, low=2)
flute(railway[1] - 1.0, banpuen[1], BEAT, 0.2)
ranat_line(unesco[0] - 0.4, DUR - 2.5, BEAT / 2, 0.24, low=3)
# ปี่ and war drums under the siege; the rest of the score ducks under them
for t in np.arange(siege[0], siege[1] - 0.2, BEAT / 2):
    add(sfx, drum(150, 70, 0.35, 0.8), t, pan=rng.uniform(-0.2, 0.2), gain=0.55 if (t - siege[0]) % BEAT < 0.1 else 0.3)
t = siege[0] + 0.4
while t < siege[1] - 0.6:
    d = BEAT * rng.choice([1, 2])
    add(music, pi_reed(PENTA[int(rng.integers(1, 6))], d * 1.05), t, pan=0.1, gain=0.18)
    t += d
music *= (1 - 0.35 * bump(T, siege[0], siege[1], 0.4))[:, None]

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "low", 600) * 0.03, 0, pan=-0.3)
t = HOOK + 0.3
while t < unesco[0]:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (siege[0] - 0.4 < t < siege[1]):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=0.8 if Y[i] < 1900 else 0.3)
    t += rng.exponential(0.5)
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.025
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1600)) * 0.05
add(amb, traffic * np.clip((Y - 1955) / 50, 0, 1) * 0.05, 0)

# ---------------------------------------------------------------- sfx
# the hook: the finale's fireworks, then a whoosh as the veil carries us back
for i in range(6):
    add(sfx, firework_pop(), 0.15 + i * 0.22 + rng.uniform(0, 0.1), pan=rng.uniform(-0.7, 0.7), gain=0.5)
add(sfx, whoosh(1.2, 0.5), HOOK - 0.7, gain=0.6)
add(sfx, gong(88, 5.0, 0.35), HOOK + 0.2)
# ~1191: laterite dressed and set at irregular gaps, carts creaking in from the east
t = khmer[0] + 3.0
while t < khmer[0] + 0.8 * (khmer[1] - khmer[0]):
    n = int(0.06 * SR)
    add(sfx, filt(noise(n), "band", (1200, 3800)) * env_ar(n, 0.003, 0.05) * 0.45, t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.3, 0.65)
for t in np.arange(khmer[0] + 2.4, khmer[0] + 0.7 * (khmer[1] - khmer[0]), 0.7):
    add(sfx, creak(0.4), t + rng.uniform(-0.1, 0.1), pan=rng.uniform(0.2, 0.6), gain=0.35)
# 2124: paddles as the fleet comes up the river, the clash at the gate, the fire
fleet_end = siege[0] + 0.42 * (siege[1] - siege[0])
for t in np.arange(siege[0] + 0.2, fleet_end, 0.5):
    add(sfx, splash(), t + rng.uniform(-0.08, 0.08), pan=rng.uniform(-0.5, 0.1), gain=0.3)
gate_t = siege[0] + 0.5 * (siege[1] - siege[0])
for i in range(5):
    add(sfx, clash(), gate_t + i * 0.33 + rng.uniform(0, 0.12), pan=rng.uniform(0.0, 0.6), gain=0.45)
add(sfx, crowd(siege[1] - gate_t), gate_t, pan=0.3, gain=0.5)
add(sfx, crackle(siege[1] - gate_t - 0.3), gate_t + 0.4, pan=0.2, gain=0.4)
# 1859-62: the palace rising, a gong as it is finished and named
for _ in range(10):
    add(sfx, drum(rng.uniform(300, 460), 200, 0.12, 0.25), rng.uniform(palace[0] + 0.5, palace[0] + 0.8 * (palace[1] - palace[0])), pan=rng.uniform(-0.5, 0.5))
add(sfx, gong(98, 6.0, 0.35), palace[0] + 0.86 * (palace[1] - palace[0]))
# 1903: the first train comes down from the north and pulls in to the terminus
steam = EV["trains"][0]
s0, s1 = steam["t0"] + 0.2, steam["t0"] + steam["dur"]
t = s0
while t < s1:
    p = (t - s0) / (s1 - s0)
    add(sfx, chuff(), t, pan=-0.6 + 1.2 * p, gain=0.9 - 0.4 * p)
    t += 0.2 + 0.18 * p
add(sfx, steam_whistle(), s0 + 0.3, pan=-0.4)
add(sfx, steam_whistle(1.6), s1 - 0.4, pan=0.3, gain=0.7)
# 1910-16: the palace at Ban Puen going up, a royal band in the distance
for _ in range(10):
    add(sfx, drum(rng.uniform(260, 420), 180, 0.14, 0.3), rng.uniform(banpuen[0] + 0.4, banpuen[0] + 0.7 * (banpuen[1] - banpuen[0])), pan=rng.uniform(-0.5, 0.5))
for t in np.arange(banpuen[0] + 0.7 * (banpuen[1] - banpuen[0]), banpuen[1], BEAT):
    add(sfx, drum(110, 60, 0.3, 0.5), t, pan=-0.2, gain=0.35)
# today: the งานพระนครคีรี fair at the foot of the ridge
add(sfx, crowd(unesco[1] - unesco[0]), unesco[0], pan=-0.2, gain=0.35)

# era-change whooshes
for et in (siege[0] - 0.2, palace[0] - 0.2, railway[0] - 0.4, banpuen[0] - 0.2, unesco[0] - 0.2):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.5)

# finale fireworks over the ridge
for i in range(16):
    add(sfx, firework_pop(), DUR - 4.6 + i * 0.28 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.5)

mix = master("public/soundtrack_phetchaburi.wav", music, amb, sfx)
print("wrote public/soundtrack_phetchaburi.wav", {"siege": round(siege[0], 2), "railway": round(railway[0], 2)})
