import { Elysia } from "elysia"

export const testAuthPlugin = new Elysia({ name: "test-auth" }).macro({
  auth: {
    resolve({ status, request: { headers } }) {
      const auth = headers.get("authorization")

      if (!auth || !auth.startsWith("Bearer ")) {
        return status(401)
      }

      const userId = auth.slice("Bearer ".length).trim()

      if (!userId) {
        return status(401)
      }

      return {
        user: { id: userId },
      }
    },
  },
})
