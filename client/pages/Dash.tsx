import React, { useState } from 'react';
import { useConfig, useLogger, useReviewsQuery } from '@client/hooks';
import { Box, Button } from '@client/components';
import { not } from '@shared/utils';
import { IRepoForm } from '@shared/types/config';
import { Settings } from './Settings/Settings';

export function Dash(): JSX.Element {
	const log = useLogger();
	const [settings, setSettings] = useState(true);
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
	const { data, error } = useReviewsQuery({
		variables: {
			name: repo.name,
			owner: repo.owner,
		},
	});

	if (error) {
		throw error;
	}

	if (not(data)) {
		return <p>loading...</p>;
	}
	return (
		<Box className="m-4 rounded border border-thmFgDim p-4">
			<p>
				{repo.owner} / {repo.name}
			</p>
			{data?.repository?.pullRequests.nodes?.map((pr) => (
				<Box key={pr?.id} className="m-4 border border-thmPrimary">
					<p>img: {pr?.author?.login}</p>
					<p>title: {pr?.title}</p>
					<p>labels</p>
					<Box className="flex flex-row">
						{pr?.labels?.nodes.map((label) => (
							<p key={label?.id}>{label?.name}</p>
						))}
					</Box>
				</Box>
			))}
		</Box>
	);
}
