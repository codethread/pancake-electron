import React from 'react';
import { render, screen } from '@testing-library/react';
import TestIds from '@shared/testids';
import { bridge } from '@test/bridge';
import { Home } from './Home';

describe('Home', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IRender {}

  function renderW(_: IRender = {}): void {
    render(<Home bridge={bridge} />);
  }

  it('renders the login journey', () => {
    renderW();
    expect(screen.getByTestId(TestIds.LOGIN_JOURNEY)).toBeInTheDocument();
  });

  it('renders the navigation', () => {
    renderW();
    expect(screen.getByTestId(TestIds.NAVIGATION)).toBeInTheDocument();
  });
});
