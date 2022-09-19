import { UserConfig } from '@shared/types/config';
import { IBridge } from '@shared/types/ipc';
import { DeepPartial } from '@shared/types/util';
import * as R from 'remeda';
import { ActorRefFrom, assign, createMachine, InterpreterFrom, sendParent } from 'xstate';
import { respond } from 'xstate/lib/actions';
import { ConfigContext, configModel, ConfigEvents } from './model';

export type IConfigMachine = {
	bridge: IBridge;
	/**
	 * Inject a config as a testing mechanism
	 */
	configOverride?: UserConfig;
};

export function configMachineFactory({ bridge, configOverride }: IConfigMachine) {
	return createMachine(
		{
			id: 'config',
			predictableActionArguments: true,
			tsTypes: {} as import('./machine.typegen').Typegen0,
			schema: {
				context: {} as ConfigContext,
				events: {} as ConfigEvents,
				services: {} as {
					loadConfig: { data: UserConfig };
					updateConfig: { data: UserConfig };
					resetConfig: { data: UserConfig };
					deleteConfig: { data: UserConfig };
				},
			},
			context: configModel.initialContext,
			initial: 'loading',
			on: {
				'*': { actions: [(...args) => console.log('ahhh', args)] },
			},

			states: {
				loading: {
					tags: ['loading'],
					invoke: {
						id: 'loadConfig',
						src: 'loadConfig',
						onDone: {
							actions: 'storeConfig',
							target: 'loaded',
						},
						onError: {
							target: 'loaded',
						},
					},
				},
				loaded: {
					initial: 'idle',
					states: {
						idle: {
							tags: ['idle'],
							entry: ['broadcastConfig', 'storeTokenForSession'],
							on: {
								UPDATE: 'updating',
								RESET: 'resetting',
								REQUEST_CONFIG: { actions: 'respondWithConfig' },
								DELETE: 'deleting',
							},
						},
						deleting: {
							tags: ['updating'],
							invoke: {
								id: 'deleteConfig',
								src: 'deleteConfig',
								onDone: {
									actions: 'storeConfig',
									target: 'idle',
								},
								onError: {
									target: 'idle',
								},
							},
						},
						updating: {
							tags: ['updating'],
							invoke: {
								id: 'updateConfig',
								src: 'updateConfig',
								onDone: {
									actions: 'storeConfig',
									target: 'idle',
								},
								onError: {
									target: 'idle',
								},
							},
						},
						resetting: {
							tags: ['updating'],
							invoke: {
								id: 'resetConfig',
								src: 'resetConfig',
								onDone: {
									actions: 'storeConfig',
									target: 'idle',
								},
								onError: {
									target: 'idle',
								},
							},
						},
					},
				},
			},
		},
		{
			services: {
				loadConfig: async () => {
					if (configOverride) {
						return configOverride;
					}

					const r = await bridge.storeRead();
					return r.match({
						Ok: (config) => config,
						Err: (e) => {
							bridge.warn(e);
							throw new Error();
						},
					});
				},
				deleteConfig: async (_, e) => {
					const r = await bridge.storeDelete(e.data);
					return r.match({
						Ok: (config) => ({ ...config, [e.data]: undefined }),
						Err: (er) => {
							bridge.warn(er);
							throw new Error();
						},
					});
				},
				resetConfig: async () => {
					const res = await bridge.storeReset();
					return res.match({
						Ok: (config) => config,
						Err: (e) => {
							bridge.warn(e);
							throw new Error();
						},
					});
				},
				updateConfig: async (c, e) => {
					console.log(c, e);
					const storeableConfig = prep(c, e.data);
					const res = await bridge.storeUpdate(storeableConfig);
					return res.match({
						Ok: (config) => merge(config, e.data),
						Err: (er) => {
							bridge.warn(er);
							throw new Error();
						},
					});
				},
			},
			actions: {
				broadcastConfig: sendParent((c) => ({ type: 'CONFIG_LOADED', data: c })),
				storeTokenForSession: ({ token }) => {
					if (token) {
						sessionStorage.setItem('token', token);
					} else {
						sessionStorage.removeItem('token');
					}
				},
				// respondWithConfig: respond((c) => mainModel.events.CONFIG_LOADED(c)),
				storeConfig: assign((_, e) => e.data),
			},
		}
	);
}

type ConfigMachine = ReturnType<typeof configMachineFactory>;
export type ConfigService = InterpreterFrom<ConfigMachine>;
export type ConfigActorRef = ActorRefFrom<ConfigMachine>;

function prep(config: UserConfig, data: DeepPartial<UserConfig>): DeepPartial<UserConfig> {
	return data.rememberMe ?? config.rememberMe ? data : R.omit(data, ['token']);
}
