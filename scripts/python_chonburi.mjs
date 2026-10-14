import {spawnSync} from 'node:child_process';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: node scripts/python_chonburi.mjs <script.py> [args...]');
  process.exit(2);
}

const candidates =
  process.platform === 'win32'
    ? [
        ['py', ['-3']],
        ['python', []],
        ['python3', []],
      ]
    : [
        ['python3', []],
        ['python', []],
      ];

for (const [command, prefix] of candidates) {
  const result = spawnSync(command, [...prefix, ...args], {stdio: 'inherit'});
  if (result.error?.code === 'ENOENT') continue;
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

console.error('Python 3 was not found. Install it from https://www.python.org/downloads/');
process.exit(1);
