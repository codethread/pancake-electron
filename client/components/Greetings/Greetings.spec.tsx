import React from 'react';
import { render } from '@testing-library/react';
import pj from 'package.json';

import Greetings from './index';

test('Greetings should renders', () => {
  const { getByText, getByAltText } = render(<Greetings />);

  const greeting = getByText('Welcome to version', { exact: false });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  expect(greeting).toHaveTextContent(new RegExp(pj.version));
  expect(getByAltText('ReactJS logo')).toBeTruthy();
});
