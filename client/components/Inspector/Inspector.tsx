import React, { FC, useLayoutEffect, useState } from 'react';
import { inspect } from '@xstate/inspect';
import { isDev } from '@shared/constants';

export const Inspector: FC = () => {
  const [inspecting, setInspecting] = useState(false);
  useLayoutEffect(() => {
    const i = inspect();
    setInspecting(true);

    return () => {
      i?.disconnect();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setInspecting((x) => !x);
        }}
      >
        {inspecting ? 'hide' : 'show'}
      </button>
      <iframe
        title="xstate"
        data-xstate
        style={{
          display: inspecting ? 'block' : 'none',
          height: '95vh',
          width: '100%',
        }}
      />
    </>
  );
};

export const showInspector = typeof window !== 'undefined' && isDev;
