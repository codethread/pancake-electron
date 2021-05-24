import { mocked } from 'ts-jest/utils';
import { err, ok } from '@shared/Result';
import { fakeRepositories, RepositoryOverrides } from '@electron/repositories';
import { IBridge } from '@shared/types';
import { FakeIpcMain } from '@test/FakeIpcMain';
import { FakeIpcRenderer } from '@test/FakeIpcRenderer';
import { bridgeCreator } from '@electron/windows/main/bridge';
import { logger as _logger } from '../logger';
import { setupIpcHandlers } from './ipc';

jest.mock('../logger');
jest.mock('electron');

const logger = mocked(_logger, true);

export function createFakeBridge(overrides?: RepositoryOverrides): IBridge {
  const repos = fakeRepositories(overrides);

  const mockIpcMain = new FakeIpcMain();
  const mockIpcRenderer = new FakeIpcRenderer(mockIpcMain);

  const bridge = bridgeCreator(mockIpcRenderer);
  setupIpcHandlers(mockIpcMain, repos);
  return bridge;
}

// I have intimately coupled the ipcMain events to the ipcRenderer events
// I think this is valid, despite that making this an integration test
describe('setupIpcHandlers', () => {
  it('should setup the test handler for the test event', () => {
    const bridge = createFakeBridge();
    bridge.test('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith('IPC', 'here is a message', 'in two parts');
  });

  it('should setup the info handler for the info event', () => {
    const bridge = createFakeBridge();
    bridge.info('here is a message', 'in two parts');
    expect(logger.info).toHaveBeenCalledWith('IPC', 'here is a message', 'in two parts');
  });

  it('should setup the error handler for the error event', () => {
    const bridge = createFakeBridge();
    bridge.error('error!', 'bang!');
    expect(logger.error).toHaveBeenCalledWith('IPC', 'error!', 'bang!');
  });

  describe('when setting up the openGithubForTokenSetup handler for the openGithubForTokenSetup event', () => {
    const href = 'https://github.com/settings/tokens/new';
    const logMessage = `opening external url ${href}`;

    it('should open an external webpage when the event is triggered', () => {
      const spy = jest.fn().mockResolvedValue(undefined);

      const bridge = createFakeBridge({
        shellRepository: {
          openExternal: spy,
        },
      });

      bridge.openGithubForTokenSetup();

      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(logMessage));
      expect(spy).toHaveBeenCalledWith(expect.stringContaining(href));
    });

    it('should log the error if the open fails', (done) => {
      const bridge = createFakeBridge({
        shellRepository: {
          openExternal: jest.fn().mockRejectedValue(new Error('poop')),
        },
      });

      bridge.openGithubForTokenSetup();

      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining(logMessage));
      setImmediate(() => {
        expect(logger.error).toHaveBeenCalledWith('shell open github', 'poop');
        done();
      });
    });
  });

  describe('when setting up the validateGithubToken handler', () => {
    it('should reply with an ok if the token is valid', async () => {
      const bridge = createFakeBridge({
        githubRepository: {
          getTokenScopes: async () => Promise.resolve(ok(['repo', 'read:org'])),
        },
      });

      const res = await bridge.validateGithubToken('1234');

      expect(res).toMatchResult(ok(true));
    });

    it('should reply with a failure message if the token is invalid', async () => {
      const bridge = createFakeBridge({
        githubRepository: {
          getTokenScopes: async () => Promise.resolve(err('missing scopes')),
        },
      });

      const res = await bridge.validateGithubToken('1234');

      expect(res).toMatchResult(err('missing scopes'));
    });
  });
});
