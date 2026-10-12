import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {Overlay} from './Overlay';
import {Scene} from './Scene';

export const ChiangMaiTimelapse: React.FC = () => {
  const [handle] = useState(() => delayRender('Loading Kanit'));
  useEffect(() => {
    Promise.all(
      ['400', '500', '600', '700'].map((w) => document.fonts.load(`${w} 40px Kanit`, 'เชียงใหม่ 0123')),
    ).then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{backgroundColor: '#0b1020'}}>
      <Scene />
      <Overlay />
    </AbsoluteFill>
  );
};
