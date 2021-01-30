import { ILogger } from '../logger';

const { logger } = jest.genMockFromModule<{ logger: ILogger }>('../logger');

const spy = jest.fn();
logger.errorWithContext = jest.fn().mockReturnValue(spy);

export { logger };
