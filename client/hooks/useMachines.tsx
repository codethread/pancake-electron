import {
	ActorError,
	actorIds,
	ConfigActorRef,
	mainMachineFactory,
	MainService,
} from '@client/machines';
import { useInterpret, useSelector } from '@xstate/react';
import React, { createContext, useContext, useEffect } from 'react';
import { useBridge } from './useBridge';
import { useLogger } from './useLogger';

const machinesConfig = createContext<MainService | null>(null);

const { Provider } = machinesConfig;

export type IMachinesProvider = {
	children: React.ReactNode;
};

export function MachinesProvider({ children }: IMachinesProvider): JSX.Element {
	const bridge = useBridge();
	const logger = useLogger();

	useEffect(() => {
		bridge.info('client starting');
	}, [bridge]);

	const main = useInterpret(mainMachineFactory({ bridge }));

	main.onTransition((e) => {
		logger.debug({
			tags: ['xstate', 'main', 'transition'],
			msg: `main machine ${e.event.type}`,
			data: { value: e.value, event: e.event },
		});
	});

	return <Provider value={main}>{children}</Provider>;
}

export const useMachines = (): MainService => {
	const context = useContext(machinesConfig);
	if (!context) {
		throw new Error('useMachines used without Provider');
	}
	return context;
};

export const useConfigService = (): ConfigActorRef => {
	const main = useMachines();
	const config = useSelector(main, (c) => c.children[actorIds.CONFIG] as ConfigActorRef | null);

	if (!config) throw new ActorError(main, actorIds.CONFIG);

	return config;
};
