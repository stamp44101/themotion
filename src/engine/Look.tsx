import {Bloom, EffectComposer, N8AO, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import React from 'react';
import {useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {FPS, lighting} from '../lib';
import type {CityConfig} from './types';

// Post-processing for cities that opt in with `look: 'shader'` (issue #27). Every effect here
// must be spatial: Remotion renders frames independently and in parallel, so anything that
// accumulates over frames (TAA, temporal denoise, motion-blur history) comes out wrong.
// The canvas is transparent (the sky is CSS behind it), so the composer keeps alpha.
// Once effects run, the scene goes to a float buffer and three's own ACES tone mapping is
// skipped, so it is applied here as the last effect instead.
export const Look: React.FC<{c: CityConfig}> = ({c}) => {
  const t = useCurrentFrame() / FPS;
  if (c.look !== 'shader') return null;
  const {night} = lighting(t, c.story.duration ?? 60);
  // Lit windows only reach ~0.4 luminance, under any threshold that would leave sunlit roofs
  // alone in daytime, so bloom is driven by the night: none by day, full glow at night.
  return (
    <EffectComposer multisampling={8} frameBufferType={THREE.HalfFloatType}>
      <N8AO aoRadius={2.5} intensity={2.2} distanceFalloff={1} quality="high" halfRes={false} />
      <Bloom intensity={1.8 * night} luminanceThreshold={0.3} luminanceSmoothing={0.2} mipmapBlur />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
};
