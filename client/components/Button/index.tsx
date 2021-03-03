import React from 'react';

const Button: React.FC = ({ children }) => (
  <button
    type="button"
    onClick={() => {
      window.eApi.openGithub();
    }}
  >
    {children}
  </button>
);

export default Button;
