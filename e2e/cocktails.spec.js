import { test, expect } from '@playwright/test';

test.describe('Cocktail Management', () => {
    const mockVenue = { _id: 'venue1', name: 'Test Bar' };
    const mockUser = { _id: 'user1', name: 'Tester', role: 'owner', email: 'test@example.com' };

    const mockComponents = [
        { _id: 'c1', name: 'Vodka', category: 'Alcohol' },
        { _id: 'c2', name: 'Juice', category: 'Mixer' }
    ];

    const mockGlasses = [{ _id: 'g1', name: 'Highball' }];
    const mockMethods = [{ _id: 'm1', name: 'Shake' }];
    const mockDecorations = [{ _id: 'd1', name: 'Lemon' }];

    const initialRecipes = [
        {
            _id: 'r1',
            name: 'Existing Cocktail',
            category: 'Classic',
            components: [{ name: 'Vodka', amount: 50 }],
            method: ['Shake'],
            glass: 'Highball',
            decoration: ['Lemon'],
            venueId: 'venue1'
        }
    ];

    test.beforeEach(async ({ page }) => {
        // 1. Mock API responses
        await page.route('**/api/me', async route => {
            await route.fulfill({ json: { user: mockUser, organization: { _id: 'org1' }, venues: [mockVenue] } });
        });

        await page.route('**/api/components*', async route => {
            await route.fulfill({ json: mockComponents });
        });

        await page.route('**/api/glasses*', async route => {
            await route.fulfill({ json: mockGlasses });
        });

        await page.route('**/api/methods*', async route => {
            await route.fulfill({ json: mockMethods });
        });

        await page.route('**/api/decorations*', async route => {
            await route.fulfill({ json: mockDecorations });
        });

        // Initial recipes fetch
        await page.route('**/api/recipes*', async route => {
            if (route.request().method() === 'GET') {
                await route.fulfill({ json: initialRecipes });
            } else {
                await route.continue();
            }
        });

        // 2. Set LocalStorage to simulate logged-in state
        await page.addInitScript(({ token, venue }) => {
            localStorage.setItem('token', token);
            localStorage.setItem('venue', JSON.stringify(venue));
        }, { token: 'fake-jwt-token', venue: mockVenue });

        // 3. Go to cocktails page
        await page.goto('/cocktails');
    });

    test('should display existing cocktails', async ({ page }) => {
        await expect(page.getByText('Existing Cocktail')).toBeVisible();
        await expect(page.getByText('Vodka')).toBeVisible();
    });

    test('should add a new cocktail', async ({ page }) => {
        // Mock the POST request for creating a cocktail
        const newCocktailName = 'New Test Cocktail';
        let postRequestMade = false;

        await page.route('**/api/recipes', async route => {
            if (route.request().method() === 'POST') {
                postRequestMade = true;
                const body = route.request().postDataJSON();
                expect(body.name).toBe(newCocktailName);
                expect(body.category).toBe('Signature');

                // Return success and updated list on next fetch
                await route.fulfill({ json: { ...body, _id: 'r2' } });

                // Update mock for the subsequent GET request (refetch)
                initialRecipes.push({ ...body, _id: 'r2' });
            } else {
                await route.fulfill({ json: initialRecipes });
            }
        });

        // Open drawer
        await page.click('button:has-text("Добавить коктейль")');
        await expect(page.locator('.ant-drawer-title')).toContainText('Новый коктейль');

        // Fill form
        await page.fill('input[placeholder="Введите название"]', newCocktailName);

        // Select Category (Signature is default in mocked state usually, but let's ensure)
        // Ant Design selects are tricky, usually hidden inputs. We use the UI interaction.
        // Assuming default is 'Signature' based on component logic.

        // Add Component
        await page.click('button:has-text("Добавить компонент")');

        // Target the specific row we just added by finding the "Удалить" button inside the component row
        // and navigating to its sibling select
        await page.locator('.ant-drawer-body button:has-text("Удалить")').last().locator('xpath=..').locator('.ant-select-selector').click();

        // Select "Vodka" from the dropdown
        // Use getByTitle or text, waiting for the dropdown to animate in
        const option = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option-content').filter({ hasText: 'Vodka' });
        await option.waitFor({ state: 'visible' });
        await option.click();

        await page.fill('input[placeholder="мл"]', '60');

        // Submit
        // Submit (Click the primary button in the footer)
        await page.click('.ant-drawer-footer button.ant-btn-primary');

        // Verify
        await expect(page.getByText('Коктейль добавлен')).toBeVisible();
        await expect(page.getByText(newCocktailName)).toBeVisible();
        expect(postRequestMade).toBe(true);
    });

    test('should delete a cocktail', async ({ page }) => {
        // Mock DELETE request
        let deleteRequestMade = false;
        await page.route('**/api/recipes/*', async route => {
            if (route.request().method() === 'DELETE') {
                deleteRequestMade = true;
                await route.fulfill({ json: { message: 'Deleted' } });
            }
        });

        // Mock subsequent GET to return empty list
        await page.route('**/api/recipes*', async route => {
            if (route.request().method() === 'GET') {
                await route.fulfill({ json: [] }); // Empty after delete
            }
        });

        // Find the delete button for the existing cocktail
        // Usually inside a dropdown or visible button. Based on CocktailCard, let's assume valid interaction.
        // Inspecting CocktailCard would help, but standard is often a delete icon.
        // Let's assume there's a delete button visible or we trigger it.
        // Looking at CocktailDetails/Card logic generally helps. 
        // If usage of "SearchAndSort" or Card implies delete is accessible. 
        // Wait, CocktailCard.vue usually has a delete button or menu.
        // Let's verify card content first.

        // Verify card is present
        await expect(page.getByText('Existing Cocktail')).toBeVisible();

        // 1. Click the "More" dropdown trigger on the card
        const card = page.locator('.ant-card').filter({ hasText: 'Existing Cocktail' });
        await card.locator('.anticon-more').click();

        // 2. Click "Удалить" in the dropdown menu
        await page.getByRole('menuitem', { name: 'Удалить' }).click();

        // 3. Confirm deletion in Popconfirm (Click "Да")
        await page.getByRole('button', { name: 'Да' }).click();

        // 4. Verify
        await expect(page.getByText('Коктейль удалён')).toBeVisible();
        await expect(page.getByText('Existing Cocktail')).not.toBeVisible();
        expect(deleteRequestMade).toBe(true);
    });

});
