import {create} from '@storybook/theming';
import { theme } from '../src/styles/theme'

const { white, background, accent } = theme.palette
export default create({
  base: "dark",
  colorPrimary: background,
  colorSecondary: accent,
  // UI
  appBg: background,
  appContentBg: background,

  // barBg: '#182624',
  barBg: background,

  textColor: white,
  fontBase: theme.typography.body.fontFamily,

  brandTitle: 'Pancake',
});

// export default create({
//   base: 'light',
//   brandTitle: 'My custom storybook',
//   brandUrl: 'https://example.com',
//   brandImage: 'https://placehold.it/350x150',
// });
