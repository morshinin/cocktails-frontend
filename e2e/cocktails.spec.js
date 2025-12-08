import { test, expect } from '@playwright/test';

test.describe('Login', () => {
    test('should display cocktails page', async ({ page }) => {
        // Шаг 1
        await page.goto('/');

        // Шаг 2
        await page.click('a[href="/login"]');
        await page.waitForURL('**/login');

        console.log('Test email ', process.env.TEST_USER_EMAIL);
        console.log('Test password ', process.env.TEST_PASSWORD);

        // Шаг 3
        await page.fill('input[id="email"]', process.env.TEST_USER_EMAIL);
        await page.fill('input[id="password"]', process.env.TEST_PASSWORD);

        // Шаг 4
        await page.click('button[type="submit"]');

        // Шаг 5
        await page.waitForURL('**/select-venue**', { timeout: 30000 });

        await page.click('text=ПЭУ (Ереван)');

        await page.waitForURL('**/dashboard**', { timeout: 10000 });

        // 1. Открываем меню
        await page.click('div[class="sidebar-trigger"]');
        await page.waitForTimeout(700);

        // 2. Кликаем на "Бар"
        await page.click('div[data-menu-id="bar"]');

        // 3. Даем время на анимацию и проверяем
        await page.waitForTimeout(1000);

        // 4. Проверяем видимость
        const cocktailsLink = page.locator('a[href="/cocktails"]');
        const isVisible = await cocktailsLink.isVisible().catch(() => false);

        // 5. Кликаем в зависимости от состояния
        if (isVisible) {
            await cocktailsLink.click();
        } else {
            // Если не видно, пробуем разные способы
            try {
                await cocktailsLink.click({ force: true });
            } catch {
                await page.$eval('a[href="/cocktails"]', el => el.click());
            }
        }

        await page.waitForURL('**/cocktails**', { timeout: 10000 });

        // Шаг 6
        await expect(page.getByRole('heading', { name: 'Коктейли' })).toBeVisible();
        console.log('Test passed!');
    });
})
