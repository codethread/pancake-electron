import { useConfig } from '@client/hooks';
import React from 'react';
import { Repo } from './Repo';

export function Dash(): JSX.Element {
	const { config } = useConfig();

	return (
		<div className="flex flex-grow flex-col gap-5 px-2 sm:flex-row">
			{config?.repos.map((repo, i) => (
				<Repo {...repo} key={i} />
			))}
		</div>
	);
}
