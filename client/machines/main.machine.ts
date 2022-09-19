import { UserConfig } from '@shared/types/config';
import { IBridge } from '@shared/types/ipc';
import { createMachine, forwardTo, InterpreterFrom, send } from 'xstate';
import { ConfigActorRef, configMachineFactory } from './config/machine';
import { LoginActorRef, loginMachine } from './login.machine';
import { PageActorRef, pageMachine } from './page.machine';
import { MainEvents, actorIds } from './shared';

export type ActorSystem = {
	actors: Actors;
};

export type Actors = {
	CONFIG: ConfigActorRef;
	PAGE: PageActorRef;
	LOGIN: LoginActorRef;
};

export type MainContext = { hello: string };

export type IMainMachine = {
	bridge: IBridge;
	/**
	 * Inject a config as a testing mechanism
	 */
	configOverride?: UserConfig;
};

export const mainMachineFactory = ({ bridge, configOverride }: IMainMachine) =>
	createMachine(
		{
			id: 'main',
			predictableActionArguments: true,
			schema: {
				context: {} as MainContext,
				events: {} as MainEvents,
			},
			tsTypes: {} as import('./main.machine.typegen').Typegen0,
			context: { hello: 'today' },
			type: 'parallel',
			states: {
				main: {
					initial: 'loading',
					states: {
						loading: {
							on: {
								CONFIG_LOADED: {
									actions: [forwardTo(actorIds.PAGE), forwardTo(actorIds.LOGIN)],
									target: 'loaded',
								},
							},
						},
						loaded: {
							tags: ['loaded'],
						},
					},
				},
				config: {
					initial: 'active',
					states: {
						active: {
							invoke: [
								{ id: actorIds.CONFIG, src: configMachineFactory({ bridge, configOverride }) },
								{ id: actorIds.PAGE, src: pageMachine },
								{ id: actorIds.LOGIN, src: loginMachine },
							],
						},
					},
					on: {
						'send to': { actions: ['redirect'] },
					},
				},
			},
		},
		{
			actions: {
				redirect: send((_, e) => e.event, {
					to: actorIds.CONFIG,
				}),
			},
		}
	);

export type MainMachine = ReturnType<typeof mainMachineFactory>;
export type MainService = InterpreterFrom<MainMachine>;
