# Sound from code — development plan

The province series is code, not generation (CLAUDE.md, owner's rule): the score and every SFX
come from `scripts/synth.py`. This plan improves that sound without recordings or AI models.
Everything stays deterministic (same seed, same wav) and runs in the existing numpy/scipy
pipeline; nothing new to install.

## Where we are

- Instruments are additive sines (khaen, phin, ranat, gong, bell) and filtered-noise SFX
  (chuff, whistle, creak, crackle). They read as placeholders next to the picture.
- One mix stage: a noise-burst reverb on two buses, peak-normalise, `tanh` soft clip. Every
  sound sits in a different dry space; nothing is near or far; loud beats spike.

## Phases (ordered by gain per hour)

### 1. Space and mix (all cities at once)
- **A real room for every sound.** An algorithmic reverb with early reflections, a
  frequency-dependent tail (highs die first, as in air) and decorrelated stereo, instead of
  white noise × exponential. Two sizes: `hall` (temple, valley) and `open` (plain, town).
- **Distance.** `place(sig, dist, pan)`: farther = quieter, duller (air absorption low-pass),
  wetter, narrower. A train across the tile and a bell at the camera finally sound different.
- **Master bus.** Low-cut under 30 Hz, a gentle glue compressor, and a look-ahead limiter in
  place of `tanh`, so beats no longer jump out and the clip sits at a steady loudness.

### 2. Procedural SFX (the weakest part today)
Recipes after Andy Farnell, *Designing Sound*: model what makes the sound, not its spectrum.
- **Steam train:** four exhaust beats per wheel turn with an accented first beat, timing tied to
  speed (slowing into the station), steam hiss, rail-joint clicks, brake squeal, and a chime
  whistle (three pipes, breath noise, pitch settling on the attack).
- Next: ox-cart wheels (stick-slip creak), footsteps on earth, water and rain (bubble
  population), fire, fireworks (launch whistle, burst, crackle tail), crowd murmur (many
  detuned formant voices), engines (harmonic series on an RPM curve).

### 3. Physical models of the Thai instruments
- **พิณ:** Karplus–Strong string (pluck position, string damping, body resonance filter).
- **แคน:** free-reed oscillator through a pipe resonance, with the breath.
- **ระนาด / ฆ้อง / ระฆัง:** modal synthesis, each mode with its own decay; the strike
  position chooses which modes ring.

### 4. Process
- Every new instrument goes into `synth.py` as an opt-in function: posted cities keep their
  sound unless their script asks for the new one.
- An A/B pair (before/after mp3) for each change; the owner listens before a city switches.
- Loudness is measured (RMS per beat, peak) the way the render checks measure luma.

## Sample (this PR)
Phase 1 (space, distance, master bus) plus the phase-2 steam train and the phase-3 พิณ, applied
to Khon Kaen as an A/B. The committed Khon Kaen soundtrack is unchanged.
