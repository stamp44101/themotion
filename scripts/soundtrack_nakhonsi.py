"""Nakhon Si Thammarat soundtrack: southern (nora / manohra) palette + Gulf ambience + SFX.

Run:  node scripts/export_timeline.mjs src/cities/nakhonsi/timeline.ts out/timeline_nakhonsi.json
      python3 scripts/soundtrack_nakhonsi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_nakhonsi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_nakhonsi.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
# cue times below are written on the original 60 s grid; W() maps them onto the 75 s clip
# with the same table the captions and camera use (timeline.ts WARP)
_wa, _wb = zip(*EV["warp"])


def W(t):
    return float(np.interp(t, _wa, _wb))


# ---------------------------------------------------------------- score (D minor pentatonic, 132 bpm)
BEAT = 60 / 132
PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81, 84]
D, C, F = [50, 57, 62], [48, 55, 60], [53, 60, 65]

# temple drone: the chedi's bell-like opening, then pads under each era
add(music, pad([38, 45, 50], W(8.0), 700), 0.0, gain=0.55)
for t0, t1, notes in ((8.0, 14.5, D), (14.5, 21.4, F), (21.4, 26.6, C), (26.6, 34.6, [38, 45, 48]),
                      (34.6, 44.2, D), (44.2, 48.4, [38, 41, 45]), (48.4, 60.0, [38, 50, 57, 62, 69])):
    t0, t1 = W(t0), W(t1)
    add(music, pad(notes, t1 - t0 + 0.6, 1500), t0, gain=0.4)
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT * 2):
        add(music, pluck(notes[0] - 12, 0.8, 0.35), t, gain=0.45)


def pi(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """ปี่ melody: legato reed phrases over the pentatonic."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        d = step * rng.choice([1, 1, 2])
        add(music, pi_reed(PENTA[i], min(d * 1.1, t1 - t + 0.2)), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += d


pi(W(8.4), W(14.2), BEAT * 2, 0.22, high=6)
pi(W(14.6), W(21.2), BEAT, 0.24)
pi(W(21.6), W(26.4), BEAT, 0.22, low=2)
pi(W(36.4), W(43.8), BEAT, 0.2)
pi(W(49.2), W(58.5), BEAT, 0.26, low=3)

# nora drums (thap + klong) and ching: quick, syncopated, from the Srivijaya era on
def nora(t0, t1, gain):
    k = 0
    for t in np.arange(t0, t1, BEAT / 2):
        pat = (1.0, 0.0, 0.45, 0.6, 0.0, 0.45, 0.8, 0.3)[k % 8]
        if pat:
            add(music, drum(rng.uniform(170, 210), 90, 0.25, pat * gain), t, pan=0.2)
        if k % 4 == 0:
            add(music, drum(95, 48, 0.6, 0.6 * gain), t, pan=-0.2)
        if k % 2 == 1:
            add(music, ching(), t, pan=0.35, gain=0.55 * gain)
        k += 1


nora(W(14.6), W(21.2), 0.8)
nora(W(21.6), W(26.4), 0.9)
nora(W(36.4), W(43.8), 0.85)
nora(W(49.2), W(58.6), 1.0)
# 1767-69: slow war drums under ชุมนุมเจ้านคร, then fast ones as Taksin's army arrives
for t in np.arange(W(26.6), W(29.8), BEAT * 2):
    add(music, drum(80, 40, 0.9, 0.7), t)
for t in np.arange(W(29.8), W(34.4), BEAT / 2):
    add(music, drum(rng.uniform(120, 160), 65, 0.35, 0.45), t, pan=rng.uniform(-0.4, 0.4))

# gongs on the big beats, temple bells for the chedi
for t, f, g in ((0.15, 70, 1.0), (tl.t_of(1215), 88, 0.9), (tl.t_of(1688), 92, 0.9), (tl.t_of(1914.2), 82, 0.7), (tl.t_of(1769.27), 76, 1.1), (W(54.0), 70, 1.2)):
    add(music, gong(f, 7, g), t)
for t in map(W, (4.2, 6.0, 15.6, 18.6, 49.6, 51.0, 52.4, 53.4)):
    add(sfx, bell(mtof(81), 3.0, (1, 2.0, 2.76, 4.07, 5.4), 1.6), t, pan=rng.uniform(-0.3, 0.3), gain=0.18)
for k in range(8):  # final flourish
    add(music, bell(mtof([86, 84, 81, 79, 77, 74, 72, 69][k]), 2.2, (1, 2.01, 3.92, 5.2), 1.4), W(56.0) + k * 0.14, gain=0.2)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
# the Gulf: quiet bed plus irregular waves, never an even loop
add(amb, filt(pink(N), "low", 700) * 0.035, 0, pan=0.5)
t = 0.4
while t < W(58):
    n = int(rng.uniform(1.6, 2.8) * SR)
    w = filt(noise(n), "band", (250, 2200)) * np.sin(np.pi * np.arange(n) / n) ** 2
    add(amb, w * rng.uniform(0.03, 0.06), t, pan=rng.uniform(0.3, 0.9))
    t += rng.uniform(2.5, 6.0)

t = 0.3
while t < W(55.5):
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (W(26.6) < t < W(34.6)) and not (W(44.0) < t < W(48.2)):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=0.9 if Y[i] < 1900 else 0.3)
    t += rng.exponential(0.4)
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.025
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1600)) * 0.05
add(amb, traffic * np.clip((Y - 1950) / 50, 0, 1) * (1 - 0.5 * bump(T, W(56), W(60) + 1, 1.5)) * 0.05, 0)

