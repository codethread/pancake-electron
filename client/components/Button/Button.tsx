/* eslint-disable react/button-has-type */
import { CheckCircleIcon, RefreshIcon, XCircleIcon } from '@heroicons/react/outline';
import { assertUnreachable } from '@shared/asserts';
import { IChildren } from '@shared/types/ipc';
import { useMachine } from '@xstate/react';
import classNames from 'classnames';
import React, { ButtonHTMLAttributes, useEffect } from 'react';
import { Box } from '../Box';
import { buttonMachine } from './button.machine';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
	Partial<Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>>;

export type IButton = ButtonProps & {
	variant?: 'icon' | 'primary' | 'secondary' | 'tertiary';
	fullWidth?: boolean;
	transition?: 'error' | 'loading' | 'none' | 'success';
};

export function Button({
	children,
	variant = 'primary',
	fullWidth,
	type = 'button',
	className,
	transition = 'none',
	...props
}: IButton & IChildren): JSX.Element {
	const width = fullWidth ? 'w-full' : 'w-fit';
	const [state, send] = useMachine(buttonMachine);

	useEffect(() => {
		const map: Record<NonNullable<IButton['transition']>, () => void> = {
			loading: () => send({ type: 'loading' }),
			success: () => send({ type: 'success' }),
			error: () => send({ type: 'error' }),
			none: () => {},
		};
		map[transition]();
	}, [transition, send]);

	const dTrans: IButton['transition'] = state.hasTag('loading')
		? 'loading'
		: state.matches('error')
		? 'error'
		: state.matches('success')
		? 'success'
		: 'none';

	switch (variant) {
		case 'primary':
			return (
				<button
					type={type}
					{...{ [`data-${dTrans}`]: true }}
					className={classNames(
						'button-colors',
						'button',
						'button-outline',
						'bg-thmPrimary uppercase text-thmBackground focus:bg-thmBright disabled:bg-thmBackgroundBrightest disabled:text-thmBackground disabled:hover:brightness-100',
						width,
						className
					)}
					{...props}
				>
					<Fill transition={dTrans}>{children}</Fill>
				</button>
			);
		case 'secondary':
			return (
				<button
					type={type}
					className={classNames(
						'button-colors',
						'button',
						'button-outline',
						// 'bg-thmBackgroundBrightest text-thmFgDim disabled:bg-thmBackgroundSubtle disabled:text-thmBackground',
						'border-2 uppercase text-thmPrimary disabled:border-thmBackgroundBrightest disabled:text-thmBackgroundBrightest ',
						width,
						className
					)}
					{...props}
				>
					<Fill transition={dTrans}>{children}</Fill>
				</button>
			);
		case 'tertiary':
			return (
				<button
					type={type}
					className={classNames(
						'button-colors',
						'rounded border-none p-0 text-thmSecondary underline underline-offset-1 shadow-none outline-none hover:underline-offset-2 focus:ring  focus:ring-thmBright disabled:border-thmBackgroundBrightest disabled:text-thmBackgroundBrightest',
						width,
						className
					)}
					{...props}
				>
					<Fill transition={dTrans}>{children}</Fill>
				</button>
			);
		case 'icon':
			return (
				<button
					type={type}
					className={classNames(
						'button-colors',
						'h-[40px] w-[40px] rounded-full p-0 lowercase shadow-none  outline-none focus:ring focus:ring-thmBright disabled:text-thmBackgroundBrightest',
						width,
						className
					)}
					{...props}
				>
					<Fill transition={dTrans}>{children}</Fill>
				</button>
			);
		default:
			return assertUnreachable(variant);
	}
}

const map: Record<NonNullable<IButton['transition']>, JSX.Element> = {
	loading: (
		<Box row>
			<RefreshIcon className="mr-4 w-6 animate-spin" />
			loading
		</Box>
	),
	success: <CheckCircleIcon className="mx-6 h-full" />,
	error: <XCircleIcon className="mx-6 w-6" />,
	none: <span />,
};
function Fill({
	transition = 'none',
	children,
}: IChildren & Pick<IButton, 'transition'>): JSX.Element {
	// eslint-disable-next-line react/jsx-no-useless-fragment
	return transition === 'none' ? <>{children}</> : map[transition];
}
