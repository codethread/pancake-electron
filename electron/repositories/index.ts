import { isIntegration } from '@shared/constants';
import { RepoArgs, Repositories } from './production';

export { type Repositories };

export const createRepos = async (args: RepoArgs): Promise<Repositories> =>
	isIntegration
		? import('./fakes').then((m) => m.default())
		: import('./production').then((m) => m.default(args));
