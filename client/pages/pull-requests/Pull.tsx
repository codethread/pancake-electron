import { Box, Link } from '@client/components';
import { Tooltip } from '@client/components/Tooltip';
import { useLogger } from '@client/hooks';
import {
	ICommitsFragment,
	IMergeableState,
	IPullRequestReviewState,
	IPullRequestsFragment,
	IStatusState,
} from '@client/hooks/graphql';
import { CheckIcon, QuestionMarkCircleIcon, RefreshIcon, XIcon } from '@heroicons/react/outline';
import { MaybeNot } from '@shared/maybeNot';
import classNames from 'classnames';
import React from 'react';

export function Pull(pr: IPR): JSX.Element {
	const { debug } = useLogger();
	const { url, status } = getStatus(pr.commits.nodes, pr.url);
	const reviews = getReviews(pr);
	debug({ msg: `pr ${pr.title}`, data: { pr, reviews, status }, tags: ['gql'] });
	return (
		<Box className="gap-1 bg-thmBackground bg-opacity-50 p-4">
			<Box row>
				<Tooltip Tip={pr.author.login} className="shrink-0 basis-[50px]">
					<Link href={`https://github.com/${pr.author.login}`}>
						<img className="rounded" alt={pr.author.login} src={pr.author.avatarUrl} />
					</Link>
				</Tooltip>

				<Link href={pr.url} className="mx-2 flex-grow">
					<p className="flex-grow underline-offset-2  hover:text-thmSecondary hover:underline">
						{pr.title}
					</p>
				</Link>

				<Box>
					<p className="text-thmGood">+{pr.additions}</p>
					<p className="text-thmError">-{pr.deletions}</p>
				</Box>
			</Box>

			<Box row className="items-center gap-4 whitespace-nowrap">
				<Link href={url}>
					<p className="text-sm hover:text-thmSecondary hover:underline">checks: {icons[status]}</p>
				</Link>

				<p className="text-sm">
					{pr.mergeable.toLowerCase()} {iconsM[pr.mergeable]}
				</p>

				<div className="hide-scrollbar flex flex-grow justify-start gap-2 overflow-x-scroll">
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

				<div className="flex flex-grow flex-row items-stretch justify-end gap-1">
					{reviews.map((r) => (
						<Link href={r.link} key={r.name}>
							<img
								alt={r.name}
								src={r.imageUrl}
								className={classNames('box-content w-[25px] rounded border-4', {
									'border-thmError': r.state === IPullRequestReviewState.ChangesRequested,
									'border-thmPrimary': r.state === IPullRequestReviewState.Pending,
									'border-thmGood': r.state === IPullRequestReviewState.Approved,
									'border-thmWarn': r.state === IPullRequestReviewState.Commented,
									'border-thmBackground': r.state === IPullRequestReviewState.Dismissed,
								})}
							/>
						</Link>
					))}
				</div>
			</Box>
		</Box>
	);
}

type N<A> = NonNullable<A>;
export type IPR = MaybeNot<IPullRequestsFragment['pullRequests']['nodes']>[number];
type Commits = ICommitsFragment['commits']['nodes'];

export const icons: Record<IStatusState, JSX.Element> = {
	ERROR: <XIcon className="inline-block w-4 text-thmError" />,
	FAILURE: <XIcon className="inline-block w-4 text-thmError" />,
	EXPECTED: <RefreshIcon className="inline-block w-4 animate-spin text-thmWarn" />,
	PENDING: <RefreshIcon className="inline-block w-4 animate-spin text-thmWarn" />,
	SUCCESS: <CheckIcon className="inline-block w-4 text-thmGood" />,
};
export const iconsM: Record<IMergeableState, JSX.Element> = {
	CONFLICTING: <XIcon className="inline-block w-4 text-thmError" />,
	UNKNOWN: <QuestionMarkCircleIcon className="inline-block w-4  text-thmWarn" />,
	MERGEABLE: <CheckIcon className="inline-block w-4 text-thmGood" />,
};

export function getStatus(checks: Commits, prUrl: string): { status: IStatusState; url: string } {
	const [check] = checks ?? [];
	if (!check) return { status: IStatusState.Error, url: '' };
	return {
		status: check.commit.status?.state ?? IStatusState.Pending,
		url: check.commit.commitUrl,
	};
}

type Reviews = {
	state: IPullRequestReviewState;
	name: string;
	imageUrl: string;
	link: string;
};

function getReviews(pr: IPR): Reviews[] {
	const sorted = [...pr.reviews.nodes].sort((r1, r2) => (r1.createdAt > r2.createdAt ? -1 : 1));
	const uniq = sorted.filter(
		(r, i, all) => all.findIndex(({ author }) => author.login === r.author.login) === i
	);
	return uniq.map((r) => ({
		name: r.author.login,
		imageUrl: r.author.avatarUrl,
		state: r.state,
		link: r.url,
	}));
}
