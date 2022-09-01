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
	}, [service]);

	return (
		<Box row>
			<div className="m-2 flex flex-col items-stretch justify-start gap-4">
				<IconButton icon="UserIcon" title="User" send={send} />
				{/* <IconButton icon="UserGroupIcon" title="Teams" send={send} /> */}
				<IconButton icon="CodeIcon" title="Repos" send={send} />
				{/* <IconButton icon="BellIcon" title="Notifications" send={send} /> */}
			</div>
			<Box className="flex-grow flex-wrap" row>
				{(() => {
					switch (true) {
						case state.matches('repos'):
							return (
								<>
									<RepoForm
										onSubmit={(data) => {
											send({ type: 'add repo', data });
										}}
									/>
									{state.context.repos.map((repo) => (
										<RepoInfo
											{...repo}
											key={`${repo.Owner}/${repo.Name}`}
											onClick={() => {
												send({ type: 'delete repo', data: repo.id });
											}}
											onSubmit={(data) => {
												send({ type: 'update repo', data });
											}}
										/>
									))}
								</>
							);
						case state.matches('user'):
						default:
							return <User />;
					}
				})()}
			</Box>
		</Box>
	);
}

function IconButton({
	icon,
	title,
	send,
}: {
	title: Page;
	icon: keyof typeof Icons;
	send: RepoSend;
}): JSX.Element {
	const Icon = Icons[icon];
	return (
		<Button variant="secondary" fullWidth onClick={() => send({ type: 'navigate', page: title })}>
			<Icon className="mr-2 inline-flex w-5" />
			{title}
		</Button>
	);
}
