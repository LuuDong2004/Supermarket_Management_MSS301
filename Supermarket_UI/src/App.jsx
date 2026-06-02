// App.jsx - Main Router
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import SignInPage from './pages/Auth/SignInPage';
import SignUpPage from './pages/Auth/SignUpPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';

// Dashboard Pages
import DashboardPage from './pages/Dashboard/DashboardPage';
import PosPage from './pages/Dashboard/PosPage';

// Product Pages
import ProductListPage from './pages/Dashboard/Products/ProductListPage';
import ProductAddPage from './pages/Dashboard/Products/ProductAddPage';
import ProductCategoriesPage from './pages/Dashboard/Products/ProductCategoriesPage';
import ProductSubCategoriesPage from './pages/Dashboard/Products/ProductSubCategoriesPage';
import ProductBrandsPage from './pages/Dashboard/Products/ProductBrandsPage';
import ProductUnitsPage from './pages/Dashboard/Products/ProductUnitsPage';
import ProductVariantPage from './pages/Dashboard/Products/ProductVariantPage';
import ProductWarrantyPage from './pages/Dashboard/Products/ProductWarrantyPage';
import ProductBarcodePage from './pages/Dashboard/Products/ProductBarcodePage';
import ProductReviewsPage from './pages/Dashboard/Products/ProductReviewsPage';
import ProductBulkImportPage from './pages/Dashboard/Products/ProductBulkImportPage';
import ProductBulkExportPage from './pages/Dashboard/Products/ProductBulkExportPage';

// Order Pages
import OrderListPage from './pages/Dashboard/Orders/OrderListPage';
import InvoicesPage from './pages/Dashboard/Orders/InvoicesPage';
import RefundPage from './pages/Dashboard/Orders/RefundPage';

// Customer Pages
import CustomerListPage from './pages/Dashboard/Customers/CustomerListPage';
import CustomerAddPage from './pages/Dashboard/Customers/CustomerAddPage';
import CustomerWalletPage from './pages/Dashboard/Customers/CustomerWalletPage';
import CustomerActivityPage from './pages/Dashboard/Customers/CustomerActivityPage';

// Inventory Pages
import StockListPage from './pages/Dashboard/Inventory/StockListPage';
import StockInPage from './pages/Dashboard/Inventory/StockInPage';
import StockOutPage from './pages/Dashboard/Inventory/StockOutPage';
import StockTransferPage from './pages/Dashboard/Inventory/StockTransferPage';
import StockAdjustmentPage from './pages/Dashboard/Inventory/StockAdjustmentPage';
import InventoryAlertsPage from './pages/Dashboard/Inventory/InventoryAlertsPage';
import WarehousePage from './pages/Dashboard/Inventory/WarehousePage';
import BatchManagementPage from './pages/Dashboard/Inventory/BatchManagementPage';
import LostItemsPage from './pages/Dashboard/Inventory/LostItemsPage';
import InventoryValuationPage from './pages/Dashboard/Inventory/InventoryValuationPage';

// Supplier Pages
import SupplierListPage from './pages/Dashboard/Suppliers/SupplierListPage';
import SupplierAddPage from './pages/Dashboard/Suppliers/SupplierAddPage';
import SupplierPaymentsPage from './pages/Dashboard/Suppliers/SupplierPaymentsPage';
import SupplierBalanceReportsPage from './pages/Dashboard/Suppliers/SupplierBalanceReportsPage';

// Staff Pages
import StaffListPage from './pages/Dashboard/Staff/StaffListPage';
import StaffAddPage from './pages/Dashboard/Staff/StaffAddPage';
import StaffAttendancePage from './pages/Dashboard/Staff/StaffAttendancePage';
import StaffPayrollPage from './pages/Dashboard/Staff/StaffPayrollPage';
import StaffSchedulePage from './pages/Dashboard/Staff/StaffSchedulePage';
import StaffHolidaysPage from './pages/Dashboard/Staff/StaffHolidaysPage';
import StaffRolePermissionPage from './pages/Dashboard/Staff/StaffRolePermissionPage';

