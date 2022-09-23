import { useRepoService } from '@client/hooks';
import { useSelector } from '@xstate/react';
import React from 'react';
import { Repo } from './pull-requests/Repo';

export function PullRequests(): JSX.Element {
	// const repos = useRepoConfig();
	const [m] = useRepoService();
	const repos = useSelector(m, (s) => s.context.repos);

	return (
		<div className="flex flex-grow flex-col gap-5 px-2 sm:flex-row">
			{repos.map((repo) => (
				// <Repo name={repo.Name} key={repo.Name} />
				<Repo actRef={repo.actRef} key={repo.id} />
			))}
		</div>
	);
}
