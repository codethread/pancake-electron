import { Box, Button, Card, FormItemNumber, FormItemText } from '@client/components';
import { useLogger } from '@client/hooks';
import { IRepoForm } from '@shared/types/config';
import { ICss } from '@shared/types/ipc';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

type IRepoFormC = ICss & {
	existingRepos: string[];
	onSubmit(repo: IRepoForm): void;
};

export function RepoForm({ onSubmit, className, existingRepos }: IRepoFormC): JSX.Element {
	const logger = useLogger();
	const methods = useForm<Omit<IRepoForm, 'id'>>({});
	const { Name, Owner, 'PR Count': prCount } = methods.formState.errors;
	return (
		<Card className={className}>
			<FormProvider {...methods}>
				<form
					className="flex flex-col gap-4"
					onSubmit={methods.handleSubmit((data) => {
						logger.debug({ data, msg: 'repo submitted', tags: ['client', 'settings'] });
						const id = idFromRepo(data);
						if (existingRepos.includes(id)) {
							methods.setError('Name', { message: 'A repo with this name exists' });
							methods.setError('Owner', { message: 'A repo with this owner exists' });
						} else {
							onSubmit({ ...data, id: idFromRepo(data) });
							methods.reset();
						}
					})}
				>
					<FormItemText
						label="Owner"
						required="Please specify an owner"
						placeholder="Octocat"
						errord={Owner}
					/>
					<FormItemText
						errord={Name}
						label="Name"
						required="Please specify a repository"
						placeholder="MyFirstRepository"
					/>
					<FormItemNumber
						errord={prCount}
						label="PR Count"
						required="Please specify a number of PRs to retrieve"
						min={{ value: 1, message: 'You must request at least one PR' }}
						max={{ value: 100, message: 'Max 100' }}
					/>
					{/* <FormItemNumber */}
					{/* 	label="Review Count" */}
					{/* 	min={{ value: 1, message: 'You must request at least one review' }} */}
					{/* 	max={{ value: 10, message: 'Max 10' }} */}
					{/* /> */}
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
function idFromRepo(data: Omit<IRepoForm, 'id'>): string {
	return `${data.Owner}/${data.Name}`;
}
