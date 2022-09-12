export type UserConfig = {
	token?: string;
	refreshRate: number;
	repos: IRepoForm[];
};

export type IRepoForm = {
	id: string;
	Owner: string;
	Name: string;
	'PR Count'?: number;
	// 'Review Count'?: number;
};
