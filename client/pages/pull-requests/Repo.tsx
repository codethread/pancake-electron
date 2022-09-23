import { Box, Button, Card, Link } from '@client/components';
import { RepoUnActorRef } from '@client/machines';
import { RefreshIcon } from '@heroicons/react/outline';
import { maybeNot } from '@shared/maybeNot';
import { useActor } from '@xstate/react';
import classNames from 'classnames';
import React from 'react';
import { Pull } from './Pull';

export function Repo({ actRef: ref }: { actRef: RepoUnActorRef }): JSX.Element {
	const [state, send] = useActor(ref);
	const { name, owner } = state.context.githubVars;
	const { data } = state.context;
	const fetching = state.hasTag('fetching');

	// if (error) {
	// 	return <p>oh dear, there was an error {error.message}</p>;
	// }

	if (!data) {
		return (
			<Card noPad className="sm:min-w-[350px] sm:max-w-[450px]">
				<Box className="h-full">
					<p className="text-center">Loading...</p>
				</Box>
			</Card>
		);
	}

	const cleanData = maybeNot(data);

	return (
		<Card noPad className="sm:min-w-[350px] sm:max-w-[450px]">
			<Box row>
				<Link href={cleanData.repository.url}>
					<p className="ml-2 text-lg hover:text-thmSecondary hover:underline">
						{owner} / {name}
					</p>
				</Link>
				<Button
					variant="icon"
					onClick={() => {
						send({ type: 'REFETCH' });
					}}
				>
					<RefreshIcon
						className={classNames('w-6', {
							'animate-spin': fetching,
						})}
					/>
				</Button>
			</Box>
			<Box className="mb-6 gap-2">
				{cleanData.repository.pullRequests.nodes.map((pr) => (
					<Pull key={pr.id} {...pr} />
				))}
			</Box>
		</Card>
	);
}
