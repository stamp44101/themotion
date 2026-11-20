"""Nong Khai soundtrack: an Isan-Lao palette (the khaen's chords, the phin, the pong lang played as wooden bars, a klong
and ching, the long-boat drum) under a small sound for everything that appears or moves: the adze's chok and the chips
for the cover's boat, a gong as the naga's head comes out; ox carts and voices as Ban Phai is settled; Kham Yat's drum
and paddles and the bank cheering; the bank's rumble and the stupa's splash; cart wheels, the crack of Phra Sai's wheel,
a bell as the image comes home; marching feet, drums and paddles for the Haw army, a gong for the monument; the train's
engine and horn; the town's pops; the bridge's spans knocked in and a bell as they meet, then traffic; the race drums,
paddles and crowd, soft whooshes for the naga fireballs, fireworks at the end. The Mekong's water runs under it all.
All code (no generated audio); kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/nongkhai/timeline.ts out/timeline_nongkhai.json
      python3 scripts/soundtrack_nongkhai.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_nongkhai.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_nongkhai.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, settle, found, sink, prasai, haw, rail, grow, bridge, race, today = (
    B("hero"), B("settle"), B("found"), B("sink"), B("prasai"), B("haw"), B("rail"), B("grow"), B("bridge"), B("race"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.8  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the cover's carving (src/cities/nongkhai/Boat.tsx): the adze runs to the bow by 1.7 s, the head is out by 2.0 s
CARVE_END = 1.7

# ---------------------------------------------------------------- score (A minor pentatonic, lai yai feel, 100 bpm)
BEAT = 60 / 100
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, Dm, Em = [45, 52, 57, 60], [48, 55, 60, 64], [43, 50, 55, 59], [50, 57, 62, 65], [52, 59, 64, 67]
sections = (
    (0.0, settle[0], Am, 1.0),
    (settle[0], found[0], Am, 1.0),
    (found[0], sink[0], C, 1.0),
    (sink[0], prasai[0], Dm, 0.9),
    (prasai[0], haw[0], G, 0.9),
    (haw[0], rail[0], Em, 0.95),
    (rail[0], grow[0], Am, 0.95),
    (grow[0], bridge[0], C, 1.0),
    (bridge[0], race[0], G, 1.0),
    (race[0], DUR, [45, 52, 57, 60, 64], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, filt(khaen(notes, t1 - t0 + 0.6, bright=2000), "low", 2300), t0, gain=0.13 * lvl)
    add(music, pad(notes[:3], t1 - t0 + 0.6, bright=1400), t0, gain=0.07 * lvl)


def wood_line(t0, t1, amp, step=BEAT / 2, prob=0.8):
    """the pong lang: running pentatonic on wooden bars"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.5), "low", 2200), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def phin_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.3:
        d = BEAT * rng.choice([0.5, 0.5, 1])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(pluck(PENTA[i] - 12, 1.2, bright=0.8), "low", 2100), t, pan=0.25, gain=amp)
        t += d


def klong(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0, 0.8, 0.4, 0.6, 0]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(105, 125), 58, 0.22, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.45)
        t += BEAT / 2
        k += 1



phin_line(0.4, hero[1], 0.07)
phin_line(settle[0], settle[1], 0.07)
klong(found[0], found[1], 0.12)
wood_line(found[0] + 0.5, found[1], 0.06, prob=0.5)
phin_line(sink[0], sink[1], 0.06)
wood_line(prasai[0], prasai[1], 0.08, prob=0.55)
klong(haw[0], haw[1], 0.1)
phin_line(rail[0], rail[1], 0.06)
wood_line(grow[0], grow[1], 0.11, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
wood_line(bridge[0], bridge[1], 0.09, prob=0.6)
wood_line(race[0], DUR - 3.0, 0.13, prob=0.85)
phin_line(race[0], DUR - 3.0, 0.06)
klong(race[0] + 0.2, DUR - 3.0, 0.11)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(1.0)
TT = np.arange(N) / SR
# the Mekong's broad water under the bank shots; the paddy wind on the cover and the grow shot; the town bed from the 1950s
river_on = 0.5 + 0.5 * np.clip((TT - settle[0]) / 1.5, 0, 1) * (1 - 0.6 * np.clip((TT - grow[0]) / 1.5, 0, 1) * (1 - np.clip((TT - bridge[0]) / 1.5, 0, 1)))
add(amb, filt(pink(N), "band", (110, 650)) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * TT)) * river_on * 0.1, 0)
wind_on = 1 - np.clip((TT - settle[0]) / 2.0, 0, 1) + np.clip((TT - grow[0]) / 1.5, 0, 1) * (1 - np.clip((TT - bridge[0]) / 1.5, 0, 1))
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * wind_on * 0.08, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 60, 0, 1) * 0.15, 0)


