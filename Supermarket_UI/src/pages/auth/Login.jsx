import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  ShoppingBasket,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../components/ui/Toast.jsx'

export default function Login() {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (user) return <Navigate to="/app/dashboard" replace />

  const clearError = () => {
    if (error) setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')

    if (!username.trim() || !password) {
      setError('Username and password are required.')
      return
    }

    try {
      const signedInUser = await login(username.trim(), password)
      toast.success(`Welcome, ${signedInUser.fullName || signedInUser.username}!`)
      navigate('/app/dashboard')
    } catch (requestError) {
      setError(requestError.message || 'Incorrect username or password.')
    }
  }

  const forgotPassword = () => {
    toast.info('Please contact the system administrator to reset your password.')
  }

  return (
    <main className="sms-login">
      <header className="sms-login-header">
        <div className="sms-login-brand">
          <span className="sms-login-brand-mark" aria-hidden="true">
            <ShoppingBasket size={23} strokeWidth={2.2} />
          </span>
          <div>
            <h1>Supermarket Management System</h1>
            <p>One place for smarter store operations</p>
          </div>
        </div>
        <span className="sms-login-security">
          <ShieldCheck size={16} aria-hidden="true" />
          Login Screen
        </span>
      </header>

      <div className="sms-login-stage">
        <section className="sms-login-card" aria-labelledby="login-title">
          <div className="sms-login-card-heading">
            <span className="sms-login-heading-icon" aria-hidden="true">
              <LockKeyhole size={22} />
            </span>
            <div>
              <h2 id="login-title">User Login</h2>
              <p>Sign in with an active supermarket system account.</p>
            </div>
          </div>

          <form onSubmit={submit} noValidate>
            <div className="sms-login-field">
              <label htmlFor="username">Username</label>
              <div className="sms-login-input-wrap">
                <UserRound size={18} aria-hidden="true" />
                <input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value)
                    clearError()
                  }}
                  placeholder="Enter your username"
                  autoComplete="username"
                  autoFocus
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                />
              </div>
            </div>

            <div className="sms-login-field">
              <div className="sms-login-label-row">
                <label htmlFor="password">Password</label>
                <button type="button" onClick={forgotPassword} disabled={loading}>
                  Forgot password?
                </button>
              </div>
              <div className="sms-login-input-wrap">
                <LockKeyhole size={18} aria-hidden="true" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    clearError()
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                />
                <button
                  type="button"
                  className="sms-login-password-toggle"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div id="login-error" role="alert" className="sms-login-error">
                <AlertCircle size={18} aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <div className="sms-login-actions">
              <button type="submit" disabled={loading}>
                <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                {!loading && <ArrowRight size={19} aria-hidden="true" />}
              </button>
            </div>
          </form>

          <p className="sms-login-help">
            <ShieldCheck size={15} aria-hidden="true" />
            Protected access for authorized supermarket staff
          </p>
        </section>
      </div>
    </main>
  )
}
