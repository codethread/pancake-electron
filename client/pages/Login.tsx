import { Box, Button, Card, FormItemCheckbox, FormItemPassword, Page } from '@client/components';
import { useBridge, useLogger, useLogin } from '@client/hooks';
import { githubUrl } from '@client/misc/githubUrl';
import { not } from '@shared/utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type UserForm = {
	token?: string;
	'remember me'?: boolean;
};

export function Login(): JSX.Element {
	const logger = useLogger();
	const { openExternal } = useBridge();
	const { send, data } = useLogin();

	const { rememberMe, token } = data ?? {};

	const methods = useForm<UserForm>({
		defaultValues: {
			token: token ?? '',
			'remember me': rememberMe ?? false,
		},
	});
	return (
		<Page center>
			<Card clamp>
				<FormProvider {...methods}>
					<p className="mb-6 text-center text-3xl">Welcome to Pancake!</p>
					<p className="mb-6 text-center text-lg">The Pull Request Dashboard</p>
					<p className="mb-6 text-thmFgDim">
						Pancake needs to be able to make request to Github on your behalf, so you'll need to
						provide a valid token with the <code className="text-thmPrimary">repo</code> and{' '}
						<code className="text-thmPrimary">org:read</code> permissions.
					</p>
					<p className="mb-6">
						Don't have a token?{' '}
						<Button
							variant="tertiary"
							onClick={() => {
								openExternal(githubUrl);
							}}
						>
							Create one here
						</Button>
					</p>
					<form
						className="flex flex-col gap-4"
						onSubmit={methods.handleSubmit((formData) => {
							logger.debug({
								data: formData,
								msg: 'user info submitted',
								tags: ['client', 'settings'],
							});
							// TODO bring in ZOD
							if (!formData.token) throw new Error('form error, no token');

							send({
								type: 'LOG_IN',
								data: {
									token: formData.token,
									rememberMe: formData['remember me'] ?? false,
								},
							});
						})}
					>
						<FormItemPassword
							label="token"
							required="Please provide a github token"
							placeholder="e.g. ghp_oi9823jlsf"
						/>
						<FormItemCheckbox
							label="remember me"
							smallPrint="When checked, Pancake will store your token in a plain text file on your machine. If left unchecked, you will need to provide a token each time you restart the app."
						/>
						<Box row className="my-6 justify-around">
							<Button
								type="submit"
								transition={
									methods.formState.isSubmitting
										? 'loading'
										: not(methods.formState.isValid)
										? 'error'
										: methods.formState.isSubmitted
										? 'success'
										: 'none'
								}
							>
								Submit!
							</Button>
							<Button
								variant="secondary"
								onClick={() => {
									methods.reset();
								}}
							>
								Reset
							</Button>
						</Box>
					</form>
				</FormProvider>
			</Card>
		</Page>
	);
}
