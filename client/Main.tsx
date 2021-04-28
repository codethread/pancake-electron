import React from 'react';
import { render } from 'react-dom';
import { Home } from './pages/Home';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

render(<Home bridge={window.bridge} />, mainElement);
