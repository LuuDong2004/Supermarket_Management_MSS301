import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, FilterBar } from '../../components/ui/PageHeader.jsx'
import { Button, Badge, StatusBadge, Field, Input, Select, Spinner } from '../../components/ui/primitives.jsx'
import { DataTable } from '../../components/ui/DataTable.jsx'
import { StatCard } from '../../components/ui/StatCard.jsx'
import { formatCurrency, formatNumber, formatDate } from '../../lib/format.js'
import {
  purchaseOrderService, supplierService,
  withFallback, toList, mockPurchaseOrders, mockSuppliers,
} from '../../services/index.js'
import { ClipboardList, Clock, CheckCircle2, DollarSign, Plus, Search, Eye } from 'lucide-react'

export default function PurchaseOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('backend')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [supplier, setSupplier] = useState('all')

  const load = async () => {
    setLoading(true)
    const [po, sup] = await Promise.all([
      withFallback(() => purchaseOrderService.list(), mockPurchaseOrders),
      withFallback(() => supplierService.list(), mockSuppliers),
    ])
    setOrders(toList(po.data))
    setSuppliers(toList(sup.data))
    setSource(po.source)
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (search && !(o.code || '').toLowerCase().includes(search.trim().toLowerCase())) return false
      if (status !== 'all' && o.status !== status) return false
      if (supplier !== 'all' && o.supplier !== supplier) return false
      return true
    })
  }, [orders, search, status, supplier])

  const pending = orders.filter((o) => o.status === 'Pending').length
  const approved = orders.filter((o) => o.status === 'Approved' || o.status === 'Received').length
  const totalValue = orders.reduce((s, o) => s + Number(o.total || 0), 0)

  return (
    <div>
      <PageHeader
        breadcrumb="Kho · 3.6.1"
        title="Đơn mua hàng"
        subtitle="Quản lý đơn đặt mua từ nhà cung cấp và theo dõi trạng thái duyệt."
        actions={
          <div className="flex items-center gap-3">
            <Button icon={Plus} onClick={() => navigate('/app/warehouse/purchase-orders/new')}>Tạo đơn mua</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng đơn mua" value={formatNumber(orders.length)} icon={ClipboardList} tone="brand" hint="trong kỳ" />
        <StatCard label="Chờ duyệt" value={formatNumber(pending)} icon={Clock} tone="amber" hint="cần xử lý" />
        <StatCard label="Đã duyệt" value={formatNumber(approved)} icon={CheckCircle2} tone="green" hint="đã thông qua" />
        <StatCard label="Tổng giá trị" value={formatCurrency(totalValue, { compact: true })} icon={DollarSign} tone="blue" hint="toàn bộ đơn" />
      </div>

      <div className="mt-6">
        <FilterBar>
          <Field label="Tìm kiếm" className="grow">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input className="pl-9" placeholder="Mã đơn mua..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </Field>
          <Field label="Trạng thái">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Approved">Đã duyệt</option>
              <option value="Received">Đã nhận</option>
              <option value="Rejected">Từ chối</option>
            </Select>
          </Field>
          <Field label="Nhà cung cấp">
            <Select value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <option value="all">Tất cả</option>
              {suppliers.map((s) => (
                <option key={s.id || s.code} value={s.name}>{s.name}</option>
              ))}
            </Select>
          </Field>
        </FilterBar>

        {loading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-16">
            <Spinner className="h-7 w-7" />
          </div>
        ) : (
          <DataTable
            rows={filtered}
            onRowClick={(r) => navigate(`/app/warehouse/purchase-orders/${r.id || r.code}`)}
            empty={{ title: 'Không có đơn mua', subtitle: 'Thử thay đổi bộ lọc hoặc tạo đơn mới.' }}
            columns={[
              { key: 'code', header: 'Mã đơn', render: (r) => <span className="font-mono text-xs">{r.code}</span> },
              { key: 'supplier', header: 'Nhà cung cấp' },
              { key: 'orderDate', header: 'Ngày', render: (r) => formatDate(r.orderDate) },
              { key: 'items', header: 'Số mặt hàng', align: 'center' },
              { key: 'total', header: 'Giá trị', align: 'right', render: (r) => <span className="font-semibold">{formatCurrency(r.total)}</span> },
              { key: 'status', header: 'Trạng thái', render: (r) => <StatusBadge status={r.status} /> },
              { key: 'approval', header: 'Duyệt', render: (r) => <StatusBadge status={r.approval} /> },
            ]}
            actions={(r) => (
              <Button size="sm" variant="secondary" icon={Eye} onClick={() => navigate(`/app/warehouse/purchase-orders/${r.id || r.code}`)}>Xem</Button>
            )}
          />
        )}
      </div>
    </div>
  )
}
