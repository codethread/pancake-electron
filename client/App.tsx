import React from 'react';
import { render } from 'react-dom';
import { Home } from './Home';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

render(<Home />, mainElement);
