import { expect, test } from '@playwright/test';
import { start } from './start';

test('main screen', async () => {
	const { window, app } = await start();

	// await window.screenshot({ path: 'intro.png' });
	// expect(await window.screenshot()).toMatchSnapshot();

	const logs: string[] = [];

	window.on('console', (msg) => logs.push(msg.text()));

	await window.click('data-test-id=e2e-button');

	expect(logs).toContain('started');

	await app.close();
});
