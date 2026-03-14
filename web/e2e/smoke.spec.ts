import { expect, test } from "@playwright/test"

test("homepage loads successfully", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/.+/)
})

test("page has no console errors", async ({ page }) => {
  const errors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text())
  })

  await page.goto("/")
  expect(errors).toHaveLength(0)
})
