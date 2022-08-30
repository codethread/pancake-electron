/* eslint-disable no-param-reassign */
import { ILogger, ILogInfo, marshalInfo } from '@shared/types/logger';
import { ElectronLog, LevelOption } from 'electron-log';
import { isIntegration, nodenv } from '@shared/constants';
import type { Nodenv } from '@shared/asserts';
import { errorHandler } from './errorHandler';

// eslint-disable-next-line import/no-mutable-exports
export let loggerErrorHandler: ReturnType<typeof errorHandler>;

type LogLevels = [Nodenv, LevelOption][];

const fileLogLevels: LogLevels = [
	['development', 'debug'],
	['test', false],
	['production', 'info'],
];

const consoleLogLevels: LogLevels = [
	['development', 'info'],
	['test', 'debug'],
	['production', false],
];

/**
 * By default, it writes logs to the following locations:
 *
 * on Linux: ~/.config/{app name}/logs/{process type}.log
 * on macOS: ~/Library/Logs/{app name}/{process type}.log
 * on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
 * @param log
 */
export function createLogger(log: ElectronLog): ILogger {
	log.transports.file.level = getLevel(fileLogLevels);
	log.transports.console.format = '{text}';
	log.transports.console.level = isIntegration ? 'info' : getLevel(consoleLogLevels);

	const logger: ILogger = {
		...log,
		info(info) {
			log.info(marshalInfo(info));
		},
		warn(info) {
			log.warn(marshalInfo(info));
		},
		error(info) {
			log.error(info instanceof Error ? { msg: info.message, data: info } : marshalInfo(info));
		},
		debug(info) {
			log.debug(marshalInfo(info));
		},
		errorWithContext(context) {
			return (err) => {
				log.error(context, err);
			};
		},
		b: {
			serverSetup(info) {
				return typeof info === 'string'
					? {
							tags: ['init', 'electron'],
							msg: info,
					  }
					: {
							msg: info.msg,
							tags: Array.from(new Set((info.tags ?? []).concat('init', 'electron'))),
					  };
			},
			clientSetup(info) {
				return typeof info === 'string'
					? {
							tags: ['init', 'client'],
							msg: info,
					  }
					: {
							msg: info.msg,
							tags: Array.from(new Set((info.tags ?? []).concat('init', 'client'))),
					  };
			},
		},
	};

	loggerErrorHandler = errorHandler(logger);

	log.catchErrors({
		showDialog: false,
		onError: loggerErrorHandler,
	});

	logger.info({
		tags: ['init', 'electron'],
		msg: 'Logger initialised',
		data: {
			node: process.version,
			chrome: process.versions.chrome,
			electron: process.versions.electron,
			env: nodenv,
			integration: isIntegration,
			file: log.transports.file.level,
			console: log.transports.console.level,
			location: log.transports.file.getFile().path,
		},
	});

	return logger;
}

function getLevel(levels: LogLevels): LevelOption {
	return levels.find(([setting]) => setting === nodenv)?.[1] ?? 'info';
}
