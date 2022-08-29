import { UserConfig } from '@shared/types/config';
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Providers, waitFor, act } from '@test/rtl';
import { ok } from '@shared/Result';
import { ignoreWarnings } from '@test/ignore';
import { emptyConfig } from '@shared/constants';
import { useConfig } from './useConfig';

describe.skip('useConfig', () => {
	ignoreWarnings(
		'xstate has a bug which logs a harmless warning for exit/entry actions https://github.com/statelyai/xstate/issues/1792',
		/No implementation found for action type 'onStartHook'/
	);

	const config: UserConfig = {
		...emptyConfig,
	};

	function runTest() {
		return renderHook(() => useConfig(), {
			wrapper: ({ children }) => (
				<Providers bridge={{ storeRead: async () => ok(config) }}> {children} </Providers>
			),
		});
	}

	it('should return loading false and config from disk', async () => {
		const { result } = runTest();

		await waitFor(() => expect(result.current.loading).toBe(false));

		expect(result.current.config).toStrictEqual(config);
	});

	it('should allow config to be updated', async () => {
		const { result } = runTest();

		await waitFor(() => expect(result.current.loading).toBe(false));

		act(() => {
			result.current.storeUpdate({
				token: 'token',
			});
		});

		await waitFor(() => expect(result.current.config?.token).toBe('token'));
	});

	it('should be resetable', async () => {
		const { result } = runTest();

		await waitFor(() => expect(result.current.loading).toBe(false));

		act(() => {
			result.current.storeReset();
		});

		await waitFor(() => expect(result.current.config).toStrictEqual(emptyConfig));
	});
});
