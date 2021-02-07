import React from 'react';

type Click =
  | ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
  | undefined;

export const Button: React.FC<{ onClick: Click }> = ({ children, onClick }) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};
