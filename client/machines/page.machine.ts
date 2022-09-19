import { ActorRefFrom, assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { SharedEvents } from './main/model';

export type IPage = 'dash' | 'settings' | 'user' | 'login' | 'loading';
export type ISetablePage = Exclude<IPage, 'login' | 'loading'>;

type PageEvents = SharedEvents | { type: 'navigate'; page: IPage };

export const pageMachine = createMachine(
	{
		id: 'page',
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
				on: {
					CONFIG_LOADED: [{ cond: 'isLoggedIn', target: 'loggedIn' }, { target: 'loggedOut' }],
				},
			},
			loggedIn: {
				entry: 'setInitialLoginPage',
				on: {
					navigate: { actions: 'navigateToPage' },
				},
			},
			loggedOut: {
				entry: 'navigateToLogin',
				on: {
					navigate: { actions: 'navigateToPage' },
				},
			},
		},
	},
	{
		guards: {
			isLoggedIn: (_, e) => Boolean(e.data.token),
		},
		actions: {
			setInitialLoginPage: assign({
				page: (_, { data }) => (data.repos.length > 0 ? 'dash' : 'settings'),
			}),
			navigateToLogin: assign({ page: (_) => 'login' }),
			navigateToPage: assign({
				page: (_, { page }) => page,
			}),
		},
	}
);

type PageMachine = typeof pageMachine;
export type PageService = InterpreterFrom<PageMachine>;
export type PageActorRef = ActorRefFrom<PageMachine>;
export type PageState = StateFrom<PageMachine>;
