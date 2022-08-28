import { type ConfigActorRef } from './config/machine';

export const actorIds = {
	CONFIG: 'CONFIG',
} as const;

export type Actors = {
	CONFIG: ConfigActorRef;
};
