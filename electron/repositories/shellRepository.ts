// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron';
import { isIntegration } from '@shared/constants';
import { logger } from '@electron/services';

export interface ShellRepository {
  openExternal(href: string): Promise<void>;
}

/**
 * using the repository pattern here to create some side effect that we can monitor for in e2e tests, and removing the actual calls to the shell
 */
export const shellRepository: ShellRepository = isIntegration
  ? {
      async openExternal(href: string): Promise<void> {
        logger.info(`STUBBED SHELL open ${href}`);

        return Promise.resolve();
      },
    }
  : shell;