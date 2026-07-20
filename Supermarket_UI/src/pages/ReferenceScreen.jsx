import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

const BASE_ROWS = [
  ['001', 'Milk', 'Milk', 'Milk', 'Pending'],
  ['002', 'Rice', 'Rice', 'Rice', 'Approved'],
  ['003', 'Staff A', 'Staff A', 'Staff A', 'Active'],
  ['004', 'Customer B', 'Customer B', 'Customer B', 'Rejected'],
  ['005', 'Supplier C', 'Supplier C', 'Supplier C', 'Pending'],
  ['006', 'Order D', 'Order D', 'Order D', 'Approved'],
  ['007', 'Milk', 'Milk', 'Milk', 'Active'],
  ['008', 'Rice', 'Rice', 'Rice', 'Rejected'],
]

const REPORT_ROWS = [
  ['12/01/26', 'Milk', '120', 'Milk', 'Milk', 'Pending'],
  ['12/02/26', 'Rice', '240', 'Rice', 'Rice', 'Approved'],
  ['12/03/26', 'Staff A', '360', 'Staff A', 'Staff A', 'Active'],
  ['12/04/26', 'Customer B', '480', 'Customer B', 'Customer B', 'Rejected'],
  ['12/05/26', 'Supplier C', '600', 'Supplier C', 'Supplier C', 'Pending'],
  ['12/06/26', 'Order D', '720', 'Order D', 'Order D', 'Approved'],
]

const FILTERS = ['Search', 'Status', 'Date', 'Type']

