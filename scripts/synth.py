"""Shared synthesis toolkit for the city timelapse soundtracks.

Everything is procedural (numpy/scipy). A city script loads its exported timeline
(per-frame year + night amount) so music and SFX land on the picture's events:

    from synth import *
    tl = Timeline("out/timeline_korat.json")
    tl.t_of(1900)  # seconds at which the counter reaches 1900
"""
import json

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
DUR = 60.0
N = int(SR * DUR)
T = np.arange(N) / SR


def init(duration):
    """Set the clip length. Call before `from synth import *` in a city script."""
    global DUR, N, T
    DUR = float(duration)
    N = int(SR * DUR)
    T = np.arange(N) / SR
rng = np.random.default_rng(1296)


class Timeline:
    def __init__(self, path):
        tl = json.load(open(path))
        fps = tl["fps"]
        self.years = np.array([f[0] for f in tl["frames"]])
        nights = np.array([f[1] for f in tl["frames"]])
        ft = np.arange(len(self.years)) / fps
        self.fps = fps
        self.events = tl.get("events", {})
        self.beats = tl.get("beats", {})
        self.NIGHT = np.interp(T, ft, nights)
        self.YEAR = np.interp(T, ft, self.years)

    def beat(self, id):
        """[t0, t1] seconds of a story beat (src/engine/story.ts)."""
        return tuple(self.beats[id])

    def t_of(self, year):
        """First time (s) the year counter reaches `year`."""
        idx = np.searchsorted(self.years, year)
        return float(min(idx, len(self.years) - 1)) / self.fps


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
    """Mix a mono (equal-power panned, -1..1) or stereo signal into `bus` at t0 seconds."""
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


