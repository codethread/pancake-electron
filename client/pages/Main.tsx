import React, { useEffect } from 'react';
import { useConfig } from '@client/hooks';
import { not } from '@shared/utils';
import { Login } from './Login';
import { Dash } from './Dash';

export function Main(): JSX.Element {
	const { config, loading } = useConfig();

	if (loading) {
		return <p>loading config...</p>;
	}

	if (not(Boolean(config.token))) {
		return <Login />;
	}
	return <Dash />;
}
