import React from 'react';
import { IChildren, ICss } from '@shared/types/ipc';
import classNames from 'classnames';
import { not } from '@shared/utils';

export function Card({
	children,
	className,
	clamp = false,
	noPad = false,
}: IChildren & ICss & { clamp?: boolean; noPad?: boolean }): JSX.Element {
	return (
		<div
			className={classNames(
				'flex flex-col rounded border border-thmBackgroundBright bg-thmBackgroundSubtle',
				className,

				{
					'mx-auto w-[350px]': clamp,
					'p-4': not(noPad),
				}
			)}
		>
			{children}
		</div>
	);
}
