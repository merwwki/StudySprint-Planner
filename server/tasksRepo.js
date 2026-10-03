// Data-access layer for StudySprint Planner tasks.
//
// Every query is parameterised: values go in the array, never directly
// into the SQL string.

export async function getAll(pool) {
  const result = await pool.query(
    'SELECT * FROM tasks ORDER BY due_date ASC'
  )
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1',
    [id]
  )
  return result.rows[0] ?? null
}

export async function create(
  pool,
  { title, subject, description, due_date, priority, completed }
) {
  const result = await pool.query(
    `INSERT INTO tasks
      (title, subject, description, due_date, priority, completed)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      title,
      subject,
      description ?? '',
      due_date,
      priority,
      completed ?? false
    ]
  )

  return result.rows[0]
}

export async function update(
  pool,
  id,
  { title, subject, description, due_date, priority, completed }
) {
  const result = await pool.query(
    `UPDATE tasks
     SET title = $1,
         subject = $2,
         description = $3,
         due_date = $4,
         priority = $5,
         completed = $6
     WHERE id = $7
     RETURNING *`,
    [
      title,
      subject,
      description ?? '',
      due_date,
      priority,
      completed ?? false,
      id
    ]
  )

  return result.rows[0] ?? null
}

export async function remove(pool, id) {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id',
    [id]
  )

  return result.rowCount > 0
}