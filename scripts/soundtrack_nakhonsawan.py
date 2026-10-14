"""Nakhon Sawan (Pak Nam Pho) soundtrack (60 s):
The confluence of four rivers (Ping, Wang, Yom, Nan into Chao Phraya),
Ancient Phra Bang, Nine Armies War at San Khu (1785), Pak Nam Pho teak raft depot,
the 1901 Golden Dragon Parade & Chinese New Year festivities (Pak Nam Pho Chinese 5-dialect heritage),
the 1905 Northern Railway arrival, 1950 Dechatiwong Bridge, and Pasan (2019).

Run: node scripts/export_timeline.mjs src/cities/nakhonsawan/timeline.ts out/timeline_nakhonsawan.json
     python scripts/soundtrack_nakhonsawan.py
"""
import os
import sys
import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from synth import *  # noqa: E402,F403

tl = Timeline("out/timeline_nakhonsawan.json")
EV = tl.events
Y = tl.YEAR
music, amb, sfx = stereo(), stereo(), stereo()

# Timing landmarks
t_phrabang = tl.t_of(EV["phraBangFounding"])
t_nakhonsawan = tl.t_of(EV["nakhonSawanRenamed"])
t_war = tl.t_of(EV["nineArmiesWar"])
t_teak = tl.t_of(EV["teakBoom"])
t_dragon = tl.t_of(EV["dragonParade"])
t_rail = tl.t_of(EV["railwayOpens"])
t_bridge = tl.t_of(EV["dechatiwongOpens"])
t_chedi = tl.t_of(EV["chulamaniChedi"])
t_pasan = tl.t_of(EV["pasanOpens"])

# ---------------------------------------------------------------- Specialized Nakhon Sawan Instruments
def guzheng(m, dur=1.8, bright=1.3, gain=1.0):
    """Chinese Guzheng / Khim metal-string zither with expressive singing sustain."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    # Subtle finger vibrato after initial pluck
    vib = 1 + 0.0035 * np.sin(2 * np.pi * 5.0 * t) * np.minimum(1, np.maximum(0, (t - 0.2) / 0.4))
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    out = np.zeros(n)
    for k in range(1, 14):
        decay = 1.8 + 0.85 * k
        amp = (1.0 / (k ** 0.95)) * (bright if k in (2, 3) else 1.0)
        out += amp * np.sin(k * ph) * np.exp(-t * decay)
    pick = filt(noise(n), "band", (1800, 6000)) * np.exp(-t * 120) * 0.18
    return (out * 0.6 + pick) * np.minimum(1, t / 0.003) * 0.65 * gain

def lion_drum(f0=130.0, f1=65.0, dur=0.5, gain=1.0):
    """Chinese lion dance / dragon parade drum: punchy, tight hide head with wooden barrel thud."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    freq = f1 + (f0 - f1) * np.exp(-t * 22)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 8.5)
    click = filt(noise(n), "band", (800, 3200)) * np.exp(-t * 45) * 0.45
    return (body + click) * gain

def chinese_chab(dur=0.6, gain=1.0):
    """Bright, brassy Chinese ceremonial clash cymbal (ฉาบใหญ่)."""
    return bell(2400, dur, ratios=(1, 1.28, 1.62, 2.14, 2.75, 3.4), decay=6.0) * 0.5 * gain

