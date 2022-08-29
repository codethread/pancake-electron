import { UserConfig } from '@shared/types/config';
import { IBridge } from '@shared/types/ipc';
import { assign, createMachine, InterpreterFrom } from 'xstate';
import { mainModel, MainEvents, MainContext } from './model';

export type IMainMachine = {
	bridge: IBridge;
	/**
	 * Inject a config as a testing mechanism
	 */
	configOverride?: UserConfig;
};

export const mainMachineFactory = (_i: IMainMachine) =>
	createMachine(
		{
			id: 'main',
			schema: {
				context: {} as MainContext,
				events: {} as MainEvents,
			},
			tsTypes: {} as import('./machine.typegen').Typegen0,
			context: mainModel.initialContext,
			initial: 'loading',
			states: {
				loading: {
					always: {
						actions: 'setLoaded',
						target: 'active',
					},
				},
				active: {},
			},
		},
		{
			actions: {
				setLoaded: assign({
					loaded: true,
				}),
			},
		}
	);

export type MainMachine = ReturnType<typeof mainMachineFactory>;
export type MainService = InterpreterFrom<MainMachine>;
