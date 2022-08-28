import { merge } from '@shared/merge';
import { createFakeClientLogger } from '@electron/services/logger/createFakeLogger';
import { emptyConfig } from '@shared/constants';
import { fakeShell } from './shell/fakeShell';
import { fakeStoreRepoFactory } from './store/fakeStore';
import { metaRepo } from './meta';
import { Repositories, RepositoryOverrides } from './production';

export default (overrides?: RepositoryOverrides): Repositories =>
	merge(
		{
			...fakeShell(overrides),
			...fakeStoreRepoFactory({
				name: 'client',
				defaults: emptyConfig,
			}),
			...createFakeClientLogger(),
			...metaRepo,
		},
		overrides
	);
