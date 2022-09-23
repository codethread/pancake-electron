import { Box } from '@client/components';
import { useRepoService } from '@client/hooks';
import React from 'react';
import { useSelector } from '@xstate/react';
import { RepoForm } from './repo/RepoForm';
import { RepoInfo } from './repo/RepoInfo';

export function RepoSettings(): JSX.Element {
	const [m, send] = useRepoService();
	const repos = useSelector(m, (s) => s.context.repos);
	const ids = repos.map((r) => r.id);

	return (
		<div className="flex flex-grow flex-col gap-4 md:flex-row">
			<RepoForm
				className="sticky top-[78px] h-fit drop-shadow-lg sm:top-4 md:w-[350px]"
				existingRepos={ids}
				onSubmit={(data) => {
					send({ type: 'add repo', data });
				}}
			/>
			<Box className="flex-grow gap-4">
				{repos.map((repo) => (
					<RepoInfo key={repo.id} actRef={repo.actRef} className="flex-grow md:max-w-[450px]" />
				))}
			</Box>
		</div>
	);
}
