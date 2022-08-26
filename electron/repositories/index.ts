import { emptyConfig, IClientLogger, ILogger, UserConfig } from '@shared/types';
import { shellRepository, ShellRepository } from './shell';
import { slackRepository, SlackRepository } from './slack';
import { storeRepository, StoreRepository } from './store';
import { metaRepo, MetaRepo } from './meta';

export type Repositories = IClientLogger &
  MetaRepo &
  ShellRepository &
  SlackRepository &
  StoreRepository<UserConfig>;

interface RepoArgs {
  logger: ILogger;
}

export const productionRepositories = ({ logger }: RepoArgs): Repositories => ({
  ...slackRepository({ logger }),
  ...shellRepository,
  ...storeRepository({
    storeConfig: {
      name: 'client',
      defaults: emptyConfig,
      migrations: {
        '>=0.4.2': (store) => {
          store.set('theme', 'nord');
        },
      },
    },
    logger,
  }),
  ...logger,
  ...metaRepo,
});

export type RepositoryOverrides = Partial<Repositories>;
