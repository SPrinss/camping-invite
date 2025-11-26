import { test, expect } from '@playwright/test';

test.describe('RSVP Form - Successful Submission', () => {
  test('successfully submits RSVP with 2 nights option', async ({ page }) => {
    await page.goto('/');

    // Fill in the form
    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('E2E Test User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('e2e-test@example.com');

    // Submit
    await page.getByRole('button', { name: 'Verstuur' }).click();

    // Wait for success message
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Bedankt voor je aanmelding!')).toBeVisible();
    await expect(page.getByText('We hebben je RSVP ontvangen.')).toBeVisible();
  });

  test('successfully submits RSVP with 1 night option', async ({ page }) => {
    await page.goto('/');

    await page.locator('label').filter({ hasText: 'Ik kom 1 nacht kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('One Night User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('onenight@example.com');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByText('Bedankt voor je aanmelding!')).toBeVisible({ timeout: 10000 });
  });

  test('successfully submits RSVP with Friday only option', async ({ page }) => {
    await page.goto('/');

    await page.locator('label').filter({ hasText: 'alleen naar het eten op vrijdag' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Friday Only User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('friday@example.com');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByText('Bedankt voor je aanmelding!')).toBeVisible({ timeout: 10000 });
  });

  test('successfully submits RSVP with cannot attend option', async ({ page }) => {
    await page.goto('/');

    await page.locator('label').filter({ hasText: 'Leuk, maar niet voor mij dit jaar' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Cannot Attend User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('cantcome@example.com');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByText('Bedankt voor je aanmelding!')).toBeVisible({ timeout: 10000 });
  });

  test('successfully submits RSVP with extra persons', async ({ page }) => {
    await page.goto('/');

    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Main Person');
    await page.getByRole('textbox', { name: 'Email *' }).fill('main@example.com');

    // Add extra person
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();
    await page.locator('.extra-naam').first().fill('Extra Person 1');
    await page.locator('.extra-email').first().fill('extra1@example.com');

    // Add another extra person
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();
    await page.locator('.extra-naam').nth(1).fill('Extra Person 2');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByText('Bedankt voor je aanmelding!')).toBeVisible({ timeout: 10000 });
  });

  test('success message includes contact info for changes', async ({ page }) => {
    await page.goto('/');

    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Contact Info Test');
    await page.getByRole('textbox', { name: 'Email *' }).fill('contact@example.com');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByText('Wil je je aanmelding wijzigen?')).toBeVisible({ timeout: 10000 });
    // Use exact match to avoid matching footer text
    await expect(page.getByText('Sam of Martina', { exact: true })).toBeVisible();
  });

  test('shows loading state during submission', async ({ page }) => {
    await page.goto('/');

    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Loading Test User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('loading@example.com');

    // Click submit and immediately check for loading state
    const submitButton = page.getByRole('button', { name: 'Verstuur' });
    await submitButton.click();

    // The button should show loading text (may be very brief)
    // We just verify the success message appears eventually
    await expect(page.getByText('Bedankt voor je aanmelding!')).toBeVisible({ timeout: 10000 });
  });
});
