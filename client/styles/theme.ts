/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DefaultTheme } from 'styled-components';
import { IFont } from './styled';

const body: IFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: 1.5,
  marginBottom: 2,
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
    white: '#E1E1E1',
    grey: '#A2B8B4',
    disabled: '#AAAAAA',
    accent: '#379DCD',
    background: '#222831',
    red: '#EB5757',
    green: '#6FCF97',
    glass: 'rgba(39, 72, 80, 0.48)',
    gradients: {
      rainbow: () =>
        `linear-gradient(91.71deg, rgba(236, 82, 119, 0.75) 2.59%, rgba(136, 126, 201, 0.75) 43.05%, rgba(48, 252, 204, 0.75) 95.08%)`,
      secondary: `linear-gradient(91.71deg, rgba(15, 131, 104, 0.75) 2.59%, rgba(75, 58, 180, 0.75) 95.08%)`,
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
      glassEdge: (deg = 150) => `linear-gradient(
        ${deg}deg,
        #FFFBFB 1.59%,
        rgba(163, 204, 207, 0) 43.54%,
        rgba(163, 204, 207, 0) 51.79%,
        #429BA0 98.7%
      )`,
      vibrant: (deg = 180) => `linear-gradient(
        ${deg}deg,
        #FC77EE 0%,
        #FC7777 100%
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
    body,
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
      marginBottom: 1.2,
    }),
    h3: generateFontVariant({
      fontWeight: 400,
      marginBottom: 1.8,
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

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
function generateFontVariant(overrides = {} as Partial<IFont>): IFont {
  return {
    ...body,
    ...overrides,
  };
}
