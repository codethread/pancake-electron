import React, { useEffect, useState } from 'react';
import { useConfig, useLogger, useReviewsQuery } from '@client/hooks';
import { Box, Button, Card } from '@client/components';
import { not } from '@shared/utils';
import * as R from 'remeda';
import { IRepoForm } from '@shared/types/config';
import { CheckIcon, QuestionMarkCircleIcon, RefreshIcon, XIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { NetworkStatus } from '@apollo/client';
import { MergeableState, PullRequest, ReviewsQuery, StatusState } from '@client/hooks/graphql';

export function Dash(): JSX.Element {
	const { config } = useConfig();

	return (
		<div className="flex flex-grow flex-col gap-5 px-2 sm:flex-row">
			{config?.repos.map((repo, i) => (
				<Repo {...repo} key={i} />
			))}
		</div>
	);
}

function Repo(repo: IRepoForm): JSX.Element {
	const { config } = useConfig();
	const { data, error, refetch, networkStatus } = useReviewsQuery({
		variables: {
			name: repo.Name,
			owner: repo.Owner,
		},
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		const timer = setInterval(() => {
			if (networkStatus === NetworkStatus.ready) {
				refetch();
			}
		}, config?.refreshRate ?? 60000);

		return () => clearInterval(timer);
	}, [refetch, config?.refreshRate]);

	if (error) {
		return <p>oh dear, there was an error {error.message}</p>;
	}

	if (not(data)) {
		return <p>loading...</p>;
	}
	return (
		<Card noPad className="max-w-[450px]">
			<Box row>
				<p>
					{repo.Owner} / {repo.Name}
				</p>
				<Button variant="icon" onClick={() => void refetch()}>
					<RefreshIcon
						className={classNames('w-6', {
							'animate-spin': networkStatus === NetworkStatus.refetch,
						})}
					/>
				</Button>
			</Box>
			<Box className="mb-6">
				{data?.repository?.pullRequests.nodes?.map((pr) =>
					pr ? <PR key={pr.id} {...pr} /> : <p>???</p>
				)}
			</Box>
		</Card>
	);
}

type N<A> = NonNullable<A>;
type IPR = N<N<N<ReviewsQuery['repository']>['pullRequests']['nodes']>[number]>;
type Commits = N<N<IPR['commits']>['nodes']>;
const icons: Record<StatusState, JSX.Element> = {
	ERROR: <XIcon className="inline-block w-4 text-thmError" />,
	FAILURE: <XIcon className="inline-block w-4 text-thmError" />,
	EXPECTED: <RefreshIcon className="inline-block w-4 animate-spin text-thmWarn" />,
	PENDING: <RefreshIcon className="inline-block w-4 animate-spin text-thmWarn" />,
	SUCCESS: <CheckIcon className="inline-block w-4 text-thmGood" />,
};
const iconsM: Record<MergeableState, JSX.Element> = {
	CONFLICTING: <XIcon className="inline-block w-4 text-thmError" />,
	UNKNOWN: <QuestionMarkCircleIcon className="inline-block w-4  text-thmWarn" />,
	MERGEABLE: <CheckIcon className="inline-block w-4 text-thmGood" />,
};

function PR(pr: IPR): JSX.Element {
	const { url, status } = getStatus(pr.commits.nodes, pr.url);
	return (
		<Box key={pr.id} className="mb-2 bg-thmBackground bg-opacity-50 p-4">
			<Box row>
				<img
					className="aspect-square w-[50px] rounded"
					alt={pr.author?.login ?? 'unknown'}
					src={pr.author?.avatarUrl ?? 'http://placekitten.com/200/300'}
				/>
				<p className="flex-grow">{pr.title}</p>
				<Box className="">
					<p className="text-thmGood">+{pr.additions}</p>
					<p className="text-thmError">-{pr.deletions}</p>
				</Box>
			</Box>
			<Box row className="gap-4">
				<p className="text-sm">checks: {icons[status]}</p>
				<p className="text-sm">
					{pr.mergeable.toLowerCase()} {iconsM[pr.mergeable]}
				</p>
				<div className="flex flex-grow justify-start gap-2">
					{pr.labels?.nodes?.map((label) => (
						<span
							className="h-fit rounded-full px-2 brightness-150 saturate-50"
							style={{
								backgroundColor: `#${label?.color ?? '000'}`,
							}}
						>
							<p className="text-sm text-thmBackground" key={label?.id}>
								{label?.name}
							</p>
						</span>
					))}
				</div>
				<p>reviews</p>
			</Box>
		</Box>
	);
}

function getStatus(checks: Commits, prUrl: string): { status: StatusState; url: string } {
	const [check] = checks;
	if (!check) return { status: StatusState.Pending, url: '' };
	return {
		status: check?.commit.status?.state ?? StatusState.Pending,
		url: check.commit.commitUrl ?? prUrl,
	};
}
