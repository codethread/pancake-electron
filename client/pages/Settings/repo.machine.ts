import { IRepoForm } from '@shared/types/config';
import { and, not } from '@shared/utils';
import { assign, createMachine, EventFrom, actions, InterpreterFrom } from 'xstate';

export type Page = 'User' | 'Teams' | 'Repos' | 'Notifications';
export const repoMachine = createMachine(
	{
		id: 'repo',
		predictableActionArguments: true,
		tsTypes: {} as import('./repo.machine.typegen').Typegen0,
		schema: {
			context: {} as { repos: IRepoForm[] },
			events: {} as
				| { type: 'add repo'; data: IRepoForm }
				| { type: 'update repo'; data: IRepoForm }
				| { type: 'navigate'; page: Page }
				| { type: 'delete repo'; data: Pick<IRepoForm, 'name' | 'owner'> },
		},
		initial: 'repos',
		on: {
			navigate: [{ cond: (_, { page }) => page === 'User', target: 'user' }, 'repos'],
		},
		states: {
			repos: {
				on: {
					'add repo': { actions: ['storeRepo', 'sendReposToConfig'] },
					'update repo': { actions: ['updateRepo', 'sendReposToConfig'] },
					'delete repo': { actions: ['deleteRepo', 'sendReposToConfig'] },
				},
			},
			user: {},
		},
	},
	{
		actions: {
			deleteRepo: assign({
				repos: (c, { data: { owner, name } }) =>
					c.repos.filter((r) => not(and(r.name === name, r.owner === owner))),
			}),
			storeRepo: assign({ repos: (c, { data }) => c.repos.concat(data) }),
			updateRepo: assign({
				repos: (c, { data }) =>
					c.repos.map((r) => (and(r.name === data.name, r.owner === data.owner) ? data : r)),
			}),
		},
	}
);

type M = typeof repoMachine;
export type RepoEvents = EventFrom<M>;
export type RepoInterpreter = InterpreterFrom<M>;
export type RepoSend = InterpreterFrom<M>['send'];
export type RepoState = InterpreterFrom<M>['state'];
