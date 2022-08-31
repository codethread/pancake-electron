import { Box, Button, Card, FormItemNumber, FormItemText } from '@client/components';
import { useLogger } from '@client/hooks';
import { IRepoForm } from '@shared/types/config';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { mapKeys } from 'remeda';

export function RepoForm({ onSubmit }: { onSubmit(repo: IRepoForm): void }): JSX.Element {
	const logger = useLogger();
	const methods = useForm<IRepoForm>({});
	return (
		<Card>
			<FormProvider {...methods}>
				<form
					className="flex flex-col gap-4"
					onSubmit={methods.handleSubmit((data) => {
						logger.debug({ data, msg: 'repo submitted', tags: ['client', 'settings'] });
						onSubmit(mapKeys(data, (k) => k.toLowerCase()));
						methods.reset();
					})}
				>
					<FormItemText label="Owner" required="Please specify an owner" placeholder="Octocat" />
					<FormItemText
						label="Name"
						required="Please specify a repository"
						placeholder="MyFirstRepository"
					/>
					<FormItemNumber
						label="PR Count"
						min={{ value: 1, message: 'You must request at least one PR' }}
						max={{ value: 100, message: 'Max 100' }}
					/>
					<FormItemNumber
						label="Review Count"
						min={{ value: 1, message: 'You must request at least one review' }}
						max={{ value: 10, message: 'Max 10' }}
					/>
					<Box row>
						<Button type="submit">Submit!</Button>
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
