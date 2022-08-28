import { FC } from 'react';

type IForceError = {
	errorMessage: string;
};

export const ForceError: FC<IForceError> = ({ errorMessage }) => {
	throw new Error(errorMessage);
};
