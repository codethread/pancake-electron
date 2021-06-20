import { merge } from '@shared/merge';
import { Partial2Deep, ServerStore, UserStore } from '@shared/types';
import { fakeGithub, githubRepository, GithubRepository as Github } from './github';
import { fakeShell, shellRepository, ShellRepository as Shell } from './shell';
import { fakeStoreRepoFactory, storeRepository, StoreRepository } from './store';

export interface GithubRepository {
  githubRepository: Github;
}

export interface ShellRepository {
  shellRepository: Shell;
}

export interface ClientStoreRepository {
  clientStoreRepository: StoreRepository<UserStore>;
}

export interface ServerStoreRepository {
  serverStoreRepository: StoreRepository<ServerStore>;
}

export type Repositories = ClientStoreRepository &
  GithubRepository &
  ServerStoreRepository &
  ShellRepository;

export const productionRepositories = (): Repositories => ({
  githubRepository: githubRepository(),
  shellRepository,
  clientStoreRepository: storeRepository({
    name: 'client',
    defaults: {
      filters: [],
    },
  }),
  serverStoreRepository: storeRepository({
    name: 'server',
    defaults: {},
  }),
});

export type RepositoryOverrides = Partial2Deep<Repositories>;

export const fakeRepositories = (overrides?: RepositoryOverrides): Repositories =>
  merge(
    {
      githubRepository: fakeGithub(overrides?.githubRepository),
      shellRepository: fakeShell(overrides?.shellRepository),
      serverStoreRepository: fakeStoreRepoFactory({
        name: 'server',
        defaults: {},
      }),
      clientStoreRepository: fakeStoreRepoFactory({
        name: 'client',
        defaults: {
          filters: [],
        },
      }),
    },
    overrides
  );
