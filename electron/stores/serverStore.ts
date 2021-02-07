import Store from 'electron-store';
import { isProd } from '../utils/constants';
import { ILogger } from '../services';

interface ServerConfig {
  ghToken?: string;
}

export type ServerStore = Store<ServerConfig>;

export function createServerStore(logger: ILogger): ServerStore {
  logger.info('creating server store');

  return new Store<ServerConfig>({
    accessPropertiesByDotNotation: false,
    name: 'server',
    ...(!isProd && { cwd: process.cwd() + '/temp' }),
  });
}
