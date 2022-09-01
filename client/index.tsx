import React from 'react';
import { render } from 'react-dom';
import { getElectronBridgeOrMock } from './getElectronBridgeOrMock';
import './index.css';
import { Main } from './pages/Main';
import { Providers } from './Providers';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

render(
	<Providers bridge={getElectronBridgeOrMock()}>
		<Main />
	</Providers>,
	mainElement
);
