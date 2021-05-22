import React, { FC } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { Inspector } from '@client/components';
import { useMachine } from '@client/machines';
import merge from 'lodash.merge';
import { Partial2Deep } from '@client/pages/home/Login';
import { formMachine, formOptions, FormOptions } from './formMachine';

export default {
  title: 'Machines/Form',
} as Meta;

const createFormOptions = (overrides: Partial2Deep<FormOptions>): FormOptions =>
  merge({ devTools: true }, formOptions(), overrides);

const FormMachine: FC = () => {
  const [state, send] = useMachine(
    formMachine,
    createFormOptions({
      actions: {
        validToken: () => {
          console.log('yay');
        },
      },
    })
  );

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
