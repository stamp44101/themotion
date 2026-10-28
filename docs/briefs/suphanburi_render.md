# Suphanburi v1: render spec for the workstation [local]

Branch `city/suphanburi` (PR #73), head after this file. The owner passed the v1 stills
(`suphanburi_v1_contact.jpg`, with the cover fix in 900619c) on 27 Oct 2026. **Shader look only**: the
`Suphanburi` composition has `look: 'shader'`.

## Steps

```bash
git fetch origin && git checkout city/suphanburi && git pull
npm run check                     # must end with 0 error(s); suphanburi's soundtrack -16.0 LUFS
npm run render:suphanburi         # runs check_story suphanburi, then -> out/suphanburi_look.mp4 (1800 frames, 60 s)
npm run encode -- suphanburi_look # must print "all checks passed"
gh release upload renders out/suphanburi_look_social.mp4 --clobber
```

The soundtrack (`public/soundtrack_suphanburi.wav`) is committed; do not regenerate it.

## Look at these moments in the render (stills can't show motion)

| s | what must be true |
|---|---|
| 0–0.6 | the two giant elephants are already charging at frame 0 and meet at ~0.55 s; the golden flash and dust burst read; the whole tile (forest, town, river) is behind them |
| 0–7.4 | the field and both elephants stay **on the tile** all the way (the owner caught the field running off its edge on a still) |
| 0.6–3 | the Siamese elephant (red) drives the other (green) aside; **no rider falls, no glaive strikes a body** |
| 4.9–6.9 | the giants and the stupa settle smoothly to the field's scale; no jump or blink; they vanish only after the camera has left (~7.8 s) |
| 7.7–12.6 | Luang Pho To stays visible while the hall's walls rise (the hall is open on the camera's side) |
| 13–18.6 | the royal barge and six boats stay on the Tha Chin, bows on the river line, up to Wat Khae |
| 25–30.6 | the red mail boats on the water, not on the banks |
| 31–36.4 | the buses come through the west gate on the road, none on water or through houses |
| 43–52.6 | the re-enactment: two charges, the elephants meet and part; the stupa is visible beside them; no crowd on the arena |
| any | no black frame (shader bloom), no luma jump over 8 |

## Report back on PR #73

- encode's check output, render time, file sizes;
- a contact sheet from the render: `shots/suphanburi/render_contact.jpg` (frames 0, 16, 66, 150, 210, 300,
  470, 640, 840, 990, 1200, 1380, 1500, 1590);
- anything in the table above that is wrong, with its second.
