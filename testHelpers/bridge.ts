// TODO import and mock this from somewhere?
import { IBridge, IClientLogger } from '@shared/types';
import { ok } from '@shared/Result';

export const logger: IClientLogger = {
  error: jest.fn(),
  info: jest.fn(),
};

export const bridge: IBridge = {
  ...logger,
  openGithubForTokenSetup: jest.fn(),
  validateGithubToken: async () => Promise.resolve(ok(true)),
  test: jest.fn(),
};
