import React, { useEffect } from 'react';
import { useConfig, useLogger } from '@client/hooks';
import { Box, Button } from '@client/components';

export function Main(): JSX.Element {
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
			<p className="">foo!</p>
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
		</Box>
	);
}
