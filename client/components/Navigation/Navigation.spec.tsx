import React from 'react';
import pj from 'package.json';
import { render, screen } from '@testing-library/react';
import { Navigation } from './Navigation';

it('displays current app version', () => {
  render(<Navigation />);
  expect(screen.getByText(pj.version)).toBeInTheDocument();
});
