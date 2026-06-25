import { test, expect } from '@playwright/test'

// Frontend-only flows (routing + i18n + 404). No backend required.

test('root redirects to a localized path', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/(id|en)(\/|$)/)
})

test('English locale renders the English hero', async ({ page }) => {
  await page.goto('/en')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Aufa Ramadhan')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('Indonesian locale renders the Indonesian hero', async ({ page }) => {
  await page.goto('/id')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Aufa Ramadhan')
  await expect(page.locator('html')).toHaveAttribute('lang', 'id')
})

test('projects page heading is localized', async ({ page }) => {
  await page.goto('/en/projects')
  await expect(page.getByRole('heading', { level: 1, name: 'Projects' })).toBeVisible()

  await page.goto('/id/projects')
  await expect(page.getByRole('heading', { level: 1, name: 'Proyek' })).toBeVisible()
})

test('unknown route shows the 404 page', async ({ page }) => {
  await page.goto('/en/this-route-does-not-exist')
  await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible()
})
