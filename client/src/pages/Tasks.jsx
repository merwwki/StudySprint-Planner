import { useEffect, useMemo, useState } from 'react'
import {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../api'
import DemoNotice from '../components/DemoNotice.jsx'

const EMPTY_FORM = {
  title: '',
  subject: '',
  description: '',
  due_date: '',
  priority: 'Medium',
}

function dateForInput(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

export default function Tasks() {
  const [status, setStatus] = useState('loading')
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const [taskToDelete, setTaskToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    setStatus('loading')
    setError(null)

    const timer = setTimeout(() => setSlow(true), 3000)

    try {
      const tasks = await listTasks()
      setRows(tasks)
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

  function openAddForm() {
    setEditingTask(null)
    setForm(EMPTY_FORM)
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function openEditForm(task) {
    setEditingTask(task)

    setForm({
      title: task.title ?? '',
      subject: task.subject ?? '',
      description: task.description ?? '',
      due_date: dateForInput(task.due_date),
      priority: task.priority ?? 'Medium',
    })

    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleCancel() {
    setForm(EMPTY_FORM)
    setEditingTask(null)
    setShowForm(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.title.trim()) return

    setSaving(true)
    setError(null)

    const input = {
      title: form.title.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
      due_date: form.due_date,
      priority: form.priority,
    }

    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, {
          ...input,
          completed: editingTask.completed,
        })

        setRows((currentRows) =>
          currentRows.map((row) =>
            row.id === editingTask.id ? updated : row
          )
        )
      } else {
        const created = await createTask({
          ...input,
          completed: false,
        })

        setRows((currentRows) => [created, ...currentRows])
      }

      setForm(EMPTY_FORM)
      setEditingTask(null)
      setShowForm(false)
    } catch (caught) {
      setError(caught)
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleComplete(task) {
    setUpdatingId(task.id)
    setError(null)

    try {
      const updated = await updateTask(task.id, {
        title: task.title,
        subject: task.subject,
        description: task.description ?? '',
        due_date: dateForInput(task.due_date),
        priority: task.priority,
        completed: !task.completed,
      })

      setRows((currentRows) =>
        currentRows.map((row) =>
          row.id === task.id ? updated : row
        )
      )
    } catch (caught) {
      setError(caught)
    } finally {
      setUpdatingId(null)
    }
  }

  function requestDelete(task) {
    setTaskToDelete(task)
  }

  function cancelDelete() {
    if (deleting) return
    setTaskToDelete(null)
  }

  async function confirmDelete() {
    if (!taskToDelete) return

    const task = taskToDelete

    setDeleting(true)
    setError(null)

    try {
      await deleteTask(task.id)

      setRows((currentRows) =>
        currentRows.filter((row) => row.id !== task.id)
      )

      setTaskToDelete(null)
    } catch (caught) {
      setError(caught)
    } finally {
      setDeleting(false)
    }
  }

  const filteredRows = useMemo(() => {
    if (filter === 'active') {
      return rows.filter((row) => !row.completed)
    }

    if (filter === 'completed') {
      return rows.filter((row) => row.completed)
    }

    return rows
  }, [rows, filter])

  const activeCount = rows.filter((row) => !row.completed).length
  const completedCount = rows.filter((row) => row.completed).length

  return (
    <main className="page">
      <DemoNotice />

      <header className="tasks-header">
        <div>
          <p className="eyebrow">TASK MANAGER</p>
          <h1>My Tasks</h1>

          <p className="lede">
            Organize your assignments, activities, and study deadlines.
          </p>
        </div>

        <button
          type="button"
          className="add-task-button"
          onClick={showForm ? handleCancel : openAddForm}
        >
          {showForm ? 'Close' : '+ Add Task'}
        </button>
      </header>

      {error && (
        <div className="error" role="alert">
          <span>{error.message}</span>{' '}

          <button type="button" onClick={load}>
            Try again
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="card task-form">
          <div className="form-heading">
            <div>
              <p className="eyebrow">
                {editingTask ? 'EDIT TASK' : 'NEW TASK'}
              </p>

              <h2>
                {editingTask ? 'Edit Task' : 'Add a Task'}
              </h2>
            </div>

            <button
              type="button"
              className="close-form-button"
              onClick={handleCancel}
              aria-label="Close task form"
            >
              ×
            </button>
          </div>

          <label htmlFor="title">Task Title</label>

          <input
            id="title"
            value={form.title}
            onChange={(event) =>
              setForm({
                ...form,
                title: event.target.value,
              })
            }
            maxLength={120}
            placeholder="e.g. Finish database assignment"
            required
          />

          <label htmlFor="subject">Subject</label>

          <input
            id="subject"
            value={form.subject}
            onChange={(event) =>
              setForm({
                ...form,
                subject: event.target.value,
              })
            }
            maxLength={120}
            placeholder="e.g. Database Systems"
            required
          />

          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
            maxLength={2000}
            rows={3}
            placeholder="Add any notes or details..."
          />

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="due_date">
                Due Date
              </label>

              <input
                id="due_date"
                type="date"
                value={form.due_date}
                onChange={(event) =>
                  setForm({
                    ...form,
                    due_date: event.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="priority">
                Priority
              </label>

              <select
                id="priority"
                value={form.priority}
                onChange={(event) =>
                  setForm({
                    ...form,
                    priority: event.target.value,
                  })
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingTask
                  ? 'Save Changes'
                  : 'Add Task'}
            </button>
          </div>
        </form>
      )}

      <section className="tasks-section">
        <div className="task-toolbar">
          <div>
            <h2>Your Tasks</h2>

            <p className="muted">
              {rows.length} total · {activeCount} active ·{' '}
              {completedCount} completed
            </p>
          </div>

          <div className="filter-tabs">
            <button
              type="button"
              className={
                filter === 'all'
                  ? 'filter-active'
                  : ''
              }
              onClick={() => setFilter('all')}
            >
              All
            </button>

            <button
              type="button"
              className={
                filter === 'active'
                  ? 'filter-active'
                  : ''
              }
              onClick={() => setFilter('active')}
            >
              Active
            </button>

            <button
              type="button"
              className={
                filter === 'completed'
                  ? 'filter-active'
                  : ''
              }
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {status === 'loading' && (
          <p className="muted">
            Loading
            {slow
              ? '. The server may be waking up, which can take up to a minute.'
              : '...'}
          </p>
        )}

        {status === 'ready' &&
          filteredRows.length === 0 && (
            <div className="empty-state card">
              <h3>
                {filter === 'completed'
                  ? 'No completed tasks'
                  : filter === 'active'
                    ? 'No active tasks'
                    : 'No tasks yet'}
              </h3>

              <p className="muted">
                {filter === 'all'
                  ? 'Add your first academic task to start planning your workload.'
                  : 'There are no tasks in this category.'}
              </p>

              {filter === 'all' && (
                <button
                  type="button"
                  onClick={openAddForm}
                >
                  + Add Your First Task
                </button>
              )}
            </div>
          )}

        {status === 'ready' &&
          filteredRows.length > 0 && (
            <ul className="list task-list">
              {filteredRows.map((row) => (
                <li
                  key={row.id}
                  className={`card task-card ${
                    row.completed
                      ? 'task-completed'
                      : ''
                  }`}
                >
                  <div className="row-head">
                    <div>
                      <p className="task-subject">
                        {row.subject}
                      </p>

                      <h3>{row.title}</h3>
                    </div>

                    <span
                      className={`priority-badge priority-${row.priority.toLowerCase()}`}
                    >
                      {row.priority}
                    </span>
                  </div>

                  {row.description ? (
                    <p className="task-description">
                      {row.description}
                    </p>
                  ) : (
                    <p className="muted">
                      No description given.
                    </p>
                  )}

                  <footer className="task-footer">
                    <div className="task-date">
                      <span className="task-status">
                        {row.completed
                          ? 'Completed'
                          : 'Active'}
                      </span>

                      <time dateTime={row.due_date}>
                        Due:{' '}
                        {new Date(
                          row.due_date
                        ).toLocaleDateString(
                          undefined,
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </time>
                    </div>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          openEditForm(row)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className={
                          row.completed
                            ? 'secondary-button'
                            : 'complete-button'
                        }
                        disabled={
                          updatingId === row.id
                        }
                        onClick={() =>
                          handleToggleComplete(row)
                        }
                      >
                        {updatingId === row.id
                          ? 'Saving...'
                          : row.completed
                            ? 'Reopen'
                            : '✓ Complete'}
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          requestDelete(row)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </footer>
                </li>
              ))}
            </ul>
          )}
      </section>

      {taskToDelete && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              cancelDelete()
            }
          }}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <div className="delete-icon">!</div>

            <h2 id="delete-title">
              Delete this task?
            </h2>

            <p>
              Are you sure you want to delete{' '}
              <strong>
                "{taskToDelete.title}"
              </strong>
              ?
            </p>

            <p className="modal-note">
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm-delete-button"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting
                  ? 'Deleting...'
                  : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}