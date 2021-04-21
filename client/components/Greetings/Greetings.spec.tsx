import React from 'react';
import { render } from '@testing-library/react';

import Greetings from './index';

test('Greetings should renders', () => {
  const { getByAltText } = render(<Greetings />);

  expect(getByAltText('ReactJS logo')).toBeTruthy();
});
