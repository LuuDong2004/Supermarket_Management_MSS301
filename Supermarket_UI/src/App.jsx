import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell.jsx'
import { ProtectedRoute } from './routes/ProtectedRoute.jsx'
import { ROUTE_ROLES } from './routes/nav.js'

import Login from './pages/auth/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import { Forbidden, NotFound } from './pages/Errors.jsx'

// POS (3.8, 3.9)
import ProcessSale from './pages/pos/ProcessSale.jsx'
import Returns from './pages/pos/Returns.jsx'
import Shift from './pages/pos/Shift.jsx'
import Members from './pages/pos/Members.jsx'
import Loyalty from './pages/pos/Loyalty.jsx'
import Promotions from './pages/pos/Promotions.jsx'

// Warehouse (3.6, 3.7)
import PurchaseOrders from './pages/warehouse/PurchaseOrders.jsx'
import Transactions from './pages/warehouse/Transactions.jsx'
import Monitor from './pages/warehouse/Monitor.jsx'
import WarehouseReports from './pages/warehouse/Reports.jsx'
import Receive from './pages/warehouse/Receive.jsx'
import Inventory from './pages/warehouse/Inventory.jsx'
import StockCount from './pages/warehouse/StockCount.jsx'
import Adjustments from './pages/warehouse/Adjustments.jsx'
import ApprovalStatus from './pages/warehouse/ApprovalStatus.jsx'
import Products from './pages/warehouse/Products.jsx'
import ProductForm from './pages/warehouse/ProductForm.jsx'
import GoodsReceipts from './pages/warehouse/GoodsReceipts.jsx'
import BarcodePrint from './pages/warehouse/BarcodePrint.jsx'

// HR (3.5)
import Employees from './pages/hr/Employees.jsx'
import EmployeeForm from './pages/hr/EmployeeForm.jsx'
import EmployeeDetail from './pages/hr/EmployeeDetail.jsx'
import StaffShifts from './pages/hr/StaffShifts.jsx'
import Attendance from './pages/hr/Attendance.jsx'
import Timesheet from './pages/hr/Timesheet.jsx'
import Performance from './pages/hr/Performance.jsx'

// Supplier portal (3.11)
import MyPurchaseOrders from './pages/supplier/MyPurchaseOrders.jsx'
import Catalog from './pages/supplier/Catalog.jsx'
import SupplierProfile from './pages/supplier/Profile.jsx'

// Admin (3.4)
import Users from './pages/admin/Users.jsx'
import UserForm from './pages/admin/UserForm.jsx'
import ApprovalRequests from './pages/admin/ApprovalRequests.jsx'
import Monitoring from './pages/admin/Monitoring.jsx'
import Permissions from './pages/admin/Permissions.jsx'
import SecurityAlerts from './pages/admin/SecurityAlerts.jsx'
import Notifications from './pages/admin/Notifications.jsx'

// CEO (3.3)
import CeoReports from './pages/ceo/Reports.jsx'
import CeoApprovals from './pages/ceo/Approvals.jsx'
import Policies from './pages/ceo/Policies.jsx'
import PromotionApprovals from './pages/ceo/PromotionApprovals.jsx'
import FinancialReport from './pages/ceo/FinancialReport.jsx'
import OperationalReport from './pages/ceo/OperationalReport.jsx'
import StrategicDecisions from './pages/ceo/StrategicDecisions.jsx'

// Reports (3.10)
import SalesReport from './pages/reports/SalesReport.jsx'
import InventoryReport from './pages/reports/InventoryReport.jsx'
import EmployeeReport from './pages/reports/EmployeeReport.jsx'

// Settings (3.11)
import SystemSettings from './pages/settings/SystemSettings.jsx'
import BusinessRules from './pages/settings/BusinessRules.jsx'

