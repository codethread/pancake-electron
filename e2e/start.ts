import { _electron as electron, expect, Page } from '@playwright/test';
import { ElectronApplication } from 'playwright';

type Created = {
	window: Page;
	app: ElectronApplication;
	logs: string[];
};

export async function start(): Promise<Created> {
	// relative to root
	const app = await electron.launch({
		args: ['./build/main.js'],
		env: {
			NODE_ENV: 'integration', // doesn't seem to care
		},
	});

	// This runs in Electron's main process, parameter here is always
	// the result of the require('electron') in the main app script.
	const isPackaged = await app.evaluate(async ({ app: a }) => a.isPackaged);

	expect(isPackaged).toBe(false);

	/**
	 * dont' talk about the logs
	 */
	const logs: string[] = [];

	// Wait for the first BrowserWindow to open
	// and return its Page object
	const window = await app.firstWindow();
	window.on('console', (msg) => logs.push(msg.text()));

	expect(window.locator('#App-loaded')).toBeTruthy();

	return {
		window,
		app,
		logs,
	};
}
