"""Uttaradit soundtrack: a northern-central palette (the ranat's bars, the khlui's line, the pi's reed for the north, the
klong and the ching, a pad under them) under a small sound for everything that appears or moves: the hammer on the anvil
at every blow of the cover, sparks, the hiss of the cooling blade and its ring; the sword's whoosh down the valley; the
wall going up; the clash of the two swords, the snap and the column's feet falling back; oars, rafts knocking and the
market row's hammers at Tha It; the train's chuffs, whistle and the bridge's drum; the flag rope and a gong for the new
name; earth and water for the dam; the town's bed and the yards in the grow shot; the fair's murmur, lights and the sword's
ring at the payoff. All code (no generated audio); kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/uttaradit/timeline.ts out/timeline_uttaradit.json
      python3 scripts/soundtrack_uttaradit.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_uttaradit.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_uttaradit.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, rais, fight, trade, arrive, rename, dam, fill, grow, gather, today = (
    B("hero"), B("raise"), B("fight"), B("trade"), B("arrive"), B("rename"), B("dam"), B("fill"), B("grow"), B("gather"),
    B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.55  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
FORGE_END = 2.3
SEG = 12
SNAP = 7.0

# ---------------------------------------------------------------- score (A minor pentatonic into C, 92 bpm)
BEAT = 60 / 92
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, F, Dm = [45, 52, 57], [48, 55, 60], [43, 50, 55], [41, 48, 53], [50, 57, 62]

sections = (
    (0.0, fight[0], [45, 52, 57, 60], 1.0),
    (fight[0], trade[0], Dm, 0.95),
    (trade[0], arrive[0], C, 0.9),
    (arrive[0], rename[0], G, 0.95),
    (rename[0], dam[0], F, 0.9),
    (dam[0], grow[0], Am, 0.9),
    (grow[0], gather[0], G, 1.0),
    (gather[0], DUR, [48, 55, 60, 64, 67], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.2 * lvl)


def ranat_run(t0, t1, amp, step=BEAT / 2, prob=0.8):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.7), "low", 2300), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def khlui_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.5:
        d = BEAT * rng.choice([1, 2, 2, 3])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(khlui(PENTA[i], d + 0.2), "low", 2200), t, pan=0.2, gain=amp)
        t += d


def reed_line(t0, t1, amp):
    t = t0
    i = 2
    while t < t1 - 0.5:
        d = BEAT * rng.choice([1, 1, 2])
        i = int(np.clip(i + rng.choice([-1, 1, 2, -2]), 0, len(PENTA) - 1))
        add(music, filt(pi_reed(PENTA[i], d + 0.1), "low", 2100), t, pan=-0.2, gain=amp)
        t += d


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


ranat_run(0.8, hero[1], 0.1, prob=0.55)
klong(fight[0], fight[1], 0.13)
reed_line(fight[0] + 0.3, fight[1], 0.07)
khlui_line(trade[0], trade[1], 0.08)
ranat_run(arrive[0], arrive[1], 0.11, prob=0.75)
klong(arrive[0] + 0.4, arrive[1], 0.07)
khlui_line(rename[0], rename[1], 0.08)
ranat_run(dam[0], fill[1], 0.09, prob=0.5)
ranat_run(grow[0], grow[1], 0.12, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
ranat_run(gather[0], DUR - 3.0, 0.12, prob=0.8)
reed_line(gather[0], DUR - 3.0, 0.07)
klong(gather[0] + 0.2, DUR - 3.0, 0.12)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.9)
TT = np.arange(N) / SR
# the forest and the coals at the cover, the Nan at Phichai and Tha It, the gorge at the dam, the town bed (grow on)
river_on = np.clip((TT - fight[0]) / 2.0, 0, 1) * (1 - 0.5 * ((TT > dam[0]) & (TT < fill[1])))
add(amb, filt(pink(N), "band", (120, 600)) * river_on * 0.12, 0)
gorge = np.clip(1 - np.abs(TT - (dam[0] + fill[1]) / 2) / 4.0, 0, 1)
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * TT / 2.7)) * gorge * 0.22, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1960) / 50, 0, 1) * 0.15, 0)


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


def anvil(gain=1.0):
    """a hammer blow on hot iron over an anvil: a ringing clang (kept under 2.3 kHz) on a dull thump"""
    ring = filt(bell(rng.uniform(780, 860), 0.9, ratios=(1, 1.48, 2.21, 2.67), decay=5.5), "low", 2300) * 0.55
    thump = filt(drum(110, 60, 0.25, 0.9), "low", 900) * 0.6
    ring[: len(thump)] += thump
    return ring * gain


def hiss(dur, gain=1.0):
    """the blade cooling: a soft steam hiss"""
    n = int(dur * SR)
    return filt(noise(n), "band", (900, 2300)) * env_ar(n, 0.05, dur * 0.7) * 0.12 * gain


def tick(gain=1.0):
    n = int(0.05 * SR)
    return filt(noise(n), "band", (900, 2200)) * np.exp(-np.arange(n) / SR * 120) * 0.35 * gain


def thud(gain=1.0, f=90):
    return filt(drum(f, 48, 0.3, 0.8), "low", 900) * gain


def oar(gain=1.0):
    return splash() * 0.3 * gain


def rope(dur, gain=1.0):
    """the flag's halyard squeaking through the block"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(600 + 140 * np.sin(2 * np.pi * 3.3 * t)) / SR)
    return filt(s * (0.5 + 0.5 * np.sin(2 * np.pi * 3.3 * t)) ** 4, "low", 1800) * env_ar(n, 0.05, 0.2) * 0.06 * gain


