import React from 'react';
import { Box, Card, Button, FormItemPassword, FormItemCheckbox } from '@client/components';
import { mapKeys } from 'remeda';
import { FormProvider, useForm } from 'react-hook-form';
import { useLogger, useConfig, useBridge, useToken } from '@client/hooks';
import { not } from '@shared/utils';
import { githubUrl } from '@client/misc/githubUrl';

type UserForm = {
	token?: string;
	'remember me'?: boolean;
};

export function Login(): JSX.Element {
	const logger = useLogger();
	const { openExternal } = useBridge();
	const { config, storeUpdate } = useConfig();
	const { token, setToken } = useToken();
	const methods = useForm<UserForm>({
		defaultValues: {
			token: token ?? '',
			'remember me': true,
		},
	});
	return (
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
					onSubmit={methods.handleSubmit((data) => {
						logger.debug({ data, msg: 'user info submitted', tags: ['client', 'settings'] });
						if (!data.token) throw new Error('form error, no token');

						if (data['remember me']) {
							storeUpdate({ token: data.token });
						} else {
							setToken(data.token);
						}
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
	);
}
