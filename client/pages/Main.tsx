import { Box, Page } from '@client/components';
import { usePage } from '@client/hooks';
import { IPage } from '@client/machines';
import { DocumentDownloadIcon } from '@heroicons/react/outline';
import React, { FC } from 'react';
import { Login } from './Login';
import { Nav } from './Nav';
import { PullRequests } from './PullRequests';
import { RepoSettings } from './Settings/Repo';
import { User } from './Settings/User';

const pages: Record<IPage, FC> = {
	repos: PullRequests,
	settings: RepoSettings,
	user: User,
	loading: Loading,
	login: Login,
};

export function Main(): JSX.Element {
	const { page } = usePage();

	const View = pages[page];
	return (
		<Page>
			<div className="block sm:flex sm:flex-row">
				<Nav />
				<View />
			</div>
		</Page>
	);
}

function Loading(): JSX.Element {
	return (
		<Box className="h-full w-full">
			<span className="text-center">
				<DocumentDownloadIcon className="mb-4 inline-block h-8 w-8 animate-pulse" />
				<p>loading config ...</p>
			</span>
		</Box>
	);
}
