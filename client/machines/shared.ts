import { UserConfig } from '@shared/types/config';

export const actorIds = {
	CONFIG: 'CONFIG',
	PAGE: 'PAGE',
	LOGIN: 'LOGIN',
} as const;

export type SharedEvents = {
	type: 'CONFIG_LOADED';
	data: UserConfig;
};

export type MainEvents =
	| SharedEvents
	| {
			type: 'send to';
			target: typeof actorIds;
			event: {
				type: string;
				data: any;
			};
	  };
