import { merge } from '@shared/merge';
import { Partial2Deep } from '@shared/types';
import { fakeGithub, githubRepository, GithubRepository as Github } from './github';
import { fakeShell, shellRepository, ShellRepository as Shell } from './shell';

export interface GithubRepository {
  githubRepository: Github;
}
export interface ShellRepository {
  shellRepository: Shell;
}

export type Repositories = GithubRepository & ShellRepository;

export const productionRepositories: Repositories = {
  githubRepository: githubRepository(),
  shellRepository,
};

export type RepositoryOverrides = Partial2Deep<Repositories>;

export const fakeRepositories = (overrides?: RepositoryOverrides): Repositories =>
  merge(
    {
      githubRepository: fakeGithub(overrides?.githubRepository),
      shellRepository: fakeShell(overrides?.shellRepository),
    },
    overrides
  );
