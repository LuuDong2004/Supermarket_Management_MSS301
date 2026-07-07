// Domain service layer — thin wrappers over the API gateway (src/lib/api.js).
// Every backend response is already unwrapped from the ApiResponse<T> envelope by api.js.
// Paths here are gateway-relative (api.js prepends the /api base).
//
// Pages should read/write through these services and use `withFallback` so the
// UI still renders demo data (src/mock/db.js via ./fallback.js) when the backend
// is offline. This replaces the old pattern of importing mock data as the source.

import { api } from '../lib/api.js'

// Normalize a Spring `Page<T>` or a plain list into an array.
export function toList(res) {
  if (Array.isArray(res)) return res
  if (res && Array.isArray(res.content)) return res.content
  return res ?? []
}

// Backend-only fetch. Demo/mock fallbacks were removed — on error the caller
// gets an empty result (never fake data). Returns { data, source } where
// source is 'backend' on success or 'error' on failure.
export async function withFallback(call) {
  try {
    return { data: await call(), source: 'backend' }
  } catch (err) {
    console.error('[api] request failed:', err?.message || err)
    return { data: [], source: 'error', error: err }
  }
}

const qs = (params) => {
  if (!params) return ''
  if (typeof params === 'string') return params.startsWith('?') ? params : `?${params}`
  const s = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString()
  return s ? `?${s}` : ''
}

// ---- Product service (MySQL) ----
export const productService = {
  list: (params) => api.get(`/products${qs(params)}`),
  categories: () => api.get('/products/categories'),
  lowStock: () => api.get('/products/low-stock'),
  get: (id) => api.get(`/products/${id}`),
  create: (body) => api.post('/products', body),
  update: (id, body) => api.put(`/products/${id}`, body),
  remove: (id) => api.delete(`/products/${id}`),
}

export const promotionService = {
  list: () => api.get('/promotions'),
  get: (id) => api.get(`/promotions/${id}`),
  create: (body) => api.post('/promotions', body),
  update: (id, body) => api.put(`/promotions/${id}`, body),
  remove: (id) => api.delete(`/promotions/${id}`),
}

export const voucherService = {
  list: () => api.get('/vouchers'),
  get: (id) => api.get(`/vouchers/${id}`),
  create: (body) => api.post('/vouchers', body),
  update: (id, body) => api.put(`/vouchers/${id}`, body),
  remove: (id) => api.delete(`/vouchers/${id}`),
}

// ---- Inventory service (MySQL) ----
export const inventoryService = {
  list: (params) => api.get(`/inventory${qs(params)}`),
  lowStock: () => api.get('/inventory/low-stock'),
  get: (id) => api.get(`/inventory/${id}`),
  create: (body) => api.post('/inventory', body),
  update: (id, body) => api.put(`/inventory/${id}`, body),
  remove: (id) => api.delete(`/inventory/${id}`),
}

export const warehouseTxnService = {
  list: () => api.get('/warehouse-transactions'),
  get: (id) => api.get(`/warehouse-transactions/${id}`),
  create: (body) => api.post('/warehouse-transactions', body),
  update: (id, body) => api.put(`/warehouse-transactions/${id}`, body),
  remove: (id) => api.delete(`/warehouse-transactions/${id}`),
}

export const stockAdjustmentService = {
  list: () => api.get('/stock-adjustments'),
  get: (id) => api.get(`/stock-adjustments/${id}`),
  create: (body) => api.post('/stock-adjustments', body),
  update: (id, body) => api.put(`/stock-adjustments/${id}`, body),
  approve: (id) => api.post(`/stock-adjustments/${id}/approve`),
  reject: (id) => api.post(`/stock-adjustments/${id}/reject`),
  remove: (id) => api.delete(`/stock-adjustments/${id}`),
}

export const stockCountService = {
  list: () => api.get('/stock-counts'),
  get: (id) => api.get(`/stock-counts/${id}`),
  create: (body) => api.post('/stock-counts', body),
  update: (id, body) => api.put(`/stock-counts/${id}`, body),
  remove: (id) => api.delete(`/stock-counts/${id}`),
}

// ---- Sales service (MySQL) ----
export const saleService = {
  list: () => api.get('/sales'),
  get: (id) => api.get(`/sales/${id}`),
  create: (body) => api.post('/sales', body),
  remove: (id) => api.delete(`/sales/${id}`),
  getSePayConfig: () => api.get('/sales/sepay-config'),
  updateStatus: (id, status) => api.put(`/sales/${id}/status`, { status }),
  completeCash: (id) => api.put(`/sales/${id}/complete-cash`),
}

