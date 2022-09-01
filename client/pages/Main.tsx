import { Box, Button, Page } from '@client/components';
import { useConfig } from '@client/hooks';
import { CodeIcon, CogIcon, DocumentDownloadIcon } from '@heroicons/react/outline';
import { not } from '@shared/utils';
import React, { useState } from 'react';
import { Dash } from './Dash';
import { Login } from './Login';
import { Settings } from './Settings/Settings';

type IPage = 'dash' | 'settings';

const pages: Record<IPage, JSX.Element> = {
	dash: <Dash />,
	settings: <Settings />,
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

function Nav({ navigate, page }: { page: IPage; navigate(page: IPage): void }): JSX.Element {
	return (
		<div className="sticky top-0 bg-thmBackgroundSubtle">
			{page !== 'settings' && (
				<button
					type="button"
					className="rounded-full border-2 border-thmPrimary p-2 text-thmPrimary transition-colors hover:bg-thmBackgroundSubtle hover:brightness-90"
					onClick={() => {
						navigate('settings');
					}}
				>
					<CogIcon className="inline-block w-8" />
				</button>
			)}
			{page !== 'dash' && (
				<button
					type="button"
					onClick={() => {
						navigate('dash');
					}}
					className="rounded-full border-2 border-thmPrimary p-2 text-thmPrimary transition-colors hover:bg-thmBackgroundSubtle hover:brightness-90"
				>
					<CodeIcon className="inline-block w-6" />
				</button>
			)}
		</div>
	);
}
