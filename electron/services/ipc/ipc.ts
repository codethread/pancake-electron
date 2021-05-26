import { IpcMain } from '@electron/electron';
import { Repositories } from '@electron/repositories';
import { Result, strip } from '@shared/Result';
import { logger } from '../logger';
import { handlerMethods, Handlers } from './Handlers';
import { validateGithubToken } from './handlers/validateGithubToken';
import { openGithubForTokenSetup } from './handlers/openGithubForTokenSetup';
import { getCurrentUser } from './handlers/getCurrentUser';

export function setupIpcHandlers(ipcMain: IpcMain, repos: Repositories): void {
  const loadedHandlers = handlers(repos);

  handlerMethods.forEach(({ key, method }) => {
    // @ts-expect-error not sure how to type this
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ipcMain[method](key, async (event, args) => {
      const result: Result<any> | void = await loadedHandlers[key](event, args);
      return result && strip(result);
    });
  });
}

function handlers(repos: Repositories): Handlers {
  return {
    getCurrentUser: getCurrentUser(repos),
    validateGithubToken: validateGithubToken(repos),
    openGithubForTokenSetup: openGithubForTokenSetup(repos),
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
