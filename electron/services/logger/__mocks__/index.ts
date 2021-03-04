import type { ILogger } from '..';

const { logger } = jest.genMockFromModule<{ logger: ILogger }>('..');

const spy = jest.fn();
logger.errorWithContext = jest.fn().mockReturnValue(spy);

export { logger };
