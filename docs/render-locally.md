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
git clone --filter=blob:none --no-checkout https://github.com/stamp44101/themotion.git
cd themotion
git sparse-checkout set --no-cone '/*' '!/renders/'
git checkout claude/busy-brown-ba1fp4
npm ci
```

**macOS (Apple Silicon, Terminal)**
```bash
brew install node@22 git
echo 'export PATH="$(brew --prefix node@22)/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
git clone --filter=blob:none --no-checkout https://github.com/stamp44101/themotion.git
cd themotion
git sparse-checkout set --no-cone '/*' '!/renders/'
git checkout claude/busy-brown-ba1fp4
npm ci
```

The two extra flags skip the videos. A plain `git clone` downloads every
render ever committed (over 1 GB of mp4, 20 versions) plus the current
`renders/` (~360 MB); this way the clone is ~135 MB, almost all of it the
soundtracks. Old versions are fetched only if you ask for them.

**Use Node 22 or 24, not 26.** Node 26 breaks the unzip Remotion uses to
unpack Chrome on the first render: it stops half-way without an error, and every
later render fails with `spawn Unknown system error -88`. The scripts refuse to
run on Node 26. If you already hit it, switch Node and run `rm -rf node_modules
&& npm ci`.

Nothing else is needed for rendering and encoding: Remotion downloads its own
headless Chrome on the first render and ships its own ffmpeg, which the scripts
use. Python is only needed to regenerate a soundtrack; the `.wav` files are
already in the repo.

## Render one city

```bash
git pull
npm run check                  # typecheck + caption/callout timing for every city
npm run render:chachoengsao && npm run encode -- chachoengsao
# render -> out/chachoengsao.mp4 (master, ~130 MB)
# encode -> renders/chachoengsao.mp4 + out/chachoengsao_tiktok.mp4, then checks them
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

## How fast is this machine?

```bash
npm run bench
```
Renders the first 10 s of Chachoengsao (300 frames, no audio) twice at each of
4 concurrency levels and prints the mean time per level. Divide 300 by the
time for frames per second; a 60 s city is 1800 frames. Use the fastest
concurrency for real renders: `npm run render:<city> -- --concurrency=N`.
The whole benchmark renders about as much as one full city.

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
git add --sparse renders/<city>.mp4   # --sparse because renders/ is not checked out
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
