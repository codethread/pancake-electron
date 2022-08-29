import { IpcHandlers } from '@shared/types/ipc';
import type { Repositories } from '@electron/repositories';
import { handlerMethods } from '@electron/ipc/handlerMethods';
import * as R from 'remeda';

export function handlers(repos: Repositories): IpcHandlers {
	return R.pipe(
		handlerMethods,
		R.keys.strict,
		R.reduce(
			(fns, key: keyof Repositories) => ({
				...fns,
				// eslint-disable-next-line
				[key]: (_: unknown, args: [any]) => repos[key](...args),
			}),
			{} as IpcHandlers
		)
	);
}
