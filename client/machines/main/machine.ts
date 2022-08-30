import { UserConfig } from '@shared/types/config';
import { IBridge } from '@shared/types/ipc';
import { assign, createMachine, InterpreterFrom } from 'xstate';
import { configMachineFactory } from '../config/machine';
import { actorIds } from '../constants';
import { mainModel, MainEvents, MainContext } from './model';

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
			tsTypes: {} as import('./machine.typegen').Typegen0,
			context: mainModel.initialContext,
			type: 'parallel',
			states: {
				main: {
					initial: 'loading',
					states: {
						loading: {
							on: {
								CONFIG_LOADED: 'loaded',
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
							],
						},
					},
				},
			},
		},
		{
			actions: {},
		}
	);

export type MainMachine = ReturnType<typeof mainMachineFactory>;
export type MainService = InterpreterFrom<MainMachine>;