const CONFIGS = [
  ['/ceo/reports', { code: '3.3.1', title: 'View Management Reports', kind: 'report', role: 'CEO', filters: ['Report Type', 'Date Range', 'Filter', 'Export'] }],
  ['/ceo/approvals', { code: '3.3.2', title: 'Process Approval Request', kind: 'split', role: 'CEO', filters: FILTERS, tableTitle: 'Pending Request List', panelTitle: 'Request View', columns: ['Request ID', 'Type', 'Requester', 'Date', 'Status'], fields: ['Request Type', 'Current Value', 'Requested Value', 'Reason'], action: 'Decision' }],
  ['/ceo/policies', { code: '3.3.3', title: 'Manage Business Policy', kind: 'split', role: 'CEO', filters: ['Policy ID', 'Type', 'Status', 'Effective Date'], tableTitle: 'Policy List', panelTitle: 'Policy Detail', columns: ['Policy ID', 'Type', 'Value', 'Status', 'Effective Date'], fields: ['Policy Name', 'Policy Type', 'Effective Date', 'Status', 'Policy Description'], action: 'Create / Update Policy' }],
  ['/admin/users', { code: '3.4.1', title: 'Manage User Accounts', kind: 'split', role: 'Administrator', filters: ['Search User', 'Role', 'Status', 'Approval'], tableTitle: 'User Account List', panelTitle: 'Account Form', columns: ['User ID', 'Full Name', 'Role', 'Status', 'Approval'], fields: ['Full Name', 'Role', 'Account Status', 'Approval Status'], action: 'CEO Approval Note' }],
  ['/admin/approval-requests', { code: '3.4.2', title: 'Submit and View Approval Request', kind: 'split', role: 'Administrator', filters: ['Search', 'Status', 'Date', 'Type'], tableTitle: 'Approval Request List', panelTitle: 'Request Form', columns: ['Request ID', 'Type', 'Requester', 'Date', 'Status'], fields: ['Request Type', 'Current Value', 'Requested Value', 'Reason'], action: 'Submit Request' }],
  ['/admin/monitoring', { code: '3.4.3', title: 'Monitor System Logs and Status', kind: 'split', role: 'Administrator', filters: FILTERS, tableTitle: 'System Log List', panelTitle: 'System Status', columns: ['Log ID', 'Level', 'Service', 'Message', 'Time'], fields: ['Log Type', 'Date Range', 'Service', 'Environment'], action: 'Refresh' }],
  ['/hr/employees', { code: '3.5.1', title: 'Manage Employee Profile and Work History', kind: 'split', role: 'Staff Manager', filters: FILTERS, tableTitle: 'Employee List', panelTitle: 'Employee Profile', columns: ['Employee ID', 'Full Name', 'Position', 'Status', 'Work History'], fields: ['Employee ID', 'Full Name', 'Position', 'Employment Status'], action: 'Employee Form' }],
  ['/hr/attendance', { code: '3.5.2', title: 'Manage Attendance Records and Reports', kind: 'split', role: 'Staff Manager', filters: FILTERS, tableTitle: 'Attendance Records', panelTitle: 'Attendance Detail', columns: ['ID', 'Employee', 'Date', 'Check-in', 'Check-out', 'Status'], fields: ['Employee', 'Date', 'Check-in Time', 'Check-out Time', 'Attendance Status'], action: 'Attendance Form' }],
  ['/hr/performance', { code: '3.5.3', title: 'Evaluate Performance and Recommend Reward or Salary', kind: 'split', role: 'Staff Manager', filters: FILTERS, tableTitle: 'Performance Report List', panelTitle: 'Evaluation Form', columns: ['Employee', 'Period', 'Score', 'Recommendation', 'Status'], fields: ['Employee', 'Evaluation Period', 'Performance Score', 'Recommendation Type'], action: 'Save Evaluation' }],
  ['/warehouse/purchase-orders', { code: '3.6.1', title: 'Manage Purchase Order', kind: 'split', role: 'Warehouse Manager', filters: FILTERS, tableTitle: 'Purchase Order List', panelTitle: 'Purchase Order Detail', columns: ['PO No', 'Supplier', 'Expected Date', 'Total', 'Status'], fields: ['PO Number', 'Supplier', 'Product Items', 'Expected Delivery Date', 'PO Status'], action: 'Submit' }],
  ['/warehouse/transactions', { code: '3.6.2', title: 'Approve Warehouse Transaction', kind: 'split', role: 'Warehouse Manager', filters: ['Request Type', 'Status'], tableTitle: 'Warehouse Transaction List', panelTitle: 'Transaction Detail', columns: ['ID', 'Type', 'Reference', 'Date', 'Status'], fields: ['Transaction Type', 'Reference', 'Requested By', 'Quantity'], action: 'Approve / Reject' }],
  ['/warehouse/monitor', { code: '3.6.3', title: 'Monitor Inventory, Low Stock, and Expiring Products', kind: 'monitor', role: 'Warehouse Manager', filters: ['Product Search', 'Category', 'Risk Status', 'Location'], tableTitle: 'Inventory Risk List', panelTitle: 'Product Inventory Detail', columns: ['SKU', 'Product', 'Stock', 'Threshold', 'Expiry', 'Risk'], fields: ['Batch ID', 'Product Name', 'Location', 'Last Updated', 'Risk Description'], action: 'Review' }],
  ['/warehouse/reports', { code: '3.6.4', title: 'View Warehouse Reports', kind: 'report', role: 'Warehouse Manager', filters: ['Report Type', 'Date Range', 'Filter', 'Export'] }],
  ['/warehouse/receive', { code: '3.7.1', title: 'Receive Goods', kind: 'split', role: 'Warehouse Staff', filters: FILTERS, tableTitle: 'Goods Receipt Drafts', panelTitle: 'Goods Receipt Form', columns: ['ID', 'Supplier', 'Product', 'Qty', 'Status'], fields: ['Purchase Order', 'Product', 'Received Quantity', 'Product Condition', 'Expiry Date'], action: 'Submit' }],
  ['/warehouse/inventory', { code: '3.7.2', title: 'View Inventory Information', kind: 'monitor', role: 'Warehouse Staff', filters: ['Product Search', 'Category', 'Risk Status', 'Location'], tableTitle: 'Inventory Risk List', panelTitle: 'Product Inventory Detail', columns: ['SKU', 'Product', 'Stock', 'Threshold', 'Expiry', 'Risk'], fields: ['Batch ID', 'Location', 'Last Updated', 'Stock Status'], action: 'View' }],
  ['/warehouse/stock-count', { code: '3.7.3', title: 'Conduct Stock Count', kind: 'split', role: 'Warehouse Staff', filters: FILTERS, tableTitle: 'Stock Count Sessions', panelTitle: 'Stock Count Form', columns: ['ID', 'Product', 'System Qty', 'Counted Qty', 'Status'], fields: ['Count Session', 'Product', 'System Quantity', 'Actual Quantity', 'Discrepancy Reason'], action: 'Submit' }],
  ['/warehouse/adjustments', { code: '3.7.4', title: 'Submit Stock Adjustment Request', kind: 'split', role: 'Warehouse Staff', filters: FILTERS, tableTitle: 'Adjustment Requests', panelTitle: 'Adjustment Request Form', columns: ['ID', 'Product', 'System Qty', 'Difference', 'Status'], fields: ['Adjustment Type', 'Product', 'System Quantity', 'Actual Quantity', 'Evidence Attachment'], action: 'Submit' }],
  ['/warehouse/approval-status', { code: '3.7.5', title: 'View Approval Status', kind: 'split', role: 'Warehouse Staff', filters: FILTERS, tableTitle: 'Submitted Requests', panelTitle: 'Approval Result', columns: ['ID', 'Type', 'Date', 'Status', 'Comment'], fields: ['Request ID', 'Request Type', 'Status', 'Decision Comment'], action: 'View' }],
  ['/pos/sale', { code: '3.8.1', title: 'Process Sale', kind: 'sale', role: 'Cashier' }],
  ['/pos/payment', { code: '3.8.2', title: 'Process Payment', kind: 'payment', role: 'Cashier' }],
  ['/pos/shift', { code: '3.8.3', title: 'Manage Cashier Shift', kind: 'split', role: 'Cashier', filters: FILTERS, tableTitle: 'Shift History', panelTitle: 'Open / Close Shift', columns: ['ID', 'Cashier', 'Open Time', 'Close Time', 'Status'], fields: ['Shift ID', 'Opening Cash', 'Opening Time', 'Closing Cash', 'Open / Close Shift'], action: 'Submit' }],
  ['/pos/members', { code: '3.9.1', title: 'Search or Register Customer Member', kind: 'split', role: 'Cashier', filters: ['Phone Number', 'Customer Name', 'Status', 'Email'], tableTitle: 'Customer Search Result', panelTitle: 'Customer Profile / Registration', columns: ['ID', 'Name', 'Phone', 'Points', 'Status'], fields: ['Phone Number', 'Customer Name', 'Phone', 'Email', 'Membership Status'], action: 'Save Member' }],
  ['/pos/loyalty', { code: '3.9.2', title: 'View and Redeem Loyalty Points', kind: 'loyalty', role: 'Cashier' }],
  ['/pos/promotions', { code: '3.9.3', title: 'Apply Promotion, Discount, or Voucher', kind: 'promotion', role: 'Cashier' }],
  ['/reports/sales', { code: '3.10.1', title: 'Generate Sales and Business Performance Reports', kind: 'report', role: 'CEO / Manager', filters: ['Report Type', 'Date Range', 'Filter', 'Export'] }],
  ['/reports/inventory', { code: '3.10.2', title: 'Generate Inventory and Warehouse Reports', kind: 'report', role: 'CEO / Warehouse Manager', filters: ['Report Type', 'Date Range', 'Filter', 'Export'] }],
  ['/reports/employees', { code: '3.10.3', title: 'Generate Employee Performance Reports', kind: 'report', role: 'CEO / Staff Manager', filters: ['Report Type', 'Date Range', 'Filter', 'Export'] }],
  ['/settings/system', { code: '3.11.1', title: 'Configure System Settings', kind: 'settings', role: 'CEO / Administrator', filters: ['Configuration Type', 'Status', 'Effective Date', 'Approval'] }],
  ['/settings/rules', { code: '3.11.2', title: 'Maintain Business Rules and Audit Traceability', kind: 'rules', role: 'CEO / Administrator' }],
]

