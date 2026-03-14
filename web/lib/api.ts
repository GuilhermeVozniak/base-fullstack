import type { App } from "@base-fullstack/shared"
import { treaty } from "@elysiajs/eden"
import { env } from "@/lib/env"

export const api = treaty<App>(env.NEXT_PUBLIC_API_URL)
