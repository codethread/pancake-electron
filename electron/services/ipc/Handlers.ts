import { IpcMainEvent, IpcMainInvokeEvent } from '@electron/electron';
import { IBridge } from '@shared/types';

type IpcMainMethods = 'handle' | 'on';
type IpcRendererMethods = 'invoke' | 'send';

type Handler<N extends keyof IBridge, B extends IpcRendererMethods = 'send'> = (
  event: B extends 'send' ? IpcMainEvent : IpcMainInvokeEvent,
  args: Parameters<IBridge[N]>
) => ReturnType<IBridge[N]>;

export interface Handlers {
  test: Handler<'test'>;
  info: Handler<'info'>;
  error: Handler<'error'>;
  openGithubForTokenSetup: Handler<'openGithubForTokenSetup'>;
  validateGithubToken: Handler<'validateGithubToken', 'invoke'>;
}

export const handlerMethods: Array<{ key: keyof IBridge; method: IpcMainMethods }> = [
  { key: 'test', method: 'on' },
  { key: 'info', method: 'on' },
  { key: 'error', method: 'on' },
  { key: 'openGithubForTokenSetup', method: 'on' },
  { key: 'validateGithubToken', method: 'handle' },
];
