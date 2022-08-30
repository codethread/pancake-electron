import { IpcMainEvent, IpcMainInvokeEvent } from '@electron/electron';
import { Repositories } from '@electron/repositories';

/**
 * IpcBridge is a meta type to glue together the client and server through the bridge.
 * This allows us to create methods which must then exist on subsequent types, but
 * we can pick the relevant details from this object.
 *
 * See the derived types below
 */
type IpcBridge = {
	[key in keyof Repositories]: {
		readonly param: Parameters<Repositories[key]>;
		readonly response: ReturnType<Repositories[key]>;
	};
};

export type IBridge = {
	readonly [key in keyof IpcBridge]: (
		...args: IpcBridge[key]['param']
	) => IpcBridge[key]['response'];
};

export type IpcHandlers = {
	readonly [key in keyof IpcBridge]: (
		event: IpcBridge[key]['response'] extends Promise<unknown> ? IpcMainInvokeEvent : IpcMainEvent,
		args: IpcBridge[key]['param']
	) => IpcBridge[key]['response'];
};

export type IpcSetup = Record<keyof IpcBridge, Handle | Send>;

type Send = {
	readonly renderer: 'send';
	readonly main: 'on';
};

type Handle = {
	readonly renderer: 'invoke';
	readonly main: 'handle';
};

export type IChildren = {
	children: React.ReactNode;
};

export type ICss = {
	className?: string;
};
