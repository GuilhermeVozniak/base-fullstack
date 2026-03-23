import { expect, test } from "@playwright/test"

test.describe("Navigation", () => {
  test("home page loads successfully", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/.+/)
  })

  test("home page has correct title", async ({ page }) => {
    await page.goto("/")
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)
  })

  test("404 page shows for non-existent routes", async ({ page }) => {
    const response = await page.goto("/this-does-not-exist-at-all-12345")
    expect(response?.status()).toBe(404)
    await expect(page.getByText(/404|not found/i)).toBeVisible()
  })

  test("404 page contains helpful text", async ({ page }) => {
    await page.goto("/non-existent-route-xyz")
    await expect(page.getByText(/404|not found|doesn't exist/i)).toBeVisible()
  })

  test("no console errors on home page", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    expect(errors).toEqual([])
  })

  test("no console errors on login page", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    await page.goto("/login")
    await page.waitForLoadState("networkidle")
    expect(errors).toEqual([])
  })

  test("no console errors on register page", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    await page.goto("/register")
    await page.waitForLoadState("networkidle")
    expect(errors).toEqual([])
  })

  test("navigation between login and register works", async ({ page }) => {
    await page.goto("/login")
    await page.getByRole("link", { name: /sign up/i }).click()
    await expect(page).toHaveURL(/\/register/)
    await page.getByRole("link", { name: /sign in/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test("home page loads with correct status code", async ({ page }) => {
    const response = await page.goto("/")
    expect(response?.status()).toBe(200)
  })

  test("login page loads with correct status code", async ({ page }) => {
    const response = await page.goto("/login")
    expect(response?.status()).toBe(200)
  })

  test("register page loads with correct status code", async ({ page }) => {
    const response = await page.goto("/register")
    expect(response?.status()).toBe(200)
  })

  test("pages load without unhandled exceptions", async ({ page }) => {
    const exceptions: string[] = []
    page.on("pageerror", (error) => {
      exceptions.push(error.message)
    })
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    expect(exceptions).toEqual([])
  })

  test("login page renders all form fields", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
  })

  test("register page renders all form fields", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
  })

  test("navigation to multiple pages works correctly", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL("/")
    await page.goto("/login")
    await expect(page).toHaveURL(/\/login/)
    await page.goto("/register")
    await expect(page).toHaveURL(/\/register/)
    await page.goto("/")
    await expect(page).toHaveURL("/")
  })

  test("browser back button works from login to home", async ({ page }) => {
    await page.goto("/")
    await page.goto("/login")
    await page.goBack()
    await expect(page).toHaveURL("/")
  })

  test("browser forward button works after going back", async ({ page }) => {
    await page.goto("/")
    await page.goto("/login")
    await page.goBack()
    await expect(page).toHaveURL("/")
    await page.goForward()
    await expect(page).toHaveURL(/\/login/)
  })
})
