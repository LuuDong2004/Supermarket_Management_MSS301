// configs/routes.js - Route definitions

export const ROUTES = {
  // Auth
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Dashboard
  DASHBOARD: '/dashboard',
  POS: '/dashboard/pos',

  // Products
  PRODUCTS: '/dashboard/products',
  PRODUCTS_ADD: '/dashboard/products/add',
  PRODUCTS_CATEGORIES: '/dashboard/products/categories',
  PRODUCTS_SUB_CATEGORIES: '/dashboard/products/sub-categories',
  PRODUCTS_BRANDS: '/dashboard/products/brands',
  PRODUCTS_UNITS: '/dashboard/products/units',
  PRODUCTS_VARIANT: '/dashboard/products/variant',
  PRODUCTS_WARRANTY: '/dashboard/products/warranty',
  PRODUCTS_BARCODE: '/dashboard/products/barcode',
  PRODUCTS_REVIEWS: '/dashboard/products/reviews',
  PRODUCTS_BULK_IMPORT: '/dashboard/products/bulk-import',
  PRODUCTS_BULK_EXPORT: '/dashboard/products/bulk-export',

  // Orders
  ORDERS: '/dashboard/orders',
  ORDERS_INVOICES: '/dashboard/orders/invoices',
  ORDERS_REFUND: '/dashboard/orders/refund',

  // Customers
  CUSTOMERS: '/dashboard/customers',
  CUSTOMERS_ADD: '/dashboard/customers/add',
  CUSTOMERS_WALLET: '/dashboard/customers/wallet',
  CUSTOMERS_ACTIVITY: '/dashboard/customers/activity',

  // Inventory
  INVENTORY_STOCK_LIST: '/dashboard/inventory/stock-list',
  INVENTORY_STOCK_IN: '/dashboard/inventory/stock-in',
  INVENTORY_STOCK_OUT: '/dashboard/inventory/stock-out',
  INVENTORY_STOCK_TRANSFER: '/dashboard/inventory/stock-transfer',
  INVENTORY_STOCK_ADJUSTMENT: '/dashboard/inventory/stock-adjustment',
  INVENTORY_ALERTS: '/dashboard/inventory/alerts',
  INVENTORY_WAREHOUSE: '/dashboard/inventory/warehouse',
  INVENTORY_BATCH: '/dashboard/inventory/batch-management',
  INVENTORY_LOST: '/dashboard/inventory/lost-items',
  INVENTORY_VALUATION: '/dashboard/inventory/valuation',

  // Suppliers
  SUPPLIERS: '/dashboard/suppliers',
  SUPPLIERS_ADD: '/dashboard/suppliers/add',
  SUPPLIERS_PAYMENTS: '/dashboard/suppliers/payments',
  SUPPLIERS_BALANCE: '/dashboard/suppliers/balance-reports',

  // Staff
  STAFF: '/dashboard/staff',
  STAFF_ADD: '/dashboard/staff/add',
  STAFF_ATTENDANCE: '/dashboard/staff/attendance',
  STAFF_PAYROLL: '/dashboard/staff/payroll',
  STAFF_SCHEDULE: '/dashboard/staff/schedule',
  STAFF_HOLIDAYS: '/dashboard/staff/holidays',
  STAFF_ROLE_PERMISSION: '/dashboard/staff/role-permission',

  // Purchase
  PURCHASE: '/dashboard/purchase',
  PURCHASE_ADD: '/dashboard/purchase/add',
  PURCHASE_PAYMENTS: '/dashboard/purchase/payments',
  PURCHASE_RETURNS: '/dashboard/purchase/returns',

  // Accounts
  ACCOUNTS_BANK: '/dashboard/accounts/bank-accounts',
  ACCOUNTS_EXPENSES: '/dashboard/accounts/expenses',
  ACCOUNTS_INCOME: '/dashboard/accounts/income',
  ACCOUNTS_MONEY_TRANSFER: '/dashboard/accounts/money-transfer',

  // Reports
  REPORTS_SALES: '/dashboard/reports/sales',
  REPORTS_PURCHASES: '/dashboard/reports/purchases',
  REPORTS_PRODUCTS: '/dashboard/reports/products',
  REPORTS_EXPENSES: '/dashboard/reports/expenses',
  REPORTS_FINANCE: '/dashboard/reports/finance',
  REPORTS_SUPPLIER: '/dashboard/reports/supplier',

  // Settings
  SETTINGS_GENERAL: '/dashboard/settings/general',
  SETTINGS_POS: '/dashboard/settings/pos',
  SETTINGS_TAX: '/dashboard/settings/tax',
  SETTINGS_CURRENCIES: '/dashboard/settings/currencies',
  SETTINGS_COUPONS: '/dashboard/settings/coupons',
  SETTINGS_PAYMENT_GATEWAY: '/dashboard/settings/payment-gateway',
  SETTINGS_INVOICES: '/dashboard/settings/invoices',
  SETTINGS_MANAGER: '/dashboard/settings/manager',

  // Multi-store
  MULTI_STORE: '/dashboard/multi-store',
  MULTI_STORE_ADD: '/dashboard/multi-store/add',

  // Account Details
  ACCOUNT_SETTINGS: '/dashboard/account/settings',
  ACCOUNT_SECURITY: '/dashboard/account/security',
  ACCOUNT_BILLING: '/dashboard/account/billing',
  ACCOUNT_NOTIFICATION: '/dashboard/account/notification',
  ACCOUNT_STATEMENTS: '/dashboard/account/statements',
  ACCOUNT_LOGS: '/dashboard/account/logs',

  // Utility Apps
  APPS_CALENDAR: '/dashboard/apps/calendar',
  APPS_CHAT: '/dashboard/apps/chat',
  APPS_MAILBOX: '/dashboard/apps/mailbox',

  // Pages
  USER_PROFILE: '/dashboard/profile',
  PAGE_404: '/404',
  PAGE_500: '/500',
};
