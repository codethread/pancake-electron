import { IpcSetup } from '@shared/types';

export const handlerMethods: IpcSetup = {
  test: { main: 'on', renderer: 'send' },
  info: { main: 'on', renderer: 'send' },
  error: { main: 'on', renderer: 'send' },
  openGithubForTokenSetup: { main: 'on', renderer: 'send' },
  getCurrentUser: { main: 'handle', renderer: 'invoke' },
  loadUserConfig: { main: 'handle', renderer: 'invoke' },
  resetUserConfig: { main: 'handle', renderer: 'invoke' },
  updateUserConfig: { main: 'handle', renderer: 'invoke' },
  validateAndStoreGithubToken: { main: 'handle', renderer: 'invoke' },
};
