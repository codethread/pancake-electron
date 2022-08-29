import { Nodenv } from '@shared/asserts';
import * as _constants from '@shared/constants';
import { ILogger, LogMethods } from '@shared/types/logger';
import _log from 'electron-log';
import { last } from 'remeda';
import { createLogger, loggerErrorHandler } from './createLogger';

jest.mock('electron-log');
jest.mock('@shared/constants');
const log = jest.mocked(_log, true);
const constants = jest.mocked(_constants, true);

describe('createLogger', () => {
	const error = new Error('poop');
	let logger: ILogger;

	beforeAll(() => {
		constants.nodenv = 'test';
	});

	beforeEach(() => {
		logger = createLogger(_log);
	});

	type Collection = {
		nodenv: Nodenv;
		fileLevel: LogMethods | false;
		consoleLevel: LogMethods | false;
	};
	const logLevels: Collection[] = [
		{ nodenv: 'development', fileLevel: false, consoleLevel: 'debug' },
		{ nodenv: 'test', fileLevel: false, consoleLevel: 'debug' },
		{ nodenv: 'production', fileLevel: 'info', consoleLevel: false },
		{ nodenv: 'impossible' as Nodenv, fileLevel: 'info', consoleLevel: 'info' },
	];

	logLevels.forEach(({ nodenv, consoleLevel, fileLevel }) => {
		describe(`when nodenv is ${nodenv}`, () => {
			beforeAll(() => {
				constants.nodenv = nodenv;
			});

			it('sets transports correctly', () => {
				expect(log.transports.file.level).toBe(fileLevel);
				expect(log.transports.console.level).toBe(consoleLevel);
			});

			afterAll(() => {
				constants.nodenv = 'test';
			});
		});
	});

	describe('when in integration mode', () => {
		beforeAll(() => {
			constants.nodenv = 'production';
			constants.isIntegration = true;
		});

		it('sets transports correctly', () => {
			expect(log.transports.console.level).toBe('info');
		});

		afterAll(() => {
			constants.nodenv = 'test';
			constants.isIntegration = false;
		});
	});

	it('errorWithContext logs errors', () => {
		logger.errorWithContext('context')(error);
		expect(log.error).toHaveBeenCalledWith('context', error);
	});

	it('sets up uncaught error handler', () => {
		expect(log.catchErrors).toHaveBeenCalledWith({
			showDialog: false,
			onError: loggerErrorHandler,
		});
	});

	it('logs the initialised state', () => {
		expect(last(log.info.mock.calls)).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "data": Object {
		      "chrome": undefined,
		      "console": "debug",
		      "electron": undefined,
		      "env": "test",
		      "file": false,
		      "integration": false,
		      "node": "v16.9.1",
		    },
		    "msg": "Logger initialised",
		    "tags": Array [
		      "init",
		      "electron",
		    ],
		  },
		]
	`);
	});
});
