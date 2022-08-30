import { createModel } from 'xstate/lib/model';
import { IBridge } from '@shared/types/ipc';
import { ContextFrom, EventFrom } from 'xstate';
import { UserConfig } from '@shared/types/config';

export const mainModel = createModel(
	{},
	{
		events: {
			CONFIG_LOADED: (data: UserConfig) => ({ data }),
		},
	}
);

export type MainContext = ContextFrom<typeof mainModel>;
export type MainEvents = EventFrom<typeof mainModel>;
