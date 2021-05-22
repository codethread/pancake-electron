// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine, StateWithMatches } from '@xstate/compiled';
import { assign } from 'xstate';
import { MachineOptions, Matches } from '../utils';

interface FormContext {
  text: string;
}

type FormEvent =
  | { type: 'CLEAR_INPUT' }
  | { type: 'ENTER_INPUT'; text: string }
  | { type: 'SUBMIT' };

export type FormOptions = MachineOptions<FormContext, FormEvent, 'form'>;
export type FormMatches = Matches<FormContext, FormEvent, 'form'>;
export type FormState = StateWithMatches<FormContext, FormEvent, 'form'>;

export const formOptions = (): FormOptions => ({
  guards: {
    isGithubToken: (c, e) =>
      /[A-Za-z0-9_]{40,}/.test(e.type === 'SUBMIT' ? c.text : e.text),
    isCleared: (_, { text }) => text === '',
  },
  actions: {
    storeInput: assign({
      text: (_, { text }) => text,
    }),
    validToken: () => {},
  },
});

export const formMachine = createMachine<FormContext, FormEvent, 'form'>({
  context: {
    text: '',
  },
  initial: 'empty',
  states: {
    empty: {},
    entering: {},
    invalid: {
      on: {
        ENTER_INPUT: [
          {
            cond: 'isCleared',
            actions: 'storeInput',
            target: 'empty',
          },
          {
            cond: 'isGithubToken',
            actions: 'storeInput',
            target: 'valid',
          },
          {
            actions: 'storeInput',
          },
        ],
      },
    },
    valid: {
      on: {
        SUBMIT: {
          actions: 'validToken',
        },
      },
    },
  },
  on: {
    CLEAR_INPUT: '.empty',
    SUBMIT: [
      {
        cond: 'isGithubToken',
        actions: 'validToken',
        target: '.valid',
      },
      {
        target: '.invalid',
      },
    ],
    ENTER_INPUT: {
      actions: 'storeInput',
      target: '.entering',
    },
  },
});
