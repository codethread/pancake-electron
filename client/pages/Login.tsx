import React, { useState } from 'react';
import { useConfig } from '@client/hooks';
import { Box, FormItemPassword } from '@client/components';

export function Login(): JSX.Element {
	const { storeUpdate } = useConfig();
	const [token, setToken] = useState('');
	return (
		<Box>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					storeUpdate({
						token,
					});
				}}
			>
				<FormItemPassword
					label="token"
					input={{
						value: token,
						placeholder: 'foo bar bax',
						onChange: (p) => {
							setToken(p);
						},
					}}
				/>
			</form>
		</Box>
	);
}
