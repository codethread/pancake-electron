/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires,global-require,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { shell } from 'electron';

jest.unmock('electron');

const originalNodenv = process.env.NODE_ENV;

describe('shellRepository', () => {
  afterAll(() => {
    process.env.NODE_ENV = originalNodenv;
  });

  function setup(isIntegration: boolean): void {
    jest.resetModules();
    jest.doMock('@electron/services/logger');
    jest.doMock('@shared/constants');
    const constants = require('@shared/constants');
    constants.isIntegration = isIntegration;
  }

  describe('when in not integration mode', () => {
    it('should be electrons shell instance', () => {
      setup(false);

      const {
        shellRepository,
      } = require('@electron/repositories/shellRepository');
      expect(shellRepository).toBe(shell);
    });
  });

  describe('when integration mode is set', () => {
    it('should return a stubbed shell', async () => {
      setup(true);

      const {
        shellRepository,
      } = require('@electron/repositories/shellRepository');
      await shellRepository.openExternal('foo');
      const { logger } = require('@electron/services');
      expect(logger.info).toHaveBeenCalledWith('STUBBED SHELL open foo');
    });
  });
});
