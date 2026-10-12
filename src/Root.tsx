import '@fontsource/kanit/400.css';
import '@fontsource/kanit/500.css';
import '@fontsource/kanit/600.css';
import '@fontsource/kanit/700.css';
import {Composition} from 'remotion';
import {ChiangMaiTimelapse} from './ChiangMaiTimelapse';
import {ChiangMaiIso} from './iso/IsoComposition';
import {ChiangMaiBackdrop} from './iso/IsoBackdrop';
import {KORAT} from './cities/korat';
import {AYUTTHAYA} from './cities/ayutthaya';
import {SUKHOTHAI} from './cities/sukhothai';
import {PHITSANULOK} from './cities/phitsanulok';
import {DioramaComposition} from './engine/DioramaComposition';

const Korat: React.FC = () => <DioramaComposition city={KORAT} />;
const Ayutthaya: React.FC = () => <DioramaComposition city={AYUTTHAYA} />;
const Sukhothai: React.FC = () => <DioramaComposition city={SUKHOTHAI} />;
const Phitsanulok: React.FC = () => <DioramaComposition city={PHITSANULOK} />;
import {FPS, H, SECONDS, W} from './lib';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ChiangMaiTimelapse"
      component={ChiangMaiTimelapse}
      durationInFrames={SECONDS * FPS}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition id="Phitsanulok" component={Phitsanulok} durationInFrames={(PHITSANULOK.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Sukhothai" component={Sukhothai} durationInFrames={(SUKHOTHAI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Ayutthaya" component={Ayutthaya} durationInFrames={(AYUTTHAYA.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Korat" component={Korat} durationInFrames={(KORAT.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition
      id="ChiangMaiBackdrop"
      component={ChiangMaiBackdrop}
      durationInFrames={SECONDS * FPS}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="ChiangMaiIso"
      component={ChiangMaiIso}
      durationInFrames={SECONDS * FPS}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
