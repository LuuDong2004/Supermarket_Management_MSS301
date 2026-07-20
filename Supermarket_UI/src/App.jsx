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
import ProcessPayment from './pages/pos/ProcessPayment.jsx'
import Returns from './pages/pos/Returns.jsx'
import Shift from './pages/pos/Shift.jsx'
import Members from './pages/pos/Members.jsx'
import MemberDetail from './pages/pos/MemberDetail.jsx'
import ReturnForm from './pages/pos/ReturnForm.jsx'
import Loyalty from './pages/pos/Loyalty.jsx'
import Promotions from './pages/pos/Promotions.jsx'

// Warehouse (3.6, 3.7)
import PurchaseOrders from './pages/warehouse/PurchaseOrders.jsx'
import PurchaseOrderForm from './pages/warehouse/PurchaseOrderForm.jsx'
import PurchaseOrderDetail from './pages/warehouse/PurchaseOrderDetail.jsx'
import Transactions from './pages/warehouse/Transactions.jsx'
import Monitor from './pages/warehouse/Monitor.jsx'
import WarehouseReports from './pages/warehouse/Reports.jsx'
import Receive from './pages/warehouse/Receive.jsx'
import Inventory from './pages/warehouse/Inventory.jsx'
import StockCount from './pages/warehouse/StockCount.jsx'
import StockCountForm from './pages/warehouse/StockCountForm.jsx'
import Adjustments from './pages/warehouse/Adjustments.jsx'
import AdjustmentForm from './pages/warehouse/AdjustmentForm.jsx'
import ApprovalStatus from './pages/warehouse/ApprovalStatus.jsx'
import Products from './pages/warehouse/Products.jsx'
import ProductForm from './pages/warehouse/ProductForm.jsx'
import GoodsReceipts from './pages/warehouse/GoodsReceipts.jsx'
import GoodsReceiptForm from './pages/warehouse/GoodsReceiptForm.jsx'
import GoodsReceiptDetail from './pages/warehouse/GoodsReceiptDetail.jsx'
import BarcodePrint from './pages/warehouse/BarcodePrint.jsx'
import Suppliers from './pages/warehouse/Suppliers.jsx'

// HR (3.5)
import Employees from './pages/hr/Employees.jsx'
import EmployeeForm from './pages/hr/EmployeeForm.jsx'
import EmployeeDetail from './pages/hr/EmployeeDetail.jsx'
import StaffShifts from './pages/hr/StaffShifts.jsx'
import ShiftAssignForm from './pages/hr/ShiftAssignForm.jsx'
import Attendance from './pages/hr/Attendance.jsx'
import AttendanceForm from './pages/hr/AttendanceForm.jsx'
import Timesheet from './pages/hr/Timesheet.jsx'
import Performance from './pages/hr/Performance.jsx'

// Admin (3.4)
import Users from './pages/admin/Users.jsx'
import UserForm from './pages/admin/UserForm.jsx'
import ApprovalRequests from './pages/admin/ApprovalRequests.jsx'
import ApprovalRequestDetail from './pages/admin/ApprovalRequestDetail.jsx'
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
import StrategicDecisionForm from './pages/ceo/StrategicDecisionForm.jsx'

// Reports (3.10)
import SalesReport from './pages/reports/SalesReport.jsx'
import InventoryReport from './pages/reports/InventoryReport.jsx'
import EmployeeReport from './pages/reports/EmployeeReport.jsx'

