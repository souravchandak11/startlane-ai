import '@fontsource/anton/400.css';
import '@fontsource/bebas-neue/400.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import {Composition} from 'remotion';
import {ESU_Script01_TooLate, SCRIPT01_DURATION} from './compositions/ESU_Script01_TooLate';
import {ESU_Script04_OutgrewRec, SCRIPT04_DURATION} from './compositions/ESU_Script04_OutgrewRec';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="ESU-Script01-TooLate"
      component={ESU_Script01_TooLate}
      durationInFrames={SCRIPT01_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="ESU-Script04-OutgrewRec"
      component={ESU_Script04_OutgrewRec}
      durationInFrames={SCRIPT04_DURATION}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
