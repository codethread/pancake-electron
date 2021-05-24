import { merge } from '@shared/merge';
import { Partial2Deep } from '@shared/types';
import { fakeGithub, githubRepository, GithubRepository } from './github';
import { fakeShell, shellRepository, ShellRepository } from './shell';

export interface Repositories {
  shellRepository: ShellRepository;
  githubRepository: GithubRepository;
}

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
