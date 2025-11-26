import { test, expect } from '@playwright/test';

test.describe('RSVP Form - Attendance Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can select 2 nights camping option', async ({ page }) => {
    const option = page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' });
    await option.click();

    const radio = page.getByRole('radio', { name: /2 nachten kamperen/ });
    await expect(radio).toBeChecked();
  });

  test('can select 1 night camping option', async ({ page }) => {
    const option = page.locator('label').filter({ hasText: 'Ik kom 1 nacht kamperen' });
    await option.click();

    const radio = page.getByRole('radio', { name: /1 nacht kamperen/ });
    await expect(radio).toBeChecked();
  });

  test('can select Friday only option', async ({ page }) => {
    const option = page.locator('label').filter({ hasText: 'alleen naar het eten op vrijdag' });
    await option.click();

    const radio = page.getByRole('radio', { name: /alleen naar het eten/ });
    await expect(radio).toBeChecked();
  });

  test('can select cannot attend option', async ({ page }) => {
    const option = page.locator('label').filter({ hasText: 'Ik kan helaas niet komen' });
    await option.click();

    const radio = page.getByRole('radio', { name: /helaas niet komen/ });
    await expect(radio).toBeChecked();
  });

  test('only one option can be selected at a time', async ({ page }) => {
    // Select first option
    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await expect(page.getByRole('radio', { name: /2 nachten/ })).toBeChecked();

    // Select second option
    await page.locator('label').filter({ hasText: 'Ik kom 1 nacht kamperen' }).click();
    await expect(page.getByRole('radio', { name: /1 nacht/ })).toBeChecked();
    await expect(page.getByRole('radio', { name: /2 nachten/ })).not.toBeChecked();
  });
});

test.describe('RSVP Form - Personal Details', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can fill in name field', async ({ page }) => {
    const nameInput = page.getByRole('textbox', { name: 'Naam *' });
    await nameInput.fill('Jan Jansen');
    await expect(nameInput).toHaveValue('Jan Jansen');
  });

  test('can fill in email field', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: 'Email *' });
    await emailInput.fill('jan@example.com');
    await expect(emailInput).toHaveValue('jan@example.com');
  });

  test('name field has correct placeholder', async ({ page }) => {
    const nameInput = page.getByRole('textbox', { name: 'Naam *' });
    await expect(nameInput).toHaveAttribute('placeholder', 'Je naam');
  });

  test('email field has correct placeholder', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: 'Email *' });
    await expect(emailInput).toHaveAttribute('placeholder', 'je@email.nl');
  });
});

test.describe('RSVP Form - Extra Persons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('can add an extra person', async ({ page }) => {
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();

    // Check that extra person fields appear
    await expect(page.getByLabel(/Naam/).nth(1)).toBeVisible();
    await expect(page.getByPlaceholder('Email (optioneel)')).toBeVisible();
  });

  test('can fill in extra person details', async ({ page }) => {
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();

    const extraNameInput = page.locator('.extra-naam').first();
    const extraEmailInput = page.locator('.extra-email').first();

    await extraNameInput.fill('Piet Pietersen');
    await extraEmailInput.fill('piet@example.com');

    await expect(extraNameInput).toHaveValue('Piet Pietersen');
    await expect(extraEmailInput).toHaveValue('piet@example.com');
  });

  test('can remove an extra person', async ({ page }) => {
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();

    // Verify person was added
    await expect(page.locator('.extra-person')).toBeVisible();

    // Remove the person
    await page.getByRole('button', { name: 'Verwijder persoon' }).click();

    // Verify person was removed
    await expect(page.locator('.extra-person')).not.toBeVisible();
  });

  test('can add multiple extra persons', async ({ page }) => {
    // Add first person and wait for it to appear
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();
    await expect(page.locator('.extra-person')).toHaveCount(1);
    // Blur away from focused input to avoid interfering with next click
    await page.locator('body').click({ position: { x: 0, y: 0 } });

    // Add second person and wait for it to appear
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();
    await expect(page.locator('.extra-person')).toHaveCount(2);
    await page.locator('body').click({ position: { x: 0, y: 0 } });

    // Add third person and wait for it to appear
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();
    await expect(page.locator('.extra-person')).toHaveCount(3);
  });

  test('cannot add more than 10 extra persons', async ({ page }) => {
    // Add 10 persons one by one - blur away from focused input before each click
    for (let i = 0; i < 10; i++) {
      await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();
      await expect(page.locator('.extra-person')).toHaveCount(i + 1);
      // Blur away from focused input to avoid interfering with next click
      await page.locator('body').click({ position: { x: 0, y: 0 } });
    }

    // Button should be disabled
    await expect(page.getByRole('button', { name: '+ Persoon toevoegen' })).toBeDisabled();

    // Should show max message
    await expect(page.getByText('Maximum aantal personen bereikt')).toBeVisible();
  });
});

test.describe('RSVP Form - Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows error when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: 'Verstuur' }).click();

    // Should show error alert
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('Er zijn fouten gevonden')).toBeVisible();
  });

  test('shows error when attendance is not selected', async ({ page }) => {
    // Fill in name and email but not attendance
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('test@example.com');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('shows error when name is missing', async ({ page }) => {
    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Email *' }).fill('test@example.com');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('shows error when email is missing', async ({ page }) => {
    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Test User');

    await page.getByRole('button', { name: 'Verstuur' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('shows error when email format is invalid', async ({ page }) => {
    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('invalid-email');
    // Blur to trigger validation
    await page.getByRole('textbox', { name: 'Email *' }).blur();

    await page.getByRole('button', { name: 'Verstuur' }).click();

    // Check for error message in the form
    await expect(page.getByText('Er zijn fouten gevonden').or(page.locator('.form-error:not(:empty)'))).toBeVisible();
  });

  test('shows error when extra person name is empty', async ({ page }) => {
    await page.locator('label').filter({ hasText: 'Ik kom 2 nachten kamperen' }).click();
    await page.getByRole('textbox', { name: 'Naam *' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email *' }).fill('test@example.com');

    // Add extra person but don't fill in name
    await page.getByRole('button', { name: '+ Persoon toevoegen' }).click();

    await page.getByRole('button', { name: 'Verstuur' }).click();

    // Check for error message
    await expect(page.getByText('Er zijn fouten gevonden')).toBeVisible();
  });
});
