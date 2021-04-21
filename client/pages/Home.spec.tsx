import React from 'react';
import { render, screen } from '@testing-library/react';
import TestIds from '@shared/testids';
import * as _constants from '@shared/constants';
import { mocked } from 'ts-jest/utils';
import { Home } from './Home';

jest.mock('@shared/constants');
const constants = mocked(_constants, true);

describe('Home', () => {
  interface IRender {
    isDev?: boolean;
  }

  function renderW({ isDev = false }: IRender = {}): void {
    constants.isDev = isDev;
    render(<Home />);
  }

  it('renders the Inspector in dev mode', () => {
    renderW({ isDev: true });
    expect(screen.getByTitle('xstate')).toBeInTheDocument();
  });

  it('renders the login journey', () => {
    renderW();
    expect(screen.getByTestId(TestIds.GREETING_MESSAGE)).toBeInTheDocument();
  });

  it('renders the navigation', () => {
    renderW();
    expect(screen.getByTestId(TestIds.NAVIGATION)).toBeInTheDocument();
  });
});
