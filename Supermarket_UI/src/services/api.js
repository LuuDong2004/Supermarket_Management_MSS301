// services/api.js - API layer (gọi Backend qua API Gateway :8080)
//
// Mọi response từ backend đều bọc trong envelope ApiResponse:
//   { success, message, data, timestamp }
// Hàm request() trả về NGUYÊN envelope; nơi gọi tự lấy `.data` khi cần.

import { storage, SESSION_KEYS } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Generic fetch wrapper — tự đính kèm Bearer access token nếu có.
 */
async function request(endpoint, options = {}) {
  const token = storage.get(SESSION_KEYS.TOKEN);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // 204 No Content hoặc body rỗng
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  return body;
}

// HTTP methods (trả về envelope ApiResponse)
export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

// ----------------------------------------------------------------------------
// Auth API  →  auth-service (qua gateway /api/auth/**)
// ----------------------------------------------------------------------------
export const authApi = {
  // body: { username, password } → data: { accessToken, refreshToken, role, ... }
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
};

// ----------------------------------------------------------------------------
// Users API  →  user-service (qua gateway /api/users/**)
// ----------------------------------------------------------------------------
export const usersApi = {
  me: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/me/password', data),
  getAll: (params = {}) => api.get(`/users?${new URLSearchParams(params)}`),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ----------------------------------------------------------------------------
// Các service nghiệp vụ dưới đây CHƯA được triển khai ở backend (reserved).
// Nhóm sẽ bổ sung product/inventory/sales/supplier/reporting-service rồi
// thêm route tương ứng ở api-gateway. Giữ sẵn client để dễ ráp nối.
// ----------------------------------------------------------------------------

// Products API (reserved)
export const productsApi = {
  getAll: (params = {}) => api.get(`/products?${new URLSearchParams(params)}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Orders / Sales API (reserved)
export const ordersApi = {
  getAll: (params = {}) => api.get(`/orders?${new URLSearchParams(params)}`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
};

// Customers API (reserved)
export const customersApi = {
  getAll: (params = {}) => api.get(`/customers?${new URLSearchParams(params)}`),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Inventory API (reserved)
export const inventoryApi = {
  getStockList: (params = {}) => api.get(`/inventory/stock?${new URLSearchParams(params)}`),
  stockIn: (data) => api.post('/inventory/stock-in', data),
  stockOut: (data) => api.post('/inventory/stock-out', data),
};

// Suppliers API (reserved)
export const suppliersApi = {
  getAll: (params = {}) => api.get(`/suppliers?${new URLSearchParams(params)}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

// Reports API (reserved)
export const reportsApi = {
  getSales: (params = {}) => api.get(`/reports/sales?${new URLSearchParams(params)}`),
  getPurchases: (params = {}) => api.get(`/reports/purchases?${new URLSearchParams(params)}`),
  getFinance: (params = {}) => api.get(`/reports/finance?${new URLSearchParams(params)}`),
};
