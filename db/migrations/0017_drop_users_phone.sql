-- 0017 — Drop users.phone (specs/authentication/spec.md §FR1.1)
-- Phone capture deferred post-launch until SMS alerts ship
-- (constitution: out-of-scope for demo). The optional column on the
-- users table is no longer collected, validated, or stored. Existing
-- rows keep their phone value (column drop is idempotent against
-- rows because dropping the column removes the storage entirely).

alter table public.users drop column if exists phone;