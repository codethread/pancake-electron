import { IBridge } from '@shared/types/ipc';
import { ILogInfo, IClientLogger, LogMethods, marshalInfo } from '@shared/types/logger';

let bridge: IBridge | null = null;

export function getElectronBridgeOrMock(): IBridge {
	if (bridge) return bridge;

	const logger: IClientLogger = {
		info(info) {
			log(info, 'info');
		},
		warn(info) {
			log(info, 'warn');
		},
		error(info) {
			log(marshalInfo(info instanceof Error ? { msg: info.message, data: info } : info), 'error');
		},
		debug(info) {
			log(info, 'debug');
		},
	};

	if (window.bridge) {
		bridge = {
			...window.bridge,
			...logger,
		};
		return bridge;
	}

	throw new Error('no bridge');
}

function log(info: ILogInfo, method: LogMethods): void {
	const d = marshalInfo(info, { tags: ['client'] });
	// eslint-disable-next-line no-console
	console[method](d);
	window.bridge?.[method](JSON.stringify(d));
}
