import { useEffect, useState } from 'react'
import { listTasks, createTask, deleteTask } from './api'
import DemoNotice from './components/DemoNotice.jsx'

const EMPTY_FORM = {
  title: '',
  subject: '',
  description: '',
  due_date: '',
  priority: 'Medium',
}

export default function App() {
  const [status, setStatus] = useState('loading')
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  async function load() {
    setStatus('loading')
    setError(null)

    const timer = setTimeout(() => setSlow(true), 3000)

    try {
      setRows(await listTasks())
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    } finally {
      clearTimeout(timer)
      setSlow(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) return

    setSaving(true)

    try {
      const created = await createTask({
        title: form.title.trim(),
        subject: form.subject.trim(),
        description: form.description.trim(),
        due_date: form.due_date,
        priority: form.priority,
        completed: false,
      })

      setRows([created, ...rows])
      setForm(EMPTY_FORM)
    } catch (caught) {
      setError(caught)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const previous = rows

    setRows(rows.filter((row) => row.id !== id))

    try {
      await deleteTask(id)
    } catch (caught) {
      setRows(previous)
      setError(caught)
    }
  }

  return (
    <div className="page">
      <header>
        <h1>StudySprint Planner</h1>
        <p className="lede">
          Plan your tasks, stay organized, and keep track of your academic
          workload.
        </p>
      </header>

      <DemoNotice />

      {error && (
        <p className="error" role="alert">
          {error.message}{' '}
          <button onClick={load}>Try again</button>
        </p>
      )}

      <form onSubmit={handleSubmit} className="card">
        <h2>Add a Task</h2>

        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          value={form.title}
          onChange={(event) =>
            setForm({ ...form, title: event.target.value })
          }
          maxLength={120}
          required
        />

        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          value={form.subject}
          onChange={(event) =>
            setForm({ ...form, subject: event.target.value })
          }
          maxLength={120}
          required
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          maxLength={2000}
          rows={3}
        />

        <label htmlFor="due_date">Due Date</label>
        <input
          id="due_date"
          type="date"
          value={form.due_date}
          onChange={(event) =>
            setForm({ ...form, due_date: event.target.value })
          }
          required
        />

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={form.priority}
          onChange={(event) =>
            setForm({ ...form, priority: event.target.value })
          }
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Add Task'}
        </button>
      </form>

      {status === 'loading' && (
        <p className="muted">
          Loading
          {slow
            ? '. The server may be waking up, which can take up to a minute.'
            : '...'}
        </p>
      )}

      {status === 'ready' && rows.length === 0 && (
        <p className="muted">
          No tasks yet. Add your first task above.
        </p>
      )}

      {status === 'ready' && rows.length > 0 && (
        <ul className="list">
          {rows.map((row) => (
            <li key={row.id} className="card">
              <div className="row-head">
                <h3>{row.title}</h3>
                <span className="spooky">{row.priority}</span>
              </div>

              <p>
                <strong>Subject:</strong> {row.subject}
              </p>

              {row.description ? (
                <p>{row.description}</p>
              ) : (
                <p className="muted">No description given.</p>
              )}

              <footer>
                <time dateTime={row.due_date}>
                  Due:{' '}
                  {new Date(
                    row.due_date + 'T00:00:00'
                  ).toLocaleDateString()}
                </time>

                <button onClick={() => handleDelete(row.id)}>
                  Delete
                </button>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}