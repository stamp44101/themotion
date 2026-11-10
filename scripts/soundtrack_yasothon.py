"""Yasothon soundtrack: an Isan palette (the khaen's chords and line, the pong lang's wooden bars (ranat voice), the long
drum (กลองยาว), the ching) under a small sound for everything that appears or moves: the rope pulled tight on every ring
of the cover's rocket, the bamboo knocks, the tail lashed on, the tower creaking as the rocket swings up; the fuse, the
roar and the whoosh of the launch, the crowd's cheer and the rain on the paddies; the temple and the hall going up in 2357;
oars and voices at the landing, the shophouses' hammers; trucks on Chaeng Sanit; the flag rope and a gong for the province;
the town's bed and a tractor in the grow shot; the festival's drums, crowd and the second launch at the payoff. All code
(no generated audio); kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/yasothon/timeline.ts out/timeline_yasothon.json
      python3 scripts/soundtrack_yasothon.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_yasothon.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_yasothon.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, launch, found, trade, road, prov, grow, fest, today = (
    B("hero"), B("launch"), B("found"), B("trade"), B("road"), B("province"), B("grow"), B("festival"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.25  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the rocket's times (src/cities/yasothon/actors.ts)
RINGS, BIND_END, FUSE, LIFT, LIFT2, BACK0, BACK1 = 14, 2.2, 4.3, 4.8, 51.8, 47.2, 49.2

# ---------------------------------------------------------------- score (A minor pentatonic, 100 bpm, lam-style)
BEAT = 60 / 100
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, Dm = [45, 52, 57], [48, 55, 60], [43, 50, 55], [50, 57, 62]
sections = (
    (0.0, launch[0], [45, 52, 57, 60], 1.0),
    (launch[0], found[0], Am, 1.0),
    (found[0], trade[0], C, 0.9),
    (trade[0], road[0], G, 0.9),
    (road[0], prov[0], Dm, 0.9),
    (prov[0], grow[0], C, 0.95),
    (grow[0], fest[0], G, 1.0),
    (fest[0], DUR, [48, 55, 60, 64, 67], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.16 * lvl)
    add(music, filt(khaen(notes + [notes[0] + 12], t1 - t0 + 0.4, bright=2100), "low", 2300), t0, pan=-0.15, gain=0.07 * lvl)


def ponglang(t0, t1, amp, step=BEAT / 2, prob=0.8):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.6), "low", 2300), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def khaen_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.4:
        d = BEAT * rng.choice([1, 1, 2])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(khaen([PENTA[i], PENTA[i] - 12], d + 0.15, bright=2000), "low", 2200), t, pan=0.2, gain=amp)
        t += d


def klong_yao(t0, t1, gain):
    pat = [1.0, 0, 0.6, 0.8, 0, 0.6, 0.9, 0.5]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(120, 140), 70, 0.18, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 4 == 0:
            add(music, drum(62, 40, 0.5, 0.9), t, pan=0.1, gain=gain * 0.8)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.5)
        t += BEAT / 2
        k += 1


ponglang(0.6, hero[1], 0.09, prob=0.55)
klong_yao(launch[0], launch[1], 0.14)
khaen_line(launch[0] + 0.3, launch[1], 0.06)
ponglang(found[0], found[1], 0.1, prob=0.6)
khaen_line(trade[0], trade[1], 0.06)
ponglang(road[0], road[1], 0.1, prob=0.75)
klong_yao(road[0] + 0.4, road[1], 0.06)
khaen_line(prov[0], prov[1], 0.06)
ponglang(grow[0], grow[1], 0.12, prob=0.75)
klong_yao(grow[0] + 1.0, grow[1], 0.08)
ponglang(fest[0], DUR - 3.0, 0.12, prob=0.8)
khaen_line(fest[0], DUR - 3.0, 0.06)
klong_yao(fest[0] + 0.2, DUR - 3.0, 0.13)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.9)
TT = np.arange(N) / SR
# the field and the forest at the cover; the Chi at the landing (found, trade); the road's traffic; the town bed (grow on)
river_on = np.clip((TT - found[0]) / 2.0, 0, 1) * (1 - np.clip((TT - road[0]) / 2.0, 0, 1)) + 0.3
add(amb, filt(pink(N), "band", (120, 600)) * river_on * 0.1, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1940) / 60, 0, 1) * 0.15, 0)


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


def tick(gain=1.0):
    n = int(0.05 * SR)
    return filt(noise(n), "band", (900, 2200)) * np.exp(-np.arange(n) / SR * 120) * 0.35 * gain


def thud(gain=1.0, f=90):
    return filt(drum(f, 48, 0.3, 0.8), "low", 900) * gain


def knock(gain=1.0):
    """bamboo knocked: a hollow wooden tock"""
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    f = rng.uniform(380, 460)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.6 * t)) * np.exp(-t * 32) * 0.4 * gain


def rope(dur, gain=1.0):
    """a rope pulled tight: a creaky squeak"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(520 + 160 * np.sin(2 * np.pi * 5.0 * t)) / SR)
    return filt(s * (0.5 + 0.5 * np.sin(2 * np.pi * 5.0 * t)) ** 4, "low", 1800) * env_ar(n, 0.03, 0.15) * 0.08 * gain


