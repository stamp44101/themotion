"""Loei soundtrack: an Isan palette (the khaen's chords, the phin, wooden bars, a klong and ching) under a small sound for
everything that appears or moves: the strip woven into the Phi Ta Khon's basket ticking, the nose carved, the brush, then
the ghost's bells as it dances; the two columns' feet and a gong as the stupa's lantern goes on; ox bells and hooves down
the valley; Ban Hae's posts knocked in, the pillar thumped upright and the smiths' bellows and hammers; the wax procession's
feet and a temple bell; the climbers' steps up Phu Kradueng and the wind on the rim; the town's pops and traffic; Bun Luang's
bells, wooden clappers, khaen and crowd, fireworks at the end. All code (no generated audio); kept under ~2.4 kHz.

Run:  npm run audio:loei
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_loei.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_loei.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, oath, frontier, loei, wax, kradueng, grow, fest, today = (
    B("hero"), B("oath"), B("frontier"), B("loei"), B("wax"), B("kradueng"), B("grow"), B("fest"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 3.0  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the mask's making (src/cities/loei/hero.tsx MASK)
ring_at = lambda k: -1 if k < 4 else 0.05 + ((k - 4) / 4) * 0.85

# ---------------------------------------------------------------- score (A minor pentatonic, lai yai feel, 100 bpm)
BEAT = 60 / 100
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, Dm, Em = [45, 52, 57, 60], [48, 55, 60, 64], [43, 50, 55, 59], [50, 57, 62, 65], [52, 59, 64, 67]
sections = (
    (0.0, oath[0], Am, 1.0),
    (oath[0], frontier[0], C, 1.0),
    (frontier[0], loei[0], G, 0.95),
    (loei[0], wax[0], Am, 0.95),
    (wax[0], kradueng[0], Dm, 0.95),
    (kradueng[0], grow[0], Em, 0.95),
    (grow[0], fest[0], C, 1.0),
    (fest[0], DUR, [45, 52, 57, 60, 64], 1.05),
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
klong(oath[0], oath[1], 0.11)
phin_line(oath[0] + 0.4, oath[1], 0.05)
wood_line(frontier[0], frontier[1], 0.08, prob=0.55)
phin_line(loei[0], loei[1], 0.07)
klong(loei[0] + 0.5, loei[1], 0.06)
wood_line(wax[0], wax[1], 0.08, prob=0.5)
phin_line(kradueng[0], kradueng[1], 0.06)
wood_line(grow[0], grow[1], 0.11, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
wood_line(fest[0], DUR - 3.0, 0.13, prob=0.85)
phin_line(fest[0], DUR - 3.0, 0.06)
klong(fest[0] + 0.2, DUR - 3.0, 0.12)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.45)
    t += rng.exponential(1.0)
TT = np.arange(N) / SR
# the Man's water in the valley beats; the hill wind on the cover, at Loei and on Phu Kradueng's rim; the town bed from the 1960s
on = lambda a, b, f=1.2: np.clip((TT - a) / f, 0, 1) * (1 - np.clip((TT - b) / f, 0, 1))
river_on = on(oath[0], loei[0]) + on(wax[0], kradueng[0]) + 0.15
add(amb, filt(pink(N), "band", (120, 600)) * river_on * 0.08, 0)
wind_on = on(-1, oath[0]) + on(loei[0], wax[0]) * 0.6 + on(kradueng[0], grow[0]) * 1.2
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * wind_on * 0.1, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1960) / 60, 0, 1) * 0.15, 0)


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
    """a dry wooden clack with a low body (the basket's strip pulled tight)"""
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


add(amb, frogs(frontier[1] - frontier[0] + 1.0), frontier[0], pan=-0.3, gain=0.8)


def cowbell(gain=1.0):
    """a wooden ox bell (โกร่ง): a hollow knock"""
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 330 * t) + 0.5 * np.sin(2 * np.pi * 540 * t)) * np.exp(-t * 14) * 0.3 * gain


def jingle(dur, gain=1.0):
    """the Phi Ta Khon's waist bells shaken as it dances (soft, low-passed)"""
    out = np.zeros(int(dur * SR))
    t = 0.0
    while t < dur - 0.2:
        b = filt(bell(rng.uniform(900, 1400), 0.25, decay=0.2), "low", 2200) * 0.25
        k = int(t * SR)
        out[k : k + len(b)] += b[: len(out) - k]
        t += rng.uniform(0.04, 0.11)
    return out * gain


# the cover: a tick for each turn of the strip woven into the basket, the nose carved out, the brush, the bells
for k in range(8):
    s = ring_at(k)
    if s >= 0:
        for j in range(4):
            add(sfx, tick(0.8), max(0.0, s - 0.2 + j * 0.05), pan=rng.uniform(-0.3, 0.3))
        add(sfx, beater(0.6), s, pan=0.0)
