import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"
import { cleanup, render, screen } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import RegisterPage from "@/app/register/page"

// Mock next/navigation
mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: mock(() => {}),
    back: mock(() => {}),
    forward: mock(() => {}),
  }),
}))

// Mock next/link
mock.module("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock auth-client
const mockSignUp = mock(async () => ({
  error: null,
}))

mock.module("@/lib/auth-client", () => ({
  signUp: {
    email: mockSignUp,
  },
}))

// Mock next-intl
const mockTranslations = {
  "auth.registerTitle": "Register",
  "auth.registerDescription": "Create a new account",
  "auth.name": "Name",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.register": "Register",
  "auth.hasAccount": "Already have an account?",
  "auth.login": "Login",
  "auth.nameRequired": "Name is required",
  "auth.emailInvalid": "Invalid email",
  "auth.emailRequired": "Email is required",
  "auth.passwordMin": "Password must be at least 8 characters",
  "auth.passwordRequired": "Password is required",
  "common.error": "An error occurred",
  "common.loading": "Loading...",
}

mock.module("next-intl", () => ({
  useTranslations: () => (key: string) =>
    mockTranslations[key as keyof typeof mockTranslations] || key,
}))

const createRegisterPageWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={mockTranslations}>
      {children}
    </NextIntlClientProvider>
  )
}

describe("RegisterPage component", () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    mockSignUp.mockClear?.()
  })

  it("renders register form with name, email, and password fields", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    expect(screen.getByLabelText(/Name/i)).toBeDefined()
    expect(screen.getByLabelText(/Email/i)).toBeDefined()
    expect(screen.getByLabelText(/Password/i)).toBeDefined()
  })

  it("renders submit button", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    expect(screen.getByRole("button", { name: /Register/i })).toBeDefined()
  })

  it("renders link to login page", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    const loginLink = screen.getByRole("link", { name: /Login/i })
    expect(loginLink).toBeDefined()
    expect(loginLink.getAttribute("href")).toBe("/login")
  })

  it("renders title and description", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    const title = document.querySelector('[data-slot="card-title"]')
    expect(title).toBeDefined()
    expect(title?.textContent).toContain("Register")
    expect(screen.getByText(/Create a new account/)).toBeDefined()
  })

  it("shows correct input types", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    const nameInput = screen.getByLabelText(/Name/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement

    expect(nameInput.type).toBe("text")
    expect(emailInput.type).toBe("email")
    expect(passwordInput.type).toBe("password")
  })

  it("has correct input placeholders", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    expect(screen.getByPlaceholderText("John Doe")).toBeDefined()
    expect(screen.getByPlaceholderText("user@example.com")).toBeDefined()
    expect(screen.getByPlaceholderText("••••••••")).toBeDefined()
  })

  it("form renders in a card layout", () => {
    const { container } = render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    const card = container.querySelector('[data-slot="card"]')
    expect(card).toBeDefined()
  })

  it("button is initially not disabled", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    const button = screen.getByRole("button", { name: /Register/i }) as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })

  it("renders in a centered layout", () => {
    const { container } = render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv.className).toContain("flex")
    expect(mainDiv.className).toContain("items-center")
    expect(mainDiv.className).toContain("justify-center")
  })

  it("form contains all three input fields", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    const form = screen.getByRole("button", { name: /Register/i }).closest("form")
    expect(form).toBeDefined()
    expect(form?.querySelector('input[type="text"]')).toBeDefined()
    expect(form?.querySelector('input[type="email"]')).toBeDefined()
    expect(form?.querySelector('input[type="password"]')).toBeDefined()
  })

  it("has 'Already have an account' text with login link", () => {
    render(<RegisterPage />, { wrapper: createRegisterPageWrapper() })

    expect(screen.getByText(/Already have an account/i)).toBeDefined()
    expect(screen.getByRole("link", { name: /Login/i })).toBeDefined()
  })
})
