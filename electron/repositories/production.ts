import { UserConfig } from '@shared/types/config';
import { IClientLogger, ILogger } from '@shared/types/logger';
import { emptyConfig } from '@shared/constants';
import { shellRepository, ShellRepository } from './shell';
import { storeRepository, StoreRepository } from './store';
import { metaRepo, MetaRepo } from './meta';

export type Repositories = IClientLogger & MetaRepo & ShellRepository & StoreRepository<UserConfig>;

export type RepoArgs = {
	logger: ILogger;
};

export default ({ logger }: RepoArgs): Repositories => ({
	...shellRepository,
	...storeRepository({
		storeConfig: {
			name: 'client',
			defaults: emptyConfig,
			migrations: {
				'>=0.1.7': (store) => {
					store.set('rememberMe', true);
				},
			},
		},
		logger,
	}),
	...logger,
	...metaRepo,
});

export type RepositoryOverrides = Partial<Repositories>;
