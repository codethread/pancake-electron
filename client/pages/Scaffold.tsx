import React, { FC } from 'react';
import { IBridge } from '@shared/types';
import { Inspector, ErrorBoundary } from '@client/components';
import { GlobalStyle } from '@client/styles/GlobalStyle';

interface IScaffold {
  bridge: IBridge;
}

export const Scaffold: FC<IScaffold> = ({ children, bridge }) => (
  <>
    <Inspector />
    <GlobalStyle />
    <ErrorBoundary logger={{ error: bridge.error, info: bridge.info }}>
      {children}
    </ErrorBoundary>
  </>
);
