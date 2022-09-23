import { ActorRefFrom, assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { PageOutsideEvents, sendToRepo } from './shared';

export type IPage = 'loading' | 'login' | 'repos' | 'settings' | 'user';
export type ISetablePage = Exclude<IPage, 'loading' | 'login'>;

type PageEvents = PageOutsideEvents | { type: 'navigate'; page: ISetablePage };

export const pageMachine = createMachine(
	{
		id: 'page',
		predictableActionArguments: true,
		tsTypes: {} as import('./page.machine.typegen').Typegen0,
		schema: {
			context: {} as { page: IPage },
			events: {} as PageEvents,
		},
		context: {
			page: 'loading',
		},
		initial: 'loading',
		states: {
			loading: {
				entry: [assign({ page: 'loading' })],
				on: {
					'logged out': 'loggingIn',
					'logged in': 'redirectingAfterLogin',
				},
			},
			loggingIn: {
				entry: [assign({ page: 'login' })],
				on: {
					'logged in': 'redirectingAfterLogin',
				},
			},
			redirectingAfterLogin: {
				entry: 'askIfReposConfigured',
				on: {
					'has repos configured': { target: 'navigable', actions: [assign({ page: 'repos' })] },
					'no repos configured': { target: 'navigable', actions: [assign({ page: 'settings' })] },
				},
			},
			navigable: {
				on: {
					navigate: { actions: 'navigate' },
					'logged out': 'loggingIn',
				},
			},
		},
	},
	{
		actions: {
			askIfReposConfigured: sendToRepo(() => ({ type: 'ask if repos configured' }), 'PAGE'),
			navigate: assign({
				page: (_, { page }) => page,
			}),
		},
	}
);

type PageMachine = typeof pageMachine;
export type PageService = InterpreterFrom<PageMachine>;
export type PageActorRef = ActorRefFrom<PageMachine>;
export type PageState = StateFrom<PageMachine>;
