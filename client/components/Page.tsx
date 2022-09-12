import { IChildren } from '@shared/types/ipc';
import React from 'react';

export function Page({ children, center }: IChildren & { center?: true }): JSX.Element {
	return (
		<div
			className={`flex w-fit min-w-full flex-col items-stretch bg-thmBackground p-4 ${
				center ? 'h-full justify-center' : 'justify-start'
			}`}
		>
			{children}
		</div>
	);
}
