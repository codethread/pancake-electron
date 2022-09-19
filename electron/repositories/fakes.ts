import { createFakeLogger } from '@electron/services/logger/createFakeLogger';
import { emptyConfig } from '@shared/constants';
import { merge } from '@shared/merge';
import { metaRepo } from './meta';
import { Repositories, RepositoryOverrides } from './production';
import { fakeShell } from './shell/fakeShell';
import { fakeStoreRepoFactory } from './store/fakeStore';

export default (overrides?: RepositoryOverrides): Repositories => {
	const logger = createFakeLogger();
	return merge(
		{
			...fakeShell(overrides),
			...fakeStoreRepoFactory({
				logger,
				storeConfig: {
					name: 'client',
					defaults: emptyConfig,
				},
			}),
			...logger,
			...metaRepo,
		},
		overrides
	);
};
