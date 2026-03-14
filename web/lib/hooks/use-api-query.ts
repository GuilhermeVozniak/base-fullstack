"use client"

import { type QueryKey, type UseQueryOptions, useQuery } from "@tanstack/react-query"

type EdenResponse<T> = { data: T; error: null } | { data: null; error: unknown }

export function useApiQuery<T>(
  queryKey: QueryKey,
  fetcher: () => Promise<EdenResponse<T>>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey,
    queryFn: async () => {
      const result = await fetcher()
      if (result.error) {
        throw result.error
      }
      return result.data as T
    },
    ...options,
  })
}
