import { useCallback } from 'react';
import { IPage, ISetablePage, PageState } from '@client/machines';
import { useActor } from '@xstate/react';
import { usePageService } from './useMachines';

export type UsePage = {
	page: IPage;
	setPage: (page: ISetablePage) => void;
};
export const usePage = (): UsePage => {
	const pageMachine = usePageService();

	const [state, send] = useActor(pageMachine);

	const setPage = useCallback(
		(page: IPage) => {
			send({ page, type: 'navigate' });
		},
		[send]
	);

	const page = pageFromState(state);

	return { page, setPage };
};

function pageFromState(state: PageState): IPage {
	return state.context.page;
}