def frogs(dur, gain=1.0):
    """frogs in the paddy ditches: soft low croaks"""
    n = int(dur * SR)
    out = np.zeros(n)
    k = 0
    while k < n - int(0.2 * SR):
        L = int(0.12 * SR)
        t = np.arange(L) / SR
        f = rng.uniform(260, 420)
        out[k : k + L] += np.sin(2 * np.pi * f * t) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 28 * t))) * env_ar(L, 0.01, 0.08) * 0.05
        k += int(rng.uniform(0.15, 0.6) * SR)
    return filt(out, "low", 1600) * gain



add(amb, frogs(settle[1] + 1.0), 0.0, pan=-0.3)
add(amb, frogs(haw[0] - prasai[0]), prasai[0], pan=0.3, gain=0.6)


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


def beater(gain=1.0):
    """the loom's reed banged into the fell: a dry wooden clack with a low body"""
    n = int(0.14 * SR)
    t = np.arange(n) / SR
    return (filt(noise(n), "band", (500, 1800)) * np.exp(-t * 70) * 0.45 + np.sin(2 * np.pi * 140 * t) * np.exp(-t * 35) * 0.35) * gain


def scrape(dur, gain=1.0):
    """a brush on sandstone"""
    n = int(dur * SR)
    return filt(noise(n), "band", (500, 2000)) * env_ar(n, 0.05, 0.1) * 0.08 * gain


def rumble(dur, gain=1.0):
    n = int(dur * SR)
    return filt(pink(n), "low", 260) * env_ar(n, 0.3, 0.8) * 0.5 * gain



def chop(gain=1.0):
    """the adze biting the log: a dull wooden chok with a crack on top"""
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 118 * t) * np.exp(-t * 30) * 0.5 + filt(noise(n), "band", (450, 1900)) * np.exp(-t * 60) * 0.4) * gain


def paddle(gain=1.0):
    """a paddle dug in together: a short low splash"""
    n = int(0.2 * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (180, 1100)) * np.exp(-t * 22) * 0.35 * gain


def horn(dur=1.2, f=196):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * k * t) / k for k in (1, 2, 3)) + 0.6 * sum(np.sin(2 * np.pi * f * 1.26 * k * t) / k for k in (1, 2))
    return filt(s, "low", 1400) * env_ar(n, 0.05, 0.25) * 0.12


def engine(dur, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return filt(pink(n), "low", 200) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t)) * env_ar(n, 0.5, 0.8) * 0.4 * gain


# the cover: an adze chop and a burst of chips every 0.18 s from frame 0 until the bow is reached; a gong for the naga's head
t = 0.0
while t < CARVE_END:
    add(sfx, chop(0.9), t, pan=-0.2 + 0.4 * t / CARVE_END)
    add(sfx, tick(0.5), t + 0.04, pan=rng.uniform(-0.3, 0.3))
    t += 0.18
add(sfx, gong(82, 2.6, 0.24), 1.95, pan=0.0)
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.3, pan=0.0, gain=0.4)  # the boat folds away
# settle: ox carts creaking, feet, voices; posts knocked in as the houses go up
t = settle[0] + 0.3
while t < settle[1] - 0.3:
    add(sfx, creak(0.4) * 0.4, t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, footstep(0.5), t + 0.15, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.45, 0.65)
add(sfx, babble(settle[1] - settle[0] - 0.5, 0.9), settle[0] + 0.4, pan=-0.1, gain=0.3)
for k in range(7):
    add(sfx, thud(0.3, rng.uniform(90, 130)), at(settle, 0.5 + 0.06 * k), pan=rng.uniform(-0.4, 0.4))
# found: Kham Yat's drum on every stroke, the paddles, the bank cheering
t = found[0]
while t < found[1]:
    add(sfx, drum(130, 70, 0.22, 0.7), t, pan=0.1, gain=0.5)
    add(sfx, paddle(0.9), t + 0.12, pan=rng.uniform(-0.3, 0.3))
    t += 1 / 1.7
add(sfx, crowd(found[1] - found[0] - 0.4), found[0] + 0.2, pan=-0.2, gain=0.3)
add(sfx, babble(found[1] - found[0] - 0.4, 1.2), found[0] + 0.2, pan=0.2, gain=0.22)
# sink: a rumble, the bank sliding in, a big splash as the stupa goes, voices, a low gong
add(sfx, rumble(2.2, 0.8), at(sink, 0.1), pan=-0.2)
for k in range(4):
    add(sfx, splash() * 0.45, at(sink, 0.18 + 0.07 * k), pan=-0.3 + 0.2 * k)
