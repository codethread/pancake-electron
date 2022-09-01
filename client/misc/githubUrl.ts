import { githubScopes } from '@shared/constants';

const url = new URL('https://github.com/settings/tokens/new');
url.search = new URLSearchParams({
	description: 'Pancake PR dashboard',
	scopes: githubScopes.join(','),
}).toString();

export const githubUrl = url.href;
