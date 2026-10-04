import { NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Tasks from './pages/Tasks.jsx'
import About from './pages/About.jsx'

export default function App() {
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
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}