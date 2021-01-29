import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { ILogger } from './logger';

export function setUpDevtools(logger: ILogger) {
  return (): void => {
    if (process.env.NODE_ENV === 'development') {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => {
          logger.info(`Added Extension: "${name}"`);
        })
        .catch(logger.errorWithContext('installing extension'));
    }
  };
}
