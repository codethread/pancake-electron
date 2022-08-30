import { ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache } from '@apollo/client';

const authMiddleware = new ApolloLink((operation, forward) => {
	// add the authorization to the headers
	operation.setContext(({ headers = {} }) => ({
		headers: {
			...headers,
			authorization: sessionStorage.getItem('token') ?? null,
		},
	}));

	return forward(operation);
});
const httpLink = new HttpLink({ uri: 'http://localhost:4001' });

export const client = new ApolloClient({
	cache: new InMemoryCache({}),
	assumeImmutableResults: true,
	link: concat(authMiddleware, httpLink),
});
