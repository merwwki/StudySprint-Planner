import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as tasks from './tasksRepo.js'

const app = express()

// CORS before the routes.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Is the process alive?
app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

// Is the database reachable?
app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

// Validate task data on the server.
function validate(body) {
  const errors = []

  const title =
    typeof body.title === 'string' ? body.title.trim() : ''

  const subject =
    typeof body.subject === 'string' ? body.subject.trim() : ''

  const description =
    typeof body.description === 'string' ? body.description.trim() : ''

  const due_date =
    typeof body.due_date === 'string' ? body.due_date.trim() : ''

  const priority =
    typeof body.priority === 'string' ? body.priority.trim() : ''

  const completed =
    typeof body.completed === 'boolean' ? body.completed : false

  if (!title) {
    errors.push('title is required')
  }

  if (title.length > 255) {
    errors.push('title must be 255 characters or fewer')
  }

  if (!subject) {
    errors.push('subject is required')
  }

  if (subject.length > 255) {
    errors.push('subject must be 255 characters or fewer')
  }

  if (description.length > 2000) {
    errors.push('description must be 2000 characters or fewer')
  }

  if (!due_date || !/^\d{4}-\d{2}-\d{2}$/.test(due_date)) {
    errors.push('due_date must be a valid date in YYYY-MM-DD format')
  }

  if (!['Low', 'Medium', 'High'].includes(priority)) {
    errors.push('priority must be Low, Medium, or High')
  }

  return {
    errors,
    value: {
      title,
      subject,
      description,
      due_date,
      priority,
      completed
    }
  }
}

// Get all tasks.
app.get('/api/tasks', async (request, response, next) => {
  try {
    response.json(await tasks.getAll(pool))
  } catch (error) {
    next(error)
  }
})

// Get one task.
app.get('/api/tasks/:id', async (request, response, next) => {
  try {
    const row = await tasks.getById(pool, request.params.id)

    if (!row) {
      return response.status(404).json({ error: 'Not found' })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

// Create a task.
app.post('/api/tasks', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})

  if (errors.length > 0) {
    return response.status(400).json({
      error: errors.join('; ')
    })
  }

  try {
    response.status(201).json(
      await tasks.create(pool, value)
    )
  } catch (error) {
    next(error)
  }
})

// Update a task.
app.put('/api/tasks/:id', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})

  if (errors.length > 0) {
    return response.status(400).json({
      error: errors.join('; ')
    })
  }

  try {
    const row = await tasks.update(
      pool,
      request.params.id,
      value
    )

    if (!row) {
      return response.status(404).json({ error: 'Not found' })
    }

    response.json(row)
  } catch (error) {
    next(error)
  }
})

// Delete a task.
app.delete('/api/tasks/:id', async (request, response, next) => {
  try {
    const removed = await tasks.remove(
      pool,
      request.params.id
    )

    if (!removed) {
      return response.status(404).json({ error: 'Not found' })
    }

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// No matching route.
app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

// Server error handler.
app.use((error, request, response, next) => {
  console.error(error)

  response.status(500).json({
    error: 'Something went wrong on the server'
  })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})