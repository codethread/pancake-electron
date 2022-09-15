import { isDev } from '@shared/constants';
import { ILogger } from '@shared/types/logger';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

export function setUpDevtools(logger: ILogger): void {
	if (isDev) {
		logger.info('Installing extensions');
		installExtension([REACT_DEVELOPER_TOOLS])
			.then((name) => {
				logger.info(`Added Extension: "${name}"`);
			})
			.catch(logger.errorWithContext('installing extension'));
	}
}
