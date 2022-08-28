/* eslint-disable @typescript-eslint/no-explicit-any */
export type Partial2Deep<T> = {
	[P in keyof T]?: Partial<T[P]>;
};
export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

export type AnyObject = {
	[key: string]: any;
};

type CssSizeUnits = '%' | 'em' | 'px';
export type CssSize = `${string}${CssSizeUnits}`;
