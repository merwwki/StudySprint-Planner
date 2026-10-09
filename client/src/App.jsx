import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import About from './pages/About.jsx'
import { login, USING_MOCK_API } from './api/index.js'

export default function App() {
  const [authenticated, setAuthenticated] = useState(
    USING_MOCK_API || Boolean(sessionStorage.getItem('studysprint-token'))
  )

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()
    setError('')

    try {
      const result = await login(password)

      if (!USING_MOCK_API) {
        sessionStorage.setItem('studysprint-token', result.token)
      }

      setAuthenticated(true)
      setPassword('')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('studysprint-token')
    setAuthenticated(USING_MOCK_API)
    setPassword('')
    setError('')
  }

  if (!authenticated) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <h1>StudySprint Planner</h1>
          <p>Enter the access password to continue.</p>

          <form onSubmit={handleLogin}>
            <label htmlFor="access-password">Password</label>

            <input
              id="access-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              autoComplete="current-password"
              required
            />

            <button type="submit">Enter</button>
          </form>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}
        </section>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <NavLink className="brand" to="/">
          StudySprint
        </NavLink>

        <div className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
            Tasks
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
            About
          </NavLink>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}