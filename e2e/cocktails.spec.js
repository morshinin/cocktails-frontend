import { test, expect } from '@playwright/test';

// Mock data
const mockUser = {
  _id: 'u1',
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  role: 'owner',
  organization: { _id: 'o1', name: 'Test Org' },
  venues: [
    { _id: 'v1', name: 'ПЭУ (Ереван)' },
    { _id: 'v2', name: 'Test Venue 2' }
  ]
};

const mockCocktails = [
  {
    _id: "r1",
    name: "Moskva, Belgrade",
    components: [
      {
        name: "Befeater Gin",
        amount: 40,
        _id: "comp1"
      },
      {
        name: "Кордиал смородина массала",
        amount: 25,
        _id: "comp2"
      },
    ],
    method: [
      "Шейк",
      "Драй шейк"
    ],
    glass: "рокс",
    decoration: [
      "Лист регана"
    ],
    description: "",
    __v: 0,
    venueId: "v1",
    category: "Classic",
    image: ""
  },
];

// Mock API responses
async function setupMocks(page) {
  // Mock login
  await page.route('**/api/login', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'mock-jwt-token' })
    });
  });

  // Mock current user
  await page.route('**/api/me', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser)
    });
  });

  // Mock venues
  await page.route('**/api/venues', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser.venues)
    });
  });

  // Mock cocktails list
  await page.route('**/api/recipes**', route => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockCocktails)
    });
  });

  // Mock components
  await page.route('**/api/components**', route => {
    const components = [
      { _id: 'comp1', name: 'Белый ром' },
      { _id: 'comp2', name: 'Сахарный сироп' },
      { _id: 'comp3', name: 'Лаймовый сок' },
      { _id: 'comp4', name: 'Мята' },
      { _id: 'comp5', name: 'Содовая' },
      { _id: 'comp6', name: 'Текила' },
      { _id: 'comp7', name: 'Трипл сек' }
    ];
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(components)
    });
  });

  // Mock methods
  await page.route('**/api/methods**', route => {
    const methods = [
      { _id: 'm1', name: 'Билд' },
      { _id: 'm2', name: 'Шейк' },
      { _id: 'm3', name: 'Stir' },
      { _id: 'm4', name: 'Blend' }
    ];
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(methods)
    });
  });

  // Mock glasses
  await page.route('**/api/glasses**', route => {
    const glasses = [
      { _id: 'g1', name: 'Хайбол' },
      { _id: 'g2', name: 'Никанора' },
      { _id: 'g3', name: 'Мартинка' },
      { _id: 'g4', name: 'Рокс' }
    ];
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(glasses)
    });
  });

  // Mock decorations
  await page.route('**/api/decorations**', route => {
    const decorations = [
      { _id: 'd1', name: 'Пудра' },
      { _id: 'd2', name: 'Перец', },
    ];

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(decorations)
    });
  });
}

test.describe('Cocktails Page', () => {
  test.beforeEach(async ({ page }) => {
    // Setup all mocks
    await setupMocks(page);
    
    // Start tracing
    await page.context().tracing.start({ screenshots: true, snapshots: true });
    
    // Navigate to the app
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    // Stop tracing
    await page.context().tracing.stop({ path: 'trace.zip' });
  });

  test('should display cocktails page after login', async ({ page }) => {
    try {
      // Go to login page
      await page.click('a[href="/login"]');
      await page.waitForURL('**/login');

      // Fill login form
      await page.fill('input[id="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
      await page.fill('input[id="password"]', process.env.TEST_PASSWORD || 'test123');
      
      // Submit form
      await page.click('button[type="submit"]');

      // Handle venue selection if needed
      await page.waitForURL('**/select-venue**', { timeout: 10000 });
      await page.click(`text=${mockUser.venues[0].name}`);
      await page.waitForURL('**/dashboard**', { timeout: 10000 });

      // Navigate to cocktails page
      await page.click('div[class="sidebar-trigger"]');
      await page.waitForTimeout(700);
      await page.click('div[data-menu-id="bar"]');
      await page.waitForTimeout(1000);

      // Click on cocktails link
      const cocktailsLink = page.locator('a[href="/cocktails"]');
      await cocktailsLink.click({ timeout: 5000 }).catch(async () => {
        // Fallback if direct click fails
        await page.$eval('a[href="/cocktails"]', el => el.click());
      });

      // Wait for navigation and verify page loaded
      await page.waitForURL('**/cocktails**', { timeout: 60000 });
      await expect(page.getByRole('heading', { name: /коктейли/i })).toBeVisible({ timeout: 5000 });
      
      // Verify cocktails are displayed
      for (const cocktail of mockCocktails) {
        await expect(page.getByText(cocktail.name)).toBeVisible();
      }

      console.log('Test passed!');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
