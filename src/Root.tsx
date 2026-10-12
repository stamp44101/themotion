import '@fontsource/kanit/400.css';
import '@fontsource/kanit/500.css';
import '@fontsource/kanit/600.css';
import '@fontsource/kanit/700.css';
import {Composition} from 'remotion';
import {ChiangMaiTimelapse} from './ChiangMaiTimelapse';
import {FPS, H, SECONDS, W} from './lib';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ChiangMaiTimelapse"
    component={ChiangMaiTimelapse}
    durationInFrames={SECONDS * FPS}
    fps={FPS}
    width={W}
    height={H}
  />
);
