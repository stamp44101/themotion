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
import {UBON} from './cities/ubon';
import {SURIN} from './cities/surin';
import {NAN} from './cities/nan';
import {PHETCHABUN} from './cities/phetchabun';
import {SUPHANBURI} from './cities/suphanburi';
import {UDONTHANI} from './cities/udonthani';
import {LOPBURI} from './cities/lopburi';
import {PHETCHABURI} from './cities/phetchaburi';
import {CHIANGRAI} from './cities/chiangrai';
import {PHUKET} from './cities/phuket';
import {CELEBRATION} from './styleframes/celebration';
import {CHIANGRAI_CLOSE, CHIANGRAI_FRONT, CHIANGRAI_QUARTER} from './styleframes/chiangrai';
import {PHUKET_DREDGE, PHUKET_GREEN, PHUKET_GREEN_CALLBACK, PHUKET_MIXED, PHUKET_MIXED_CALLBACK, PHUKET_TURTLE, PHUKET_TURTLE_CALLBACK} from './styleframes/phuket';
import {KHONKAEN_DINO, KHONKAEN_STUPA, KHONKAEN_TAMARIND} from './styleframes/khonkaen';
import {UBON_CANDLE, UBON_ELEPHANT, UBON_FISH, UBON_NAGA} from './styleframes/ubon';
import {HanumanFaces, LOPBURI_HANUMAN} from './styleframes/lopburi';
import {LAMPANG_CHEDI, LAMPANG_ELEPHANT, LAMPANG_CARRIAGE, LAMPANG_HORSE} from './styleframes/lampang';
import {DioramaComposition} from './engine/DioramaComposition';
import {NagaStudy} from './styleframes/NagaStudy';
import {SURIN_HERD, SURIN_LASSO, SURIN_WHITE} from './styleframes/surin';
import {NAN_BOAT, NAN_RACE} from './styleframes/nan';
import {PHETCHABUN_A1, PHETCHABUN_A2} from './styleframes/phetchabun';
import {SUPHANBURI_A1, SUPHANBURI_A2} from './styleframes/suphanburi';
import {UDON_A1, UDON_A2} from './styleframes/udonthani';
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
const Ubon: React.FC = () => <DioramaComposition city={UBON} />;
const Surin: React.FC = () => <DioramaComposition city={SURIN} />;
const Nan: React.FC = () => <DioramaComposition city={NAN} />;
const Phetchabun: React.FC = () => <DioramaComposition city={PHETCHABUN} />;
const Suphanburi: React.FC = () => <DioramaComposition city={SUPHANBURI} />;
const Udonthani: React.FC = () => <DioramaComposition city={UDONTHANI} />;
const Lopburi: React.FC = () => <DioramaComposition city={LOPBURI} />;
const Phetchaburi: React.FC = () => <DioramaComposition city={PHETCHABURI} />;
const ChiangRai: React.FC = () => <DioramaComposition city={CHIANGRAI} />;
const Phuket: React.FC = () => <DioramaComposition city={PHUKET} />;
// shader-look preview (issue #27), for still-vs-still checks of the PR #53 blackout
const PhetchaburiLook: React.FC = () => <DioramaComposition city={{...PHETCHABURI, look: 'shader'}} />;
const Celebration: React.FC = () => <DioramaComposition city={CELEBRATION} />;
const ChiangRaiStyleFront: React.FC = () => <DioramaComposition city={CHIANGRAI_FRONT} />;
const ChiangRaiStyleQuarter: React.FC = () => <DioramaComposition city={CHIANGRAI_QUARTER} />;
const ChiangRaiStyleClose: React.FC = () => <DioramaComposition city={CHIANGRAI_CLOSE} />;
const PhuketStyleTurtle: React.FC = () => <DioramaComposition city={PHUKET_TURTLE} />;
const PhuketStyleDredge: React.FC = () => <DioramaComposition city={PHUKET_DREDGE} />;
const PhuketStyleCallback: React.FC = () => <DioramaComposition city={PHUKET_TURTLE_CALLBACK} />;
const PhuketStyleMixed: React.FC = () => <DioramaComposition city={PHUKET_MIXED} />;
const PhuketStyleMixedCallback: React.FC = () => <DioramaComposition city={PHUKET_MIXED_CALLBACK} />;
const PhuketStyleGreen: React.FC = () => <DioramaComposition city={PHUKET_GREEN} />;
const PhuketStyleGreenCallback: React.FC = () => <DioramaComposition city={PHUKET_GREEN_CALLBACK} />;
const KhonKaenStyleDino: React.FC = () => <DioramaComposition city={KHONKAEN_DINO} />;
const KhonKaenStyleTamarind: React.FC = () => <DioramaComposition city={KHONKAEN_TAMARIND} />;
const KhonKaenStyleStupa: React.FC = () => <DioramaComposition city={KHONKAEN_STUPA} />;
const UbonStyleFish: React.FC = () => <DioramaComposition city={UBON_FISH} />;
const UbonStyleCandle: React.FC = () => <DioramaComposition city={UBON_CANDLE} />;
const UbonStyleElephant: React.FC = () => <DioramaComposition city={UBON_ELEPHANT} />;
const UbonStyleNaga: React.FC = () => <DioramaComposition city={UBON_NAGA} />;
const SurinStyleHerd: React.FC = () => <DioramaComposition city={SURIN_HERD} />;
const SurinStyleLasso: React.FC = () => <DioramaComposition city={SURIN_LASSO} />;
const SurinStyleWhite: React.FC = () => <DioramaComposition city={SURIN_WHITE} />;
const NanStyleBoat: React.FC = () => <DioramaComposition city={NAN_BOAT} />;
const NanStyleRace: React.FC = () => <DioramaComposition city={NAN_RACE} />;
const PhetchabunStyleA1: React.FC = () => <DioramaComposition city={PHETCHABUN_A1} />;
const PhetchabunStyleA2: React.FC = () => <DioramaComposition city={PHETCHABUN_A2} />;
const SuphanburiStyleA1: React.FC = () => <DioramaComposition city={SUPHANBURI_A1} />;
const SuphanburiStyleA2: React.FC = () => <DioramaComposition city={SUPHANBURI_A2} />;
const UdonStyleA1: React.FC = () => <DioramaComposition city={UDON_A1} />;
const UdonStyleA2: React.FC = () => <DioramaComposition city={UDON_A2} />;
const LopburiStyleHanuman: React.FC = () => <DioramaComposition city={LOPBURI_HANUMAN} />;
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
    <Composition id="UbonStyleFish" component={UbonStyleFish} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UbonStyleCandle" component={UbonStyleCandle} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UbonNagaStudy" component={NagaStudy} durationInFrames={4} fps={FPS} width={1080} height={1080} />
    <Composition id="LopburiHanumanFaces" component={HanumanFaces} durationInFrames={2} fps={FPS} width={1800} height={760} />
    <Composition id="LopburiStyleHanuman" component={LopburiStyleHanuman} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UbonStyleNaga" component={UbonStyleNaga} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SurinStyleHerd" component={SurinStyleHerd} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SurinStyleLasso" component={SurinStyleLasso} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SurinStyleWhite" component={SurinStyleWhite} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="NanStyleBoat" component={NanStyleBoat} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="NanStyleRace" component={NanStyleRace} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhetchabunStyleA1" component={PhetchabunStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhetchabunStyleA2" component={PhetchabunStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SuphanburiStyleA1" component={SuphanburiStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SuphanburiStyleA2" component={SuphanburiStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UdonStyleA1" component={UdonStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UdonStyleA2" component={UdonStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UbonStyleElephant" component={UbonStyleElephant} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChiangRaiStyleFront" component={ChiangRaiStyleFront} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChiangRaiStyleQuarter" component={ChiangRaiStyleQuarter} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChiangRaiStyleClose" component={ChiangRaiStyleClose} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhuketStyleTurtle" component={PhuketStyleTurtle} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhuketStyleDredge" component={PhuketStyleDredge} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhuketStyleCallback" component={PhuketStyleCallback} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhuketStyleMixed" component={PhuketStyleMixed} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhuketStyleMixedCallback" component={PhuketStyleMixedCallback} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhuketStyleGreen" component={PhuketStyleGreen} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="PhuketStyleGreenCallback" component={PhuketStyleGreenCallback} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaenStyleDino" component={KhonKaenStyleDino} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaenStyleTamarind" component={KhonKaenStyleTamarind} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaenStyleStupa" component={KhonKaenStyleStupa} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Lopburi" component={Lopburi} durationInFrames={(LOPBURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Ubon" component={Ubon} durationInFrames={(UBON.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Surin" component={Surin} durationInFrames={(SURIN.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Nan" component={Nan} durationInFrames={(NAN.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Phetchabun" component={Phetchabun} durationInFrames={(PHETCHABUN.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Suphanburi" component={Suphanburi} durationInFrames={(SUPHANBURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Udonthani" component={Udonthani} durationInFrames={(UDONTHANI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KhonKaen" component={KhonKaen} durationInFrames={(KHONKAEN.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Phetchaburi" component={Phetchaburi} durationInFrames={(PHETCHABURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChiangRai" component={ChiangRai} durationInFrames={(CHIANGRAI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Phuket" component={Phuket} durationInFrames={(PHUKET.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
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
