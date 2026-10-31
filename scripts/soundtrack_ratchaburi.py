"""Ratchaburi soundtrack: a central-Thai palette (the ranat, the khong wong's gongs, the khlui, ching on
the beat), a northern pluck for the Thai Yuan coming down from Chiang Saen and a Chinese gong for the
kilns, under a small sound for everything that moves or appears: the jar thrown on its wheel at legend
scale and the dragon coiling up it, the Thai Yuan's carts and looms on the road south, the wall of 2360
going up brick by brick and the ferries over the Mae Klong, the Koi Ki rows going up, the first train
over the black bridge, the kilns firing and the jar boats going downriver, the town filling both banks,
and the jar fountain at night with Koi Ki's walking street. All code; kept under ~2.4 kHz (the owner
dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/ratchaburi/timeline.ts out/timeline_ratchaburi.json
      python3 scripts/soundtrack_ratchaburi.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_ratchaburi.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_ratchaburi.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, yuan, wall, koiki, train, kiln, jars, grow, pay, today = (
    B("hero"), B("yuan"), B("wall"), B("koiki"), B("train"), B("kiln"), B("jars"), B("growth"), B("payoff"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.7  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below

# ---------------------------------------------------------------- score (A minor pentatonic, 84 bpm)
BEAT = 60 / 84
PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76]
Am, F, C, G, Dm = [45, 52, 57], [41, 48, 53], [48, 55, 60], [43, 50, 55], [50, 57, 62]

sections = (
    (0.0, yuan[0], [45, 52, 57, 64], 1.0),
    (yuan[0], wall[0], Dm, 0.85),
    (wall[0], koiki[0], Am, 0.9),
    (koiki[0], kiln[0], C, 0.85),
    (kiln[0], grow[0], F, 0.9),
    (grow[0], pay[0], G, 0.9),
    (pay[0], DUR, [45, 52, 57, 60, 64], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1700), t0, gain=0.22 * lvl)


def ranat_run(t0, t1, amp, step=BEAT / 2, prob=0.85):
    """the ranat ek, soft mallets wandering the pentatonic, rounded at 2.4 kHz"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.6), "low", 2400), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def sueng(t0, t1, amp):
    """a northern plucked lute for the Thai Yuan: slow, open intervals"""
    t = t0
    i = 3
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, 1, 2]), 0, len(PENTA) - 1))
        add(music, filt(pluck(PENTA[i] - 12, 1.6, 0.8), "low", 2200), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += BEAT * rng.choice([1, 1, 2])


def khong(t0, t1, amp):
    t = t0
    i = 2
    while t < t1:
        i = int(np.clip(i + rng.choice([-1, 1, 2, -2]), 0, len(PENTA) - 1))
        add(music, filt(bell(mtof(PENTA[i] - 12), 1.2, decay=2.4), "low", 2000), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += BEAT * rng.choice([1, 1, 2])


def chings(t0, t1, gain):
    for t in np.arange(t0, t1, BEAT):
        add(sfx, filt(ching(), "low", 2400), t, pan=-0.15, gain=gain)


ranat_run(2.2, hero[1], 0.12, prob=0.55)
sueng(yuan[0], yuan[1], 0.16)
khong(wall[0], wall[1], 0.1)
ranat_run(koiki[0], train[1], 0.13)
khong(kiln[0], jars[1], 0.09)
add(music, filt(khlui(69, 3.2), "low", 2200), jars[0] + 0.4, pan=0.2, gain=0.2)
add(music, filt(khlui(72, 2.6), "low", 2200), jars[0] + 3.0, pan=0.2, gain=0.18)
ranat_run(grow[0], grow[1], 0.12, prob=0.7)
ranat_run(pay[0] + 0.3, DUR - 3.0, 0.15)
khong(pay[0] + 1.0, DUR - 3.0, 0.1)

# ---------------------------------------------------------------- ambience (8-12 dB under the score)
# the Mae Klong runs under the whole clip; birds while the land is open, the town bed as it fills
add(amb, filt(pink(N), "band", (150, 700)) * 0.25, 0, pan=-0.3)
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.1 if Y[i] < 1950 else 0.45)
    t += rng.exponential(0.7)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 50, 0, 1) * 0.17, 0)

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


