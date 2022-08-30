import React from 'react';
import { IChildren, ICss } from '@shared/types/ipc';

export function Card({ children, className }: IChildren & ICss): JSX.Element {
	return (
		<div
			className={`flex flex-col rounded border border-thmBackgroundBright bg-thmBackgroundSubtle p-4 ${className}`}
		>
			{children}
		</div>
	);
}
