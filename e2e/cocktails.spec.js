import { test, expect } from '@playwright/test';

test.describe('Cocktail Management', () => {
    // Helper to get initial recipes
    const getInitialRecipes = () => [
        {
            _id: 'r1',
            name: 'Existing Cocktail',
            category: 'Classic',
            components: [{ name: 'Vodka', amount: 50 }],
            method: 'Shake',
            glass: 'Martini',
            decoration: 'Lemon',
        }
    ];

    test.beforeEach(async ({ page }) => {
        // Set up authentication state - ensure it's set before page loads
        await page.addInitScript(() => {
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('venue', JSON.stringify({ _id: 'v1', name: 'Test Venue' }));
        });

        // Mock auth endpoints
        await page.route('**/api/login', async route => {
            await route.fulfill({ json: { token: 'mock-token' } });
        });

        await page.route('**/api/me', async route => {
            await route.fulfill({
                json: {
                    user: { _id: 'u1', email: 'test@test.com', role: 'admin' },
                    organization: { _id: 'o1', name: 'Test Org' },
                    venues: [{ _id: 'v1', name: 'Test Venue' }]
                }
            });
        });

        // Mock filter data endpoints
        await page.route('**/api/components*', async route => {
            await route.fulfill({ json: [{ _id: 'c1', name: 'Vodka' }] });
        });

        await page.route('**/api/methods*', async route => {
            await route.fulfill({ json: [{ _id: 'm1', name: 'Shake' }] });
        });

        await page.route('**/api/glasses*', async route => {
            await route.fulfill({ json: [{ _id: 'g1', name: 'Martini' }] });
        });

        await page.route('**/api/decorations*', async route => {
            await route.fulfill({ json: [{ _id: 'd1', name: 'Lemon' }] });
        });
    });

    test('should display existing cocktails', async ({ page }) => {
        const currentRecipes = getInitialRecipes();
        let recipesResponseReceived = false;
        
        // Mock GET recipes endpoint - match any recipes request (more flexible pattern)
        await page.route('**/recipes*', async route => {
            const method = route.request().method();
            if (method === 'GET') {
                recipesResponseReceived = true;
                await route.fulfill({ 
                    json: currentRecipes,
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                await route.continue();
            }
        });

        await page.goto('/cocktails', { waitUntil: 'domcontentloaded' });
        
        // Wait for the recipes API response to complete
        await page.waitForResponse(response => {
            const url = response.url();
            const method = response.request().method();
            return url.includes('recipes') && method === 'GET' && response.status() === 200;
        }, { timeout: 20000 }).catch(() => {});
        
        // Wait for the page to load and API calls to complete
        // Wait for loading spinner to disappear first
        await page.waitForSelector('.ant-spin', { state: 'hidden', timeout: 20000 }).catch(() => {});
        
        // Wait for Vue to render the cards - check for the text directly instead of card selector
        // This is more reliable as it waits for actual content
        await expect(page.getByText('Existing Cocktail')).toBeVisible({ timeout: 20000 });
        await expect(page.getByText('Vodka')).toBeVisible({ timeout: 10000 });
    });

    test('should add a new cocktail', async ({ page }) => {
        const newCocktailName = 'New Test Cocktail';
        let postRequestMade = false;
        const currentRecipes = getInitialRecipes();
        let getCallCount = 0;

        // Mock recipes endpoint - handle GET and POST (more flexible pattern)
        await page.route('**/recipes*', async route => {
            if (route.request().method() === 'GET') {
                getCallCount++;
                // After POST, return updated list with new cocktail
                if (getCallCount > 1) {
                    await route.fulfill({ json: currentRecipes });
                } else {
                    await route.fulfill({ json: currentRecipes });
                }
            } else if (route.request().method() === 'POST') {
                postRequestMade = true;
                const newRecipe = {
                    _id: 'r2',
                    name: newCocktailName,
                    category: 'Signature',
                    components: [{ name: 'Vodka', amount: 50 }],
                    method: ['Shake'],
                    glass: 'Martini',
                    decoration: ['Lemon'],
                };
                currentRecipes.push(newRecipe);
                await route.fulfill({ json: newRecipe });
            } else {
                await route.continue();
            }
        });

        await page.goto('/cocktails', { waitUntil: 'domcontentloaded' });
        
        // Wait for the recipes API response to complete
        await page.waitForResponse(response => {
            const url = response.url();
            const method = response.request().method();
            return url.includes('recipes') && method === 'GET' && response.status() === 200;
        }, { timeout: 20000 }).catch(() => {});
        
        // Wait for the page to load and initial data to appear
        await page.waitForSelector('.ant-spin', { state: 'hidden', timeout: 20000 }).catch(() => {});
        
        // Wait for content to appear - more reliable than waiting for card selector
        await page.waitForTimeout(1000);

        // Click "Добавить коктейль" button
        await page.getByRole('button', { name: /Добавить коктейль/i }).click();

        // Wait for drawer to open
        await expect(page.getByText('Новый коктейль')).toBeVisible();
        await page.waitForTimeout(500); // Wait for drawer animation

        // Get drawer container
        const drawer = page.locator('.ant-drawer-content-wrapper');

        // Fill in the form
        await drawer.getByPlaceholder('Введите название').fill(newCocktailName);
        
        // Select category - find select within drawer
        const categorySelect = drawer.locator('.ant-select').first();
        await categorySelect.click();
        await page.waitForTimeout(300);
        
        // Use keyboard to navigate and select Signature
        // First option is Classic, so press ArrowDown to go to Signature
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(100);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);

        // Add component
        await drawer.getByRole('button', { name: /Добавить компонент/i }).click();
        await page.waitForTimeout(800);
        
        // Find all selects in drawer - the component select should be one of them
        // Wait for at least one select with placeholder to appear
        await page.waitForSelector('.ant-select-selector', { timeout: 5000 });
        
        // Find the component select - it should be after the category select
        // Get all selects and find the one that's for components (usually the second one)
        const allSelects = drawer.locator('.ant-select');
        const componentSelect = allSelects.nth(1); // Second select should be component
        await componentSelect.click();
        await page.waitForTimeout(500);
        
        // Use keyboard to select first option (Vodka should be the only option)
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);

        // Fill amount
        await drawer.locator('input[placeholder="мл"]').first().fill('50');

        // Select method - use keyboard navigation
        const methodSelect = drawer.locator('.ant-select').filter({ hasText: 'Выберите методы' });
        await methodSelect.click();
        await page.waitForTimeout(300);
        await page.keyboard.press('Enter'); // Select first option (Shake)
        await page.waitForTimeout(200);

        // Select glass - find by index (should be after method select)
        const allSelectsAfterMethod = drawer.locator('.ant-select');
        // Glass select should be one of the later selects
        // Try to find it by waiting for it to be available
        await page.waitForTimeout(300);
        const glassSelect = allSelectsAfterMethod.nth(3); // Glass should be around the 4th select
        await glassSelect.waitFor({ state: 'visible', timeout: 5000 });
        await glassSelect.click();
        await page.waitForTimeout(300);
        await page.keyboard.press('Enter'); // Select first option (Martini)
        await page.waitForTimeout(200);

        // Submit form (button text is "Добавить")
        await drawer.getByRole('button', { name: /Добавить/i }).last().click();

        // Wait for success message
        await expect(page.locator('.ant-message')).toContainText('Коктейль добавлен', { timeout: 10000 });
        
        // Wait for drawer to close and list to refresh
        await page.waitForTimeout(600);
        
        // Verify the new cocktail appears
        await expect(page.getByText(newCocktailName)).toBeVisible({ timeout: 5000 });
        expect(postRequestMade).toBe(true);
    });

    test('should delete a cocktail', async ({ page }) => {
        let deleteRequestMade = false;
        let currentRecipes = getInitialRecipes();
        let getCallCount = 0;

        // Mock DELETE request (more specific route first)
        await page.route('**/recipes/*', async route => {
            if (route.request().method() === 'DELETE') {
                deleteRequestMade = true;
                // Remove from mock DB
                currentRecipes = currentRecipes.filter(r => r._id !== 'r1');
                await route.fulfill({ json: { message: 'Deleted' } });
            } else {
                await route.continue();
            }
        });

        // Mock GET recipes endpoint - handle multiple calls (more flexible pattern)
        await page.route('**/recipes*', async route => {
            if (route.request().method() === 'GET') {
                getCallCount++;
                if (getCallCount === 1) {
                    // First call - return with cocktail
                    await route.fulfill({ json: currentRecipes });
                } else {
                    // Subsequent calls after delete - return updated list
                    await route.fulfill({ json: currentRecipes });
                }
            } else {
                await route.continue();
            }
        });

        await page.goto('/cocktails', { waitUntil: 'domcontentloaded' });
        
        // Wait for the recipes API response to complete
        await page.waitForResponse(response => {
            const url = response.url();
            const method = response.request().method();
            return url.includes('recipes') && method === 'GET' && response.status() === 200;
        }, { timeout: 20000 }).catch(() => {});
        
        // Wait for the page to load and API calls to complete
        await page.waitForSelector('.ant-spin', { state: 'hidden', timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(1000);
        
        // Verify card is present - wait for text content instead of card selector
        await expect(page.getByText('Existing Cocktail')).toBeVisible({ timeout: 20000 });

        // 1. Click the "More" dropdown trigger on the card
        const card = page.locator('.ant-card').filter({ hasText: 'Existing Cocktail' });
        const moreButton = card.locator('.ant-dropdown-link');
        await moreButton.click();

        // Wait for dropdown menu to appear
        await page.waitForTimeout(300);

        // 2. Click "Удалить" in the dropdown menu
        await page.getByRole('menuitem', { name: 'Удалить' }).click();

        // Wait for popconfirm to appear
        await page.waitForTimeout(300);

        // 3. Confirm deletion in Popconfirm (Click "Да")
        await page.getByRole('button', { name: 'Да' }).click();

        // 4. Verify
        await expect(page.locator('.ant-message')).toContainText('Коктейль удалён', { timeout: 10000 });
        await expect(page.getByText('Existing Cocktail')).not.toBeVisible({ timeout: 5000 });
        expect(deleteRequestMade).toBe(true);
    });
});
