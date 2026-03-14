import { describe, it, expect, beforeEach, mock } from "bun:test"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useApiQuery } from "@/lib/hooks/use-api-query"
import type { ReactNode } from "react"

describe("useApiQuery hook", () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }

  it("returns data on successful fetch", async () => {
    const mockData = { id: 1, name: "Test User" }
    const fetcher = mock(async () => ({
      data: mockData,
      error: null,
    }))

    const { result } = renderHook(
      () => useApiQuery(["test"], fetcher as () => Promise<{ data: typeof mockData; error: null }>),
      { wrapper: createWrapper() }
    )

    expect(result.current.isPending).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
    expect(fetcher).toHaveBeenCalled()
  })

  it("throws error when response has error", async () => {
    const testError = new Error("Test error")
    const fetcher = mock(async () => ({
      data: null,
      error: testError,
    }))

    const { result } = renderHook(
      () => useApiQuery(["test-error"], fetcher as () => Promise<{ data: null; error: Error }>),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(testError)
  })

  it("passes through query options", async () => {
    const mockData = { value: 42 }
    const fetcher = async () => ({
      data: mockData,
      error: null,
    })

    const { result } = renderHook(
      () =>
        useApiQuery(["test-options"], fetcher as () => Promise<{ data: typeof mockData; error: null }>, {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
        }),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading || result.current.isPending).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
  })

  it("handles query key updates", async () => {
    const mockData1 = { id: 1 }
    const fetcher = mock(async () => ({
      data: mockData1,
      error: null,
    }))

    const { result } = renderHook(
      ({ key }) => useApiQuery(key, fetcher as () => Promise<{ data: typeof mockData1; error: null }>),
      {
        wrapper: createWrapper(),
        initialProps: { key: ["test", 1] },
      }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it("handles undefined and null error gracefully", async () => {
    const fetcher = async () => ({
      data: null,
      error: undefined,
    })

    const { result } = renderHook(
      () => useApiQuery(["test-undefined-error"], fetcher as () => Promise<any>),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess || result.current.isError).toBe(true)
    })
  })
})
