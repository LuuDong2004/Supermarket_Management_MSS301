import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, tokenStore, ApiError } from '../lib/api.js'
import { USE_MOCK, mockLogin } from '../mock/mockApi.js'

const AuthContext = createContext(null)
const USER_KEY = 'sms.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)
  const [mockMode, setMockMode] = useState(false)

  const persist = useCallback((u) => {
    setUser(u)
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
  }, [])

  // On boot, if we have a token but a stale user, refresh the profile.
  useEffect(() => {
    if (tokenStore.get() && user && !user.id?.startsWith('demo-')) {
      api.get('/users/me').then(persist).catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(
    async (username, password) => {
      setLoading(true)
      try {
        const auth = await api.post('/auth/login', { username, password }, { auth: false })
        tokenStore.set(auth.accessToken, auth.refreshToken)
        let profile
        try {
          profile = await api.get('/users/me')
        } catch {
          profile = { username: auth.username, role: auth.role, fullName: auth.username, id: auth.userId }
        }
        setMockMode(false)
        persist(profile)
        return profile
      } catch (err) {
        // Backend unreachable → optional demo fallback so the UI is explorable.
        if (USE_MOCK && err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
          const demo = mockLogin(username, password)
          tokenStore.set('demo-token', 'demo-refresh')
          setMockMode(true)
          persist(demo)
          return demo
        }
        throw err
      } finally {
        setLoading(false)
      }
    },
    [persist],
  )

  const logout = useCallback(() => {
    const refresh = tokenStore.getRefresh()
    if (refresh && refresh !== 'demo-refresh') {
      api.post('/auth/logout', { refreshToken: refresh }).catch(() => {})
    }
    tokenStore.clear()
    persist(null)
    setMockMode(false)
  }, [persist])

  const hasRole = useCallback((roles) => {
    if (!user) return false
    if (!roles || roles.length === 0) return true
    return roles.includes(user.role)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, mockMode }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
