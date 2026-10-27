# Phetchabun v1: render spec for the workstation [local]

Branch `city/phetchabun` (PR #72), head after this file. The owner passed the v1 stills
(`phetchabun_v1_contact.jpg`) on 27 Oct 2026. **Shader look only** (owner's rule, 26 Oct): the
`Phetchabun` composition already has `look: 'shader'`, so there is no plain cut to render.

## Steps

```bash
git fetch origin && git checkout city/phetchabun && git pull
npm ci                      # only if package-lock changed since your last install
npm run check               # must end with 0 error(s); phetchabun's soundtrack -16.0 LUFS
npm run render:phetchabun   # runs check_story phetchabun, then -> out/phetchabun_look.mp4 (1800 frames, 60 s)
npm run encode -- phetchabun_look
#   -> renders/phetchabun_look.mp4 (shareable, <100 MB) and out/phetchabun_look_social.mp4 (upload copy)
#   encode must print "all checks passed" (flicker, dark nights, tagging)
gh release upload renders out/phetchabun_look_social.mp4 --clobber
```

The soundtrack (`public/soundtrack_phetchabun.wav`) is committed; do not regenerate it unless
`npm run audio:phetchabun` is asked for.

## Look at these moments in the render (stills can't show motion)

| s | what must be true |
|---|---|
| 0–2.5 | the burst is up at frame 0; the image rises **upright, never turning or spinning**, the halo opens ~1.6 s |
| 4.9–6.9 | the image settles smoothly to raft size onto the raft; no jump, no blink |
| 7.7–12.6 | the raft with the image (visible between the four parasols) and six rowing boats stay on the water, bows on the river line, down to Wat Traiphum |
| 13–18.6 | the wall rises round from the north-west corner; forts, gates and both water gates appear in order; no wall in the river |
| 19–24.6 | the army walks up from the south, elephants in front, reaches the camp; the palisade falls; nobody walks through a wall or the river |
| 25–30.6 | Nakhonban's roads cut and halls rise; the callout `นครบาลเพชรบูรณ์` points at the halls |
| 31–36.4 | the trucks drive south on the road (not on water, not through orchards) |
| 43–52.6 | the rite: the governor wades in from the west bank holding the image, three dips, **the image never goes fully under**; the high water has no zigzag edge against the river |
| any | no black frame (shader bloom: CLAUDE.md "Bloom can black out a whole frame"), no luma jump over 8 |

## Report back on PR #72

- encode's check output, render time, file sizes;
- a contact sheet from the render: `shots/phetchabun/render_contact.jpg` (frames 0, 30, 66, 150,
  210, 345, 540, 645, 720, 870, 990, 1200, 1410, 1500, 1590, 1740);
- anything in the table above that is wrong, with its second.
