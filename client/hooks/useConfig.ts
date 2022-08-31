import { configModel } from '@client/machines';
import { UserConfig } from '@shared/types/config';
import { DeepPartial } from '@shared/types/util';
import { useActor } from '@xstate/react';
import { useMemo, useCallback } from 'react';
import { useConfigService } from './useMachines';

type ConfigUpdaters = {
	storeUpdate(config: DeepPartial<UserConfig>): void;
	storeReset(): void;
};

type ConfigLoaded = ConfigUpdaters & {
	config: UserConfig;
	loading: false;
};

type ConfigLoading = ConfigUpdaters & {
	config: null;
	loading: true;
};

type ConfigMaybe = ConfigLoaded | ConfigLoading;

export const useConfig = (): ConfigMaybe => {
	const config = useConfigService();

	const [state, send] = useActor(config);
	const storeUpdate = useCallback(
		(newConfig: DeepPartial<UserConfig>) => {
			send(configModel.events.UPDATE(newConfig));
		},
		[send]
	);

	return {
		storeUpdate,
		storeReset: () => {
			send(configModel.events.RESET());
		},
		...(state.hasTag('loading')
			? { loading: true, config: null }
			: { loading: false, config: state.context }),
	};
};
