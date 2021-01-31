import { mocked } from 'ts-jest/utils';
import { autoUpdater as _autoUpdater } from 'electron-updater';
import { checkForUpdates } from './updater';
import { logger as _logger } from './logger';

const autoUpdater = mocked(_autoUpdater, true);

jest.mock('./logger');
const logger = mocked(_logger);

describe('checkForUpdates', () => {
  beforeEach(() => {
    checkForUpdates(logger);
  });

  it("sets the updater's logger correctly", () => {
    expect(autoUpdater.logger).toBe(logger);
  });

  it('checks for updates', () => {
    expect(autoUpdater.checkForUpdatesAndNotify).toHaveBeenCalled();
  });

  describe('when update errors', () => {
    const err = new Error('poop');

    beforeAll(() => {
      autoUpdater.checkForUpdatesAndNotify.mockRejectedValue(err);
    });

    it('catches and logs error', () => {
      expect(logger.errorWithContext('')).toHaveBeenCalledWith(err);
    });
  });
});
