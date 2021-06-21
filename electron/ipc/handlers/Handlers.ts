import { IpcMainEvent, IpcMainInvokeEvent } from '@electron/electron';
import { IBridge } from '@shared/types';

export type IpcMainMethods = 'handle' | 'on';
type IpcRendererMethods = 'invoke' | 'send';

export type Handler<N extends keyof IBridge, B extends IpcRendererMethods = 'send'> = (
  event: B extends 'send' ? IpcMainEvent : IpcMainInvokeEvent,
  args: Parameters<IBridge[N]>
) => ReturnType<IBridge[N]>;

export interface Handlers {
  test: Handler<'test'>;
  info: Handler<'info'>;
  error: Handler<'error'>;
  openGithubForTokenSetup: Handler<'openGithubForTokenSetup'>;
  validateAndStoreGithubToken: Handler<'validateAndStoreGithubToken', 'invoke'>;
  getCurrentUser: Handler<'getCurrentUser', 'invoke'>;
  loadUserConfig: Handler<'loadUserConfig', 'invoke'>;
  updateUserConfig: Handler<'updateUserConfig', 'invoke'>;
  resetUserConfig: Handler<'resetUserConfig', 'invoke'>;
}

export const handlerMethods: Array<{ key: keyof IBridge; method: IpcMainMethods }> = [
  { key: 'test', method: 'on' },
  { key: 'info', method: 'on' },
  { key: 'error', method: 'on' },
  { key: 'openGithubForTokenSetup', method: 'on' },
  { key: 'validateAndStoreGithubToken', method: 'handle' },
  { key: 'getCurrentUser', method: 'handle' },
  { key: 'loadUserConfig', method: 'handle' },
  { key: 'updateUserConfig', method: 'handle' },
  { key: 'resetUserConfig', method: 'handle' },
];
