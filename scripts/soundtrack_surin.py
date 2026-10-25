"""Surin soundtrack: a กันตรึม-coloured palette (the Khmer-Surin band's frame drums, ฉิ่ง and a
rounded ปี่ reed), the แคน of the Lao villages, under a small sound for everything that moves
or appears: the herd's footfalls and calls, the diggers' hoes, the caravan's carts, the white
elephant's run and the lasso, the move from Ban Mueang Thi, the train, the parade, the buffet.
All code.

Run:  node scripts/export_timeline.mjs src/cities/surin/timeline.ts out/timeline_surin.json
      python3 scripts/soundtrack_surin.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_surin.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_surin.json")
Y = tl.YEAR
EV = tl.events
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
herd, moat, khmer, white, prathai, rail, show, grow, pay, today = (
    B("herd"), B("moat"), B("khmer"), B("white"), B("prathai"), B("railway"), B("show"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])

# ---------------------------------------------------------------- score (A minor pentatonic, 100 bpm)
BEAT = 60 / 100
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, C, G, Dm, E5 = [45, 52, 57], [48, 55, 60], [43, 50, 55], [50, 57, 62], [40, 47, 52]

add(music, pad([33, 40, 45], herd[1] + 0.8, 1100), 0.0, gain=0.3)
sections = (
    (herd[1] - 0.2, khmer[1], Am, 0.9),
    (khmer[1], prathai[0], Dm, 0.95),
    (prathai[0], rail[0], C, 1.0),
    (rail[0], grow[0], G, 0.95),
    (grow[0], pay[0], E5, 0.95),
    (pay[0], DUR, [33, 45, 52, 57, 60], 1.1),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, 1300), t0, gain=0.3 * lvl)
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        add(music, pluck(notes[1] + 12, 0.6, 0.6), t, pan=-0.2, gain=0.18 * lvl)


def reed(t0, t1, amp):
    """ปี่ phrases of the กันตรึม band, rounded off above 2.4 kHz (the owner dislikes harsh highs)"""
    i = 4
    t = t0
    while t < t1 - 0.4:
        i = int(np.clip(i + rng.choice([-1, -1, 0, 1, 1]), 1, len(PENTA) - 2))
        d = BEAT * rng.choice([1, 1, 2, 3])
        add(music, filt(pi_reed(PENTA[i], d), "low", 2400, order=4), t, pan=0.15, gain=amp)
        t += d


def skor(t0, t1, gain):
    """the frame drums: a low/high pair on the beat and off it"""
    for i, t in enumerate(np.arange(t0, t1, BEAT / 2)):
        add(sfx, drum(118 if i % 2 == 0 else 180, 64, 0.3, 0.7), t, pan=rng.uniform(-0.2, 0.2), gain=gain if i % 2 == 0 else gain * 0.5)
    for t in np.arange(t0, t1, BEAT * 2):
        add(sfx, filt(ching(), "low", 2400), t, pan=0.3, gain=gain * 1.1)


reed(khmer[0], khmer[1], 0.18)
add(music, filt(khaen([57, 64, 69], prathai[1] - prathai[0]), "low", 2400), prathai[0], pan=-0.2, gain=0.22)
reed(show[0], show[1], 0.2)
reed(pay[0], DUR - 2.5, 0.22)

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "band", (150, 700)) * 0.05, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2800), t, pan=rng.uniform(-0.8, 0.8), gain=1.4 if Y[i] < 1926 else 0.5)
    t += rng.exponential(0.55)
cr = np.sin(2 * np.pi * 4300 * T) * (np.sin(2 * np.pi * 27 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.6 * T) > 0.1).astype(float), "low", 40)
add(amb, filt(cr, "low", 3000) * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.03, 0, pan=-0.5)
add(amb, filt(pink(N), "low", 450) * 0.6 * np.clip((Y - 1960) / 50, 0, 1) * 0.06, 0)

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


def tread(t0, t1, every, gain, pan=0.0, f=60):
    """an elephant's footfall: a soft low thud"""
    t = t0
    while t < t1:
        add(sfx, drum(f + rng.uniform(-4, 4), 34, 0.35, 0.9), t + rng.uniform(-0.04, 0.04), pan=pan + rng.uniform(-0.2, 0.2), gain=gain)
        t += every * rng.uniform(0.85, 1.15)


def steps(t0, t1, every, gain, pan=0.0):
    t = t0
    while t < t1:
        add(sfx, filt(footstep(gain), "low", 900), t + rng.uniform(-0.03, 0.03), pan=pan + rng.uniform(-0.2, 0.2))
        t += every * rng.uniform(0.85, 1.15)


def call(t0, gain, pan=0.0):
    add(sfx, filt(trumpet_elephant(1.1), "low", 1800), t0, pan=pan, gain=gain)


def rumble(t0, dur, gain):
    n = int(dur * SR)
    add(sfx, filt(pink(n), "low", 160, order=4) * env_ar(n, dur * 0.3, dur * 0.5) * 0.9, t0, gain=gain)


# the cover: the herd's footfalls from the first frame, a low rumble, a call at 1.5 s; the
# iron-age village's furnaces crackling at the edge of the clearing
tread(0.05, herd[1], 0.42, 0.55, pan=-0.1)
rumble(0.0, 3.0, 0.5)
call(1.5, 0.55, pan=-0.2)
call(5.2, 0.3, pan=0.3)
add(sfx, crackle(herd[1] - 3.2), 3.2, pan=0.4, gain=0.25)
add(sfx, babble(herd[1] - 3.6, 0.5), 3.4, pan=0.4, gain=0.25)
# the moat: hoes and baskets all round the ring, earth thrown up
for _ in range(26):
    add(sfx, drum(rng.uniform(150, 240), 110, 0.12, 0.3), rng.uniform(moat[0] + 0.1, moat[1] - 0.2), pan=rng.uniform(-0.7, 0.7), gain=0.35)
