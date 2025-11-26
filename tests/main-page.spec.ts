import { test, expect } from '@playwright/test';

test.describe('Main Page - Static Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle('Het grote vrienden kampeerfeest: 7-9 aug 2026');
  });

  test('displays the header with event name and date', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Het grote vrienden kampeerfeest' })).toBeVisible();
    await expect(page.getByText('7-9 augustus 2026')).toBeVisible();
  });

  test('displays the event info with invitation text', async ({ page }) => {
    await expect(page.getByText('Hoi!')).toBeVisible();
    await expect(page.getByText(/Amsterdamse vriendengroepje/)).toBeVisible();
    await expect(page.getByText(/Vrijdagavond is er een potluck/)).toBeVisible();
  });

  test('displays location link to Google Maps', async ({ page }) => {
    const locationLink = page.getByRole('link', { name: 'Groepskampeerterrein de Banken' }).first();
    await expect(locationLink).toBeVisible();
    await expect(locationLink).toHaveAttribute('href', 'https://maps.app.goo.gl/kMApXo5gtzp6ixB39');
  });

  test('displays pricing table with all items', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Prijzen (tarieven 2025)' })).toBeVisible();

    // Check specific pricing items
    await expect(page.getByText('Overnachting per persoon per nacht')).toBeVisible();
    await expect(page.getByText('€ 8,85')).toBeVisible();
    await expect(page.getByText('Kinderen 0 t/m 2 jaar')).toBeVisible();
    await expect(page.getByText('Gratis')).toBeVisible();
    await expect(page.getByText('Tientje voor de natuur')).toBeVisible();
    await expect(page.getByText('€ 10,00')).toBeVisible();

    // Check disclaimer
    await expect(page.getByText(/Tarieven van 2025/)).toBeVisible();
  });

  test('displays footer with contact info', async ({ page }) => {
    await expect(page.getByText('Vragen? Mail Sam of Martina')).toBeVisible();
  });
});

test.describe('Main Page - RSVP Form Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays RSVP form section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Aanmelden' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Wanneer kom je?' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Jouw gegevens' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Neem je iemand mee?' })).toBeVisible();
  });

  test('displays all four attendance radio options', async ({ page }) => {
    await expect(page.getByText('Ik kom 2 nachten kamperen (vrijdag + zaterdag)')).toBeVisible();
    await expect(page.getByText('Ik kom 1 nacht kamperen (vrijdag)')).toBeVisible();
    await expect(page.getByText('Ik kom alleen naar het eten op vrijdag (niet overnachten)')).toBeVisible();
    await expect(page.getByText('Leuk, maar niet voor mij dit jaar')).toBeVisible();
  });

  test('displays name and email input fields', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: 'Naam *' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email *' })).toBeVisible();
  });

  test('displays add person button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '+ Persoon toevoegen' })).toBeVisible();
  });

  test('displays submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Verstuur' })).toBeVisible();
  });
});
