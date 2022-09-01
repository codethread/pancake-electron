import React, { useEffect, useState } from 'react';
import { useConfig, useLogger, useReviewsQuery } from '@client/hooks';
import { Box, Button } from '@client/components';
import { not } from '@shared/utils';
import { IRepoForm } from '@shared/types/config';
import { RefreshIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { NetworkStatus } from '@apollo/client';
import { Settings } from './Settings/Settings';

export function Dash(): JSX.Element {
	const log = useLogger();
	const [settings, setSettings] = useState(false);
	const { config } = useConfig();

	return (
		<div className="mx-4 flex w-full flex-col">
			<Button onClick={() => setSettings(not(settings))}>Settings</Button>
			{settings && (
				<div className="flex w-full flex-row flex-wrap gap-3">
					<Settings />
				</div>
			)}
			{!settings && config?.repos.map((repo, i) => <Repo {...repo} key={i} />)}
		</div>
	);
}

function Repo(repo: IRepoForm): JSX.Element {
	const { config } = useConfig();
	const { data, error, refetch, networkStatus } = useReviewsQuery({
		variables: {
			name: repo.Name,
			owner: repo.Owner,
		},
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		const timer = setInterval(() => {
			if (networkStatus === NetworkStatus.ready) {
				refetch();
			}
		}, config?.refreshRate ?? 60000);

		return () => clearInterval(timer);
	}, [refetch, config?.refreshRate]);

	if (error) {
		return <p>oh dear, there was an error {error.message}</p>;
	}

	if (not(data)) {
		return <p>loading...</p>;
	}
	return (
		<Box className="m-4 rounded border border-thmFgDim p-4">
			<Box row>
				<p>
					{repo.Owner} / {repo.Name}
				</p>
				<Button variant="secondary" onClick={() => void refetch()}>
					<RefreshIcon
						className={classNames('w-6', {
							'animate-spin': networkStatus === NetworkStatus.refetch,
						})}
					/>
				</Button>
			</Box>
			{data?.repository?.pullRequests.nodes?.map((pr) => (
				<Box key={pr?.id} className="m-4 border border-thmPrimary">
					<p>img: {pr?.author?.login}</p>
					<p>title: {pr?.title}</p>
					<p>labels</p>
					<Box className="flex flex-row">
						{pr?.labels?.nodes?.map((label) => (
							<p key={label?.id}>{label?.name}</p>
						))}
					</Box>
				</Box>
			))}
		</Box>
	);
}
