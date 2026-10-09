// The real client. Every function here talks to the StudySprint Express API.

const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options = {}) {
const token = sessionStorage.getItem('studysprint-token')

const headers = {
'Content-Type': 'application/json',
...(token ? { Authorization: `Bearer ${token}` } : {}),
...options.headers,
}

const response = await fetch(`${BASE}${path}`, {
...options,
headers,
})

if (!response.ok) {
let message = `${response.status} ${response.statusText}`

```
try {
  const body = await response.json()
  if (body?.error) message = body.error
} catch {
  // The body was not JSON. The status line is used instead.
}

if (response.status === 401 && path !== '/api/login') {
  sessionStorage.removeItem('studysprint-token')
  window.dispatchEvent(new Event('studysprint-auth-expired'))
}

throw new Error(message)
```

}

return response.status === 204 ? null : response.json()
}

export const login = (password) =>
request('/api/login', {
method: 'POST',
body: JSON.stringify({ password }),
})

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