// Purchase Pages
import PurchaseListPage from './pages/Dashboard/Purchase/PurchaseListPage';
import PurchaseAddPage from './pages/Dashboard/Purchase/PurchaseAddPage';
import PurchasePaymentsPage from './pages/Dashboard/Purchase/PurchasePaymentsPage';
import PurchaseReturnsPage from './pages/Dashboard/Purchase/PurchaseReturnsPage';

// Accounts Pages
import BankAccountsPage from './pages/Dashboard/Accounts/BankAccountsPage';
import ExpensesPage from './pages/Dashboard/Accounts/ExpensesPage';
import IncomePage from './pages/Dashboard/Accounts/IncomePage';
import MoneyTransferPage from './pages/Dashboard/Accounts/MoneyTransferPage';

// Reports Pages
import SalesReportPage from './pages/Dashboard/Reports/SalesReportPage';
import PurchaseReportPage from './pages/Dashboard/Reports/PurchaseReportPage';
import ProductReportPage from './pages/Dashboard/Reports/ProductReportPage';
import ExpenseReportPage from './pages/Dashboard/Reports/ExpenseReportPage';
import FinanceReportPage from './pages/Dashboard/Reports/FinanceReportPage';
import SupplierReportPage from './pages/Dashboard/Reports/SupplierReportPage';

// Multi-store Pages
import StoreListPage from './pages/Dashboard/MultiStore/StoreListPage';
import StoreAddPage from './pages/Dashboard/MultiStore/StoreAddPage';

// Settings Pages
import GeneralSettingPage from './pages/Dashboard/Settings/GeneralSettingPage';
import PosSettingPage from './pages/Dashboard/Settings/PosSettingPage';
import TaxSettingPage from './pages/Dashboard/Settings/TaxSettingPage';
import CouponSettingPage from './pages/Dashboard/Settings/CouponSettingPage';
import PaymentGatewaySettingPage from './pages/Dashboard/Settings/PaymentGatewaySettingPage';
import CurrencySettingPage from './pages/Dashboard/Settings/CurrencySettingPage';
import InvoiceSettingPage from './pages/Dashboard/Settings/InvoiceSettingPage';
import ManagerSettingPage from './pages/Dashboard/Settings/ManagerSettingPage';
import ProfilePage from './pages/Dashboard/Profile/ProfilePage';

// Account Pages
import AccountLayout from './pages/Dashboard/Account/AccountLayout';
import AccountSettingsPage from './pages/Dashboard/Account/AccountSettingsPage';
import AccountSecurityPage from './pages/Dashboard/Account/AccountSecurityPage';
import AccountBillingPage from './pages/Dashboard/Account/AccountBillingPage';
import AccountNotificationPage from './pages/Dashboard/Account/AccountNotificationPage';
import AccountStatementsPage from './pages/Dashboard/Account/AccountStatementsPage';
import AccountLogsPage from './pages/Dashboard/Account/AccountLogsPage';

// Apps Pages
import CalendarPage from './pages/Dashboard/Apps/CalendarPage';
import ChatPage from './pages/Dashboard/Apps/ChatPage';
import MailboxPage from './pages/Dashboard/Apps/MailboxPage';

// Placeholder Pages
import PlaceholderPage from './pages/placeholder/PlaceholderPage';

// Error Pages
import NotFoundPage from './pages/Error/NotFoundPage';

