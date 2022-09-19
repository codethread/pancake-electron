import { UserConfig } from '@shared/types/config';
import { createMachine, send, assign, InterpreterFrom, ActorRefFrom, StateFrom } from 'xstate';
import { sendParent } from 'xstate/lib/actions';
import { configModel, ConfigEvents } from './config/model';
import { actorIds, MainEvents, SharedEvents } from './shared';

const sendConfig = (cb: (ctx: LoginContext) => ConfigEvents) =>
	sendParent<LoginContext, MainEvents>((ctx) => ({
		type: 'send to',
		target: actorIds.CONFIG,
		event: cb(ctx),
	}));

type LoginContext = Pick<UserConfig, 'rememberMe' | 'token'>;
type LoginEvents = SharedEvents | { type: 'LOG_IN'; data: LoginContext } | { type: 'LOG_OUT' };

export const loginMachine = createMachine(
	{
		id: 'login',
		tsTypes: {} as import('./login.machine.typegen').Typegen0,
		schema: {
			context: {} as LoginContext,
			events: {} as LoginEvents,
		},
		context: { rememberMe: false },
		initial: 'loading',
		states: {
			loading: {
				on: {
					CONFIG_LOADED: [{ cond: 'isLoggedIn', target: 'loggedIn' }, { target: 'loggedOut' }],
				},
			},
			loggedOut: {
				on: {
					LOG_IN: { target: 'loggedIn', actions: ['storeInfo', 'sendInfoToConfig'] },
				},
			},
			loggedIn: {
				on: {
					LOG_OUT: 'loggedOut',
				},
				exit: ['removeTokenFromConfig', 'deleteToken'],
			},
		},
	},
	{
		guards: {
			isLoggedIn: (_, e) => Boolean(e.data.token),
		},
		actions: {
			deleteToken: assign({
				token: () => undefined,
			}),
			// removeTokenFromConfig: send(configModel.events.DELETE('token'), { to: actorIds.CONFIG }),
			removeTokenFromConfig: sendConfig(() => ({ type: 'DELETE' })),
			storeInfo: assign((_, { data }) => data),
			sendInfoToConfig: sendConfig((ctx) => ({
				type: 'UPDATE',
				data: { token: ctx.token, rememberMe: ctx.rememberMe },
			})),
		},
	}
);

type LoginMachine = typeof loginMachine;
export type LoginService = InterpreterFrom<LoginMachine>;
export type LoginActorRef = ActorRefFrom<LoginMachine>;
export type LoginState = StateFrom<LoginMachine>;
