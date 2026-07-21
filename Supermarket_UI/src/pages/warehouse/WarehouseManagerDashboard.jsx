import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardBody, CardHeader, Badge, Button, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { Bars } from '../../components/ui/Charts.jsx'
import {
  inventoryService, productService, purchaseOrderService, toList, warehouseTxnService, withFallback } from '../../services/index.js'
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CalendarClock,
  ClipboardCheck,
  ClipboardList,
  PackagePlus,
  PackageSearch,
  Warehouse,
} from 'lucide-react'

function normalizedStatus(status) {
  const value = String(status || '').toUpperCase()
  if (value.includes('REJECT') || value.includes('TỪ CHỐI')) return 'Rejected'
  if (value.includes('RECEIVED') || value.includes('ĐÃ NHẬN')) return 'Received'
  if (value.includes('APPROVED') || value.includes('ĐÃ DUYỆT')) return 'Approved'
  if (value.includes('DRAFT')) return 'Draft'
  if (value.includes('REVIEW')) return 'Review'
  if (value.includes('PENDING') || value.includes('CHỜ')) return 'Pending'
  if (value.includes('OPEN')) return 'Open'
  return status || 'Open'
}

function isOpenStatus(status) {
  return ['Open', 'Draft', 'Review', 'Pending'].includes(normalizedStatus(status))
}

function transactionType(type) {
  const value = String(type || '').toUpperCase()
  if (value.includes('NHẬP') || value.includes('RECEIPT')) return 'Receipt'
  if (value.includes('ĐIỀU CHỈNH') || value.includes('ADJUST')) return 'Adjust'
  if (value.includes('KIỂM') || value.includes('COUNT')) return 'Count Diff'
  if (value.includes('XUẤT') || value.includes('ISSUE')) return 'Issue'
  return type || 'Transaction'
}

function shortDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
}

function millions(value) {
  const number = Number(value || 0)
  return number >= 1_000_000 ? `${(number / 1_000_000).toFixed(1)}M` : `${number.toFixed(1)}M`
}

function daysUntil(value) {
  const expiry = new Date(value)
  if (Number.isNaN(expiry.getTime())) return Number.POSITIVE_INFINITY
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / 86_400_000)
}

