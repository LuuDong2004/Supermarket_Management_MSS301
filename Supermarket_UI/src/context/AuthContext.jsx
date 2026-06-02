// context/AuthContext.jsx
// Đăng nhập THẬT qua API Gateway → auth-service → user-service.
import { createContext, useState, useCallback } from 'react';
import { storage, SESSION_KEYS } from '../utils/storage';
import { authApi, usersApi } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(SESSION_KEYS.USER));
  const [token, setToken] = useState(() => storage.get(SESSION_KEYS.TOKEN));
  const [loading, setLoading] = useState(false);

  /**
   * login(username, password)
   * 1. POST /api/auth/login  → nhận accessToken + refreshToken
   * 2. GET  /api/users/me    → nhận hồ sơ người dùng (chứng minh token chạy qua gateway)
   */
  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      const auth = res?.data;
      if (!auth?.accessToken) {
        return { success: false, message: res?.message || 'Đăng nhập thất bại' };
      }

      // Lưu token trước để request /users/me được đính kèm Bearer
      storage.set(SESSION_KEYS.TOKEN, auth.accessToken);
      storage.set(SESSION_KEYS.REFRESH, auth.refreshToken);
      setToken(auth.accessToken);

      // Lấy hồ sơ đầy đủ; nếu lỗi vẫn dùng dữ liệu trả về từ login
      let profile;
      try {
        profile = (await usersApi.me())?.data;
      } catch {
        profile = null;
      }

      const userData = profile || {
        id: auth.userId,
        username: auth.username,
        role: auth.role,
      };
      // Topbar hiển thị theo user.email → fallback về username nếu chưa có
      if (!userData.email) userData.email = userData.username;

      setUser(userData);
      storage.set(SESSION_KEYS.USER, userData);
      return { success: true, user: userData };
    } catch (err) {
      // login thất bại → dọn token rác
      storage.remove(SESSION_KEYS.TOKEN);
      storage.remove(SESSION_KEYS.REFRESH);
      setToken(null);
      return { success: false, message: err.message || 'Đăng nhập thất bại' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = storage.get(SESSION_KEYS.REFRESH);
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // bỏ qua lỗi mạng khi logout — vẫn xoá phiên ở client
    }
    setUser(null);
    setToken(null);
    storage.remove(SESSION_KEYS.USER);
    storage.remove(SESSION_KEYS.TOKEN);
    storage.remove(SESSION_KEYS.REFRESH);
  }, []);

  const isAuthenticated = !!user && !!token;
  // Backend trả role dạng ROLE_ADMIN / ROLE_CEO / ROLE_CASHIER ...
  const role = user?.role || '';
  const isAdmin = role === 'ROLE_ADMIN' || role === 'ROLE_CEO';

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, isAdmin, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
