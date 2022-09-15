import React from 'react';
import { Box, Card, Button, FormItemPassword, FormItemCheckbox } from '@client/components';
import { mapKeys } from 'remeda';
import { FormProvider, useForm } from 'react-hook-form';
import { useLogger, useConfig, useBridge, useToken } from '@client/hooks';
import { githubScopes } from '@shared/constants';

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
	const { storeUpdate, config } = useConfig();
	const { token, setToken } = useToken();
	const methods = useForm<UserForm>({
		defaultValues: {
			token: token ?? '',
			'remember me': Boolean(config?.token),
		},
	});
	return (
		<Box className="flex-grow">
			<Card clamp>
				<FormProvider {...methods}>
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
		</Box>
	);
}
