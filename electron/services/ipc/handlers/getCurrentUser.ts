import { Repositories } from '@electron/repositories';
import { Handlers } from '../Handlers';

export const getCurrentUser = (_: Repositories): Handlers['getCurrentUser'] => async () => {
  throw new Error('method not implemented');
};
