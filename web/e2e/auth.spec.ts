import { expect, test } from "@playwright/test"

test.describe("Authentication", () => {
  test("login page renders correctly", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading")).toContainText(/welcome back/i)
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
  })

  test("login form shows validation errors for empty submit", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test("login form shows validation error for invalid email", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel(/email/i).fill("not-an-email")
    await page.getByLabel(/password/i).fill("password123")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page.getByText(/invalid email address/i)).toBeVisible()
  })

  test("login form shows validation error for password too short", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel(/email/i).fill("user@example.com")
    await page.getByLabel(/password/i).fill("short")
    await page.getByRole("button", { name: /sign in/i }).click()
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()
  })

  test("register page renders correctly", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByRole("heading")).toContainText(/create an account/i)
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
  })

  test("register form shows validation errors for empty submit", async ({ page }) => {
    await page.goto("/register")
    await page.getByRole("button", { name: /sign up/i }).click()
    await expect(page.getByText(/name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test("register form shows validation error for invalid email", async ({ page }) => {
    await page.goto("/register")
    await page.getByLabel(/name/i).fill("John Doe")
    await page.getByLabel(/email/i).fill("invalid-email")
    await page.getByLabel(/password/i).fill("password123")
    await page.getByRole("button", { name: /sign up/i }).click()
    await expect(page.getByText(/invalid email address/i)).toBeVisible()
  })

  test("register form shows validation error for password too short", async ({ page }) => {
    await page.goto("/register")
    await page.getByLabel(/name/i).fill("John Doe")
    await page.getByLabel(/email/i).fill("user@example.com")
    await page.getByLabel(/password/i).fill("short")
    await page.getByRole("button", { name: /sign up/i }).click()
    await expect(page.getByText(/password must be at least 8 characters/i)).toBeVisible()
  })

  test("login page has link to register", async ({ page }) => {
    await page.goto("/login")
    const registerLink = page.getByRole("link", { name: /sign up/i })
    await expect(registerLink).toBeVisible()
    await registerLink.click()
    await expect(page).toHaveURL(/\/register/)
  })

  test("register page has link to login", async ({ page }) => {
    await page.goto("/register")
    const loginLink = page.getByRole("link", { name: /sign in/i })
    await expect(loginLink).toBeVisible()
    await loginLink.click()
    await expect(page).toHaveURL(/\/login/)
  })

  test("login page title and description are visible", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByText(/sign in to your account/i)).toBeVisible()
  })

  test("register page title and description are visible", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByText(/get started with base-fullstack/i)).toBeVisible()
  })

  test("login button is disabled while loading", async ({ page }) => {
    await page.goto("/login")
    const submitButton = page.getByRole("button", { name: /sign in/i })
    await expect(submitButton).toBeEnabled()
  })

  test("register button is disabled while loading", async ({ page }) => {
    await page.goto("/register")
    const submitButton = page.getByRole("button", { name: /sign up/i })
    await expect(submitButton).toBeEnabled()
  })
})
