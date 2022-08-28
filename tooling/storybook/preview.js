/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { ErrorBoundary } from '../../client/components';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '../../client/hooks/providers';
import '../../client/index.css';
import fakeRepositories from '../../electron/repositories/fakes';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
};

export const globalTypes = {};

export const decorators = [
	(Story) => (
		<BridgeProvider bridge={fakeRepositories()}>
			<LoggerProvider>
				<MachinesProvider>
					<ErrorBoundary>
						<div className="text-thmFg">
							<Story />
						</div>
					</ErrorBoundary>
				</MachinesProvider>
			</LoggerProvider>
		</BridgeProvider>
	),
];
