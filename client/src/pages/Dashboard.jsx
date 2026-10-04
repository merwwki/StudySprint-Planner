import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listTasks } from '../api'

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await listTasks()
        setTasks(data)
        setStatus('ready')
      } catch (caught) {
        setError(caught)
        setStatus('error')
      }
    }

    loadDashboard()
  }, [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const activeTasks = tasks.filter((task) => !task.completed).length

  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort(
      (a, b) =>
        new Date(a.due_date).getTime() -
        new Date(b.due_date).getTime()
    )
    .slice(0, 4)

  return (
    <main className="page">
      <section className="dashboard-welcome">
        <div>
          <p className="eyebrow">STUDYSPRINT PLANNER</p>
          <h1>Stay ahead of your schoolwork.</h1>
          <p className="lede">
            Keep track of your academic workload, upcoming deadlines,
            and completed tasks in one place.
          </p>
        </div>

        <Link className="primary-link" to="/tasks">
          View My Tasks
        </Link>
      </section>

      {status === 'loading' && (
        <p className="muted">Loading your dashboard...</p>
      )}

      {status === 'error' && (
        <div className="error" role="alert">
          Unable to load your tasks: {error?.message}
        </div>
      )}

      {status === 'ready' && (
        <>
          <section className="stats-grid">
            <article className="stat-card">
              <span className="stat-label">Total Tasks</span>
              <strong>{totalTasks}</strong>
              <p>All academic tasks</p>
            </article>

            <article className="stat-card">
              <span className="stat-label">Active Tasks</span>
              <strong>{activeTasks}</strong>
              <p>Still to be completed</p>
            </article>

            <article className="stat-card">
              <span className="stat-label">Completed</span>
              <strong>{completedTasks}</strong>
              <p>Tasks finished</p>
            </article>
          </section>

          <section className="upcoming-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">UP NEXT</p>
                <h2>Upcoming Deadlines</h2>
              </div>

              <Link className="text-link" to="/tasks">
                View all tasks →
              </Link>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="card empty-state">
                <h3>You're all caught up!</h3>
                <p className="muted">
                  You don't have any active tasks right now.
                </p>
              </div>
            ) : (
              <div className="deadline-list">
                {upcomingTasks.map((task) => (
                  <article className="deadline-item" key={task.id}>
                    <div className="deadline-main">
                      <span
                        className={`priority-dot priority-dot-${task.priority.toLowerCase()}`}
                      />

                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.subject}</p>
                      </div>
                    </div>

                    <div className="deadline-meta">
                      <span
                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                      <time dateTime={task.due_date}>
                        {new Date(task.due_date).toLocaleDateString(
                          undefined,
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </time>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  )
}