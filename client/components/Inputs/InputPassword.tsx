import React from 'react';
import classNames from 'classnames';

export type IInputPassword = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'type'
> &
	Required<Pick<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'placeholder'>> & {
		hasError?: boolean;
		type?: 'password' | 'text';
	};

export const InputPassword = React.forwardRef<HTMLInputElement, IInputPassword>(
	({ id, hasError, value, className, type = 'password', ...props }, ref) => (
		<input
			ref={ref}
			data-error={hasError}
			className={classNames('input w-full', className)}
			id={id}
			type={type}
			{...(hasError && {
				'aria-describedby': `${id}-error`,
			})}
			value={value}
			{...props}
		/>
	)
);
