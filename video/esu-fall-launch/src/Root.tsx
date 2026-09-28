import React from 'react';
import {Composition} from 'remotion';
import {ESU_FallLaunch, TOTAL_FRAMES} from './compositions/ESU_FallLaunch';
import {FPS, HEIGHT, WIDTH} from './presets/brand';

export const Root: React.FC = () => (
  <>
    <Composition
      id="ESU-FallLaunch"
      component={ESU_FallLaunch}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
