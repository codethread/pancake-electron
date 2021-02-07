import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React, { FC } from 'react';
import { render } from 'react-dom';
import { GlobalStyle } from './styles/GlobalStyle';

import { StoreProvider } from './contexts';
import { Routes } from './pages/routes';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const App: FC = () => {
  return (
    <StoreProvider>
      <GlobalStyle />
      <Routes />
    </StoreProvider>
  );
};

render(<App />, mainElement);
