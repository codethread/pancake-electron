import { IRepoForm } from '@shared/types/config';
import { assign, createMachine, EventFrom, InterpreterFrom, StateFrom } from 'xstate';

export const repoMachine = createMachine(
	{
		id: 'repo',
		predictableActionArguments: true,
		tsTypes: {} as import('./repo.machine.typegen').Typegen0,
		schema: {
			context: {} as { repos: IRepoForm[] },
			events: {} as
				| { type: 'add repo'; data: IRepoForm }
				| { type: 'delete repo'; data: IRepoForm['id'] }
				| { type: 'update repo'; data: IRepoForm },
		},
		initial: 'init',
		states: {
			init: {
				always: [{ cond: 'hasRepos', target: 'repos' }, { target: 'noRepos' }],
			},
			noRepos: {
				on: {
					'add repo': { actions: ['storeRepo', 'sendReposToConfig'], target: 'repos' },
				},
			},
			repos: {
				on: {
					'add repo': { actions: ['storeRepo', 'sendReposToConfig'] },
					'update repo': { actions: ['updateRepo', 'sendReposToConfig'] },
					'delete repo': { actions: ['deleteRepo', 'sendReposToConfig'] },
				},
			},
		},
	},
	{
		actions: {
			deleteRepo: assign({
				repos: (c, { data }) => c.repos.filter((r) => r.id !== data),
			}),
			storeRepo: assign({ repos: (c, { data }) => c.repos.concat(data) }),
			updateRepo: assign({
				repos: (c, { data }) => c.repos.map((r) => (data.id === r.id ? data : r)),
			}),
		},
		guards: {
			hasRepos: (c) => c.repos.length > 0,
		},
	}
);

type M = typeof repoMachine;
export type RepoEvents = EventFrom<M>;
export type RepoSend = InterpreterFrom<M>['send'];
export type RepoState = StateFrom<M>;
