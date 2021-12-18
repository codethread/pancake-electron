import { IpcMain } from '@electron/electron';
import { Result, strip } from '@shared/Result';
import { IpcHandlers } from '@shared/types';
import { handlerMethods } from '@shared/ipcHandlerMethods';

export function setupIpcHandlers(ipcMain: IpcMain, loadedHandlers: IpcHandlers): void {
  Object.entries(handlerMethods).forEach(([key, { main }]) => {
    switch (main) {
      case 'handle':
        ipcMain.handle(key, async (event, args) => {
          // @ts-expect-error shouldn't ever get an error because of the IpcSetup type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
          const result: Result<unknown> = await loadedHandlers[key](event, args);
          return strip(result)
        });
        break;
      case 'on':
        ipcMain.on(key, (event, args) => {
          // @ts-expect-error shouldn't ever get an error because of the IpcSetup type
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          loadedHandlers[key](event, args);
        });
        break;
      default:
        throw new Error('impossible missing method for ipc handler methods');
    }
  });
}
