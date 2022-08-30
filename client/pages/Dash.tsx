import React, { useState } from 'react';
import { useLogger, useReviewsQuery } from '@client/hooks';
import { Box, Button } from '@client/components';
import { not } from '@shared/utils';

export function Dash(): JSX.Element {
	const log = useLogger();

	return <PR />;
}

function PR(): JSX.Element {
	const { data, error } = useReviewsQuery({
		variables: {
			name: 'foo',
			owner: 'bar',
		},
	});

	if (error) {
		throw error;
	}

	if (not(data)) {
		return <p>loading...</p>;
	}
	return (
		<Box className="m-4 rounded border border-thmFgDim p-4">
			<p>
				{data?.repository?.owner?.login} / {data?.repository?.name}
			</p>
			{data?.repository?.pullRequests.nodes?.map((pr) => (
				<Box key={pr?.id}>
					<p>img: {pr?.author?.login}</p>
					<p>title: {pr?.title}</p>
					<Box className="flex-row">
						{pr?.labels?.nodes.map((label) => (
							<p key={label?.id}>{label?.name}</p>
						))}
					</Box>
				</Box>
			))}
		</Box>
	);
}
