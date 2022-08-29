import type { IpcMain } from 'electron';
import type { IpcHandlers } from '@shared/types/ipc';
import { Result, strip } from '@shared/Result';
import { handlerMethods } from '@electron/ipc/handlerMethods';
import { assertUnreachable } from '@shared/asserts';

export function setupIpcHandlers(ipcMain: IpcMain, loadedHandlers: IpcHandlers): void {
	Object.entries(handlerMethods).forEach(([key, { main }]) => {
		switch (main) {
			case 'handle':
				ipcMain.handle(key, async (event, args: unknown[]) => {
					// @ts-expect-error meg
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
					const result: Result<unknown> = await loadedHandlers[key](event, args);
					return strip(result);
				});
				break;
			case 'on':
				ipcMain.on(key, (event, args: unknown[]) => {
					// @ts-expect-error meg
					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					loadedHandlers[key](event, args);
				});
				break;
			default:
				/* istanbul ignore next */
				assertUnreachable(main);
		}
	});
}
