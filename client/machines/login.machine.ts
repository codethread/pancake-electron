import { UserConfig } from '@shared/types/config';
import { IBridge } from '@shared/types/ipc';
import { ActorRefFrom, assign, createMachine, InterpreterFrom, StateFrom } from 'xstate';
import { SharedEvents, sendToPage } from './shared';

type LoginContext = Pick<UserConfig, 'rememberMe' | 'token'>;
type LoginEvents = { type: 'LOG_IN'; data: LoginContext } | { type: 'LOG_OUT' };

export const loginMachine = ({ bridge }: { bridge: IBridge }) =>
	createMachine(
		{
			id: 'login',
			predictableActionArguments: true,
			tsTypes: {} as import('./login.machine.typegen').Typegen0,
			schema: {
				context: {} as LoginContext,
				events: {} as LoginEvents,
				services: {} as {
					loadLoginConfig: { data: LoginContext };
				},
			},
			context: { rememberMe: false },
			initial: 'loading',
			states: {
				loading: {
					tags: ['loading'],
					invoke: {
						src: 'loadLoginConfig',
						onDone: { actions: ['storeConfigInContext'], target: 'loaded' },
					},
				},
				loaded: {
					tags: ['loading'],
					always: [{ cond: 'isLoggedIn', target: 'loggedIn' }, { target: 'loggedOut' }],
				},
				loggedOut: {
					entry: ['emitLoggedOut'],
					on: {
						LOG_IN: { target: 'loggedIn', actions: ['storeInfo', 'persistConfig'] },
					},
				},
				loggedIn: {
					entry: ['emitLoggedIn', 'storeInSession'],
					on: {
						LOG_OUT: {
							target: 'loggedOut',
							actions: ['deleteToken', 'persistConfig'],
						},
					},
				},
			},
		},
		{
			services: {
				loadLoginConfig: async () => {
					const r = await bridge.storeRead();
					return r.unwrap();
				},
			},
			guards: {
				isLoggedIn: ({ token }) => Boolean(token),
			},
			actions: {
				storeInSession: ({ token }) => {
					if (token) sessionStorage.setItem('token', token);
				},
				emitLoggedIn: sendToPage(() => ({ type: 'logged in' })),
				emitLoggedOut: sendToPage(() => ({ type: 'logged out' })),
				storeConfigInContext: assign((_, { data }) => data),
				deleteToken: assign({
					token: (_) => undefined,
				}),
				storeInfo: assign((_, { data }) => data),
				persistConfig: ({ token, rememberMe }) => {
					if (rememberMe) {
						bridge.storeUpdate({ rememberMe, token });
					} else {
						bridge.storeUpdate({ rememberMe });
					}
					if (!token) {
						bridge.storeDelete('token');
					}
				},
			},
		}
	);

type LoginMachine = ReturnType<typeof loginMachine>;
export type LoginService = InterpreterFrom<LoginMachine>;
export type LoginActorRef = ActorRefFrom<LoginMachine>;
export type LoginState = StateFrom<LoginMachine>;
export type LoginSend = LoginActorRef['send'];
