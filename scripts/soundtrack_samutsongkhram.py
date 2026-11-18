"""Samut Songkhram soundtrack: a central-Thai river palette (ranat ek's wooden bars, the khlui flute, the pi reed in the
battle, klong that and ching) under a small sound for everything that appears or moves: a wet slap for every fish laid
in a basket on the cover's tray and the hiss of its steam; oars, the net hauled up streaming, a bell's shimmer as Luang
Pho Ban Laem rises; the battle at Bang Kung's drums, cannon and the fleet's oars; the fort's masonry; the steam train's
chuff and whistle; the market's voices, oars and hammers at the landing; the bridge going up and trucks on Rama II; the
town's bed, gulls by the sea; the payoff's market, the train's bell and the awnings folding. All code (no generated
audio); kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/samutsongkhram/timeline.ts out/timeline_samutsongkhram.json
      python3 scripts/soundtrack_samutsongkhram.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_samutsongkhram.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_samutsongkhram.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, catch, bk, fort, train, market, road, grow, pay, today = (
    B("hero"), B("catch"), B("bangkung"), B("fort"), B("train"), B("market"), B("road"), B("grow"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.25  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the tray's times (src/cities/samutsongkhram/actors.ts)
N_BASKETS, PACK_END, STEAM0 = 13, 2.1, 2.35
# the trains (timeline.ts TRAINS): the 2448 steam train, the payoff's railcar
TR1, TR1_DUR, TR2, TR2_DUR = 23.0, 5.2, 48.8, 4.4

# ---------------------------------------------------------------- score (D major pentatonic, 96 bpm, a river song)
BEAT = 60 / 96
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]
D, G, A, Bm, Em = [50, 57, 62], [43, 50, 55], [45, 52, 57], [47, 54, 59], [52, 59, 64]
sections = (
    (0.0, catch[0], [50, 57, 62, 66], 1.0),
    (catch[0], bk[0], D, 1.0),
    (bk[0], fort[0], Bm, 0.95),
    (fort[0], train[0], G, 0.9),
    (train[0], market[0], A, 0.95),
    (market[0], road[0], D, 0.9),
    (road[0], grow[0], Em, 0.9),
    (grow[0], pay[0], G, 1.0),
    (pay[0], DUR, [50, 57, 62, 66, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.16 * lvl)


def ranat_line(t0, t1, amp, step=BEAT / 2, prob=0.8):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.6), "low", 2300), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def khlui_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.4:
        d = BEAT * rng.choice([1, 1, 2])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(khlui(PENTA[i], d + 0.15), "low", 2200), t, pan=0.2, gain=amp)
        t += d


def klong(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0, 0.8, 0.4, 0.6, 0]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(110, 130), 60, 0.22, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.45)
        t += BEAT / 2
        k += 1


ranat_line(0.6, hero[1], 0.09, prob=0.55)
khlui_line(catch[0] + 0.3, catch[1], 0.06)
ranat_line(catch[0], catch[1], 0.08, prob=0.5)
klong(bk[0], bk[1], 0.15)
t = bk[0] + 0.4
while t < bk[1] - 0.4:  # the pi reed over the battle
    m = PENTA[int(rng.integers(1, 6))]
    d = BEAT * rng.choice([1, 2])
    add(music, filt(pi_reed(m, d + 0.1), "low", 2200), t, pan=0.15, gain=0.04)
    t += d
ranat_line(fort[0], fort[1], 0.1, prob=0.6)
khlui_line(train[0], train[1], 0.06)
klong(train[0] + 0.4, train[1], 0.06)
ranat_line(market[0], market[1], 0.1, prob=0.7)
khlui_line(road[0], road[1], 0.06)
ranat_line(grow[0], grow[1], 0.12, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
ranat_line(pay[0], DUR - 3.0, 0.12, prob=0.8)
khlui_line(pay[0], DUR - 3.0, 0.06)
klong(pay[0] + 0.2, DUR - 3.0, 0.1)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(1.0)
TT = np.arange(N) / SR
# the gulf at the cover and the catch; the river at the battle, the fort and the market; the road's traffic; the town bed
sea_on = 1 - np.clip((TT - catch[1]) / 1.5, 0, 1) + np.clip((TT - grow[0]) / 2.0, 0, 1) * (1 - np.clip((TT - pay[0]) / 1.5, 0, 1)) * 0.6
add(amb, filt(pink(N), "band", (90, 500)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.12 * TT)) * sea_on * 0.12, 0)
river_on = np.clip((TT - bk[0]) / 1.5, 0, 1) * (1 - np.clip((TT - road[0]) / 2.0, 0, 1)) + 0.25
add(amb, filt(pink(N), "band", (120, 600)) * river_on * 0.09, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1940) / 60, 0, 1) * 0.15, 0)


def gull():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 900 + 500 * np.exp(-t * 6) - 200 * t
    return filt(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ar(n, 0.02, 0.3) * 0.08, "low", 2300)


for k in range(5):
    add(amb, gull(), 0.6 + 1.6 * k + rng.uniform(0, 0.5), pan=rng.uniform(-0.7, 0.7))
for k in range(4):
    add(amb, gull(), grow[0] + 1.0 + 1.5 * k, pan=rng.uniform(-0.7, 0.7), gain=0.7)


# ---------------------------------------------------------------- the small sounds
def blip(f=None, gain=1.0):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    f0 = f or rng.uniform(320, 620)
    tone = np.sin(2 * np.pi * np.cumsum(f0 * np.exp(-t * 9)) / SR) * np.exp(-t * 26)
    knock_ = filt(noise(n), "band", (600, 2200)) * np.exp(-t * 90) * 0.25
    return (tone + knock_) * 0.55 * gain


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


def tick(gain=1.0):
    n = int(0.05 * SR)
    return filt(noise(n), "band", (900, 2200)) * np.exp(-np.arange(n) / SR * 120) * 0.35 * gain


def thud(gain=1.0, f=90):
    return filt(drum(f, 48, 0.3, 0.8), "low", 900) * gain


def slap(gain=1.0):
    """a wet fish laid in a bamboo basket"""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return (filt(noise(n), "band", (400, 1800)) * np.exp(-t * 60) * 0.5 + np.sin(2 * np.pi * 180 * t) * np.exp(-t * 40) * 0.2) * gain


def hiss(dur, gain=1.0):
    n = int(dur * SR)
    return filt(noise(n), "band", (700, 2300)) * env_ar(n, 0.3, 0.6) * 0.07 * gain


def cannon(gain=1.0):
    d = filt(drum(60, 30, 1.2, 1.0), "low", 400)
    n = len(d)
    t = np.arange(n) / SR
    return (d + filt(pink(n), "low", 700) * np.exp(-t * 4) * 0.6) * gain


def pack_at(k):
    return -1 + k * 0.05 if k < N_BASKETS / 2 else 0.1 + ((k - N_BASKETS / 2) / (N_BASKETS / 2 - 1)) * (PACK_END - 0.3)


# the cover: three slaps per basket from frame 0, a bamboo creak as each fills, the steam once the tray is on the boil
for k in range(N_BASKETS):
    s = pack_at(k)
    if s >= -0.02:
        for j in range(3):
            add(sfx, slap(1.0), max(0.0, s) + j * 0.08, pan=rng.uniform(-0.3, 0.3))
        add(sfx, creak(0.3) * 0.35, max(0.0, s) + 0.25, pan=rng.uniform(-0.3, 0.3))
add(sfx, hiss(catch[1] - STEAM0, 1.6), STEAM0, pan=0.1)
add(sfx, thud(0.5, 70), STEAM0, pan=0.0)
# the catch: oars, the net hauled up streaming with fish, a bell's shimmer as the Buddha rises
t = catch[0] + 0.2
while t < 6.0:
    add(sfx, splash() * 0.3, t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.35, 0.5)
n = int(1.6 * SR)
add(sfx, filt(pink(n), "band", (200, 1600)) * env_ar(n, 0.2, 0.9) * 0.35, 4.6, pan=0.0)  # the net out of the water
for k in range(10):
    add(sfx, slap(0.6), 5.0 + 0.11 * k, pan=rng.uniform(-0.5, 0.5))
add(sfx, babble(2.4, 1.2), 5.6, pan=-0.2, gain=0.3)
for k, f in enumerate([523, 659, 784]):
    add(sfx, filt(bell(f, 2.6, decay=1.8), "low", 2300), 6.0 + 0.2 * k, pan=0.0, gain=0.12)
add(sfx, gong(88, 3.0, 0.25), 6.8, pan=0.0)
# the battle: drums, the fleets' oars, cannon from the palisade and the boats, a cheer as the Burmese turn back
for k in range(9):
    add(sfx, cannon(0.35), at(bk, 0.18 + k * 0.07) + rng.uniform(0, 0.15), pan=rng.uniform(-0.6, 0.6))
t = bk[0] + 0.2
while t < bk[1] - 0.2:
    add(sfx, splash() * 0.22, t, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.25, 0.4)
for k in range(4):
    add(sfx, clash() * 0.25, at(bk, 0.45 + k * 0.08), pan=rng.uniform(-0.4, 0.4))
add(sfx, crowd(2.4), at(bk, 0.7), pan=0.1, gain=0.35)
# the fort: masonry laid, the temple's bell, the houses' posts along the river
t = at(fort, 0.1)
while t < at(fort, 0.85):
    add(sfx, thud(0.35, rng.uniform(80, 120)), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, tick(0.5), t + 0.05, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.2, 0.3)
add(sfx, filt(bell(440, 2.2, decay=2.0), "low", 2300), at(fort, 0.08), pan=-0.1, gain=0.15)
add(sfx, cannon(0.3), at(fort, 0.55), pan=-0.3)
# the train: chuffs that slow as it pulls in, the whistle, the brakes, voices on the platform
t = TR1
gap = 0.18
while t < TR1 + TR1_DUR:
    add(sfx, filt(chuff(), "low", 1800), t, pan=0.2, gain=0.6)
    t += gap
    gap = min(0.5, gap * 1.04)
add(sfx, filt(steam_whistle(1.3), "low", 2200), TR1 + 0.6, pan=0.2, gain=0.35)
add(sfx, hiss(1.2, 2.0), TR1 + TR1_DUR - 0.3, pan=0.0)
add(sfx, babble(1.6, 1.0), TR1 + TR1_DUR, pan=-0.1, gain=0.3)
add(sfx, gong(98, 2.4, 0.2), train[0] + 0.1, pan=0.0)
# the market: voices, oars at the landing, the shophouses' hammers, scales clinking
add(sfx, babble(market[1] - market[0], 1.0), market[0], pan=0.1, gain=0.3)
t = market[0] + 0.3
while t < at(market, 0.7):
    add(sfx, splash() * 0.25, t, pan=-0.3)
    t += rng.uniform(0.4, 0.55)
t = at(market, 0.15)
while t < at(market, 0.8):
    add(sfx, blip(rng.uniform(200, 300), 0.6), t, pan=rng.uniform(-0.5, 0.5))
    add(sfx, tick(0.5), t + 0.05, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.18, 0.28)
for k in range(4):
    add(sfx, clink() * 0.4, at(market, 0.3 + 0.15 * k), pan=rng.uniform(-0.4, 0.4))
# the road: the bridge's piles, trucks' engines and a horn
for k in range(8):
    add(sfx, thud(0.3, rng.uniform(70, 100)), at(road, 0.02 + 0.03 * k), pan=rng.uniform(-0.3, 0.3))
n = int((road[1] - at(road, 0.15)) * SR)
add(sfx, filt(pink(n), "low", 220) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * np.arange(n) / SR)) * env_ar(n, 0.6, 0.8) * 0.4, at(road, 0.15), pan=0.2)
for k in range(2):
    nh = int(0.5 * SR)
    th = np.arange(nh) / SR
    horn = (np.sin(2 * np.pi * 330 * th) + 0.6 * np.sin(2 * np.pi * 415 * th)) * env_ar(nh, 0.03, 0.15) * 0.05
    add(sfx, filt(horn, "low", 1600), at(road, 0.5 + 0.25 * k), pan=0.3)
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# the payoff: the market's voices, the train's bell, the awnings folded back one after another, the railcar's horn
add(sfx, babble(today[1] - pay[0], 1.2), pay[0], pan=0.2, gain=0.32)
add(sfx, crowd(today[1] - pay[0]), pay[0] + 0.3, pan=-0.2, gain=0.18)
for k in range(10):
    add(sfx, filt(bell(880, 0.5, decay=6.0), "low", 2300), TR2 + 0.2 + 0.32 * k, pan=0.3, gain=0.06)
nh = int(1.0 * SR)
th = np.arange(nh) / SR
horn = (np.sin(2 * np.pi * 294 * th) + 0.6 * np.sin(2 * np.pi * 370 * th)) * env_ar(nh, 0.05, 0.3) * 0.06
add(sfx, filt(horn, "low", 1600), TR2 + 0.4, pan=0.2)
for k in range(16):  # the awnings fold back as the railcar comes (actors.ts awningOpen)
    add(sfx, filt(whoosh(0.35, 0.3), "low", 1500), TR2 + 1.4 + 0.18 * k, pan=rng.uniform(-0.5, 0.5), gain=0.35)
n = int(TR2_DUR * SR)
add(sfx, filt(pink(n), "low", 260) * env_ar(n, 0.8, 0.6) * 0.3, TR2, pan=0.1)


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


order = [catch, bk, fort, train, market, road, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 1.5
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_samutsongkhram.wav", music, amb, sfx)
print("wrote public/soundtrack_samutsongkhram.wav", {"hero": round(hero[0], 2), "payoff": round(pay[0], 2)})
