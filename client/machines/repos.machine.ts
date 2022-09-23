import { IRepoForm, UserConfig } from '@shared/types/config';
import { IBridge } from '@shared/types/ipc';
import { not } from '@shared/utils';
import { ActorRefFrom, assign, createMachine, InterpreterFrom, spawn, StateFrom } from 'xstate';
import { RepoUnActorRef, repoUnMachine } from './repo.machine';
import { replyToPage, RepoOutsideEvents } from './shared';

export type RepoEvents =
	| RepoOutsideEvents
	| { type: 'add repo'; data: IRepoForm }
	| { type: 'delete repo'; data: IRepoForm['id'] }
	| { type: 'update repo'; data: IRepoForm };

type RepoContext = {
	repos: Array<{
		id: string;
		actRef: RepoUnActorRef;
	}>;
};

export const repoMachine = ({ bridge }: { bridge: IBridge }) =>
	createMachine(
		{
			id: 'repo',
			predictableActionArguments: true,
			tsTypes: {} as import('./repos.machine.typegen').Typegen0,
			schema: {
				context: {} as RepoContext,
				events: {} as RepoEvents,
				services: {} as {
					loadRepoConfig: { data: UserConfig };
				},
			},
			context: {
				repos: [],
			},
			initial: 'loading',
			on: {
				'ask if repos configured': [
					{
						cond: ({ repos }) => Boolean(repos.length > 0),
						actions: [replyToPage(() => ({ type: 'has repos configured' }))],
					},
					{
						actions: [replyToPage(() => ({ type: 'no repos configured' }))],
					},
				],
			},
			states: {
				loading: {
					tags: ['loading'],
					invoke: {
						src: 'loadRepoConfig',
						onDone: { actions: ['storeConfigInContext'], target: 'idle' },
					},
				},
				idle: {
					on: {
						'add repo': { actions: ['storeRepo'] },
						'delete repo': { actions: ['deleteRepo'] },
					},
				},
			},
		},
		{
			services: {
				loadRepoConfig: async () => {
					const r = await bridge.storeRead();
					return r.unwrap();
				},
			},
			actions: {
				deleteRepo: assign({
					repos: (c, { data }) => c.repos.filter((r) => r.id !== data),
				}),
				storeConfigInContext: assign({
					repos: ({ repos }, { data }) => {
						const newRepos = data.repos.filter((r) => not(repos.find(({ id }) => r.id === id)));
						return repos.concat(newRepos.map(storeAndSpawn(bridge)));
					},
				}),
				storeRepo: assign({
					repos: (c, { data }) => {
						const exists = c.repos.find((r) => r.id === data.id);

						return exists ? c.repos : c.repos.concat(storeAndSpawn(bridge)(data));
					},
				}),
			},
		}
	);

type RepoMachine = ReturnType<typeof repoMachine>;
export type RepoService = InterpreterFrom<RepoMachine>;
export type RepoActorRef = ActorRefFrom<RepoMachine>;
export type RepoState = StateFrom<RepoMachine>;
export type RepoSend = RepoActorRef['send'];

// Helpers

const seconds = (s: number) => s * 1000;
const defaultRefreshRate = seconds(60);

function storeAndSpawn(bridge: IBridge) {
	return (data: IRepoForm): RepoContext['repos'][number] => ({
		id: data.id,
		actRef: spawn(
			repoUnMachine({ bridge })
				.withContext({
					refreshRate: defaultRefreshRate,
					githubVars: {
						id: data.id,
						name: data.Name,
						owner: data.Owner,
						prCount: data['PR Count'] ?? 5,
						reviewCount: 10,
					},
				})
				.withConfig({
					delays: {
						REFRESH_DELAY: defaultRefreshRate,
					},
				}),
			data.id
		),
	});
}
// addOrEditRepo