add(sfx, beater(0.7), 0.0, pan=0.0)
add(sfx, scrape(1.0, 1.2), 0.45, pan=0.1)  # the nose carved out
add(sfx, scrape(1.4, 0.8), 0.9, pan=-0.2)  # the brush
add(sfx, jingle(1.4, 1.0), 2.3, pan=0.0)
add(sfx, gong(82, 2.6, 0.22), 2.2, pan=0.0)
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.3, pan=0.0, gain=0.4)  # the giant shrinks away
# oath: two columns' feet and voices, the bricks set, a gong and bell as the lantern goes on
t = oath[0] + 0.3
while t < at(oath, 0.55):
    add(sfx, footstep(0.4), t, pan=rng.uniform(-0.5, 0.5))
    t += 0.26
add(sfx, babble(at(oath, 0.6) - oath[0], 0.8), oath[0] + 0.2, pan=-0.1, gain=0.22)
for k in range(11):
    add(sfx, thud(0.3, rng.uniform(90, 130)), at(oath, 0.18 + 0.065 * k), pan=rng.uniform(-0.3, 0.3))
add(sfx, gong(98, 3.0, 0.3), at(oath, 0.92), pan=0.0)
add(sfx, filt(bell(523, 2.2, decay=2.0), "low", 2300), at(oath, 0.93), pan=0.1, gain=0.14)
# frontier: ox bells and hooves down the valley; posts knocked in as the town fills
t = frontier[0] + 0.3
while t < frontier[1] - 0.3:
    add(sfx, cowbell(0.6), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, footstep(0.4), t + 0.15, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.4, 0.6)
for k in range(8):
    add(sfx, thud(0.25, rng.uniform(90, 130)), at(frontier, 0.3 + 0.07 * k), pan=rng.uniform(-0.5, 0.5))
# loei: posts for Ban Hae's houses, the pillar's bearers and thump, the smiths' hammers and bellows
for k in range(13):
    add(sfx, thud(0.3, rng.uniform(90, 140)), at(loei, 0.05 + 0.035 * k), pan=rng.uniform(-0.4, 0.4))
t = at(loei, 0.2)
while t < at(loei, 0.6):
    add(sfx, footstep(0.35), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.3
add(sfx, thud(0.8, 70), at(loei, 0.8), pan=0.0)
add(sfx, gong(92, 2.8, 0.28), at(loei, 0.82), pan=0.0)
t = at(loei, 0.3)
while t < loei[1]:
    add(sfx, filt(clink(), "low", 2200), t, pan=0.4, gain=0.35)
    t += rng.uniform(0.35, 0.55)
n = int((loei[1] - at(loei, 0.2)) * SR)
add(sfx, filt(pink(n), "low", 300) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.6 * np.arange(n) / SR)) ** 2 * 0.25, at(loei, 0.2), pan=0.4)
# wax: the procession's feet and voices, a temple bell at the stupa
t = wax[0] + 0.2
while t < wax[1] - 0.3:
    add(sfx, footstep(0.35), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.3
add(sfx, babble(wax[1] - wax[0] - 0.5, 0.7), wax[0] + 0.3, pan=0.1, gain=0.2)
add(sfx, filt(bell(440, 2.4, decay=2.0), "low", 2300), at(wax, 0.85), pan=0.0, gain=0.16)
# kradueng: the climbers' steps and breath-like wind, a bell as they reach the rim
t = kradueng[0] + 0.3
while t < kradueng[1] - 0.3:
    add(sfx, footstep(0.4), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.34
add(sfx, filt(whoosh(1.6, 0.5), "low", 1200), at(kradueng, 0.5), pan=0.2, gain=0.4)
add(sfx, filt(bell(392, 2.4, decay=1.6), "low", 2300), at(kradueng, 0.85), pan=0.0, gain=0.14)
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# fest: the ghosts' bells and wooden clappers, the crowd, feet in the parade
add(sfx, jingle(today[1] - fest[0], 0.5), fest[0], pan=0.2)
add(sfx, babble(today[1] - fest[0], 1.2), fest[0], pan=0.2, gain=0.3)
add(sfx, crowd(today[1] - fest[0]), fest[0] + 0.3, pan=-0.2, gain=0.18)
t = fest[0] + 0.5
while t < today[1]:
    add(sfx, footstep(0.25), t, pan=rng.uniform(-0.5, 0.5))
    add(sfx, tick(0.5), t + BEAT / 2, pan=rng.uniform(-0.5, 0.5))
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


order = [oath, frontier, loei, wax, kradueng, grow, fest]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.4
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_loei.wav", music, amb, sfx)
print("wrote public/soundtrack_loei.wav", {"hero": round(hero[0], 2), "fest": round(fest[0], 2)})
