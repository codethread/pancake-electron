import { Bootloader } from '@client/components/Bootloader';
import { ErrorBoundary } from '@client/components';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '@client/hooks/providers';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { IBridge } from '@shared/types/ipc';
import { render, RenderOptions, screen, waitForElementToBeRemoved } from '@testing-library/react';
import React, { ReactElement } from 'react';

jest.mock('@xstate/inspect');

type Options = {
	renderOptions?: Omit<RenderOptions, 'queries'>;
	overrides?: Overrides;
};

async function renderAsync(ui: ReactElement, options?: Options): Promise<Rendered> {
	const { overrides, renderOptions } = options ?? {};

	const view = render(ui, {
		wrapper: ({ children }) => <Providers {...overrides}>{children}</Providers>,
		...renderOptions,
	});

	await waitForElementToBeRemoved(() => screen.queryByTestId('providers-loading'));

	return view;
}

export * from '@testing-library/react';
export { renderAsync as render, render as renderNoProviders };

//-----------------------------------------------------------------------------
// PRIVATES
//-----------------------------------------------------------------------------

type Rendered = ReturnType<typeof render>;

type Overrides = {
	bridge?: Partial<IBridge>;
	children?: React.ReactNode;
};

export function Providers({ children, bridge }: Overrides): JSX.Element {
	return (
		<BridgeProvider bridge={{ ...createFakeBridge(), ...bridge }}>
			<LoggerProvider>
				<ErrorBoundary>
					<MachinesProvider>
						<Bootloader shouldInspect={false}>{children}</Bootloader>
					</MachinesProvider>
				</ErrorBoundary>
			</LoggerProvider>
		</BridgeProvider>
	);
}