def rise_tone(dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (45, 52, 57, 60, 64):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def strike(k):
    return -1.2 + k * 0.15 if k < SEG / 2 else ((k - SEG / 2) / (SEG / 2 - 1)) * (FORGE_END - 0.25)


# the cover: a hammer blow on every segment from frame 0, sparks ticking, the coals breathing, the hiss and the ring
n = int((hero[1] + 0.6) * SR)
add(sfx, filt(pink(n), "low", 300) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.8 * np.arange(n) / SR)) * env_ar(n, 0.05, 0.6) * 0.18, 0.0)
for k in range(SEG):
    s = strike(k)
    if s >= -0.02:
        add(sfx, anvil(1.0), max(0.0, s), pan=0.15)
        for j in range(5):
            add(sfx, tick(rng.uniform(0.4, 0.9)), max(0.0, s) + 0.02 + j * rng.uniform(0.02, 0.05), pan=rng.uniform(-0.6, 0.6))
add(sfx, hiss(1.6, 1.2), FORGE_END + 0.1, pan=0.1)
add(sfx, rise_tone(1.8, 1.0), FORGE_END + 0.1, pan=0.0)
add(sfx, filt(bell(1046, 1.8, decay=2.2), "low", 2300), FORGE_END + 0.6, pan=0.0, gain=0.16)  # the blade rings as it lifts
# the raise: the sword's whoosh down the valley; the wall's earth thumped up
add(sfx, filt(whoosh(1.7, 0.7), "low", 1600), rais[0], pan=-0.3, gain=0.6)
t = rais[0] + 0.2
while t < rais[1]:
    add(sfx, thud(0.45, rng.uniform(70, 110)), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.14, 0.22)
# 2316: the giant rises, the column's feet and spears, the swords clash, the snap at ~7 s, the column falls back
add(sfx, filt(drum(60, 36, 1.0, 1.0), "low", 600), fight[0] - 0.2, pan=0.0, gain=0.5)
t = fight[0]
while t < SNAP - 0.1:
    add(sfx, footstep(0.5), t, pan=-0.4)
    t += 0.2
t = fight[0] + 0.5
while t < 9.0:
    add(sfx, filt(clash(), "low", 2300), t, pan=rng.uniform(-0.2, 0.3), gain=0.55)
    t += rng.uniform(0.32, 0.5)
add(sfx, filt(bell(700, 1.2, ratios=(1, 1.37, 2.03, 2.9), decay=4), "low", 2300), SNAP, pan=0.2, gain=0.45)  # the snap
add(sfx, thud(0.9, 70), SNAP + 0.05, pan=0.2)
add(sfx, filt(whoosh(0.8, 0.4), "low", 1500), SNAP + 0.05, pan=0.4, gain=0.35)  # the half spinning off
add(sfx, crowd(2.4), SNAP + 0.3, pan=-0.3, gain=0.3)
t = 7.4
while t < 9.3:
    add(sfx, footstep(0.45), t, pan=-0.5)
    t += 0.17
add(sfx, gong(74, 2.6, 0.22), fight[1] - 0.6, pan=0.0)
# the trade: oars, the barges' creak, rafts knocking, the market row's hammers, voices at the landing
t = trade[0] + 0.3
while t < trade[1] - 0.2:
    add(sfx, oar(0.9), t, pan=-0.2)
    t += rng.uniform(0.4, 0.55)
for k in range(5):
    add(sfx, creak(0.7) * 0.5, at(trade, 0.15 + 0.17 * k), pan=rng.uniform(-0.4, 0.4))
for k in range(6):
    add(sfx, thud(0.35, rng.uniform(140, 190)), at(trade, 0.45 + 0.08 * k), pan=0.3)  # logs knocking
t = at(trade, 0.15)
while t < at(trade, 0.8):
    add(sfx, blip(rng.uniform(200, 300), 0.6), t, pan=rng.uniform(-0.5, 0.5))
    add(sfx, tick(0.5), t + 0.05, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.18, 0.28)
