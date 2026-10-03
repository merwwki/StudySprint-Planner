-- The complete shape of the StudySprint Planner database.
-- This file creates the tasks table used to store academic tasks.

CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  title       TEXT        NOT NULL,
  subject     TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  due_date    DATE        NOT NULL,
  priority    TEXT        NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  completed   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helps the application display tasks according to their due date.
CREATE INDEX IF NOT EXISTS tasks_due_date_idx
  ON tasks (due_date ASC);