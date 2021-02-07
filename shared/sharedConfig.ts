import { User } from '../electron/services/github';

export type SharedConfig = {
  loggedIn: boolean;
  user?: User;
};

export const sharedConfig: SharedConfig = {
  loggedIn: false,
};
