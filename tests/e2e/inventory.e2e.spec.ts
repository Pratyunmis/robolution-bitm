import { test, expect } from '@playwright/test'

test.describe('Inventory Internal UI E2E', () => {
  test('can load inventory dashboard and see stats', async ({ page }) => {
    await page.goto('http://localhost:3000/inventory')

    // Verify header
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('LAB INVENTORY')

    // Verify search input is present
    const searchInput = page.locator('input[placeholder*="Search components"]')
    await expect(searchInput).toBeVisible()

    // Verify stats cards are present
    await expect(page.locator('text=Unique Items')).toBeVisible()
    await expect(page.locator('text=Available Units')).toBeVisible()
  })

  test('can navigate to transactions log page', async ({ page }) => {
    await page.goto('http://localhost:3000/inventory/transactions')

    // Verify header
    const heading = page.locator('h1').first()
    await expect(heading).toContainText('TRANSACTION LOG')

    // Verify filter buttons exist
    await expect(page.locator('text=All Events')).toBeVisible()
    await expect(page.locator('text=Checkouts')).toBeVisible()
    await expect(page.locator('text=Returns')).toBeVisible()
  })

  test('can search and filter items on inventory catalog', async ({ page }) => {
    await page.goto('http://localhost:3000/inventory')

    const searchInput = page.locator('input[placeholder*="Search components"]')
    await searchInput.fill('NonexistentXYZComponent123')

    // Verify empty state is displayed
    await expect(page.locator('text=No Components Found')).toBeVisible()

    // Reset filters
    const resetBtn = page.locator('button:has-text("Reset All Filters")')
    if (await resetBtn.isVisible()) {
      await resetBtn.click()
      await expect(page.locator('input[placeholder*="Search components"]')).toHaveValue('')
    }
  })
})
