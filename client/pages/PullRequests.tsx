import { useConfig } from '@client/hooks';
import React from 'react';
import { Repo } from './pull-requests/Repo';

export function PullRequests(): JSX.Element {
	const { config } = useConfig();

	return (
		<div className="flex flex-grow flex-col gap-5 px-2 sm:flex-row">
			{config?.repos.map((repo, i) => (
				<Repo {...repo} key={i} />
			))}
		</div>
	);
}
