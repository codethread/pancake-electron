import { assign, createMachine } from 'xstate';
export const buttonMachine = createMachine(
	{
		id: 'button',
		tsTypes: {} as import('./button.machine.typegen').Typegen0,
		schema: {
			context: {} as { waited: boolean },
			events: {} as { type: 'loading' } | { type: 'success' } | { type: 'error' },
		},
		context: { waited: false },
		initial: 'idle',
		states: {
			idle: {
				entry: assign({ waited: false }),
				on: {
					loading: 'loading',
				},
			},
			loading: {
				tags: ['loading'],
				after: {
					minWait: { actions: ['setWaited'] },
				},
				on: {
					error: [{ cond: 'waited', target: 'error' }, 'errorWait'],
					success: [{ cond: 'waited', target: 'success' }, 'successWait'],
				},
			},
			errorWait: {
				tags: ['loading'],
				after: {
					minWait: 'error',
				},
			},
			successWait: {
				tags: ['loading'],
				after: {
					minWait: 'success',
				},
			},
			success: {
				after: {
					1000: 'idle',
				},
			},
			error: {
				after: {
					1000: 'idle',
				},
			},
		},
	},
	{
		delays: {
			minWait: 1000,
		},
		actions: {
			setWaited: assign({ waited: true }),
		},
		guards: {
			waited: ({ waited }) => waited,
		},
	}
);
