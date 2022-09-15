import { NetworkStatus } from '@apollo/client';
import { Box, Button, Card, Link } from '@client/components';
import { useConfig, useLogger, useReviewsQuery } from '@client/hooks';
import { RefreshIcon } from '@heroicons/react/outline';
import { maybeNot } from '@shared/maybeNot';
import { IRepoForm } from '@shared/types/config';
import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { Pull } from './Pull';

export function Repo(repo: IRepoForm): JSX.Element {
	const { config } = useConfig();
	const { info } = useLogger();
	const vars = useMemo(
		() => ({
			name: repo.Name,
			owner: repo.Owner,
			after: null,
			prCount: repo['PR Count'] ?? null,
			// reviewsCount: repo['Review Count'] ?? undefined,
		}),
		[repo]
	);
	const { data, error, refetch, networkStatus } = useReviewsQuery({
		variables: vars,
		notifyOnNetworkStatusChange: true,
	});

	info({ msg: 'github limit', data: data?.rateLimit, tags: ['client', 'github'] });

	useEffect(() => {
		const timer = setInterval(() => {
			if (networkStatus === NetworkStatus.ready) {
				refetch(vars);
			}
		}, config?.refreshRate ?? 60000);

		return () => clearInterval(timer);
	}, [refetch, config?.refreshRate, vars, networkStatus]);

	if (error) {
		return <p>oh dear, there was an error {error.message}</p>;
	}

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
						{repo.Owner} / {repo.Name}
					</p>
				</Link>
				<Button variant="icon" onClick={() => void refetch()}>
					<RefreshIcon
						className={classNames('w-6', {
							'animate-spin': networkStatus === NetworkStatus.refetch,
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
