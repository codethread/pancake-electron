import { Box, Button, Card, FormItemNumber } from '@client/components';
import { useLogger } from '@client/hooks';
import * as Icons from '@heroicons/react/solid';
import { IRepoForm } from '@shared/types/config';
import { ICss } from '@shared/types/ipc';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { merge } from 'remeda';

export function RepoInfo({
	onClick,
	onSubmit,
	className,
	...repo
}: ICss & IRepoForm & { onClick(): void; onSubmit(repo: IRepoForm): void }): JSX.Element {
	const { Name: name, Owner: owner, 'PR Count': prCount } = repo;
	const Icon = Icons.XIcon;
	const methods = useForm<IRepoForm>({
		defaultValues: {
			// 'Review Count': reviewCount,
			'PR Count': prCount,
		},
	});
	const logger = useLogger();

	return (
		<Card className={className}>
			<FormProvider {...methods}>
				<form
					className="flex flex-col gap-4"
					onSubmit={methods.handleSubmit((data) => {
						logger.debug({ data, msg: 'repo updated', tags: ['client', 'settings'] });
						onSubmit(merge(repo, data));
					})}
				>
					<p className="text-2xl">
						{owner} / {name}
					</p>
					<FormItemNumber
						label="PR Count"
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
			<Button variant="secondary" fullWidth onClick={onClick} className="mt-4 text-thmError">
				<Icon className="mr-2 inline-flex w-5" />
				Delete
			</Button>
		</Card>
	);
}
