import { logger } from '@electron/services';
import { merge } from '@shared/merge';
import { ShellRepository } from './shell';

export const fakeShell = (overrides?: Partial<ShellRepository>): ShellRepository =>
  merge(shellRepo, overrides);

const shellRepo: ShellRepository = {
  async openExternal(href: string): Promise<void> {
    logger.info(`STUBBED SHELL open ${href}`);

    return Promise.resolve();
  },
};