function findConfig(pathname) {
  return CONFIGS.find(([prefix]) => pathname.startsWith(`/app${prefix}`))?.[1]
}

function RefFilter({ labels = FILTERS }) {
  return <div className="ref-filterbar">
    {labels.map((label) => <label key={label}>{label}<input placeholder={label === 'Search' || label.includes('Search') ? 'Keyword' : label === 'Export' ? 'PDF / Excel' : label === 'Date Range' ? 'From - To' : label} /></label>)}
    <div className="ref-filter-actions"><button className="ref-btn ref-btn-dark">Apply</button><button className="ref-btn">Reset</button></div>
  </div>
}

function RefTable({ title, columns, rows = BASE_ROWS, onSelect, selected }) {
  return <section className="ref-table-section">
    {title && <h2>{title}</h2>}
    <div className="ref-table-wrap"><table><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>
      {rows.map((row, index) => <tr key={`${row[0]}-${index}`} className={selected === index ? 'is-selected' : ''} onClick={() => onSelect?.(index)}>{columns.map((_, col) => <td key={col}>{row[col % row.length]}</td>)}</tr>)}
    </tbody></table></div>
  </section>
}

function RefPanel({ title, fields, action, selectedRow, onSubmit }) {
  const [message, setMessage] = useState('')
  return <section className="ref-detail-panel">
    <h2>{title}</h2>
    <div className="ref-form-grid">{fields.map((field, index) => <label key={field} className={field === 'Policy Description' || field.includes('Note') || field.includes('Reason') || field.includes('Comment') ? 'ref-form-wide' : ''}>{field}
      {field.includes('Status') || field === 'Role' || field.includes('Type') ? <select defaultValue={field.includes('Status') ? 'Pending' : ''}><option value="">Select</option><option>Pending</option><option>Approved</option><option>Active</option></select> : <input defaultValue={index === 0 && selectedRow ? selectedRow : ''} placeholder={field === 'Effective Date' ? 'dd/mm/yyyy' : field === 'Policy Description' ? 'Enter description' : field} />}
    </label>)}</div>
    <div className="ref-panel-actions"><button className="ref-btn ref-btn-dark" onClick={() => { setMessage(`${action} completed`); onSubmit?.() }}>{action}</button>{action !== 'View' && <button className="ref-btn" onClick={() => setMessage('')}>Cancel</button>}</div>
    {message && <p className="ref-feedback">{message}</p>}
  </section>
}