def rain(dur, gain=1.0):
    n = int(dur * SR)
    hiss_ = filt(noise(n), "band", (500, 2000)) * 0.08
    drops = np.zeros(n)
    for _ in range(int(dur * 60)):
        k = int(rng.uniform(0, n - 400))
        drops[k : k + 400] += np.exp(-np.arange(400) / 60) * rng.uniform(0.1, 0.3)
    return (hiss_ + filt(drops * noise(n), "band", (700, 2200))) * env_ar(n, 0.5, 0.8) * gain


def launch_roar(t0, gain=1.0):
    """the fuse fizz, the roar of the motor, the whoosh climbing away"""
    add(sfx, filt(crackle(LIFT - FUSE + 0.2), "low", 2200), t0 - (LIFT - FUSE), pan=0.1, gain=0.5 * gain)
    add(sfx, filt(roar(3.2, 70), "low", 1400), t0, pan=0.0, gain=0.8 * gain)
    n = int(3.6 * SR)
    add(sfx, filt(pink(n), "band", (150, 1200)) * env_ar(n, 0.05, 2.4) * 0.5 * gain, t0, pan=0.0)
    add(sfx, filt(whoosh(2.4, 0.8), "low", 1600), t0 + 0.6, pan=0.0, gain=0.6 * gain)
    add(sfx, crowd(3.0), t0 + 0.3, pan=-0.2, gain=0.45 * gain)


def bind_at(k):
    return -1 + k * 0.1 if k < RINGS / 2 else 0.15 + ((k - RINGS / 2) / (RINGS / 2 - 1)) * (BIND_END - 0.35)


# the cover: a rope pulled tight and a bamboo knock on every ring from frame 0, the tail lashed, the tower creaking
for k in range(RINGS):
    s = bind_at(k)
    if s >= -0.02:
        add(sfx, rope(0.3, 1.2), max(0.0, s), pan=rng.uniform(-0.3, 0.3))
        add(sfx, knock(0.9), max(0.0, s) + 0.12, pan=rng.uniform(-0.3, 0.3))
add(sfx, filt(whoosh(0.5, 0.4), "low", 1500), BIND_END, pan=0.2, gain=0.4)  # the tail slides in
for k in range(3):
    add(sfx, rope(0.25, 1.0), BIND_END + 0.15 + 0.1 * k, pan=0.2)
for k in range(4):
    add(sfx, creak(0.6) * 0.5, 2.6 + 0.3 * k, pan=rng.uniform(-0.3, 0.3))  # the tower takes the rocket
add(sfx, thud(0.6, 80), 3.85, pan=0.0)
# the launch: the crowd gathers, the fuse, the roar; the rain on the paddies
add(sfx, babble(LIFT - launch[0], 1.0), launch[0], pan=-0.2, gain=0.3)
launch_roar(LIFT)
add(sfx, rain(2.8, 1.0), 6.9, pan=0.0)
for k in range(3):
    add(sfx, filt(drum(55, 34, 1.6, 0.8), "low", 300), 7.0 + 0.5 * k, pan=rng.uniform(-0.4, 0.4), gain=0.25)  # thunder
