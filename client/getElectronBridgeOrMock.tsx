import { IBridge } from '@shared/types/ipc';
import { ILogInfo, IClientLogger, LogMethods, marshalInfo } from '@shared/types/logger';

export function getElectronBridgeOrMock(): IBridge {
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
		return {
			...window.bridge,
			...logger,
		};
	}

	throw new Error('no bridge');
}

function log(info: ILogInfo, method: LogMethods): void {
	const d = marshalInfo(info, { tags: ['client'] });
	// eslint-disable-next-line no-console
	console[method](d);
	window.bridge?.[method](JSON.stringify(d));
}
