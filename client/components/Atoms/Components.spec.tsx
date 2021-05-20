import { render } from '@test/rtl';
import React from 'react';
import { H3, H2, Img, P } from './Components';

test('Img renders', () => {
  expect(render(<Img />)).toBeTruthy();
});

test('H2 renders', () => {
  expect(render(<H2>hi</H2>)).toBeTruthy();
});

test('H3 renders', () => {
  expect(render(<H3>hi</H3>)).toBeTruthy();
});

test('P renders', () => {
  expect(render(<P>hi</P>)).toBeTruthy();
  expect(render(<P align="left">hi</P>)).toBeTruthy();
});
