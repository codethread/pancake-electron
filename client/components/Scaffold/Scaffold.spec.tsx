import { render, screen } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { mocked } from 'ts-jest/utils';
import { bridge } from '@test/bridge';
import { ForceError } from '@test/ForceError';
import TestIds from '@shared/testids';
import * as _constants from '@shared/constants';
import { Scaffold } from './Scaffold';

jest.mock('@shared/constants');
const constants = mocked(_constants, true);

interface IRender {
  isDev?: boolean;
  children?: ReactNode;
}

function renderW({ isDev = false, children = <div>child</div> }: IRender = {}): void {
  constants.isDev = isDev;
  render(<Scaffold bridge={bridge}>{children}</Scaffold>);
}

describe('Scaffold', () => {
  it('renders the Inspector in dev mode', () => {
    renderW({ isDev: true });
    expect(screen.getByTitle('xstate')).toBeInTheDocument();
  });

  describe('when there is an error', () => {
    const errMessage = 'test error message';
    beforeAll(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
      mocked(console).error.mockRestore();
    });

    it('renders the error boundary', () => {
      renderW({
        children: <ForceError errorMessage={errMessage} />,
      });

      expect(screen.getByTestId(TestIds.ERROR_BOUNDARY_MESSAGE));
    });
  });
});