function ReportView() {
  return <>
    <div className="ref-kpi-row">{[['Total Sales', '128.4M'], ['Transactions', '1,248'], ['Gross Profit', '28.6M'], ['Inventory Value', '412M']].map(([label, value]) => <div className="ref-kpi" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="ref-report-grid">
      <section className="ref-chart-panel"><h2>Trend Summary</h2><div className="ref-chart"><div className="ref-axis" />{[42, 62, 92, 70, 132, 102, 162].map((height, i) => <i key={i} style={{ height }} />)}</div><div className="ref-panel-actions"><button className="ref-btn ref-btn-dark">Generate</button><button className="ref-btn">Export</button></div></section>
      <RefTable title="Report Detail" columns={['Date', 'Category', 'Revenue', 'Cost', 'Profit', 'Status']} rows={REPORT_ROWS} />
    </div>
  </>
}

function SaleView() {
  const cart = [['Milk', '5', 'Milk', 'Milk', '120'], ['Rice', '10', 'Rice', 'Rice', '240'], ['Staff A', '15', 'Staff A', 'Staff A', '360'], ['Customer B', '20', 'Customer B', 'Customer B', '480'], ['Supplier C', '25', 'Supplier C', 'Supplier C', '600'], ['Order D', '30', 'Order D', 'Order D', '720']]
  return <div className="ref-sale-grid"><section className="ref-sale-left"><h2>Product Entry</h2><label>Barcode / Product Search<input placeholder="Scan or search product" /></label><button className="ref-btn ref-btn-dark ref-inline-btn">Add</button><h2>Cart Items</h2><div className="ref-table-wrap"><table><thead><tr>{['Item', 'Qty', 'Price', 'Discount', 'Subtotal'].map((x) => <th key={x}>{x}</th>)}</tr></thead><tbody>{cart.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section><section className="ref-sale-right"><h2>Checkout Summary</h2><label>Customer Account<input placeholder="Search phone/member" /></label><label>Promotion / Voucher<input placeholder="Enter voucher" /></label><h2>Totals</h2><div className="ref-totals">Subtotal: 650,000<br />Discount: 50,000<br />VAT: 48,000<br />Grand total: 648,000</div><div className="ref-panel-actions"><button className="ref-btn ref-btn-dark">Checkout</button><button className="ref-btn">Cancel</button></div></section></div>
}

function PaymentView() {
  return <div className="ref-payment-grid"><section className="ref-detail-panel"><h2>Payment Method</h2><label><input type="radio" name="payment" defaultChecked /> Cash Payment</label><label><input type="radio" name="payment" /> QR Banking Payment</label><div className="ref-totals">Grand Total: 648,000<br />Cash received: ______<br />Change: ______</div><button className="ref-btn ref-btn-dark">Confirm Payment</button></section><section className="ref-detail-panel"><h2>QR Payment Status</h2><div className="ref-qr">QR CODE</div><p>Status: Pending / Successful / Failed</p></section></div>
}

function LoyaltyView() {
  return <div className="ref-loyalty-grid"><section className="ref-detail-panel"><h2>Customer</h2><p>Phone: 0901234567</p><p>Name: Trần Thị Mai</p><p>Membership: Gold</p><div className="ref-kpi-row"><div className="ref-kpi"><span>Available Points</span><strong>1,250</strong></div><div className="ref-kpi"><span>Redeem Value</span><strong>125,000</strong></div></div><h2>Redeem Points</h2><label>Redeem Points<input placeholder="Enter amount" /></label><button className="ref-btn ref-btn-dark">Confirm Redemption</button></section><RefTable title="Point History" columns={['Date', 'Type', 'Earned', 'Redeemed', 'Balance']} /></div>
}

function PromotionView() {
  return <div className="ref-promotion-grid"><section className="ref-table-section"><h2>Promotion / Voucher</h2><label>Promotion Code<input placeholder="Enter code" /></label><button className="ref-btn ref-btn-dark ref-inline-btn">Apply</button><RefTable columns={['Code', 'Rule', 'Discount', 'Status']} rows={BASE_ROWS.map((r) => [r[0], r[1], '10%', r[4]])} /></section><section className="ref-detail-panel"><h2>Cart Discount Summary</h2><p>Subtotal: 650,000</p><p>Applied discount: 50,000</p><p>Discount amount: 50,000</p><p>Stacking rules: not allowed</p><div className="ref-panel-actions"><button className="ref-btn">Remove</button><button className="ref-btn ref-btn-dark">Recalculate</button></div></section></div>
}

function SettingsView() {
  return <><RefFilter labels={['Configuration Type', 'Status', 'Effective Date', 'Approval']} /><div className="ref-split"><RefTable title="Configuration Requests" columns={['Config ID', 'Type', 'Current', 'New', 'Status']} /><RefPanel title="Configuration Change" fields={['Current Value', 'New Value', 'Effective Date', 'Approval Status']} action="Submit Request" /></div></>
}

function RulesView() {
  return <div className="ref-rules-grid"><RefTable title="Business Rules List" columns={['ID', 'Rule', 'Status', 'Effective']} /><div><section className="ref-detail-panel"><h2>Rule Definition</h2><p>Rule name, condition, action and active status are displayed here for audit traceability.</p></section><RefTable title="Audit Traceability" columns={['Actor', 'Timestamp', 'Old Value', 'New Value', 'Decision']} /></div></div>
}

export default function ReferenceScreen() {
  const { pathname } = useLocation()
  const config = findConfig(pathname)
  const [selected, setSelected] = useState(null)
  const rows = useMemo(() => BASE_ROWS, [])
  if (!config) return null
  return <div className={`ref-screen ref-${config.kind}`}>
    <div className="ref-title"><h1>{config.title}</h1></div>
    {config.kind === 'sale' ? <SaleView /> : config.kind === 'payment' ? <PaymentView /> : config.kind === 'loyalty' ? <LoyaltyView /> : config.kind === 'promotion' ? <PromotionView /> : config.kind === 'settings' ? <SettingsView /> : config.kind === 'rules' ? <RulesView /> : <>
      <RefFilter labels={config.filters} />
      {config.kind === 'report' ? <ReportView /> : config.kind === 'monitor' ? <div className="ref-split"><RefTable title={config.tableTitle} columns={config.columns} rows={rows.map((r) => [r[0], r[1], r[2], r[3], '12/01/26', r[4]])} onSelect={setSelected} selected={selected} /><RefPanel title={config.panelTitle} fields={config.fields} action={config.action} selectedRow={selected != null ? rows[selected][1] : ''} /></div> : <div className="ref-split"><RefTable title={config.tableTitle} columns={config.columns} onSelect={setSelected} selected={selected} /><RefPanel title={config.panelTitle} fields={config.fields} action={config.action} selectedRow={selected != null ? rows[selected][1] : ''} /></div>}
    </>}
  </div>
}
