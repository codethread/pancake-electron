import React, { useEffect, useState } from 'react';
import { useConfig, useLogger } from '@client/hooks';
import { Box, Button } from '@client/components';

export function Main(): JSX.Element {
	const [foo, setFoo] = useState(0);
	const { config } = useConfig();
	const log = useLogger();
	useEffect(() => {
		fetch('http://localhost:4001', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				query: `
	query ExampleQuery($login: String!) {
	  user(login: $login) {
	    company
	  }
	}
	`,
				variables: {
					login: 'hello',
				},
			}),
		});
	}, []);

	return (
		<Box>
			<p className="">foo!: {foo}</p>
			<p>config: {config?.token ?? 'loading'}</p>
			<Button
				data-testid="e2e-button"
				onClick={() => {
					log.info({
						data: { hi: 'matt' },
						msg: 'started',
						tags: ['electron', 'foo'],
					});
				}}
			>
				click
			</Button>
			<Button
				variant="secondary"
				onClick={() => {
					setFoo(foo + 1);

					const NOTIFICATION_TITLE = `Title ${foo}`;
					const NOTIFICATION_BODY =
						'Notification from the Renderer process. Click to log to console.';

					const noty = new Notification(NOTIFICATION_TITLE, {
						body: NOTIFICATION_BODY,
						// icon: './public/storybook-icon.png',
					});
					noty.onclick = () => {
						setFoo(foo + 5);
					};
				}}
			>
				Notify
			</Button>
		</Box>
	);
}
