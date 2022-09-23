import { createMachine, InterpreterFrom, send } from 'xstate';
import { UserConfig } from '@shared/types/config';
import { IBridge } from '@shared/types/ipc';
import { loginMachine } from './login.machine';
import { pageMachine } from './page.machine';
import { repoMachine } from './repos.machine';
import { actorIds, OutsideEvent, SharedEvents } from './shared';

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
				events: {} as OutsideEvent<SharedEvents> | SharedEvents,
			},
			tsTypes: {} as import('./main.machine.typegen').Typegen0,
			context: { hello: 'today' },
			on: {
				'send to': { actions: ['redirect'] },
			},
			initial: 'active',
			states: {
				active: {
					tags: ['loaded'],
					invoke: [
						{ id: actorIds.PAGE, src: pageMachine },
						{ id: actorIds.LOGIN, src: loginMachine({ bridge }) },
						{ id: actorIds.REPO, src: repoMachine({ bridge }) },
					],
				},
			},
		},
		{
			actions: {
				redirect: send((_, e) => e.event, {
					to: (_, e) => e.target,
				}),
			},
		}
	);

export type MainMachine = ReturnType<typeof mainMachineFactory>;
export type MainService = InterpreterFrom<MainMachine>;
