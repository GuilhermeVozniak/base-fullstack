import { describe, expect, test } from "bun:test"
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button component", () => {
  test("renders with text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined()
  })

  test("applies variant classes", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button", { name: "Delete" })
    expect(button.className).toContain("bg-destructive")
  })

  test("is disabled when disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole("button", { name: "Disabled" })
    expect(button.getAttribute("disabled")).toBe("")
  })
})
