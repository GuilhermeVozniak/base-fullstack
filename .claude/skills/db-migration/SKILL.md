---
name: db-migration
description: Create a database migration by modifying the Drizzle schema and generating the migration SQL. Use when adding tables, columns, indexes, or modifying the database structure.
allowed-tools: Read, Write, Edit, Bash(bun *), Glob, Grep
argument-hint: <description-of-change>
---

# Database Migration

Create a database migration for: $ARGUMENTS

## Steps

1. **Read the current schema** files in `backend/src/database/schema/` to understand existing tables and relations

2. **Read `backend/drizzle.config.ts`** to confirm migration output path and dialect settings

3. **Modify or create schema files** in `backend/src/database/schema/`:
   - Use `snake_case` for all column names (Drizzle casing config handles mapping)
   - Use UUIDv7 for primary keys (`text("id").primaryKey()`)
   - Include `createdAt` and `updatedAt` timestamps
   - Define relations using `relations()` from drizzle-orm
   - Export new tables from `backend/src/database/schema/index.ts`

4. **Generate migration**:
   ```bash
   cd backend && bun run db:generate
   ```

5. **Review the generated SQL** in `backend/src/database/migrations/` — verify it matches expectations

6. **Apply the migration** (development only):
   ```bash
   cd backend && bun run db:migrate
   ```

7. **IMPORTANT**: Never manually edit migration files after they've been generated. If the migration is wrong, delete it and regenerate.

## Naming Conventions

- Table names: `snake_case`, plural (e.g., `user_profiles`)
- Column names: `snake_case` (e.g., `created_at`, `user_id`)
- Foreign keys: `<referenced_table_singular>_id` (e.g., `user_id`)
- Indexes: `<table>_<column>_idx` (e.g., `users_email_idx`)
