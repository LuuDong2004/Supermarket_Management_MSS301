import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { Card, CardBody, CardHeader, Badge, Button, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import {
  mockPurchaseOrders,
  mockStockAdjustments,
  mockStockCounts,
  purchaseOrderService,
  stockAdjustmentService,
  stockCountService,
  toList,
  withFallback,
} from '../../services/index.js'
import {
  ArrowRight,
  Boxes,
  ClipboardCheck,
  ClipboardList,
  FileClock,
  FilePenLine,
  ListChecks,
  PackageCheck,
  PackageOpen,
  ScanLine,
} from 'lucide-react'

const DEMO_RECEIVING = [
  { id: 'PO-1021', po: 'PO-1021', supplier: 'Vinamilk', product: 'Milk', expectedQty: 120, status: 'Arrived' },
  { id: 'PO-1022', po: 'PO-1022', supplier: 'Acecook', product: 'Noodle', expectedQty: 100, status: 'Waiting' },
  { id: 'PO-1023', po: 'PO-1023', supplier: 'Masan', product: 'Beverage', expectedQty: 80, status: 'Waiting' },
  { id: 'PO-1024', po: 'PO-1024', supplier: 'TH True Milk', product: 'Yogurt', expectedQty: 140, status: 'Arrived' },
  { id: 'PO-1025', po: 'PO-1025', supplier: 'Chin-su', product: 'Rice', expectedQty: 60, status: 'Waiting' },
]

const DEMO_REQUESTS = [
  { id: 'ADJ-009', request: 'ADJ-009', type: 'Adjustment', decision: 'Approved' },
  { id: 'CNT-008', request: 'CNT-008', type: 'Count Diff', decision: 'Pending' },
]

const WORKBENCH_TASKS = [
  {
    title: 'Record product condition',
    detail: '3 deliveries require condition review',
    action: 'Open',
    to: '/app/warehouse/receive',
    icon: PackageCheck,
  },
  {
    title: 'Record expiration date',
    detail: 'Dairy batches awaiting expiry data',
    action: 'Open',
    to: '/app/warehouse/receive',
    icon: FileClock,
  },
  {
    title: 'Submit stock-in result',
    detail: 'Receipts ready for manager review',
    action: 'Submit',
    to: '/app/warehouse/goods-receipts/new',
    icon: ClipboardCheck,
  },
]

function normalizedStatus(status) {
  const value = String(status || '').toUpperCase()
  if (value.includes('APPROVED') || value.includes('ĐÃ DUYỆT')) return 'Approved'
  if (value.includes('REJECT') || value.includes('TỪ CHỐI')) return 'Rejected'
  if (value.includes('RECEIVED') || value.includes('ĐÃ NHẬN')) return 'Received'
  if (value.includes('ARRIVED')) return 'Arrived'
  if (value.includes('WAIT')) return 'Waiting'
  if (value.includes('COMPLETE') || value.includes('HOÀN TẤT')) return 'Completed'
  if (value.includes('DRAFT') || value.includes('NHÁP')) return 'Draft'
  if (value.includes('PENDING') || value.includes('CHỜ')) return 'Pending'
  return status || 'Pending'
}

function isOpenCount(status) {
  return !['Completed', 'Approved', 'Rejected'].includes(normalizedStatus(status))
}

function deliveryStatus(order) {
  const status = normalizedStatus(order.status)
  if (status === 'Received') return 'Arrived'
  return order.arrived ? 'Arrived' : 'Waiting'
}

export default function WarehouseStaffDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [counts, setCounts] = useState([])
  const [adjustments, setAdjustments] = useState([])
  const [sources, setSources] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    ;(async () => {
      const [orderResult, countResult, adjustmentResult] = await Promise.all([
        withFallback(() => purchaseOrderService.list(), mockPurchaseOrders),
        withFallback(() => stockCountService.list(), mockStockCounts),
        withFallback(() => stockAdjustmentService.list(), mockStockAdjustments),
      ])

      if (!alive) return
      setOrders(toList(orderResult.data))
      setCounts(toList(countResult.data))
      setAdjustments(toList(adjustmentResult.data))
      setSources({
        orders: orderResult.source,
        counts: countResult.source,
        adjustments: adjustmentResult.source,
      })
      setLoading(false)
    })()

    return () => { alive = false }
  }, [])

  const receivingRows = useMemo(() => {
    if (sources.orders !== 'backend') return DEMO_RECEIVING
    return orders
      .filter((order) => ['Approved', 'Received'].includes(normalizedStatus(order.status)))
      .slice(0, 5)
      .map((order, index) => ({
        ...order,
        id: order.id || order.code || `PO-${1021 + index}`,
        po: order.code || order.id || `PO-${1021 + index}`,
        product: order.product || order.productName || `${order.items || 1} item${Number(order.items) === 1 ? '' : 's'}`,
        expectedQty: Number(order.expectedQty ?? order.quantity ?? order.items ?? 0),
        status: deliveryStatus(order),
      }))
  }, [orders, sources.orders])

  const requestRows = useMemo(() => {
    if (sources.adjustments !== 'backend') return DEMO_REQUESTS
    const adjustmentRows = adjustments.slice(0, 2).map((item, index) => ({
      id: item.id || item.code || `ADJ-${String(index + 1).padStart(3, '0')}`,
      request: item.code || item.id || `ADJ-${String(index + 1).padStart(3, '0')}`,
      type: 'Adjustment',
      decision: normalizedStatus(item.status),
    }))
    if (adjustmentRows.length >= 2) return adjustmentRows
    const countRows = counts.slice(0, 2 - adjustmentRows.length).map((item, index) => ({
      id: item.id || item.code || `CNT-${String(index + 1).padStart(3, '0')}`,
      request: item.code || item.id || `CNT-${String(index + 1).padStart(3, '0')}`,
      type: 'Count Diff',
      decision: normalizedStatus(item.status),
    }))
    return [...adjustmentRows, ...countRows]
  }, [adjustments, counts, sources.adjustments])

  const goodsToReceive = sources.orders === 'backend'
    ? orders.filter((order) => normalizedStatus(order.status) === 'Approved').length
    : 6
  const openCounts = sources.counts === 'backend'
    ? counts.filter((count) => isOpenCount(count.status)).length
    : 3
  const adjustmentDrafts = sources.adjustments === 'backend'
    ? adjustments.filter((item) => ['Draft', 'Pending'].includes(normalizedStatus(item.status))).length
    : 2
  const approvalResults = sources.adjustments === 'backend'
    ? adjustments.filter((item) => ['Approved', 'Rejected'].includes(normalizedStatus(item.status))).length
    : 5

  return (
    <div>
      <PageHeader
        breadcrumb="Warehouse · 3.2.2"
        title="Warehouse Staff Dashboard"
        subtitle="Manage operational warehouse tasks after login."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Goods To Receive" value={`${goodsToReceive} deliveries`} icon={PackageOpen} tone="brand" hint="linked purchase orders" />
        <StatCard label="Stock Count Tasks" value={`${openCounts} sessions`} icon={ScanLine} tone="blue" hint="assigned today" />
        <StatCard label="Adjustment Drafts" value={`${adjustmentDrafts} requests`} icon={FilePenLine} tone="amber" hint="saved or open" />
        <StatCard label="Approval Results" value={`${approvalResults} updates`} icon={ClipboardCheck} tone="green" hint="from manager" />
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 shadow-card">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-3">
              <CardHeader
                title="Today's Receiving Tasks"
                subtitle="Purchase orders scheduled for warehouse receipt"
                icon={PackageOpen}
                action={
                  <Link to="/app/warehouse/receive">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>View all</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={receivingRows}
                  rowKey="id"
                  onRowClick={() => navigate('/app/warehouse/receive')}
                  empty={{ title: 'No receiving tasks', subtitle: 'There are no approved deliveries waiting today.' }}
                  columns={[
                    { key: 'po', header: 'PO', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.po}</span> },
                    { key: 'supplier', header: 'Supplier' },
                    { key: 'product', header: 'Product' },
                    { key: 'expectedQty', header: 'Expected Qty', align: 'right' },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => <Badge tone={row.status === 'Arrived' ? 'green' : 'amber'} dot>{row.status}</Badge>,
                    },
                  ]}
                />
              </CardBody>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader title="Operational Workbench" subtitle="Tasks ready for warehouse action" icon={ListChecks} />
              <CardBody className="space-y-3">
                {WORKBENCH_TASKS.map(({ title, detail, action, to, icon: Icon }) => (
                  <div key={title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-600">
                      <Icon size={17} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">{detail}</p>
                    </div>
                    <Link to={to}>
                      <Button variant="secondary" size="sm">{action}</Button>
                    </Link>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <CardHeader title="Warehouse Staff Shortcuts" subtitle="Frequently used operational actions" icon={Boxes} />
              <CardBody className="grid gap-3 sm:grid-cols-2">
                <WarehouseStaffShortcut to="/app/warehouse/receive" icon={PackageCheck} label="Receive Goods" />
                <WarehouseStaffShortcut to="/app/warehouse/inventory" icon={Boxes} label="View Inventory" />
                <WarehouseStaffShortcut to="/app/warehouse/stock-count" icon={ScanLine} label="Conduct Stock Count" />
                <WarehouseStaffShortcut to="/app/warehouse/adjustments/new" icon={FilePenLine} label="Adjustment Request" />
              </CardBody>
            </Card>

            <Card className="min-w-0 xl:col-span-2">
              <CardHeader
                title="Request Status"
                subtitle="Latest manager decisions"
                icon={ClipboardList}
                action={
                  <Link to="/app/warehouse/approval-status">
                    <Button variant="ghost" size="sm" icon={ArrowRight}>View all</Button>
                  </Link>
                }
              />
              <CardBody className="p-0">
                <DataTable
                  className="rounded-none border-0 shadow-none"
                  dense
                  rows={requestRows}
                  rowKey="id"
                  onRowClick={() => navigate('/app/warehouse/approval-status')}
                  empty={{ title: 'No requests found', subtitle: 'There are no recent manager decisions.' }}
                  columns={[
                    { key: 'request', header: 'Request', render: (row) => <span className="font-mono text-xs font-semibold text-slate-700">{row.request}</span> },
                    { key: 'type', header: 'Type' },
                    {
                      key: 'decision',
                      header: 'Decision',
                      render: (row) => (
                        <Badge tone={row.decision === 'Approved' ? 'green' : row.decision === 'Rejected' ? 'red' : 'amber'} dot>
                          {row.decision}
                        </Badge>
                      ),
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

function WarehouseStaffShortcut({ to, icon: Icon, label }) {
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