# ---------------------------------------------------------------- sfx
# Narai's walls: brick laying knocks
for _ in range(40):
    add(sfx, drum(rng.uniform(320, 520), 220, 0.12, 0.22), rng.uniform(tl.t_of(1685), tl.t_of(1689.5)), pan=rng.uniform(-0.6, 0.6))
# the legend's boat: hull creaks and lapping water as it comes ashore
for t in (0.4, 1.3, 2.1, 2.8):
    add(sfx, creak(0.5), t, pan=0.3, gain=0.6)
add(sfx, splash(), 2.9, pan=0.2, gain=0.7)
# junks in the Gulf: timber and sail
for t in map(W, (9.8, 11.0, 12.4)):
    add(sfx, creak(0.6), t, pan=rng.uniform(0.2, 0.7), gain=0.5)
# 1769: Taksin's army marches in, the siege at the north gate
# (cued by year: march 1769.00-.12, clash at the gate .12-.24, the town falls .24-.28)
m0, c0, c1 = tl.t_of(1769.0), tl.t_of(1769.12), tl.t_of(1769.26)
for t in np.arange(m0 + 0.2, c0, 0.42):
    add(sfx, footstep(0.5), t + rng.uniform(-0.05, 0.05), pan=rng.uniform(-0.5, 0.5))
add(sfx, crowd(c1 - c0 + 0.6), c0 - 0.2, gain=0.6)
for _ in range(16):
    add(sfx, clash(), rng.uniform(c0, c1), pan=rng.uniform(-0.7, 0.7))
# แห่ผ้าขึ้นธาตุ: the crowd murmur and temple bells under the procession
add(sfx, crowd(W(53.0) - W(49.4)) * 0.5, W(49.4), gain=0.5)

# 1914: the first train pulls in to the terminus (slowing)
steam = EV["trains"][0]
s0, s1 = steam["t0"] + 0.2, steam["t0"] + steam["dur"]
t = s0
while t < s1:
    p = (t - s0) / (s1 - s0)
    add(sfx, chuff(), t, pan=0.6 - 1.2 * p, gain=0.9 - 0.4 * p)
    t += 0.2 + 0.18 * p
add(sfx, steam_whistle(), s0 + 0.3, pan=0.4)
add(sfx, steam_whistle(1.6), s1 - 0.4, pan=-0.3, gain=0.7)

# 1988: rain and the mudslide's rumble
r0, r1 = W(44.0), W(48.2)
rain = filt(noise(int((r1 - r0) * SR)), "band", (1200, 7000)) * env_ar(int((r1 - r0) * SR), 0.6, 0.8) * 0.09
add(sfx, rain, r0)
add(sfx, filt(noise(int(2.4 * SR)), "low", 120) * env_ar(int(2.4 * SR), 0.5, 1.4) * 0.5, W(45.0))
music *= (1 - 0.45 * bump(T, W(44.3), W(48.2), 0.5))[:, None]

# era-change whooshes + opening boom
for et in map(W, (3.0, 9.0, 14.5, 21.4, 26.6, 36.4, 49.2)):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.5)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.6)

# finale fireworks
for i in range(16):
    add(sfx, firework_pop(), W(55.4) + i * 0.28 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.5)

mix = master("public/soundtrack_nakhonsi.wav", music, amb, sfx)
print("wrote public/soundtrack_nakhonsi.wav", {"lanka": round(tl.t_of(1215), 2), "walls": round(tl.t_of(1688), 2), "siege": round(tl.t_of(1769.27), 2), "railway": round(tl.t_of(1914.2), 2)})
