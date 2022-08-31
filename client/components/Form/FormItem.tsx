import { Checkbox, ICheckbox, InputPassword } from '@client/components';
import { EyeClosed, EyeOpen } from '@client/components/Icons';
import { useId } from '@client/hooks';
import { IChildren, ICss } from '@shared/types/ipc';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { FieldValues, Path, useFormContext, UseFormRegister } from 'react-hook-form';

// type IFormCheckbox = IFormItem & {
// 	checkbox: Omit<ICheckbox, 'children' | 'hasError' | 'id'>;
// };

// export function FormItemCheckbox({ checkbox, id: _id, label, error }: IFormCheckbox): JSX.Element {
// 	const id = _id ?? `${label}form-input`;
// 	return (
// 		<div className="flex max-w-md flex-col gap-3 ">
// 			{/* <label htmlFor={id} aria-label={ariaLabel} className="leading-8"> */}
// 			<Checkbox {...checkbox} id={id} hasError={Boolean(error)}>
// 				<p>{label}</p>
// 			</Checkbox>
// 			{error && (
// 				<ErrorMsg id={`${id}-error`} aria-live="polite">
// 					{error}
// 				</ErrorMsg>
// 			)}
// 		</div>
// 	);
// }

type IFormItem<A extends FieldValues> = ICss &
	Omit<IFormItemContainer<A>, 'children'> & { placeholder?: string };

export function FormItemNumber<A extends FieldValues>({
	label,
	className,
	placeholder,
	...rest
}: IFormItem<A>): JSX.Element {
	const id = `${label}-${useId()}`;
	const { register, getFieldState } = useFormContext<FieldValues>();
	const { error } = getFieldState(label);
	const hasError = Boolean(error);
	return (
		<FormItem id={id} label={label} {...rest}>
			<input
				data-error={hasError}
				placeholder={placeholder}
				className={classNames('input', className)}
				id={id}
				type="number"
				{...(hasError && {
					'aria-describedby': `${id}-error`,
				})}
				{...register(label, rest)}
			/>
		</FormItem>
	);
}

export function FormItemText<A extends FieldValues>({
	label,
	className,
	placeholder,
	...rest
}: IFormItem<A>): JSX.Element {
	const id = `${label}-${useId()}`;
	const { register, getFieldState } = useFormContext<FieldValues>();
	const { error } = getFieldState(label);
	const hasError = Boolean(error);
	return (
		<FormItem id={id} label={label} {...rest}>
			<input
				data-error={hasError}
				className={classNames('input', className)}
				placeholder={placeholder}
				id={id}
				type="text"
				{...(hasError && {
					'aria-describedby': `${id}-error`,
				})}
				{...register(label, rest)}
			/>
		</FormItem>
	);
}

export function FormItemPassword<A extends FieldValues>({
	label,
	placeholder,
	...rest
}: Omit<IFormItem<A>, 'children'> & { placeholder?: string }): JSX.Element {
	const [isVisible, setIsVisible] = useState(false);
	const { register, getFieldState } = useFormContext<FieldValues>();
	const registered = register(label, rest);
	const id = `${label}-${useId()}`;

	const inputEl = useRef<HTMLInputElement | null>(null);
	const { error } = getFieldState(label);
	const hasError = Boolean(error);

	return (
		<FormItem id={id} label={label} {...rest}>
			<div className="flex gap-1">
				<div className="grow">
					<InputPassword
						id={id}
						placeholder={placeholder ?? label}
						type={isVisible ? 'text' : 'password'}
						hasError={hasError}
						{...registered}
						ref={(e) => {
							registered.ref(e);
							inputEl.current = e;
						}}
					/>
				</div>
				<button
					type="button"
					onClick={() => {
						toggleVisibility();
					}}
					className="input bg-thmBackgroundBright"
				>
					{isVisible ? (
						<EyeOpen color="bright" size="20px" />
					) : (
						<EyeClosed color="bright" size="20px" />
					)}
				</button>
			</div>
		</FormItem>
	);

	function toggleVisibility(): void {
		setIsVisible(!isVisible);
		inputEl.current?.focus();
	}
}

type ReactFormItem = Parameters<UseFormRegister<FieldValues>>[1];

type IFormItemContainer<A extends FieldValues> = IChildren &
	ReactFormItem & {
		label: Path<A>;
		ariaLabel?: string;
	};

export function FormItem<A extends FieldValues>({
	label,
	children,
	ariaLabel,
	required,
	id,
}: IFormItemContainer<A> & { id: string }): JSX.Element {
	const { getFieldState } = useFormContext<A>();
	const { error } = getFieldState(label);
	return (
		<div className="flex max-w-md flex-col gap-1">
			<label
				htmlFor={id}
				aria-label={ariaLabel}
				className="flex flex-col items-stretch justify-start"
			>
				<span
					className={classNames({
						"after:ml-0.5 after:text-thmError after:content-['*']": required,
					})}
				>
					{label}
				</span>
				{children}
			</label>
			{error?.message && (
				<ErrorMsg id={`${id}-error`} aria-live="polite">
					{error.message}
				</ErrorMsg>
			)}
		</div>
	);
}

function ErrorMsg({
	children,
	...props
}: IChildren & React.HTMLAttributes<HTMLParagraphElement>): JSX.Element {
	return (
		<p {...props} className="text-thmError">
			{children}
		</p>
	);
}

// function Form<A extends FieldValues>({ children, onSubmit }: IChildren & {
//   onSubmit: SubmitHandler<A>
// }) {
// 	const methods = useForm<A>({});
// 	const { isSubmitted, isValid, isDirty } = methods.formState;
// 	const hasError = not(isValid);
// 	// prettier-ignore
// 	const allowSubmit = or(
//     and(not(isDirty), not(isSubmitted)),
//     isValid
//   );
//   return (
// 				<FormProvider {...methods}>
// 					<form onSubmit={methods.handleSubmit(onSubmit)}>
//       {children}
// 					</form>
// 				</FormProvider>
//   )
// }
