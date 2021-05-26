import { FC } from 'react';

interface IForceError {
  errorMessage?: string;
}

export const ForceError: FC<IForceError> = ({ errorMessage = 'error message' }) => {
  throw new Error(errorMessage);
};
