import _installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { mocked } from 'ts-jest/utils';
import * as _constants from '@shared/constants';
import { logger } from '../logger';
import { setUpDevtools } from './devTools';

jest.mock('../logger');
jest.mock('@shared/constants');
const constants = mocked(_constants, true);
const installExtension = mocked(_installExtension);

describe('Devtools service', () => {
  beforeEach(() => {
    setUpDevtools(logger)();
  });

  describe('when in development', () => {
    beforeAll(() => {
      constants.isDev = true;
    });

    it('it installs extensions', () => {
      expect(installExtension).toHaveBeenCalledWith(REACT_DEVELOPER_TOOLS);
    });

    it('logs installation', () => {
      expect(logger.info).toHaveBeenCalledWith(
        `Added Extension: "${REACT_DEVELOPER_TOOLS.id}"`
      );
    });

    describe('when there is an error', () => {
      const err = new Error('poop');

      beforeAll(() => {
        installExtension.mockRejectedValue(err);
      });

      it('it logs the error', () => {
        expect(logger.errorWithContext('')).toHaveBeenCalledWith(err);
      });
    });
  });

  describe('when not in development', () => {
    beforeAll(() => {
      constants.isDev = false;
    });

    it('does not install extensions', () => {
      expect(installExtension).not.toHaveBeenCalled();
    });
  });
});
