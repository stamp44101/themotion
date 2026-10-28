"""Suphanburi soundtrack: a central-Thai palette (the ranat played soft, the ขลุ่ย flute, the gong
circle, the war drums of the ยุทธหัตถี) under a small sound for everything that moves or appears: the
charge and the clash of the two war elephants and the stupa rising, the builders round Luang Pho To,
the oars of the royal boats, the diggers at Don Chedi, the mail boats' engines and the market, the
buses through the gate, the town, and the fair at Don Chedi with the re-enactment. All code; kept
under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/suphanburi/timeline.ts out/timeline_suphanburi.json
      python3 scripts/soundtrack_suphanburi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402
import elephant_voices as ev  # noqa: E402

synth.init(json.load(open("out/timeline_suphanburi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_suphanburi.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, pl, royal, boats, road, grow, pay, today = (
    B("hero"), B("palelai"), B("royal"), B("boats"), B("road"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (D pentatonic, 88 bpm)
BEAT = 60 / 88
PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]
D, G, A, Bm, Em = [50, 57, 62], [43, 50, 55], [45, 52, 57], [47, 54, 59], [40, 47, 52]

sections = (
    (0.0, pl[0], [38, 50, 57, 62], 1.0),
    (pl[0], royal[1], G, 0.85),
    (royal[1], boats[0], Em, 0.8),
    (boats[0], grow[0], D, 0.85),
    (grow[0], pay[0], A, 0.9),
    (pay[0], DUR, [38, 50, 57, 62, 66], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, 1200), t0, gain=0.26 * lvl)


def soft_ranat(m, dur=0.9):
    """the ranat, played with soft mallets: rounded off at 2.4 kHz"""
    return filt(ranat(m, dur), "low", 2400, order=4)


def ranat_run(t0, t1, step, amp, prob=1.0, low=1, high=8):
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), low, high))
            add(music, soft_ranat(PENTA[i]), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
            add(music, soft_ranat(PENTA[i] - 12), t, pan=rng.uniform(-0.4, 0.4), gain=amp * 0.35)
        t += step


def flute(t0, t1, amp, pan=0.2, start=5):
    i = start
    t = t0
    while t < t1 - 0.4:
        i = int(np.clip(i + rng.choice([-1, -1, 0, 1, 1]), 1, len(PENTA) - 2))
        d = BEAT * rng.choice([1, 1, 2, 3])
        add(music, filt(khlui(PENTA[i], d), "low", 2400), t, pan=pan, gain=amp)
        t += d


# the war drums under the cover, then the flute and ranat for the town
for t in np.arange(0.0, hero[1] - 0.5, BEAT / 2):
    add(music, drum(70, 48, 0.5, 0.9), t, pan=-0.1, gain=0.32 if int(t / (BEAT / 2)) % 2 == 0 else 0.18)
flute(3.4, hero[1] + 0.3, 0.2, start=6)
ranat_run(pl[0], royal[1], BEAT / 2, 0.15, prob=0.75)
flute(royal[0] + 0.3, royal[1], 0.15, pan=-0.2)
ranat_run(boats[0], grow[1], BEAT / 2, 0.14, prob=0.75)
flute(pay[0] + 0.4, DUR - 3.0, 0.2, start=5)
ranat_run(pay[0] + 2.0, DUR - 3.0, BEAT, 0.12, prob=0.6)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
add(amb, filt(pink(N), "band", (150, 700)) * 0.25, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.1 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.7)
river = filt(pink(N), "band", (90, 500)) * (0.6 + 0.4 * filt(noise(N), "low", 0.4) * 4)
add(amb, river * 0.25, 0, pan=0.2)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1960) / 50, 0, 1) * 0.17, 0)

# ---------------------------------------------------------------- the small sounds


def blip(f=None, gain=1.0):
    """something going up: a soft, round wooden 'tok' with a falling pitch"""
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


def steps(t0, t1, every, gain, pan=0.0):
    t = t0
    while t < t1:
        add(sfx, filt(footstep(gain), "low", 900), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.2, 0.2))
        t += every * rng.uniform(0.85, 1.15)


def oar(gain=1.0):
    """an oar dipping and pulling: a soft low plunge and a wash"""
    n = int(0.36 * SR)
    t = np.arange(n) / SR
    plunge = filt(noise(n), "band", (160, 900)) * np.exp(-t * 12)
    body = np.sin(2 * np.pi * np.cumsum(130 * np.exp(-t * 6)) / SR) * np.exp(-t * 20) * 0.4
    return (plunge + body) * 0.5 * gain


def swirl(dur, gain):
    """the whirlpool: a slow, low turning wash that swells and falls away"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = filt(pink(n), "band", (90, 900))
    turn = 0.6 + 0.4 * np.sin(2 * np.pi * 1.1 * t) ** 2
    return x * turn * env_ar(n, 0.05, dur * 0.5) * 0.7 * gain


