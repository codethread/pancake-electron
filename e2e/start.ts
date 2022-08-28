import { _electron as electron, expect, Page } from '@playwright/test';
import { ElectronApplication } from 'playwright';

type Created = {
	window: Page;
	app: ElectronApplication;
};

export async function start(): Promise<Created> {
	// relative to root
	const app = await electron.launch({ args: ['./build/main.js'] });

	// This runs in Electron's main process, parameter here is always
	// the result of the require('electron') in the main app script.
	const isPackaged = await app.evaluate(async ({ app: a }) => a.isPackaged);

	expect(isPackaged).toBe(false);

	// Wait for the first BrowserWindow to open
	// and return its Page object
	const window = await app.firstWindow();

	expect(window.locator('#App-loaded')).toBeTruthy();

	return {
		window,
		app,
	};
}
