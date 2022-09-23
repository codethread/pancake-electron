import { RepoActorRef, RepoSend } from '@client/machines';
import { IRepoForm } from '@shared/types/config';
import { useSelector } from '@xstate/react';
import { IReviewsQuery } from './graphql';
import { useActorService } from './useMachines';

export const useRepoService = (): [RepoActorRef, RepoSend] => {
	const repoMachine = useActorService<RepoActorRef>('REPO');
	return [repoMachine, repoMachine.send];
};

// export const useRepoConfig = (): IRepoForm[] => {
// 	const [repoMachine] = useRepoService();
// 	return useSelector(repoMachine, (s) => s.context.repos.map(repo => repo.actRef));
// };

// export const useRepo = (id: string): IReviewsQuery | undefined => {
// 	const [repoMachine] = useRepoService();
// 	return useSelector(repoMachine, (s) => s.context.repoData.find((r) => r.repository?.name === id));
// };
