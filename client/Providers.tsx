import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary, Bootloader } from '@client/components';
import {
	BridgeProvider,
	LoggerProvider,
	MachinesProvider,
	TokenProvider,
} from '@client/hooks/providers';
import { IBridge, IChildren } from '@shared/types/ipc';
import { inspect } from '@xstate/inspect';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { client } from './misc/apollo';

type IProviders = IChildren & {
	bridge: IBridge;
};

export function Providers({ bridge, children }: IProviders): JSX.Element {
	const [booting, setBooting] = useState(true);
	const [shouldInspect, setShouldInspect] = useState(false);

	useEffect(() => {
		bridge.isDev().then((isDev) => {
			isDev.map((b) => setShouldInspect(b));
			setBooting(false);
		});
	});

	useLayoutEffect(() => {
		if (shouldInspect) {
			inspect({
				iframe: false,
				// url: 'http://localhost:3000/viz?inspect',
			});
		}
	});

	return booting ? (
		<p>booting...</p>
	) : (
		<BridgeProvider bridge={bridge}>
			<LoggerProvider>
				<ApolloProvider client={client}>
					<MachinesProvider>
						<TokenProvider>
							<ErrorBoundary>
								<Bootloader>{children}</Bootloader>
							</ErrorBoundary>
						</TokenProvider>
					</MachinesProvider>
				</ApolloProvider>
			</LoggerProvider>
		</BridgeProvider>
	);
}
