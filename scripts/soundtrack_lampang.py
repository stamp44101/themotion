"""Lampang soundtrack: Lanna palette (sueng/salo plucks, khlui, กลองสะบัดชัย) + SFX.

Run:  node scripts/export_timeline.mjs src/cities/lampang/timeline.ts out/timeline_lampang.json
      python3 scripts/soundtrack_lampang.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
import json  # noqa: E402
import synth  # noqa: E402

synth.init(json.load(open("out/timeline_lampang.json"))["duration"])
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_lampang.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()
# cues sit on the story's beats (timeline.ts), so a retime of the picture moves the score
B = tl.beat
legend, emerald, thip, kawila, teak, railway, bowls, maemoh, modern = (
    B("legend"), B("emerald"), B("thipchang"), B("kawila"), B("teak"), B("railway"), B("bowls"), B("maemoh"), B("modern"))
# the shot at Lampang Luang (actors.ts SHOT: .42-.48 of the beat), the flight after it
shot = thip[0] + 0.42 * (thip[1] - thip[0])

# ---------------------------------------------------------------- score (G major pentatonic, 120 bpm)
BEAT = 60 / 120
PENTA = [67, 69, 71, 74, 76, 79, 81, 83, 86, 88]
G, C, D, Em = [43, 50, 55], [48, 55, 60], [50, 57, 62], [40, 47, 52]

add(music, pad([43, 50, 55], legend[1] + 0.5, 900), 0.0, gain=0.55)
for t0, t1, notes in ((legend[1], thip[0] - 0.4, G), (thip[0] - 0.4, thip[1], Em), (thip[1], teak[0] - 0.4, D),
                      (teak[0] - 0.4, bowls[0] - 0.4, C), (bowls[0] - 0.4, modern[0] - 0.4, G), (modern[0] - 0.4, DUR, [43, 55, 62, 67, 71])):
    add(music, pad(notes, t1 - t0 + 0.6, 1600), t0, gain=0.4)
    for t in np.arange(t0 + 0.1, t1 - 0.2, BEAT):
        # ซึง: a bright pluck on the beat, the octave on the off-beat
        add(music, pluck(notes[1] + 12, 0.7, 0.6), t, pan=-0.2, gain=0.32)
        add(music, pluck(notes[0] + 24, 0.5, 0.5), t + BEAT / 2, pan=0.2, gain=0.18)


def flute(t0, t1, step, amp, low=0, high=len(PENTA) - 1, start=4):
    """ขลุ่ย phrases over the pentatonic."""
    i = start
    t = t0
    while t < t1:
        i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
        d = step * rng.choice([1, 1, 2])
        add(music, khlui(PENTA[i], min(d * 1.1, t1 - t + 0.2)), t, pan=rng.uniform(-0.3, 0.3), gain=amp)
        t += d


flute(emerald[0] - 0.4, emerald[1] + 0.4, BEAT, 0.22)
flute(teak[0], teak[1], BEAT, 0.2, low=2)
flute(railway[0] + 1.0, railway[1] + 1.5, BEAT, 0.2)
flute(modern[0] - 0.4, DUR - 2.5, BEAT, 0.24, low=3)

# กลองสะบัดชัย: the war drum under the Lampang Luang beat and the march north
for t in np.arange(thip[0], thip[1] - 0.2, BEAT / 2):
    add(sfx, drum(150, 70, 0.35, 0.8), t, pan=rng.uniform(-0.2, 0.2), gain=0.55 if (t - thip[0]) % BEAT < 0.1 else 0.3)
for t in np.arange(kawila[0], kawila[1], BEAT):
    add(sfx, drum(140, 66, 0.4, 0.8), t, gain=0.5)
music *= (1 - 0.35 * bump(T, thip[0], thip[1], 0.4))[:, None]

# ---------------------------------------------------------------- ambience
add(amb, filt(pink(N), "low", 600) * 0.03, 0, pan=-0.3)
t = 0.3
while t < modern[0]:
    i = int(t * SR)
    if tl.NIGHT[i] < 0.2 and not (thip[0] - 0.4 < t < thip[1]):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=0.9 if Y[i] < 1900 else 0.35)
    t += rng.exponential(0.45)
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = filt((np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float), "low", 40)
crickets = car * gate * np.clip((tl.NIGHT - 0.25) / 0.35, 0, 1) * 0.025
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1600)) * 0.05
add(amb, traffic * np.clip((Y - 1955) / 50, 0, 1) * 0.05, 0)


def hooves(t0, t1, pan=0.0, gain=0.5):
    """a horse at a trot: paired clops, slightly uneven, never a metronome."""
    t = t0
    while t < t1:
        for dt in (0.0, 0.09):
            add(sfx, drum(rng.uniform(900, 1300), 600, 0.05, 0.25), t + dt, pan=pan, gain=gain)
        t += rng.uniform(0.26, 0.32)


# ---------------------------------------------------------------- sfx
# frame 0: the carriage trots across the tile under the title, a bell on the harness
hooves(0.2, legend[0] + 0.36 * (legend[1] - legend[0]), pan=-0.2, gain=0.5)
add(sfx, bicycle_bell(), 0.6, pan=-0.2, gain=0.35)
# the legend's earth wall going up: packing thuds
for _ in range(18):
    add(sfx, drum(rng.uniform(140, 220), 90, 0.2, 0.4), rng.uniform(tl.t_of(690), tl.t_of(699)), pan=rng.uniform(-0.6, 0.6))
# 1436: elephants with the Emerald Buddha, bells and a trumpet as they reach the gate
for t in np.arange(emerald[0] + 0.2, emerald[0] + 0.8 * (emerald[1] - emerald[0]), 0.7):
    add(sfx, footstep(0.8), t, pan=rng.uniform(-0.3, 0.3))
    add(sfx, ching(0.3), t + 0.12, pan=rng.uniform(-0.4, 0.4), gain=0.35)
add(sfx, trumpet_elephant(), emerald[0] + 0.6 * (emerald[1] - emerald[0]), pan=0.1, gain=0.6)
# ~1732: footsteps of the villagers, one shot, then the camp breaking
for t in np.arange(thip[0] + 0.2, shot - 0.3, 0.42):
    add(sfx, footstep(0.45), t + rng.uniform(-0.05, 0.05), pan=rng.uniform(-0.5, 0.5))
add(sfx, drum(900, 80, 0.5, 1.4), shot, gain=0.9)
add(sfx, filt(noise(int(0.6 * SR)), "low", 1800) * env_ar(int(0.6 * SR), 0.005, 0.5) * 0.6, shot)
add(sfx, crowd(thip[1] - shot), shot + 0.2, gain=0.55)
# 1774: the army marching north
for t in np.arange(kawila[0] + 0.3, kawila[1], 0.38):
    add(sfx, footstep(0.5), t + rng.uniform(-0.04, 0.04), pan=rng.uniform(-0.5, 0.5))
# teak: logs knocking together on the water, an elephant at work on the bank
for _ in range(12):
    add(sfx, drum(rng.uniform(260, 420), 180, 0.18, 0.35), rng.uniform(teak[0], teak[1]), pan=rng.uniform(-0.6, 0.6))
add(sfx, splash(), teak[0] + 0.8, pan=0.3, gain=0.5)
add(sfx, trumpet_elephant(0.9), teak[0] + 2.2, pan=0.5, gain=0.4)
# 1916: the first train pulls in to the terminus (slowing), then a carriage drives off
steam = EV["trains"][0]
s0, s1 = steam["t0"] + 0.2, steam["t0"] + steam["dur"]
t = s0
while t < s1:
    p = (t - s0) / (s1 - s0)
    add(sfx, chuff(), t, pan=0.6 - 1.2 * p, gain=0.9 - 0.4 * p)
    t += 0.2 + 0.18 * p
add(sfx, steam_whistle(), s0 + 0.3, pan=0.4)
add(sfx, steam_whistle(1.6), s1 - 0.4, pan=-0.3, gain=0.7)
hooves(railway[0] + 0.5 * (railway[1] - railway[0]), railway[1] + 0.6, pan=0.2, gain=0.45)
# 1955: the kilns roaring, bowls clinking
add(sfx, filt(noise(int((bowls[1] - bowls[0]) * SR)), "low", 220) * env_ar(int((bowls[1] - bowls[0]) * SR), 0.6, 0.8) * 0.25, bowls[0])
for _ in range(8):
    add(sfx, clink(), rng.uniform(bowls[0] + 0.5, bowls[1]), pan=rng.uniform(-0.5, 0.5), gain=0.5)
# Mae Moh: heavy machinery in the pit
add(sfx, filt(noise(int((maemoh[1] - maemoh[0]) * SR)), "low", 90) * env_ar(int((maemoh[1] - maemoh[0]) * SR), 0.5, 0.8) * 0.5, maemoh[0])
# the modern town: carriages over the bridge
hooves(modern[0] + 0.3, modern[1], pan=-0.1, gain=0.35)

# era-change whooshes + opening boom
for et in (3.0, emerald[0] - 0.2, thip[0] - 0.2, teak[0] - 0.4, railway[0] - 0.4, bowls[0] - 0.2, modern[0] - 0.2):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.5)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.6)

# finale fireworks
for i in range(16):
    add(sfx, firework_pop(), modern[1] - 0.4 + i * 0.28 + rng.uniform(0, 0.2), pan=rng.uniform(-0.8, 0.8), gain=0.5)

mix = master("public/soundtrack_lampang.wav", music, amb, sfx)
print("wrote public/soundtrack_lampang.wav", {"shot": round(shot, 2), "railway": round(railway[0], 2)})
