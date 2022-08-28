import { IpcSetup } from '@shared/types/ipc';

export const handlerMethods: IpcSetup = {
	openExternal: { main: 'on', renderer: 'send' },
	storeRead: { main: 'handle', renderer: 'invoke' },
	storeReset: { main: 'handle', renderer: 'invoke' },
	storeUpdate: { main: 'handle', renderer: 'invoke' },
	info: { main: 'on', renderer: 'send' },
	warn: { main: 'on', renderer: 'send' },
	error: { main: 'on', renderer: 'send' },
	isIntegration: { main: 'handle', renderer: 'invoke' },
	isDev: { main: 'handle', renderer: 'invoke' },
	isTest: { main: 'handle', renderer: 'invoke' },
	isProd: { main: 'handle', renderer: 'invoke' },
	nodenv: { main: 'handle', renderer: 'invoke' },
};
