// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcMain } from 'electron';
import { Repositories } from '@electron/repositories';
import { logger } from '../logger';
import { handlerMethods, Handlers } from './Handlers';
import { validateGithubToken } from './handlers/validateGithubToken';
import { openGithubForTokenSetup } from './handlers/openGithubForTokenSetup';

export function setupIpcHandlers(ipcMain: IpcMain, repos: Repositories): void {
  const loadedHandlers = handlers(repos);

  handlerMethods.forEach(({ key, method }) => {
    // @ts-expect-error not sure how to type this
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    ipcMain[method](key, loadedHandlers[key]);
  });
}

function handlers(repos: Repositories): Handlers {
  return {
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
