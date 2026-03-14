import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin, openAPI } from "better-auth/plugins"
import { db } from "@/database/client"

export const auth = betterAuth({
  base: "/auth",
  plugins: [openAPI(), admin()],
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    camelCase: false,
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 7, // 7 minutes cache avoid too many database queries to check session
    },
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    },
  },
})

// Add openapi plugin so better-auth can generate the schema for the api
type GeneratedSchema = Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>>
let _schema: GeneratedSchema | undefined

const getSchema = async (): Promise<GeneratedSchema> => {
  if (_schema) return _schema
  _schema = await auth.api.generateOpenAPISchema()
  return _schema
}

export const OpenAPI = {
  getPaths: (prefix = "/auth") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null)

      for (const path of Object.keys(paths)) {
        const key = prefix + path
        reference[key] = paths[path]

        for (const method of Object.keys(paths[path])) {
          const operations = reference[key] as Record<string, { tags?: string[] }>
          const operation = operations[method]

          if (operation) {
            operation.tags = ["Auth"]
          }
        }
      }

      return reference
    }),
  components: getSchema().then(({ components }) => components),
} as const
