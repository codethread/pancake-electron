import { IChildren, ICss } from '@shared/types/ipc';
import classNames from 'classnames';
import React from 'react';

interface ITooltip extends IChildren {
	Tip: React.ReactNode;
}

export function Tooltip({ children, Tip, className }: ITooltip & ICss): JSX.Element {
	return (
		<div className={classNames([className, 'group'])}>
			{children}
			<span className="invisible absolute z-50 ml-2 rounded-full bg-thmTertiary px-5 py-2 text-center text-thmFg group-hover:visible">
				{Tip}
			</span>
		</div>
	);
}
