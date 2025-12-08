import { test, expect } from '@playwright/test';

test('should display existing cocktails', async ({ page }) => {
    console.log('Starting login test...');

    // Шаг 1
    await page.goto('/');
    await page.screenshot({ path: 'step1-home.png' });

    // Шаг 2
    await page.click('a[href="/login"]');
    await page.waitForURL('**/login');
    await page.screenshot({ path: 'step2-login-page.png' });

    // Шаг 3
    await page.fill('input[id="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[id="password"]', process.env.TEST_PASSWORD || 'test123');
    await page.screenshot({ path: 'step3-filled-form.png' });

    // Шаг 4
    await page.click('button[type="submit"]');

    // Шаг 5
    await page.waitForURL('**/select-venue**', { timeout: 10000 });
    await page.screenshot({ path: 'step4-after-login.png' });

    await page.click('text=ПЭУ (Ереван)');

    await page.waitForURL('**/dashboard**', { timeout: 10000 });

    await page.click('div[class="sidebar-trigger"]');

    await page.waitFor(1000);

    await page.click('div=[data-menu-id="bar"]');

    await page.click('li[data-menu-id="cocktails"]');

    await page.waitForURL('**/cocktails**', { timeout: 10000 });

    // Шаг 6
    await expect(page.getByText('Existing Cocktail')).toBeVisible({ timeout: 20000 });
    console.log('Test passed!');
});

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

    test('should display existing cocktails', async ({ page }, testInfo) => {
        testInfo.setTimeout(60000); // Increase timeout for this test
        const currentRecipes = getInitialRecipes();
        let recipesResponseReceived = false;
        
        // Enable request logging for debugging
        page.on('request', request => console.log('>>', request.method(), request.url()));
        page.on('response', response => console.log('<<', response.status(), response.url()));
        
        // Mock GET recipes endpoint
        await page.route('**/recipes*', async (route, request) => {
            console.log('Intercepted request to:', request.url());
            if (request.method() === 'GET') {
                recipesResponseReceived = true;
                console.log('Returning mock recipes:', currentRecipes);
                return route.fulfill({ 
                    json: currentRecipes,
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return route.continue();
        });

        // Add a screenshot before navigation for debugging
        await page.screenshot({ path: 'before-navigation.png' });
        
        // Navigate to the page with networkidle to ensure all resources are loaded
        await page.goto('/cocktails', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        // Wait for the recipes API to be called
        try {
            await expect(async () => {
                expect(recipesResponseReceived).toBeTruthy();
            }).toPass({ timeout: 20000 });
            console.log('Recipes API was called successfully');
        } catch (error) {
            console.error('Recipes API was not called:', error);
            throw error;
        }
        
        // Wait for loading to complete
        await page.waitForLoadState('networkidle');
        await page.waitForSelector('.ant-spin', { state: 'hidden', timeout: 15000 }).catch(() => {
            console.log('No loading spinner found or it was already hidden');
        });
        
        // Take a screenshot after page load
        await page.screenshot({ path: 'after-navigation.png' });
        
        // Wait for the cocktail card to be visible with more specific selector
        const cocktailCard = page.locator('.ant-card').filter({ hasText: 'Existing Cocktail' });
        
        try {
            // First check if the card is present in the DOM
            await expect(cocktailCard).toBeVisible({ timeout: 20000 });
            console.log('Cocktail card is visible');
            
            // Then check for the content
            await expect(cocktailCard.getByText('Vodka')).toBeVisible({ timeout: 10000 });
            console.log('Vodka text is visible in the card');
            
            // Take a final screenshot
            await page.screenshot({ path: 'test-complete.png' });
        } catch (error) {
            // On failure, log the page content and take a screenshot
            console.error('Test failed. Page content:', await page.content());
            await page.screenshot({ path: 'test-failure.png' });
            throw error;
        }
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
