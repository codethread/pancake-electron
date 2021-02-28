/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DefaultTheme } from 'styled-components';
import { IFont } from './styled';

const body: IFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: 1.5,
};

export const theme: DefaultTheme = {
  theme: 'dark',
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
  },
  palette: {
    black: '#222831',
    white: '#F8F7F8',
    text: '#A2B8B4',
    primary: {
      main: '#726a95',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#709fb0',
      contrastText: '#ffffff',
    },
    gradients: {
      button: () => `linear-gradient(
        100deg,
        rgb(255,149,149) 2.49%,
        rgb(66,160,138) 88.61%
      )`,
      background: (deg = 70) => `linear-gradient(
        ${deg}deg,
        #000000 15.78%,
        #243431 83.92%
      )`,
      masthead: (deg = 180) => `linear-gradient(
      ${deg}deg,
      rgb(66, 161, 139) 0%,
      rgb(239, 214, 148) 100%
      )`,
    },
  },
  shadows: ['none'],
  shape: {
    borderRadius: 20,
  },
  spacing: {
    xSmall: 4,
    small: 8,
    normal: 16,
    large: 32,
    Xlarge: 64,
  },
  typography: {
    body: body,
    button: generateFontVariant(),
    caption: generateFontVariant({
      fontSize: '0.75rem',
      fontWeight: 400,
    }),
    h1: generateFontVariant({
      fontSize: '3.75rem',
      fontWeight: 300,
    }),
    h2: generateFontVariant({
      fontSize: '1.6rem',
      fontWeight: 700,
    }),
    h3: generateFontVariant({
      fontWeight: 400,
    }),
    h4: generateFontVariant(),
    h5: generateFontVariant({
      fontSize: '1.1em',
      fontWeight: 700,
    }),
  },
  zIndex: {
    background: -1,
    header: 1,
  },
};

function generateFontVariant(overrides = {} as Partial<IFont>): IFont {
  return {
    ...body,
    ...overrides,
  };
}
