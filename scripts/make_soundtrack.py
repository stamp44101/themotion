"""Synthesize the ambient soundtrack + score for the Chiang Mai timelapse.

Everything is generated procedurally and synced to the picture through
out/timeline.json (per-frame year and night amount, exported from src/lib.ts by
scripts/export_timeline.mjs). Output: public/soundtrack.wav (44.1 kHz stereo).

Layers
  music    Lanna-flavoured D-major pentatonic: warm pads, plucked "phin" melody,
           khong wong (gong-circle) arpeggios, klong drum, big gongs.
  ambience river, wind, birds by day / crickets by night (follows the 5 s
           day-night cycle), rain in the Burmese era, city traffic in modern times.
  sfx      construction, temple bells, earthquake + chedi collapse, steam and
           modern trains, plane, era-change whooshes, finale chimes.
"""
import json

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
DUR = 60.0
N = int(SR * DUR)
T = np.arange(N) / SR
rng = np.random.default_rng(1296)

tl = json.load(open("out/timeline.json"))
FPS = tl["fps"]
years = np.array([f[0] for f in tl["frames"]])
nights = np.array([f[1] for f in tl["frames"]])
ftimes = np.arange(len(years)) / FPS
NIGHT = np.interp(T, ftimes, nights)
YEAR = np.interp(T, ftimes, years)


def t_of(year):
    """First time (s) the year counter reaches `year`."""
    idx = np.searchsorted(years, year)
    return float(min(idx, len(years) - 1)) / FPS


# ---------------------------------------------------------------- helpers
def stereo():
    return np.zeros((N, 2))


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def filt(x, kind, f, order=2):
    if kind == "band":
        sos = butter(order, [f[0] / (SR / 2), f[1] / (SR / 2)], btype="band", output="sos")
    else:
        sos = butter(order, f / (SR / 2), btype=kind, output="sos")
    return sosfilt(sos, x, axis=0)


def add(bus, sig, t0, pan=0.0, gain=1.0):
    """Add a mono (or stereo) signal at time t0 with equal-power pan (-1..1)."""
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    if i0 < 0:
        sig = sig[-i0:]
        i0 = 0
    sig = sig[: N - i0]
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        bus[i0 : i0 + len(sig), 0] += sig * np.cos(a) * gain
        bus[i0 : i0 + len(sig), 1] += sig * np.sin(a) * gain
    else:
        bus[i0 : i0 + len(sig)] += sig * gain


def env_ar(n, a, r, sustain=None):
    """Attack/release envelope in samples-length n (a, r in seconds)."""
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    rel_start = n / SR - r
    e *= np.clip(1 - (t - rel_start) / max(r, 1e-4), 0, 1)
    return e


def bump(x, a, b, fade):
    return np.clip((x - a) / fade, 0, 1) * np.clip((b - x) / fade, 0, 1)


def noise(n):
    return rng.standard_normal(n)


def pink(n):
    w = np.fft.rfft(rng.standard_normal(n))
    f = np.arange(len(w))
    f[0] = 1
    return np.fft.irfft(w / np.sqrt(f), n) * 30


def reverb(x, seconds=3.0, decay=1.1, seed=3):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.stack([r.standard_normal(n), r.standard_normal(n)], axis=1)
    ir *= np.exp(-t / decay * 3)[:, None]
    ir = filt(ir, "low", 6000)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    out = np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], axis=1)
    return out


