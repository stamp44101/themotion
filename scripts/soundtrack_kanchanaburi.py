"""Kanchanaburi soundtrack: a central-Thai palette (the ranat's soft mallets, the khlui, the slow pi, the
thap under the fight and the festival, gongs), under a small sound for everything that moves or appears: the
steam train's chuff and whistle over the cover, the Burmese column's drum and the elephants at Lat Ya, the
rafts' paddles and the wall going up, the bridge's hammers and the work train, the raids and the spans
falling into the river, one quiet bell at Don Rak, the mended line's first train, the town and the traffic in
the grow shot, and the bridge week's drums, crowd, fireworks and the train again. All code; kept under
~2.4 kHz (the owner dislikes sharp highs). The quiet at Don Rak is a held pad with nothing else.

Run:  node scripts/export_timeline.mjs src/cities/kanchanaburi/timeline.ts out/timeline_kanchanaburi.json
      python3 scripts/soundtrack_kanchanaburi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_kanchanaburi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_kanchanaburi.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, fight, move, brg, brk, rest, mend, grow, pay, today = (
    B("hero"), B("fight"), B("move"), B("bridge"), B("break"), B("rest"), B("mend"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.35  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below

# ---------------------------------------------------------------- score (A minor pentatonic, 88 bpm)
BEAT = 60 / 88
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, F, G, C, Dm, Em = [45, 52, 57], [41, 48, 53], [43, 50, 55], [48, 55, 60], [50, 57, 62], [40, 47, 52]

sections = (
    (0.0, fight[0], [45, 52, 57, 64], 1.0),
    (fight[0], move[0], Dm, 0.9),
    (move[0], brg[0], F, 0.9),
    (brg[0], brk[0], C, 0.95),
    (brk[0], rest[0], Em, 0.8),
    (rest[0], mend[0], [45, 52, 57], 0.6),  # Don Rak: a held, soft pad, nothing else
    (mend[0], grow[0], G, 0.9),
    (grow[0], pay[0], F, 0.9),
    (pay[0], DUR, [45, 52, 57, 60, 64], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.22 * lvl)


def ranat_run(t0, t1, amp, step=BEAT / 2, prob=0.85):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.6), "low", 2400), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def pi_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.3:
        i = int(np.clip(i + rng.choice([-2, -1, 1, 1, 2]), 0, len(PENTA) - 1))
        d = BEAT * rng.choice([1, 1, 2, 2, 3])
        add(music, filt(pi_reed(PENTA[i] - 12, min(d, t1 - t), vib=5.0), "low", 2200), t, pan=0.15, gain=amp)
        t += d


def thap(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0.6, 0, 0.5, 0.8, 0.4]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(150, 175), 90, 0.12, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 4 == 0:
            add(music, drum(70, 45, 0.5, 0.9), t, pan=0.1, gain=gain * 0.8)
        t += BEAT / 2
        k += 1


ranat_run(2.4, hero[1], 0.12, prob=0.55)
thap(fight[0], fight[1], 0.14)
pi_line(fight[0] + 0.4, fight[1], 0.13)
ranat_run(move[0], move[1], 0.11, prob=0.7)
ranat_run(brg[0], brg[1], 0.11, prob=0.6)
add(music, filt(khlui(69, 3.0), "low", 2200), rest[0] + 0.2, pan=0.2, gain=0.14)  # the one note at Don Rak
ranat_run(mend[0], mend[1], 0.12, prob=0.6)
ranat_run(grow[0], grow[1], 0.12, prob=0.7)
add(music, filt(khlui(69, 3.2), "low", 2200), pay[0] + 0.4, pan=0.2, gain=0.16)
pi_line(pay[0] + 0.8, DUR - 3.0, 0.13)
thap(pay[0] + 0.3, DUR - 3.0, 0.14)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.8)
add(amb, filt(pink(N), "band", (120, 600)) * 0.2, 0)  # the rivers, all through
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


def clang(gain=1.0):
    """steel on steel, rounded: a bridge girder struck"""
    return filt(bell(rng.uniform(420, 700), 0.7, ratios=(1, 1.5, 2.3, 3.3), decay=5), "low", 2200) * 0.5 * gain


def boom(gain=1.0, dur=1.4):
    """a bomb or a cannon: a deep thump, a rumble, a short crack"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 3.5) + 28) / SR) * np.exp(-t * 3.0)
    rumble = filt(pink(n), "low", 380) * np.exp(-t * 2.0) * 0.8
    crack = filt(noise(n), "band", (300, 1800)) * np.exp(-t * 40) * 0.3
    return (thump * 0.9 + rumble + crack) * 0.5 * gain


def paddle(gain=1.0):
    return splash() * 0.35 * gain


def horn(gain=1.0, dur=1.4, f=110):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * f * t
    x = np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.3 * np.sin(3 * ph)
    return filt(x, "low", 900) * env_ar(n, 0.08, 0.4) * 0.14 * gain


def rise_tone(dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (45, 52, 57, 60, 64):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def chuffs(t0, t1, gap=0.2, gain=1.0, pan=0.3):
    t = t0
    while t < t1:
        add(sfx, filt(chuff(), "low", 1800), t, pan=pan, gain=gain)
        t += gap


# the cover: the train is already moving at frame 0: its chuffs, the whistle, the girders' rumble
chuffs(0.0, 5.6, 0.2, 1.0, 0.0)
add(sfx, filt(steam_whistle(1.4), "low", 2000), 0.15, pan=0.1, gain=0.8)
add(sfx, filt(steam_whistle(1.0), "low", 2000), 3.4, pan=-0.1, gain=0.6)
n = int(5 * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 0.4, 1.4) * 0.3, 0.0, pan=0.0)
# 2328: the column's drum, the elephants, the cannon
for k in range(3):
    add(sfx, filt(trumpet_elephant(1.0), "low", 2000), at(fight, 0.1 + 0.28 * k), pan=rng.uniform(-0.5, 0.5), gain=0.5)
