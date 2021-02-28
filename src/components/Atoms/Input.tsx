import React, { ChangeEvent, FC } from 'react';

// https://itnext.io/how-to-build-a-floating-label-input-field-f9b21669fe2f
export const Input: FC<{
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ children, onChange }) => (
  <div>
    <label htmlFor="token">{children}</label>
    <input type="password" id="token" name="token" onChange={onChange} />
  </div>
);
