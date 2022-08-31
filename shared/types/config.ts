export type UserConfig = {
	token?: string;
	repos: IRepoForm[];
};

export type IRepoForm = {
	owner: string;
	name: string;
	prCount?: number;
	reviewCount?: number;
};
