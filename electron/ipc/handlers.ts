import { Repositories } from '@electron/repositories';
import { IpcHandlers } from '@shared/types';
import { logger } from '@electron/services';
import { validateAndStoreGithubToken } from './validateAndStoreGithubToken';
import { openGithubForTokenSetup } from './openGithubForTokenSetup';
import { getCurrentUser } from './getCurrentUser';
import { loadUserConfig, updateUserConfig, resetUserConfig } from './userConfig';

export function handlers(repos: Repositories): IpcHandlers {
  return {
    test: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    info: (_, msg) => {
      logger.info('IPC', ...msg);
    },
    error: (_, msg) => {
      logger.error('IPC', ...msg);
    },
    getCurrentUser: getCurrentUser(repos),
    validateAndStoreGithubToken: validateAndStoreGithubToken(repos),
    openGithubForTokenSetup: openGithubForTokenSetup(repos),
    loadUserConfig: loadUserConfig(repos),
    updateUserConfig: updateUserConfig(repos),
    resetUserConfig: resetUserConfig(repos),
  };
}
