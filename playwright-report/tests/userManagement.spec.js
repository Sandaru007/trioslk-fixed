import { test, expect } from '@playwright/test';

test('User Management Login Test', async ({ page }) => {
  await page.goto('http://localhost:5173/admin'); 
  await page.locator('input[name="username"]').fill('STU-1010');
  await page.getByRole('textbox', { name: '••••••••' }).fill('Samsam@123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/.*admin/); 
  await page.screenshot({ path: 'screenshots/login-success.png' });
});