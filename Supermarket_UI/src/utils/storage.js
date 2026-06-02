// storage.js - localStorage utilities

export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  },
};

export const SESSION_KEYS = {
  USER: 'mss_user',
  TOKEN: 'mss_token',
  REFRESH: 'mss_refresh',
  THEME: 'mss_theme',
};
