import { Elysia } from "elysia"
import { healthRoutes } from "@/http/routes/health"
import { usersRoutes } from "@/modules/users/routes"

export const routes = new Elysia({ name: "routes" }).use(healthRoutes).use(usersRoutes)
