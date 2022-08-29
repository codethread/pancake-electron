import React from 'react';
import { useLogger } from '@client/hooks';
import { Box, Button } from '@client/components';

export function Main(): JSX.Element {
	const log = useLogger();
	return (
		<Box>
			<p className="">foo!</p>
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
