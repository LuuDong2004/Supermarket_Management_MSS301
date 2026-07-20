import { useLocation } from 'react-router-dom'

const CODES = [
  ['/ceo/reports', '3.3.1'], ['/ceo/approvals', '3.3.2'], ['/ceo/policies', '3.3.3'],
  ['/admin/users', '3.4.1'], ['/admin/approval-requests', '3.4.2'], ['/admin/monitoring', '3.4.3'],
  ['/hr/employees', '3.5.1'], ['/hr/attendance', '3.5.2'], ['/hr/performance', '3.5.3'],
  ['/warehouse/purchase-orders', '3.6.1'], ['/warehouse/transactions', '3.6.2'], ['/warehouse/monitor', '3.6.3'], ['/warehouse/reports', '3.6.4'],
  ['/warehouse/receive', '3.7.1'], ['/warehouse/inventory', '3.7.2'], ['/warehouse/stock-count', '3.7.3'], ['/warehouse/adjustments', '3.7.4'], ['/warehouse/approval-status', '3.7.5'],
  ['/pos/sale', '3.8.1'], ['/pos/payment', '3.8.2'], ['/pos/shift', '3.8.3'],
  ['/pos/members', '3.9.1'], ['/pos/loyalty', '3.9.2'], ['/pos/promotions', '3.9.3'],
  ['/reports/sales', '3.10.1'], ['/reports/inventory', '3.10.2'], ['/reports/employees', '3.10.3'],
  ['/settings/system', '3.11.1'], ['/settings/rules', '3.11.2'],
]

export function ReferenceFooter() {
  const { pathname } = useLocation()
  const match = CODES.find(([path]) => pathname.includes(path))
  if (!match) return null
  return <div className="sms-reference-footer">{match[1]} screen mock-up | black-white web layout | preview only</div>
}
