import React from 'react';
import {Composition} from 'remotion';
import {MetroReel} from './Metro';
import {METRO_VIDEOS} from './videos';

const IDS: Record<keyof typeof METRO_VIDEOS, string> = {
  A: 'ESU-Metro-A-PriceOfABench',
  B: 'ESU-Metro-B-TechnicallyBehind',
  C: 'ESU-Metro-C-ScholarshipMath',
  D: 'ESU-Metro-D-Unrushed',
  E: 'ESU-Metro-E-SeventyBy13',
};

export const MetroCompositions: React.FC = () => (
  <>
    {(Object.keys(METRO_VIDEOS) as (keyof typeof METRO_VIDEOS)[]).map((k) => {
      const {v, duration} = METRO_VIDEOS[k];
      const Comp = () => <MetroReel v={v} duration={duration} />;
      return <Composition key={k} id={IDS[k]} component={Comp} durationInFrames={duration} fps={30} width={1080} height={1920} />;
    })}
  </>
);