export const shiftService = {
  list: () => api.get('/shifts'),
  get: (id) => api.get(`/shifts/${id}`),
  create: (body) => api.post('/shifts', body),
  update: (id, body) => api.put(`/shifts/${id}`, body),
  remove: (id) => api.delete(`/shifts/${id}`),
}

export const customerService = {
  list: (params) => api.get(`/customers${qs(params)}`),
  get: (id) => api.get(`/customers/${id}`),
  create: (body) => api.post('/customers', body),
  update: (id, body) => api.put(`/customers/${id}`, body),
  remove: (id) => api.delete(`/customers/${id}`),
}

// ---- Supplier service (MySQL) ----
export const supplierService = {
  list: (params) => api.get(`/suppliers${qs(params)}`),
  get: (id) => api.get(`/suppliers/${id}`),
  create: (body) => api.post('/suppliers', body),
  update: (id, body) => api.put(`/suppliers/${id}`, body),
  remove: (id) => api.delete(`/suppliers/${id}`),
}

export const purchaseOrderService = {
  list: () => api.get('/purchase-orders'),
  get: (id) => api.get(`/purchase-orders/${id}`),
  create: (body) => api.post('/purchase-orders', body),
  update: (id, body) => api.put(`/purchase-orders/${id}`, body),
  remove: (id) => api.delete(`/purchase-orders/${id}`),
}

// ---- Reporting service (PostgreSQL) ----
export const reportService = {
  salesTrend: () => api.get('/reports/sales-trend'),
  categoryShare: () => api.get('/reports/category-share'),
  employeePerformance: () => api.get('/reports/employee-performance'),
  monthlyRevenue: () => api.get('/reports/monthly-revenue'),
  dashboard: () => api.get('/reports/dashboard'),
}

export const monitoringService = {
  services: () => api.get('/monitoring/services'),
  logs: () => api.get('/monitoring/logs'),
  addLog: (body) => api.post('/monitoring/logs', body),
}

// ---- User service (PostgreSQL) ----
export const userService = {
  list: (params) => api.get(`/users${qs(params)}`),
  get: (id) => api.get(`/users/${id}`),
  create: (body) => api.post('/users', body),
  update: (id, body) => api.put(`/users/${id}`, body),
  remove: (id) => api.delete(`/users/${id}`),
}

export const employeeService = {
  list: () => api.get('/employees'),
  get: (id) => api.get(`/employees/${id}`),
  create: (body) => api.post('/employees', body),
  update: (id, body) => api.put(`/employees/${id}`, body),
  remove: (id) => api.delete(`/employees/${id}`),
}

export const attendanceService = {
  list: () => api.get('/attendance'),
  get: (id) => api.get(`/attendance/${id}`),
  create: (body) => api.post('/attendance', body),
  update: (id, body) => api.put(`/attendance/${id}`, body),
  remove: (id) => api.delete(`/attendance/${id}`),
}

// ---- Notification service (PostgreSQL) ----
export const notificationService = {
  list: () => api.get('/notifications'),
  unreadCount: () => api.get('/notifications/unread-count'),
  create: (body) => api.post('/notifications', body),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  remove: (id) => api.delete(`/notifications/${id}`),
}

export const approvalRequestService = {
  list: () => api.get('/approval-requests'),
  get: (id) => api.get(`/approval-requests/${id}`),
  create: (body) => api.post('/approval-requests', body),
  update: (id, body) => api.put(`/approval-requests/${id}`, body),
  remove: (id) => api.delete(`/approval-requests/${id}`),
}

// Business policies are served at /api/policies (see api-gateway routes).
export const policyService = {
  list: () => api.get('/policies'),
  get: (id) => api.get(`/policies/${id}`),
  create: (body) => api.post('/policies', body),
  update: (id, body) => api.put(`/policies/${id}`, body),
  remove: (id) => api.delete(`/policies/${id}`),
}

// System settings are served at /api/settings.
export const settingService = {
  list: () => api.get('/settings'),
  get: (id) => api.get(`/settings/${id}`),
  create: (body) => api.post('/settings', body),
  update: (id, body) => api.put(`/settings/${id}`, body),
  remove: (id) => api.delete(`/settings/${id}`),
}

// Legacy no-op mock symbols kept only so existing pages' imports resolve.
// They are never invoked (withFallback no longer takes a fallback argument).
export * from './fallback.js'
