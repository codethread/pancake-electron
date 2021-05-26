// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine, StateWithMatches } from '@xstate/compiled';
import { MachineOptions } from '../utils';

interface FormContext {
  text: string;
  errors: string[];
}

type FormEvent = { type: 'ENTER_INPUT'; text: string } | { type: 'SUBMIT' };

export type FormOptions = MachineOptions<FormContext, FormEvent, 'form'>;
export type FormState = StateWithMatches<FormContext, FormEvent, 'form'>;

export const formMachine = createMachine<FormContext, FormEvent, 'form'>({
  id: 'formMachine',
  context: {
    text: '',
    errors: [],
  },
  initial: 'entering',
  states: {
    entering: {
      onEntry: 'storeInput',
      on: {
        ENTER_INPUT: 'entering',
        SUBMIT: [
          {
            cond: 'isGithubToken',
            actions: 'submitValidToken',
          },
          {
            target: 'invalid',
          },
        ],
      },
    },
    invalid: {
      onEntry: 'storeInput',
      always: [
        { cond: 'isCleared', target: 'entering' },
        { cond: 'isGithubToken', target: 'entering' },
      ],
      on: {
        ENTER_INPUT: 'invalid',
      },
    },
  },
});
