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
import {LAMPANG} from './cities/lampang';
import {KHONKAEN} from './cities/khonkaen';
import {PHETCHABURI} from './cities/phetchaburi';
import {CELEBRATION} from './styleframes/celebration';
import {CHIANGRAI_CLOSE, CHIANGRAI_FRONT, CHIANGRAI_QUARTER} from './styleframes/chiangrai';
import {KHONKAEN_DINO, KHONKAEN_STUPA, KHONKAEN_TAMARIND} from './styleframes/khonkaen';
import {LAMPANG_CHEDI, LAMPANG_ELEPHANT, LAMPANG_CARRIAGE, LAMPANG_HORSE} from './styleframes/lampang';
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
const Lampang: React.FC = () => <DioramaComposition city={LAMPANG} />;
const KhonKaen: React.FC = () => <DioramaComposition city={KHONKAEN} />;
const Phetchaburi: React.FC = () => <DioramaComposition city={PHETCHABURI} />;
// shader-look preview (issue #27), for still-vs-still checks of the PR #53 blackout
const PhetchaburiLook: React.FC = () => <DioramaComposition city={{...PHETCHABURI, look: 'shader'}} />;
const Celebration: React.FC = () => <DioramaComposition city={CELEBRATION} />;
const ChiangRaiStyleFront: React.FC = () => <DioramaComposition city={CHIANGRAI_FRONT} />;
const ChiangRaiStyleQuarter: React.FC = () => <DioramaComposition city={CHIANGRAI_QUARTER} />;
const ChiangRaiStyleClose: React.FC = () => <DioramaComposition city={CHIANGRAI_CLOSE} />;
const KhonKaenStyleDino: React.FC = () => <DioramaComposition city={KHONKAEN_DINO} />;
const KhonKaenStyleTamarind: React.FC = () => <DioramaComposition city={KHONKAEN_TAMARIND} />;
const KhonKaenStyleStupa: React.FC = () => <DioramaComposition city={KHONKAEN_STUPA} />;
const LampangStyleElephant: React.FC = () => <DioramaComposition city={LAMPANG_ELEPHANT} />;
const LampangStyleChedi: React.FC = () => <DioramaComposition city={LAMPANG_CHEDI} />;
const LampangStyleCarriage: React.FC = () => <DioramaComposition city={LAMPANG_CARRIAGE} />;
const LampangStyleHorse: React.FC = () => <DioramaComposition city={LAMPANG_HORSE} />;
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
    <Composition id="Celebration" component={Celebration} durationInFrames={60 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChiangRaiStyleFront" component={ChiangRaiStyleFront} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChiangRaiStyleQuarter" component={ChiangRaiStyleQuarter} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChiangRaiStyleClose" component={ChiangRaiStyleClose} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaenStyleDino" component={KhonKaenStyleDino} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaenStyleTamarind" component={KhonKaenStyleTamarind} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaenStyleStupa" component={KhonKaenStyleStupa} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaen" component={KhonKaen} durationInFrames={(KHONKAEN.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Phetchaburi" component={Phetchaburi} durationInFrames={(PHETCHABURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhetchaburiLook" component={PhetchaburiLook} durationInFrames={(PHETCHABURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Lampang" component={Lampang} durationInFrames={(LAMPANG.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="LampangStyleElephant" component={LampangStyleElephant} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="LampangStyleChedi" component={LampangStyleChedi} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="LampangStyleCarriage" component={LampangStyleCarriage} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="LampangStyleHorse" component={LampangStyleHorse} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
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
