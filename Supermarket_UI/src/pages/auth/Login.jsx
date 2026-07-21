import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Crown,
  KeyRound,
  LockKeyhole,
  Package,
  ShieldCheck,
  ShoppingCart,
  UserCog,
  UserRound,
  Wrench,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../components/ui/Toast.jsx'
import { Button, Field, Input } from '../../components/ui/primitives.jsx'

const QUICK_ACCOUNTS = [
  { username: 'ceo', label: 'CEO', icon: Crown },
  { username: 'admin', label: 'Administrator', icon: ShieldCheck },
  { username: 'cashier', label: 'Cashier', icon: ShoppingCart },
  { username: 'warehouse', label: 'Warehouse Manager', icon: Wrench },
  { username: 'staff', label: 'Warehouse Staff', icon: Package },
  { username: 'staffmanager', label: 'Staff Manager', icon: UserCog },
]

export default function Login() {
  const { user, login, loading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/app/dashboard" replace />

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

  const quickLogin = async (account) => {
    setError('')
    setUsername(account.username)
    setPassword('123456')

    try {
      const signedInUser = await login(account.username, '123456')
      toast.success(`Welcome, ${signedInUser.fullName || signedInUser.username}!`)
      navigate('/app/dashboard')
    } catch (requestError) {
      setError(requestError.message || `Unable to sign in as ${account.label}.`)
    }
  }

  return (
    <main className="sms-login flex min-h-screen w-full bg-slate-50">
      <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white">
        <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-lg font-extrabold text-white shadow-sm">
              SMS
            </span>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Supermarket Management System
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">Secure supermarket operations portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <LockKeyhole size={16} className="text-brand-600" />
            Login Screen
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:py-14">
          <div className="grid w-full max-w-4xl items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8 lg:p-10">
              <div className="mb-7 flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-600">
                  <UserRound size={20} />
                </span>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">User Login</h2>
                  <p className="mt-1 text-sm text-slate-500">Sign in with an active supermarket system account.</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-5" noValidate>
                <Field label="Username" required>
                  <Input
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Enter username"
                    autoComplete="username"
                    autoFocus
                    aria-invalid={Boolean(error)}
                  />
                </Field>

                <Field label="Password" required>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    aria-invalid={Boolean(error)}
                  />
                </Field>

                {error && (
                  <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid gap-3 pt-1 sm:grid-cols-2">
                  <Button type="submit" size="lg" loading={loading} icon={ArrowRight} className="w-full">
                    Login
                  </Button>
                  <Button type="button" size="lg" variant="secondary" icon={KeyRound} onClick={forgotPassword} className="w-full">
                    Forgot Password
                  </Button>
                </div>
              </form>

              <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                Quick Login · Test Only
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {QUICK_ACCOUNTS.map((account) => {
                  const Icon = account.icon
                  return (
                    <button
                      key={account.username}
                      type="button"
                      disabled={loading}
                      onClick={() => quickLogin(account)}
                      className="group flex min-h-14 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left transition hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition group-hover:border-brand-200 group-hover:text-brand-600">
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-slate-700">{account.label}</span>
                        <span className="block text-[10px] text-slate-400">@{account.username}</span>
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="mt-3 text-center text-[11px] text-slate-400">
                Temporary test accounts use password <span className="font-semibold text-slate-500">123456</span>.
              </p>
            </div>

            <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-card">
              <h2 className="text-base font-bold text-slate-900">Screen Notes</h2>

              <div className="mt-5 space-y-5 text-sm text-slate-600">
                <NoteSection title="Fields" items={['Username', 'Password']} />
                <NoteSection title="Actions" items={['Login', 'Forgot Password']} />
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
                  Validation messages appear directly below the password field.
                </div>
              </div>
            </aside>
          </div>
        </section>

        <footer className="border-t border-slate-100 px-6 py-3 text-center text-xs text-slate-400">
          © 2026 SMS · Supermarket Management System
        </footer>
      </div>
    </main>
  )
}

function NoteSection({ title, items }) {
  return (
    <div>
      <p className="font-semibold text-slate-800">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
