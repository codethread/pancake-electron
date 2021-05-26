import { render, screen } from '@test/rtl';
import React from 'react';
import { ForceError } from '@test/ForceError';
import { logger } from '@test/bridge';
import { mocked } from 'ts-jest/utils';
import { ErrorBoundary } from './ErrorBoundary';

interface IRender {
  shouldError?: boolean;
}

function renderW({ shouldError = false }: IRender = {}): void {
  render(
    <ErrorBoundary logger={logger}>
      {shouldError && <ForceError errorMessage="error message" />}
      <div>hello</div>
    </ErrorBoundary>
  );
}

describe('Error Boundary', () => {
  describe('when there is no error', () => {
    it('renders children', () => {
      renderW();
      expect(screen.getByText('hello')).toBeInTheDocument();
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });

    it('logs nothing', () => {
      renderW();
      expect(logger.error).not.toHaveBeenCalled();
    });
  });

  describe('when there is an error', () => {
    beforeAll(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
      mocked(console).error.mockRestore();
    });

    it('renders the error component', () => {
      renderW({ shouldError: true });
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
      expect(screen.queryByText('hello')).not.toBeInTheDocument();
      expect(screen.queryByText('error message')).not.toBeInTheDocument();
    });

    it('logs the error', () => {
      renderW({ shouldError: true });
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('error message'));
    });
  });
});
