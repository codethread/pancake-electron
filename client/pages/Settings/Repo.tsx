import React from 'react';
import { Box } from '@client/components';
import { useConfig, useMachineLogger } from '@client/hooks';
import { useMachine } from '@xstate/react';
import { repoMachine, RepoSend, RepoState } from './repo/repo.machine';
import { RepoForm } from './repo/RepoForm';
import { RepoInfo } from './repo/RepoInfo';

const useRepoSettings = (): { state: RepoState; send: RepoSend } => {
	const { storeUpdate, config } = useConfig();
	const [state, send, service] = useMachine(
		() => repoMachine.withContext({ repos: config?.repos ?? [] }),
		{
			actions: {
				sendReposToConfig({ repos }) {
					storeUpdate({ repos });
				},
			},
		}
	);

	useMachineLogger(service);

	return {
		state,
		send,
	};
};

export function RepoSettings(): JSX.Element {
	const { send, state } = useRepoSettings();

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
