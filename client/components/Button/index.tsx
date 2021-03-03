import React from 'react';
import { IEApi } from '@shared/eApi';

const testShared: IEApi = {
  openGithub() {
    console.log('running');
  },
};

const Button: React.FC = ({ children }) => (
  <button
    type="button"
    onClick={() => {
      testShared.openGithub();
      // window.eApi.openGithub();
    }}
  >
    {children}
  </button>
);

export default Button;