def sample(name, peak=0.8, fade=0.15):
    """A recorded or generated sound from public/sfx/<name>.(wav|mp3) as a stereo float array
    at SR, peak-normalised, with short fades; None when the file is not there, so a city script
    can fall back to its synthesized version and still run without the asset."""
    import os
    import subprocess

    for ext in ("wav", "mp3"):
        path = f"public/sfx/{name}.{ext}"
        if os.path.exists(path):
            raw = subprocess.run(
                ["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                check=True, capture_output=True,
            ).stdout
            x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
            x *= peak / max(1e-9, np.abs(x).max())
            n = min(int(fade * SR), len(x) // 2)
            ramp = np.linspace(0, 1, n)[:, None]
            x[:n] *= ramp
            x[len(x) - n :] *= ramp[::-1]
            return x
    return None


def pan_sweep(sig, p0, p1):
    """Stereo signal whose pan moves linearly from p0 to p1."""
    p = np.linspace(p0, p1, len(sig))
    a = (p + 1) * np.pi / 4
    return np.stack([sig * np.cos(a), sig * np.sin(a)], 1)


def env_ar(n, a, r):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    e *= np.clip(1 - (t - (n / SR - r)) / max(r, 1e-4), 0, 1)
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
    return np.stack([fftconvolve(x[:, c], ir[:, c])[:N] for c in range(2)], axis=1)


def master(path, music, amb, sfx, music_wet=0.45, sfx_wet=0.25):
    """Reverb, fades, normalize, soft-clip, write 16-bit WAV."""
    mix = music * 0.75 + reverb(music, 3.2, 1.3, seed=5) * music_wet + amb + sfx * 0.9 + reverb(sfx, 2.0, 0.8, seed=9) * sfx_wet
    fade = np.minimum(1, T / 0.25) * np.clip((DUR - T) / 1.6, 0, 1)
    mix *= fade[:, None]
    mix /= np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix * 1.15) / np.tanh(1.15) * 0.92
    wavfile.write(path, SR, (mix * 32767).astype(np.int16))
    return mix


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


def khaen(notes, dur, bright=2600.0):
    """Isan free-reed mouth organ: reedy odd-harmonic tone, breathy, with bellows swell."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for m in notes:
        f = mtof(m) * (1 + 0.0015 * np.sin(2 * np.pi * 5.2 * t + m))
        ph = 2 * np.pi * np.cumsum(f) / SR
        for k in (1, 2, 3, 5, 7, 9):
            out += np.sin(k * ph) / (k ** (1.1 if k % 2 else 1.6))
    breath = filt(noise(n), "band", (1500, 5000)) * 0.04
    swell = 0.75 + 0.25 * np.sin(2 * np.pi * 0.8 * t) ** 2
    out = filt(out, "low", bright) * swell + breath
    return out * env_ar(n, min(0.5, dur / 4), min(1.2, dur / 3)) / (len(notes) * 2.2)


def pluck(m, dur=1.8, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    out = np.zeros(n)
    for k in range(1, 12):
        fk = f * k * (1 + 0.0007 * k * k)
        if fk > 12000:
            break
        out += (1 / k ** 1.1) * (bright if k > 3 else 1) * np.sin(2 * np.pi * fk * t) * np.exp(-t * (2.2 + 1.1 * k))
    return out * np.minimum(1, t / 0.004) * 0.5


def bell(f, dur=3.0, ratios=(1, 2.0, 2.76, 4.07, 5.4), decay=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for i, r in enumerate(ratios):
        out += np.sin(2 * np.pi * f * r * t) * np.exp(-t * decay * (1 + i * 0.9)) / (1 + i * 0.7)
    return out * np.minimum(1, t / 0.002) * 0.45


def ching(dur=0.35):
    """Small Thai finger cymbal."""
    return bell(2900, dur, ratios=(1, 1.47, 2.09, 2.56), decay=9) * 0.5


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


def whoosh(dur=1.2, peak=0.75):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = noise(n)
    e = np.where(t < peak, (t / peak) ** 2.2, np.exp(-(t - peak) * 9))
    m = np.clip(t / peak, 0, 1)
    return (filt(x, "band", (300, 1200)) * (1 - m) + filt(x, "band", (1200, 5000)) * m) * e * 0.5


def chirp_bird():
    parts = []
    for _ in range(rng.integers(2, 5)):
        d = rng.uniform(0.04, 0.09)
        n = int(d * SR)
        t = np.arange(n) / SR
        f0 = rng.uniform(2600, 5200)
        sweep = f0 + rng.uniform(-1400, 1400) * (t / d)
        parts.append(np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.sin(np.pi * t / d) ** 2)
        parts.append(np.zeros(int(rng.uniform(0.02, 0.06) * SR)))
    return np.concatenate(parts) * 0.12


def roar(dur=1.8, f0=95.0):
    """Big creature roar: growly formant-filtered saw with downward pitch."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 * (1.25 - 0.45 * t / dur) * (1 + 0.04 * np.sin(2 * np.pi * 23 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(k * ph) / k for k in range(1, 40))
    growl = filt(saw, "band", (180, 900)) + 0.5 * filt(saw, "band", (900, 1800))
    rasp = filt(noise(n), "band", (300, 2500)) * 0.5
    e = np.minimum(1, t / 0.18) * np.exp(-np.maximum(0, t - 0.6) * 2.2)
    return (growl + rasp) * e * 0.35


def footstep(gain=1.0):
    return drum(55, 30, 0.6, gain) + filt(noise(int(0.6 * SR)), "low", 300) * np.exp(-np.arange(int(0.6 * SR)) / SR * 14) * 0.4 * gain


def chuff():
    n = int(0.16 * SR)
    return filt(noise(n), "band", (250, 1800)) * np.exp(-np.arange(n) / SR * 22) * 0.3


def steam_whistle(dur=1.3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 6 * t)
    w = (np.sin(2 * np.pi * 587 * vib * t) + 0.7 * np.sin(2 * np.pi * 740 * vib * t)) * env_ar(n, 0.08, 0.35)
    return (w + filt(noise(n), "band", (500, 900)) * 0.2 * env_ar(n, 0.05, 0.3)) * 0.12


def crackle(dur):
    """Fire crackle: sparse clicks over a low roar."""
    n = int(dur * SR)
    out = filt(noise(n), "low", 500) * 0.15
    for _ in range(int(dur * 40)):
        i = rng.integers(0, n - 400)
        out[i : i + 400] += filt(noise(400), "high", 2000) * np.exp(-np.arange(400) / 60) * rng.uniform(0.2, 0.8)
    return out


def crowd(dur):
    """Distant crowd/army roar: formant-ish bandpassed noise with swells."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = noise(n)
    v = filt(x, "band", (350, 900)) + 0.6 * filt(x, "band", (1100, 2200))
    return v * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t) ** 2) * env_ar(n, 0.5, 0.8) * 0.5


def clash():
    return bell(rng.uniform(1800, 2600), 0.5, ratios=(1, 1.31, 1.83, 2.47, 3.1), decay=7) * 0.6


def jet(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    roar_ = filt(noise(n), "band", (120, 2600)) * np.sin(np.pi * p) ** 2
    whine = np.sin(2 * np.pi * (2400 - 700 * p) * t) * np.sin(np.pi * p) ** 4 * 0.03
    return (roar_ * 0.2 + whine)


def firework_pop():
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    boom = drum(90, 40, 1.4, 0.8)
    sizzle = np.zeros(n)
    for _ in range(60):
        i = rng.integers(int(0.1 * SR), n - 300)
        sizzle[i : i + 300] += filt(noise(300), "high", 4000) * np.exp(-np.arange(300) / 50) * rng.uniform(0.1, 0.4)
    return boom + sizzle * np.exp(-t * 1.5)


# ---------------------------------------------------------------- central-Thai classical colours
def ranat(m, dur=0.9):
    """Ranat ek (wooden xylophone): bright, fast-decaying inharmonic bar."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    out = np.zeros(n)
    for r, a, d in ((1, 1.0, 7), (3.93, 0.35, 16), (9.2, 0.12, 30)):
        out += a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d)
    out += filt(noise(n), "band", (1500, 5000)) * np.exp(-t * 120) * 0.15
    return out * 0.45


