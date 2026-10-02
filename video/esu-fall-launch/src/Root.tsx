import React from 'react';
import {Composition} from 'remotion';
import {ESU_FallLaunch, TOTAL_FRAMES} from './compositions/ESU_FallLaunch';
import {ESU_FallLaunchFootage, FOOTAGE_TOTAL} from './compositions/ESU_FallLaunchFootage';
import {FPS, HEIGHT, WIDTH} from './presets/brand';
import {MDM, MDM_TOTAL} from './mdm/MDM';

export const Root: React.FC = () => (
  <>
    {/* Final: real footage + MMH motion graphics, both logos */}
    <Composition
      id="ESU-FallLaunch"
      component={ESU_FallLaunchFootage}
      durationInFrames={FOOTAGE_TOTAL}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Motion-graphics-only cut (no live footage) */}
    <Composition
      id="ESU-FallLaunch-Graphics"
      component={ESU_FallLaunch}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Mommy, Daddy & Me (Parent-Assisted Toddler 12–24 mo): fully animated */}
    <Composition id="ESU-MommyDaddyMe" component={MDM} durationInFrames={MDM_TOTAL} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
