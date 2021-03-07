import React from 'react';
import { render } from '@testing-library/react';
import pj from 'package.json';

import Greetings from './index';

test('Greetings should renders', () => {
  const { getByText, getByAltText } = render(<Greetings />);

  const greeting = getByText('Welcome to version', { exact: false });
  expect(greeting).toHaveTextContent(new RegExp(pj.version));
  expect(getByAltText('ReactJS logo')).toBeTruthy();
});
