import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Fonts are vendored in public/fonts (OFL, from github.com/google/fonts) so the
// render never depends on the network.
const faces: {family: string; file: string; weight?: string; style?: string}[] = [
  {family: 'Montserrat', file: 'Montserrat-VF.ttf', weight: '100 900'},
  {family: 'Montserrat', file: 'Montserrat-Italic-VF.ttf', weight: '100 900', style: 'italic'},
  {family: 'Bebas Neue', file: 'BebasNeue-Regular.ttf'},
  {family: 'Anton', file: 'Anton-Regular.ttf'},
  {family: 'Instrument Serif', file: 'InstrumentSerif-Regular.ttf'},
  {family: 'Instrument Serif', file: 'InstrumentSerif-Italic.ttf', style: 'italic'},
  {family: 'Oswald', file: 'Oswald-VF.ttf', weight: '200 700'},
  {family: 'Poppins', file: 'Poppins-Medium.ttf', weight: '500'},
  {family: 'Poppins', file: 'Poppins-SemiBold.ttf', weight: '600'},
  {family: 'Poppins', file: 'Poppins-Bold.ttf', weight: '700'},
  {family: 'Poppins', file: 'Poppins-ExtraBold.ttf', weight: '800'},
  {family: 'Poppins', file: 'Poppins-Black.ttf', weight: '900'},
  {family: 'Inter', file: 'Inter-VF.ttf', weight: '100 900'},
];

export const loadAllFonts = () =>
  Promise.all(
    faces.map((f) =>
      loadFont({
        family: f.family,
        url: staticFile(`fonts/${f.file}`),
        weight: f.weight,
        style: f.style,
      }),
    ),
  );

export const FONT = {
  display: '"Bebas Neue", Anton, sans-serif',
  heavy: 'Anton, "Bebas Neue", sans-serif',
  sans: 'Montserrat, Poppins, sans-serif',
  caption: 'Poppins, Montserrat, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
  stat: 'Oswald, sans-serif',
  ui: 'Inter, -apple-system, sans-serif',
};