const G = (path, el) => (
  <ProtectedRoute roles={ROUTE_ROLES[path]}>{el}</ProtectedRoute>
)

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

      <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="forbidden" element={<Forbidden />} />

        {/* POS */}
        <Route path="pos/sale" element={G('/app/pos/sale', <ProcessSale />)} />
        <Route path="pos/returns" element={G('/app/pos/returns', <Returns />)} />
        <Route path="pos/shift" element={G('/app/pos/shift', <Shift />)} />
        <Route path="pos/members" element={G('/app/pos/members', <Members />)} />
        <Route path="pos/loyalty" element={G('/app/pos/loyalty', <Loyalty />)} />
        <Route path="pos/promotions" element={G('/app/pos/promotions', <Promotions />)} />

        {/* Warehouse */}
        <Route path="warehouse/purchase-orders" element={G('/app/warehouse/purchase-orders', <PurchaseOrders />)} />
        <Route path="warehouse/transactions" element={G('/app/warehouse/transactions', <Transactions />)} />
        <Route path="warehouse/monitor" element={G('/app/warehouse/monitor', <Monitor />)} />
        <Route path="warehouse/reports" element={G('/app/warehouse/reports', <WarehouseReports />)} />
        <Route path="warehouse/receive" element={G('/app/warehouse/receive', <Receive />)} />
        <Route path="warehouse/inventory" element={G('/app/warehouse/inventory', <Inventory />)} />
        <Route path="warehouse/stock-count" element={G('/app/warehouse/stock-count', <StockCount />)} />
        <Route path="warehouse/adjustments" element={G('/app/warehouse/adjustments', <Adjustments />)} />
        <Route path="warehouse/approval-status" element={G('/app/warehouse/approval-status', <ApprovalStatus />)} />
        <Route path="warehouse/products" element={G('/app/warehouse/products', <Products />)} />
        <Route path="warehouse/products/new" element={G('/app/warehouse/products', <ProductForm />)} />
        <Route path="warehouse/products/:id/edit" element={G('/app/warehouse/products', <ProductForm />)} />
        <Route path="warehouse/goods-receipts" element={G('/app/warehouse/goods-receipts', <GoodsReceipts />)} />
        <Route path="warehouse/barcode" element={G('/app/warehouse/barcode', <BarcodePrint />)} />

        {/* HR */}
        <Route path="hr/employees" element={G('/app/hr/employees', <Employees />)} />
        <Route path="hr/employees/new" element={G('/app/hr/employees', <EmployeeForm />)} />
        <Route path="hr/employees/:id" element={G('/app/hr/employees', <EmployeeDetail />)} />
        <Route path="hr/employees/:id/edit" element={G('/app/hr/employees', <EmployeeForm />)} />
        <Route path="hr/shifts" element={G('/app/hr/shifts', <StaffShifts />)} />
        <Route path="hr/attendance" element={G('/app/hr/attendance', <Attendance />)} />
        <Route path="hr/timesheet" element={G('/app/hr/timesheet', <Timesheet />)} />
        <Route path="hr/performance" element={G('/app/hr/performance', <Performance />)} />
        <Route path="supplier/orders" element={G('/app/supplier/orders', <MyPurchaseOrders />)} />
        <Route path="supplier/catalog" element={G('/app/supplier/catalog', <Catalog />)} />
        <Route path="supplier/profile" element={G('/app/supplier/profile', <SupplierProfile />)} />

        {/* Admin */}
        <Route path="admin/users" element={G('/app/admin/users', <Users />)} />
        <Route path="admin/users/new" element={G('/app/admin/users', <UserForm />)} />
        <Route path="admin/users/:id/edit" element={G('/app/admin/users', <UserForm />)} />
        <Route path="admin/approval-requests" element={G('/app/admin/approval-requests', <ApprovalRequests />)} />
        <Route path="admin/monitoring" element={G('/app/admin/monitoring', <Monitoring />)} />
        <Route path="admin/permissions" element={G('/app/admin/permissions', <Permissions />)} />
        <Route path="admin/security-alerts" element={G('/app/admin/security-alerts', <SecurityAlerts />)} />
        <Route path="admin/notifications" element={G('/app/admin/notifications', <Notifications />)} />

        {/* CEO */}
        <Route path="ceo/reports" element={G('/app/ceo/reports', <CeoReports />)} />
        <Route path="ceo/approvals" element={G('/app/ceo/approvals', <CeoApprovals />)} />
        <Route path="ceo/policies" element={G('/app/ceo/policies', <Policies />)} />
        <Route path="ceo/promotions" element={G('/app/ceo/promotions', <PromotionApprovals />)} />
        <Route path="ceo/financial" element={G('/app/ceo/financial', <FinancialReport />)} />
        <Route path="ceo/operational" element={G('/app/ceo/operational', <OperationalReport />)} />
        <Route path="ceo/decisions" element={G('/app/ceo/decisions', <StrategicDecisions />)} />

        {/* Reports */}
        <Route path="reports/sales" element={G('/app/reports/sales', <SalesReport />)} />
        <Route path="reports/inventory" element={G('/app/reports/inventory', <InventoryReport />)} />
        <Route path="reports/employees" element={G('/app/reports/employees', <EmployeeReport />)} />

        {/* Settings */}
        <Route path="settings/system" element={G('/app/settings/system', <SystemSettings />)} />
        <Route path="settings/rules" element={G('/app/settings/rules', <BusinessRules />)} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
