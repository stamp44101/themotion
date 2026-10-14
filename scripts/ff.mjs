// Runs the ffmpeg/ffprobe that ships with Remotion, so nothing extra has to be
// installed on Windows or macOS. Arguments must not contain spaces (Windows runs
// npx through cmd.exe, which does not quote them).
import {spawnSync} from 'node:child_process';

const run = (tool, args, opts = {}) => {
  const r = spawnSync('npx', ['remotion', tool, ...args], {
    shell: process.platform === 'win32',
    encoding: 'utf8',
    maxBuffer: 1 << 26,
    stdio: opts.inherit ? 'inherit' : 'pipe',
  });
  if (r.status !== 0) throw new Error(`${tool} ${args.join(' ')} failed:\n${r.stderr ?? ''}`);
  return r.stdout;
};

export const ffmpeg = (args, opts) => run('ffmpeg', ['-hide_banner', '-v', 'error', '-y', ...args], opts);
export const ffprobe = (file) =>
  JSON.parse(
    run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size', '-show_entries', 'stream=codec_type,color_range,color_space', '-of', 'json', file]),
  );
