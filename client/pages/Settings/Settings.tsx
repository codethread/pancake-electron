import { Box, Button } from '@client/components';
import { useConfig, useLogger } from '@client/hooks';
import * as Icons from '@heroicons/react/solid';
import { useMachine } from '@xstate/react';
import React, { useEffect } from 'react';
import { Page, repoMachine, RepoSend } from './repo.machine';
import { RepoForm } from './RepoForm';
import { RepoInfo } from './RepoInfo';
import { User } from './User';

export function Settings(): JSX.Element {
	const { storeUpdate, config } = useConfig();
	const { debug } = useLogger();
	const [state, send, service] = useMachine(
		() => repoMachine.withContext({ repos: config?.repos ?? [] }),
		{
			devTools: true,
			actions: {
				sendReposToConfig({ repos }) {
					storeUpdate({ repos });
				},
			},
		}
	);

	useEffect(() => {
		service.onEvent((e) => {
			debug({ data: e, msg: 'repo machine' });
		});
	}, [service, debug]);

	return (
		<div className="flex flex-grow flex-col gap-4 md:flex-row">
			<RepoForm
				className="sticky top-[78px] h-fit drop-shadow-lg sm:top-4 md:w-[350px]"
				onSubmit={(data) => {
					send({ type: 'add repo', data });
				}}
			/>
			<Box className="flex-grow gap-4">
				{state.context.repos.map((repo) => (
					<RepoInfo
						{...repo}
						className="flex-grow md:max-w-[450px]"
						key={`${repo.Owner}/${repo.Name}`}
						onClick={() => {
							send({ type: 'delete repo', data: repo.id });
						}}
						onSubmit={(data) => {
							send({ type: 'update repo', data });
						}}
					/>
				))}
			</Box>
		</div>
	);
}
