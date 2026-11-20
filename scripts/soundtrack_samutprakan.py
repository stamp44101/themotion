"""Samut Prakan soundtrack: a central Thai palette (the ranat ek's running lines, the khlui's long notes, the pi's reed at
the payoff, the klong thad and ching) under a small sound for everything that appears or moves: a hod of bricks thumped
down and a trowel's tick for every course of the cover's chedi, the whitewash's swish and the spire's rising tone; the
conscripts' feet, the kiln, oars and bricks on the ferries; the barges' drums and paddles and a gong as the relic goes in;
picks and earth at Phra Chula's ramparts; the French ships' engines, the disappearing guns' booms and the gunboats'
answer; the pier's hammers, the sea, the gulls and the dance band's drum at Bang Pu; the town's pops and traffic; the
jets coming in; the red cloth's procession with its drums and the crowd. Ambience is a sequence of places: the river's
water at Pak Nam, the surf at the mouth and at Bang Pu, the town bed from the 1950s. All code (no generated audio); kept
under ~2.4 kHz (the owner dislikes sharp highs).

Run:  node scripts/export_timeline.mjs src/cities/samutprakan/timeline.ts out/timeline_samutprakan.json
      python3 scripts/soundtrack_samutprakan.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_samutprakan.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_samutprakan.json")
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
B = tl.beat
hero, build, raise_, fort, fight, resort, grow, airport, fair, today = (
    B("hero"), B("build"), B("raise"), B("fort"), B("fight"), B("resort"), B("grow"), B("airport"), B("fair"), B("today"))
at = lambda b, p: b[0] + p * (b[1] - b[0])
MUSIC_GAIN = 2.9  # the score 0 to +3 LU over the effects across the clip, never ducked (owner); measured below
# the chedi's courses (src/cities/samutprakan/actors.ts courseAt)
COURSES, LAY_END = 16, 1.8
course_at = lambda k: -1 if k < COURSES / 2 else ((k - COURSES / 2 + 1) / (COURSES / 2)) * LAY_END

# ---------------------------------------------------------------- score (D minor pentatonic, a central Thai thang, 96 bpm)
BEAT = 60 / 96
PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81]
Dm, F, C, Am, Gm = [50, 57, 62, 65], [53, 60, 65, 69], [48, 55, 60, 64], [45, 52, 57, 60], [43, 50, 55, 58]
sections = (
    (0.0, build[0], Dm, 1.0),
    (build[0], raise_[0], Dm, 1.0),
    (raise_[0], fort[0], F, 1.0),
    (fort[0], fight[0], Am, 0.95),
    (fight[0], resort[0], Gm, 1.0),
    (resort[0], grow[0], F, 0.95),
    (grow[0], airport[0], C, 1.0),
    (airport[0], fair[0], Am, 1.0),
    (fair[0], DUR, [50, 57, 62, 65, 69], 1.05),
)
for t0, t1, notes, lvl in sections:
    add(music, pad(notes, t1 - t0 + 0.6, bright=1500), t0, gain=0.1 * lvl)
    add(music, filt(khaen(notes[:3], t1 - t0 + 0.6, bright=1500), "low", 1800), t0, gain=0.035 * lvl)


def ranat_line(t0, t1, amp, step=BEAT / 2, prob=0.8):
    """the ranat ek: running pentatonic"""
    i = 4
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(PENTA) - 1))
            add(music, filt(ranat(PENTA[i], 0.5), "low", 2200), t, pan=rng.uniform(-0.4, 0.4), gain=amp)
        t += step


def khlui_line(t0, t1, amp):
    t = t0
    i = 3
    while t < t1 - 0.4:
        d = BEAT * rng.choice([1, 1, 2])
        i = int(np.clip(i + rng.choice([-1, 1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(khlui(PENTA[i], d * 1.1), "low", 2200), t, pan=0.2, gain=amp)
        t += d


def pi_line(t0, t1, amp):
    t = t0
    i = 4
    while t < t1 - 0.4:
        d = BEAT * rng.choice([0.5, 1, 1])
        i = int(np.clip(i + rng.choice([-1, 1, -2, 2]), 0, len(PENTA) - 1))
        add(music, filt(pi_reed(PENTA[i], d * 1.05), "low", 2100), t, pan=-0.2, gain=amp)
        t += d


def klong(t0, t1, gain):
    pat = [1.0, 0, 0.5, 0, 0.8, 0.4, 0.6, 0]
    t = t0
    k = 0
    while t < t1:
        g = pat[k % len(pat)]
        if g:
            add(music, drum(rng.uniform(100, 120), 56, 0.24, 0.7), t, pan=-0.2, gain=gain * g)
        if k % 2 == 1:
            add(music, filt(ching(0.3), "low", 2300), t, pan=0.3, gain=gain * 0.45)
        t += BEAT / 2
        k += 1


khlui_line(0.3, hero[1], 0.07)
ranat_line(build[0], build[1], 0.07, prob=0.6)
klong(raise_[0], raise_[1], 0.12)
khlui_line(raise_[0] + 0.4, raise_[1], 0.05)
ranat_line(fort[0], fort[1], 0.08, prob=0.6)
klong(fight[0], fight[1], 0.13)
pi_line(fight[0] + 0.3, fight[1], 0.05)
khlui_line(resort[0], resort[1], 0.07)
ranat_line(grow[0], grow[1], 0.11, prob=0.75)
klong(grow[0] + 1.0, grow[1], 0.08)
ranat_line(airport[0], airport[1], 0.08, prob=0.55)
khlui_line(airport[0], airport[1], 0.05)
ranat_line(fair[0], DUR - 3.0, 0.12, prob=0.85)
pi_line(fair[0], DUR - 3.0, 0.06)
klong(fair[0] + 0.2, DUR - 3.0, 0.12)

# ---------------------------------------------------------------- ambience: a sequence of places (8-12 dB under the score)
TT = np.arange(N) / SR
t = 0.3
while t < DUR - 6:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2:
        add(amb, filt(chirp_bird(), "low", 2400), t, pan=rng.uniform(-0.8, 0.8), gain=1.0 if Y[i] < 1950 else 0.4)
    t += rng.exponential(1.1)
win = lambda a, b, f=1.0: np.clip((TT - a) / f, 0, 1) * (1 - np.clip((TT - b) / f, 0, 1))
# the river lapping at Pak Nam (the cover, build, raise, fair); the surf at the mouth (fort, fight) and at Bang Pu
river_on = win(0.0, fort[0]) + win(fair[0], DUR) + 0.15
add(amb, filt(pink(N), "band", (120, 600)) * river_on * 0.08, 0)
surf = filt(pink(N), "band", (90, 700)) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * TT) ** 2)
add(amb, surf * (win(fort[0], resort[1]) * 0.14), 0)
add(amb, filt(pink(N), "low", 450) * np.clip((Y - 1950) / 60, 0, 1) * 0.15, 0)


def gull(gain=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 1100 - 500 * t / 0.35
    return filt(np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ar(n, 0.02, 0.2) * 0.12, "low", 2300) * gain


t = at(resort, 0.3)
while t < resort[1]:
    add(amb, gull(rng.uniform(0.6, 1.0)), t, pan=rng.uniform(-0.6, 0.6))
    t += rng.uniform(0.35, 0.8)


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


def boom(gain=1.0):
    """a gun: a low thump with a long rolling tail"""
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 3) + 30) / SR) * np.exp(-t * 6)
    roll = filt(pink(n), "low", 300) * np.exp(-t * 2.2)
    return (body * 0.7 + roll * 0.6) * gain


def engine(dur, gain=1.0, rate=7.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return filt(pink(n), "low", 200) * (0.6 + 0.4 * np.sin(2 * np.pi * rate * t)) * env_ar(n, 0.4, 0.6) * 0.4 * gain


def swish(gain=1.0):
    return filt(whoosh(0.35, 0.5), "low", 1500) * gain


# the cover: a hod of bricks thumped down and a trowel tick for each course laid from frame 0; the whitewash; the spire
for k in range(COURSES):
    s = course_at(k)
    if s >= 0:
        add(sfx, thud(0.6, rng.uniform(80, 110)), s, pan=rng.uniform(-0.3, 0.3))
        add(sfx, tick(0.8), s + 0.07, pan=rng.uniform(-0.3, 0.3))
add(sfx, thud(0.5, 95), 0.0, pan=0.0)
add(sfx, filt(whoosh(0.7, 0.5), "low", 1500), 1.75, pan=-0.2, gain=0.45)  # the whitewash sweeps up
add(sfx, filt(whoosh(0.6, 0.4), "low", 1300), 1.85, pan=0.2, gain=0.3)  # the scaffold comes down
n = int(0.9 * SR)
tt = np.arange(n) / SR
add(sfx, np.sin(2 * np.pi * np.cumsum(220 + 330 * (tt / 0.9) ** 1.5) / SR) * env_ar(n, 0.1, 0.4) * 0.08, 2.0, pan=0.0)  # the spire rises
add(sfx, filt(bell(523, 2.6, decay=1.6), "low", 2300), 2.75, pan=0.0, gain=0.16)
add(sfx, filt(whoosh(0.8, 0.5), "low", 1400), 3.0, pan=0.0, gain=0.4)  # the giant sinks into its island
# build: the conscripts' feet and voices, bricks set down, oars on the ferries, the kiln
t = build[0] + 0.4
while t < build[1] - 0.3:
    add(sfx, footstep(0.4), t, pan=rng.uniform(-0.4, 0.4))
    if rng.random() < 0.5:
        add(sfx, thud(0.25, rng.uniform(100, 140)), t + 0.1, pan=rng.uniform(-0.4, 0.4))
        add(sfx, tick(0.5), t + 0.16, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.25, 0.4)
add(sfx, babble(build[1] - build[0] - 0.6, 1.0), build[0] + 0.4, pan=-0.1, gain=0.28)
t = build[0] + 0.6
while t < build[1]:
    add(sfx, splash() * 0.18, t, pan=0.3)
    t += 1.1
add(sfx, gong(92, 2.6, 0.22), at(build, 0.75), pan=0.0)  # the pillar
# raise: the barges' paddles in time, the relic carried up, a gong as it goes in, the builders' hammers
t = raise_[0] + 0.2
while t < at(raise_, 0.55):
    add(sfx, splash() * 0.22, t, pan=rng.uniform(-0.3, 0.3))
    t += BEAT
add(sfx, babble(at(raise_, 0.7) - at(raise_, 0.45), 0.8), at(raise_, 0.45), pan=0.1, gain=0.22)
add(sfx, gong(98, 3.2, 0.3), at(raise_, 0.74), pan=0.0)
t = at(raise_, 0.35)
while t < at(raise_, 0.9):
    add(sfx, thud(0.25, rng.uniform(90, 140)), t, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.22, 0.32)
# fort: picks and shovelled earth on the ramparts; each gun set in its pit
t = fort[0] + 0.3
while t < at(fort, 0.6):
    add(sfx, tick(0.6), t, pan=rng.uniform(-0.4, 0.4))
    add(sfx, thud(0.2, rng.uniform(70, 100)), t + 0.08, pan=rng.uniform(-0.4, 0.4))
    t += rng.uniform(0.2, 0.32)
for k in range(7):
    add(sfx, thud(0.4, 70), at(fort, 0.6 + 0.045 * k), pan=-0.3 + 0.1 * k)
# fight: the ships' engines, the guns rising and booming, the answer from the ships and the gunboats
add(sfx, engine(fight[1] - fight[0], 0.8), fight[0], pan=0.2)
t = at(fight, 0.25)
k = 0
while t < at(fight, 0.94):
    add(sfx, boom(0.55 if k % 2 == 0 else 0.4), t, pan=(-0.4 if k % 2 == 0 else 0.4))
    t += rng.uniform(0.35, 0.6)
    k += 1
add(sfx, babble(fight[1] - fight[0] - 1.0, 1.3), fight[0] + 0.5, pan=-0.3, gain=0.2)
# resort: the pier's hammers, the sea, feet on the boards, a dance band's drum from the pavilion
t = at(resort, 0.1)
while t < at(resort, 0.55):
    add(sfx, thud(0.3, rng.uniform(110, 150)), t, pan=rng.uniform(-0.3, 0.3))
    t += 0.28
t = at(resort, 0.55)
while t < resort[1]:
    add(sfx, footstep(0.3), t, pan=rng.uniform(-0.4, 0.4))
    t += 0.33
add(sfx, babble(resort[1] - at(resort, 0.5), 0.9), at(resort, 0.5), pan=0.2, gain=0.25)
add(sfx, engine(1.4, 0.4, 5.0), at(resort, 0.72), pan=-0.4)  # a car on Sukhumvit
# the grow shot: a pop per block, traffic
t = at(grow, 0.05)
while t < grow[1] - 0.2:
    add(sfx, blip(gain=0.5), t, pan=rng.uniform(-0.7, 0.7))
    t += rng.exponential(0.16)
n = int((grow[1] - grow[0]) * SR)
add(sfx, filt(pink(n), "low", 160) * (0.7 + 0.3 * np.sin(2 * np.pi * 8 * np.arange(n) / SR)) * env_ar(n, 1.0, 1.0) * 0.25, grow[0], pan=-0.3)
# airport: the jets coming in and the one taking off
add(sfx, filt(jet(3.6), "low", 1800), at(airport, 0.05), pan=-0.3, gain=0.6)
add(sfx, filt(jet(3.2), "low", 1800), at(airport, 0.45), pan=0.3, gain=0.5)
add(sfx, filt(whoosh(1.4, 0.8), "low", 1400), at(airport, 0.6), pan=0.2, gain=0.4)
add(sfx, filt(bell(659, 1.6, decay=2.0), "low", 2300), at(airport, 0.3), pan=0.0, gain=0.08)  # the terminal's chime
# fair: the red cloth's drums and paddles, the crowd round the chedi, the cloth going on
add(sfx, babble(today[1] - fair[0], 1.2), fair[0], pan=0.2, gain=0.3)
add(sfx, crowd(today[1] - fair[0]), fair[0] + 0.3, pan=-0.2, gain=0.18)
t = fair[0] + 0.2
while t < at(fair, 0.45):
    add(sfx, splash() * 0.2, t, pan=rng.uniform(-0.3, 0.3))
    t += BEAT
add(sfx, filt(whoosh(1.2, 0.5), "low", 1500), at(fair, 0.6), pan=0.0, gain=0.4)  # the cloth goes round the bell
add(sfx, gong(88, 3.0, 0.28), at(fair, 0.86), pan=0.0)
t = at(fair, 0.5)
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


order = [build, raise_, fort, fight, resort, grow, airport, fair]
for a_, b_ in zip(order, order[1:]):
    bridge_gap(a_[1] - 0.9, b_[0] + 0.05)
    add(sfx, gong(74, 2.6, 0.2), b_[0], pan=0.05)
for i in range(6):
    add(sfx, filt(firework_pop(), "low", 2000), DUR - 4.4 + i * 0.6 + rng.uniform(0, 0.2), pan=rng.uniform(-0.6, 0.6), gain=0.3)
for i in range(4):
    add(music, gong(rng.choice([110, 147, 165]), 2.4, 0.1), DUR - 4.0 + i * 0.8, pan=rng.uniform(-0.5, 0.5))
music *= MUSIC_GAIN
amb *= 1.4
_m = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * 0.45
_e = amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * 0.25
_a = amb
print(f"  score over effects: {lufs(_m) - lufs(_e):+.1f} LU; ambience under score: {lufs(_a) - lufs(_m):+.1f} LU")
mix = master("public/soundtrack_samutprakan.wav", music, amb, sfx)
print("wrote public/soundtrack_samutprakan.wav", {"hero": round(hero[0], 2), "fair": round(fair[0], 2)})
