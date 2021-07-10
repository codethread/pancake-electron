import React, { FC } from 'react';

export const BorderBox: FC = ({ children }) => (
  <div style={{ width: '80%', border: 'solid coral thin ', margin: '0 auto', minHeight: '80vh' }}>
    {children}
  </div>
);
