import React, { FC, useContext, useEffect } from 'react';
import { Header, SignInForm } from '../components';

export const NewUser: FC = () => {
  return (
    <div>
      <Header />
      <SignInForm />
    </div>
  );
};
