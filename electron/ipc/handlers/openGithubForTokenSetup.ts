import { logger } from '@electron/services';
import { ShellRepository } from '@electron/repositories';
import { githubScopes } from '@shared/constants';
import { IpcHandlers } from '@shared/types';

export const openGithubForTokenSetup = ({
  shellRepository,
}: ShellRepository): IpcHandlers['openGithubForTokenSetup'] => () => {
  const url = new URL('https://github.com/settings/tokens/new');
  url.search = new URLSearchParams({
    description: 'Pancake PR dashboard',
    scopes: githubScopes.join(','),
  }).toString();

  logger.info(`opening external url ${url.href}`);
  shellRepository.openExternal(url.href).catch(logger.errorWithContext('shell open github'));
};
