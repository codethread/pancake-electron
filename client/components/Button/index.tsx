import React from 'react';

const Button: React.FC = ({ children }) => (
  <button
    type="button"
    onClick={() => {
      window.bridge.test();
    }}
  >
    {children}
  </button>
);

export default Button;
