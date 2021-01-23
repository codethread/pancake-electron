import React from 'react';

const Button: React.FC = ({ children }) => {
  return (
    <button
      type="button"
      onClick={() => {
        console.log('clicked');
      }}
    >
      {children}
    </button>
  );
};

export default Button;
