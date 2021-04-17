import React, { FC, useState } from 'react';
import { inspect as _inspect } from '@xstate/inspect';
import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import * as _constants from '@shared/constants';
import { Inspector } from './Inspector';

jest.mock('@shared/constants');
jest.mock('@xstate/inspect', () => ({
  inspect: jest.fn(),
}));

const inspect = mocked(_inspect);
const constants = mocked(_constants, true);

describe('Inspector', () => {
  const InspectorWrapper: FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <button
          data-testid="test-button"
          type="button"
          onClick={() => {
            setIsVisible((v) => !v);
          }}
        />
        {isVisible ? <Inspector /> : null}
      </div>
    );
  };

  beforeEach(() => {
    render(<InspectorWrapper />);
  });

  beforeAll(() => {
    constants.isTest = true;
    inspect.mockReturnValue(undefined);
  });

  describe('when not in development', () => {
    beforeAll(() => {
      constants.isDev = false;
    });

    it('does not render the inspector', () => {
      const iframe = screen.queryByTitle('xstate');
      expect(iframe).not.toBeInTheDocument();
      expect(screen.getByTestId('NULL_COMP')).toBeInTheDocument();
    });
  });

  describe('in development', () => {
    const disconnectSpy = jest.fn();

    beforeAll(() => {
      constants.isDev = true;
      inspect.mockImplementation(() => {
        const el = document.getElementById('xstate');
        if (!el) {
          throw new Error('no xstate iframe');
        }

        return {
          disconnect: disconnectSpy,
          send: () => {},
          subscribe: () => ({ unsubscribe: () => {} }),
        };
      });
    });

    it('creates an iframe with the data-xstate property for xstate visualiser to hook into', () => {
      const iframe = screen.getByTitle('xstate');
      expect(iframe).toHaveAttribute('data-xstate');
    });

    it('calls the inspector after the iframe has mounted', () => {
      expect(inspect).toHaveBeenCalledTimes(1);
    });

    it('disconnects from the inspector when no longer rendered', () => {
      screen.getByTestId('test-button').click();
      expect(inspect).toHaveBeenCalledTimes(1);
      expect(disconnectSpy).toHaveBeenCalledTimes(1);
    });

    it('can have visibility toggled, which is initially hidden', () => {
      const iframe = screen.getByTitle('xstate');
      expect(iframe).toBeInTheDocument();

      screen.getByRole('button', { name: /.*show.*/ }).click();
      expect(iframe).toHaveStyle({ display: 'block' });

      screen.getByRole('button', { name: /.*hide.*/ }).click();
      expect(iframe).toHaveStyle({ display: 'none' });
    });
  });
});