// Routes Config
import { ROUTES } from './configs/routes';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LayoutProvider } from './context/LayoutContext';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LayoutProvider>
          <AuthProvider>
            <Routes>
            {/* Root - redirect to dashboard */}
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
              <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            </Route>

            {/* Dashboard Routes (Protected) */}
            <Route element={<DashboardLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />

              {/* POS */}
              <Route path={ROUTES.POS} element={<PosPage />} />

              {/* Products */}
              <Route path={ROUTES.PRODUCTS} element={<ProductListPage />} />
              <Route path={ROUTES.PRODUCTS_ADD} element={<ProductAddPage />} />
              <Route path={ROUTES.PRODUCTS_CATEGORIES} element={<ProductCategoriesPage />} />
              <Route path={ROUTES.PRODUCTS_SUB_CATEGORIES} element={<ProductSubCategoriesPage />} />
              <Route path={ROUTES.PRODUCTS_BRANDS} element={<ProductBrandsPage />} />
              <Route path={ROUTES.PRODUCTS_UNITS} element={<ProductUnitsPage />} />
              <Route path={ROUTES.PRODUCTS_VARIANT} element={<ProductVariantPage />} />
              <Route path={ROUTES.PRODUCTS_WARRANTY} element={<ProductWarrantyPage />} />
              <Route path={ROUTES.PRODUCTS_BARCODE} element={<ProductBarcodePage />} />
              <Route path={ROUTES.PRODUCTS_REVIEWS} element={<ProductReviewsPage />} />
              <Route path={ROUTES.PRODUCTS_BULK_IMPORT} element={<ProductBulkImportPage />} />
              <Route path={ROUTES.PRODUCTS_BULK_EXPORT} element={<ProductBulkExportPage />} />

              {/* Orders */}
              <Route path={ROUTES.ORDERS} element={<OrderListPage />} />
              <Route path={ROUTES.ORDERS_INVOICES} element={<InvoicesPage />} />
              <Route path={ROUTES.ORDERS_REFUND} element={<RefundPage />} />

              {/* Customers */}
              <Route path={ROUTES.CUSTOMERS} element={<CustomerListPage />} />
              <Route path={ROUTES.CUSTOMERS_ADD} element={<CustomerAddPage />} />
              <Route path={ROUTES.CUSTOMERS_WALLET} element={<CustomerWalletPage />} />
              <Route path={ROUTES.CUSTOMERS_ACTIVITY} element={<CustomerActivityPage />} />

              {/* Inventory */}
              <Route path={ROUTES.INVENTORY_STOCK_LIST} element={<StockListPage />} />
              <Route path={ROUTES.INVENTORY_STOCK_IN} element={<StockInPage />} />
              <Route path={ROUTES.INVENTORY_STOCK_OUT} element={<StockOutPage />} />
              <Route path={ROUTES.INVENTORY_STOCK_TRANSFER} element={<StockTransferPage />} />
              <Route path={ROUTES.INVENTORY_STOCK_ADJUSTMENT} element={<StockAdjustmentPage />} />
              <Route path={ROUTES.INVENTORY_ALERTS} element={<InventoryAlertsPage />} />
              <Route path={ROUTES.INVENTORY_WAREHOUSE} element={<WarehousePage />} />
              <Route path={ROUTES.INVENTORY_BATCH} element={<BatchManagementPage />} />
              <Route path={ROUTES.INVENTORY_LOST} element={<LostItemsPage />} />
              <Route path={ROUTES.INVENTORY_VALUATION} element={<InventoryValuationPage />} />

              {/* Suppliers */}
              <Route path={ROUTES.SUPPLIERS} element={<SupplierListPage />} />
              <Route path={ROUTES.SUPPLIERS_ADD} element={<SupplierAddPage />} />
              <Route path={ROUTES.SUPPLIERS_PAYMENTS} element={<SupplierPaymentsPage />} />
              <Route path={ROUTES.SUPPLIERS_BALANCE} element={<SupplierBalanceReportsPage />} />

              {/* Staff */}
              <Route path={ROUTES.STAFF} element={<StaffListPage />} />
              <Route path={ROUTES.STAFF_ADD} element={<StaffAddPage />} />
              <Route path={ROUTES.STAFF_ATTENDANCE} element={<StaffAttendancePage />} />
              <Route path={ROUTES.STAFF_PAYROLL} element={<StaffPayrollPage />} />
              <Route path={ROUTES.STAFF_SCHEDULE} element={<StaffSchedulePage />} />
              <Route path={ROUTES.STAFF_HOLIDAYS} element={<StaffHolidaysPage />} />
              <Route path={ROUTES.STAFF_ROLE_PERMISSION} element={<StaffRolePermissionPage />} />

              {/* Purchase */}
              <Route path={ROUTES.PURCHASE} element={<PurchaseListPage />} />
              <Route path={ROUTES.PURCHASE_ADD} element={<PurchaseAddPage />} />
              <Route path={ROUTES.PURCHASE_PAYMENTS} element={<PurchasePaymentsPage />} />
              <Route path={ROUTES.PURCHASE_RETURNS} element={<PurchaseReturnsPage />} />

              {/* Accounts */}
              <Route path={ROUTES.ACCOUNTS_BANK} element={<BankAccountsPage />} />
              <Route path={ROUTES.ACCOUNTS_EXPENSES} element={<ExpensesPage />} />
              <Route path={ROUTES.ACCOUNTS_INCOME} element={<IncomePage />} />
              <Route path={ROUTES.ACCOUNTS_MONEY_TRANSFER} element={<MoneyTransferPage />} />

              {/* Reports */}
              <Route path={ROUTES.REPORTS_SALES} element={<SalesReportPage />} />
              <Route path={ROUTES.REPORTS_PURCHASES} element={<PurchaseReportPage />} />
              <Route path={ROUTES.REPORTS_PRODUCTS} element={<ProductReportPage />} />
              <Route path={ROUTES.REPORTS_EXPENSES} element={<ExpenseReportPage />} />
              <Route path={ROUTES.REPORTS_FINANCE} element={<FinanceReportPage />} />
              <Route path={ROUTES.REPORTS_SUPPLIER} element={<SupplierReportPage />} />

              {/* Multi Store */}
              <Route path={ROUTES.MULTI_STORE} element={<StoreListPage />} />
              <Route path={ROUTES.MULTI_STORE_ADD} element={<StoreAddPage />} />

              {/* Settings */}
              <Route path={ROUTES.SETTINGS_GENERAL} element={<GeneralSettingPage />} />
              <Route path={ROUTES.SETTINGS_POS} element={<PosSettingPage />} />
              <Route path={ROUTES.SETTINGS_TAX} element={<TaxSettingPage />} />
              <Route path={ROUTES.SETTINGS_CURRENCIES} element={<CurrencySettingPage />} />
              <Route path={ROUTES.SETTINGS_COUPONS} element={<CouponSettingPage />} />
              <Route path={ROUTES.SETTINGS_PAYMENT_GATEWAY} element={<PaymentGatewaySettingPage />} />
              <Route path={ROUTES.SETTINGS_INVOICES} element={<InvoiceSettingPage />} />
              <Route path={ROUTES.SETTINGS_MANAGER} element={<ManagerSettingPage />} />

              {/* Profile */}
              <Route path={ROUTES.USER_PROFILE} element={<ProfilePage />} />

              {/* Account Details */}
              <Route element={<AccountLayout />}>
                <Route path={ROUTES.ACCOUNT_SETTINGS} element={<AccountSettingsPage />} />
                <Route path={ROUTES.ACCOUNT_SECURITY} element={<AccountSecurityPage />} />
                <Route path={ROUTES.ACCOUNT_BILLING} element={<AccountBillingPage />} />
                <Route path={ROUTES.ACCOUNT_NOTIFICATION} element={<AccountNotificationPage />} />
                <Route path={ROUTES.ACCOUNT_STATEMENTS} element={<AccountStatementsPage />} />
                <Route path={ROUTES.ACCOUNT_LOGS} element={<AccountLogsPage />} />
              </Route>

              {/* Utility Apps */}
              <Route path={ROUTES.APPS_CALENDAR} element={<CalendarPage />} />
              <Route path={ROUTES.APPS_CHAT} element={<ChatPage />} />
              <Route path={ROUTES.APPS_MAILBOX} element={<MailboxPage />} />
            </Route>

            {/* Error Pages */}
            <Route path={ROUTES.PAGE_404} element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </AuthProvider>
        </LayoutProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