def chinese_rising_gong(f=160.0, dur=1.2, gain=1.0):
    """Auspicious Chinese opera/dragon gong with characteristically rising pitch."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    # Pitch rises slightly upon impact
    pitch = f * (1.0 + 0.12 * np.minimum(1, t / 0.15) * np.exp(-t * 2.5))
    ph = 2 * np.pi * np.cumsum(pitch) / SR
    out = (np.sin(ph) + 0.6 * np.sin(1.92 * ph) + 0.35 * np.sin(2.8 * ph)) * np.exp(-t * 3.2)
    return out * np.minimum(1, t / 0.005) * 0.55 * gain

def firecracker_string(dur=2.0):
    """Festive Chinese New Year string of firecrackers (ประทัดสายตรุษจีนปากน้ำโพ)."""
    n = int(dur * SR)
    out = np.zeros(n)
    num_pops = int(dur * 28)
    for _ in range(num_pops):
        pos = rng.integers(0, n - 800)
        pop_len = 700
        t_pop = np.arange(pop_len) / SR
        freq = rng.uniform(250, 600) * np.exp(-t_pop * 80)
        pop = np.sin(2 * np.pi * freq * t_pop) * np.exp(-t_pop * 60)
        crackle = filt(noise(pop_len), "band", (1500, 8000)) * np.exp(-t_pop * 50) * 0.6
        out[pos : pos + pop_len] += (pop + crackle) * rng.uniform(0.3, 0.9)
    return out * 0.55

# ---------------------------------------------------------------- Score (Pads & Atmospheric Harmony)
# Key: D / G / A Pentatonic blending Thai & Chinese scales
PADS = [
    (0.0, 8.5, [43, 50, 55, 62], 1000),             # Ancient confluence of four rivers (Mueang Phra Bang)
    (8.0, 15.5, [45, 52, 57, 60, 64], 1400),        # Ayutthaya royal fleet mobilization
    (15.0, 22.5, [38, 45, 50, 53], 900),            # Nine Armies War (1785) tension & battle
    (22.0, 30.5, [43, 50, 55, 59, 62], 1800),       # Pak Nam Pho teak boom & floating city
    (30.0, 38.5, [48, 55, 60, 64, 67, 72], 2600),   # Golden Dragon Parade (Auspicious C major pentatonic)
    (38.0, 44.5, [45, 52, 57, 62, 65], 2200),       # Northern Railway connection
    (44.0, 51.0, [43, 50, 55, 62, 67], 2400),       # Dechatiwong Bridge era
    (50.5, 60.0, [48, 55, 60, 64, 67, 72, 76], 2800)# Pasan, Phra Chulamani & grand modern river finale
]
for t0, t1, notes, br in PADS:
    add(music, pad(notes, t1 - t0, br), t0, gain=0.55)

# ---------------------------------------------------------------- Melodic Instrumentation
# 1. Ancient Thai Khlui (ขลุ่ย) melody (0.0s - 15.5s)
KHLUI_TUNES = [
    (2.8, [67, 72, 74, 76, 74, 72, 67], 0.75),   # Ancient river motif
    (9.0, [72, 74, 76, 79, 76, 74, 72], 0.65),   # Ayutthaya garrison motif
    (45.0, [72, 74, 76, 79, 81, 79, 76, 74], 0.65), # Gateway to the North
]
for t0, notes, step in KHLUI_TUNES:
    for k, m in enumerate(notes):
        add(music, khlui(m, step * 1.5), t0 + k * step, pan=-0.2, gain=0.9)

# 2. Chinese Guzheng / Khim Plucks (22.5s - 38.0s and 51.0s - 56.5s)
GUZHENG_LICKS = [
    # Teak raft era: delicate riverside water ripples
    (23.2, [62, 67, 71, 74, 71, 67, 62], 0.38),
    (26.0, [67, 71, 74, 79, 74, 71, 67], 0.35),
    # Dragon Parade: festive pentatonic fireworks
    (31.2, [72, 76, 79, 84, 79, 76, 72], 0.28),
    (33.5, [79, 84, 88, 84, 79, 76, 72, 67], 0.24),
    (35.5, [72, 76, 79, 84, 79, 84, 88, 91], 0.22),
    # Finale at Pasan: grand waterfall runs
    (51.5, [72, 76, 79, 84, 79, 76, 72], 0.3),
    (53.2, [76, 79, 84, 88, 91, 88, 84], 0.25),
]
for t0, notes, step in GUZHENG_LICKS:
    for k, m in enumerate(notes):
        add(music, guzheng(m, step * 2.2, bright=1.3), t0 + k * step, pan=0.3 * np.sin(k), gain=0.85)

# 3. Traditional Ranat Ek (ระนาดเอก) fills on river transitions
def ranat_phrase(t0, notes, step, amp=0.28):
    for k, m in enumerate(notes):
        add(music, ranat(m, step * 1.2), t0 + k * step, pan=rng.uniform(-0.3, 0.3), gain=amp)

ranat_phrase(10.5, [60, 62, 65, 67, 69, 72], 0.22)
ranat_phrase(27.5, [67, 69, 72, 74, 77, 79], 0.20)
ranat_phrase(54.2, [72, 74, 77, 79, 81, 84, 86], 0.18)

# ---------------------------------------------------------------- Percussion & Rhythms
# 1. Nine Armies War (1785) heavy war drums
for t in np.arange(16.0, 21.5, 0.55):
    add(music, drum(95, 42, 0.5, 0.7), t, pan=rng.uniform(-0.35, 0.35))
    if int(round((t - 16.0) / 0.55)) % 2 == 1:
        add(music, drum(140, 70, 0.3, 0.5), t + 0.25, pan=0.2)

# 2. Chinese Dragon Parade Grooves (30.5s - 38.0s)
# The unmistakable Lion/Dragon beat of Pak Nam Pho:
# (ตึง-ตึง-โป๊ะ! ตึง-ตึง-โป๊ะ! แช้ง-แช้ง!)
BEAT_DRAGON = 0.42
t = 30.8
while t < 37.8:
    # Lion drum pattern
    add(music, lion_drum(140, 70, 0.4, 0.95), t, pan=-0.15)
    add(music, lion_drum(150, 75, 0.35, 0.85), t + BEAT_DRAGON * 0.5, pan=-0.1)
    add(music, lion_drum(120, 55, 0.45, 1.1), t + BEAT_DRAGON, pan=0.1)
    # Chinese brass cymbal on offbeats
    add(music, chinese_chab(0.45, gain=0.65), t + BEAT_DRAGON * 1.5, pan=0.3)
    add(music, chinese_chab(0.45, gain=0.75), t + BEAT_DRAGON * 2.0, pan=0.35)
    # Rising opera gong puncturing the phrase
    if int((t - 30.8) / (BEAT_DRAGON * 2)) % 2 == 1:
        add(music, chinese_rising_gong(175, 0.8, 0.7), t + BEAT_DRAGON * 2.2, pan=-0.3)
    t += BEAT_DRAGON * 2

# 3. Phra Chulamani Chedi Golden Bells (Mountain Summit, 48.0s - 55.0s)
for k, t in enumerate(np.arange(48.5, 54.5, 0.65)):
    add(music, bell(mtof([84, 81, 79, 76, 74, 72][k % 6]), 2.5, (1, 2.01, 3.85, 5.1), 1.4), t, pan=0.3 * np.sin(k), gain=0.3)

# 4. Gongs at Major Historical Turning Points
for gt, gf, gg in (
    (0.2, 60, 0.9),       # Ancient founding
    (t_war, 70, 1.0),      # Rama I war camp
    (t_dragon, 88, 1.1),   # Dragon parade arrival
    (t_bridge, 75, 0.95),  # Dechatiwong bridge
    (t_pasan, 68, 1.1),    # Pasan opening
    (55.5, 55, 1.3),       # Grand Finale
):
    add(music, gong(gf, 7.0, gg), gt)

# ---------------------------------------------------------------- Ambience & Sound Effects
# 1. Confluence Water Ambience:
# Deep wide alluvial river (Ping + Nan = Chao Phraya)
river_deep = filt(pink(N), "low", 800) * 0.5
river_lap = filt(noise(N), "band", (180, 1200)) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * T)) * 0.04
add(amb, river_deep * 0.055, 0, pan=-0.2)
add(amb, river_lap, 0, pan=0.25)

# Water splashes for teak rafts floating down
for wt in np.arange(t_teak, t_teak + 5.0, 0.85):
    add(sfx, splash(), wt + rng.uniform(-0.1, 0.1), pan=rng.uniform(-0.4, 0.4))

# 2. Chinese New Year Firecrackers at Pak Nam Pho (1901 & Finale)
add(sfx, firecracker_string(2.8), t_dragon + 0.2)
add(sfx, firecracker_string(2.2), 55.8)

# 3. Nine Armies War Clashes (1785)
for _ in range(16):
    add(sfx, clash(), rng.uniform(t_war, t_war + 3.5), pan=rng.uniform(-0.6, 0.6))

# 4. 1905 Steam Train arrival at Pak Nam Pho
t_train = 38.6
add(sfx, steam_whistle(), t_train + 0.4, pan=0.6)
t_c = t_train + 0.3
while t_c < t_train + 4.6:
    p = (t_c - t_train) / 4.6
    add(sfx, chuff(), t_c, pan=0.8 - 1.6 * p, gain=np.sin(np.pi * p) ** 0.5)
    t_c += 0.24 - 0.05 * p

# 5. Finale fireworks over the confluence
for i in range(18):
    add(sfx, firework_pop(), 55.4 + i * 0.25 + rng.uniform(0, 0.18), pan=rng.uniform(-0.8, 0.8), gain=0.55)

# 6. Era whooshes
for et in (8.0, 15.5, 22.5, 30.5, 38.0, 44.5, 50.5, 55.5):
    add(sfx, whoosh(1.1, 0.7), et - 0.7, pan=rng.uniform(-0.3, 0.3), gain=0.5)

# Master output
mix = master("public/soundtrack_nakhonsawan.wav", music, amb, sfx)
print("wrote public/soundtrack_nakhonsawan.wav successfully!")
