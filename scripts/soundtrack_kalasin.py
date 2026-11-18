"""Kalasin soundtrack: an Isan palette (the khaen's chords, the phin's plucked lines, the pong lang's wooden logs played
as ranat bars, a klong and ching) under a small sound for everything that appears or moves: the loom's beater thud and
the shuttle's swish for every row of the cover's Phrae Wa; ox carts creaking and voices as the settlers come down the
khlong; the procession's drums and the pillar thumped upright at Kut Nam Kin; the builders' hammers and a temple bell; the
bank's rumble and splash, the bearers' feet; earth tipped on the dam, trucks, the reservoir rising; brushes scraping and
a bell as the bones show; the town's pops and traffic; the fair's pong lang bands, khaen and crowd, fireworks at the end.
All code (no generated audio); kept under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/kalasin/timeline.ts out/timeline_kalasin.json
      python3 scripts/soundtrack_kalasin.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_kalasin.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_kalasin.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, settle, found, temples, bank, dam, dino, grow, fair, today = (
    B("hero"), B("settle"), B("found"), B("temples"), B("bank"), B("dam"), B("dino"), B("grow"), B("fair"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.2  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the loom's rows (src/cities/kalasin/actors.ts rowAt)
ROWS, WEAVE_END = 20, 2.0
row_at = lambda k: -1 if k < ROWS / 2 else ((k - ROWS / 2 + 1) / (ROWS / 2)) * WEAVE_END

# ---------------------------------------------------------------- score (A minor pentatonic, lai yai feel, 100 bpm)
BEAT = 60 / 100
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, Dm, Em = [45, 52, 57, 60], [48, 55, 60, 64], [43, 50, 55, 59], [50, 57, 62, 65], [52, 59, 64, 67]
sections = (
    (0.0, settle[0], Am, 1.0),
    (settle[0], found[0], Am, 1.0),
    (found[0], temples[0], C, 1.0),
    (temples[0], bank[0], G, 0.9),
    (bank[0], dam[0], Dm, 0.9),
    (dam[0], dino[0], Em, 0.95),
    (dino[0], grow[0], Am, 0.95),
    (grow[0], fair[0], C, 1.0),
    (fair[0], DUR, [45, 52, 57, 60, 64], 1.05),
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
wood_line(temples[0], temples[1], 0.09, prob=0.6)
phin_line(bank[0], bank[1], 0.06)
phin_line(dam[0], dam[1], 0.06)
klong(dam[0] + 0.6, dam[1], 0.06)
wood_line(dino[0], dino[1], 0.08, prob=0.55)
wood_line(grow[0], grow[1], 0.11, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
wood_line(fair[0], DUR - 3.0, 0.13, prob=0.85)
phin_line(fair[0], DUR - 3.0, 0.06)
klong(fair[0] + 0.2, DUR - 3.0, 0.11)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(1.0)
TT = np.arange(N) / SR
# the khlong's water through the old town's beats; the open paddy wind; the dam's water; the town bed from the 1950s
khlong_on = np.clip((TT - settle[0]) / 1.5, 0, 1) * (1 - np.clip((TT - dam[0]) / 1.5, 0, 1)) + 0.2
add(amb, filt(pink(N), "band", (120, 600)) * khlong_on * 0.08, 0)
wind_on = 1 - np.clip((TT - settle[0]) / 2.0, 0, 1) + np.clip((TT - dino[0]) / 1.5, 0, 1) * (1 - np.clip((TT - grow[0]) / 1.5, 0, 1))
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * wind_on * 0.1, 0)
water_on = np.clip((TT - at(dam, 0.45)) / 1.0, 0, 1) * (1 - np.clip((TT - dino[0]) / 1.2, 0, 1))
add(amb, filt(pink(N), "band", (150, 900)) * water_on * 0.16, 0)
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
add(amb, frogs(bank[1] - temples[0]), temples[0], pan=0.3, gain=0.7)


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


# the cover: a beater thud and a shuttle swish for each row woven from frame 0
for k in range(ROWS):
    s = row_at(k)
    if s >= 0:
        add(sfx, beater(1.0), s, pan=rng.uniform(-0.2, 0.2))
        add(sfx, filt(whoosh(0.18, 0.4), "low", 1600), max(0.0, s - 0.12), pan=(-0.4 if k % 2 else 0.4), gain=0.35)
add(sfx, beater(0.8), 0.0, pan=0.0)
add(sfx, gong(82, 2.6, 0.22), WEAVE_END + 0.1, pan=0.0)
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.3, pan=0.0, gain=0.4)  # the loom folds away
# settle: ox carts creaking, hooves, voices; posts knocked in as the houses go up
t = settle[0] + 0.3
while t < settle[1] - 0.3:
    add(sfx, creak(0.4) * 0.4, t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, footstep(0.5), t + 0.15, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.45, 0.65)
add(sfx, babble(settle[1] - settle[0] - 0.5, 0.9), settle[0] + 0.4, pan=-0.1, gain=0.3)
for k in range(7):
    add(sfx, thud(0.3, rng.uniform(90, 130)), at(settle, 0.5 + 0.06 * k), pan=rng.uniform(-0.4, 0.4))
# found: the procession's drums and feet, a gong as the pillar stands
t = found[0] + 0.2
while t < at(found, 0.6):
    add(sfx, footstep(0.35), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.3
add(sfx, babble(at(found, 0.6) - found[0], 0.8), found[0] + 0.2, pan=0.1, gain=0.22)
add(sfx, thud(0.8, 70), at(found, 0.78), pan=0.0)
add(sfx, gong(98, 3.2, 0.3), at(found, 0.8), pan=0.0)
add(sfx, crowd(2.0), at(found, 0.82), pan=0.1, gain=0.3)
# temples: the builders' hammers and adzes, a bell as each sim's roof goes on
t = at(temples, 0.05)
while t < at(temples, 0.85):
    add(sfx, thud(0.3, rng.uniform(90, 140)), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, tick(0.5), t + 0.05, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.2, 0.3)
for j in range(3):
    add(sfx, filt(bell(440 + 55 * j, 2.2, decay=2.0), "low", 2300), at(temples, 0.3 + j * 0.22), pan=-0.2 + 0.2 * j, gain=0.14)
# the bank: a rumble, the slump's splash, voices; the bearers' feet up to the shrine
add(sfx, rumble(1.6, 0.8), at(bank, 0.1), pan=-0.2)
for k in range(3):
    add(sfx, splash() * 0.5, at(bank, 0.25 + 0.06 * k), pan=-0.3 + 0.2 * k)
add(sfx, babble(1.6, 1.4), at(bank, 0.3), pan=0.2, gain=0.3)
t = at(bank, 0.42)
while t < at(bank, 0.82):
    add(sfx, footstep(0.4), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.28
add(sfx, gong(92, 2.6, 0.25), at(bank, 0.85), pan=0.0)
# the dam: earth tipped from trucks, engines, then the water rising behind the crest
for k in range(10):
    add(sfx, thud(0.35, rng.uniform(60, 90)), at(dam, 0.05 + 0.05 * k), pan=rng.uniform(-0.4, 0.4))
n = int((at(dam, 0.6) - dam[0]) * SR)
add(sfx, filt(pink(n), "low", 220) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * np.arange(n) / SR)) * env_ar(n, 0.4, 0.6) * 0.35, dam[0], pan=0.2)
add(sfx, filt(whoosh(2.4, 0.8), "low", 1200), at(dam, 0.45), pan=0.0, gain=0.5)
add(sfx, gong(78, 3.0, 0.25), at(dam, 0.6), pan=0.0)
# the dinosaur: the abbot's steps, a bell as he sees the bone, the diggers' brushes and picks, a low wonder
add(sfx, filt(bell(392, 2.6, decay=1.6), "low", 2300), at(dino, 0.15), pan=0.0, gain=0.16)
t = at(dino, 0.35)
while t < at(dino, 0.9):
    add(sfx, scrape(rng.uniform(0.15, 0.3)), t, pan=rng.uniform(-0.5, 0.5))
    if rng.random() < 0.4:
        add(sfx, tick(0.6), t + 0.1, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.18, 0.3)
add(sfx, gong(66, 3.6, 0.3), at(dino, 0.75), pan=0.0)
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# the fair: the crowd, the dancers' feet, the shawl's frame going up
add(sfx, babble(today[1] - fair[0], 1.2), fair[0], pan=0.2, gain=0.3)
add(sfx, crowd(today[1] - fair[0]), fair[0] + 0.3, pan=-0.2, gain=0.18)
add(sfx, filt(whoosh(0.6, 0.4), "low", 1500), fair[0] + 0.2, pan=0.0, gain=0.4)
t = fair[0] + 0.5
while t < today[1]:
    add(sfx, footstep(0.25), t, pan=rng.uniform(-0.5, 0.5))
    t += BEAT


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


order = [settle, found, temples, bank, dam, dino, grow, fair]
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
mix = master("public/soundtrack_kalasin.wav", music, amb, sfx)
print("wrote public/soundtrack_kalasin.wav", {"hero": round(hero[0], 2), "fair": round(fair[0], 2)})
