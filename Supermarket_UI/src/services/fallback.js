// Demo/mock data has been removed — the app now uses backend data exclusively.
// These no-op stubs remain only so pages that still import the old `mockX`
// symbols keep resolving; `withFallback` no longer calls them, so they are dead.
// Safe to delete once every page drops its unused mock import.

const empty = () => []

export const mockProducts = empty
export const mockCategories = empty
export const mockPromotions = empty
export const mockVouchers = empty
export const mockInventory = empty
export const mockWarehouseTxns = empty
export const mockStockAdjustments = empty
export const mockStockCounts = empty
export const mockSales = empty
export const mockShifts = empty
export const mockCustomers = empty
export const mockSuppliers = empty
export const mockPurchaseOrders = empty
export const mockEmployees = empty
export const mockAttendance = empty
export const mockUsers = empty
export const mockApprovalRequests = empty
export const mockPolicies = empty
export const mockSettings = empty
export const mockNotifications = empty
export const mockSalesTrend = empty
export const mockCategoryShare = empty
export const mockEmployeePerformance = empty
export const mockMonthlyRevenue = empty
export const mockServices = empty
export const mockSystemLogs = empty
export const mockDashboard = () => ({ salesTrend: [], categoryShare: [], monthlyRevenue: [] })
