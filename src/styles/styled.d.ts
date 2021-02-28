// styled.d.ts
import 'styled-components';

interface IPalette {
  main: string;
  contrastText: string;
}

interface IFont {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
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
      black: string;
      white: string;
      text: string;
      primary: IPalette;
      secondary: IPalette;
      gradients: {
        button: (degrees?: number) => string;
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
