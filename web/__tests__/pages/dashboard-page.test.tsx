import { describe, it, expect, beforeEach, mock } from "bun:test"
import { render, screen, waitFor } from "@testing-library/react"
import DashboardPage from "@/app/dashboard/page"
import { NextIntlClientProvider } from "next-intl"

// Mock next/navigation
const mockPush = mock(() => {})

mock.module("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mock(() => {}),
    forward: mock(() => {}),
  }),
}))

// Mock next-intl
const mockTranslations = {
  "dashboard.title": "Dashboard",
  "dashboard.userInfo": "User Information",
  "dashboard.welcome": "Welcome, {name}!",
  "dashboard.memberSince": "Member since {date}",
  "auth.logout": "Logout",
  "common.loading": "Loading...",
  "common.error": "An error occurred",
}

mock.module("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, string>) => {
    let text = mockTranslations[key as keyof typeof mockTranslations] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v)
      })
    }
    return text
  },
}))

// Mock better-auth
const mockSignOut = mock(async () => {})

const mockSession = {
  user: {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-01-15T10:30:00Z",
  },
  session: {
    id: "session-123",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
}

const mockUseSession = mock(() => ({
  data: mockSession,
  isPending: false,
}))

mock.module("@/lib/auth-client", () => ({
  useSession: mockUseSession,
  signOut: mockSignOut,
}))

const createDashboardPageWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <NextIntlClientProvider locale="en" messages={mockTranslations}>
      {children}
    </NextIntlClientProvider>
  )
}

describe("DashboardPage component", () => {
  beforeEach(() => {
    mockPush.mockClear?.()
    mockSignOut.mockClear?.()
    mockUseSession.mockClear?.()
  })

  it("shows loading state when session is pending", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: true,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByText(/Loading/)).toBeDefined()
  })

  it("renders user information when session is loaded", async () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    await waitFor(() => {
      expect(screen.getByText(/Dashboard/)).toBeDefined()
      expect(screen.getByText(/John Doe/)).toBeDefined()
      expect(screen.getByText(/john@example.com/)).toBeDefined()
    })
  })

  it("displays user email from session", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByText("john@example.com")).toBeDefined()
  })

  it("displays user name from session", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByText("John Doe")).toBeDefined()
  })

  it("displays joined date from session", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    const joinedDate = new Date(mockSession.user.createdAt).toLocaleDateString()
    expect(screen.getByText(new RegExp(joinedDate))).toBeDefined()
  })

  it("renders User Information card", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByText("User Information")).toBeDefined()
  })

  it("renders logout button when user is authenticated", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByRole("button", { name: /Logout/i })).toBeDefined()
  })

  it("shows error state when user data is not available", () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByText(/An error occurred/)).toBeDefined()
  })

  it("renders header with title", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByText("Dashboard")).toBeDefined()
  })

  it("displays 'Not provided' when user has no name", () => {
    const sessionWithoutName = {
      ...mockSession,
      user: { ...mockSession.user, name: null },
    }

    mockUseSession.mockReturnValue({
      data: sessionWithoutName as any,
      isPending: false,
    })

    render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    expect(screen.getByText("Not provided")).toBeDefined()
  })

  it("renders card in main layout", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    const { container } = render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    const card = container.querySelector('[data-slot="card"]')
    expect(card).toBeDefined()
  })

  it("renders header with border", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    const { container } = render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    const header = container.querySelector("header")
    expect(header).toBeDefined()
    expect(header?.className).toContain("border-b")
  })

  it("has full height flex layout", () => {
    mockUseSession.mockReturnValue({
      data: mockSession,
      isPending: false,
    })

    const { container } = render(<DashboardPage />, { wrapper: createDashboardPageWrapper() })

    const mainDiv = container.querySelector("div")
    expect(mainDiv?.className).toContain("min-h-screen")
    expect(mainDiv?.className).toContain("flex")
  })
})
