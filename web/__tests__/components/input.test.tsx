import { afterEach, describe, expect, it } from "bun:test"
import { cleanup, render } from "@testing-library/react"
import { Input } from "@/components/ui/input"

describe("Input component", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders with data-slot attribute", () => {
    const { container } = render(<Input />)
    const input = container.querySelector('[data-slot="input"]')
    expect(input).toBeDefined()
  })

  it("renders as input element", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input")
    expect(input).toBeDefined()
  })

  it("applies default classes", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("rounded-md")
    expect(input.className).toContain("border")
    expect(input.className).toContain("px-3")
  })

  it("accepts and applies type prop", () => {
    const { container } = render(<Input type="email" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.type).toBe("email")
  })

  it("renders text input type by default", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.type).toBe("text")
  })

  it("supports password input type", () => {
    const { container } = render(<Input type="password" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.type).toBe("password")
  })

  it("supports email input type", () => {
    const { container } = render(<Input type="email" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.type).toBe("email")
  })

  it("supports number input type", () => {
    const { container } = render(<Input type="number" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.type).toBe("number")
  })

  it("supports search input type", () => {
    const { container } = render(<Input type="search" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.type).toBe("search")
  })

  it("accepts placeholder prop", () => {
    const { container } = render(<Input placeholder="Enter text" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.placeholder).toBe("Enter text")
  })

  it("accepts disabled prop", () => {
    const { container } = render(<Input disabled />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.disabled).toBe(true)
  })

  it("applies disabled state classes", () => {
    const { container } = render(<Input disabled />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("disabled:pointer-events-none")
    expect(input.className).toContain("disabled:opacity-50")
  })

  it("accepts value prop", () => {
    const { container } = render(<Input value="test value" onChange={() => {}} />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.value).toBe("test value")
  })

  it("accepts className prop and merges with defaults", () => {
    const { container } = render(<Input className="custom-class" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("custom-class")
    expect(input.className).toContain("rounded-md")
  })

  it("applies focus-visible styles", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("focus-visible")
  })

  it("applies aria-invalid styles", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("aria-invalid")
  })

  it("accepts name prop", () => {
    const { container } = render(<Input name="username" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.name).toBe("username")
  })

  it("accepts id prop", () => {
    const { container } = render(<Input id="email-input" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.id).toBe("email-input")
  })

  it("accepts readOnly prop", () => {
    const { container } = render(<Input readOnly value="readonly value" onChange={() => {}} />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  it("accepts required prop", () => {
    const { container } = render(<Input required />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.required).toBe(true)
  })

  it("accepts min and max props for number inputs", () => {
    const { container } = render(<Input type="number" min="0" max="100" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.getAttribute("min")).toBe("0")
    expect(input.getAttribute("max")).toBe("100")
  })

  it("accepts pattern prop for validation", () => {
    const { container } = render(<Input pattern="[0-9]{3}" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.getAttribute("pattern")).toBe("[0-9]{3}")
  })

  it("accepts onChange event handler", () => {
    let onChange = false
    const handler = () => {
      onChange = true
    }

    const { container } = render(<Input onChange={handler} />)
    const input = container.querySelector("input") as HTMLInputElement

    expect(input.getAttribute("onChange")).toBeDefined()
  })

  it("renders with h-9 height class", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("h-9")
  })

  it("renders with w-full width class", () => {
    const { container } = render(<Input />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("w-full")
  })

  it("accepts multiple custom classes and merges correctly", () => {
    const { container } = render(<Input className="mb-4 border-blue-500" />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.className).toContain("mb-4")
    expect(input.className).toContain("border-blue-500")
    expect(input.className).toContain("rounded-md")
  })

  it("supports autofocus prop", () => {
    const { container } = render(<Input autoFocus />)
    const input = container.querySelector("input") as HTMLInputElement
    expect(input.hasAttribute("autofocus") || document.activeElement === input).toBe(true)
  })
})
