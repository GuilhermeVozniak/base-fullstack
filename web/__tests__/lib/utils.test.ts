import { describe, expect, test } from "bun:test"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  test("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  test("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible")
  })

  test("merges tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4")
    expect(result).toContain("px-4")
    expect(result).toContain("py-1")
    expect(result).not.toContain("px-2")
  })

  test("handles undefined and null", () => {
    expect(cn("base", undefined, null)).toBe("base")
  })
})