add(sfx, splash() * 0.9, at(sink, 0.62), pan=0.0)
add(sfx, rumble(1.4, 0.6), at(sink, 0.55), pan=0.1)
add(sfx, babble(2.0, 1.4), at(sink, 0.3), pan=0.3, gain=0.25)
add(sfx, gong(66, 3.4, 0.28), at(sink, 0.78), pan=0.0)
# prasai: two carts rolling, the crack of the wheel, murmurs, the bearers' feet, a temple bell as Phra Sai comes home
t = prasai[0] + 0.2
while t < at(prasai, 0.42):
    add(sfx, creak(0.4) * 0.4, t, pan=rng.uniform(-0.3, 0.3))
    add(sfx, footstep(0.4), t + 0.2, pan=rng.uniform(-0.3, 0.3))
    t += 0.45
add(sfx, thud(0.9, 80), at(prasai, 0.43), pan=0.1)
add(sfx, tick(1.0), at(prasai, 0.43), pan=0.1)
add(sfx, babble(1.6, 1.3), at(prasai, 0.45), pan=-0.1, gain=0.3)
t = at(prasai, 0.56)
while t < at(prasai, 0.86):
    add(sfx, footstep(0.4), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.28
add(sfx, filt(bell(440, 2.6, decay=2.0), "low", 2300), at(prasai, 0.88), pan=0.0, gain=0.18)
# haw: the marching column (feet and drum), the boats' paddles, a gong as the monument stands
t = haw[0] + 0.1
while t < at(haw, 0.5):
    add(sfx, footstep(0.6), t, pan=-0.2)
    add(sfx, footstep(0.5), t + 0.04, pan=0.2)
    t += BEAT / 2
t = at(haw, 0.4)
while t < at(haw, 0.95):
    add(sfx, paddle(0.8), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.4
add(sfx, gong(74, 3.0, 0.3), at(haw, 0.85), pan=0.0)
# rail: the engine coming up, its horn, the brakes, a bell at the platform
add(sfx, engine(rail[1] - rail[0] - 0.6, 0.9), rail[0], pan=-0.3)
add(sfx, horn(1.2), at(rail, 0.15), pan=-0.2)
add(sfx, horn(0.8), at(rail, 0.62), pan=0.1)
add(sfx, filt(whoosh(1.0, 0.4), "low", 900), at(rail, 0.72), pan=0.0, gain=0.4)
add(sfx, filt(bell(523, 1.6, decay=2.4), "low", 2300), at(rail, 0.8), pan=0.2, gain=0.12)
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# bridge: each pier and deck piece knocked in from both banks, a bell as the spans meet, then traffic
for k in range(9):
    add(sfx, thud(0.45, rng.uniform(70, 110)), at(bridge, 0.0 + 0.05 * k), pan=-0.5 + 0.12 * k)
add(sfx, filt(bell(392, 2.8, decay=1.6), "low", 2300), at(bridge, 0.47), pan=0.0, gain=0.2)
add(sfx, gong(88, 3.0, 0.24), at(bridge, 0.48), pan=0.0)
add(sfx, engine(bridge[1] - at(bridge, 0.6), 0.5), at(bridge, 0.6), pan=0.2)
# race: the boats' drums fast, paddles, the crowd; soft whooshes as the fireballs rise
t = race[0]
while t < race[1]:
    add(sfx, drum(140, 75, 0.2, 0.7), t, pan=-0.1, gain=0.5)
    add(sfx, paddle(1.0), t + 0.1, pan=rng.uniform(-0.4, 0.4))
    t += 1 / 2.4
add(sfx, crowd(today[1] - race[0]), race[0], pan=-0.2, gain=0.34)
add(sfx, babble(today[1] - race[0], 1.3), race[0], pan=0.2, gain=0.25)
for i in range(7):
    k0 = 0.45 + (i % 4) * 0.1 + (i // 4) * 0.05
    add(sfx, filt(whoosh(0.9, 0.3), "low", 900), at(race, k0), pan=-0.5 + i * 0.15, gain=0.3)


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


order = [settle, found, sink, prasai, haw, rail, grow, bridge, race]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 1.8
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_nongkhai.wav", music, amb, sfx)
print("wrote public/soundtrack_nongkhai.wav", {"hero": round(hero[0], 2), "race": round(race[0], 2)})
