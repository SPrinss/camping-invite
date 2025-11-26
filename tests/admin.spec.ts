import { test, expect } from '@playwright/test';

// Load credentials from environment or use defaults for testing
const ADMIN_EMAIL = process.env.EMAIL || 'samprinssen@gmail.com';
const ADMIN_PASSWORD = process.env.PASSWORD || '_2pBrBysbb7UHorVNGUb';

test.describe('Admin Page - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/admin/');
  });

  test('displays admin page title', async ({ page }) => {
    await expect(page).toHaveTitle('Admin - Het Grote Vrienden Kampeerfeest');
  });

  test('displays login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Admin Panel' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Inloggen' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'E-mail' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Wachtwoord' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Inloggen' })).toBeVisible();
  });

  test('email field has correct placeholder', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'E-mail' })).toHaveAttribute('placeholder', 'admin@example.com');
  });

  test('password field has correct placeholder', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Wachtwoord' })).toHaveAttribute('placeholder', '••••••••');
  });

  test('can fill in login credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'E-mail' }).fill('test@example.com');
    await page.getByRole('textbox', { name: 'Wachtwoord' }).fill('testpassword');

    await expect(page.getByRole('textbox', { name: 'E-mail' })).toHaveValue('test@example.com');
    await expect(page.getByRole('textbox', { name: 'Wachtwoord' })).toHaveValue('testpassword');
  });
});

test.describe('Admin Page - Authentication', () => {
  test('shows error with invalid credentials', async ({ page }) => {
    await page.goto('/src/admin/');

    await page.getByRole('textbox', { name: 'E-mail' }).fill('invalid@example.com');
    await page.getByRole('textbox', { name: 'Wachtwoord' }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Inloggen' }).click();

    // Should show error message (Firebase returns INVALID_LOGIN_CREDENTIALS)
    await expect(page.locator('.login-error.visible')).toBeVisible({ timeout: 10000 });
  });

  test('successfully logs in with valid credentials', async ({ page }) => {
    await page.goto('/src/admin/');

    await page.getByRole('textbox', { name: 'E-mail' }).fill(ADMIN_EMAIL);
    await page.getByRole('textbox', { name: 'Wachtwoord' }).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    // Should show RSVPs heading after login
    await expect(page.getByRole('heading', { name: 'RSVPs' })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Admin Page - RSVP List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/src/admin/');

    // Login first
    await page.getByRole('textbox', { name: 'E-mail' }).fill(ADMIN_EMAIL);
    await page.getByRole('textbox', { name: 'Wachtwoord' }).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    // Wait for RSVPs to load
    await expect(page.getByRole('heading', { name: 'RSVPs' })).toBeVisible({ timeout: 10000 });
  });

  test('displays logout button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Uitloggen' })).toBeVisible();
  });

  test('displays statistics section', async ({ page }) => {
    await expect(page.getByText('Totaal RSVPs')).toBeVisible();
    await expect(page.locator('.stat-label').filter({ hasText: '2 nachten' })).toBeVisible();
    await expect(page.locator('.stat-label').filter({ hasText: '1 nacht' })).toBeVisible();
    await expect(page.locator('.stat-label').filter({ hasText: 'Alleen vrijdag' })).toBeVisible();
    await expect(page.locator('.stat-label').filter({ hasText: 'Kan niet komen' })).toBeVisible();
    await expect(page.getByText('Totaal personen')).toBeVisible();
  });

  test('displays RSVP table with correct columns', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Naam' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'E-mail' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Aanwezigheid' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Extra personen' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Datum' })).toBeVisible();
  });

  test('can logout', async ({ page }) => {
    await page.getByRole('button', { name: 'Uitloggen' }).click();

    // Should show login form again
    await expect(page.getByRole('heading', { name: 'Inloggen' })).toBeVisible();
  });
});

test.describe('Admin Page - Session Persistence', () => {
  test('maintains session after page refresh', async ({ page }) => {
    await page.goto('/src/admin/');

    // Login
    await page.getByRole('textbox', { name: 'E-mail' }).fill(ADMIN_EMAIL);
    await page.getByRole('textbox', { name: 'Wachtwoord' }).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    await expect(page.getByRole('heading', { name: 'RSVPs' })).toBeVisible({ timeout: 10000 });

    // Refresh the page
    await page.reload();

    // Should still be logged in (session storage)
    await expect(page.getByRole('heading', { name: 'RSVPs' })).toBeVisible({ timeout: 10000 });
  });
});
