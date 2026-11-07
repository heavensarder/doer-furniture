---
description: Always sync database schema changes into scripts/init-db.mjs
---

# Database Schema & Live Server Migration Rule

Whenever any database table, column, index, or seed data is added or modified anywhere in the project:
1. You **MUST** immediately update `scripts/init-db.mjs` with the corresponding `CREATE TABLE IF NOT EXISTS` and/or `ensureColumn(db, tableName, columnName, columnDef)` migration statements.
2. Ensure `scripts/init-db.mjs` remains 100% idempotent and safe to run on the live VPS server via `node scripts/init-db.mjs` without losing existing production data.
3. Do not add extra scripts to `package.json` for this; the user runs `node scripts/init-db.mjs` manually on the live server.

