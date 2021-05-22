// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine, StateWithMatches } from '@xstate/compiled';
import { assign } from 'xstate';
import { MachineOptions } from '../utils';

interface FormContext {
  text: string;
  errors: string[];
}

type FormEvent = { type: 'ENTER_INPUT'; text: string } | { type: 'SUBMIT' };

export type FormOptions = MachineOptions<FormContext, FormEvent, 'form'>;
export type FormState = StateWithMatches<FormContext, FormEvent, 'form'>;

export const formOptions = (): FormOptions => ({
  guards: {
    isGithubToken: (c, e) =>
      /[A-Za-z0-9_]{40,}/.test(e.type === 'ENTER_INPUT' ? e.text : c.text),
    isCleared: (_, { text }) => text === '',
  },
  actions: {
    storeInput: assign({
      text: (c, e) => (e.type === 'ENTER_INPUT' ? e.text : c.text),
      errors: (c, e) => {
        if (e.type === 'ENTER_INPUT') {
          const errors: string[] = [];

          if (e.text.length < 40) {
            errors.push('at least 40 characters required');
          }

          if (/[^\w]/.test(e.text)) {
            errors.push('only alpha numeric characters and "_"');
          }

          return errors;
        }
        return c.errors;
      },
    }),
    validToken: () => {},
  },
});

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
            actions: 'validToken',
          },
          {
            target: 'invalid',
          },
        ],
      },
    },
    invalid: {
      onEntry: 'storeInput',
      on: {
        ENTER_INPUT: [
          {
            cond: 'isCleared',
            target: 'entering',
          },
          {
            cond: 'isGithubToken',
            target: 'entering',
          },
          {
            target: 'invalid',
          },
        ],
      },
    },
  },
});
