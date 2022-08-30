import { useMachines } from '@client/hooks';
import { IChildren } from '@shared/types/ipc';
import { not } from '@shared/utils';
import { useSelector } from '@xstate/react';
import React from 'react';

export function Bootloader({ children }: IChildren): JSX.Element {
	const main = useMachines();
	const loaded = useSelector(main, (c) => c.hasTag('loaded'));

	// ensure main machine is ready to go
	if (not(loaded)) {
		return <p data-testid="providers-loading">...booting</p>;
	}
	return (
		<div id="App-loaded" className="h-screen w-screen bg-thmBackground text-thmFg">
			{children}
		</div>
	);
}
