"""Songkhla soundtrack: a southern palette (the nang talung band's thap drums, the mong gong pair and ching, the pi's
reedy line low and soft, wooden bars for the running tune) under a small sound for everything that appears or moves: the
mallet on the chisel for every strike as the cover's Ai Teng is cut from his hide, the scrap dropping, his arm swinging up
on a mong; the junks' creak and the swell at the channel, the port's hammers; war drums, the army's feet, cannon and fire
at Singora, the walls falling; barges and stone on the lake, the pillar's procession and gong; the porters and the junks'
holds; the track's clanks, the train's chuffs and whistle; the clay and a gong as the mermaid turns gold; the town's pops
and traffic; the show's band and the crowd laughing, fireworks at the end. Ambience is a sequence of places (the open
spit's wind, the channel and the surf, the lake shore, the town). All code (no generated audio); kept under ~2.4 kHz.

Run:  node scripts/export_timeline.mjs src/cities/songkhla/timeline.ts out/timeline_songkhla.json
      python3 scripts/soundtrack_songkhla.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_songkhla.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_songkhla.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, port, siege, boyang, trade, train, mermaid, grow, show, today = (
    B("hero"), B("port"), B("siege"), B("boyang"), B("trade"), B("train"), B("mermaid"), B("grow"), B("show"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 3.3  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
CUT_END, STRIKE = 2.0, 0.14  # the cover's cut (src/cities/songkhla/Hero.tsx)

# ---------------------------------------------------------------- score (D minor pentatonic, 104 bpm, nang talung feel)
BEAT = 60 / 104
PENTA = [50, 53, 55, 57, 60, 62, 65, 67, 69]
Dm, F, C, G, Am = [38, 45, 50, 53], [41, 48, 53, 57], [36, 43, 48, 52], [43, 50, 55, 59], [45, 52, 57, 60]
sections = (
    (0.0, port[0], Dm, 0.9),
    (port[0], siege[0], Dm, 1.0),
    (siege[0], boyang[0], Am, 1.05),
    (boyang[0], trade[0], F, 1.0),
    (trade[0], train[0], C, 1.0),
    (train[0], mermaid[0], G, 0.95),
    (mermaid[0], grow[0], F, 0.95),
    (grow[0], show[0], C, 1.0),
    (show[0], DUR, [38, 45, 50, 53, 57], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1400), t0, gain=0.11 * lvl)


def bars(t0, t1, amp, step=BEAT / 2, prob=0.8):
    """the running tune on wooden bars"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.5), "low", 2200), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def pi_line(t0, t1, amp):
    """the pi, an octave down and filtered soft"""
    t = t0
    i = 3
    while t < t1 - 0.4:
        d = BEAT * rng.choice([1, 1, 2])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(pi_reed(PENTA[i] - 12, d * 0.95), "low", 1900), t, pan=0.2, gain=amp)
        t += d


def thap(t0, t1, gain):
    """the thap pair and the ching; the mong gong on the downbeat of each bar"""
    pat = [1.0, 0, 0.45, 0.6, 0.8, 0, 0.5, 0.35]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(150, 175) if k % 4 else 110, 70, 0.18, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 2 == 1:
            add(music, filt(ching(0.28), "low", 2300), t, pan=0.3, gain=gain * 0.4)
        if k % 8 == 0:
            add(music, gong(150 if (k // 8) % 2 else 110, 1.4, 0.35), t, pan=0.1, gain=gain * 0.8)
        t += BEAT / 2
        k += 1


pi_line(0.3, hero[1], 0.05)
bars(port[0], port[1], 0.07, prob=0.55)
thap(siege[0], siege[1], 0.14)
pi_line(siege[0] + 0.5, siege[1], 0.05)
bars(boyang[0], boyang[1], 0.08, prob=0.6)
thap(boyang[0] + 2.0, boyang[1], 0.07)
pi_line(trade[0], trade[1], 0.05)
bars(trade[0], trade[1], 0.07, prob=0.5)
bars(train[0], train[1], 0.06, step=BEAT / 4, prob=0.5)
pi_line(mermaid[0], mermaid[1], 0.06)
bars(grow[0], grow[1], 0.11, prob=0.75)
thap(grow[0] + 1.0, grow[1], 0.07)
thap(show[0], DUR - 3.0, 0.15)
bars(show[0], DUR - 3.0, 0.1, prob=0.8)
pi_line(show[0] + 0.4, DUR - 3.0, 0.06)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
TT = np.arange(N) / SR
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1900 else 0.4)
    t += rng.exponential(1.4)
# the open spit's wind under the cover; the swell at the channel and the surf on Samila; the lake shore lapping; the town
wind_on = 1 - np.clip((TT - port[0]) / 1.5, 0, 1)
add(amb, filt(pink(N), "band", (80, 400)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * TT)) * wind_on * 0.1, 0)
swell = 0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * TT) ** 2
sea_on = np.clip((TT - port[0]) / 1.0, 0, 1) * (1 - np.clip((TT - boyang[0]) / 1.0, 0, 1)) + np.clip((TT - mermaid[0]) / 1.0, 0, 1) * (1 - np.clip((TT - grow[0]) / 1.0, 0, 1)) + np.clip((TT - show[0]) / 1.0, 0, 1) * 0.7
add(amb, filt(pink(N), "band", (120, 900)) * swell * sea_on * 0.16, 0)
lake_on = np.clip((TT - boyang[0]) / 1.0, 0, 1) * (1 - np.clip((TT - train[0]) / 1.0, 0, 1))
add(amb, filt(pink(N), "band", (150, 700)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.4 * TT)) * lake_on * 0.08, 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1940) / 60, 0, 1) * 0.14, 0)


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


