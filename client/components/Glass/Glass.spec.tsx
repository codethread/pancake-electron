import { render } from '@test/rtl';
import React from 'react';
import { Glass } from './Glass';

test('Glass renders', () => {
  expect(render(<Glass />)).toBeTruthy();
  expect(render(<Glass>Hi</Glass>)).toBeTruthy();
});
