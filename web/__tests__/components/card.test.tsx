import { describe, it, expect } from "bun:test"
import { render } from "@testing-library/react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
} from "@/components/ui/card"

describe("Card components", () => {
  describe("Card", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<Card>Test Card</Card>)
      const card = container.querySelector('[data-slot="card"]')
      expect(card).toBeDefined()
    })

    it("renders children", () => {
      const { container } = render(<Card>Card Content</Card>)
      expect(container.textContent).toContain("Card Content")
    })

    it("applies default classes", () => {
      const { container } = render(<Card />)
      const card = container.querySelector('[data-slot="card"]') as HTMLElement
      expect(card.className).toContain("rounded-xl")
      expect(card.className).toContain("border")
    })

    it("merges custom className", () => {
      const { container } = render(<Card className="custom-class" />)
      const card = container.querySelector('[data-slot="card"]') as HTMLElement
      expect(card.className).toContain("custom-class")
      expect(card.className).toContain("rounded-xl")
    })
  })

  describe("CardHeader", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.querySelector('[data-slot="card-header"]')
      expect(header).toBeDefined()
    })

    it("renders children", () => {
      const { container } = render(<CardHeader>Header Content</CardHeader>)
      expect(container.textContent).toContain("Header Content")
    })

    it("applies grid classes", () => {
      const { container } = render(<CardHeader />)
      const header = container.querySelector('[data-slot="card-header"]') as HTMLElement
      expect(header.className).toContain("grid")
    })

    it("merges custom className", () => {
      const { container } = render(<CardHeader className="custom-header" />)
      const header = container.querySelector('[data-slot="card-header"]') as HTMLElement
      expect(header.className).toContain("custom-header")
    })
  })

  describe("CardTitle", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<CardTitle>Title</CardTitle>)
      const title = container.querySelector('[data-slot="card-title"]')
      expect(title).toBeDefined()
    })

    it("renders children", () => {
      const { container } = render(<CardTitle>Test Title</CardTitle>)
      expect(container.textContent).toContain("Test Title")
    })

    it("applies font-semibold class", () => {
      const { container } = render(<CardTitle />)
      const title = container.querySelector('[data-slot="card-title"]') as HTMLElement
      expect(title.className).toContain("font-semibold")
    })

    it("merges custom className", () => {
      const { container } = render(<CardTitle className="text-2xl" />)
      const title = container.querySelector('[data-slot="card-title"]') as HTMLElement
      expect(title.className).toContain("text-2xl")
      expect(title.className).toContain("font-semibold")
    })
  })

  describe("CardDescription", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<CardDescription>Description</CardDescription>)
      const description = container.querySelector('[data-slot="card-description"]')
      expect(description).toBeDefined()
    })

    it("renders children", () => {
      const { container } = render(<CardDescription>Test Description</CardDescription>)
      expect(container.textContent).toContain("Test Description")
    })

    it("applies muted-foreground class", () => {
      const { container } = render(<CardDescription />)
      const description = container.querySelector('[data-slot="card-description"]') as HTMLElement
      expect(description.className).toContain("text-muted-foreground")
    })

    it("merges custom className", () => {
      const { container } = render(<CardDescription className="font-bold" />)
      const description = container.querySelector('[data-slot="card-description"]') as HTMLElement
      expect(description.className).toContain("font-bold")
    })
  })

  describe("CardContent", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.querySelector('[data-slot="card-content"]')
      expect(content).toBeDefined()
    })

    it("renders children", () => {
      const { container } = render(<CardContent>Card Content Text</CardContent>)
      expect(container.textContent).toContain("Card Content Text")
    })

    it("applies padding classes", () => {
      const { container } = render(<CardContent />)
      const content = container.querySelector('[data-slot="card-content"]') as HTMLElement
      expect(content.className).toContain("px-6")
    })

    it("merges custom className", () => {
      const { container } = render(<CardContent className="bg-gray-100" />)
      const content = container.querySelector('[data-slot="card-content"]') as HTMLElement
      expect(content.className).toContain("bg-gray-100")
      expect(content.className).toContain("px-6")
    })
  })

  describe("CardAction", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<CardAction>Action</CardAction>)
      const action = container.querySelector('[data-slot="card-action"]')
      expect(action).toBeDefined()
    })

    it("renders children", () => {
      const { container } = render(<CardAction>Button</CardAction>)
      expect(container.textContent).toContain("Button")
    })

    it("applies positioning classes", () => {
      const { container } = render(<CardAction />)
      const action = container.querySelector('[data-slot="card-action"]') as HTMLElement
      expect(action.className).toContain("col-start-2")
      expect(action.className).toContain("row-span-2")
    })

    it("merges custom className", () => {
      const { container } = render(<CardAction className="text-right" />)
      const action = container.querySelector('[data-slot="card-action"]') as HTMLElement
      expect(action.className).toContain("text-right")
    })
  })

  describe("CardFooter", () => {
    it("renders with data-slot attribute", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.querySelector('[data-slot="card-footer"]')
      expect(footer).toBeDefined()
    })

    it("renders children", () => {
      const { container } = render(<CardFooter>Footer Content</CardFooter>)
      expect(container.textContent).toContain("Footer Content")
    })

    it("applies flex classes", () => {
      const { container } = render(<CardFooter />)
      const footer = container.querySelector('[data-slot="card-footer"]') as HTMLElement
      expect(footer.className).toContain("flex")
      expect(footer.className).toContain("items-center")
    })

    it("applies padding classes", () => {
      const { container } = render(<CardFooter />)
      const footer = container.querySelector('[data-slot="card-footer"]') as HTMLElement
      expect(footer.className).toContain("px-6")
    })

    it("merges custom className", () => {
      const { container } = render(<CardFooter className="justify-end" />)
      const footer = container.querySelector('[data-slot="card-footer"]') as HTMLElement
      expect(footer.className).toContain("justify-end")
      expect(footer.className).toContain("flex")
    })
  })

  describe("Card composition", () => {
    it("renders card with header, title, and content together", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
        </Card>
      )

      expect(container.querySelector('[data-slot="card"]')).toBeDefined()
      expect(container.querySelector('[data-slot="card-header"]')).toBeDefined()
      expect(container.querySelector('[data-slot="card-title"]')).toBeDefined()
      expect(container.querySelector('[data-slot="card-description"]')).toBeDefined()
      expect(container.querySelector('[data-slot="card-content"]')).toBeDefined()
    })

    it("renders card with footer", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )

      expect(container.querySelector('[data-slot="card-footer"]')).toBeDefined()
    })

    it("renders card with action", () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardAction>Action Button</CardAction>
          </CardHeader>
        </Card>
      )

      expect(container.querySelector('[data-slot="card-action"]')).toBeDefined()
    })
  })
})