add(sfx, babble(trade[1] - at(trade, 0.4), 0.8), at(trade, 0.4), pan=0.1, gain=0.25)
# 2452: rails laid, the train: chuffs, the whistle, the bridge's drum over the Nan, the station built
for k in range(8):
    add(sfx, filt(clink(), "low", 2200), arrive[0] + 0.1 + k * 0.08, pan=rng.uniform(-0.3, 0.3), gain=0.6)
t = arrive[0] + 0.3
while t < arrive[1] - 0.3:
    add(sfx, chuff(), t, pan=0.0, gain=0.55)
    t += 0.24
add(sfx, filt(steam_whistle(1.3), "low", 1500), arrive[0] + 1.2, pan=-0.2, gain=0.4)
t = 19.4
while t < 20.2:
    add(sfx, drum(80, 52, 0.25, 0.6), t, pan=0.0, gain=0.25)  # the bridge's deck under the wheels
    t += 0.12
for k in range(10):
    add(sfx, blip(rng.uniform(220, 320), 0.6), at(arrive, 0.3 + k * 0.03), pan=rng.uniform(-0.5, 0.5))
add(sfx, filt(steam_whistle(1.0), "low", 1500), at(arrive, 0.55), pan=0.3, gain=0.3)
# 2458: the hall's walls, the flag rope, a gong for the new name
for k in range(8):
    add(sfx, blip(rng.uniform(220, 320), 0.6), at(rename, 0.05 + k * 0.035), pan=rng.uniform(-0.5, 0.5))
add(sfx, rope(1.4), at(rename, 0.4), pan=0.3, gain=1.4)
add(sfx, rise_tone(2.0, 1.0), at(rename, 0.45), pan=0.0)
add(sfx, gong(88, 3.0, 0.3), at(rename, 0.62), pan=0.0)
# the dam: earth tipped and rolled; then the water rising behind it
t = dam[0] + 0.1
while t < dam[1] - 0.1:
    add(sfx, thud(0.5, rng.uniform(60, 90)), t, pan=rng.uniform(-0.3, 0.3))
    add(sfx, filt(noise(int(0.2 * SR)), "low", 700) * env_ar(int(0.2 * SR), 0.01, 0.15) * 0.12, t + 0.05, pan=0.2)
    t += rng.uniform(0.22, 0.32)
n = int((fill[1] - fill[0]) * SR)
add(sfx, filt(pink(n), "band", (100, 700)) * np.linspace(0.2, 1.0, n) * env_ar(n, 0.3, 0.6) * 0.35, fill[0], pan=0.0)
for k in range(5):
    add(sfx, splash() * 0.5, at(fill, 0.1 + 0.18 * k), pan=rng.uniform(-0.4, 0.4))
add(sfx, rise_tone(2.0, 0.9), at(fill, 0.4), pan=0.0)
# the grow shot: a pop per block, the yards' clank, the orchards, traffic
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.03), pan=rng.uniform(-0.5, 0.5))
for k in range(6):
    add(sfx, filt(clink(), "low", 2200), at(grow, 0.08 + 0.05 * k), pan=-0.3, gain=0.5)
t = at(grow, 0.35)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 1.5, 1.5) * 0.3, grow[0], pan=0.3)
# the payoff: the fair's murmur, the lights coming on, the sword's ring as it comes back over the town
add(sfx, crowd(today[1] - gather[0] + 0.5), gather[0], pan=0.2, gain=0.3)
add(sfx, babble(today[1] - gather[0], 1.0), gather[0] + 0.2, pan=0.3, gain=0.35)
for k in range(12):
    add(sfx, filt(ching(0.3), "low", 2300), at(gather, 0.05 + k * 0.012), pan=rng.uniform(-0.6, 0.6), gain=0.4)
add(sfx, filt(whoosh(1.6, 0.6), "low", 1500), at(gather, 0.18), pan=0.0, gain=0.5)
add(sfx, rise_tone(2.0, 1.0), at(gather, 0.25), pan=0.0)
for k, f in enumerate((880, 1046, 1318)):
    add(sfx, filt(bell(f, 1.8, decay=2.2), "low", 2300), at(gather, 0.45) + 0.16 * k, pan=0.0, gain=0.14)
for k in range(4):
    add(sfx, anvil(0.35), at(gather, 0.62 + 0.06 * k), pan=0.1)  # the hammer's echo under the sword
add(sfx, gong(74, 3.0, 0.35), at(gather, 0.92), pan=0.0)


# ---------------------------------------------------------------- the gaps between beats: a rising bridge into each
def bridge_gap(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [fight, trade, arrive, rename, dam, grow, gather]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.7
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_uttaradit.wav", music, amb, sfx)
print("wrote public/soundtrack_uttaradit.wav", {"hero": round(hero[0], 2), "gather": round(gather[0], 2)})
