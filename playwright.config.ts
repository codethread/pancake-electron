import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	timeout: 3000,
	globalTimeout: 6000,
	testDir: './e2e',
	outputDir: './reports/playwright-helpers',
	reporter: [['html', { open: 'on-failure', outputFolder: './reports/playwright-report' }]],
	use: {
		screenshot: 'only-on-failure',
	},
};
export default config;
