// eslint-disable-next-line import/no-extraneous-dependencies
import { IpcMain } from 'electron';
import { Repositories } from '@electron/repositories';
import { logger } from '../logger';
import { validateGithubToken } from './handlers/validateGithubToken';
import { handlerMethods, Handlers } from './Handlers';

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
    openGithubForTokenSetup() {
      const url = new URL('https://github.com/settings/tokens/new');
      url.search = new URLSearchParams({
        description: 'Pancake PR dashboard',
        scopes: 'repo,read:org',
      }).toString();

      logger.info(`opening external url ${url.href}`);
      repos.shellRepository
        .openExternal(url.href)
        .catch(logger.errorWithContext('shell open github'));
    },
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
