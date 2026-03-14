"use client"

import { type UseMutationOptions, useMutation } from "@tanstack/react-query"

type EdenResponse<T> = { data: T; error: null } | { data: null; error: unknown }

export function useApiMutation<T, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<EdenResponse<T>>,
  options?: Omit<UseMutationOptions<T, unknown, TVariables>, "mutationFn">
) {
  return useMutation<T, unknown, TVariables>({
    mutationFn: async (variables) => {
      const result = await mutationFn(variables)
      if (result.error) {
        throw result.error
      }
      return result.data as T
    },
    ...options,
  })
}
