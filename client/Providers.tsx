import { ErrorBoundary } from '@client/components';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '@client/hooks/providers';
import { IBridge } from '@shared/types/ipc';
import React, { useEffect, useState } from 'react';
import { App } from './App';

type IProviders = {
	bridge: IBridge;
};

export function Providers({ bridge }: IProviders): JSX.Element {
	const [booting, setBooting] = useState(true);
	const [shouldInspect, setShouldInspect] = useState(false);

	useEffect(() => {
		bridge.isDev().then((isDev) => {
			isDev.map((b) => setShouldInspect(b));
			setBooting(false);
		});
	});

	return booting ? (
		<p>booting...</p>
	) : (
		<BridgeProvider bridge={bridge}>
			<LoggerProvider>
				<MachinesProvider>
					<ErrorBoundary>
						<App shouldInspect={shouldInspect}>
							<div>Hello!</div>
						</App>
					</ErrorBoundary>
				</MachinesProvider>
			</LoggerProvider>
		</BridgeProvider>
	);
}
