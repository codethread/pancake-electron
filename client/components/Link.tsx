import { useBridge } from '@client/hooks';
import { IChildren } from '@shared/types/ipc';
import classNames from 'classnames';
import React from 'react';

interface ILink extends IChildren {
	className?: string;
	url: string;
}
export function Link({ url, children, className }: ILink): JSX.Element {
	const { openExternal } = useBridge();
	return (
		<button
			type="button"
			className={classNames([className, 'text-left'])}
			onClick={() => {
				openExternal(url);
			}}
		>
			{children}
		</button>
	);
}
