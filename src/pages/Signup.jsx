
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSignup = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      return
    }

    const users = JSON.parse(
      localStorage.getItem('users')
    ) || []

    if (
      email.toLowerCase() === 'admin@gmail.com' ||
      users.some(user =>
        user.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      setError('Email already registered!')
      return
    }

    users.push({
      name: name.trim(),
      email,
      password
    })

    localStorage.setItem(
      'users',
      JSON.stringify(users)
    )

    alert('Registration Successful! Please Login.')

    navigate('/login')
  }

  // Simple Password Strength Indicator

  let strength = 0

  if (password.length >= 6) strength++
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++

  const strengthText = [
    'Very Weak',
    'Weak',
    'Fair',
    'Good',
    'Strong'
  ]

  return (
    <div className="auth-page">

      {/* Left Section */}

      <section className="auth-banner">

        <div className="auth-art">🎁</div>

        <h1>Join ShopEasy</h1>

        <p>
          Create your account and start your
          shopping journey today.
        </p>

        <div className="auth-benefits">
          <span>✓ Explore Amazing Products</span>
          <span>✓ Enjoy Special Offers</span>
          <span>✓ Easy Order Management</span>
        </div>

      </section>

      {/* Signup Form */}

      <section className="auth-form">

        <span className="auth-tag">SHOPEASY</span>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Fill in your details to get started.
        </p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>

          <label htmlFor="signup-name">
            Full Name
          </label>

          <input
            id="signup-name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label htmlFor="signup-email">
            Email Address
          </label>

          <input
            id="signup-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="signup-password">
            Password
          </label>

          <div className="password-field">

            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
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

          {password && (
            <div className="password-strength">

              <div className="strength-track">

                <div
                  className="strength-fill"
                  style={{
                    width: `${Math.max(10, strength * 25)}%`,
                    background:
                      strength <= 1 ? '#dc2626' :
                      strength <= 2 ? '#f59e0b' :
                      '#16a34a'
                  }}
                />

              </div>

              <small>
                Password Strength: {strengthText[strength]}
              </small>

            </div>
          )}

          <label htmlFor="confirm-password">
            Confirm Password
          </label>

          <input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={e =>
              setConfirmPassword(e.target.value)
            }
            required
          />

          <button type="submit" className="auth-submit">
            Create Account →
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign In</Link>
        </p>

      </section>

    </div>
  )
}

export default Signup
