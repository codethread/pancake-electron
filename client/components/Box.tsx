import React from 'react';
import { IChildren } from '@shared/types/ipc';

type IBox = IChildren & {
	className?: string;
	style?: React.CSSProperties;
};

export function Box({ children, className, style }: IBox): JSX.Element {
	return (
		<div
			style={style}
			className={` flex flex-col justify-center justify-items-stretch ${className ?? ''}`}
		>
			{children}
		</div>
	);
}
