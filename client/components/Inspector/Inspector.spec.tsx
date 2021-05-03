import React, { FC, useState } from 'react';
import { inspect as _inspect } from '@xstate/inspect';
import { render, RenderResult, screen } from '@test/rtl';
import { mocked } from 'ts-jest/utils';
import * as _constants from '@shared/constants';
import TestIds from '@shared/testids';
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

  const renderW = (): RenderResult => render(<InspectorWrapper />);

  beforeAll(() => {
    constants.isTest = true;
    inspect.mockReturnValue(undefined);
  });

  describe('when not in development', () => {
    beforeAll(() => {
      constants.isDev = false;
    });

    it('does not render the inspector', () => {
      renderW();
      const iframe = screen.queryByTitle('xstate');
      expect(iframe).not.toBeInTheDocument();
      expect(screen.getByTestId(TestIds.NULL_COMP)).toBeInTheDocument();
    });
  });

  describe('in development', () => {
    const disconnectSpy = jest.fn();
    let inspectorReturnsInstance = true;

    beforeAll(() => {
      constants.isDev = true;
      inspect.mockImplementation(() => {
        // eslint-disable-next-line testing-library/no-node-access
        const el = document.getElementById('xstate');
        if (!el) {
          throw new Error('no xstate iframe');
        }
        return inspectorReturnsInstance
          ? undefined
          : {
              disconnect: disconnectSpy,
              send: () => {},
              subscribe: () => ({ unsubscribe: () => {} }),
            };
      });
    });

    it('creates an iframe with the data-xstate property for xstate visualiser to hook into', () => {
      renderW();
      const iframe = screen.getByTitle('xstate');
      expect(iframe).toHaveAttribute('data-xstate');
    });

    it('calls the inspector after the iframe has mounted and only connects once', () => {
      const { rerender } = renderW();
      expect(inspect).toHaveBeenCalledTimes(1);

      rerender(<InspectorWrapper />);
      expect(inspect).toHaveBeenCalledTimes(1);
    });

    it('can have visibility toggled, which is initially visible', () => {
      renderW();
      const iframe = screen.getByTitle('xstate');
      expect(iframe).toBeInTheDocument();

      screen.getByRole('button', { name: /.*hide.*/i }).click();
      expect(iframe).toHaveStyle({ display: 'none' });

      screen.getByRole('button', { name: /.*show.*/i }).click();
      expect(iframe).toHaveStyle({ display: 'block' });
    });

    describe('when the inspector does not return an instance', () => {
      beforeAll(() => {
        inspectorReturnsInstance = false;
      });

      it('disconnects from the inspector when no longer rendered', () => {
        renderW();
        screen.getByTestId('test-button').click();
        expect(inspect).toHaveBeenCalledTimes(1);
        expect(disconnectSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the inspector does return an instance', () => {
      beforeAll(() => {
        inspectorReturnsInstance = true;
      });

      it('does not try to disconnect', () => {
        renderW();
        screen.getByTestId('test-button').click();
        expect(inspect).toHaveBeenCalledTimes(1);
        expect(disconnectSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
