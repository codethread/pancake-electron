import { emptyConfig } from '@shared/constants';
import type { DeepPartial } from '@shared/types/util';
import type { UserConfig } from '@shared/types/config';
import { ContextFrom, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

export const configModel = createModel(emptyConfig, {
	events: {
		RESET: () => ({}),
		REQUEST_CONFIG: () => ({}),
		UPDATE: (data: DeepPartial<UserConfig>) => ({ data }),
		REPLACE: (data: DeepPartial<UserConfig>) => ({ data }),
		DELETE: (data: keyof UserConfig) => ({ data }),
	},
});

export type ConfigContext = ContextFrom<typeof configModel>;
export type ConfigEvents = EventFrom<typeof configModel>;
