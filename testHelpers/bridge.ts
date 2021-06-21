// TODO import and mock this from somewhere?
import { IBridge, IClientLogger } from '@shared/types';
import { ok } from '@shared/Result';
import { exampleUser } from '@test/fixtures/github';

export const logger: IClientLogger = {
  error: jest.fn(),
  info: jest.fn(),
};

export const bridge: IBridge = {
  ...logger,
  test: jest.fn(),
  openGithubForTokenSetup: jest.fn(),
  validateAndStoreGithubToken: async () => Promise.resolve(ok(true)),
  getCurrentUser: async () => Promise.resolve(ok(exampleUser)),
  loadUserConfig: async () => Promise.resolve(ok({ filters: [] })),
  resetUserConfig: async () => Promise.resolve(ok({ filters: [] })),
  updateUserConfig: async () => Promise.resolve(ok({ filters: [], user: exampleUser })),
};
