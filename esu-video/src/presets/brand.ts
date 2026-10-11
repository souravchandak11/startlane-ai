export const ESU = {
  navy: '#0A1F3F',
  red: '#C8102E',
  gold: '#FFD700',
  white: '#FFFFFF',
  dark: '#0D0D0D',
  green: '#2E8B57',
  cream: '#F3EDE2',
  shadow: {
    text: '0 2px 20px rgba(0,0,0,0.6)',
    card: '0 8px 32px rgba(0,0,0,0.4)',
  },
  spring: {
    headline: {stiffness: 120, damping: 14},
    photo: {stiffness: 80, damping: 18},
    stat: {stiffness: 200, damping: 20},
    logo: {stiffness: 60, damping: 12},
    slam: {stiffness: 260, damping: 16},
  },
  font: {
    poster: 'Anton, sans-serif',
    head: '"Bebas Neue", sans-serif',
    body: 'Montserrat, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
} as const;

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
