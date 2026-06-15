// Vietnamese-locale formatting helpers used across the app.

export function formatCurrency(value, { compact = false } = {}) {
  const n = Number(value) || 0
  if (compact && Math.abs(n) >= 1_000_000) {
    return new Intl.NumberFormat('vi-VN', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(n) + ' đ'
  }
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ'
}

export function formatNumber(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value) || 0)
}

export function formatDate(value, withTime = false) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  if (!withTime) return date
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}`
}

export function formatPercent(value, digits = 1) {
  return `${(Number(value) || 0).toFixed(digits)}%`
}

// Human role label from a ROLE_* string.
export function roleLabel(role) {
  const map = {
    ROLE_CEO: 'CEO',
    ROLE_ADMIN: 'Administrator',
    ROLE_CASHIER: 'Cashier',
    ROLE_WAREHOUSE: 'Warehouse',
    ROLE_SUPPLIER: 'Supplier',
  }
  return map[role] || role || '—'
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}
