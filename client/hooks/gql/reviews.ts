/* eslint-disable @typescript-eslint/no-unused-expressions */
import { gql } from '@apollo/client';

gql`
	query Reviews(
		$name: String!
		$owner: String!
		$prCount: Int = 5
		$reviewsCount: Int = 15
		$after: String
	) {
		rateLimit {
			limit
			cost
			nodeCount
			remaining
			resetAt
		}
		repository(name: $name, owner: $owner) {
			name
			owner {
				login
			}
			url
			...pullRequests
		}
	}

	fragment pullRequests on Repository {
		pullRequests(
			first: $prCount
			states: [OPEN]
			after: $after
			orderBy: { field: UPDATED_AT, direction: DESC }
		) {
			pageInfo {
				hasNextPage
				endCursor
			}

			nodes {
				id
				number
				baseRefName
				headRefName
				additions
				deletions
				labels(first: 10) {
					nodes {
						id
						name
						color
						description
					}
				}
				id
				createdAt
				url
				title
				isDraft
				# mergeStateStatus
				mergeable

				...commits

				author {
					login
					avatarUrl
				}

				reviewRequests(first: 1) {
					nodes {
						requestedReviewer {
							__typename
							... on User {
								userName: name
								userAvatarUrl: avatarUrl
							}
							... on Team {
								teamName: name
								teamAvatarUrl: avatarUrl
							}
						}
					}
				}

				reviews(first: $reviewsCount, states: [CHANGES_REQUESTED, APPROVED, DISMISSED]) {
					nodes {
						url
						createdAt
						state
						authorAssociation

						author {
							login
							avatarUrl
						}

						onBehalfOf(first: 1) {
							nodes {
								login: name
								avatarUrl
							}
						}
					}
				}
			}
		}
	}

	fragment commits on PullRequest {
		commits(last: 1) {
			nodes {
				commit {
					commitUrl
					message
					status {
						contexts {
							description
							avatarUrl
							state
						}
						state
					}
				}
			}
		}
	}
`;