for t in np.arange(fight[0] - 1.0, fight[1] - 0.2, BEAT):
    add(sfx, drum(95, 60, 0.3, 0.8), t, pan=-0.2, gain=0.22)
for k in range(4):
    add(sfx, boom(0.7, 1.0), at(fight, 0.25 + 0.2 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, crackle(fight[1] - at(fight, 0.3)), at(fight, 0.3), pan=0.2, gain=0.3)
add(sfx, babble(fight[1] - fight[0], 0.8), fight[0], pan=0.0, gain=0.25)
# 2374: the rafts' paddles, the wall going up, the town's babble
t = move[0] + 0.1
while t < at(move, 0.65):
    add(sfx, paddle(1.0), t, pan=rng.uniform(-0.5, 0.3), gain=0.8)
    t += rng.uniform(0.3, 0.45)
add(sfx, babble(move[1] - move[0] - 0.4, 0.8), move[0] + 0.2, pan=-0.1, gain=0.3)
for k in range(16):
    add(sfx, blip(rng.uniform(240, 380), 0.6), at(move, 0.45 + k * 0.03), pan=rng.uniform(-0.5, 0.5))
add(sfx, gong(70, 2.4, 0.3), at(move, 0.82), pan=0.2)
# 2486: the bridge goes up pier by pier: hammers, steel, the work train
t = brg[0] + 0.2
while t < brg[1] - 0.3:
    add(sfx, mallet(0.7), t, pan=rng.uniform(-0.6, 0.6))
    if rng.random() < 0.4:
        add(sfx, clang(0.5), t + 0.05, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.18, 0.3)
for k in range(11):
    add(sfx, blip(rng.uniform(200, 300), 0.7), at(brg, 0.1 + k * 0.07), pan=rng.uniform(-0.5, 0.5))
chuffs(at(brg, 0.1), at(brg, 0.72), 0.24, 0.8, 0.3)
add(sfx, filt(steam_whistle(1.2), "low", 2000), at(brg, 0.55), pan=0.3, gain=0.6)
add(sfx, gong(66, 3.0, 0.35), at(brg, 0.92), pan=0.0)
# 2488: the raids: a plane's drone, the bombs, the spans falling into the river, the splash
n = int((brk[1] - brk[0]) * SR)
t_ = np.arange(n) / SR
drone = filt(np.sin(2 * np.pi * 95 * t_) + 0.5 * np.sin(2 * np.pi * 190 * t_ * (1 + 0.01 * np.sin(t_))), "low", 700)
add(sfx, drone * env_ar(n, 0.3, 0.8) * 0.12, brk[0], pan=0.4)
for k, p in enumerate((0.28, 0.45, 0.62)):
    add(sfx, boom(1.0, 1.4), at(brk, p), pan=rng.uniform(-0.3, 0.3))
add(sfx, splash() * 1.1, at(brk, 0.7), pan=0.0, gain=1.0)
add(sfx, clang(0.9), at(brk, 0.72), pan=0.1)
# Don Rak: nothing but the held pad, the single note and one bell (the brief's rule: no sting)
add(sfx, filt(bell(392, 3.0, decay=1.8), "low", 2200), rest[0] + 0.35, pan=0.0, gain=0.14)
# the mended line: the first train over it, the rails' rumble
for k in range(6):
    add(sfx, blip(rng.uniform(260, 400), 0.5), at(mend, 0.05 + k * 0.06), pan=rng.uniform(-0.4, 0.4))
chuffs(mend[0] + 0.3, mend[0] + 4.0, 0.2, 0.9, 0.3)
add(sfx, filt(steam_whistle(1.4), "low", 2000), mend[0] + 0.5, pan=0.3, gain=0.8)
n = int(1.6 * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 0.3, 0.6) * 0.35, mend[0] + 1.2, pan=0.2)
# the grow shot: a pop per block, traffic, the modern train's horn
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.4)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 1.5, 1.5) * 0.3, grow[0], pan=0.3)
add(sfx, horn(1.0), at(grow, 0.5), pan=0.5)
# the bridge week: the crowd, the drums, the lit boat's paddles, fireworks, the train again
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.35)
add(sfx, babble(today[1] - pay[0], 1.0), pay[0] + 0.2, pan=0.3, gain=0.35)
for t in np.arange(pay[0] + 0.3, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(78, 50, 0.4, 0.9), t, pan=-0.2, gain=0.2)
t = at(pay, 0.2)
while t < pay[1] - 0.3:
    add(sfx, paddle(1.2), t, pan=0.3)
    t += 0.3
tt = pay[0] + 3.4
chuffs(tt, tt + 4.0, 0.2, 0.9, 0.3)
add(sfx, filt(steam_whistle(1.4), "low", 2000), tt + 0.1, pan=0.3, gain=0.8)
add(sfx, rise_tone(2.0, 1.0), pay[0] + 0.2, pan=0.0)
for i in range(8):
    add(sfx, filt(firework_pop(), "low", 2000), pay[0] + 2.0 + i * 0.9 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
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


order = [hero, fight, move, brg, brk, rest, mend, grow, pay]
for a_, b_ in zip(order, order[1:]):
    if b_ is rest or b_ is mend:  # the quiet at Don Rak: no riser into it, and a soft one out
        continue
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
bridge_gap(rest[1] - 0.6, mend[0] + 0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.35)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.3
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU")
mix = master("public/soundtrack_kanchanaburi.wav", music, amb, sfx)
print("wrote public/soundtrack_kanchanaburi.wav", {"hero": round(hero[0], 2), "payoff": round(pay[0], 2)})