def rise_tone(dur, gain):
    """the image rising: a soft swell of low voices and a glow, no sharp edge"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (48, 55, 60, 64, 67):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def hammer(gain=1.0):
    """a mallet on timber"""
    return filt(drum(rng.uniform(260, 380), 180, 0.12, 0.6), "low", 1800) * gain


def truck(dur=2.2, f=46):
    n = int(dur * SR)
    t = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.03 * np.sin(2 * np.pi * 0.5 * t))) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 16))
    return filt(x, "low", 1200, order=4) * env_ar(n, 0.5, 0.9) * 0.16




def heavy_steps(t0, t1, every, gain, pan=0.0, f=52):
    """an elephant's footfalls: low, heavy thuds"""
    t = t0
    while t < t1:
        add(sfx, drum(f + rng.uniform(-4, 4), 30, 0.5, 0.9), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.15, 0.15), gain=gain)
        t += every * rng.uniform(0.9, 1.1)


def clash_hit(t0, gain=1.0):
    """tusks and glaives meeting: a low thud, a wooden crack and a short metal ring, no hiss"""
    add(sfx, drum(64, 36, 0.9, 1.0), t0, pan=0.0, gain=1.0 * gain)
    add(sfx, filt(noise(int(0.25 * SR)), "band", (180, 1600)) * env_ar(int(0.25 * SR), 0.005, 0.2) * 0.9, t0, pan=0.0, gain=gain)
    add(sfx, filt(bell(392, 1.6), "low", 2400), t0 + 0.02, pan=0.1, gain=0.25 * gain)
    add(sfx, gong(88, 3.0, 0.45 * gain), t0 + 0.05, pan=0.0)


IMPACT = 0.55
# the cover: two charges from frame 0, the trumpets, the clash, the dust, the stupa rising
heavy_steps(0.0, IMPACT + 0.2, 0.17, 0.8, pan=-0.45)
heavy_steps(0.05, IMPACT + 0.2, 0.18, 0.8, pan=0.45)
add(sfx, ev.trumpet(1.0), 0.0, pan=-0.4, gain=0.7)
add(sfx, ev.trumpet(0.9), 0.12, pan=0.4, gain=0.6)
clash_hit(IMPACT)
n = int(1.8 * SR)
add(sfx, filt(pink(n), "band", (100, 900)) * env_ar(n, 0.02, 1.4) * 0.8, IMPACT, pan=0.0)  # the dust
heavy_steps(IMPACT + 0.3, 2.6, 0.32, 0.6, pan=-0.1)
add(sfx, ev.rumble(1.0, 2.0), IMPACT + 0.4, pan=0.2, gain=0.6)
add(sfx, ev.trumpet(0.8), 1.8, pan=-0.2, gain=0.5)
add(sfx, rise_tone(2.6, 1.0), 2.4, pan=0.0)
add(sfx, gong(98, 3.0, 0.35), 4.2, pan=0.0)
add(sfx, babble(hero[1] - 4.0, 0.6), 3.8, pan=0.3, gain=0.3)
# the town filling again: a soft tok for each house as it goes up, across the whole beat
t = pl[0] + 0.3
while t < pl[1] - 0.2:
    add(sfx, blip(rng.uniform(260, 420), 0.45), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.09)
# Luang Pho To: mallets on the scaffold, a tok per course of the hall, voices, a temple bell
for _ in range(20):
    add(sfx, hammer(0.6), rng.uniform(pl[0] + 0.1, pl[1] - 0.2), pan=rng.uniform(-0.6, 0.6))
for i in range(16):
    add(sfx, blip(rng.uniform(240, 400), 0.65), at(pl, 0.12 + i * 0.045), pan=rng.uniform(-0.5, 0.5))
