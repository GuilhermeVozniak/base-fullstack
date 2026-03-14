import { seed } from "drizzle-seed"
import { db } from "@/database/client"
import { users } from "@/database/schema/users"

async function main() {
  await seed(db, { users }).refine((f) => ({
    users: {
      count: 10,
      columns: {
        name: f.fullName(),
        email: f.email(),
        emailVerified: f.default({ defaultValue: true }),
        role: f.valuesFromArray({ values: ["user", "admin"], isUnique: false }),
        banned: f.default({ defaultValue: false }),
        createdAt: f.default({ defaultValue: new Date() }),
        updatedAt: f.default({ defaultValue: new Date() }),
      },
    },
  }))

  console.log("✅ Database seeded successfully")
  process.exit(0)
}

main().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})
