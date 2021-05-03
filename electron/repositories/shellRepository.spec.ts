/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires,global-require,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import { shell } from 'electron';
import { mocked } from 'ts-jest/utils';

jest.mock('@electron/services/logger');
jest.mock('@shared/constants');
jest.unmock('electron');

const originalNodenv = process.env.NODE_ENV;

describe('shellRepository', () => {
  afterAll(() => {
    process.env.NODE_ENV = originalNodenv;
  });

  function setup(isIntegration: boolean): void {
    jest.resetModules();
    const mockedConstants = require('@shared/constants');
    const constants = mocked(mockedConstants);
    constants.isIntegration = isIntegration;
  }

  describe('when in not integration mode', () => {
    it('should be electrons shell instance', () => {
      setup(false);

      const { shellRepository } = require('./shellRepository');
      expect(shellRepository).toBe(shell);
    });
  });

  describe('when integration mode is set', () => {
    it('should return a stubbed shell', async () => {
      setup(true);

      const { logger } = require('@electron/services');
      const { shellRepository } = require('./shellRepository');

      const res = await shellRepository.openExternal('foo');

      expect(res).toBeUndefined();
      expect(logger.info).toHaveBeenCalledWith('STUBBED SHELL open foo');
    });
  });
});
