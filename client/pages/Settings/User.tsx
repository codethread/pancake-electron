import React from 'react';
import { Box, Card, Button, FormItemPassword } from '@client/components';
import { mapKeys } from 'remeda';
import { FormProvider, useForm } from 'react-hook-form';
import { useLogger, useConfig, useBridge } from '@client/hooks';
import { githubScopes } from '@shared/constants';

const githubUrl = new URL('https://github.com/settings/tokens/new');
githubUrl.search = new URLSearchParams({
	description: 'Pancake PR dashboard',
	scopes: githubScopes.join(','),
}).toString();

type UserForm = {
	token?: string;
};

export function User(): JSX.Element {
	const logger = useLogger();
	const { openExternal } = useBridge();
	const { config, storeUpdate } = useConfig();
	const methods = useForm<UserForm>({
		defaultValues: {
			token: config?.token ?? '',
		},
	});
	return (
		<Card>
			<FormProvider {...methods}>
				<form
					className="flex flex-col gap-4"
					onSubmit={methods.handleSubmit((data) => {
						logger.debug({ data, msg: 'user info submitted', tags: ['client', 'settings'] });
						storeUpdate({ token: data.token });
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
	);
}