def pi_reed(m, dur, vib=5.5):
    """Pi nai (Thai oboe): nasal double-reed tone with expressive vibrato."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m) * (1 + 0.012 * np.sin(2 * np.pi * vib * t) * np.minimum(1, t / 0.4))
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(k * ph) / k for k in range(1, 18))
    tone = filt(saw, "band", (500, 2600)) + 0.4 * filt(saw, "band", (2600, 4200))
    return tone * env_ar(n, 0.08, min(0.3, dur / 3)) * 0.22


def trumpet_elephant(dur=1.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 380 + 260 * np.minimum(1, t / 0.25) - 120 * np.maximum(0, t - 0.6)
    f = f * (1 + 0.03 * np.sin(2 * np.pi * 18 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = sum(np.sin(k * ph) / k for k in range(1, 25))
    return (filt(saw, "band", (500, 3000)) + filt(noise(n), "band", (800, 3000)) * 0.3) * env_ar(n, 0.05, 0.4) * 0.3


def splash():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    return filt(noise(n), "band", (400, 3000)) * np.exp(-t * 14) * 0.25


def creak(dur=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 180 + 90 * np.sin(2 * np.pi * 0.8 * t)
    pulse = (np.sin(2 * np.pi * np.cumsum(f) / SR) > 0.7).astype(float)
    return filt(pulse, "band", (300, 1500)) * env_ar(n, 0.05, 0.2) * 0.12


def bicycle_bell():
    return bell(3400, 0.6, ratios=(1, 1.52, 2.1), decay=5) * 0.35


def khlui(m, dur):
    """Khlui (Thai bamboo flute): soft sine-rich tone with breath and gentle vibrato."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m) * (1 + 0.006 * np.sin(2 * np.pi * 5 * t) * np.minimum(1, t / 0.3))
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
    breath = filt(noise(n), "band", (1200, 4000)) * 0.08
    return (tone + breath) * env_ar(n, 0.12, min(0.4, dur / 3)) * 0.22


