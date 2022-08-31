import { Card } from '@client/components';
import React from 'react';
import {
	FieldError,
	FieldValues,
	FormProvider,
	Path,
	useForm,
	useFormContext,
	UseFormRegister,
} from 'react-hook-form';

type IFormItem = Parameters<UseFormRegister<FieldValues>>[1];
type MyForm = {
	name: string;
	age: number;
};

const onSubmit = (data: any): void => console.log(data);

// we can pass register directly
// pros: simple, effecient
// cons: repetative
export function Settings(): JSX.Element {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<MyForm>({});
	return (
		<div className="flex flex-row flex-wrap">
			<Card className="gap-5">
				<form onSubmit={handleSubmit(onSubmit)}>
					<FormItemNumber
						register={register}
						label="name"
						required="pass and art"
						errors={errors.name}
					/>
					<FormItemNumber register={register} label="age" min={5} max={10} errors={errors.age} />
					<input type="submit" />
				</form>
			</Card>
		</div>
	);
}

function FormItemNumber<A extends FieldValues>({
	register,
	label,
	errors,
	...rest
}: IFormItem & {
	label: Path<A>;
	register: UseFormRegister<A>;
	errors?: FieldError;
}): JSX.Element {
	const id = `${label}form-input`;
	return (
		<div className="flex max-w-md flex-col gap-1">
			<label htmlFor={id}>{label}</label>
			<input id={id} type="number" {...register(label, rest)} />
			{errors?.message && <p className="text-thmError">{errors.message}</p>}
		</div>
	);
}

/* ----------------------------- */ /* ----------------------------- */ /* ----------------------------- */
/* ----------------------------- */ /* ----------------------------- */ /* ----------------------------- */

// we can use context to grab info from context
// pros: simple component interfaces, easy to scale
// cons: less efficient, as all fields will update - perhaps use except for virtual lists
export function Settings2(): JSX.Element {
	const methods = useForm<MyForm>({});
	console.log({
		errors: methods.formState.errors,
	});
	return (
		<div className="flex flex-row flex-wrap">
			<Card className="gap-5">
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<FormItemNumber2 label="name" required="pass and art" />
						<FormItemNumber2 label="age" min={5} max={{ value: 10, message: 'hey too big!' }} />
						<input type="submit" />
					</form>
				</FormProvider>
			</Card>
		</div>
	);
}

function FormItemNumber2<A extends FieldValues>({
	label,
	...rest
}: IFormItem & {
	label: Path<A>;
}): JSX.Element {
	const id = `${label}form-input`;
	const { register, getFieldState } = useFormContext<A>();
	const { error } = getFieldState(label);
	return (
		<div className="flex max-w-md flex-col gap-1">
			<label htmlFor={id}>{label}</label>
			<input id={id} type="number" {...register(label, rest)} />
			{error?.message && <p className="text-thmError">{error.message}</p>}
		</div>
	);
}
