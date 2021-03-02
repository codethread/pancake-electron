import React from 'react';
import { IEApi } from '@shared/eApi';

const test: IEApi = {
  openGithub() {
    console.log('');
  },
};

async function foo() {
  debugger;
  const res = await fetch();
  return res;
}

const Button: React.FC = ({ children }) => {
  return (
    <button
      type="button"
      onClick={() => {
        foo();
        console.log(process?.versions?.node);
        window.eApi.openGithub();
        test.openGithub();
      }}
    >
      {children}
    </button>
  );
};

export default Button;
