import { mocked } from 'ts-jest/utils';
import { MockIpcMain } from '@test/MockIpcMain';
import { MockIpcRenderer } from '@test/MockIpcRenderer';
import { setupIpcHandlers } from './ipc';
import { bridgeCreator } from '../../windows/main/bridge';
import { logger as _logger } from '../logger';

jest.mock('../logger');
const logger = mocked(_logger, true);

// I have intimately coupled the ipcMain events to the ipcRenderer events
// I think this is valid as we really don't want this two fall out of sync
describe('setupIpcHandlers', () => {
  const mockIpcMain = new MockIpcMain();
  const mockIpcRenderer = new MockIpcRenderer(mockIpcMain);
  const bridge = bridgeCreator(mockIpcRenderer);

  beforeEach(() => {
    setupIpcHandlers(mockIpcMain);
  });

  it('should setup the test handler for the test event', () => {
    bridge.test('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith(
      'IPC',
      'here is a message',
      'in two parts'
    );
  });

  it('should setup the info handler for the info event', () => {
    bridge.info('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith(
      'IPC',
      'here is a message',
      'in two parts'
    );
  });

  it('should setup the error handler for the error event', () => {
    bridge.error('error!', 'bang!');
    expect(logger.error).toHaveBeenCalledWith('IPC', 'error!', 'bang!');
  });
});