export default function WarehouseManagerDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [transactions, setTransactions] = useState([])
  const [lowStock, setLowStock] = useState([])
  const [products, setProducts] = useState([])
  const [sources, setSources] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    ;(async () => {
      const [orderResult, transactionResult, stockResult, productResult] = await Promise.all([
        withFallback(() => purchaseOrderService.list()),
        withFallback(() => warehouseTxnService.list()),
        withFallback(
          () => inventoryService.lowStock()),
        withFallback(() => productService.list({ size: 200 })),
      ])

      if (!alive) return
      setOrders(toList(orderResult.data))
      setTransactions(toList(transactionResult.data))
      setLowStock(toList(stockResult.data))
      setProducts(toList(productResult.data))
      setSources({
        orders: orderResult.source,
        transactions: transactionResult.source,
        stock: stockResult.source,
        products: productResult.source,
      })
      setLoading(false)
    })()

    return () => { alive = false }
  }, [])

  const orderRows = useMemo(() => {
    return orders.slice(0, 5).map((order, index) => ({
      ...order,
      id: order.id || order.code || `PO-${1001 + index}`,
      code: order.code || order.id || `PO-${1001 + index}`,
      expected: shortDate(order.expectedDate || order.orderDate || order.date),
      total: Number(order.total || 0),
      status: normalizedStatus(order.status),
    }))
  }, [orders, sources.orders])

  const transactionRows = useMemo(() => {
    return transactions.slice(0, 5).map((transaction, index) => ({
      ...transaction,
      id: transaction.id || transaction.code || `TX-${301 + index}`,
      code: transaction.code || transaction.id || `TX-${301 + index}`,
      type: transactionType(transaction.type),
      product: transaction.product || transaction.productName || transaction.ref || 'Inventory item',
      qty: Number(transaction.qty ?? transaction.quantity ?? 0),
      status: normalizedStatus(transaction.status),
    }))
  }, [sources.transactions, transactions])

  const riskByCategory = useMemo(() => {
    const categoryCounts = new Map()
    lowStock.forEach((item) => {
      const product = products.find((row) => row.id === item.productId || row.name === item.productName || row.name === item.product)
      const category = item.category || product?.category || 'Other'
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
    })
    return [...categoryCounts.entries()].map(([category, risk]) => ({ category, risk }))
  }, [lowStock, products, sources.stock])

  const openOrders = sources.orders === 'backend'
    ? orders.filter((order) => isOpenStatus(order.status)).length
    : 14
  const pendingTransactions = sources.transactions === 'backend'
    ? transactions.filter((transaction) => ['Pending', 'Review'].includes(normalizedStatus(transaction.status))).length
    : 9
  const lowStockCount = sources.stock === 'backend' ? lowStock.length : 24
  const expiringSoon = sources.products === 'backend'
    ? products.filter((product) => {
        const remaining = daysUntil(product.expiry || product.expiryDate)
        return remaining >= 0 && remaining <= 30
      }).length
    : 18

  return (
    <div>
      <PageHeader
        breadcrumb="Warehouse · 3.2.2"
        title="Warehouse Manager Dashboard"
        subtitle="Role-based interface after successful login."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open Purchase Orders" value={`${openOrders} POs`} icon={ClipboardList} tone="brand" hint="3 awaiting confirmation" />
        <StatCard label="Pending Transactions" value={`${pendingTransactions} requests`} icon={ClipboardCheck} tone="amber" hint="need approval" />
        <StatCard label="Low Stock" value={`${lowStockCount} SKUs`} icon={AlertTriangle} tone="red" hint="below reorder level" />
        <StatCard label="Expiring Soon" value={`${expiringSoon} batches`} icon={CalendarClock} tone="red" hint="within 30 days" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card className="min-w-0">
              <CardHeader
                title="Purchase Order Pipeline"
                subtitle="Latest supplier orders and delivery status"
                icon={ClipboardList}
                action={
                  <Link to="/app/warehouse/purchase-orders">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>View all</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={orderRows}
                  rowKey="id"
                  onRowClick={(row) => navigate(`/app/warehouse/purchase-orders/${row.id}`)}
                  empty={{ title: 'No purchase orders', subtitle: 'The purchase order pipeline is empty.' }}
                  columns={[
                    { key: 'code', header: 'PO No', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.code}</span> },
                    { key: 'supplier', header: 'Supplier' },
                    { key: 'expected', header: 'Expected' },
                    { key: 'total', header: 'Total', align: 'right', render: (row) => <span className="font-semibold">{millions(row.total)}</span> },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => <Badge tone={row.status === 'Open' ? 'green' : row.status === 'Review' ? 'blue' : 'slate'} dot>{row.status}</Badge>,
                    },
                  ]}
                />
              </CardBody>
            </Card>

            <Card className="min-w-0">
              <CardHeader
                title="Warehouse Approval Queue"
                subtitle="Inventory movements waiting for review"
                icon={ClipboardCheck}
                action={
                  <Link to="/app/warehouse/transactions">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>View all</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={transactionRows}
                  rowKey="id"
                  onRowClick={() => navigate('/app/warehouse/transactions')}
                  empty={{ title: 'No pending transactions', subtitle: 'The warehouse approval queue is clear.' }}
                  columns={[
                    { key: 'code', header: 'Txn', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.code}</span> },
                    { key: 'type', header: 'Type' },
                    { key: 'product', header: 'Product' },
                    {
                      key: 'qty',
                      header: 'Qty',
                      align: 'right',
                      render: (row) => <span className={row.qty < 0 ? 'font-semibold text-rose-600' : 'font-semibold text-emerald-600'}>{row.qty > 0 ? `+${row.qty}` : row.qty}</span>,
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => <Badge tone={row.status === 'Review' ? 'blue' : 'amber'} dot>{row.status}</Badge>,
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card className="min-w-0">
              <CardHeader title="Inventory Risk by Category" subtitle="SKUs below reorder level" icon={PackageSearch} />
              <CardBody>
                <Bars
                  data={riskByCategory}
                  x="category"
                  height={220}
                  series={[{ key: 'risk', name: 'At-risk SKUs', color: '#059669' }]}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Warehouse Shortcuts" subtitle="Frequently used manager actions" icon={Warehouse} />
              <CardBody className="grid gap-3 sm:grid-cols-2">
                <WarehouseShortcut to="/app/warehouse/purchase-orders/new" icon={PackagePlus} label="Create PO" />
                <WarehouseShortcut to="/app/warehouse/transactions" icon={ClipboardCheck} label="Approve Transaction" />
                <WarehouseShortcut to="/app/warehouse/products" icon={Boxes} label="Inventory List" />
                <WarehouseShortcut to="/app/warehouse/monitor" icon={AlertTriangle} label="Low Stock / Expiry" />
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function WarehouseShortcut({ to, icon: Icon, label }) {
  return (
    <Link
      to={to}
      className="group flex min-h-16 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-center transition hover:border-brand-200 hover:bg-brand-50/50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon size={17} />
      </span>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-700">{label}</span>
    </Link>
  )
}