# ---------------------------------------------------------------- instruments
def pad(notes, dur, bright=1800.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in notes:
        f = mtof(m)
        for det in (-0.12, 0.0, 0.11):
            ff = f * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            for k in range(1, 7):
                if ff * k > 9000:
                    break
                out += np.sin(2 * np.pi * ff * k * t + ph * k) / (k ** 1.3)
    out *= 1 + 0.15 * np.sin(2 * np.pi * 0.23 * t)
    out = filt(out, "low", bright)
    out *= env_ar(n, min(1.6, dur / 3), min(2.0, dur / 2.5))
    return out / (len(notes) * 3)


def pluck(m, dur=1.8, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    out = np.zeros(n)
    for k in range(1, 12):
        fk = f * k * (1 + 0.0007 * k * k)
        if fk > 12000:
            break
        amp = (1 / k ** 1.1) * (bright if k > 3 else 1)
        out += amp * np.sin(2 * np.pi * fk * t) * np.exp(-t * (2.2 + 1.1 * k))
    att = np.minimum(1, t / 0.004)
    return out * att * 0.5


def bell(f, dur=3.0, ratios=(1, 2.0, 2.76, 4.07, 5.4), decay=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for i, r in enumerate(ratios):
        out += np.sin(2 * np.pi * f * r * t) * np.exp(-t * decay * (1 + i * 0.9)) / (1 + i * 0.7)
    return out * np.minimum(1, t / 0.002) * 0.45


def khong(m, dur=2.2):
    return bell(mtof(m), dur, ratios=(1, 2.01, 3.92, 5.2), decay=1.4)


def gong(f=88.0, dur=7.0, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    bend = 1 - 0.015 * (1 - np.exp(-t * 2))
    out = np.zeros(n)
    for i, r in enumerate((1, 1.006, 1.49, 1.98, 2.44, 3.1, 4.23)):
        out += np.sin(2 * np.pi * f * r * bend * t) * np.exp(-t * (0.45 + 0.35 * i)) / (1 + 0.5 * i)
    hit = filt(noise(n), "band", (200, 2000)) * np.exp(-t * 18) * 0.25
    return (out * 0.5 + hit) * np.minimum(1, t / 0.006) * gain


def drum(f0=120.0, f1=58.0, dur=0.7, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    freq = f1 + (f0 - f1) * np.exp(-t * 18)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 6)
    click = filt(noise(n), "low", 2500) * np.exp(-t * 60) * 0.3
    return (body + click) * gain


def shaker(dur=0.12):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "high", 6000) * np.exp(-t * 40) * 0.25


def whoosh(dur=1.2, peak=0.75):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = noise(n)
    e = np.where(t < peak, (t / peak) ** 2.2, np.exp(-(t - peak) * 9))
    lo = filt(x, "band", (300, 1200))
    hi = filt(x, "band", (1200, 5000))
    mixr = np.clip(t / peak, 0, 1)
    return (lo * (1 - mixr) + hi * mixr) * e * 0.5


def chirp_bird():
    sylls = rng.integers(2, 5)
    parts = []
    for _ in range(sylls):
        d = rng.uniform(0.04, 0.09)
        n = int(d * SR)
        t = np.arange(n) / SR
        f0 = rng.uniform(2600, 5200)
        sweep = f0 + rng.uniform(-1400, 1400) * (t / d)
        tone = np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.sin(np.pi * t / d) ** 2
        parts.append(tone)
        parts.append(np.zeros(int(rng.uniform(0.02, 0.06) * SR)))
    return np.concatenate(parts) * 0.12


# ---------------------------------------------------------------- music
music = stereo()

CHORDS = [
    (0.0, 3.2, [50, 57, 64], 1500),
    (3.0, 9.4, [50, 57, 62, 64], 1600),
    (9.0, 14.4, [47, 54, 62, 66], 1600),
    (14.0, 17.9, [43, 55, 62, 67], 1900),
    (17.5, 20.3, [50, 57, 62, 66, 69], 2600),
    (20.0, 24.3, [45, 52, 57, 64], 2200),
    (24.0, 26.8, [42, 57, 62, 66], 2600),
    (26.5, 29.6, [43, 57, 62, 69], 2600),
    (31.4, 37.4, [35, 42, 47, 54], 900),
    (37.0, 40.3, [43, 50, 55, 62], 1800),
    (40.0, 43.3, [50, 57, 62, 66], 2200),
    (43.0, 46.8, [47, 54, 59, 62], 2000),
    (46.5, 50.3, [45, 52, 57, 64], 2000),
    (50.0, 53.3, [50, 57, 62, 66], 2400),
    (53.0, 54.8, [43, 55, 62, 67], 2400),
    (54.5, 56.3, [45, 57, 64, 69], 2600),
    (56.0, 60.0, [38, 50, 57, 62, 66, 69, 74], 3000),
]
for t0, t1, notes, br in CHORDS:
    add(music, pad(notes, t1 - t0, br), t0, gain=0.55)

PENTA = [62, 64, 66, 69, 71, 74, 76, 78, 81]
BEAT = 60 / 96


def melody(t0, t1, step, amp, low=0, high=len(PENTA) - 1, prob=1.0, start=3, dur=1.8):
    i = start
    t = t0
    while t < t1:
        if rng.random() < prob:
            i = int(np.clip(i + rng.choice([-2, -1, -1, 0, 1, 1, 2]), low, high))
            add(music, pluck(PENTA[i], dur, bright=rng.uniform(0.7, 1.2)), t, pan=rng.uniform(-0.5, 0.5), gain=amp)
        t += step


melody(3.4, 13.8, BEAT * 2, 0.32, high=5)
melody(14.0, 23.8, BEAT, 0.34)
melody(24.0, 29.0, BEAT, 0.3, low=2)
melody(31.8, 36.8, BEAT * 4, 0.28, low=0, high=3, start=1, dur=2.6)
melody(37.2, 42.8, BEAT, 0.32)
melody(43.0, 49.8, BEAT / 2, 0.24, prob=0.6)
melody(50.0, 55.8, BEAT / 2, 0.26, prob=0.75, low=2)

# khong wong arpeggios — golden age and finale
for k, t in enumerate(np.arange(24.0, 29.0, BEAT / 2)):
    m = [74, 78, 81, 86, 81, 78][k % 6]
    add(music, khong(m), t, pan=0.35 * np.sin(k), gain=0.22)
for k, t in enumerate(np.arange(56.2, 59.2, BEAT / 2)):
    m = [86, 83, 81, 78, 76, 74, 71, 69][k % 8]
    add(music, khong(m, 2.8), t, pan=0.4 * np.sin(k * 1.3), gain=0.24)
for m in (62, 66, 69, 74):
    add(music, pluck(m, 3.5), 56.05 + (m - 62) * 0.02, gain=0.35)

# klong drum patterns
for t in np.arange(14.0, 23.8, BEAT * 2):
    add(music, drum(gain=0.6), t, gain=0.9)
for t in np.arange(15.25, 23.8, BEAT * 4):
    add(music, drum(160, 90, 0.4, 0.4), t, pan=0.2)
for t in np.arange(39.0, 42.9, BEAT * 2):
    add(music, drum(gain=0.5), t)
for t in np.arange(43.0, 55.9, BEAT):
    add(music, drum(gain=0.45 if int(round((t - 43) / BEAT)) % 2 == 0 else 0.25), t)
for t in np.arange(50.0 + BEAT / 2, 55.9, BEAT):
    add(music, shaker(), t, pan=0.3, gain=0.8)
for t in (t_of(1775), t_of(1775) + BEAT / 2, t_of(1775) + BEAT):
    add(music, drum(110, 50, 1.0, 0.8), t)

# gongs on the big moments
add(music, gong(70, 8, 1.0), 0.15)
add(music, gong(88, 8, 1.1), t_of(1296))
add(music, gong(104, 6, 0.6), t_of(1475))
add(music, gong(78, 6, 0.7), t_of(1796))
add(music, gong(70, 8, 1.2), 56.0)

# monk chant hum under the Buddhist council (1477)
c0, c1 = t_of(1476), t_of(1481) + 0.6
n = int((c1 - c0) * SR)
tt = np.arange(n) / SR
saw = sum(np.sin(2 * np.pi * 110 * k * tt) / k for k in range(1, 30))
chant = filt(saw, "band", (500, 900)) + 0.6 * filt(saw, "band", (1000, 1300))
add(music, chant * env_ar(n, 0.6, 0.8) * 0.06, c0)

# duck the music under the earthquake
q0 = t_of(1544.9)
q1 = t_of(1546.0)
duck = 1 - 0.85 * bump(T, q0, q1 + 0.8, 0.4)
music *= duck[:, None]

# ---------------------------------------------------------------- ambience
amb = stereo()

river = filt(pink(N), "low", 1100) * 0.6 + filt(noise(N), "band", (900, 2600)) * 0.08 * (
    1 + np.sin(2 * np.pi * 0.7 * T)
)
river *= 0.07 * (1 - 0.4 * np.clip((YEAR - 1950) / 70, 0, 1))
add(amb, river, 0, pan=0.25)

wind = filt(noise(N), "band", (180, 800)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.09 * T + 1))
burm = np.clip((YEAR - 1556) / 7, 0, 1) * (1 - np.clip((YEAR - 1775) / 17, 0, 1))
add(amb, wind * (0.035 + 0.05 * burm), 0, pan=-0.3)

# birds by day, more in the pre-modern eras
t = 0.3
while t < 55.5:
    i = int(t * SR)
    era = 1.0 if YEAR[i] < 1900 else 0.35
    if NIGHT[i] < 0.2 and not (29.5 < t < 31.6):
        add(amb, chirp_bird(), t, pan=rng.uniform(-0.8, 0.8), gain=era * (1 - burm[i] * 0.7))
    t += rng.exponential(0.32)

# crickets by night
car = np.sin(2 * np.pi * 4600 * T) * (np.sin(2 * np.pi * 28 * T) > 0.2)
gate = (np.sin(2 * np.pi * 1.7 * T) > 0.1).astype(float)
gate = filt(gate, "low", 40)
crickets = car * gate * np.clip((NIGHT - 0.25) / 0.35, 0, 1) * 0.03
crickets *= 1 - 0.5 * np.clip((YEAR - 1960) / 50, 0, 1)
add(amb, crickets, 0, pan=-0.5)
add(amb, np.roll(crickets, int(0.37 * SR)) * 0.8, 0, pan=0.6)

# rain over the Burmese era, with one thunder roll
rain_env = bump(T, 32.0, 37.6, 0.9)
rain = filt(noise(N), "band", (900, 7000)) * rain_env * 0.07
add(amb, rain, 0, pan=0.0)
for _ in range(500):
    tt0 = rng.uniform(32.2, 37.2)
    d = drum(rng.uniform(2500, 5000), 1500, 0.03, 0.05)
    add(amb, d, tt0, pan=rng.uniform(-1, 1))
th_n = int(3.5 * SR)
th_t = np.arange(th_n) / SR
thunder = filt(noise(th_n), "low", 220) * np.exp(-th_t * 1.1) * np.minimum(1, th_t / 0.15) * 0.5
add(amb, thunder, 34.2, pan=-0.4)

# modern city: traffic bed, songthaew horns, tuk-tuk buzz
traffic_env = np.clip((YEAR - 1958) / 50, 0, 1) * (1 - 0.5 * bump(T, 56, 61, 1.5))
traffic = filt(pink(N), "low", 450) * 0.6 + filt(noise(N), "band", (500, 1600)) * 0.05
add(amb, traffic * traffic_env * 0.06, 0, pan=0.0)
t = 49.5
while t < 56.5:
    if rng.random() < 0.5:
        hn = int(0.12 * SR)
        ht = np.arange(hn) / SR
        f = rng.choice([420, 470, 520])
        horn = np.sign(np.sin(2 * np.pi * f * ht)) * env_ar(hn, 0.005, 0.03)
        horn = filt(horn, "low", 2500) * 0.05
        add(amb, horn, t, pan=rng.uniform(-0.8, 0.8))
        add(amb, horn, t + 0.18, pan=rng.uniform(-0.8, 0.8))
    else:
        tn = int(1.6 * SR)
        tt2 = np.arange(tn) / SR
        buzz = filt(np.sign(np.sin(2 * np.pi * (34 + 6 * tt2) * tt2)), "low", 900) * np.sin(np.pi * tt2 / 1.6) * 0.035
        add(amb, buzz, t, pan=rng.uniform(-0.6, 0.6))
    t += rng.uniform(0.6, 1.4)

# ---------------------------------------------------------------- sfx
sfx = stereo()

# construction: digging scrapes + wooden knocks while the moat and walls go up
for _ in range(60):
    tt0 = rng.uniform(t_of(1294.4), t_of(1297.2))
    if rng.random() < 0.5:
        dn = int(0.18 * SR)
        scrape = filt(noise(dn), "band", (700, 2600)) * np.sin(np.pi * np.arange(dn) / dn) * 0.08
        add(sfx, scrape, tt0, pan=rng.uniform(-0.6, 0.6))
    else:
        add(sfx, drum(rng.uniform(300, 520), 220, 0.12, 0.25), tt0, pan=rng.uniform(-0.6, 0.6))

# temple bells: Doi Suthep (1383) then a scatter through the golden age
add(sfx, bell(620, 4.0), t_of(1383), pan=0.1, gain=0.5)
for _ in range(8):
    add(sfx, bell(rng.uniform(900, 1500), 2.5), rng.uniform(24.3, 28.8), pan=rng.uniform(-0.7, 0.7), gain=0.18)

# earthquake + chedi collapse
qn = int((q1 - q0 + 1.2) * SR)
qt = np.arange(qn) / SR
rumble = filt(noise(qn), "low", 110) * 1.4 + 0.5 * np.sin(2 * np.pi * 34 * qt + 3 * np.sin(2 * np.pi * 2.3 * qt))
rumble *= np.minimum(1, qt / 0.25) * np.clip((q1 - q0 + 1.2 - qt) / 0.8, 0, 1)
add(sfx, rumble * 0.8, q0)
cn = int(2.4 * SR)
ct = np.arange(cn) / SR
crash = (filt(noise(cn), "low", 1800) * 0.8 + filt(noise(cn), "band", (60, 300)) * 1.5) * np.exp(-ct * 2.2)
add(sfx, crash * 0.9, t_of(1545.15))
for _ in range(40):
    add(sfx, drum(rng.uniform(200, 700), 150, 0.08, 0.2), t_of(1545.2) + rng.exponential(0.35), pan=rng.uniform(-0.5, 0.5))

# steam train (45.4–48.6 s), left -> right, with whistle
s0, s1 = 45.4, 48.6
t = s0
while t < s1:
    p = (t - s0) / (s1 - s0)
    cn = int(0.16 * SR)
    chuff = filt(noise(cn), "band", (250, 1800)) * np.exp(-np.arange(cn) / SR * 22) * 0.3
    add(sfx, chuff, t, pan=-0.9 + 1.8 * p, gain=np.sin(np.pi * p) ** 0.5)
    t += 0.24 - 0.06 * p
wn = int(1.3 * SR)
wt = np.arange(wn) / SR
vib = 1 + 0.004 * np.sin(2 * np.pi * 6 * wt)
whistle = (np.sin(2 * np.pi * 587 * vib * wt) + 0.7 * np.sin(2 * np.pi * 740 * vib * wt)) * env_ar(wn, 0.08, 0.35)
whistle += filt(noise(wn), "band", (500, 900)) * 0.2 * env_ar(wn, 0.05, 0.3)
add(sfx, whistle * 0.12, 45.9, pan=-0.6)
for k in range(14):
    add(sfx, drum(900, 600, 0.04, 0.12), s0 + 0.4 + k * 0.2, pan=-0.8 + k * 0.12)

# modern train (51.6–54.4 s), right -> left, horn
m0, m1 = 51.6, 54.4
mn = int((m1 - m0) * SR)
mt = np.arange(mn) / SR
mp = mt / (m1 - m0)
hum = filt(np.sign(np.sin(2 * np.pi * 78 * mt)), "low", 400) * np.sin(np.pi * mp) * 0.05
pan_curve = 0.9 - 1.8 * mp
hum_st = np.stack([hum * np.cos((pan_curve + 1) * np.pi / 4), hum * np.sin((pan_curve + 1) * np.pi / 4)], 1)
add(sfx, hum_st, m0)
hn = int(0.9 * SR)
ht = np.arange(hn) / SR
horn = filt(np.sign(np.sin(2 * np.pi * 311 * ht)) + np.sign(np.sin(2 * np.pi * 370 * ht)), "low", 1800)
add(sfx, horn * env_ar(hn, 0.04, 0.2) * 0.035, 52.0, pan=0.6)

# plane (50.2–54 s), right -> left
p0, p1 = 50.2, 54.0
pn = int((p1 - p0) * SR)
pt = np.arange(pn) / SR
pp = pt / (p1 - p0)
jet = filt(noise(pn), "band", (300, 3000)) * np.sin(np.pi * pp) ** 2 * 0.08
jet += np.sin(2 * np.pi * (2100 - 400 * pp) * pt) * np.sin(np.pi * pp) ** 3 * 0.006
pan_curve = 0.9 - 1.8 * pp
add(sfx, np.stack([jet * np.cos((pan_curve + 1) * np.pi / 4), jet * np.sin((pan_curve + 1) * np.pi / 4)], 1), p0)

# era-change whooshes (peak on the cut) + title whoosh
for et in (3.0, 9.0, 14.0, 31.6, 37.0, 43.0, 50.0, 56.0):
    add(sfx, whoosh(1.1, 0.75), et - 0.75, pan=rng.uniform(-0.3, 0.3), gain=0.55)
add(sfx, drum(70, 32, 2.5, 1.0), 0.1, gain=0.6)

# finale: lantern chimes
for _ in range(26):
    add(sfx, bell(rng.uniform(1800, 3200), 2.0), rng.uniform(55.6, 59.0), pan=rng.uniform(-0.9, 0.9), gain=0.07)

# ---------------------------------------------------------------- mix
music_wet = reverb(music, 3.2, 1.3, seed=5)
sfx_wet = reverb(sfx, 2.0, 0.8, seed=9)
mix = music * 0.75 + music_wet * 0.45 + amb * 1.0 + sfx * 0.9 + sfx_wet * 0.25

fade = np.minimum(1, T / 0.25) * np.clip((DUR - T) / 1.6, 0, 1)
mix *= fade[:, None]
mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(mix * 1.15) / np.tanh(1.15) * 0.92

wavfile.write("public/soundtrack.wav", SR, (mix * 32767).astype(np.int16))
print("wrote public/soundtrack.wav", mix.shape, "events:",
      {"founding": round(t_of(1296), 2), "quake": round(t_of(1545), 2), "kawila": round(t_of(1775), 2)})
