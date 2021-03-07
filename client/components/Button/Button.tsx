import React from 'react';

export interface IButton {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
export const Button: React.FC<IButton> = ({ children, onClick }) => (
  <button
    type="button"
    onClick={
      onClick ??
      (() => {
        window.bridge.test();
      })
    }
  >
    {children}
  </button>
);
