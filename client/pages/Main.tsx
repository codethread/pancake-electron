import { Page } from '@client/components';
import { useConfig } from '@client/hooks';
import { DocumentDownloadIcon } from '@heroicons/react/outline';
import { not } from '@shared/utils';
import React, { useEffect, useState } from 'react';
import { Dash } from './Dash';
import { Login } from './Login';
import { Nav, IPage } from './Nav';
import { Settings } from './Settings/Settings';
import { User } from './Settings/User';

const pages: Record<IPage, JSX.Element> = {
	dash: <Dash />,
	settings: <Settings />,
	user: <User />,
};

export function Main(): JSX.Element {
	const { config, loading } = useConfig();
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

	if (not(Boolean(config.token))) {
		return (
			<Page center>
				<Login />
			</Page>
		);
	}

	return (
		<Page>
			<div className="block sm:flex sm:flex-row">
				<Nav navigate={setPage} page={page} />
				{pages[page]}
			</div>
		</Page>
	);
}
