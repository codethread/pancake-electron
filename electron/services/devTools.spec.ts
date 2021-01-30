import _installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { mocked } from 'ts-jest/utils';
import { setUpDevtools } from './devTools';
import { logger } from './logger';

jest.mock('./logger');
jest.mock('electron-devtools-installer');
const installExtension = mocked(_installExtension);

const nodenv = process.env.NODE_ENV;

describe('Devtools service', () => {
  beforeEach(() => {
    setUpDevtools(logger)();
  });

  afterAll(() => {
    process.env.NODE_ENV = nodenv;
  });

  describe('when in development', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
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
      process.env.NODE_ENV = 'production';
    });

    it('does not install extensions', () => {
      expect(installExtension).not.toHaveBeenCalled();
    });
  });
});
