import { merge } from '@shared/merge';
import { Partial2Deep, UserStore } from '@shared/types';
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

export type Repositories = ClientStoreRepository & GithubRepository & ShellRepository;

export const productionRepositories = (): Repositories => ({
  githubRepository: githubRepository(),
  shellRepository,
  clientStoreRepository: storeRepository({
    name: 'client',
    defaults: {
      filters: [],
    },
  }),
});

export type RepositoryOverrides = Partial2Deep<Repositories>;

export const fakeRepositories = (overrides?: RepositoryOverrides): Repositories =>
  merge(
    {
      githubRepository: fakeGithub(overrides?.githubRepository),
      shellRepository: fakeShell(overrides?.shellRepository),
      clientStoreRepository: fakeStoreRepoFactory({
        name: 'client',
        defaults: {
          filters: [],
        },
      }),
    },
    overrides
  );
