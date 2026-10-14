// Stops before a render on a Node that Remotion 4.0.242 cannot run on.
//
// Node 26 breaks extract-zip, which Remotion uses to unpack Chrome Headless Shell
// on the first render: the unzip stops part-way and the process exits with code 0
// and no message. The next run finds the half-unpacked folder, trusts it, and dies
// with "spawn Unknown system error -88" (macOS) on a truncated binary. Node 22, 24
// and 25 unpack it correctly.
import fs from 'node:fs';

const major = +process.versions.node.split('.')[0];
if (major < 18 || major >= 26) {
  const cache = 'node_modules/.remotion';
  console.error(
    `Node ${process.versions.node} is not supported here; use Node 22 or 24 (LTS).\n` +
      `  macOS:   brew install node@22 && export PATH="$(brew --prefix node@22)/bin:$PATH"\n` +
      `  Windows: winget install OpenJS.NodeJS.LTS\n` +
      (fs.existsSync(cache)
        ? `Then delete ${cache} -- it may hold a half-unpacked Chrome from this Node:\n  rm -rf ${cache}   (PowerShell: Remove-Item -Recurse -Force ${cache})\n`
        : ''),
  );
  process.exit(1);
}
