import React, { FC, useEffect, useState } from 'react';
import { inspect } from '@xstate/inspect';
import { isDev } from '@shared/constants';
import { NullComp } from '@client/components';

export const InspectorComponent: FC = () => {
  const [inspecting, setInspecting] = useState(false);

  // useLayoutEffect?
  useEffect(() => {
    const i = inspect();

    return () => {
      i?.disconnect();
    };
  });

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setInspecting((x) => !x);
        }}
      >
        {inspecting ? 'hide inspector' : 'show inspector'}
      </button>
      <iframe
        id="xstate"
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

export const Inspector: FC = () =>
  isDev ? <InspectorComponent /> : <NullComp />;
