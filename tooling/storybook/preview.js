import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../client/styles/theme';
import { GlobalStyle } from '../../client/styles/GlobalStyle';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    // eslint-disable-next-line react/jsx-filename-extension
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Story />
    </ThemeProvider>
  ),
];
