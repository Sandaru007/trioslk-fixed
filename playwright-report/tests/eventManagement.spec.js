import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/admin');
  await page.getByRole('button', { name: 'Event Management' }).click();
  await page.getByRole('textbox', { name: 'Event ID (EVT-1001)' }).click();
  await page.getByRole('textbox', { name: 'Event ID (EVT-1001)' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Event ID (EVT-1001)' }).fill('EVT-1003');
  await page.getByRole('textbox', { name: 'Title' }).click();
  await page.getByRole('textbox', { name: 'Title' }).fill('A');
  await page.getByRole('textbox', { name: 'Title' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Title' }).fill('Annual tech symposium');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('testing automated event creation');
  await page.getByRole('combobox').first().selectOption('Ongoing');
  await page.getByRole('combobox').nth(1).selectOption('Physical');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('button', { name: 'Choose File' }).setInputFiles('Screenshot 2025-09-12 194401.png');
  await page.getByRole('button', { name: 'Publish Event' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Publish Event' }).click();
});