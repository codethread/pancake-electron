import { IpcMain } from '@electron/electron';
import { Repositories } from '@electron/repositories';
import { logger } from '@electron/services/logger';
import { Result, strip } from '@shared/Result';
import { Handlers, handlerMethods } from './handlers/Handlers';
import {
  validateAndStoreGithubToken,
  openGithubForTokenSetup,
  getCurrentUser,
  loadUserConfig,
} from './handlers';

export function setupIpcHandlers(ipcMain: IpcMain, repos: Repositories): void {
  const loadedHandlers = handlers(repos);

  handlerMethods.forEach(({ key, method }) => {
    // @ts-expect-error not sure how to type this
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ipcMain[method](key, async (event, args) => {
      const result: Result<unknown> | void = await loadedHandlers[key](event, args);
      return result && strip(result);
    });
  });
}

function handlers(repos: Repositories): Handlers {
  return {
    getCurrentUser: getCurrentUser(repos),
    validateAndStoreGithubToken: validateAndStoreGithubToken(repos),
    openGithubForTokenSetup: openGithubForTokenSetup(repos),
    loadUserConfig: loadUserConfig(repos),
    test: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    info: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    error: (_, msg) => {
      logger.error('IPC', ...msg);
    },
  };
}
