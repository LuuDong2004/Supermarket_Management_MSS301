// Thin fetch wrapper around the Spring Cloud Gateway.
// All backend responses are shaped as ApiResponse<T> = { success, message, data, ... }.

const BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'sms.accessToken'
const REFRESH_KEY = 'sms.refreshToken'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access, refresh) => {
    if (access) localStorage.setItem(TOKEN_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message)
    this.status = status
    this.code = code
  }
}

async function request(method, path, body, { auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = tokenStore.get()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Không thể kết nối tới máy chủ. Backend đã chạy chưa?', 0, 'NETWORK')
  }

  let payload = null
  const text = await res.text()
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = { message: text }
    }
  }

  if (!res.ok) {
    const message = payload?.message || payload?.error || `Lỗi ${res.status}`
    throw new ApiError(message, res.status, payload?.code)
  }

  // Unwrap ApiResponse envelope when present.
  return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload
}

export const api = {
  get: (p, opts) => request('GET', p, null, opts),
  post: (p, b, opts) => request('POST', p, b, opts),
  put: (p, b, opts) => request('PUT', p, b, opts),
  patch: (p, b, opts) => request('PATCH', p, b, opts),
  delete: (p, opts) => request('DELETE', p, null, opts),
}
