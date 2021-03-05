import type { ILogger } from '..';

jest.mock('electron-log');

const { logger } = jest.genMockFromModule<{ logger: ILogger }>('..');

const spy = jest.fn();
logger.errorWithContext = jest.fn().mockReturnValue(spy);

export { logger };