def chisel(gain=1.0):
    """the mallet on the chisel's head: a short wooden tok over the blade's bite into the hide"""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 210 * t) * np.exp(-t * 55) * 0.45 + filt(noise(n), "band", (700, 2100)) * np.exp(-t * 90) * 0.35) * gain


def rumble(dur, gain=1.0):
    n = int(dur * SR)
    return filt(pink(n), "low", 260) * env_ar(n, 0.3, 0.8) * 0.5 * gain


def cannon(gain=1.0):
    return (filt(drum(60, 30, 1.2, 1.0), "low", 500) + filt(pink(int(1.2 * SR)), "low", 300) * env_ar(int(1.2 * SR), 0.005, 1.0) * 0.4) * gain


def laugh(dur, gain=1.0):
    """the crowd laughing at the clowns: babble with a bouncing rhythm"""
    n = int(dur * SR)
    t = np.arange(n) / SR
    return babble(dur, 1.4) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 3.2 * t))) * gain


# the cover: one tok per mallet strike while the hide is cut, the scrap dropping, the arm swinging up on a mong
k = 0
while k * STRIKE < CUT_END:
    add(sfx, chisel(1.0 if k % 2 == 0 else 0.7), k * STRIKE, pan=rng.uniform(-0.15, 0.15))
    k += 1
add(sfx, filt(whoosh(0.5, 0.45), "low", 1500), CUT_END, pan=0.0, gain=0.5)
add(sfx, thud(0.5, 110), CUT_END + 0.45, pan=0.1)
add(sfx, filt(whoosh(0.4, 0.5), "low", 1700), CUT_END + 0.25, pan=0.3, gain=0.45)
add(sfx, gong(110, 2.4, 0.4), CUT_END + 0.3, pan=0.0)
add(sfx, gong(150, 2.0, 0.3), CUT_END + 0.75, pan=0.0)
add(sfx, filt(whoosh(0.9, 0.5), "low", 1300), 3.2, pan=0.0, gain=0.4)  # the puppet sinks into its trunk
# port: the junks' creak and the sails, a splash as they anchor; the town's hammers going up
t = port[0] + 0.2
while t < at(port, 0.8):
    add(sfx, creak(0.5) * 0.35, t, pan=rng.uniform(-0.5, 0.5))
    t += rng.uniform(0.5, 0.8)
for j in range(3):
    add(sfx, splash() * 0.45, at(port, 0.6 + 0.08 * j), pan=-0.3 + 0.2 * j)
add(sfx, babble(port[1] - at(port, 0.5), 0.9), at(port, 0.5), pan=-0.1, gain=0.25)
t = at(port, 0.2)
while t < port[1] - 0.3:
    add(sfx, thud(0.25, rng.uniform(100, 140)), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.18, 0.32)
