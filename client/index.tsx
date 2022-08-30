/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { IBridge } from '@shared/types/ipc';
import { IClientLogger, ILogInfo, LogMethods, marshalInfo } from '@shared/types/logger';
import { Providers } from './Providers';
import './index.css';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const bridge = getElectronBridgeOrMock();

render(<Providers bridge={bridge} />, mainElement);

function getElectronBridgeOrMock(): IBridge {
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
	console[method](d);
	window.bridge?.[method](JSON.stringify(d));
}
