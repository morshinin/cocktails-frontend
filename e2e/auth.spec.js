import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    // test('redirects to login when visiting protected route', async ({ page }) => {
    //     await page.goto('/dashboard');
    //     await expect(page).toHaveURL(/.*\/login/);
    // });
    //
    // test('shows login page', async ({ page }) => {
    //     await page.goto('/login');
    //     const title = await page.textContent('h1');
    //     expect(title).toBe('Login');
    //
    //     // Check inputs using IDs
    //     await expect(page.locator('#email')).toBeVisible();
    //     await expect(page.locator('#password')).toBeVisible();
    // });

    test('shows error with invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.fill('#email', 'wrong@example.com');
        await page.fill('#password', 'wrongpassword');
        await page.click('button[type="submit"]');

        // Expect an error message toast
        await expect(page.locator('.ant-message')).toBeVisible();
        await expect(page.locator('.ant-message')).toContainText('Invalid login');
    });
});
