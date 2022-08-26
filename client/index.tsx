import React from 'react';
import { render } from 'react-dom';
import { fakeRepositories } from '@electron/repositories/fakes';
import { IBridge } from '@shared/types';
import { Providers } from './Providers';
import './index.css';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const bridge = getElectronBridgeOrMock();

render(<Providers bridge={bridge} />, mainElement);
// render(<div className="text-thmBright">Hello!</div>, mainElement);

function getElectronBridgeOrMock(): IBridge {
  if (window.bridge) return window.bridge;

  return {
    ...fakeRepositories(),
    openExternal: async (url) => {
      window.open(url);
      return Promise.resolve();
    },
  };
}
