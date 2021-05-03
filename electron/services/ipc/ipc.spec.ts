import { mocked } from 'ts-jest/utils';
import { MockIpcMain } from '@test/MockIpcMain';
import { MockIpcRenderer } from '@test/MockIpcRenderer';
import { IBridge } from '@shared/types';
import { setupIpcHandlers } from './ipc';
import { bridgeCreator } from '../../windows/main/bridge';
import { logger as _logger } from '../logger';
import { ShellRepository } from '../../repositories/shellRepository';

jest.mock('../logger');
jest.mock('electron');

const logger = mocked(_logger, true);

const mockShellRepository: ShellRepository = {
  openExternal: jest.fn().mockResolvedValue(undefined),
};

// I have intimately coupled the ipcMain events to the ipcRenderer events
// I think this is valid as we really don't want this two fall out of sync
describe('setupIpcHandlers', () => {
  interface ISetup {
    shellRepository?: ShellRepository;
  }
  function setup({
    shellRepository = mockShellRepository,
  }: ISetup = {}): IBridge {
    const mockIpcMain = new MockIpcMain();
    const mockIpcRenderer = new MockIpcRenderer(mockIpcMain);
    const bridge = bridgeCreator(mockIpcRenderer);
    setupIpcHandlers(mockIpcMain, shellRepository);
    return bridge;
  }

  it('should setup the test handler for the test event', () => {
    const bridge = setup();
    bridge.test('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith(
      'IPC',
      'here is a message',
      'in two parts'
    );
  });

  it('should setup the info handler for the info event', () => {
    const bridge = setup();
    bridge.info('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith(
      'IPC',
      'here is a message',
      'in two parts'
    );
  });

  it('should setup the error handler for the error event', () => {
    const bridge = setup();
    bridge.error('error!', 'bang!');
    expect(logger.error).toHaveBeenCalledWith('IPC', 'error!', 'bang!');
  });

  describe('when setting up the openGithubForTokenSetup handler for the openGithubForTokenSetup event', () => {
    const href = 'https://github.com/settings/tokens/new';
    const logMessage = `opening external url ${href}`;

    it('should open an external webpage when the event is triggered', () => {
      const bridge = setup();
      bridge.openGithubForTokenSetup();

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining(logMessage)
      );
      expect(mockShellRepository.openExternal).toHaveBeenCalledWith(
        expect.stringContaining(href)
      );
    });

    it('should log the error if the open fails', (done) => {
      const bridge = setup({
        shellRepository: {
          openExternal: jest.fn().mockRejectedValue(new Error('poop')),
        },
      });
      bridge.openGithubForTokenSetup();

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining(logMessage)
      );
      setImmediate(() => {
        expect(logger.error).toHaveBeenCalledWith('shell open github', 'poop');
        done();
      });
    });
  });
});
