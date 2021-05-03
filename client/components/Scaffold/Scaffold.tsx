import React, { FC } from 'react';
import { IBridge } from '@shared/types';
import { Inspector, ErrorBoundary } from '@client/components';
import { GlobalStyle } from '@client/styles/GlobalStyle';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';

interface IScaffold {
  bridge: IBridge;
}

export const Scaffold: FC<IScaffold> = ({ children, bridge }) => (
  <>
    <Inspector />
    <GlobalStyle />
    <ErrorBoundary logger={{ error: bridge.error, info: bridge.info }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ErrorBoundary>
  </>
);
