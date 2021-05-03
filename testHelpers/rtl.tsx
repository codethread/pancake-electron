import React, { FC, ReactElement } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';

const AllTheProviders: FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </ThemeProvider>
);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// eslint-disable-next-line import/no-extraneous-dependencies
export * from '@testing-library/react';

export { customRender as render };
