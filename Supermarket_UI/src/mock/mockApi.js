// Demo fallback accounts used only when the real gateway is unreachable
// and VITE_USE_MOCK is enabled. Mirrors the seeded backend users plus a few
// extra roles so every screen group can be explored.
export const DEMO_ACCOUNTS = {
  ceo: { password: '123456', role: 'ROLE_CEO', fullName: 'Trần Quốc Bảo', email: 'ceo@sms.vn' },
  admin: { password: '123456', role: 'ROLE_ADMIN', fullName: 'Phạm Thị Dung', email: 'admin@sms.vn' },
  cashier: { password: '123456', role: 'ROLE_CASHIER', fullName: 'Nguyễn Văn An', email: 'cashier@sms.vn' },
  warehouse: { password: '123456', role: 'ROLE_WAREHOUSE', fullName: 'Trần Thị Bình', email: 'warehouse@sms.vn' },
  supplier: { password: '123456', role: 'ROLE_SUPPLIER', fullName: 'Lê Văn Cường', email: 'supplier@sms.vn' },
}

export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK) !== 'false'

export function mockLogin(username, password) {
  const acc = DEMO_ACCOUNTS[username?.toLowerCase()]
  if (!acc || acc.password !== password) {
    throw new Error('Sai tài khoản hoặc mật khẩu (chế độ demo).')
  }
  const u = username.toLowerCase()
  return {
    id: `demo-${u}`,
    username: u,
    email: acc.email,
    fullName: acc.fullName,
    phone: '0900000000',
    role: acc.role,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2026-06-15T00:00:00Z',
  }
}

// Simulate async latency for mock service calls.
export function delay(data, ms = 220) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
