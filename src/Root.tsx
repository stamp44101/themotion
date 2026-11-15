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
import {NAKHONPATHOM} from './cities/nakhonpathom';
import {RATCHABURI} from './cities/ratchaburi';
import {SARABURI} from './cities/saraburi';
import {SURATTHANI} from './cities/suratthani';
import {KANCHANABURI} from './cities/kanchanaburi';
import {SAKONNAKHON} from './cities/sakonnakhon';
import {CHANTHABURI} from './cities/chanthaburi';
import {UTTARADIT} from './cities/uttaradit';
import {YASOTHON} from './cities/yasothon';
import {KALASIN} from './cities/kalasin';
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
import {NKP_A1, NKP_A2, NKP_B} from './styleframes/nakhonpathom';
import {RATCHABURI_A1, RATCHABURI_A2, RATCHABURI_DRAGON} from './styleframes/ratchaburi';
import {SARABURI_A1, SARABURI_A2, SARABURI_B} from './styleframes/saraburi';
import {SURAT_A1, SURAT_A2, SURAT_B} from './styleframes/suratthani';
import {KANCH_A1, KANCH_A2, KANCH_B} from './styleframes/kanchanaburi';
import {SAKON_A1, SAKON_A2, SAKON_B} from './styleframes/sakonnakhon';
import {KALASIN_A1, KALASIN_A2, KALASIN_B} from './styleframes/kalasin';
import {SONGKHLA_A1, SONGKHLA_A2} from './styleframes/songkhla';
import {CHANTHABURI_A1, CHANTHABURI_A2, CHANTHABURI_B} from './styleframes/chanthaburi';
import {UTTARADIT_A1, UTTARADIT_A2, UTTARADIT_B} from './styleframes/uttaradit';
import {YASOTHON_A1, YASOTHON_A2, YASOTHON_B} from './styleframes/yasothon';
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
const Nakhonpathom: React.FC = () => <DioramaComposition city={NAKHONPATHOM} />;
const Ratchaburi: React.FC = () => <DioramaComposition city={RATCHABURI} />;
const Saraburi: React.FC = () => <DioramaComposition city={SARABURI} />;
const SuratThani: React.FC = () => <DioramaComposition city={SURATTHANI} />;
const Kanchanaburi: React.FC = () => <DioramaComposition city={KANCHANABURI} />;
const SakonNakhon: React.FC = () => <DioramaComposition city={SAKONNAKHON} />;
const Chanthaburi: React.FC = () => <DioramaComposition city={CHANTHABURI} />;
const Uttaradit: React.FC = () => <DioramaComposition city={UTTARADIT} />;
const Yasothon: React.FC = () => <DioramaComposition city={YASOTHON} />;
const Kalasin: React.FC = () => <DioramaComposition city={KALASIN} />;
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
const NkpStyleA1: React.FC = () => <DioramaComposition city={NKP_A1} />;
const NkpStyleA2: React.FC = () => <DioramaComposition city={NKP_A2} />;
const NkpStyleB: React.FC = () => <DioramaComposition city={NKP_B} />;
const RatchaburiStyleA1: React.FC = () => <DioramaComposition city={RATCHABURI_A1} />;
const RatchaburiStyleA2: React.FC = () => <DioramaComposition city={RATCHABURI_A2} />;
const RatchaburiDragon: React.FC = () => <DioramaComposition city={RATCHABURI_DRAGON} />;
const SaraburiStyleA1: React.FC = () => <DioramaComposition city={SARABURI_A1} />;
const SaraburiStyleA2: React.FC = () => <DioramaComposition city={SARABURI_A2} />;
const SaraburiStyleB: React.FC = () => <DioramaComposition city={SARABURI_B} />;
const SuratStyleA1: React.FC = () => <DioramaComposition city={SURAT_A1} />;
const SuratStyleA2: React.FC = () => <DioramaComposition city={SURAT_A2} />;
const SuratStyleB: React.FC = () => <DioramaComposition city={SURAT_B} />;
const KanchStyleA1: React.FC = () => <DioramaComposition city={KANCH_A1} />;
const KanchStyleA2: React.FC = () => <DioramaComposition city={KANCH_A2} />;
const KanchStyleB: React.FC = () => <DioramaComposition city={KANCH_B} />;
const SakonStyleA1: React.FC = () => <DioramaComposition city={SAKON_A1} />;
const KalasinStyleA1: React.FC = () => <DioramaComposition city={KALASIN_A1} />;
const KalasinStyleA2: React.FC = () => <DioramaComposition city={KALASIN_A2} />;
const KalasinStyleB: React.FC = () => <DioramaComposition city={KALASIN_B} />;
const SongkhlaStyleA1: React.FC = () => <DioramaComposition city={SONGKHLA_A1} />;
const SongkhlaStyleA2: React.FC = () => <DioramaComposition city={SONGKHLA_A2} />;
const SakonStyleA2: React.FC = () => <DioramaComposition city={SAKON_A2} />;
const SakonStyleB: React.FC = () => <DioramaComposition city={SAKON_B} />;
const ChanStyleA1: React.FC = () => <DioramaComposition city={CHANTHABURI_A1} />;
const ChanStyleA2: React.FC = () => <DioramaComposition city={CHANTHABURI_A2} />;
const ChanStyleB: React.FC = () => <DioramaComposition city={CHANTHABURI_B} />;
const UttStyleA1: React.FC = () => <DioramaComposition city={UTTARADIT_A1} />;
const UttStyleA2: React.FC = () => <DioramaComposition city={UTTARADIT_A2} />;
const UttStyleB: React.FC = () => <DioramaComposition city={UTTARADIT_B} />;
const YasoStyleA1: React.FC = () => <DioramaComposition city={YASOTHON_A1} />;
const YasoStyleA2: React.FC = () => <DioramaComposition city={YASOTHON_A2} />;
const YasoStyleB: React.FC = () => <DioramaComposition city={YASOTHON_B} />;
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
    <Composition id="NkpStyleA1" component={NkpStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="NkpStyleA2" component={NkpStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="NkpStyleB" component={NkpStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="RatchaburiStyleA1" component={RatchaburiStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="RatchaburiStyleA2" component={RatchaburiStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="RatchaburiDragon" component={RatchaburiDragon} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SaraburiStyleA1" component={SaraburiStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SaraburiStyleA2" component={SaraburiStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SaraburiStyleB" component={SaraburiStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SuratStyleA1" component={SuratStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SuratStyleA2" component={SuratStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SuratStyleB" component={SuratStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KanchStyleA1" component={KanchStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KanchStyleA2" component={KanchStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KanchStyleB" component={KanchStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SakonStyleA1" component={SakonStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KalasinStyleA1" component={KalasinStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KalasinStyleA2" component={KalasinStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KalasinStyleB" component={KalasinStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SongkhlaStyleA1" component={SongkhlaStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SongkhlaStyleA2" component={SongkhlaStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SakonStyleA2" component={SakonStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SakonStyleB" component={SakonStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChanStyleA1" component={ChanStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChanStyleA2" component={ChanStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="ChanStyleB" component={ChanStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UttStyleA1" component={UttStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UttStyleA2" component={UttStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="UttStyleB" component={UttStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="YasoStyleA1" component={YasoStyleA1} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="YasoStyleA2" component={YasoStyleA2} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="YasoStyleB" component={YasoStyleB} durationInFrames={10 * FPS} fps={FPS} width={W} height={H} />
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
    <Composition id="Nakhonpathom" component={Nakhonpathom} durationInFrames={(NAKHONPATHOM.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Ratchaburi" component={Ratchaburi} durationInFrames={(RATCHABURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Saraburi" component={Saraburi} durationInFrames={(SARABURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Kanchanaburi" component={Kanchanaburi} durationInFrames={(KANCHANABURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SakonNakhon" component={SakonNakhon} durationInFrames={(SAKONNAKHON.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Chanthaburi" component={Chanthaburi} durationInFrames={(CHANTHABURI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Uttaradit" component={Uttaradit} durationInFrames={(UTTARADIT.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Yasothon" component={Yasothon} durationInFrames={(YASOTHON.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Kalasin" component={Kalasin} durationInFrames={(KALASIN.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="SuratThani" component={SuratThani} durationInFrames={(SURATTHANI.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
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
