-- Sample data for StudySprint Planner development.
--
-- This starts with TRUNCATE. Only run this against the local development
-- database because it deletes existing task data.

TRUNCATE TABLE tasks RESTART IDENTITY CASCADE;

INSERT INTO tasks
  (title, subject, description, due_date, priority, completed)
VALUES
  (
    'Finish Database Assignment',
    'Database Systems',
    'Complete the assigned database exercises.',
    CURRENT_DATE + 3,
    'High',
    FALSE
  ),
  (
    'Review Project Management Notes',
    'Project Management',
    'Review the notes for the upcoming assessment.',
    CURRENT_DATE + 5,
    'Medium',
    FALSE
  ),
  (
    'Complete Programming Activity',
    'Programming',
    'Finish and submit the programming activity.',
    CURRENT_DATE + 7,
    'High',
    FALSE
  ),
  (
    'Read Globalization Module',
    'Globalization',
    'Read the assigned module and prepare notes.',
    CURRENT_DATE + 9,
    'Low',
    FALSE
  ),
  (
    'Review Previous Lessons',
    'Computer Science',
    'Review previous lessons before the next class.',
    CURRENT_DATE + 1,
    'Medium',
    TRUE
  );