import '@fontsource/kanit/400.css';
import '@fontsource/kanit/500.css';
import '@fontsource/kanit/600.css';
import '@fontsource/kanit/700.css';
import {Composition} from 'remotion';
import {DioramaComposition} from './engine/DioramaComposition';
import {FPS, H, SECONDS, W} from './lib';
import {KORAT} from './cities/korat';
// New city: import it here, add a component and a <Composition> below (check_story looks for
// the "./cities/<city>'" import in this file).

const Korat: React.FC = () => <DioramaComposition city={{...KORAT, look: 'shader'}} />;
const KoratPlain: React.FC = () => <DioramaComposition city={KORAT} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Korat" component={Korat} durationInFrames={(KORAT.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
    <Composition id="KoratPlain" component={KoratPlain} durationInFrames={(KORAT.story.duration ?? SECONDS) * FPS} fps={FPS} width={W} height={H} />
  </>
);
