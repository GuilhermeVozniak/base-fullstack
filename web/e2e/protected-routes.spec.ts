import { expect, test } from "@playwright/test"

test.describe("Protected Routes", () => {
  test("redirects unauthenticated user from /dashboard to /login", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/login/)
    const url = new URL(page.url())
    expect(url.searchParams.get("callbackUrl")).toBe("/dashboard")
  })

  test("redirects unauthenticated user from /dashboard with correct callback URL", async ({
    page,
  }) => {
    await page.goto("/dashboard")
    const url = new URL(page.url())
    expect(url.pathname).toBe("/login")
    expect(url.searchParams.get("callbackUrl")).toBe("/dashboard")
  })

  test("allows access to public / route without auth", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL("/")
  })

  test("allows access to /login without auth", async ({ page }) => {
    await page.goto("/login")
    await expect(page).toHaveURL(/\/login/)
  })

  test("allows access to /register without auth", async ({ page }) => {
    await page.goto("/register")
    await expect(page).toHaveURL(/\/register/)
  })

  test("login form renders on protected route redirect", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page.getByRole("heading")).toContainText(/welcome back/i)
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test("redirects to login with proper callback URL for nested protected routes", async ({
    page,
  }) => {
    await page.goto("/dashboard/settings")
    await expect(page).toHaveURL(/\/login/)
    const url = new URL(page.url())
    expect(url.searchParams.get("callbackUrl")).toContain("/dashboard/settings")
  })

  test("public route / does not redirect to login", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL("/")
    await expect(page).not.toHaveURL(/\/login/)
  })

  test("home page is accessible without session token", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/.+/)
  })

  test("login page does not show errors on first load", async ({ page }) => {
    await page.goto("/login")
    const errorMessage = page.getByRole("heading", { level: 2 }).filter({ hasText: /error|wrong/i })
    await expect(errorMessage).toHaveCount(0)
  })

  test("register page does not show errors on first load", async ({ page }) => {
    await page.goto("/register")
    const errorMessage = page.getByRole("heading", { level: 2 }).filter({ hasText: /error|wrong/i })
    await expect(errorMessage).toHaveCount(0)
  })

  test("302 redirect occurs when accessing protected route", async ({ page }) => {
    const response = await page.goto("/dashboard")
    expect(response?.status()).toBeGreaterThanOrEqual(300)
    expect(response?.status()).toBeLessThan(400)
  })

  test("callback URL query param is preserved during redirect", async ({ page }) => {
    await page.goto("/dashboard")
    const url = new URL(page.url())
    expect(url.searchParams.has("callbackUrl")).toBe(true)
    expect(url.searchParams.get("callbackUrl")).toBe("/dashboard")
  })
})