def clink():
    """Ceramic pot clink."""
    return bell(rng.uniform(2200, 3400), 0.4, ratios=(1, 2.32, 4.25), decay=10) * 0.4


# ================================================================ v2: space, distance, master
# docs/sound.md, phase 1. Opt-in: a city script that keeps calling master()/pluck()/chuff()
# sounds exactly as it did.

_ROOMS = {
    # pre-delay s, (T60 low, mid, high) s, early reflection taps (s, gain)
    # outdoors: the diorama's plains and towns -- a few ground/building bounces, a short tail
    "outdoor": (0.008, (0.7, 0.5, 0.22), [(0.014, 0.35), (0.029, 0.22)]),
    "open": (0.012, (1.5, 1.1, 0.45), [(0.019, 0.5), (0.031, 0.38), (0.047, 0.3), (0.071, 0.2)]),
    "hall": (0.024, (3.4, 2.7, 1.2), [(0.023, 0.55), (0.037, 0.45), (0.052, 0.4), (0.069, 0.33), (0.091, 0.26), (0.118, 0.2)]),
}
_IR_CACHE = {}


def _room_ir(size, seed=11):
    if (size, seed) in _IR_CACHE:
        return _IR_CACHE[(size, seed)]
    pre, (tl, tm, th), taps = _ROOMS[size]
    r = np.random.default_rng(seed)
    n = int((pre + max(tl, tm, th) * 1.1) * SR)
    t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    # late tail: three bands, each decaying at its own T60 (-60 dB = factor 1e-3); highs die first
    for band, t60 in ((("low", 500), tl), (("band", (500, 4000)), tm), (("high", 4000), th)):
        tail = filt(r.standard_normal((n, 2)), band[0], band[1])
        ir += tail * (10 ** (-3 * np.maximum(0, t - pre) / t60))[:, None] * (t >= pre)[:, None]
    ir *= np.minimum(1, np.maximum(0, t - pre) / 0.03)[:, None]  # tail swells in, no click
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    # early reflections, alternating sides so the room has width
    for i, (d, g) in enumerate(taps):
        ir[int(d * SR), i % 2] += g * 0.6
    _IR_CACHE[(size, seed)] = ir
    return ir


def room(x, size="open", seed=11):
    """Wet signal of `x` (mono or stereo) in a room; same length as x."""
    ir = _room_ir(size, seed)
    xs = np.stack([x, x], 1) if x.ndim == 1 else x
    return np.stack([fftconvolve(xs[:, c], ir[:, c])[: len(xs)] for c in range(2)], axis=1)


def place(sig, dist=0.3, pan=0.0, size="outdoor"):
    """A mono sound at a distance (0 = at the camera, 1 = across the tile): farther is quieter,
    duller (air takes the highs), wetter and narrower. Returns stereo with its own reverb."""
    dist = float(np.clip(dist, 0, 1))
    cut = 16000 * (1 - dist) ** 1.6 + 2200
    dry = filt(sig, "low", min(cut, 18000)) * (1 / (1 + 2.5 * dist))
    tail = np.zeros(int(2.5 * SR))
    wet = room(np.concatenate([dry, tail]), size) * (0.05 + 0.3 * dist)
    a = (pan * (1 - 0.5 * dist) + 1) * np.pi / 4
    out = wet.copy()
    out[: len(dry), 0] += dry * np.cos(a)
    out[: len(dry), 1] += dry * np.sin(a)
    return out


def _compress(x, thresh_db=-20.0, ratio=2.5, tau=0.12):
    from scipy.signal import lfilter

    a = np.exp(-1 / (tau * SR))
    level = np.sqrt(lfilter([1 - a], [1, -a], (x ** 2).mean(axis=1)) + 1e-12)
    db = 20 * np.log10(level)
    over = np.maximum(0, db - thresh_db)
    gain = 10 ** (-over * (1 - 1 / ratio) / 20)
    return x * gain[:, None]


