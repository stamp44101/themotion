import '@fontsource/kanit/400.css';
import '@fontsource/kanit/500.css';
import '@fontsource/kanit/600.css';
import '@fontsource/kanit/700.css';
import {Composition} from 'remotion';
import {ChiangMaiTimelapse} from './ChiangMaiTimelapse';
import {ChiangMaiIso} from './iso/IsoComposition';
import {KORAT} from './cities/korat';
import {AYUTTHAYA} from './cities/ayutthaya';
import {SUKHOTHAI} from './cities/sukhothai';
import {PHITSANULOK} from './cities/phitsanulok';
import {CHACHOENGSAO} from './cities/chachoengsao';
import {NAKHONSAWAN} from './cities/nakhonsawan';
import {CHONBURI} from './cities/chonburi';
import {NAKHONSI} from './cities/nakhonsi';
import {DioramaComposition} from './engine/DioramaComposition';
import {WAT_RAI_KHING_FRAMES, WatRaiKhing} from './landmarks/watraikhing/WatRaiKhing';

const Korat: React.FC = () => <DioramaComposition city={KORAT} />;
// Issue #27 preview: Korat with the opt-in shader look, for still-vs-still comparison only.
const KoratLook: React.FC = () => <DioramaComposition city={{...KORAT, look: 'shader'}} />;
const Ayutthaya: React.FC = () => <DioramaComposition city={AYUTTHAYA} />;
const Sukhothai: React.FC = () => <DioramaComposition city={SUKHOTHAI} />;
const Phitsanulok: React.FC = () => <DioramaComposition city={PHITSANULOK} />;
const Chachoengsao: React.FC = () => <DioramaComposition city={CHACHOENGSAO} />;
const NakhonSawan: React.FC = () => <DioramaComposition city={NAKHONSAWAN} />;
const Chonburi: React.FC = () => <DioramaComposition city={CHONBURI} />;
const NakhonSi: React.FC = () => <DioramaComposition city={NAKHONSI} />;
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
    <Composition id="WatRaiKhing" component={WatRaiKhing} durationInFrames={WAT_RAI_KHING_FRAMES} fps={FPS} width={W} height={H} />
    <Composition id="Chachoengsao" component={Chachoengsao} durationInFrames={(CHACHOENGSAO.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="NakhonSawan" component={NakhonSawan} durationInFrames={(NAKHONSAWAN.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Chonburi" component={Chonburi} durationInFrames={(CHONBURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Phitsanulok" component={Phitsanulok} durationInFrames={(PHITSANULOK.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Sukhothai" component={Sukhothai} durationInFrames={(SUKHOTHAI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Ayutthaya" component={Ayutthaya} durationInFrames={(AYUTTHAYA.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Korat" component={Korat} durationInFrames={(KORAT.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="NakhonSi" component={NakhonSi} durationInFrames={(NAKHONSI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
      <Composition id="KoratLook" component={KoratLook} durationInFrames={(KORAT.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
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