# siege: the army's feet, war drums (in the score), cannon from the forts, fire, the walls coming down
t = siege[0] + 0.1
while t < at(siege, 0.6):
    add(sfx, footstep(0.35), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.24
for j in range(5):
    add(sfx, cannon(0.3), at(siege, 0.3 + 0.07 * j), pan=rng.uniform(-0.5, 0.5))
add(sfx, filt(crackle(at(siege, 1.0) - at(siege, 0.45)), "low", 1800) * 0.7, at(siege, 0.45), pan=0.1)
add(sfx, rumble(2.0, 0.9), at(siege, 0.6), pan=-0.2)
add(sfx, crowd(2.2), at(siege, 0.5), pan=0.2, gain=0.25)
# Bo Yang: the barges' oars and the stones landing, the wall's blocks set, the procession and the pillar's gong
t = boyang[0] + 0.3
while t < at(boyang, 0.9):
    add(sfx, splash() * 0.2, t, pan=rng.uniform(-0.5, 0.0))
    add(sfx, thud(0.3, rng.uniform(80, 120)), t + 0.2, pan=rng.uniform(-0.2, 0.4))
    t += rng.uniform(0.35, 0.55)
t = at(boyang, 0.42)
while t < at(boyang, 0.88):
    add(sfx, footstep(0.3), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.28
add(sfx, babble(at(boyang, 0.95) - at(boyang, 0.42), 0.8), at(boyang, 0.42), pan=0.1, gain=0.2)
add(sfx, thud(0.8, 70), at(boyang, 0.86), pan=0.0)
add(sfx, gong(98, 3.0, 0.3), at(boyang, 0.88), pan=0.0)
# trade: the junks coming in, the porters' feet and the sacks dropped, voices on the quay
add(sfx, creak(0.7) * 0.4, trade[0] + 0.3, pan=-0.4)
add(sfx, splash() * 0.4, at(trade, 0.5), pan=-0.3)
add(sfx, babble(trade[1] - trade[0] - 0.4, 1.1), trade[0] + 0.3, pan=0.2, gain=0.28)
t = trade[0] + 0.4
while t < trade[1] - 0.3:
    add(sfx, footstep(0.25), t, pan=rng.uniform(-0.4, 0.4))
    if rng.random() < 0.3:
        add(sfx, thud(0.3, 140), t + 0.1, pan=rng.uniform(-0.4, 0.4))
    t += 0.3
# train: the track's clanks as it is laid, then the chuffs slowing into the station, a whistle, a bell
t = train[0] + 0.2
while t < at(train, 0.45):
    add(sfx, tick(0.6), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, thud(0.2, 160), t + 0.05, pan=rng.uniform(-0.4, 0.4))
    t += 0.22
t, step = at(train, 0.38), 0.14
while t < at(train, 0.92):
    add(sfx, chuff(), t, pan=0.1, gain=0.7)
    t += step
    step = min(0.4, step * 1.04)
add(sfx, steam_whistle(1.2), at(train, 0.5), pan=0.2, gain=0.8)
add(sfx, filt(bell(523, 1.6, decay=1.6), "low", 2300), at(train, 0.9), pan=-0.1, gain=0.12)
# mermaid: the clay worked, then a gong and a shimmer as the gold reaches her; the beach's voices
t = at(mermaid, 0.08)
while t < at(mermaid, 0.45):
    add(sfx, filt(noise(int(0.2 * SR)), "band", (400, 1500)) * env_ar(int(0.2 * SR), 0.03, 0.1) * 0.08, t, pan=rng.uniform(-0.3, 0.3))
    t += rng.uniform(0.18, 0.28)
add(sfx, gong(130, 3.2, 0.3), at(mermaid, 0.5), pan=0.0)
for j in range(4):
    add(sfx, filt(bell(660 + 110 * j, 1.4, decay=2.2), "low", 2300), at(mermaid, 0.55 + 0.05 * j), pan=-0.3 + 0.2 * j, gain=0.08)
add(sfx, babble(mermaid[1] - at(mermaid, 0.3), 0.9), at(mermaid, 0.3), pan=0.2, gain=0.2)
# the grow shot: a pop per block, traffic, the bridge's spans meeting
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
add(sfx, thud(0.6, 90), tl.t_of(1986.4), pan=-0.4)
# the show: the puppet rising behind the stage, the crowd laughing at the clowns
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), show[0] + 0.1, pan=0.2, gain=0.45)
add(sfx, gong(110, 2.6, 0.35), show[0] + 0.6, pan=0.0)
add(sfx, laugh(today[1] - show[0], 0.35), show[0] + 0.4, pan=-0.1)
add(sfx, crowd(today[1] - show[0]), show[0] + 0.3, pan=0.2, gain=0.15)


# ---------------------------------------------------------------- the gaps between beats: a rising bridge into each
def bridge_gap(t0, t1):
    n = int((t1 - t0) * SR)
    rise = 0.45 + 0.55 * np.linspace(0, 1, n) ** 1.6
    add(sfx, filt(pink(n), "band", (180, 1400)) * rise * 0.18, t0, pan=0.1)
    t, step = t0, 0.24
    while t < t1 - 0.05:
        add(sfx, drum(150, 70, 0.2, 0.6), t, pan=-0.1, gain=0.07 + 0.13 * (t - t0) / (t1 - t0))
        t += step
        step = max(0.09, step * 0.85)


order = [port, siege, boyang, trade, train, mermaid, grow, show]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(110, 2.4, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 150, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 2.5
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_songkhla.wav", music, amb, sfx)
print("wrote public/soundtrack_songkhla.wav", {"hero": round(hero[0], 2), "show": round(show[0], 2)})
