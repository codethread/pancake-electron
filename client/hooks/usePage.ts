import { IPage, ISetablePage, PageActorRef, PageState } from '@client/machines';
import { useActor } from '@xstate/react';
import { useCallback } from 'react';
import { useActorService } from './useMachines';

export type UsePage = {
	page: IPage;
	setPage: (page: ISetablePage) => void;
	canNavigate: boolean;
};
export const usePage = (): UsePage => {
	const pageMachine = useActorService<PageActorRef>('PAGE');
	const [state, send] = useActor(pageMachine);

	const setPage = useCallback(
		(page: ISetablePage) => {
			send({ page, type: 'navigate' });
		},
		[send]
	);

	const page = pageFromState(state);

	return { page, setPage, canNavigate: state.matches('navigable') };
};

function pageFromState(state: PageState): IPage {
	return state.context.page;
}
