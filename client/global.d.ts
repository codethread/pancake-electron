/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { IBridge } from '@shared/types/ipc';

declare global {
	interface Window {
		bridge?: IBridge;
	}
}
