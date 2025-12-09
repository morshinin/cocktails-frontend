import { test } from '@playwright/test';

test('Basic e2e test', async ({ page }) => {
  // 1. Просто открываем главную
  await page.goto('/');
  console.log('Page loaded, URL:', page.url());

  console.log('✅ Basic test passed!');
});
