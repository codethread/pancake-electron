import { expect, test } from '@playwright/test';
import { start } from './start';

test('main screen', async () => {
	const { window, app } = await start();

	expect(await window.screenshot()).toMatchSnapshot();

	await window.click('data-testid=e2e-button');

	await app.close();
});
