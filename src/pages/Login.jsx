
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Admin Login

    if (
      email === 'admin@gmail.com' &&
      password === 'admin123'
    ) {
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({
          email,
          role: 'admin'
        })
      )

      navigate('/admin')
      return
    }

    // User Login

    const users = JSON.parse(
      localStorage.getItem('users')
    ) || []

    const user = users.find(
      u => u.email === email &&
           u.password === password
    )

    if (user) {
      localStorage.setItem(
        'loggedInUser',
        JSON.stringify({
          email: user.email,
          role: 'user'
        })
      )

      navigate('/')
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="auth-page">

      {/* Left Section */}

      <section className="auth-banner">

        <div className="auth-art">🛍️</div>

        <h1>Welcome Back!</h1>

        <p>
          Discover your favourite products and
          enjoy a better shopping experience.
        </p>

        <div className="auth-benefits">
          <span>✓ Amazing Products</span>
          <span>✓ Affordable Prices</span>
          <span>✓ Easy Shopping</span>
        </div>

      </section>

      {/* Login Form */}

      <section className="auth-form">

        <span className="auth-tag">SHOPEASY</span>

        <h2>Sign In</h2>

        <p className="auth-subtitle">
          Enter your details to access your account.
        </p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <label htmlFor="login-email">
            Email Address
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-password">
            Password
          </label>

          <div className="password-field">

            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>

          </div>

          <button type="submit" className="auth-submit">
            Sign In →
          </button>

        </form>

        <p className="auth-switch">
          New to ShopEasy?{' '}
          <Link to="/signup">Create Account</Link>
        </p>

        <div className="demo-admin">
          <strong>Demo Admin Account</strong>
          <p>Email: admin@gmail.com</p>
          <p>Password: admin123</p>
        </div>

      </section>

    </div>
  )
}

export default Login
