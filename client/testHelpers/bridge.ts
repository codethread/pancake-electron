// TODO import and mock this from somewhere?
import { IBridge } from '@shared/types';

export const bridge: IBridge = {
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
  test: jest.fn(),
};
