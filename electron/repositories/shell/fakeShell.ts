import { merge } from '@shared/merge';
import { ok, Result } from '@shared/Result';
import type { ShellRepository } from './shell';

export const fakeShell = (overrides?: Partial<ShellRepository>): ShellRepository =>
	merge(shellRepo, overrides);

const shellRepo: ShellRepository = {
	async openExternal() {
		return Promise.resolve();
	},
};