steps(pl[0] + 0.2, pl[1] - 0.2, 0.24, 0.45, pan=0.1)
add(sfx, babble(pl[1] - pl[0] - 0.6, 0.8), pl[0] + 0.3, pan=0.1, gain=0.35)
add(sfx, filt(bell(330, 2.5), "low", 2400), at(pl, 0.85), pan=0.2, gain=0.25)
# 2447: the royal boats: oars in time, a drum, ching, voices on the banks
t = royal[0] + 0.1
while t < royal[1] - 0.2:
    add(sfx, oar(0.75), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.42 * rng.uniform(0.9, 1.1)
for t in np.arange(royal[0] + 0.2, royal[1] - 0.2, BEAT):
    add(sfx, drum(96, 60, 0.3, 0.7), t, pan=-0.1, gain=0.35)
for k in range(4):
    add(sfx, filt(ching(), "low", 2400), at(royal, 0.1 + k * 0.25), pan=0.3, gain=0.35)
add(sfx, babble(royal[1] - royal[0], 0.8), royal[0], pan=0.2, gain=0.4)
add(sfx, gong(110, 2.6, 0.3), at(royal, 0.9), pan=0.0)
# the mail boats: low engine thrum passing, a bell at the landing, the market
def boat_engine(dur=2.6, f=38):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    ph = 2 * np.pi * np.cumsum(f * (1 + 0.02 * np.sin(2 * np.pi * 0.6 * tt))) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 14))
    return filt(x, "low", 1000, order=4) * env_ar(n, 0.6, 1.0) * 0.16


for i in range(4):
    add(sfx, boat_engine(), at(boats, 0.02 + i * 0.22), pan=rng.uniform(-0.4, 0.4), gain=0.9)
for k in range(3):
    add(sfx, filt(bell(523, 1.4), "low", 2400), at(boats, 0.2 + k * 0.3), pan=0.3, gain=0.15)
add(sfx, crowd(boats[1] - boats[0]), boats[0], pan=0.2, gain=0.22)
add(sfx, babble(boats[1] - boats[0] - 0.4, 1.0), boats[0] + 0.2, pan=-0.2, gain=0.4)
# the road: engines and a horn as the buses come through the gate
for i in range(5):
    add(sfx, truck(2.0, 44 + i * 3), at(road, 0.04 + i * 0.17), pan=rng.uniform(-0.3, 0.3), gain=0.85)
add(sfx, filt(bell(440, 0.6, ratios=(1, 1.5)), "low", 2000), at(road, 0.5), pan=0.2, gain=0.2)
add(sfx, babble(road[1] - road[0] - 0.4, 0.7), road[0] + 0.2, pan=-0.2, gain=0.3)
# the town spreading: a pop per block, the tower and the dragon
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
# the payoff: the fair: the crowd, the drums, two charges in the re-enactment, a gong at the end
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.32)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.5)
for t in np.arange(pay[0] + 0.2, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(80, 52, 0.4, 0.9), t, pan=-0.2, gain=0.3)
span = (pay[1] - pay[0]) * 0.9
for c in range(2):
    c0 = pay[0] + c * span / 2
    heavy_steps(c0, c0 + span / 2 * 0.45, 0.22, 0.6, pan=-0.4)
    heavy_steps(c0 + 0.05, c0 + span / 2 * 0.45, 0.23, 0.6, pan=0.4)
    clash_hit(c0 + span / 2 * 0.45, gain=0.7)
    add(sfx, crowd(1.6), c0 + span / 2 * 0.47, pan=0.0, gain=0.35)
add(sfx, ev.trumpet(0.9), pay[0] + 0.4, pan=-0.3, gain=0.5)
add(sfx, gong(98, 3.0, 0.4), at(pay, 0.92), pan=0.0)
for k in range(4):
    add(sfx, filt(ching(), "low", 2400), at(pay, 0.1 + k * 0.22), pan=0.3, gain=0.3)

# ---------------------------------------------------------------- the gaps between beats


def bridge(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(96, 58, 0.25, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [hero, pl, royal, boats, road, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)

# finale: lanterns rising -- soft low gongs
for i in range(5):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.2 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.9
mix = master("public/soundtrack_suphanburi.wav", music, amb, sfx)
print("wrote public/soundtrack_suphanburi.wav", {"royal": round(royal[0], 2), "payoff": round(pay[0], 2)})