def wheel_hum(dur, gain):
    """the potter's wheel turning: a low, wobbling hum with the wet hiss of clay under the hands"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 62 * (1 + 0.05 * np.sin(2 * np.pi * 2.6 * t))
    hum = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.4 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    wet = filt(noise(n), "band", (300, 1200)) * (0.5 + 0.5 * np.sin(2 * np.pi * 2.6 * t)) * 0.3
    return filt(hum * 0.5 + wet, "low", 1500) * env_ar(n, 0.05, 0.6) * gain


def slap(gain=1.0):
    """wet clay slapped and pressed"""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (180, 900)) * np.exp(-t * 40) * 0.9 * gain


def kiln_roar(dur, gain):
    """the kiln's fire taking: a soft, deep breathing roar"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = filt(pink(n), "band", (40, 500)) * (0.8 + 0.2 * np.sin(2 * np.pi * 1.3 * t))
    return x * env_ar(n, dur * 0.3, dur * 0.4) * gain


def rise_tone(dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in (45, 52, 57, 60, 64):
        f = mtof(m) * (1 + 0.004 * np.sin(2 * np.pi * 4.5 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        out += np.sin(ph) + 0.3 * np.sin(2 * ph)
    return filt(out, "low", 1600) * env_ar(n, dur * 0.6, dur * 0.35) * 0.08 * gain


def brick(gain=1.0):
    return filt(drum(rng.uniform(110, 160), 70, 0.14, 0.6), "low", 1400) * gain


def paddle(gain=1.0):
    return splash() * 0.35 * gain


def water(dur, gain):
    """the fountain's spray falling into its basin"""
    n = int(dur * SR)
    return filt(pink(n), "band", (400, 2200)) * env_ar(n, 0.6, 0.8) * 0.4 * gain


# the cover: the wheel spins up, clay slapped as the jar bellies out, the dragon coils with a swell,
# the kiln's fire takes, then the jar goes down into the earth
add(sfx, wheel_hum(3.2, 0.9), 0.0, pan=0.0)
for k in range(6):
    add(sfx, slap(0.7), 0.05 + k * 0.2, pan=rng.uniform(-0.3, 0.3))
add(sfx, whoosh(1.2, 0.5), 0.7, pan=-0.2)
add(sfx, rise_tone(2.2, 1.1), 0.8, pan=0.0)
add(sfx, kiln_roar(2.6, 0.6), 1.5, pan=0.1)
add(sfx, gong(73, 4.0, 0.45), 2.2, pan=0.0)
add(sfx, filt(pink(int(1.8 * SR)), "low", 300) * env_ar(int(1.8 * SR), 0.6, 0.9) * 0.5, 4.6, pan=0.0)
add(sfx, whoosh(1.6, 0.4), 4.8, pan=0.1)
# 2347: the Thai Yuan on the road south: feet, cart wheels creaking, the looms' clack, voices
steps(yuan[0], yuan[1], 0.3, 0.4, pan=-0.2)
steps(yuan[0] + 0.15, yuan[1], 0.34, 0.35, pan=0.2)
for t in np.arange(yuan[0] + 0.3, yuan[1] - 0.2, 0.9):
    add(sfx, creak(0.5), t + rng.uniform(0, 0.2), pan=rng.uniform(-0.4, 0.4), gain=0.25)
for t in np.arange(yuan[0] + 0.6, yuan[1] - 0.4, 0.55):
    add(sfx, filt(drum(240, 180, 0.06, 0.4), "low", 1800), t, pan=0.3, gain=0.25)
add(sfx, babble(yuan[1] - yuan[0] - 0.4, 0.8), yuan[0] + 0.2, pan=-0.1, gain=0.3)
# 2360: bricks laid round the wall, mallets, the ferries' paddles, the pillar set with a gong
for _ in range(30):
    add(sfx, brick(0.6), rng.uniform(wall[0], at(wall, 0.8)), pan=rng.uniform(-0.6, 0.6), gain=0.6)
t = wall[0] + 0.2
while t < wall[1] - 0.1:
    add(sfx, paddle(1.0), t, pan=rng.uniform(-0.5, 0.0), gain=0.8)
    t += rng.uniform(0.4, 0.6)
add(sfx, babble(wall[1] - wall[0] - 0.5, 0.7), wall[0] + 0.3, pan=0.2, gain=0.25)
add(sfx, gong(73, 3.0, 0.4), at(wall, 0.6), pan=0.0)
chings(at(wall, 0.62), wall[1], 0.18)
# 2440: Koi Ki's rows going up one by one, the market's chatter, a boat bell at the landing
for k in range(12):
    add(sfx, blip(rng.uniform(260, 420), 0.6), at(koiki, 0.05 + k * 0.055), pan=-0.5 + k * 0.08)
add(sfx, babble(koiki[1] - koiki[0] - 0.6, 1.2), at(koiki, 0.3), pan=-0.2, gain=0.4)
add(sfx, crowd(koiki[1] - at(koiki, 0.4)), at(koiki, 0.4), pan=0.2, gain=0.2)
for k in range(5):
    add(sfx, clink(), at(koiki, 0.45 + k * 0.1), pan=rng.uniform(-0.4, 0.4), gain=0.3)
# 2446: the first train over the black bridge: the deck's iron rumble under the chuffs
t = train[0] + 0.2
while t < train[1] - 0.3:
    add(sfx, filt(chuff(), "low", 1800), t, pan=0.3, gain=1.1)
    t += 0.2
add(sfx, filt(steam_whistle(1.4), "low", 2000), train[0] + 0.5, pan=0.3, gain=0.7)
n = int(1.8 * SR)
add(sfx, filt(pink(n), "band", (60, 400)) * env_ar(n, 0.3, 0.6) * 0.5, at(train, 0.3), pan=0.1)
add(sfx, filt(steam_whistle(1.0), "low", 2000), at(train, 0.8), pan=0.2, gain=0.5)
add(sfx, babble(train[1] - train[0] - 1, 1.0), at(train, 0.4), pan=-0.3, gain=0.35)
# 2476: the kilns: bricks, the fire taking in each kiln, jars set down with a hollow knock
for k in range(3):
    add(sfx, kiln_roar(2.4, 0.5), at(kiln, 0.1 + k * 0.18), pan=-0.4 + k * 0.4)
for k in range(10):
    add(sfx, brick(0.5), at(kiln, 0.03 + k * 0.05), pan=rng.uniform(-0.5, 0.5))
for k in range(14):
    add(sfx, filt(drum(rng.uniform(180, 260), 120, 0.25, 0.5), "low", 1600), at(kiln, 0.4 + k * 0.04), pan=rng.uniform(-0.6, 0.6), gain=0.45)
add(sfx, gong(98, 3.0, 0.35), at(kiln, 0.5), pan=0.0)
# 2484-2488: the jar boats going downriver, paddles and the boatmen's call
t = jars[0] + 0.2
while t < jars[1] - 0.1:
    add(sfx, paddle(1.0), t, pan=rng.uniform(-0.2, 0.5), gain=0.9)
    t += rng.uniform(0.35, 0.5)
add(sfx, creak(0.6), at(jars, 0.3), pan=0.2, gain=0.3)
add(sfx, creak(0.6), at(jars, 0.7), pan=-0.1, gain=0.3)
for k in range(6):
    add(sfx, filt(drum(rng.uniform(180, 240), 120, 0.25, 0.5), "low", 1600), at(jars, 0.1 + k * 0.12), pan=rng.uniform(-0.5, 0.5), gain=0.35)
# the town filling both banks: a pop per block, traffic
for k in range(10):
    add(sfx, blip(rng.uniform(200, 300), 0.8), at(grow, 0.02 + k * 0.04), pan=rng.uniform(-0.5, 0.5))
t = at(grow, 0.45)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.14)
add(sfx, filt(pink(int(5 * SR)), "low", 600) * env_ar(int(5 * SR), 1.5, 1.5) * 0.25, at(grow, 0.4), pan=0.3)
# the payoff: the fountain at night, the walking street's crowd and footsteps, drums and ching
add(sfx, water(today[1] - pay[0] + 0.4, 0.6), pay[0] + 0.2, pan=0.0)
add(sfx, crowd(today[1] - pay[0] + 0.5), pay[0], pan=0.2, gain=0.32)
add(sfx, babble(today[1] - pay[0], 1.1), pay[0] + 0.2, pan=0.3, gain=0.45)
add(sfx, rise_tone(2.0, 1.0), pay[0] + 0.2, pan=0.0)
for t in np.arange(pay[0] + 0.4, pay[1] - 0.2, BEAT / 2):
    add(sfx, drum(80, 52, 0.4, 0.9), t, pan=-0.2, gain=0.22)
chings(pay[0] + 0.4, pay[1] - 0.2, 0.22)
steps(pay[0] + 0.3, pay[1] - 0.3, 0.3, 0.3, pan=-0.3)
add(sfx, gong(73, 3.0, 0.4), at(pay, 0.92), pan=0.0)

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


order = [hero, yuan, wall, koiki, train, kiln, jars, grow, pay]
for a_, b_ in zip(order, order[1:]):
    bridge(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(73, 2.6, 0.2), b_[0], pan=0.05)

# finale: fireworks over the river -- soft low pops and gongs
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.35)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))

# the score carries the clip at a steady level, raised and left alone (owner, Nakhon Pathom)
music *= MUSIC_GAIN
amb *= 2.3
# meter the buses as master weights them: the score must sit 0 to +3 LU over the effects
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU")
mix = master("public/soundtrack_ratchaburi.wav", music, amb, sfx)
print("wrote public/soundtrack_ratchaburi.wav", {"wall": round(wall[0], 2), "payoff": round(pay[0], 2)})
