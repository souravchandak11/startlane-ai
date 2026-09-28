export const ESU = {
  navy: '#0A1F3F',
  navyDeep: '#06142B',
  red: '#C8102E',
  gold: '#FFD700',
  white: '#FFFFFF',
  dark: '#0D0D0D',
  green: '#2E8B57',
  gradient: {
    primary: 'linear-gradient(135deg, #0A1F3F 0%, #1A3A6B 100%)',
    accent: 'linear-gradient(135deg, #C8102E 0%, #FF2D4B 100%)',
    gold: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  },
  shadow: {
    text: '0 2px 20px rgba(0,0,0,0.6)',
    card: '0 8px 32px rgba(0,0,0,0.4)',
  },
  spring: {
    headline: {stiffness: 120, damping: 14},
    photo: {stiffness: 80, damping: 18},
    stat: {stiffness: 200, damping: 20},
    logo: {stiffness: 60, damping: 12},
  },
} as const;

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
