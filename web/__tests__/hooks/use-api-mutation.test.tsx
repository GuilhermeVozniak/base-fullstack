import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { cleanup, renderHook, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { useApiMutation } from "@/lib/hooks/use-api-mutation"

describe("useApiMutation hook", () => {
  let queryClient: QueryClient

  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    })
  })

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  it("returns data on successful mutation", async () => {
    const mockData = { id: 1, name: "Created" }
    const mutationFn = mock(async (variables: { name: string }) => ({
      data: { ...mockData, name: variables.name },
      error: null,
    }))

    const { result } = renderHook(
      () =>
        useApiMutation(
          mutationFn as (variables: {
            name: string
          }) => Promise<{ data: typeof mockData; error: null }>
        ),
      { wrapper: createWrapper() }
    )

    expect(result.current.isPending).toBe(false)

    result.current.mutate({ name: "Test" })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({ ...mockData, name: "Test" })
    expect(mutationFn).toHaveBeenCalledWith({ name: "Test" })
  })

  it("throws error when response has error", async () => {
    const testError = new Error("Mutation failed")
    const mutationFn = mock(async () => ({
      data: null,
      error: testError,
    }))

    const { result } = renderHook(
      () =>
        useApiMutation(mutationFn as (variables: void) => Promise<{ data: null; error: Error }>),
      { wrapper: createWrapper() }
    )

    result.current.mutate(undefined)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toEqual(testError)
  })

  it("passes through mutation options", async () => {
    const mockData = { value: "success" }
    const onSuccess = mock(() => {})
    const mutationFn = async () => ({
      data: mockData,
      error: null,
    })

    const { result } = renderHook(
      () =>
        useApiMutation(
          mutationFn as (variables: void) => Promise<{ data: typeof mockData; error: null }>,
          {
            onSuccess: onSuccess as any,
          }
        ),
      { wrapper: createWrapper() }
    )

    result.current.mutate(undefined)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockData)
    expect(onSuccess).toHaveBeenCalled()
    expect((onSuccess.mock.calls[0] as unknown[])[0]).toEqual(mockData)
  })

  it("handles mutation with variables", async () => {
    interface CreateUserInput {
      email: string
      name: string
    }

    interface CreateUserResponse {
      id: number
      email: string
      name: string
    }

    const mockResponse: CreateUserResponse = {
      id: 1,
      email: "user@example.com",
      name: "John Doe",
    }

    const mutationFn = mock(async (variables: CreateUserInput) => ({
      data: { ...mockResponse, ...variables },
      error: null,
    }))

    const { result } = renderHook(
      () =>
        useApiMutation(
          mutationFn as (
            variables: CreateUserInput
          ) => Promise<{ data: CreateUserResponse; error: null }>
        ),
      { wrapper: createWrapper() }
    )

    const variables = { email: "newuser@example.com", name: "Jane Doe" }
    result.current.mutate(variables)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({ ...mockResponse, ...variables })
    expect(mutationFn).toHaveBeenCalledWith(variables)
  })

  it("tracks pending state during mutation", async () => {
    let resolvePromise: () => void
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve
    })

    const mutationFn = async () => {
      await promise
      return { data: { success: true }, error: null }
    }

    const { result } = renderHook(
      () =>
        useApiMutation(
          mutationFn as (variables: void) => Promise<{ data: { success: boolean }; error: null }>
        ),
      { wrapper: createWrapper() }
    )

    expect(result.current.isPending).toBe(false)

    result.current.mutate(undefined)

    await waitFor(() => {
      expect(result.current.isPending).toBe(true)
    })

    resolvePromise!()

    await waitFor(() => {
      expect(result.current.isPending).toBe(false)
    })
  })

  it("handles mutation reset", async () => {
    const mockData = { id: 1 }
    const mutationFn = async () => ({
      data: mockData,
      error: null,
    })

    const { result } = renderHook(
      () =>
        useApiMutation(
          mutationFn as (variables: void) => Promise<{ data: typeof mockData; error: null }>
        ),
      { wrapper: createWrapper() }
    )

    result.current.mutate(undefined)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    result.current.reset()

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
      expect(result.current.isSuccess).toBe(false)
    })
  })
})
