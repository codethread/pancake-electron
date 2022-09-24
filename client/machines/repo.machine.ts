import { IReviewsQuery, IReviewsQueryVariables, ReviewsDocument } from '@client/hooks/graphql';
import { client } from '@client/misc/apollo';
import { IBridge } from '@shared/types/ipc';
import {
	ActorRefFrom,
	assign,
	createMachine,
	InterpreterFrom,
	sendParent,
	StateFrom,
} from 'xstate';
import type { RepoEvents } from './repos.machine';

type RepoCtx = {
	refreshRate: number;
	githubVars: {
		id: string;
		name: string;
		owner: string;
		prCount: number;
		reviewCount: number;
	};
	data?: IReviewsQuery;
};

type RepoUnEvents =
	| {
			type: 'DELETE';
	  }
	| {
			type: 'REFETCH';
	  }
	| {
			type: 'updateInfo';
			data: RepoCtx['githubVars'];
	  };

export const repoUnMachine = ({ bridge }: { bridge: IBridge }) =>
	createMachine(
		{
			id: 'repoUn',
			predictableActionArguments: true,
			tsTypes: {} as import('./repo.machine.typegen').Typegen0,
			schema: {
				context: {} as RepoCtx,
				events: {} as RepoUnEvents,
				services: {} as {
					fetchPrs: { data: IReviewsQuery };
				},
			},
			initial: 'initial',
			states: {
				initial: {
					entry: 'addToStore',
					always: [{ cond: 'hasData', target: 'idle' }, { target: 'idle.fetching' }],
				},
				idle: {
					on: {
						updateInfo: {
							actions: ['updateRepoInfo', 'addToStore'],
						},
						DELETE: 'dead',
					},
					initial: 'waiting',
					states: {
						waiting: {
							on: {
								REFETCH: 'fetching',
							},
							after: {
								REFRESH_DELAY: 'fetching',
							},
						},
						fetching: {
							tags: ['fetching'],
							invoke: {
								src: 'fetchPrs',
								onDone: { target: 'waiting', actions: 'storeData' },
								onError: { target: 'waiting', actions: 'logError' },
							},
						},
					},
				},
				dead: {
					entry: [
						sendParent<RepoCtx, RepoEvents>(({ githubVars: { id } }) => ({
							type: 'delete repo',
							data: id,
						})),
						'removeFromStore',
					],
					type: 'final',
				},
			},
		},
		{
			guards: {
				hasData: ({ data }) => Boolean(data),
			},
			actions: {
				removeFromStore: async (ctx) => {
					const res = await bridge.storeRead();
					const { repos } = res.unwrap();
					bridge.storeUpdate({
						repos: repos.filter((r) => r.id !== ctx.githubVars.id),
					});
				},
				storeData: assign({
					data: (_, { data }) => data,
				}),
				updateRepoInfo: assign({
					githubVars: (c, ev) => {
						const e = ev as RepoUnEvents;
						if (e.type !== 'updateInfo') return c.githubVars;
						return { ...c.githubVars, ...e.data };
					},
				}),
				logError: (_, e) => {
					bridge.warn({ msg: 'git fail', tags: ['apollo'], data: e });
				},
				addToStore: (ctx) => {
					addToStore({ ctx, bridge });
				},
			},
			services: {
				fetchPrs: async (c) => {
					const { data } = await client.query<IReviewsQuery, IReviewsQueryVariables>({
						query: ReviewsDocument,
						fetchPolicy: 'network-only',
						variables: {
							...c.githubVars,
							after: null,
						},
					});

					return data;
				},
			},
		}
	);

type RepoUnMachine = typeof repoUnMachine;
export type RepoUnService = InterpreterFrom<RepoUnMachine>;
export type RepoUnActorRef = ActorRefFrom<RepoUnMachine>;
export type RepoUnState = StateFrom<RepoUnMachine>;
export type RepoUnSend = RepoUnActorRef['send'];

// helpers
async function addToStore({ ctx, bridge }: { bridge: IBridge; ctx: RepoCtx }): Promise<void> {
	const res = await bridge.storeRead();
	const { repos } = res.unwrap();
	const existingRepo = repos.find((r) => r.id === ctx.githubVars.id);
	if (existingRepo) {
		bridge.storeUpdate({
			repos: repos.map((r) =>
				r.id === ctx.githubVars.id
					? {
							id: ctx.githubVars.id,
							Owner: ctx.githubVars.owner,
							Name: ctx.githubVars.name,
							'PR Count': ctx.githubVars.prCount,
					  }
					: r
			),
		});
	} else {
		bridge.storeUpdate({
			repos: repos.concat({
				id: ctx.githubVars.id,
				Owner: ctx.githubVars.owner,
				Name: ctx.githubVars.name,
				'PR Count': ctx.githubVars.prCount,
			}),
		});
	}
}
