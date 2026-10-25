"""Elephant voices for Surin, all synthesised: a size-scaled trumpet (tusker, cow, calf), the low
rumble an adult makes to keep the herd together, a calf's squeak, a trunk blow, and a herd
chorus. Every voice is kept under ~2 kHz (the owner dislikes sharp highs).

Run it directly for a demo reel:  python3 scripts/elephant_voices.py out/elephant_voices.wav
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from synth import SR, rng, filt, noise, env_ar  # noqa: E402
import numpy as np  # noqa: E402


def _tone(f, n, harmonics=18, bright=1.0):
    ph = 2 * np.pi * np.cumsum(f) / SR
    return sum(np.sin(k * ph) / k ** (1.0 + 0.4 / bright) for k in range(1, harmonics))


def trumpet(size=1.0, dur=None):
    """The trumpet call. size 1.0 = a big tusker (low, long, rough), 0.7 = a cow, 0.4 = a calf
    (high, short, thin). The pitch rises fast, holds with a wobble, then sags."""
    dur = dur or (0.5 + 0.9 * size)
    n = int(dur * SR)
    t = np.arange(n) / SR
    base = 520 / (0.55 + 0.45 * size)  # tusker ~520 Hz, calf ~ 800 Hz
    f = base * (0.62 + 0.38 * np.minimum(1, t / (0.12 + 0.12 * size)))
    f *= 1 - 0.18 * np.maximum(0, (t - 0.55 * dur) / dur)
    f *= 1 + (0.035 + 0.02 * size) * np.sin(2 * np.pi * (14 + 6 * size) * t)
    rasp = 1 + 0.45 * size * filt(noise(n), "low", 90)  # an adult's call is rough
    x = _tone(f, n) * rasp
    breath = filt(noise(n), "band", (400, 1600)) * 0.25
    out = filt(x + breath, "band", (220 if size > 0.6 else 380, 1900), order=4)
    return out * env_ar(n, 0.04, dur * 0.35) * 0.32


def rumble(size=1.0, dur=1.6):
    """The contact rumble: a low growling hum with a slow swell, felt more than heard."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = (34 + 14 * (1 - size)) * (1 + 0.06 * np.sin(2 * np.pi * 0.9 * t))
    x = _tone(f, n, harmonics=10)
    grit = filt(noise(n), "low", 220) * 0.6
    return filt(x * (1 + 0.5 * filt(noise(n), "low", 25)) + grit, "low", 380, order=4) * env_ar(n, dur * 0.35, dur * 0.45) * 0.55 * size


def squeak(dur=0.35):
    """A calf's squeal: short, rising then falling, never shrill."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 700 + 380 * np.sin(np.pi * t / dur)
    x = _tone(f, n, harmonics=8)
    return filt(x, "band", (450, 1800), order=4) * env_ar(n, 0.03, dur * 0.6) * 0.22


def blow(dur=0.45):
    """A trunk blow: air pushed through the trunk, a soft wet huff."""
    n = int(dur * SR)
    x = filt(noise(n), "band", (180, 900), order=4) * (1 + 0.6 * np.sin(2 * np.pi * 23 * np.arange(n) / SR))
    return x * env_ar(n, 0.02, dur * 0.7) * 0.35


def chorus(dur=3.0, sizes=(1.0, 0.75, 0.7, 0.4)):
    """A herd answering one another: the big one, cows, a calf a beat later."""
    n = int(dur * SR)
    out = np.zeros(n)
    t0 = 0.0
    for k, s in enumerate(sizes):
        v = trumpet(s) if s >= 0.5 else squeak()
        i = int(t0 * SR)
        if i >= n:
            break
        m = min(len(v), n - i)
        out[i : i + m] += v[:m] * (1 if k == 0 else 0.7)
        t0 += 0.35 + rng.uniform(0.15, 0.4)
    r = rumble(0.9, dur)
    return out + r[:n] * 0.6


if __name__ == "__main__":
    import wave

    path = sys.argv[1] if len(sys.argv) > 1 else "out/elephant_voices.wav"
    gap = np.zeros(int(0.6 * SR))
    parts = [trumpet(1.0), gap, trumpet(0.72), gap, trumpet(0.4), gap, squeak(), gap, squeak(0.28), gap,
             rumble(1.0), gap, blow(), gap, chorus()]
    x = np.concatenate(parts)
    x = x / (np.max(np.abs(x)) + 1e-9) * 0.8
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())
    print("wrote", path, round(len(x) / SR, 1), "s")