def _level(x, target_db, ratio=2.5, tau=1.5, max_db=6.0):
    """Slow two-way leveller: a stretch louder than the target is pulled down and a quieter one
    lifted, by (1 - 1/ratio) of the difference and at most max_db, over a ~tau s window."""
    from scipy.signal import filtfilt

    a = np.exp(-1 / (tau * SR))
    ms = filtfilt([1 - a], [1, -a], (x ** 2).mean(axis=1))
    db = 10 * np.log10(np.maximum(ms, 1e-10))
    g_db = np.clip((target_db - db) * (1 - 1 / ratio), -max_db, max_db)
    # never lift near-silence (the fade-in, gaps) into audible noise
    g_db = np.where(db < target_db - 30, np.minimum(g_db, 0), g_db)
    return x * (10 ** (g_db / 20))[:, None]


def _limit(x, ceiling=0.89, look=0.005, release=0.08):
    from scipy.ndimage import maximum_filter1d, minimum_filter1d
    from scipy.signal import lfilter

    w = int(look * SR) * 2 + 1
    peak = maximum_filter1d(np.abs(x).max(axis=1), w)
    g = np.minimum(1, ceiling / (peak + 1e-9))
    g = minimum_filter1d(g, w)
    a = np.exp(-1 / (release * SR))
    smooth = lfilter([1 - a], [1, -a], g)
    # the gain falls as fast as the look-ahead needs and recovers at `release`
    return x * np.minimum(g, smooth)[:, None]


def _to_rms(x, db):
    return x * 10 ** (db / 20) / (np.sqrt((x ** 2).mean()) + 1e-12)


