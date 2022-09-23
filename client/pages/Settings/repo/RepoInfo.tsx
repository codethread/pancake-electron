import { Box, Button, Card, FormItemNumber } from '@client/components';
import { useLogger } from '@client/hooks';
import { RepoUnActorRef } from '@client/machines';
import { XIcon } from '@heroicons/react/solid';
import { IRepoForm } from '@shared/types/config';
import { ICss } from '@shared/types/ipc';
import { useActor } from '@xstate/react';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export function RepoInfo({ className, actRef }: ICss & { actRef: RepoUnActorRef }): JSX.Element {
	const [state, send] = useActor(actRef);

	const { name, reviewCount, prCount, owner, id } = state.context.githubVars;
	const methods = useForm<IRepoForm>({
		defaultValues: {
			// 'Review Count': reviewCount,
			'PR Count': prCount,
		},
	});
	const logger = useLogger();
	const { cost, limit } = state.context.data?.rateLimit ?? {};
	const fetching = state.hasTag('fetching');

	return (
		<Card className={className}>
			<FormProvider {...methods}>
				<form
					className="flex flex-col gap-4"
					onSubmit={methods.handleSubmit((data) => {
						logger.debug({ data, msg: 'repo updated', tags: ['client', 'settings'] });
						send({
							type: 'updateInfo',
							data: {
								id,
								owner,
								prCount: data['PR Count'] ?? prCount,
								reviewCount,
								name,
							},
						});
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
			<Button
				variant="secondary"
				fullWidth
				onClick={() => {
					send({ type: 'DELETE' });
				}}
				className="mt-4 mb-4 text-thmError"
			>
				<XIcon className="mr-2 inline-flex w-5" />
				Delete
			</Button>
			{fetching && <p className="text-xs text-thmFgDim">calculating cost...</p>}
			{cost ? (
				<p className="text-xs text-thmFgDim">
					current requests are costing {cost} out of {limit} per hour
				</p>
			) : null}
		</Card>
	);
}
