import { IChildren, ICss } from '@shared/types/ipc';
import classNames from 'classnames';
import React from 'react';

type ITooltip = IChildren & {
	Tip: React.ReactNode;
};

export function Tooltip({ children, Tip, className }: ICss & ITooltip): JSX.Element {
	return (
		<div className={classNames([className, 'group'])}>
			{children}
			<span className="absolute z-50 ml-2 whitespace-nowrap rounded-full bg-thmTertiary px-5 py-2 text-center text-thmFg opacity-0 transition-opacity delay-500 group-hover:opacity-100">
				{Tip}
			</span>
		</div>
	);
}
