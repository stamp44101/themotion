# Rendering on your own machine

The cloud container renders the 3D cities in software (~40-60 min each). A
machine with a real GPU does the same in a minute or two: a Windows RTX 4070
measured 1 m 15 s for 1800 frames. The commands are the same on Windows and
macOS; only the install step differs.

## One-time setup

**Windows (PowerShell)**
```powershell
winget install OpenJS.NodeJS.LTS Git.Git
# close and reopen PowerShell, then:
git clone https://github.com/stamp44101/themotion.git
cd themotion
npm ci
```

**macOS (Apple Silicon, Terminal)**
```bash
brew install node git
git clone https://github.com/stamp44101/themotion.git
cd themotion
npm ci
```

Nothing else is needed for rendering and encoding: Remotion downloads its own
headless Chrome on the first render and ships its own ffmpeg, which the scripts
use. Python is only needed to regenerate a soundtrack; the `.wav` files are
already in the repo.

## Render one city

```bash
git pull
npm run check                  # typecheck + caption/callout timing for every city
npm run render:chachoengsao    # -> out/chachoengsao.mp4 (master, ~130 MB)
npm run encode -- chachoengsao # -> renders/chachoengsao.mp4 + out/chachoengsao_tiktok.mp4, then checks them
```

`render:<city>` refuses to start if that city's captions or callouts are
mistimed. `encode` prints `all checks passed` or lists what failed (light that
jumps between frames, nights that go too dark, a repo copy over 100 MB or
mis-tagged). **Do not post a render that failed.**

- Upload `out/<city>_tiktok.mp4` to TikTok, from the web rather than the phone app.
- `renders/<city>.mp4` is the repo copy.
- `out/` is never committed.

City names: `korat`, `ayutthaya`, `sukhothai`, `phitsanulok`, `chachoengsao`.
Chiang Mai is `npm run render:iso` followed by `npm run encode -- chiangmai-iso`.

## Render every city

**Windows (PowerShell)**
```powershell
foreach ($c in 'korat','ayutthaya','sukhothai','phitsanulok','chachoengsao') { npm run "render:$c"; if ($?) { npm run encode -- $c } }
```

**macOS**
```bash
for c in korat ayutthaya sukhothai phitsanulok chachoengsao; do npm run render:$c && npm run encode -- $c; done
```

## Commit the repo copies

```bash
git checkout -b rerender/<what>
git add renders/*.mp4
git commit -m "Re-render <cities> with <why>"
git push -u origin rerender/<what>
```
Then open a PR against the default branch.

## If something goes wrong

- **Black or blank frames, or `WebGL` errors:** the `render:` scripts already
  pass `--gl=angle`, which uses Direct3D 11 on Windows and Metal on macOS. On
  Windows, update the NVIDIA driver first.
- **The machine becomes unresponsive:** add `-- --concurrency=4` to the render
  command.
- **`python3` not found (Windows, audio only):** run the two halves of
  `audio:<city>` by hand, using `py -3` instead of `python3`.
