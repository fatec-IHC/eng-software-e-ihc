import { test, expect } from '@playwright/test';

test.describe('Authorization', () => {
  test('unauthorized user should be redirected to login from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('p')).toHaveText('Sistema de Gestão');
  });

  test('unauthorized user should be redirected to login from root', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('p')).toHaveText('Sistema de Gestão');
  });

  test('unauthorized user should be able to access login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.locator('p')).toHaveText('Sistema de Gestão');
  });

  test('unauthorized user should be able to access signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL('/signup');
    await expect(page.locator('p')).toHaveText('Criar Nova Conta');
  });

  // Note: The following tests require a mechanism to mock user authentication and roles.
  // Without a mocking mechanism, these tests will fail in an environment where no user is logged in.

  test('logged in non-manager user should be redirected to unauthorized page from dashboard', async ({ page }) => {
    // This test requires a logged-in user with a non-manager role.
    // For now, it will fail because there is no logged-in user.
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/unauthorized');
    await expect(page.locator('h1')).toHaveText('Acesso Negado');
  });

  test('logged in manager user should be able to access dashboard', async ({ page }) => {
    // This test requires a logged-in user with a manager role.
    // For now, it will fail because there is no logged-in user.
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});
