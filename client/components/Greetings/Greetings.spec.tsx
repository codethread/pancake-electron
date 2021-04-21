import React from 'react';
import { render, screen } from '@testing-library/react';

import Greetings from './index';

test('Greetings should renders', () => {
  render(<Greetings />);

  expect(screen.getByAltText('ReactJS logo')).toBeTruthy();
});