# 2357: the stupa's courses, the hall's posts, a bell for the new town
t = at(found, 0.08)
while t < at(found, 0.8):
    add(sfx, thud(0.35, rng.uniform(80, 120)), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, knock(0.4), t + 0.05, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.18, 0.28)
add(sfx, filt(bell(523, 2.0, decay=2.0), "low", 2300), at(found, 0.55), pan=0.0, gain=0.16)
add(sfx, gong(88, 3.0, 0.25), at(found, 0.7), pan=0.0)
# the trade: oars, creaks, voices at the landing, the shophouses' hammers
t = trade[0] + 0.3
while t < trade[1] - 0.2:
    add(sfx, splash() * 0.3, t, pan=-0.2)
    t += rng.uniform(0.4, 0.55)
for k in range(5):
    add(sfx, creak(0.7) * 0.5, at(trade, 0.15 + 0.17 * k), pan=rng.uniform(-0.4, 0.4))
t = at(trade, 0.25)
while t < at(trade, 0.85):
    add(sfx, blip(rng.uniform(200, 300), 0.6), t, pan=rng.uniform(-0.5, 0.5))
    add(sfx, tick(0.5), t + 0.05, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.18, 0.28)
add(sfx, babble(trade[1] - at(trade, 0.3), 0.8), at(trade, 0.3), pan=0.1, gain=0.25)
# the road: the road laid, the trucks' engines and a horn
for k in range(8):
    add(sfx, thud(0.3, rng.uniform(70, 100)), at(road, 0.02 + 0.03 * k), pan=rng.uniform(-0.3, 0.3))
n = int((road[1] - at(road, 0.2)) * SR)
add(sfx, filt(pink(n), "low", 220) * (0.6 + 0.4 * np.sin(2 * np.pi * 11 * np.arange(n) / SR)) * env_ar(n, 0.6, 0.8) * 0.4, at(road, 0.2), pan=0.2)
for k in range(2):
    nh = int(0.5 * SR)
    th = np.arange(nh) / SR
    horn = (np.sin(2 * np.pi * 330 * th) + 0.6 * np.sin(2 * np.pi * 415 * th)) * env_ar(nh, 0.03, 0.15) * 0.05
    add(sfx, filt(horn, "low", 1600), at(road, 0.5 + 0.25 * k), pan=0.3)
# 2515: the hall's walls, the flag rope, a gong
for k in range(8):
    add(sfx, blip(rng.uniform(220, 320), 0.6), at(prov, 0.05 + k * 0.035), pan=rng.uniform(-0.5, 0.5))
add(sfx, rope(1.4, 1.2), at(prov, 0.4), pan=0.3)
add(sfx, gong(88, 3.0, 0.3), at(prov, 0.62), pan=0.0)
# the grow shot: a pop per block, the tractor in the paddies, traffic; the toad rising at the end
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.3, grow[0], pan=-0.3)
for k in range(3):
    add(sfx, filt(drum(150, 110, 0.25, 0.6), "low", 900), at(grow, 0.82 + 0.05 * k), pan=0.2, gain=0.35)  # the toad's croak
# the payoff: the procession's drums and crowd, the rocket coming down onto the tower, the second launch
add(sfx, crowd(today[1] - fest[0] + 0.5), fest[0], pan=0.2, gain=0.3)
add(sfx, babble(today[1] - fest[0], 1.0), fest[0] + 0.2, pan=0.3, gain=0.3)
add(sfx, filt(whoosh(1.8, 0.6), "low", 1500), BACK0 + 0.2, pan=0.0, gain=0.45)
add(sfx, thud(0.8, 70), BACK1, pan=0.0)
for k in range(3):
    add(sfx, creak(0.6) * 0.5, BACK1 + 0.1 + 0.2 * k, pan=rng.uniform(-0.3, 0.3))
launch_roar(LIFT2, 1.0)


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


order = [launch, found, trade, road, prov, grow, fest]
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
mix = master("public/soundtrack_yasothon.wav", music, amb, sfx)
print("wrote public/soundtrack_yasothon.wav", {"hero": round(hero[0], 2), "festival": round(fest[0], 2)})
