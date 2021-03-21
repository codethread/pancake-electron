import { ipcMain, IpcMainEvent } from 'electron';
import { setupIpcHandlers, bridge } from './ipc';
import { logger } from '../logger';

jest.mock('../logger');

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const event = {} as IpcMainEvent;

describe('setupIpcHandlers', () => {
  beforeEach(() => {
    setupIpcHandlers();
  });

  it('sets up listener for bridge event', () => {
    expect(ipcMain.on).toHaveBeenCalledWith('bridge', bridge);
  });
});

describe('handlers', () => {
  describe('bridge', () => {
    it('logs passed message', () => {
      bridge(event, 'test');
      expect(logger.info).toHaveBeenCalledWith(expect.any(String), 'test');
    });
  });
});
