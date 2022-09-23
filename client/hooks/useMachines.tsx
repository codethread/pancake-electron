import React, { createContext, useContext, useEffect } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { actorIds, mainMachineFactory, MainService } from '@client/machines';
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

	const main = useInterpret(mainMachineFactory({ bridge }), { devTools: true });

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

/**
 * Get a child actor from the Main machine, throws an error if not found
 */
export function useActorService<ActorRef>(id: keyof typeof actorIds): ActorRef {
	const main = useMachines();
	const service = useSelector(main, (c) => c.children[id] as unknown as ActorRef | null);

	if (!service) throw new ActorError(main, id);
	return service;
}

/**
 * An error which is intended to be used when extracting an actor from another actor.
 * At present, xstate does not type the children of an actor, so we must assert the type, and it's
 * possible that the programmer makes a mistake at this point. This error should only show up in
 * tests or during development, if you see it during runtime, you have a rather large hole in
 * testing!
 */
export class ActorError extends Error {
	constructor(actor: MainService, id: keyof typeof actorIds) {
		const msg = `programmer error, "${id}}" not found in machine. Actor refs found: "${Array.from(
			// little bit of massaging here as we're treating everything as a service, even though the types are actor refs (they are fundamentally the same thing, but have some api differences).
			actor.children.keys()
		).join(',')}"`;

		super(msg);
	}
}
