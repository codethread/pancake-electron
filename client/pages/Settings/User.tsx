import { Box, Button, Card, FormItemCheckbox, FormItemPassword } from '@client/components';
import { useBridge, useLogger, useLogin } from '@client/hooks';
import { githubScopes } from '@shared/constants';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

const githubUrl = new URL('https://github.com/settings/tokens/new');
githubUrl.search = new URLSearchParams({
	description: 'Pancake PR dashboard',
	scopes: githubScopes.join(','),
}).toString();

type UserForm = {
	token?: string;
	'remember me'?: boolean;
};

export function User(): JSX.Element {
	const logger = useLogger();
	const { openExternal } = useBridge();
	const { send, data } = useLogin();

	const methods = useForm<UserForm>({
		defaultValues: {
			token: data?.token ?? '',
			'remember me': data?.rememberMe ?? false,
		},
	});
	return (
		<Box className="flex-grow">
			<Card clamp className="mb-8">
				<FormProvider {...methods}>
					<form
						className="flex flex-col gap-4"
						onSubmit={methods.handleSubmit((formData) => {
							logger.debug({
								data: formData,
								msg: 'user info submitted',
								tags: ['client', 'settings'],
							});
							if (!formData.token || !formData['remember me'])
								throw new Error('form error, no token');

							send({
								type: 'LOG_IN',
								data: {
									token: formData.token,
									rememberMe: formData['remember me'],
								},
							});
						})}
					>
						<FormItemPassword
							label="token"
							required="Please provide a github token"
							placeholder="0oiwejf"
						/>
						<p>
							Need a new Github token?{' '}
							<Button
								variant="tertiary"
								onClick={() => {
									openExternal(githubUrl.href).catch(logger.warn);
								}}
							>
								Create one here
							</Button>
						</p>
						<FormItemCheckbox
							label="remember me"
							smallPrint="When checked, Pancake will store your token in a plain text file on your machine. If left unchecked, you will need to provide a token each time you restart the app."
						/>
						<Box row>
							<Button
								type="submit"
								transition={
									methods.formState.isSubmitting
										? 'loading'
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
			<Card clamp>
				<Box>
					<Button
						className="border-thmWarn text-thmWarn"
						variant="secondary"
						fullWidth
						onClick={() => {
							send({ type: 'LOG_OUT' });
						}}
					>
						<p className="w-full text-center">Log Out</p>
					</Button>
				</Box>
			</Card>
		</Box>
	);
}
