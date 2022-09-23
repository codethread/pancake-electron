import { ActorRef, EventObject, sendParent } from 'xstate';

export const actorIds = {
	PAGE: 'PAGE',
	LOGIN: 'LOGIN',
	REPO: 'REPO',
} as const;

// events
export type RepoOutsideEvents = { type: 'ask if repos configured' };

export type PageOutsideEvents =
	| { type: 'has repos configured' }
	| { type: 'logged in' }
	| { type: 'logged out' }
	| { type: 'no repos configured' };

// end

export type SharedEvents = PageOutsideEvents | RepoOutsideEvents;

export type OutsideEvent<A extends SharedEvents> = {
	type: 'reply to' | 'send to';
	target: keyof typeof actorIds;
	from?: keyof typeof actorIds;
	event: A;
};

export const sendToPage = sendToFactory<PageOutsideEvents>(actorIds.PAGE);
export const replyToPage = sendToPage;

export const sendToRepo = sendToFactory<RepoOutsideEvents>(actorIds.REPO);

/**
 *
 * @see https://github.com/davidkpiano/xstate/discussions/1591
 */
export function assertEventType<TE extends EventObject, TType extends TE['type']>(
	event: TE,
	eventType: TType
): asserts event is TE & { type: TType } {
	if (event.type !== eventType) {
		throw new Error(`Invalid event: expected "${eventType}", got "${event.type}"`);
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function nullActor(overrides?: Partial<ActorRef<any, any>>): ActorRef<any, any> {
	return {
		id: 'null',
		send: () => {},
		subscribe: () => ({ unsubscribe: () => {} }),
		getSnapshot: () => {},
		[Symbol.observable]: () => ({
			subscribe: () => ({ unsubscribe: () => {} }),
		}),
		...overrides,
	};
}

/**
 * Helper to facilitate sending messages between siblings
 * CurrentContext can be infered when this is used in a machines options param
 * All machines are children of mainMachine, which just recieves these events and redirects them to the appropriate child
 */
function sendToFactory<ActorOutsideEvent extends SharedEvents>(id: keyof typeof actorIds) {
	return <CurrentContext, CurrentEvent extends EventObject>(
		cb: (ctx: CurrentContext, e: CurrentEvent) => ActorOutsideEvent,
		from?: keyof typeof actorIds
	) =>
		sendParent<CurrentContext, CurrentEvent, OutsideEvent<ActorOutsideEvent>>((ctx, e) => ({
			type: 'send to',
			target: id,
			from,
			event: cb(ctx, e),
		}));
}
