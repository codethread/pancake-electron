import { autoUpdater } from 'electron-updater';
import { checkForUpdates } from './updater';
import { logger } from './logger';

jest.mock('electron-updater', () => ({
  autoUpdater: {
    logger: null,
    checkForUpdatesAndNotify: jest.fn().mockResolvedValue(null),
  },
}));

describe('updater', () => {
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
    const spy = jest.fn();

    beforeAll(() => {
      logger.errorWithContext = () => spy;
      (autoUpdater.checkForUpdatesAndNotify as jest.Mock).mockRejectedValue(
        err
      );
    });

    it('catches and logs error', () => {
      expect(spy).toHaveBeenCalledWith(err);
    });
  });
});
