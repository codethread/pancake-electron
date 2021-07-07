import { IpcRenderer } from '@electron/electron';
import { IBridge } from '@shared/types';
import { reBuild } from '@shared/Result';
import { handlerMethods } from '@shared/ipcHandlerMethods';

export function bridgeCreator(ipcR: IpcRenderer): IBridge {
  const pairs = Object.entries(handlerMethods);

  return pairs.reduce((obj, [key, { renderer }]) => {
    switch (renderer) {
      case 'send':
        return {
          ...obj,
          [key]: (...args: unknown[]) => ipcR.send(key, args),
        };
      case 'invoke':
        return {
          ...obj,
          [key]: async (...args: unknown[]) => reBuild(await ipcR.invoke(key, args)),
        };
      default:
        throw new Error('impossible missing method for ipc handler methods');
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions,@typescript-eslint/prefer-reduce-type-parameter
  }, {} as IBridge);
}