def master2(path, music, amb, sfx, music_room=0.14, target_rms_db=-14.5):
    """Phase-1 master: the score in a hall, SFX already placed (place() carries their room),
    low-cut, a slow two-way leveller that evens the beats out, loudness target
    (-14.5 dB RMS, where master() lands, so an A/B is not won by loudness), look-ahead limiter
    instead of tanh."""
    mix = music * 0.85 + room(music, "open", seed=5) * music_room + amb + sfx
    mix = filt(mix, "high", 30)
    mix = _to_rms(mix, target_rms_db)
    mix = _level(mix, target_rms_db)
    mix = _to_rms(mix, target_rms_db)
    fade = np.minimum(1, T / 0.25) * np.clip((DUR - T) / 1.6, 0, 1)
    mix = _limit(mix * fade[:, None])
    wavfile.write(path, SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
    return mix


# ================================================================ v2: procedural SFX
def steam_train(dur=4.5, rev0=2.2, stop_at=0.8, whistle_at=0.25, seed=7):
    """A steam locomotive slowing into a station (docs/sound.md phase 2, after Farnell).
    Driving wheels turn at rev0 rev/s and slow to a stop at stop_at of the clip; four exhaust
    beats per turn, the first accented; rail-joint clicks from the same speed; a three-pipe chime
    whistle; brake squeal and a steam release as it stops. Mono."""
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.arange(n) / SR
    u = np.clip(t / (dur * stop_at), 0, 1)
    rev = rev0 * (1 - u) ** 1.4  # rev/s, easing to zero
    turns = np.cumsum(rev) / SR
    out = np.zeros(n)
    # exhaust beats: one each quarter turn; slower = longer, fuller chuff
    beats = np.flatnonzero(np.diff(np.floor(turns * 4)) > 0)
    accent = (1.0, 0.68, 0.84, 0.62)
    for i, b in enumerate(beats):
        v = rev[b] / rev0
        L = int((0.07 + 0.16 * (1 - v)) * SR)
        e = np.exp(-np.arange(L) / SR / (0.035 + 0.09 * (1 - v))) * np.minimum(1, np.arange(L) / (0.004 * SR))
        burst = filt(r.standard_normal(L), "band", (220, 2600)) + 0.6 * filt(r.standard_normal(L), "band", (480, 800))
        thump = np.sin(2 * np.pi * 62 * np.arange(L) / SR) * np.exp(-np.arange(L) / SR / 0.05) * 0.5
        g = accent[i % 4] * r.uniform(0.9, 1.1) * (0.55 + 0.45 * (1 - v))
        s = b + int(r.uniform(-0.006, 0.006) * SR)
        if 0 <= s < n:
            seg = (burst * 0.35 + thump) * e * g
            out[s : s + L] += seg[: n - s]
    # rail joints every 12 m on 1.5 m wheels: two clicks (front and rear bogie) per joint
    metres = np.cumsum(rev * np.pi * 1.5) / SR
    for j in np.flatnonzero(np.diff(np.floor(metres / 12)) > 0):
        for off in (0.0, 9.0):
            k = j + int(off / max(rev[j] * np.pi * 1.5, 0.5) * SR)
            if k < n - 2000:
                L = 1800
                clk = filt(r.standard_normal(L), "high", 2500) * np.exp(-np.arange(L) / SR / 0.004)
                ring = np.sin(2 * np.pi * r.uniform(1900, 2300) * np.arange(L) / SR) * np.exp(-np.arange(L) / SR / 0.03) * 0.15
                out[k : k + L] += (clk * 0.25 + ring) * (rev[j] / rev0)
    # steam hiss: a bed, and a big release once stopped
    hiss = filt(r.standard_normal(n), "high", 3000)
    release = np.exp(-np.maximum(0, t - dur * stop_at) / 0.4) * (t > dur * stop_at)
    out += hiss * (0.01 + 0.045 * release)
    # brake squeal over the last stretch before the stop
    sq = np.clip((u - 0.55) / 0.45, 0, 1) * (u < 1)
    f_sq = 2350 * (1 + 0.006 * np.sin(2 * np.pi * 7 * t)) * (1 - 0.04 * u)
    out += np.sin(2 * np.pi * np.cumsum(f_sq) / SR) * sq ** 2 * 0.05
    # chime whistle: three pipes, harmonics, breath, the pitch settling on the attack
    w0, wd = int(whistle_at * dur * SR), 1.4
    wn = int(wd * SR)
    tw = np.arange(wn) / SR
    env = np.minimum(1, tw / 0.06) * np.clip((wd - tw) / 0.3, 0, 1)
    scoop = 1 - 0.035 * np.exp(-tw / 0.09)
    wh = np.zeros(wn)
    for f in (466.0, 587.0, 698.0):
        ph = 2 * np.pi * np.cumsum(f * scoop * (1 + 0.003 * np.sin(2 * np.pi * 5.5 * tw))) / SR
        wh += np.sin(ph) + 0.3 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
        wh += filt(r.standard_normal(wn), "band", (f * 0.92, f * 1.08)) * 0.35
    out[w0 : w0 + wn] += (wh * env * 0.06)[: n - w0]
    return out


def phin(m, dur=0.9, pos=0.18, bright=0.996, seed=None):
    """พิณ as a Karplus-Strong string (docs/sound.md phase 3): a noise pluck at `pos` along the
    string, loss per round trip, and two body resonances. Computed a period at a time at 4x the
    sample rate, so the tuning is within a few cents. Mono."""
    from scipy.signal import resample_poly

    r = rng if seed is None else np.random.default_rng(seed)
    os = 4
    sr = SR * os
    P = int(round(sr / mtof(m)))
    n = int(dur * sr)
    y = np.zeros(n + P + 1)
    exc = r.uniform(-1, 1, P)
    exc -= np.roll(exc, int(pos * P))  # pluck position: a comb notch
    y[1 : P + 1] = exc
    k = P + 1
    while k < len(y):
        e = min(k + P, len(y))
        y[k:e] = bright * 0.5 * (y[k - P : e - P] + y[k - P - 1 : e - P - 1])
        k = e
    s = resample_poly(y[1 : n + 1], 1, os)
    t = np.arange(len(s)) / SR
    body = filt(s, "band", (180, 260)) * 1.2 + filt(s, "band", (420, 520)) * 0.7
    return (s + body) * np.minimum(1, t / 0.002) * 0.35
