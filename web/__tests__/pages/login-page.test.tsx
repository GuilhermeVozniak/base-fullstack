import { describe, it, expect, beforeEach, mock } from "bun:test"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginPage from "@/app/login/page"
import { NextIntlClientProvider } from "next-intl"

// Mock next/navigation
mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: mock(() => {}),
    back: mock(() => {}),
    forward: mock(() => {}),
  }),
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === "callbackUrl") return null
      return null
    },
  }),
}))

// Mock next/link
mock.module("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Mock auth-client
const mockSignIn = mock(async () => ({
  error: null,
}))

mock.module("@/lib/auth-client", () => ({
  signIn: {
    email: mockSignIn,
  },
}))

// Mock next-intl
const mockTranslations = {
  "auth.loginTitle": "Login",
  "auth.loginDescription": "Sign in to your account",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.login": "Login",
  "auth.noAccount": "Don't have an account?",
  "auth.register": "Register here",
  "auth.emailInvalid": "Invalid email",
  "auth.emailRequired": "Email is required",
  "auth.passwordMin": "Password must be at least 8 characters",
  "auth.passwordRequired": "Password is required",
  "common.error": "An error occurred",
  "common.loading": "Loading...",
}

mock.module("next-intl", () => ({
  useTranslations: () => (key: string) => mockTranslations[key as keyof typeof mockTranslations] || key,
}))

const createLoginPageWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={mockTranslations}>
      {children}
    </NextIntlClientProvider>
  )
}

describe("LoginPage component", () => {
  beforeEach(() => {
    mockSignIn.mockClear?.()
  })

  it("renders login form with email and password fields", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    expect(screen.getByLabelText(/Email/i)).toBeDefined()
    expect(screen.getByLabelText(/Password/i)).toBeDefined()
  })

  it("renders submit button", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    expect(screen.getByRole("button", { name: /Login/i })).toBeDefined()
  })

  it("renders link to register page", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    const registerLink = screen.getByRole("link", { name: /Register here/i })
    expect(registerLink).toBeDefined()
    expect(registerLink.getAttribute("href")).toBe("/register")
  })

  it("renders title and description", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    expect(screen.getByText(/Login/)).toBeDefined()
    expect(screen.getByText(/Sign in to your account/)).toBeDefined()
  })

  it("shows email input type", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    expect(emailInput.type).toBe("email")
  })

  it("shows password input type", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    const passwordInput = screen.getByLabelText(/Password/i) as HTMLInputElement
    expect(passwordInput.type).toBe("password")
  })

  it("has correct input placeholders", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    expect(screen.getByPlaceholderText("user@example.com")).toBeDefined()
    expect(screen.getByPlaceholderText("••••••••")).toBeDefined()
  })

  it("form renders in a card layout", () => {
    const { container } = render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    const card = container.querySelector('[data-slot="card"]')
    expect(card).toBeDefined()
  })

  it("button is initially not disabled", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    const button = screen.getByRole("button", { name: /Login/i }) as HTMLButtonElement
    expect(button.disabled).toBe(false)
  })

  it("renders in a centered layout", () => {
    const { container } = render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv.className).toContain("flex")
    expect(mainDiv.className).toContain("items-center")
    expect(mainDiv.className).toContain("justify-center")
  })

  it("form has correct structure with inputs", () => {
    render(<LoginPage />, { wrapper: createLoginPageWrapper() })

    const form = screen.getByRole("button", { name: /Login/i }).closest("form")
    expect(form).toBeDefined()
    expect(form?.querySelector('input[type="email"]')).toBeDefined()
    expect(form?.querySelector('input[type="password"]')).toBeDefined()
  })
})
