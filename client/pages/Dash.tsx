import { NetworkStatus } from '@apollo/client';
import { Box, Button, Card, Link } from '@client/components';
import { Tooltip } from '@client/components/Tooltip';
import { useConfig, useReviewsQuery } from '@client/hooks';
import {
	ICommitsFragment,
	IMergeableState,
	IPullRequestsFragment,
	IStatusState,
} from '@client/hooks/graphql';
import { CheckIcon, QuestionMarkCircleIcon, RefreshIcon, XIcon } from '@heroicons/react/outline';
import { MaybeNot, maybeNot } from '@shared/maybeNot';
import { IRepoForm } from '@shared/types/config';
import classNames from 'classnames';
import React, { useEffect } from 'react';

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
	console.log({ repo });
	const vars = {
		name: repo.Name,
		owner: repo.Owner,
		after: null,
		prCount: repo['PR Count'] ?? null,
		reviewsCount: repo['Review Count'] ?? undefined,
	};
	const { data, error, refetch, networkStatus } = useReviewsQuery({
		variables: vars,
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		const timer = setInterval(() => {
			if (networkStatus === NetworkStatus.ready) {
				refetch(vars);
			}
		}, config?.refreshRate ?? 60000);

		return () => clearInterval(timer);
	}, [refetch, config?.refreshRate]);

	if (error) {
		return <p>oh dear, there was an error {error.message}</p>;
	}

	if (!data) {
		return <p>loading...</p>;
	}

	// data.repository?.owner.login
	const cleanData = maybeNot(data);
	// const cleanData = data;

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
				{cleanData.repository.pullRequests.nodes.map((pr) => (
					<PR key={pr.id} {...pr} />
				))}
			</Box>
		</Card>
	);
}

type N<A> = NonNullable<A>;
type IPR = MaybeNot<IPullRequestsFragment['pullRequests']['nodes']>[number];
type Commits = MaybeNot<ICommitsFragment['commits']['nodes']>;

const icons: Record<IStatusState, JSX.Element> = {
	ERROR: <XIcon className="inline-block w-4 text-thmError" />,
	FAILURE: <XIcon className="inline-block w-4 text-thmError" />,
	EXPECTED: <RefreshIcon className="inline-block w-4 animate-spin text-thmWarn" />,
	PENDING: <RefreshIcon className="inline-block w-4 animate-spin text-thmWarn" />,
	SUCCESS: <CheckIcon className="inline-block w-4 text-thmGood" />,
};
const iconsM: Record<IMergeableState, JSX.Element> = {
	CONFLICTING: <XIcon className="inline-block w-4 text-thmError" />,
	UNKNOWN: <QuestionMarkCircleIcon className="inline-block w-4  text-thmWarn" />,
	MERGEABLE: <CheckIcon className="inline-block w-4 text-thmGood" />,
};

function PR(pr: IPR): JSX.Element {
	const { url, status } = getStatus(pr.commits.nodes, pr.url);
	return (
		<Box className="mb-2 bg-thmBackground bg-opacity-50 p-4">
			<Box row>
				<Tooltip Tip={pr.author.login} className="shrink-0 basis-[50px]">
					<Link url={`https://github.com/${pr.author.login}`}>
						<img className="rounded" alt={pr.author.login} src={pr.author.avatarUrl} />
					</Link>
				</Tooltip>

				<Link url={pr.url} className="mx-2 flex-grow">
					<p className="flex-grow underline-offset-2  hover:text-thmSecondary hover:underline">
						{pr.title}
					</p>
				</Link>

				<Box className="">
					<p className="text-thmGood">+{pr.additions}</p>
					<p className="text-thmError">-{pr.deletions}</p>
				</Box>
			</Box>

			<Box row className="items-baseline gap-4 whitespace-nowrap">
				<Link url={url}>
					<p className="text-sm hover:text-thmSecondary hover:underline">checks: {icons[status]}</p>
				</Link>

				<p className="text-sm">
					{pr.mergeable.toLowerCase()} {iconsM[pr.mergeable]}
				</p>

				<div className="flex flex-grow justify-start gap-2 overflow-x-scroll">
					{pr.labels.nodes.map((label) => (
						<span
							key={label.id}
							className="h-fit rounded-full px-2 brightness-150 saturate-50"
							style={{
								backgroundColor: `#${label.color}`,
							}}
						>
							<p className="text-sm text-thmBackground" key={label.id}>
								{label.name}
							</p>
						</span>
					))}
				</div>

				<p>reviews</p>
			</Box>
		</Box>
	);
}

function getStatus(checks: Commits, prUrl: string): { status: IStatusState; url: string } {
	const [check] = checks;
	if (!check) return { status: IStatusState.Error, url: '' };
	return {
		status: check.commit.status?.state ?? IStatusState.Pending,
		url: check.commit.commitUrl ?? prUrl,
	};
}
