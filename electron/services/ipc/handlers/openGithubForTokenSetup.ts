import { logger } from '@electron/services';
import { Repositories } from '@electron/repositories';
import { Handlers } from '@electron/services/ipc/Handlers';

export const openGithubForTokenSetup = ({
  shellRepository,
}: Repositories): Handlers['openGithubForTokenSetup'] => () => {
  const url = new URL('https://github.com/settings/tokens/new');
  url.search = new URLSearchParams({
    description: 'Pancake PR dashboard',
    scopes: 'repo,read:org',
  }).toString();

  logger.info(`opening external url ${url.href}`);
  shellRepository.openExternal(url.href).catch(logger.errorWithContext('shell open github'));
};
