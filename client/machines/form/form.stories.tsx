import React, { FC } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Inspector } from '@client/components';
import { useMachine } from '@client/machines';
import { formOptions } from '@client/machines/form/formOptions';
import { formMachine } from './formMachine';

export default {
  title: 'Machines/Form',
} as Meta;

const FormMachine: FC = () => {
  const [state, send] = useMachine(formMachine, {
    devTools: true,
    ...formOptions({
      actions: {
        submitValidToken: () => {
          // TODO: use actions to log
        },
      },
    }),
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
            send({ type: 'ENTER_INPUT', text: value });
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
