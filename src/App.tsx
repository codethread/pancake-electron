import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, { FC } from 'react';
import { render } from 'react-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import { StoreProvider } from './contexts/providers';
import { Routes } from './pages/routes';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <StoreProvider>
        <GlobalStyle />
        <Routes />
      </StoreProvider>
    </ThemeProvider>
  );
};

render(<App />, mainElement);
