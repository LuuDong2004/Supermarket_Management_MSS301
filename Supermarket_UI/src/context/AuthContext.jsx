import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, tokenStore } from '../lib/api.js'

const AuthContext = createContext(null)
const USER_KEY = 'sms.user'

// Used exclusively for capturing the monochrome design pack. It never runs in
// the normal app, never calls the API, and disappears as soon as the query is
// removed. Keeping it here lets every role-specific screen be captured without
// changing access control for real users.
function mockupPreviewUser() {
  const query = new URLSearchParams(window.location.search)
  if (query.get('mockup') !== 'bw') return null
  const role = query.get('role')
  if (!role?.startsWith('ROLE_')) return null
  return { id: 'mockup-preview', username: 'Mockup user', fullName: 'Mockup user', role }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const preview = mockupPreviewUser()
    if (preview) return preview
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const persist = useCallback((u) => {
    setUser(u)
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
  }, [])

  // On boot, if we have a token but a stale user, refresh the profile.
  useEffect(() => {
    if (tokenStore.get() && user) {
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
        persist(profile)
        return profile
      } finally {
        setLoading(false)
      }
    },
    [persist],
  )

  const logout = useCallback(() => {
    const refresh = tokenStore.getRefresh()
    if (refresh) {
      api.post('/auth/logout', { refreshToken: refresh }).catch(() => {})
    }
    tokenStore.clear()
    persist(null)
  }, [persist])

  const hasRole = useCallback((roles) => {
    if (!user) return false
    if (!roles || roles.length === 0) return true
    return roles.includes(user.role)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, mockMode: Boolean(mockupPreviewUser()) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