// Settings (3.11)
import SystemSettings from './pages/settings/SystemSettings.jsx'
import BusinessRules from './pages/settings/BusinessRules.jsx'
import BusinessRuleForm from './pages/settings/BusinessRuleForm.jsx'
import ReferenceScreen from './pages/ReferenceScreen.jsx'

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
        <Route path="pos/sale" element={G('/app/pos/sale', <ReferenceScreen />)} />
        <Route path="pos/payment" element={G('/app/pos/payment', <ReferenceScreen />)} />
        <Route path="pos/returns" element={G('/app/pos/returns', <Returns />)} />
        <Route path="pos/returns/new" element={G('/app/pos/returns', <ReturnForm />)} />
        <Route path="pos/shift" element={G('/app/pos/shift', <ReferenceScreen />)} />
        <Route path="pos/members" element={G('/app/pos/members', <ReferenceScreen />)} />
        <Route path="pos/members/:id" element={G('/app/pos/members', <ReferenceScreen />)} />
        <Route path="pos/loyalty" element={G('/app/pos/loyalty', <ReferenceScreen />)} />
        <Route path="pos/promotions" element={G('/app/pos/promotions', <ReferenceScreen />)} />

        {/* Warehouse */}
        <Route path="warehouse/purchase-orders" element={G('/app/warehouse/purchase-orders', <ReferenceScreen />)} />
        <Route path="warehouse/purchase-orders/new" element={G('/app/warehouse/purchase-orders', <ReferenceScreen />)} />
        <Route path="warehouse/purchase-orders/:id" element={G('/app/warehouse/purchase-orders', <ReferenceScreen />)} />
        <Route path="warehouse/transactions" element={G('/app/warehouse/transactions', <ReferenceScreen />)} />
        <Route path="warehouse/monitor" element={G('/app/warehouse/monitor', <ReferenceScreen />)} />
        <Route path="warehouse/reports" element={G('/app/warehouse/reports', <ReferenceScreen />)} />
        <Route path="warehouse/receive" element={G('/app/warehouse/receive', <ReferenceScreen />)} />
        <Route path="warehouse/inventory" element={G('/app/warehouse/inventory', <ReferenceScreen />)} />
        <Route path="warehouse/stock-count" element={G('/app/warehouse/stock-count', <ReferenceScreen />)} />
        <Route path="warehouse/stock-count/new" element={G('/app/warehouse/stock-count', <ReferenceScreen />)} />
        <Route path="warehouse/stock-count/:id/edit" element={G('/app/warehouse/stock-count', <ReferenceScreen />)} />
        <Route path="warehouse/adjustments" element={G('/app/warehouse/adjustments', <ReferenceScreen />)} />
        <Route path="warehouse/adjustments/new" element={G('/app/warehouse/adjustments', <ReferenceScreen />)} />
        <Route path="warehouse/approval-status" element={G('/app/warehouse/approval-status', <ReferenceScreen />)} />
        <Route path="warehouse/products" element={G('/app/warehouse/products', <Products />)} />
        <Route path="warehouse/products/new" element={G('/app/warehouse/products', <ProductForm />)} />
        <Route path="warehouse/products/:id/edit" element={G('/app/warehouse/products', <ProductForm />)} />
        <Route path="warehouse/suppliers" element={G('/app/warehouse/suppliers', <Suppliers />)} />
        <Route path="warehouse/goods-receipts" element={G('/app/warehouse/goods-receipts', <GoodsReceipts />)} />
        <Route path="warehouse/goods-receipts/new" element={G('/app/warehouse/goods-receipts', <GoodsReceiptForm />)} />
        <Route path="warehouse/goods-receipts/:id" element={G('/app/warehouse/goods-receipts', <GoodsReceiptDetail />)} />
        <Route path="warehouse/barcode" element={G('/app/warehouse/barcode', <BarcodePrint />)} />

        {/* HR */}
        <Route path="hr/employees" element={G('/app/hr/employees', <ReferenceScreen />)} />
        <Route path="hr/employees/new" element={G('/app/hr/employees', <ReferenceScreen />)} />
        <Route path="hr/employees/:id" element={G('/app/hr/employees', <ReferenceScreen />)} />
        <Route path="hr/employees/:id/edit" element={G('/app/hr/employees', <ReferenceScreen />)} />
        <Route path="hr/shifts" element={G('/app/hr/shifts', <StaffShifts />)} />
        <Route path="hr/shifts/new" element={G('/app/hr/shifts', <ShiftAssignForm />)} />
        <Route path="hr/attendance" element={G('/app/hr/attendance', <ReferenceScreen />)} />
        <Route path="hr/attendance/new" element={G('/app/hr/attendance', <ReferenceScreen />)} />
        <Route path="hr/attendance/:id/edit" element={G('/app/hr/attendance', <ReferenceScreen />)} />
        <Route path="hr/timesheet" element={G('/app/hr/timesheet', <Timesheet />)} />
        <Route path="hr/performance" element={G('/app/hr/performance', <ReferenceScreen />)} />

        {/* Admin */}
        <Route path="admin/users" element={G('/app/admin/users', <ReferenceScreen />)} />
        <Route path="admin/users/new" element={G('/app/admin/users', <ReferenceScreen />)} />
        <Route path="admin/users/:id/edit" element={G('/app/admin/users', <ReferenceScreen />)} />
        <Route path="admin/approval-requests" element={G('/app/admin/approval-requests', <ReferenceScreen />)} />
        <Route path="admin/approval-requests/:id" element={G('/app/admin/approval-requests', <ReferenceScreen />)} />
        <Route path="admin/monitoring" element={G('/app/admin/monitoring', <ReferenceScreen />)} />
        <Route path="admin/permissions" element={G('/app/admin/permissions', <Permissions />)} />
        <Route path="admin/security-alerts" element={G('/app/admin/security-alerts', <SecurityAlerts />)} />
        <Route path="admin/notifications" element={G('/app/admin/notifications', <Notifications />)} />

        {/* CEO */}
        <Route path="ceo/reports" element={G('/app/ceo/reports', <ReferenceScreen />)} />
        <Route path="ceo/approvals" element={G('/app/ceo/approvals', <ReferenceScreen />)} />
        <Route path="ceo/policies" element={G('/app/ceo/policies', <ReferenceScreen />)} />
        <Route path="ceo/promotions" element={G('/app/ceo/promotions', <PromotionApprovals />)} />
        <Route path="ceo/financial" element={G('/app/ceo/financial', <FinancialReport />)} />
        <Route path="ceo/operational" element={G('/app/ceo/operational', <OperationalReport />)} />
        <Route path="ceo/decisions" element={G('/app/ceo/decisions', <StrategicDecisions />)} />
        <Route path="ceo/decisions/new" element={G('/app/ceo/decisions', <StrategicDecisionForm />)} />
        <Route path="ceo/decisions/:id/edit" element={G('/app/ceo/decisions', <StrategicDecisionForm />)} />

        {/* Reports */}
        <Route path="reports/sales" element={G('/app/reports/sales', <ReferenceScreen />)} />
        <Route path="reports/inventory" element={G('/app/reports/inventory', <ReferenceScreen />)} />
        <Route path="reports/employees" element={G('/app/reports/employees', <ReferenceScreen />)} />

        {/* Settings */}
        <Route path="settings/system" element={G('/app/settings/system', <ReferenceScreen />)} />
        <Route path="settings/rules" element={G('/app/settings/rules', <ReferenceScreen />)} />
        <Route path="settings/rules/new" element={G('/app/settings/rules', <ReferenceScreen />)} />
        <Route path="settings/rules/:id/edit" element={G('/app/settings/rules', <ReferenceScreen />)} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
