
import { useState, useEffect } from 'react'
import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/wishlist'

function App() {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)

    localStorage.setItem(
      'theme',
      darkMode ? 'dark' : 'light'
    )
  }, [darkMode])

  return (
    <>
      <nav className="main-navbar">

        <Link to="/" className="brand">
          <span className="brand-icon">🛍️</span>

          <span>
            Shop<span className="brand-blue">Easy</span>
          </span>
        </Link>

        <div className="nav-links">

          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/wishlist">
            My Wishlist
          </NavLink>

          <NavLink to="/cart">
            🛒 Cart
          </NavLink>

          <NavLink to="/admin">
            Admin
          </NavLink>

        </div>

        <div className="nav-actions">

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode
              ? 'Switch to light mode'
              : 'Switch to dark mode'}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? (
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2 M12 20v2
                  M2 12h2 M20 12h2
                  M5 5l2 2 M17 17l2 2
                  M5 19l2-2 M17 7l2-2" />
              </svg>
            ) : (
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              >
                <path d="M20.9 13.35A9 9 0 0 1
                  10.65 3.1 9 9 0 1 0
                  20.9 13.35Z" />
              </svg>
            )}
          </button>

          <NavLink to="/login" className="login-btn">
            Login
          </NavLink>

          <NavLink to="/signup" className="signup-btn">
            Sign Up
          </NavLink>

        </div>

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </>
  )
}

export default App
