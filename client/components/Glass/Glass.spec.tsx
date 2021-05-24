import { render } from '@test/rtl';
import React from 'react';
import { Glass } from './Glass';

test('Glass renders', () => {
  const GlassComp = Glass(false);
  const GlassStub = Glass(true);

  expect(render(<GlassStub />)).toBeTruthy();
  expect(render(<GlassStub>Hi</GlassStub>)).toBeTruthy();
  expect(render(<GlassComp />)).toBeTruthy();
  expect(render(<GlassComp>Hi</GlassComp>)).toBeTruthy();
});
