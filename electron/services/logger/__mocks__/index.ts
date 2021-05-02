import type { ILogger } from '..';
// import { logger as ogLogger } from '../logger';

jest.mock('electron-log');

const { logger } = jest.genMockFromModule<{ logger: ILogger }>('..');

// TODO resolve tests for this
// const spy = jest.fn();
// logger.errorWithContext = jest.fn().mockReturnValue(spy);
logger.errorWithContext = (context: string) => (err: Error | string) =>
  logger.error(context, typeof err === 'string' ? err : err.message);

export { logger };
