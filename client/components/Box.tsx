import React from 'react';
import { IChildren } from '@shared/types/ipc';
import classNames from 'classnames';
import { not } from '@shared/utils';

type IBox = IChildren & {
	className?: string;
	style?: React.CSSProperties;
	row?: boolean;
};

export function Box({ children, className, style, row }: IBox): JSX.Element {
	return (
		<div
			style={style}
			className={classNames(className, 'flex', {
				'flex-col items-stretch justify-center': not(row),
				'flex-row justify-between': row,
			})}
		>
			{children}
		</div>
	);
}
