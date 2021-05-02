// TODO import and mock this from somewhere?
import { IBridge, IClientLogger } from '@shared/types';

export const logger: IClientLogger = {
  error: jest.fn(),
  info: jest.fn(),
};

export const bridge: IBridge = {
  ...logger,
  openGithubForTokenSetup: jest.fn(),
  test: jest.fn(),
};
