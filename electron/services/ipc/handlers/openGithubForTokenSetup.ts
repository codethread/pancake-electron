import { logger } from '@electron/services';
import { Repositories } from '@electron/repositories';
import { Handlers } from '@electron/services/ipc/Handlers';
import { githubScopes } from '@shared/constants';

export const openGithubForTokenSetup = ({
  shellRepository,
}: Repositories): Handlers['openGithubForTokenSetup'] => () => {
  const url = new URL('https://github.com/settings/tokens/new');
  url.search = new URLSearchParams({
    description: 'Pancake PR dashboard',
    scopes: githubScopes.join(','),
  }).toString();

  logger.info(`opening external url ${url.href}`);
  shellRepository.openExternal(url.href).catch(logger.errorWithContext('shell open github'));
};
