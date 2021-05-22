import React, { FC } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Inspector } from '@client/components';
import { useMachine } from '@client/machines';
import { assign } from 'xstate';
import { formMachine, FormOptions } from './formMachine';

export default {
  title: 'Machines/Form',
} as Meta;

const formOptions = (): FormOptions => ({
  guards: {
    isGithubToken: (c, e) =>
      /magic/.test(e.type === 'ENTER_INPUT' ? e.text : c.text),
  },
  actions: {
    storeInput: assign({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      text: (_, { text }) => text,
    }),
    validToken: () => {},
  },
});

const FormMachine: FC = () => {
  const [state, send] = useMachine(formMachine, {
    ...formOptions(),
    devTools: true,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send({ type: 'SUBMIT' });
      }}
    >
      <p>state: {state.value}</p>
      <label>
        type something
        <input
          style={{ color: state.matches('invalid') ? 'red' : 'black' }}
          value={state.context.text}
          onChange={({ target: { value } }) => {
            if (value === '') {
              send({ type: 'ENTER_INPUT', text: value });
              send({ type: 'CLEAR_INPUT' });
            } else {
              send({ type: 'ENTER_INPUT', text: value });
            }
          }}
        />
      </label>
    </form>
  );
};

export const Form: Story = () => (
  <>
    <Inspector />
    <FormMachine />
  </>
);
