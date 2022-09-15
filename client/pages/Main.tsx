import { Page } from '@client/components';
import { useConfig, useToken } from '@client/hooks';
import { DocumentDownloadIcon } from '@heroicons/react/outline';
import { not } from '@shared/utils';
import React, { FC, useEffect, useState } from 'react';
import { PullRequests } from './PullRequests';
import { Login } from './Login';
import { Nav, IPage } from './Nav';
import { RepoSettings } from './Settings/Repo';
import { User } from './Settings/User';

const pages: Record<IPage, FC> = {
	dash: PullRequests,
	settings: RepoSettings,
	user: User,
};

export function Main(): JSX.Element {
	const { config, loading } = useConfig();
	const { token } = useToken();
	const [page, setPage] = useState<IPage>('dash');

	if (loading) {
		return (
			<Page center>
				<span className="text-center">
					<DocumentDownloadIcon className="mb-4 inline-block h-8 w-8 animate-pulse" />
					<p>loading config ...</p>
				</span>
			</Page>
		);
	}

	if (not(Boolean(token))) {
		return (
			<Page center>
				<Login />
			</Page>
		);
	}

	const View = pages[page];
	return (
		<Page>
			<div className="block sm:flex sm:flex-row">
				<Nav navigate={setPage} page={page} />
				<View />
			</div>
		</Page>
	);
}
