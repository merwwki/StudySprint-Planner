import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import { createHmac, timingSafeEqual } from 'node:crypto'
import * as tasks from './tasksRepo.js'

const app = express()

// CORS before the routes.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin: allowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '100kb' }))


// Server-side authentication. Secrets belong in server/.env or host settings.
const TOKEN_LIFETIME_SECONDS = 60 * 60 * 8
const failedLogins = new Map()
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILED_LOGINS = 10

function configuredAuth() {
  return (
    typeof process.env.APP_PASSWORD === 'string' &&
    process.env.APP_PASSWORD.length > 0 &&
    typeof process.env.AUTH_SECRET === 'string' &&
    process.env.AUTH_SECRET.length >= 32
  )
}

function safeStringEqual(left, right) {
  const leftHash = createHmac('sha256', 'studysprint-compare').update(left).digest()
  const rightHash = createHmac('sha256', 'studysprint-compare').update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

function signToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = createHmac('sha256', process.env.AUTH_SECRET)
    .update(encoded)
    .digest('base64url')
  return `${encoded}.${signature}`
}

function verifyToken(token) {
  if (typeof token !== 'string') return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [encoded, suppliedSignature] = parts
  const expectedSignature = createHmac('sha256', process.env.AUTH_SECRET)
    .update(encoded)
    .digest()

  let actualSignature
  try {
    actualSignature = Buffer.from(suppliedSignature, 'base64url')
  } catch {
    return false
  }

  if (
    actualSignature.length !== expectedSignature.length ||
    !timingSafeEqual(actualSignature, expectedSignature)
  ) {
    return false
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    return payload.sub === 'planner-user' &&
      Number.isInteger(payload.exp) &&
      payload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

function requireAuth(request, response, next) {
  if (!configuredAuth()) {
    return response.status(503).json({ error: 'Authentication is not configured' })
  }

  const authorization = request.get('authorization') || ''
  const match = /^Bearer ([^\s]+)$/.exec(authorization)

  if (!match || !verifyToken(match[1])) {
    return response.status(401).json({ error: 'Authentication required' })
  }

  next()
}

app.post('/api/login', (request, response) => {
  if (!configuredAuth()) {
    return response.status(503).json({ error: 'Authentication is not configured' })
  }

  const now = Date.now()
  const key = request.ip
  let record = failedLogins.get(key)

  if (!record || now - record.startedAt >= LOGIN_WINDOW_MS) {
    record = { startedAt: now, count: 0 }
    failedLogins.set(key, record)
  }

  if (record.count >= MAX_FAILED_LOGINS) {
    return response.status(429).json({
      error: 'Too many login attempts. Please try again in 15 minutes.',
    })
  }

  const password = typeof request.body?.password === 'string'
    ? request.body.password
    : ''

  if (!safeStringEqual(password, process.env.APP_PASSWORD)) {
    record.count += 1
    return response.status(401).json({ error: 'Incorrect password' })
  }

  failedLogins.delete(key)

  const token = signToken({
    sub: 'planner-user',
    exp: Math.floor(now / 1000) + TOKEN_LIFETIME_SECONDS,
  })

  response.json({ token, expiresIn: TOKEN_LIFETIME_SECONDS })
})

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

  // Validate both the date format and the actual calendar date.
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(due_date)
  let validDate = false

  if (dateMatch) {
    const year = Number(dateMatch[1])
    const month = Number(dateMatch[2])
    const day = Number(dateMatch[3])
    const parsedDate = new Date(Date.UTC(year, month - 1, day))

    validDate =
      year >= 1 &&
      parsedDate.getUTCFullYear() === year &&
      parsedDate.getUTCMonth() === month - 1 &&
      parsedDate.getUTCDate() === day
  }

  if (!validDate) {
    errors.push('due_date must be a valid date in YYYY-MM-DD format')
  }

  if (
    Object.prototype.hasOwnProperty.call(body, 'completed') &&
    typeof body.completed !== 'boolean'
  ) {
    errors.push('completed must be a boolean')
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

// All task endpoints require a valid server-issued token.
app.use('/api/tasks', requireAuth)

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