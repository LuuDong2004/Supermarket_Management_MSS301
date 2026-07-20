import { cn } from '../../lib/cn.js'
import { useLocation } from 'react-router-dom'

const REFERENCE_TITLES = {
  '/ceo/reports': 'View Management Reports',
  '/ceo/approvals': 'Process Approval Request',
  '/ceo/policies': 'Manage Business Policy',
  '/admin/users': 'Manage User Accounts',
  '/admin/approval-requests': 'Submit and View Approval Request',
  '/admin/monitoring': 'Monitor System Logs and Status',
  '/hr/employees': 'Manage Employee Profile and Work History',
  '/hr/attendance': 'Manage Attendance Records and Reports',
  '/hr/performance': 'Evaluate Performance and Recommend Reward or Salary',
  '/warehouse/purchase-orders': 'Manage Purchase Order',
  '/warehouse/transactions': 'Approve Warehouse Transaction',
  '/warehouse/monitor': 'Monitor Inventory, Low Stock, and Expiring Products',
  '/warehouse/reports': 'View Warehouse Reports',
  '/warehouse/receive': 'Receive Goods',
  '/warehouse/inventory': 'View Inventory Information',
  '/warehouse/stock-count': 'Conduct Stock Count',
  '/warehouse/adjustments': 'Submit Stock Adjustment Request',
  '/warehouse/approval-status': 'View Approval Status',
  '/pos/sale': 'Process Sale',
  '/pos/payment': 'Process Payment',
  '/pos/shift': 'Manage Cashier Shift',
  '/pos/members': 'Search or Register Customer Member',
  '/pos/loyalty': 'View and Redeem Loyalty Points',
  '/pos/promotions': 'Apply Promotion, Discount, or Voucher',
  '/reports/sales': 'Generate Sales and Business Performance Reports',
  '/reports/inventory': 'Generate Inventory and Warehouse Reports',
  '/reports/employees': 'Generate Employee Performance Reports',
  '/settings/system': 'Configure System Settings',
  '/settings/rules': 'Maintain Business Rules and Audit Traceability',
}

export function PageHeader({ title, subtitle, actions, breadcrumb }) {
  const { pathname } = useLocation()
  const referenceTitle = Object.entries(REFERENCE_TITLES).find(([path]) => pathname.includes(path))?.[1]
  return (
    <div className="sms-page-header mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {breadcrumb && <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">{breadcrumb}</p>}
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{referenceTitle || title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

// Horizontal filter bar wrapper used on list screens.
// Children (Field, button groups...) share one row: flex-basis is forced so the
// w-full on Field does not push each control onto its own line; they wrap only
// when the screen is too narrow.
export function FilterBar({ children, className }) {
  return (
    <div
      className={cn(
        'sms-filter-bar mb-5 flex flex-wrap items-end gap-3 rounded-none border border-slate-900 bg-white p-3 shadow-none',
        // Controls share one row and grow, but never balloon: a lone search or
        // dropdown caps at max-w-md instead of stretching across the screen.
        // Children marked .grow (search boxes) get a 50% wider cap than plain filters.
        '[&>*]:grow [&>*]:shrink [&>*]:basis-44 [&>*]:min-w-[150px] [&>*]:max-w-xs [&>.grow]:max-w-[30rem] [&>.grow]:basis-64',
        className,
      )}
    >
      {children}
    </div>
  )
}
