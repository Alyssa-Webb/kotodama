import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: 'e2e',
  timeout: process.env.CI ? 120_000 : 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/kotodama/`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Functional tests run with reduced motion (the app honors it), so slow CI machines never
    // wait on entrance animations and axe never measures half-faded colors.
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'iphone', use: { ...devices['iPhone 15'], browserName: 'webkit' } },
    {
      name: 'desktop',
      use: { ...devices['Desktop Safari'], viewport: { width: 1280, height: 860 } },
    },
  ],
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/kotodama/`,
    reuseExistingServer: !process.env.CI,
  },
});
