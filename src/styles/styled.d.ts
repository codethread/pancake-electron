// styled.d.ts
import 'styled-components';

interface IFont {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  marginBottom: number;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    theme: 'dark' | 'light';
    breakpoints: {
      xs: 0;
      sm: number;
      md: number;
      lg: number;
    };
    palette: {
      white: string;
      grey: string;
      background: string;
      disabled: string;
      accent: string;
      red: string;
      green: string;
      glass: string;
      gradients: {
        rainbow: (degrees?: number) => string;
        secondary: string;
        vibrant: (degrees?: number) => string;
        glassEdge: (degrees?: number) => string;
        masthead: (degrees?: number) => string;
        background: (degrees?: number) => string;
      };
    };
    shadows: string[];
    shape: {
      borderRadius: number;
    };
    spacing: {
      xSmall: number;
      small: number;
      normal: number;
      large: number;
      Xlarge: number;
    };
    typography: {
      body: IFont;
      button: IFont;
      caption: IFont;
      h1: IFont;
      h2: IFont;
      h3: IFont;
      h4: IFont;
      h5: IFont;
    };
    zIndex: {
      background: number;
      header: number;
    };
  }
}
