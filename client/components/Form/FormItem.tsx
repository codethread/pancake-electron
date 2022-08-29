import {
	Checkbox,
	ICheckbox,
	IInputNumber,
	IInputPassword,
	InputNumber,
	InputPassword,
} from '@client/components';
import { EyeClosed, EyeOpen } from '@client/components/Icons';
import { IChildren } from '@shared/types/ipc';
import React, { useRef, useState } from 'react';

type IFormCheckbox = IFormItem & {
	checkbox: Omit<ICheckbox, 'children' | 'hasError' | 'id'>;
};

export function FormItemCheckbox({ checkbox, id: _id, label, error }: IFormCheckbox): JSX.Element {
	const id = _id ?? `${label}form-input`;
	return (
		<div className="flex max-w-md flex-col gap-3 ">
			{/* <label htmlFor={id} aria-label={ariaLabel} className="leading-8"> */}
			<Checkbox {...checkbox} id={id} hasError={Boolean(error)}>
				<p>{label}</p>
			</Checkbox>
			{error && (
				<ErrorMsg id={`${id}-error`} aria-live="polite">
					{error}
				</ErrorMsg>
			)}
		</div>
	);
}
type IFormItemNumber = IFormItem & {
	input: Omit<IInputNumber, 'hasError' | 'id'>;
};

export function FormItemNumber({ id: _id, input, label, error }: IFormItemNumber): JSX.Element {
	const id = _id ?? `${label}form-input`;
	return (
		<FormItem id={id} label={label} error={error}>
			<InputNumber {...input} id={id} hasError={Boolean(error)} />
		</FormItem>
	);
}

type IFormItemPassword = IFormItem & {
	input: Omit<IInputPassword, 'hasError' | 'id'>;
};

export function FormItemPassword({ id: _id, input, label, error }: IFormItemPassword): JSX.Element {
	const id = _id ?? `${label}form-input`;
	const [isVisible, setIsVisible] = useState(false);
	const inputEl = useRef<HTMLInputElement>(null);

	return (
		<FormItem id={id} label={label} error={error}>
			<div className="flex gap-1">
				<div className="grow">
					<InputPassword
						{...input}
						ref={inputEl}
						id={id}
						hasError={Boolean(error)}
						type={isVisible ? 'text' : 'password'}
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

type IFormItem = {
	id?: string;
	label: string;
	ariaLabel?: string;
	error?: string;
};

export function FormItem({
	id: _id,
	label,
	children,
	error,
	ariaLabel,
}: IChildren & IFormItem): JSX.Element {
	const id = _id ?? `${label}form-input`;
	return (
		<div className="flex max-w-md flex-col gap-1">
			<label htmlFor={id} aria-label={ariaLabel}>
				{label}
			</label>
			{children}
			{error && (
				<ErrorMsg id={`${id}-error`} aria-live="polite">
					{error}
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
