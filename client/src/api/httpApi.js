// The real client. Every function here talks to the StudySprint Express API.

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`

    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is used instead.
    }

    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listTasks = () =>
  request('/api/tasks')

export const getTask = (id) =>
  request(`/api/tasks/${id}`)

export const createTask = (input) =>
  request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  })

export const updateTask = (id, input) =>
  request(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })

export const deleteTask = (id) =>
  request(`/api/tasks/${id}`, {
    method: 'DELETE',
  })