for i in range(12):
    add(sfx, blip(rng.uniform(220, 320), 0.6), at(moat, 0.05 + i * 0.075), pan=rng.uniform(-0.5, 0.5))
add(sfx, babble(moat[1] - moat[0] - 0.6, 0.9), moat[0] + 0.3, pan=0.1, gain=0.4)
# the royal road: the caravan's elephants and carts, a call, the outer moat dug
tread(khmer[0] + 0.2, khmer[1] - 0.2, 0.5, 0.45, pan=-0.2)
for t in np.arange(khmer[0] + 0.3, khmer[1] - 0.2, 0.55):
    add(sfx, creak(0.4), t, pan=0.3, gain=0.3)
call(at(khmer, 0.3), 0.4, pan=-0.3)
for i in range(10):
    add(sfx, blip(rng.uniform(200, 280), 0.5), at(khmer, 0.15 + i * 0.07), pan=rng.uniform(-0.6, 0.6))
# 2302: the white elephant's run, the headmen after it, the nooses, its call as it is held
tread(white[0], at(white, 0.62), 0.24, 0.7, pan=-0.3, f=56)
tread(white[0] + 0.15, at(white, 0.7), 0.2, 0.45, pan=0.2, f=66)
rumble(white[0], at(white, 0.65) - white[0], 0.6)
for k in range(4):
    n = int(0.35 * SR)
    add(sfx, filt(pink(n), "band", (300, 1400)) * env_ar(n, 0.1, 0.25) * 0.35, at(white, 0.45 + k * 0.05), pan=rng.uniform(-0.4, 0.4))
call(at(white, 0.66), 0.7, pan=0.0)
add(sfx, babble(1.6, 1.2), at(white, 0.72), pan=0.2, gain=0.45)
# 2306: the column from Ban Mueang Thi: feet, carts, elephants, voices; the town going up
steps(prathai[0] + 0.2, at(prathai, 0.9), 0.22, 0.6, pan=0.3)
tread(prathai[0] + 0.3, at(prathai, 0.9), 0.55, 0.4, pan=0.2)
for t in np.arange(prathai[0] + 0.4, at(prathai, 0.9), 0.6):
    add(sfx, creak(0.4), t, pan=0.4, gain=0.25)
add(sfx, babble(prathai[1] - prathai[0] - 0.6, 1.0), prathai[0] + 0.3, pan=0.1, gain=0.45)
for i in range(24):
    add(sfx, blip(gain=0.6), at(prathai, 0.05 + i * 0.035), pan=rng.uniform(-0.6, 0.6))
# 2469: the steam train from the west; shophouses going up along ถนนธนสาร
trains = EV.get("trains", [])
if trains:
    s0 = trains[0]["t0"] + 0.1
    s1 = trains[0]["t0"] + trains[0]["dur"]
    t = s0
    while t < s1:
        p = (t - s0) / (s1 - s0)
        add(sfx, chuff(), t, pan=-0.6 + 1.2 * p, gain=0.8 - 0.3 * p)
        t += 0.2 + 0.14 * p
    add(sfx, filt(steam_whistle(), "low", 2400), s0 + 0.4, pan=-0.4, gain=0.8)
for i in range(14):
    add(sfx, blip(rng.uniform(260, 420), 0.6), at(rail, 0.15 + i * 0.05), pan=rng.uniform(-0.5, 0.5))
add(sfx, babble(2.0, 0.8), at(rail, 0.6), pan=0.2, gain=0.4)
# 2505: the parade into the show ground: drums, the crowd, the elephants' calls
skor(show[0] + 0.2, show[1], 0.24)
tread(show[0] + 0.2, show[1], 0.5, 0.4, pan=0.2)
add(sfx, crowd(show[1] - show[0]), show[0], pan=0.1, gain=0.24)
call(at(show, 0.4), 0.4, pan=0.3)
# the town spreading: a pop per block, the town's patter
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
# the payoff: the herd walks back to the buffet: footfalls, a call, the crowd, the band
tread(pay[0] + 0.1, at(pay, 0.5), 0.4, 0.55, pan=-0.2)
call(at(pay, 0.2), 0.55, pan=-0.2)
call(at(pay, 0.65), 0.35, pan=0.3)
skor(pay[0] + 0.3, today[1], 0.24)
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.26)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.6)
for k in range(12):
    add(sfx, filt(noise(int(0.08 * SR)), "band", (300, 1400)) * env_ar(int(0.08 * SR), 0.005, 0.07) * 0.25, at(pay, 0.5 + k * 0.035), pan=rng.uniform(-0.5, 0.5))

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


order = [herd, moat, khmer, white, prathai, rail, show, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(98, 2.6, 0.2), b_[0], pan=0.05)

# finale: lanterns rising -- soft low gongs
for i in range(5):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.2 + i * 0.7, pan=rng.uniform(-0.5, 0.5))

# the score sits under the small sounds (owner: the effects are the charm)
music *= 0.6
mix = master("public/soundtrack_surin.wav", music, amb, sfx)
print("wrote public/soundtrack_surin.wav", {"white": round(white[0], 2), "payoff": round(pay[0], 2)})
