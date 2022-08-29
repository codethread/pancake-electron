import { merge } from '@shared/merge';
import { ElectronLog } from 'electron-log';
import { concat } from 'remeda';

export type LogMethods = 'debug' | 'error' | 'info' | 'warn';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ILogger = Omit<ElectronLog, LogMethods> & {
	b: {
		serverSetup(info: ILogInfo): ILogInfo;
		clientSetup(info: ILogInfo): ILogInfo;
	};
	info(info: ILogInfo): void;
	warn(info: ILogInfo): void;
	error(info: Error | ILogInfo): void;
	debug(info: ILogInfo): void;
	errorWithContext(context: string): (err: Error | string) => void;
};

export type ILogInfo =
	| string
	| {
			msg: string;
			tags?: Tags;
			data?: any;
	  };

type Tag = keyof typeof tags;
type Tags = Array<Omit<string, Tag> | Tag>;

export const tags = {
	electron: 'electron',
	init: 'init',
	client: 'client',
	store: 'store',
} as const;

export type IClientLogger = Pick<ILogger, LogMethods>;

export function marshalInfo(
	info: ILogInfo,
	extra?: Partial<Pick<Exclude<ILogInfo, string>, 'data' | 'tags'>>
): ILogInfo {
	return typeof info === 'string'
		? { msg: info, tags: concat(['notag'], extra?.tags ?? []) }
		: merge({ ...info, tags: info.tags ?? ['notag'] }, extra);
}
